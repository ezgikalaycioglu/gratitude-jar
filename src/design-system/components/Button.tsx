import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';

import { Text } from '@/src/design-system/components/Text';
import { colors } from '@/src/design-system/tokens/colors';
import { radius } from '@/src/design-system/tokens/radius';
import { spacing } from '@/src/design-system/tokens/spacing';

type Props = {
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

export function Button({ label, onPress, style, disabled = false }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        disabled ? styles.buttonDisabled : null,
        pressed && !disabled ? styles.buttonPressed : null,
        style,
      ]}
    >
      <Text variant="button" style={styles.label}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    minHeight: spacing.touchTargetMin,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  buttonPressed: {
    backgroundColor: colors.primaryPressed,
  },
  buttonDisabled: {
    backgroundColor: colors.primaryDisabled,
  },
  label: {
    color: colors.textOnPrimary,
  },
});
