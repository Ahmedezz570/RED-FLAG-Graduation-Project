import { StyleSheet, Text, View } from 'react-native';
import { ScanAction } from '../components/molecules/ScanAction';
import { ContentTemplate } from '../components/templates/ContentTemplate';
import { colors, radius, space } from '../styles/tokens';
import type { HomePageProps } from '../types/types';

export const HomePage = ({ onScan }: HomePageProps) => (
  <ContentTemplate title="RED FLAG" description="Check for signs of online scams.">
    <View style={styles.intro}>
      <Text accessibilityRole="header" style={styles.title}>Something look suspicious?</Text>
      <Text style={styles.body}>Check it before you click a link, reply, or share personal information.</Text>
    </View>
    <View style={styles.actions}>
      <ScanAction
        title="Check a link"
        description="Paste a URL to look for signs of a suspicious site."
        onPress={() => onScan('link')}
      />
      <ScanAction
        title="Check a message"
        description="Paste the text of a message you received."
        onPress={() => onScan('message')}
      />
    </View>
  </ContentTemplate>
);

const styles = StyleSheet.create({
  intro: { gap: space.s1, padding: space.s3, backgroundColor: colors.primary, borderRadius: radius },
  title: { color: colors.onPrimary, fontSize: 24, lineHeight: 30, fontWeight: '700' },
  body: { color: colors.onPrimary, fontSize: 15, lineHeight: 22 },
  actions: { gap: space.s2 },
});
