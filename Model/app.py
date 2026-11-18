import os
import re
import time
import hashlib
import sqlite3
from typing import Optional
from datetime import datetime
from urllib.parse import urlparse
import joblib
import numpy as np
import torch
import torch.nn.functional as F
from fastapi import FastAPI, Security, HTTPException
from fastapi.security import APIKeyHeader
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForSequenceClassification

# 1. إعداد قفل الأمان (كلمة السر الخاصة بالسيرفر)
API_SECRET_KEY = os.getenv("REDFLAG_API_KEY", "YOUR_SECRET_KEY_HERE")
api_key_header = APIKeyHeader(name="X-API-Key", auto_error=True)


def verify_api_key(api_key: str = Security(api_key_header)):
    if api_key != API_SECRET_KEY:
        raise HTTPException(
            status_code=403, detail="غير مصرح بالدخول: مفتاح الأمان غير صحيح"
        )


app = FastAPI(
    title="RedFlag Mobile Threat Defense API", dependencies=[Security(verify_api_key)]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. تحميل الموديلات عند بدء التشغيل
TEXT_MODEL_PATH = "./egyptian_scam_model"
tokenizer = AutoTokenizer.from_pretrained(TEXT_MODEL_PATH)
text_model = AutoModelForSequenceClassification.from_pretrained(TEXT_MODEL_PATH)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
text_model.to(device)
text_model.eval()

url_model = joblib.load("url_model.joblib")

# 3. ذاكرة التخزين المؤقت (Cache) ودرع تتبع الأكواد (OTP Shield)
URL_CACHE = {}  # {url|source: dict_result}
MSG_CACHE = {}  # {hash_key: text_score}
RECENT_OTP_TIMESTAMPS = {}  # {user_id: timestamp}


# 4. قاعدة بيانات التصحيحات ("اعترضت غلط")
def init_db():
    conn = sqlite3.connect("feedback.db")
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS user_feedback (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            message_text TEXT NOT NULL,
            corrected_label INTEGER NOT NULL,
            created_at TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()


init_db()

# 5. القوائم البيضاء والكلمات الدلالية والامتدادات المشبوهة
URL_REGEX = re.compile(
    r"(https?://\S+|www\.\S+|\b[\w-]+\.(xyz|top|com|net|org|me|link|info|online|eg|co|ly|apk|site|icu|click|help|cfd|sbs|buzz|fun|live|pro|shop|store)\S*)",
    re.IGNORECASE,
)

OFFICIAL_DOMAINS = {
    "vodafone.com.eg",
    "orange.eg",
    "etisalat.eg",
    "te.eg",
    "mywe.te.eg",
    "instapay.eg",
    "nbe.com.eg",
    "cibeg.com",
    "banquemisr.com",
    "qnbalahli.com",
    "egyptpost.org",
    "bosta.co",
    "aramex.com",
    "amazon.eg",
    "noon.com",
    "fawry.com",
    "valu.com.eg",
    "digital.gov.eg",
    "google.com",
    "drive.google.com",
    "meet.google.com",
    "youtube.com",
    "youtu.be",
    "facebook.com",
    "whatsapp.com",
    "github.com",
    "forms.gle",
    "instagram.com",
    "fb.com",
    "fb.watch",
    "tiktok.com",
    "vm.tiktok.com",
    "x.com",
    "twitter.com",
    "play.google.com",
}

BRAND_KEYWORDS = [
    "vodafone",
    "v0dafone",
    "orange",
    "0range",
    "etisalat",
    "mywe",
    "instapay",
    "1nstapay",
    "nbe",
    "cib",
    "banquemisr",
    "misr",
    "egyptpost",
    "post",
    "bosta",
    "aramex",
    "dhl",
    "fedex",
    "tamween",
    "fawry",
    "valu",
    "pubg",
    "cairo",
]

SUSPICIOUS_TLDS = (
    ".xyz",
    ".top",
    ".club",
    ".online",
    ".site",
    ".icu",
    ".click",
    ".info",
    ".vip",
    ".tk",
    ".ml",
    ".ga",
    ".help",
    ".cfd",
    ".sbs",
    ".buzz",
    ".cyou",
    ".monster",
    ".rest",
    ".fun",
    ".live",
    ".pro",
    ".shop",
    ".store",
    ".pw",
    ".cc",
    ".ws",
)
SHORTENERS = {
    "bit.ly",
    "tinyurl.com",
    "t.co",
    "cutt.ly",
    "shorturl.at",
    "is.gd",
    "rb.gy",
}
SCAM_WORDS = [
    "verify",
    "update",
    "login",
    "secure",
    "gift",
    "win",
    "prize",
    "free",
    "claim",
    "pay",
    "fee",
    "customs",
    "track",
    "confirm",
    "bonus",
    "limit",
]
SCAREWARE_WORDS = [
    "virus",
    "infected",
    "cleaner",
    "clean-phone",
    "security-alert",
    "system-warning",
    "hacked",
    "antivirus",
    "boost-ram",
    "battery-saver",
    "update-chrome",
    "update-whatsapp",
]
AD_SPAM_KEYWORDS = [
    "kos",
    "sex",
    "xxx",
    "porn",
    "18+",
    "adult",
    "dating",
    "hot-girls",
    "1xbet",
    "melbet",
    "betway",
    "kora-live",
    "yalla-shoot",
    "egybest",
    "cima",
    "aflam",
    "ribh",
    "kasb",
]
HIGH_RISK_SOURCES = {
    "shareit",
    "sharit",
    "ad",
    "ads",
    "popup",
    "pop_up",
    "browser_redirect",
    "game",
}

# تعبيرات منتظمة للقواعد الهندسية
NOISE_NOTIFICATIONS_REGEX = re.compile(
    r"^(أعجب بـ|تفاعل بـ|أرسل صورة|رسالة صوتية|ملصق|liked a message|reacted|sent a photo|voice message|sticker)",
    re.IGNORECASE,
)
EGYPT_MOBILE_REGEX = re.compile(r"\b(?:\+?2)?01[0125]\d{8}\b")
OFFICIAL_ENTITIES_REGEX = re.compile(
    r"(البنك|بنك\s*مصر|الاهلي|سي\s*اي\s*بي|cib|nbe|فودافون\s*كاش|انستاباي|instapay|فوري|البريد\s*المصري|التموين|تكافل\s*وكرامه)",
    re.IGNORECASE,
)
IMPERSONATION_NAME_REGEX = re.compile(
    r"(بنك|الاهلي|مصر|فودافون|اورنج|اتصالات|انستاباي|فوري|جوائز|مسابق[ةه]|تموين|بريد|خدم[ةه]\s*عملاء|bank|vodafone|instapay)",
    re.IGNORECASE,
)
MONEY_REQUEST_REGEX = re.compile(
    r"("
    r"فلوس|رصيد|فودافون\s*كاش|انستا\s*باي|انستاباي|محفظ[ةه]|حساب\s*بنكي|رقم\s*حساب|فيزا|فوري|مصاريف|رسوم|غرام[ةه]|تبرع|سلف|استلف|"
    r"(?:حول|تحويل|ابعت|رجع|رد)\w*\s*(?:لي|لى|لنا|هم|ها|مبلغ|جنيه|بالغلط|بالخط[أا]|على\s*الرقم|على\s*رقمي)|"
    r"\b(?:flos|flous|raseed|vodafone\s*cash|instapay|7awel|eb3at\s*flos)\b"
    r")",
    re.IGNORECASE,
)
CLASSIC_EGYPT_SCAM_REGEX = re.compile(
    r"("
    r"(?:لقي|لقيت|لقينا|عثر|عثرنا|معايا|معانا|عندنا|بيع|نبيع|تصريف|نصرف|مشتري|حفر|استخراج)\w*\s*(?:على\s*|علي\s*)?(?:اثار|كنز|كنوز|مقبره|تماثيل|تمثال|ذهب|دهب|زئبق)|"
    r"(?:مقبره\s*فرعونيه|تمثال\s*(?:ذهب|دهب|فرعوني)|زئبق\s*احمر|فك\s*(?:رصد|السحر)|شيخ\s*روحاني|جلب\s*الحبيب|مضاعفه\s*الاموال|دولارات\s*مجمده)"
    r")",
    re.IGNORECASE,
)
PAYMENT_TARGET_REGEX = re.compile(
    r"(\b(?:\+?2)?01[0125]\d{8}\b|[\w\.\-]+@instapay)", re.IGNORECASE
)
URGENCY_REGEX = re.compile(
    r"(ضروري|بسرع[ةه]|دلوقتي|حالا|مزنوق|حادث[ةه]|مستشفي|مشكل[ةه]|فورا|urgent)",
    re.IGNORECASE,
)
OTP_ARRIVAL_REGEX = re.compile(
    r"(?=.*(?:كود|رمز|تفعيل|تحقق|otp|code|pin))(?=.*\b\d{4,6}\b)", re.IGNORECASE
)
OTP_FOLLOWUP_BAIT_REGEX = re.compile(
    r"(كود|رمز|ارقام|الرقم|رساله|بعتلك|وصلك|بالغلط|غلط|code|otp)", re.IGNORECASE
)


# 6. دوال التنظيف وفك التمويه
def deobfuscate_text(text: str) -> str:
    text = str(text).replace("ـ", "")
    text = re.sub(r"(?<=\b[ا-ي])\s+(?=[ا-ي]\b)", "", text)
    text = re.sub(r"\bانا(?=[ا-ي]{4,})", "انا ", text)
    text = re.sub(r"(.)\1{2,}", r"\1", text)
    return text


def normalize_arabic(text: str) -> str:
    text = deobfuscate_text(text)
    text = re.sub(r"[أإآ]", "ا", text)
    text = re.sub(r"ى", "ي", text)
    text = re.sub(r"ة", "ه", text)
    text = re.sub(r"[\u064B-\u065F\u0640]", "", text)
    return re.sub(r"\s+", " ", text).strip()


def preprocess_for_ai(text: str) -> str:
    text = deobfuscate_text(text)
    text = URL_REGEX.sub(" [URL] ", text)
    text = re.sub(r"(\+?2?01[0125]\d{8})", " [PHONE] ", text)
    text = re.sub(r"\b\d{3,}\b", " [NUM] ", text)
    text = re.sub(r"[أإآ]", "ا", text)
    text = re.sub(r"ى", "ي", text)
    text = re.sub(r"[\u064B-\u065F\u0640]", "", text)
    return re.sub(r"\s+", " ", text).strip()


# 7. محرك فحص الروابط السريع
def extract_url_features(url: str):
    u = str(url).strip().lower()
    if not u.startswith(("http://", "https://")):
        u = "http://" + u
    parsed = urlparse(u)
    domain = parsed.netloc.replace("www.", "")
    path = parsed.path

    is_official = (
        1
        if any(domain == d or domain.endswith("." + d) for d in OFFICIAL_DOMAINS)
        else 0
    )
    has_brand = 1 if any(b in domain or b in path for b in BRAND_KEYWORDS) else 0
    brand_spoof = 1 if (has_brand and not is_official) else 0

    return [
        len(u),
        domain.count("."),
        domain.count("-"),
        sum(c.isdigit() for c in domain),
        1 if "@" in u else 0,
        1 if re.match(r"^\d{1,3}(\.\d{1,3}){3}$", domain) else 0,
        1 if u.startswith("https://") else 0,
        1 if domain.endswith(SUSPICIOUS_TLDS) else 0,
        1 if domain in SHORTENERS else 0,
        brand_spoof,
        1 if any(w in u for w in SCAM_WORDS) else 0,
    ]


def evaluate_single_url(url: str, source_app: str = "browser") -> dict:
    clean_u = str(url).strip()
    src = str(source_app).strip().lower()
    cache_key = f"{clean_u}|{src}"
    if cache_key in URL_CACHE:
        return URL_CACHE[cache_key]

    u_low = clean_u.lower()
    if not u_low.startswith(("http://", "https://")):
        u_low = "http://" + u_low
    parsed = urlparse(u_low)
    domain = parsed.netloc.replace("www.", "")
    path = parsed.path

    if any(domain == d or domain.endswith("." + d) for d in OFFICIAL_DOMAINS):
        res = {
            "is_scam": False,
            "url_risk": 0.0,
            "reason": "رابط رسمي موثوق",
            "action": "SAFE",
        }
        URL_CACHE[cache_key] = res
        return res

    if path.endswith(".apk") or ".apk?" in u_low:
        res = {
            "is_scam": True,
            "url_risk": 99.0,
            "reason": "تحذير خطير: رابط يحاول تحميل تطبيق خارجي (.apk) قد يسرق بيانات الهاتف",
            "action": "RED_FLAG_ALERT",
        }
        URL_CACHE[cache_key] = res
        return res

    if domain.startswith("xn--"):
        res = {
            "is_scam": True,
            "url_risk": 96.0,
            "reason": "تحذير: رابط مموه بحروف مزيفة لانتحال موقع رسمي",
            "action": "RED_FLAG_ALERT",
        }
        URL_CACHE[cache_key] = res
        return res

    if any(w in u_low for w in SCAREWARE_WORDS):
        res = {
            "is_scam": True,
            "url_risk": 95.0,
            "reason": "إعلان مضلل يدّعي وجود فيروسات أو تحديث وهمي لخداعك",
            "action": "RED_FLAG_ALERT",
        }
        URL_CACHE[cache_key] = res
        return res

    if any(w in u_low for w in AD_SPAM_KEYWORDS):
        res = {
            "is_scam": True,
            "url_risk": 94.0,
            "reason": "موقع إعلاني غير آمن أو محتوى مضلل قد يسرق بياناتك",
            "action": "RED_FLAG_ALERT",
        }
        URL_CACHE[cache_key] = res
        return res

    feats = extract_url_features(clean_u)
    rf_prob = float(url_model.predict_proba(np.array([feats]))[0][1])

    has_ip, susp_tld, brand_spoof = feats[5], feats[7], feats[9]
    is_ad_source = any(s in src for s in HIGH_RISK_SOURCES)

    if brand_spoof == 1 or has_ip == 1:
        rf_prob = max(rf_prob, 0.95)
        reason = "رابط ينتحل اسم بنك أو شركة معروفة"
    elif susp_tld == 1:
        rf_prob = max(rf_prob, 0.88)
        reason = "رابط ذو نطاق رخيص ومشبوه يُستخدم بكثرة في الإعلانات المضللة والاحتيال"
    elif is_ad_source and rf_prob >= 0.35:
        rf_prob = max(rf_prob, 0.85)
        reason = "إعلان منبثق غير موثوق من تطبيق خارجي"
    elif rf_prob >= 0.75:
        reason = "رابط احتيالي مشبوه"
    else:
        reason = "رابط طبيعي"

    is_malicious = bool(rf_prob >= 0.75)
    res = {
        "is_scam": is_malicious,
        "url_risk": round(rf_prob * 100, 1),
        "reason": reason,
        "action": "RED_FLAG_ALERT" if is_malicious else "SAFE",
    }
    URL_CACHE[cache_key] = res
    return res


# 8. نماذج الطلبات المستقبلة من التطبيق
class UrlCheckRequest(BaseModel):
    url: str
    source_app: str = "browser"


class MessageRequest(BaseModel):
    text: str
    app_source: str = "unknown"
    sender_title: str = ""
    is_known_contact: Optional[bool] = None
    user_id: str = "default_user"


class FeedbackRequest(BaseModel):
    text: str
    is_actually_scam: bool = False


def resolve_known_contact(sender_title: str, explicit_known: Optional[bool]) -> bool:
    if explicit_known is not None:
        return explicit_known
    cleaned_sender = re.sub(r"[\s\-\(\)]", "", str(sender_title))
    if re.match(r"^(\+?2)?01[0125]\d{8}$", cleaned_sender):
        return False
    return bool(cleaned_sender)


# Endpoint 1: فحص الروابط السريع
@app.post("/check-url")
def check_url_endpoint(req: UrlCheckRequest):
    result = evaluate_single_url(req.url, req.source_app)
    return {"url": req.url, "source_app": req.source_app, **result}


# Endpoint 2: الفحص الشامل للإشعارات والرسائل
@app.post("/predict")
def predict_message(req: MessageRequest):
    raw_text = req.text
    app_src = req.app_source.lower()
    sender_title = str(req.sender_title).strip()
    is_known = resolve_known_contact(sender_title, req.is_known_contact)
    clean_norm = normalize_arabic(raw_text)
    urls_found = [m.group(0) for m in URL_REGEX.finditer(raw_text)]
    now = time.time()

    # الطبقة 1: بوابة عدم الإزعاج
    if NOISE_NOTIFICATIONS_REGEX.search(raw_text.strip()):
        return {
            "is_scam": False,
            "confidence": 0.0,
            "reason": "إشعار تفاعل عادي",
            "action": "SAFE",
        }

    if (
        len(clean_norm.split()) < 3
        and not urls_found
        and not re.search(r"\d{4,}", raw_text)
    ):
        return {
            "is_scam": False,
            "confidence": 0.0,
            "reason": "محادثة قصيرة طبيعية",
            "action": "SAFE",
        }

    # الطبقة 2: درع أكواد التفعيل العابر للتطبيقات
    if "sms" in app_src or "messaging" in app_src:
        if OTP_ARRIVAL_REGEX.search(clean_norm):
            RECENT_OTP_TIMESTAMPS[req.user_id] = now

    last_otp_time = RECENT_OTP_TIMESTAMPS.get(req.user_id, 0)
    if (now - last_otp_time) <= 180 and any(
        s in app_src for s in ["whatsapp", "messenger", "orca", "instagram", "telegram"]
    ):
        if not is_known and OTP_FOLLOWUP_BAIT_REGEX.search(clean_norm):
            return {
                "is_scam": True,
                "confidence": 99.5,
                "reason": "تحذير خطير: وصلك كود تفعيل سري منذ لحظات، وهذا الحساب يحاول سرقته!",
                "detected_urls": urls_found,
                "action": "RED_FLAG_ALERT",
            }

    # الطبقة 3: فحص الروابط داخل الرسالة
    max_url_risk = 0.0
    url_reason = ""
    if urls_found:
        for u in urls_found:
            u_res = evaluate_single_url(u, req.app_source)
            if u_res["url_risk"] > max_url_risk:
                max_url_risk = u_res["url_risk"]
                url_reason = u_res["reason"]
        if max_url_risk >= 75.0:
            return {
                "is_scam": True,
                "confidence": max_url_risk,
                "reason": url_reason,
                "url_risk": max_url_risk,
                "detected_urls": urls_found,
                "action": "RED_FLAG_ALERT",
            }

    # الطبقة 4: التوجيه الذكي حسب التطبيق والقواعد المصرية
    if not is_known and CLASSIC_EGYPT_SCAM_REGEX.search(clean_norm):
        return {
            "is_scam": True,
            "confidence": 97.0,
            "reason": "تحذير: أسلوب نصب مصري شائع (ادعاء العثور على آثار أو كنوز أو أموال مجمدة)",
            "detected_urls": urls_found,
            "action": "RED_FLAG_ALERT",
        }

    if "sms" in app_src or "messaging" in app_src or app_src == "unknown":
        sender_is_mobile = bool(
            EGYPT_MOBILE_REGEX.match(re.sub(r"[\s\-]", "", sender_title))
        )
        body_has_mobile = bool(EGYPT_MOBILE_REGEX.search(clean_norm))
        mentions_entity = bool(OFFICIAL_ENTITIES_REGEX.search(clean_norm))

        if sender_is_mobile and mentions_entity:
            return {
                "is_scam": True,
                "confidence": 99.0,
                "reason": "انتحال صفة بنك أو جهة رسمية من رقم موبايل شخصي",
                "action": "RED_FLAG_ALERT",
            }
        if mentions_entity and body_has_mobile and not is_known:
            return {
                "is_scam": True,
                "confidence": 96.0,
                "reason": "رسالة تدّعي أنها جهة رسمية وتضع رقم موبايل شخصي للتواصل",
                "action": "RED_FLAG_ALERT",
            }

    if any(s in app_src for s in ["whatsapp", "sms", "messaging", "unknown"]):
        if not is_known and MONEY_REQUEST_REGEX.search(clean_norm):
            return {
                "is_scam": True,
                "confidence": 93.0,
                "reason": "رقم غير مسجل يطلب تحويل أموال أو رصيد",
                "detected_urls": urls_found,
                "action": "RED_FLAG_ALERT",
            }

    if any(s in app_src for s in ["messenger", "orca", "instagram", "telegram"]):
        if IMPERSONATION_NAME_REGEX.search(sender_title):
            return {
                "is_scam": True,
                "confidence": 99.0,
                "reason": "البنوك والجهات الرسمية لا تتواصل عبر ماسنجر أو إنستغرام",
                "action": "RED_FLAG_ALERT",
            }

        if MONEY_REQUEST_REGEX.search(clean_norm) and PAYMENT_TARGET_REGEX.search(
            raw_text
        ):
            return {
                "is_scam": True,
                "confidence": 96.0,
                "reason": "تحذير: طلب تحويل أموال لحساب خارجي عبر السوشيال ميديا (تأكد هاتفياً من صديقك لاحتمال سرقة حسابه)",
                "action": "RED_FLAG_ALERT",
            }

        if MONEY_REQUEST_REGEX.search(clean_norm) and URGENCY_REGEX.search(clean_norm):
            return {
                "is_scam": True,
                "confidence": 90.0,
                "reason": "طلب أموال باستعجال عبر السوشيال ميديا",
                "action": "RED_FLAG_ALERT",
            }

    # الطبقة 5: موديل الذكاء الاصطناعي العميق (MARBERTv2) + الذاكرة المؤقتة
    ai_input = preprocess_for_ai(raw_text)
    msg_hash = hashlib.md5(ai_input.encode("utf-8")).hexdigest()

    if msg_hash in MSG_CACHE:
        text_score = MSG_CACHE[msg_hash]
    else:
        inputs = tokenizer(
            ai_input, return_tensors="pt", truncation=True, max_length=128
        ).to(device)
        with torch.no_grad():
            probs = F.softmax(text_model(**inputs).logits, dim=-1).cpu().numpy()[0]
        text_score = float(probs[1])
        MSG_CACHE[msg_hash] = text_score

    final_score = max(text_score, max_url_risk / 100.0)
    threshold = 0.95 if is_known else 0.75
    is_scam = bool(final_score >= threshold)

    return {
        "is_scam": is_scam,
        "confidence": round(final_score * 100, 1),
        "reason": "أسلوب احتيال أو هندسة اجتماعية" if is_scam else "رسالة طبيعية",
        "text_risk": round(text_score * 100, 1),
        "url_risk": max_url_risk,
        "detected_urls": urls_found,
        "action": "RED_FLAG_ALERT" if is_scam else "SAFE",
    }


# Endpoint 3: تسجيل تصحيح المستخدم ("اعترضت غلط")
@app.post("/feedback")
def submit_feedback(fb: FeedbackRequest):
    anonymized_text = preprocess_for_ai(fb.text)
    label = 1 if fb.is_actually_scam else 0

    conn = sqlite3.connect("feedback.db")
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO user_feedback (message_text, corrected_label, created_at) VALUES (?, ?, ?)",
        (anonymized_text, label, datetime.utcnow().isoformat()),
    )
    conn.commit()
    count = cursor.execute("SELECT COUNT(*) FROM user_feedback").fetchone()[0]
    conn.close()

    return {
        "status": "saved",
        "message": "تم تسجيل التصحيح وإضافته لقائمة التحديث القادمة",
        "pending_corrections": count,
    }
