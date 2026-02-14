# Agent Rules

- Use only design-system components for UI in screens. Do not use raw `Text` or `Pressable` in screens.
- Do not use hardcoded hex colors. Use color tokens from `src/design-system/tokens`.
- Use only spacing values from `src/design-system/tokens/spacing.ts`.
- All user-facing UI text must be in English.
- Use StyleSheet from React Native (no external styling libraries unless explicitly requested).
- Do not introduce new UI libraries without approval.
- Keep components simple and minimal (avoid heavy abstractions).
- Keep screens layout-focused; business logic should live in hooks or lib files.
- Prefer functional components with TypeScript types.
- No inline styles except layout-specific minor adjustments.
- Do not modify design tokens unless explicitly instructed.
