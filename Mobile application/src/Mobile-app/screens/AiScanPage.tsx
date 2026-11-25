import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Logo } from '../components/atoms';
import { ScanForm } from '../components/organisms/ScanForm';
import { mockScan } from '../features/scan/mockScan';
import { colors, space } from '../styles/tokens';
import type { ScanMode, ScanRequest } from '../types/types';

interface AiScanPageProps {
  scan?: ScanRequest;
  initialMode?: ScanMode;
}

export const AiScanPage = ({ scan, initialMode }: AiScanPageProps) => (
  <KeyboardAvoidingView
    style={styles.screen}
    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
  >
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.inner}>
        <View style={styles.header}>
          <Logo size={52} />
          <View style={styles.heading}>
            <Text accessibilityRole="header" style={styles.title}>AI Scan</Text>
            <Text style={styles.description}>Check a message or link for signs of a scam.</Text>
          </View>
        </View>
        {!scan && <Text style={styles.description}>Demo mode shows sample results.</Text>}
        <ScanForm scan={scan ?? mockScan} isDemo={!scan} initialMode={initialMode} />
      </View>
    </ScrollView>
  </KeyboardAvoidingView>
);

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { alignItems: 'center', paddingHorizontal: space.s3, paddingVertical: space.s4 },
  inner: { width: '100%', maxWidth: 440, gap: space.s3 },
  header: { flexDirection: 'row', alignItems: 'center', gap: space.s2 },
  heading: { flex: 1, gap: 4 },
  title: { color: colors.text, fontSize: 28, fontWeight: '700' },
  description: { color: colors.muted, fontSize: 15, lineHeight: 22 },
});
