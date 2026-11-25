import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, space } from '../../styles/tokens';
import type { ScanMode } from '../../types/types';

const modes = [
  { value: 'message', label: 'Message' },
  { value: 'link', label: 'Link' },
] as const;

interface ScanModeTabsProps {
  mode: ScanMode;
  onChange: (mode: ScanMode) => void;
}

export const ScanModeTabs = ({ mode, onChange }: ScanModeTabsProps) => (
  <View accessibilityRole="tablist" style={styles.tabs}>
    {modes.map(({ value, label }) => {
      const selected = mode === value;
      return (
        <Pressable
          key={value}
          accessibilityRole="tab"
          aria-selected={selected}
          onPress={() => onChange(value)}
          style={[styles.tab, selected && styles.selected]}
        >
          <Text style={[styles.label, selected && styles.selectedLabel]}>{label}</Text>
        </Pressable>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  tabs: { flexDirection: 'row', gap: space.s1, padding: 4, borderWidth: 1, borderColor: colors.border, borderRadius: radius },
  tab: { flex: 1, minHeight: 44, alignItems: 'center', justifyContent: 'center', borderRadius: radius - 4 },
  selected: { backgroundColor: colors.primary },
  label: { color: colors.primary, fontSize: 15, fontWeight: '700' },
  selectedLabel: { color: colors.onPrimary },
});
