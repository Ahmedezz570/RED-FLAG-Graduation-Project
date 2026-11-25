import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Logo } from '../atoms';
import { colors, space } from '../../styles/tokens';

interface ContentTemplateProps {
  title: string;
  description: string;
  children: ReactNode;
}

export const ContentTemplate = ({ title, description, children }: ContentTemplateProps) => (
  <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
    <View style={styles.inner}>
      <View style={styles.header}>
        <Logo size={52} />
        <View style={styles.heading}>
          <Text accessibilityRole="header" style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>
      {children}
    </View>
  </ScrollView>
);

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { alignItems: 'center', paddingHorizontal: space.s3, paddingVertical: space.s4 },
  inner: { width: '100%', maxWidth: 440, gap: space.s3 },
  header: { flexDirection: 'row', alignItems: 'center', gap: space.s2 },
  heading: { flex: 1, gap: 4 },
  title: { color: colors.text, fontSize: 28, fontWeight: '700' },
  description: { color: colors.muted, fontSize: 15, lineHeight: 22 },
});
