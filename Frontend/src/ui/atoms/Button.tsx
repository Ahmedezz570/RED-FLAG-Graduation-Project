import { Pressable, StyleSheet } from 'react-native';

import { colors, radius, space } from '@/theme/tokens';

import { AppText } from './AppText';

type ButtonProps = {
  label: string;
  onPress: () => void;
  busy?: boolean;
};

export function Button({ label, onPress, busy = false }: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ busy, disabled: busy }}
      disabled={busy}
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed, busy && styles.busy]}
    >
      <AppText variant="label" style={styles.label}>{label}</AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
    padding: space.md,
    backgroundColor: colors.accent,
    borderRadius: radius.field,
  },
  pressed: { backgroundColor: colors.accentPressed },
  busy: { opacity: 0.75 },
  label: { color: colors.accentText, fontSize: 16, textAlign: 'center' },
});
