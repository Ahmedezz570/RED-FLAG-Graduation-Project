import { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Logo } from '../components/atoms';
import { colors, space } from '../styles/tokens';
import type { SplashPageProps } from '../types/types';

export const SplashPage = ({ onFinish, durationMs = 2000 }: SplashPageProps) => {
const [opacity] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    const timer = setTimeout(onFinish, durationMs);
    return () => clearTimeout(timer);
  }, [onFinish, durationMs, opacity]);

  return (
    <View style={styles.root}>
      <Animated.View style={[styles.center, { opacity }]}>
        <Logo size={88} inverted />
        <Text style={styles.name}>Safety starts here</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: { alignItems: 'center', gap: space.s2 },
  name: { fontSize: 28, fontWeight: '700', color: colors.onPrimary, letterSpacing: 0.5 },
});