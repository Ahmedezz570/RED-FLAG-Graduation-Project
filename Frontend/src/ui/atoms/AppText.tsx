import { StyleSheet, Text, type TextProps } from 'react-native';

import { colors } from '@/theme/tokens';

type AppTextProps = TextProps & { variant?: 'body' | 'heading' | 'label' };

export function AppText({ variant = 'body', style, ...props }: AppTextProps) {
  return <Text {...props} style={[styles[variant], style]} />;
}

const styles = StyleSheet.create({
  body: { color: colors.muted, fontSize: 16, lineHeight: 24 },
  heading: { color: colors.text, fontSize: 38, lineHeight: 46, fontWeight: '700', letterSpacing: -1.4 },
  label: { color: colors.text, fontSize: 14, lineHeight: 20, fontWeight: '600' },
});
