import { useRef, useState } from 'react';
import { StyleSheet, View, type TextInput } from 'react-native';

import type { Credentials } from '@/features/auth/contract';
import { colors, space } from '@/theme/tokens';
import { AppText } from '@/ui/atoms/AppText';
import { Button } from '@/ui/atoms/Button';
import { LabeledField } from '@/ui/molecules/LabeledField';
import { PasswordField } from '@/ui/molecules/PasswordField';

type LoginFormProps = {
  error: string | null;
  submitting: boolean;
  onEdit: () => void;
  onSubmit: (credentials: Credentials) => void;
};

export function LoginForm({ error, submitting, onEdit, onSubmit }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [attempted, setAttempted] = useState(false);
  const passwordInput = useRef<TextInput>(null);
  const trimmedEmail = email.trim();
  const emailError = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)
    ? undefined
    : 'Enter a valid email address.';
  const passwordError = password.length === 0 ? 'Enter your password.' : undefined;

  function submit() {
    setAttempted(true);
    if (!submitting && !emailError && !passwordError) {
      onSubmit({ email: trimmedEmail, password });
    }
  }

  return (
    <View style={styles.form}>
      <LabeledField
        label="Email address"
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        editable={!submitting}
        keyboardType="email-address"
        placeholder="you@example.com"
        returnKeyType="next"
        submitBehavior="submit"
        value={email}
        error={attempted ? emailError : undefined}
        onChangeText={(value) => {
          setEmail(value);
          onEdit();
        }}
        onSubmitEditing={() => passwordInput.current?.focus()}
      />
      <PasswordField
        ref={passwordInput}
        label="Password"
        autoComplete="current-password"
        editable={!submitting}
        placeholder="Enter your password"
        returnKeyType="go"
        value={password}
        error={attempted ? passwordError : undefined}
        onChangeText={(value) => {
          setPassword(value);
          onEdit();
        }}
        onSubmitEditing={submit}
      />
      {error && (
        <AppText accessibilityRole="alert" accessibilityLiveRegion="polite" style={styles.error}>
          {error}
        </AppText>
      )}
      <Button busy={submitting} label={submitting ? 'Signing in…' : 'Sign in'} onPress={submit} />
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: space.lg },
  error: { color: colors.error, fontSize: 14, lineHeight: 20 },
});
