import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, space } from '../../styles/tokens';

interface ScanActionProps {
  title: string;
  description: string;
  onPress: () => void;
}

export const ScanAction = ({ title, description, onPress }: ScanActionProps) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={title}
    accessibilityHint={description}
    onPress={onPress}
    style={({ pressed }) => [styles.card, pressed && styles.pressed]}
  >
    <View style={styles.content}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
    <Text accessible={false} aria-hidden style={styles.arrow}>→</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.s2,
    minHeight: 88,
    padding: space.s2,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius,
  },
  pressed: { backgroundColor: colors.border },
  content: { flex: 1, gap: 4 },
  title: { color: colors.text, fontSize: 18, fontWeight: '700' },
  description: { color: colors.muted, fontSize: 15, lineHeight: 21 },
  arrow: { color: colors.primary, fontSize: 24 },
});
