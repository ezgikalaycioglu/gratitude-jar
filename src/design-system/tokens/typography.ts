import { TextStyle } from 'react-native';

export const typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
  },
  fontSize: {
    title: 28,
    body: 17,
    caption: 13,
    button: 17,
  },
  lineHeight: {
    title: 34,
    body: 24,
    caption: 18,
    button: 22,
  },
  letterSpacing: {
    normal: 0,
    compact: -0.2,
  },
} as const;

export const textVariants = {
  title: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.fontSize.title,
    lineHeight: typography.lineHeight.title,
    letterSpacing: typography.letterSpacing.compact,
  },
  body: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.body,
    lineHeight: typography.lineHeight.body,
    letterSpacing: typography.letterSpacing.normal,
  },
  caption: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.caption,
    lineHeight: typography.lineHeight.caption,
    letterSpacing: typography.letterSpacing.normal,
  },
  button: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.button,
    lineHeight: typography.lineHeight.button,
    letterSpacing: typography.letterSpacing.normal,
  },
} as const satisfies Record<string, TextStyle>;

export type TextVariantToken = keyof typeof textVariants;
