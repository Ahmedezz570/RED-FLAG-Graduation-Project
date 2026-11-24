import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../atoms';
import { FormField } from '../molecules';
import { colors, space } from '../../styles/tokens';
import type { FormErrors, LoginFormProps, LoginValues } from '../../types/types';

const validate = (v: LoginValues): FormErrors<LoginValues> => {
  const errors: FormErrors<LoginValues> = {};
  if (!/^\S+@\S+\.\S+$/.test(v.email)) errors.email = 'Enter a valid email address';
  if (v.password.length < 6) errors.password = 'Password must be at least 6 characters';
  return errors;
};

export const LoginForm = ({ onSubmit, onGoToRegister }: LoginFormProps) => {
  const [values, setValues] = useState<LoginValues>({ email: '', password: '' });
  const [errors, setErrors] = useState<FormErrors<LoginValues>>({});

  const set = (key: keyof LoginValues) => (text: string) =>
    setValues((prev) => ({ ...prev, [key]: text }));

  const handleSubmit = () => {
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length === 0) onSubmit(values);
  };

  return (
    <View style={styles.form}>
      <FormField
        label="Email"
        placeholder="name@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        value={values.email}
        onChangeText={set('email')}
        error={errors.email}
      />
      <FormField
        label="Password"
        placeholder="Your password"
        secureTextEntry
        autoCapitalize="none"
        autoComplete="current-password"
        value={values.password}
        onChangeText={set('password')}
        error={errors.password}
      />
      <Button title="Log in" onPress={handleSubmit} />
      <View style={styles.switchRow}>
        <Text style={styles.switchText}>New here?</Text>
        <Button title="Create an account" variant="link" onPress={onGoToRegister} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  form: { gap: space.s2 },
  switchRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 },
  switchText: { fontSize: 14, color: colors.muted },
});