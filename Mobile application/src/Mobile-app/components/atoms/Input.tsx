import { StyleSheet, TextInput } from 'react-native';
import { colors } from '../../styles/tokens';
import type { InputProps } from '../../types/types';

export const Input = ({ hasError, style, ...rest }: InputProps) => (
  <TextInput
    placeholderTextColor={colors.muted}
    style={[styles.input, hasError && styles.error, style]}
    {...rest}
  />
);

const styles = StyleSheet.create({
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 28,
    paddingHorizontal: 22,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.background,
  },
  error: { borderColor: colors.error },
});