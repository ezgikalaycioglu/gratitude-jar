export const radius = {
  sm: 8,
  md: 16,
  card: 16,
  lg: 24,
  full: 999,
} as const;

export type RadiusToken = keyof typeof radius;
