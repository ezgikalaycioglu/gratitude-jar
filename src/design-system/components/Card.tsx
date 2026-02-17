import { PropsWithChildren } from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { colors } from '@/src/design-system/tokens/colors';
import { radius } from '@/src/design-system/tokens/radius';
import { spacing } from '@/src/design-system/tokens/spacing';

type Props = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  disabled?: boolean;
}>;

export function Card({ children, style, onPress, disabled = false }: Props) {
  if (onPress) {
    return (
      <Pressable
        disabled={disabled}
        onPress={onPress}
        style={({ pressed }) => [styles.card, pressed ? styles.pressed : null, style]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.card,
    padding: spacing.sm,
  },
  pressed: {
    borderColor: colors.primary,
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
});
