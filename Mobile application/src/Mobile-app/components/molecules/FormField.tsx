import { StyleSheet, Text, View } from 'react-native';
import { Input } from '../atoms';
import { colors } from '../../styles/tokens';
import type { FormFieldProps } from '../../types/types';

export const FormField = ({ label, error, placeholder, ...inputProps }: FormFieldProps) => (
  <View style={styles.field}>
    <Input
      hasError={Boolean(error)}
      accessibilityLabel={label}
      placeholder={placeholder ?? label}
      {...inputProps}
    />
    {error ? <Text style={styles.error}>{error}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  field: { gap: 6 },
  error: { fontSize: 13, color: colors.error, paddingHorizontal: 22 },
});