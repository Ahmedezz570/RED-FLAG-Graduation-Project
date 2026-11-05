import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { colors, space } from '@/theme/tokens';
import { AppText } from '@/ui/atoms/AppText';

import { LabeledField, type LabeledFieldProps } from './LabeledField';

type PasswordFieldProps = Omit<LabeledFieldProps, 'action' | 'secureTextEntry'>;

export function PasswordField(props: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <LabeledField
      autoCapitalize="none"
      autoCorrect={false}
      {...props}
      secureTextEntry={!visible}
      action={
        <Pressable
          accessibilityLabel={visible ? 'Hide password' : 'Show password'}
          accessibilityRole="button"
          onPress={() => setVisible(!visible)}
          style={styles.toggle}
        >
          <AppText variant="label" style={styles.label}>{visible ? 'Hide' : 'Show'}</AppText>
        </Pressable>
      }
    />
  );
}

const styles = StyleSheet.create({
  toggle: { minHeight: 44, minWidth: 44, justifyContent: 'center', paddingHorizontal: space.md },
  label: { color: colors.accent },
});
