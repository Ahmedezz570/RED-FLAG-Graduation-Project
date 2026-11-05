import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, radius, space } from '@/theme/tokens';
import { AppText } from '@/ui/atoms/AppText';
import { Input, type InputProps } from '@/ui/atoms/Input';

export type LabeledFieldProps = InputProps & {
  label: string;
  error?: string;
  action?: ReactNode;
};

export function LabeledField({ label, error, action, ...inputProps }: LabeledFieldProps) {
  return (
    <View style={styles.field}>
      <AppText variant="label">{label}</AppText>
      <View style={[styles.inputRow, error && styles.invalid]}>
        <Input accessibilityLabel={label} {...inputProps} />
        {action}
      </View>
      {error && <AppText accessibilityLiveRegion="polite" style={styles.error}>{error}</AppText>}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: space.sm },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.field,
    backgroundColor: colors.surface,
  },
  invalid: { borderColor: colors.error },
  error: { color: colors.error, fontSize: 14, lineHeight: 20 },
});
