import { useRef, useState } from 'react';
import { Keyboard, StyleSheet, Text, View } from 'react-native';
import { colors, radius, space } from '../../styles/tokens';
import type { ScanMode, ScanRequest, ScanResult } from '../../types/types';
import { Button } from '../atoms';
import { FormField } from '../molecules';
import { ScanModeTabs } from '../molecules/ScanModeTabs';
import { ScanResultCard } from '../molecules/ScanResultCard';

type ScanStatus =
  | { kind: 'idle' | 'loading' }
  | { kind: 'invalid' | 'failed'; message: string }
  | { kind: 'complete'; result: ScanResult };

interface ScanDraft {
  input: string;
  status: ScanStatus;
}

interface ScanFormProps {
  scan: ScanRequest;
  isDemo: boolean;
  initialMode?: ScanMode;
}

const emptyDraft: ScanDraft = { input: '', status: { kind: 'idle' } };

function validate(mode: ScanMode, input: string): string | undefined {
  if (mode === 'message') return input ? undefined : 'Paste a message to scan.';

  const authority = /^https?:\/\/([^/?#]+)/i.exec(input)?.[1];
  if (!authority || /[@\\\s]/.test(authority)) {
    return 'Enter a full link starting with https:// or http://.';
  }

  try {
    if (new URL(input).hostname) return undefined;
  } catch {
    // Show the same field error whenever the link cannot be scanned.
  }
  return 'Enter a full link starting with https:// or http://.';
}

export const ScanForm = ({ scan, isDemo, initialMode = 'message' }: ScanFormProps) => {
  const [mode, setMode] = useState<ScanMode>(initialMode);
  const [drafts, setDrafts] = useState<Record<ScanMode, ScanDraft>>({
    message: emptyDraft,
    link: emptyDraft,
  });
  const pending = useRef(new Set<ScanMode>());
  const { input, status } = drafts[mode];
  const isMessage = mode === 'message';
  const isLoading = status.kind === 'loading';

  const setStatus = (target: ScanMode, nextStatus: ScanStatus) => {
    setDrafts((current) => ({ ...current, [target]: { ...current[target], status: nextStatus } }));
  };

  const submit = async () => {
    if (pending.current.has(mode)) return;
    const value = input.trim();
    const error = validate(mode, value);
    if (error) {
      setStatus(mode, { kind: 'invalid', message: error });
      return;
    }

    pending.current.add(mode);
    setStatus(mode, { kind: 'loading' });
    Keyboard.dismiss();
    try {
      const result = await scan(mode, value);
      setStatus(mode, { kind: 'complete', result });
    } catch {
      setStatus(mode, { kind: 'failed', message: 'The scan could not finish. Please try again.' });
    } finally {
      pending.current.delete(mode);
    }
  };

  return (
    <View style={styles.form}>
      <ScanModeTabs mode={mode} onChange={setMode} />
      <Text style={styles.label}>{isMessage ? 'Message to scan' : 'Link to scan'}</Text>
      <FormField
        key={mode}
        label={isMessage ? 'Message to scan' : 'Link to scan'}
        placeholder={isMessage ? 'Paste a suspicious message' : 'https://example.com'}
        value={input}
        onChangeText={(value) => {
          if (pending.current.has(mode)) return;
          setDrafts((current) => ({ ...current, [mode]: { input: value, status: { kind: 'idle' } } }));
        }}
        error={status.kind === 'invalid' ? status.message : undefined}
        editable={!isLoading}
        multiline={isMessage}
        keyboardType={isMessage ? 'default' : 'url'}
        autoCapitalize="none"
        autoCorrect={false}
        style={isMessage ? styles.messageInput : undefined}
      />
      <Button title={isLoading ? 'Scanning…' : 'Scan now'} disabled={isLoading} onPress={submit} />
      {status.kind === 'failed' && (
        <Text accessibilityRole="alert" style={styles.error}>{status.message}</Text>
      )}
      {status.kind === 'complete' && <ScanResultCard result={status.result} isDemo={isDemo} />}
    </View>
  );
};

const styles = StyleSheet.create({
  form: { gap: space.s2 },
  label: { fontSize: 15, fontWeight: '700', color: colors.text },
  messageInput: {
    height: 132,
    borderRadius: radius,
    textAlignVertical: 'top',
    paddingHorizontal: space.s2,
    paddingVertical: space.s2,
  },
  error: { color: colors.error, fontSize: 14 },
});
