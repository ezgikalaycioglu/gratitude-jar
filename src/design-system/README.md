# Design System

A minimal, iOS-first design system for predictable, calm interfaces.

## Philosophy
- Prioritize clarity over decoration.
- Use semantic tokens instead of ad hoc values.
- Keep touch targets and type readable by default.
- Build composable primitives first (`Text`, `Button`, `Input`, `Card`).

## Rules
- Use token files as the single source of truth.
- Do not hardcode colors, spacing, radius, or typography in components.
- Prefer semantic color tokens (`primary`, `textPrimary`) over role-less names.
- Keep UI copy concise and in English.

## Token Model
- `tokens/colors.ts`: semantic UI colors for surface, text, border, action, state.
- `tokens/spacing.ts`: 4pt spacing scale and control sizing.
- `tokens/radius.ts`: consistent corner radii from subtle to fully rounded.
- `tokens/typography.ts`: system font stack and text variants for app UI.

## iOS-first defaults
- System font (`System`) for platform-native readability.
- 44pt minimum control height for tap comfort.
- Neutral surfaces with strong contrast for body text.
- Moderate radius and spacing for dense but legible layouts.
