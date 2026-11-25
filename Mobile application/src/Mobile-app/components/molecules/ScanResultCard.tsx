import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, space } from '../../styles/tokens';
import type { ScanResult } from '../../types/types';

interface ScanResultCardProps {
  result: ScanResult;
  isDemo: boolean;
}

export const ScanResultCard = ({ result, isDemo }: ScanResultCardProps) => (
  <View accessibilityLiveRegion="polite" style={styles.card}>
    <Text style={styles.label}>{isDemo ? 'Sample result' : 'Scan result'}</Text>
    <Text
      accessibilityRole="header"
      style={[styles.title, result.verdict === 'caution' && styles.caution]}
    >
      {result.verdict === 'caution' ? 'Likely scam' : 'No obvious red flags'}
    </Text>
    <Text style={styles.body}>{result.reason}</Text>
    <Text style={styles.label}>What to do next</Text>
    <Text style={styles.body}>{result.nextStep}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: { gap: space.s1, padding: space.s2, borderWidth: 1, borderColor: colors.border, borderRadius: radius },
  label: { fontSize: 14, fontWeight: '700', color: colors.muted },
  title: { fontSize: 22, fontWeight: '700', color: colors.primary },
  caution: { color: colors.error },
  body: { fontSize: 15, lineHeight: 22, color: colors.text },
});
