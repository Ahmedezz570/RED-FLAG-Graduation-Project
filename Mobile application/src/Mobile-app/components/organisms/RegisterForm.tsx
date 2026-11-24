import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../atoms';
import { FormField } from '../molecules';
import { colors, space } from '../../styles/tokens';
import type { FormErrors, RegisterFormProps, RegisterValues } from '../../types/types';

const validate = (v: RegisterValues): FormErrors<RegisterValues> => {
  const errors: FormErrors<RegisterValues> = {};
  if (v.fullName.trim().length < 2) errors.fullName = 'Enter your full name';
  if (!/^\S+@\S+\.\S+$/.test(v.email)) errors.email = 'Enter a valid email address';
  if (v.password.length < 6) errors.password = 'Password must be at least 6 characters';
  if (v.confirmPassword !== v.password) errors.confirmPassword = 'Passwords do not match';
  return errors;
};

export const RegisterForm = ({ onSubmit, onGoToLogin }: RegisterFormProps) => {
  const [values, setValues] = useState<RegisterValues>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors<RegisterValues>>({});

  const set = (key: keyof RegisterValues) => (text: string) =>
    setValues((prev) => ({ ...prev, [key]: text }));

  const handleSubmit = () => {
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length === 0) onSubmit(values);
  };

  return (
    <View style={styles.form}>
      <FormField
        label="Full name"
        placeholder="Your name"
        autoComplete="name"
        value={values.fullName}
        onChangeText={set('fullName')}
        error={errors.fullName}
      />
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
        placeholder="At least 6 characters"
        secureTextEntry
        autoCapitalize="none"
        value={values.password}
        onChangeText={set('password')}
        error={errors.password}
      />
      <FormField
        label="Confirm password"
        placeholder="Repeat your password"
        secureTextEntry
        autoCapitalize="none"
        value={values.confirmPassword}
        onChangeText={set('confirmPassword')}
        error={errors.confirmPassword}
      />
      <Button title="Create account" onPress={handleSubmit} />
      <View style={styles.switchRow}>
        <Text style={styles.switchText}>Already have an account?</Text>
        <Button title="Log in" variant="link" onPress={onGoToLogin} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  form: { gap: space.s2 },
  switchRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 },
  switchText: { fontSize: 14, color: colors.muted },
});