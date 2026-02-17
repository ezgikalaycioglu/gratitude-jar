import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { Text } from '@/src/design-system/components/Text';
import { colors } from '@/src/design-system/tokens/colors';
import { radius } from '@/src/design-system/tokens/radius';
import { spacing } from '@/src/design-system/tokens/spacing';

type Props = {
  onPress: () => void;
  label?: string;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  variant?: 'circle' | 'pill';
  accessibilityLabel?: string;
};

export function Fab({
  onPress,
  label = '+',
  style,
  disabled = false,
  variant = 'circle',
  accessibilityLabel,
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? 'Add a note'}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        variant === 'pill' ? styles.pill : styles.circle,
        disabled ? styles.disabled : null,
        pressed && !disabled ? styles.pressed : null,
        style,
      ]}
    >
      {variant === 'pill' ? (
        <View style={styles.pillContent}>
          <Text style={styles.pillPlus}>+</Text>
          <Text variant="button" style={styles.pillLabel}>
            {label}
          </Text>
        </View>
      ) : (
        <Text style={styles.circleLabel}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.textPrimary,
    shadowOpacity: 0.16,
    shadowRadius: spacing.sm,
    shadowOffset: { width: 0, height: spacing.xs / 2 },
    elevation: spacing.xs,
  },
  circle: {
    width: spacing.xl,
    height: spacing.xl,
    borderRadius: radius.full,
  },
  pill: {
    minHeight: spacing.touchTargetMin,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  pillContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  pressed: {
    backgroundColor: colors.primaryPressed,
  },
  disabled: {
    backgroundColor: colors.primaryDisabled,
  },
  circleLabel: {
    color: colors.textOnPrimary,
  },
  pillPlus: {
    color: colors.textOnPrimary,
  },
  pillLabel: {
    color: colors.textOnPrimary,
  },
});
