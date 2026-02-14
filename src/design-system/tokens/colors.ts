export const colors = {
  background: '#FAF7F2',
  surface: '#FFFFFF',

  primary: '#8FCFC8',
  primaryPressed: '#7BBEB7',
  primaryDisabled: '#CDE7E3',
  secondary: '#DCCFF3',

  textPrimary: '#2F3133',
  textSecondary: '#666A70',
  textOnPrimary: '#2F3133',

  border: '#EDEBE6',
  placeholder: '#A0A4AA',
} as const;

export type ColorToken = keyof typeof colors;
