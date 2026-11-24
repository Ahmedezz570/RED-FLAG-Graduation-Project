import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Logo } from '../atoms';
import { colors, space } from '../../styles/tokens';
import type { AuthTemplateProps } from '../../types/types';

export const AuthTemplate = ({ title, subtitle, children }: AuthTemplateProps) => (
  <KeyboardAvoidingView
    style={styles.root}
    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
  >
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.inner}>
        <Logo size={72} />
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <View style={styles.body}>{children}</View>
      </View>
    </ScrollView>
  </KeyboardAvoidingView>
);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: space.s4,
    paddingHorizontal: space.s3,
  },
  inner: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    gap: space.s3,
  },
  header: { alignItems: 'center', gap: 4 },
  title: { fontSize: 28, fontWeight: '700', color: colors.text, textAlign: 'center' },
  subtitle: { fontSize: 15, lineHeight: 22, color: colors.muted, textAlign: 'center' },
  body: { width: '100%' },
});