import { StyleSheet, Text as RNText, TextProps, TextStyle } from 'react-native';

import { colors } from '@/src/design-system/tokens/colors';
import { textVariants, TextVariantToken } from '@/src/design-system/tokens/typography';

type Props = TextProps & {
  variant?: TextVariantToken;
};

const variantStyles: Record<TextVariantToken, TextStyle> = textVariants;

export function Text({ variant = 'body', style, ...props }: Props) {
  return <RNText style={[styles.base, variantStyles[variant], style]} {...props} />;
}

const styles = StyleSheet.create({
  base: {
    color: colors.textPrimary,
  },
});
