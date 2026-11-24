import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius, space } from '../../styles/tokens';
import type { ButtonProps } from '../../types/types';

export const Button = ({ title, onPress, variant = 'primary', disabled }: ButtonProps) => {
  const isLink = variant === 'link';
  const isOutline = variant === 'outline';
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        isLink ? styles.link : styles.base,
        variant === 'primary' && styles.primary,
        variant === 'primary' && pressed && styles.primaryPressed,
        isOutline && styles.outline,
        isOutline && pressed && styles.outlinePressed,
        disabled && styles.disabled,
      ]}
    >
      <Text style={[styles.text, isOutline && styles.outlineText, isLink && styles.linkText]}>
        {title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.s3,
  },
  primary: { borderRadius: 28, backgroundColor: colors.primary },
  primaryPressed: { backgroundColor: colors.primaryHover },
  outline: {
    borderRadius: radius,
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: 'transparent',
  },
  outlinePressed: { backgroundColor: colors.border },
  disabled: { opacity: 0.5 },
  text: { color: colors.onPrimary, fontSize: 17, fontWeight: '700' },
  outlineText: { color: colors.primary },
  link: { paddingVertical: 4 },
  linkText: { color: colors.primary, fontSize: 14, fontWeight: '600' },
});