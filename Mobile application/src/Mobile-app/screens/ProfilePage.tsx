import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/atoms';
import { ContentTemplate } from '../components/templates/ContentTemplate';
import { colors, radius, space } from '../styles/tokens';
import type { ProfilePageProps } from '../types/types';

export const ProfilePage = ({ user, onOpenAbout, onSignOut }: ProfilePageProps) => {
  const initials = user.name.trim().split(/\s+/).slice(0, 2)
    .map((word) => Array.from(word)[0] ?? '').join('').toUpperCase();

  return (
    <ContentTemplate title="Profile" description="Your RED FLAG account details.">
      <View style={styles.card}>
        <View style={styles.avatar} aria-hidden>
          <Text style={styles.initials}>{initials || '•'}</Text>
        </View>
        <View style={styles.identity}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <Button title="About RED FLAG" variant="outline" onPress={onOpenAbout} />
        <Button title="Sign out" variant="link" onPress={onSignOut} />
      </View>
    </ContentTemplate>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.s2,
    padding: space.s2,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  initials: { color: colors.onPrimary, fontSize: 19, fontWeight: '700' },
  identity: { flex: 1, gap: 4 },
  name: { color: colors.text, fontSize: 19, fontWeight: '700' },
  email: { color: colors.muted, fontSize: 15, lineHeight: 21 },
  actions: { gap: space.s2 },
});
