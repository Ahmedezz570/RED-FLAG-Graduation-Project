import type { PropsWithChildren } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, space } from '@/theme/tokens';
import { AppText } from '@/ui/atoms/AppText';

type AuthTemplateProps = PropsWithChildren<{ title: string; description: string }>;
const flag = require('../../../assets/flag.png');

export function AuthTemplate({ children, title, description }: AuthTemplateProps) {
  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboard}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <View style={styles.brand}>
              <Image accessible={false} source={flag} style={styles.mark} />
              <AppText variant="label" style={styles.brandName}>RED FLAG</AppText>
            </View>
            <View style={styles.heading}>
              <AppText accessibilityRole="header" variant="heading">{title}</AppText>
              <AppText>{description}</AppText>
            </View>
            {children}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  keyboard: { flex: 1 },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: space.xl,
    paddingVertical: space.section,
  },
  content: { width: '100%', maxWidth: 400, gap: space.xl },
  brand: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  mark: { width: 48, height: 48, marginLeft: -6 },
  brandName: { color: colors.accent, letterSpacing: 2.2, fontWeight: '700' },
  heading: { gap: space.sm },
});
