import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';

import { Text } from '@/src/design-system/components/Text';
import { colors } from '@/src/design-system/tokens/colors';
import { radius } from '@/src/design-system/tokens/radius';
import { spacing } from '@/src/design-system/tokens/spacing';

type Variant = 'primary' | 'ghost';

type Props = {
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  variant?: Variant;
};

export function Button({ label, onPress, style, disabled = false, variant = 'primary' }: Props) {
  const isGhost = variant === 'ghost';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        isGhost ? styles.ghost : styles.primary,
        disabled && isGhost ? styles.ghostDisabled : null,
        disabled && !isGhost ? styles.primaryDisabled : null,
        pressed && !disabled && isGhost ? styles.ghostPressed : null,
        pressed && !disabled && !isGhost ? styles.primaryPressed : null,
        style,
      ]}
    >
      <Text variant="button" style={[styles.labelBase, isGhost ? styles.ghostLabel : styles.primaryLabel]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: spacing.touchTargetMin,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.lg,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  primaryPressed: {
    backgroundColor: colors.primaryPressed,
  },
  primaryDisabled: {
    backgroundColor: colors.primaryDisabled,
  },
  ghost: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ghostPressed: {
    backgroundColor: colors.secondary,
  },
  ghostDisabled: {
    borderColor: colors.placeholder,
  },
  labelBase: {},
  primaryLabel: {
    color: colors.textOnPrimary,
  },
  ghostLabel: {
    color: colors.textPrimary,
  },
});
