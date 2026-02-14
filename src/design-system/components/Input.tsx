import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';

import { Text } from '@/src/design-system/components/Text';
import { colors } from '@/src/design-system/tokens/colors';
import { radius } from '@/src/design-system/tokens/radius';
import { spacing } from '@/src/design-system/tokens/spacing';
import { typography } from '@/src/design-system/tokens/typography';

type Props = TextInputProps & {
  label?: string;
};

export function Input({ label, style, ...props }: Props) {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={colors.placeholder}
        style={[styles.input, style]}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  label: {
    color: colors.textSecondary,
  },
  input: {
    minHeight: spacing.touchTargetMin,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.body,
    lineHeight: typography.lineHeight.body,
  },
});
