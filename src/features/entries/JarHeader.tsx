import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { DS, colors, spacing } from '@/src/design-system';

type Props = {
  count: number;
};

export function JarHeader({ count }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.04,
        duration: 160,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
  }, [count, scale]);

  const subtitle =
    count === 0
      ? 'Your jar is empty. Add your first note.'
      : `${count} notes in your jar`;

  return (
    <Animated.View style={[styles.container, { transform: [{ scale }] }]}>
      <DS.Card style={styles.card}>
        <View style={styles.jarPill}>
          <DS.Text>🫙</DS.Text>
        </View>
        <View style={styles.copy}>
          <DS.Text variant="title">Gratitude Jar</DS.Text>
          <DS.Text>{subtitle}</DS.Text>
        </View>
      </DS.Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xs,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  jarPill: {
    width: spacing.xxl,
    height: spacing.xxl,
    borderRadius: spacing.xl,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: spacing.xs,
  },
});
