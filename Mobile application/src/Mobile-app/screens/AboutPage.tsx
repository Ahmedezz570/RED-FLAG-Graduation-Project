import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/atoms';
import { ContentTemplate } from '../components/templates/ContentTemplate';
import { colors, radius, space } from '../styles/tokens';

const details = [
  {
    title: 'What RED FLAG checks',
    description: 'AI Scan looks for scam signals in messages and links you paste into the app. Results explain what was flagged and suggest a next step.',
  },
  {
    title: 'How to use a result',
    description: 'Treat the result as one piece of information. If a message asks for money, a password, or a verification code, confirm the request through an official channel.',
  },
  {
    title: 'Who built RED FLAG',
    description: 'A graduation project by computer science students at Cairo University’s Faculty of Science, supervised by Dr. Hend Dawood.',
  },
];

interface AboutPageProps {
  onBack: () => void;
}

export const AboutPage = ({ onBack }: AboutPageProps) => (
  <ContentTemplate title="About RED FLAG" description="A tool for spotting potential online scams.">
    <Button title="Back to Profile" variant="outline" onPress={onBack} />
    <View style={styles.sections}>
      {details.map(({ title, description }) => (
        <View key={title} style={styles.section}>
          <Text accessibilityRole="header" style={styles.title}>{title}</Text>
          <Text style={styles.body}>{description}</Text>
        </View>
      ))}
    </View>
  </ContentTemplate>
);

const styles = StyleSheet.create({
  sections: { gap: space.s2 },
  section: { gap: space.s1, padding: space.s2, borderWidth: 1, borderColor: colors.border, borderRadius: radius },
  title: { color: colors.text, fontSize: 18, fontWeight: '700' },
  body: { color: colors.muted, fontSize: 15, lineHeight: 22 },
});
