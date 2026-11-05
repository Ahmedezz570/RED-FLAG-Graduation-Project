import type { ComponentPropsWithRef } from 'react';
import { StyleSheet, TextInput } from 'react-native';

import { colors, space } from '@/theme/tokens';

export type InputProps = ComponentPropsWithRef<typeof TextInput>;

export function Input({ style, ...props }: InputProps) {
  return <TextInput placeholderTextColor={colors.placeholder} {...props} style={[styles.input, style]} />;
}

const styles = StyleSheet.create({
  input: {
    color: colors.text,
    fontSize: 16,
    minHeight: 52,
    minWidth: 0,
    flex: 1,
    paddingHorizontal: space.lg,
    paddingVertical: space.sm,
  },
});
