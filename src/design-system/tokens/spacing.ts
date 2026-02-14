export const spacing = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 40,
  xxl: 48,

  touchTargetMin: 48,
} as const;

export type SpacingToken = keyof typeof spacing;
