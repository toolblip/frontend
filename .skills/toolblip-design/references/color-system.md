# Toolblip Color System

## Primary Palette

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `green-500` | #22c55e | — | Primary accent, CTAs |
| `green-600` | #16a34a | — | Hover states |
| `green-400` | #4ade80 | #4ade80 | Active/dark accent |
| `green-700` | — | #16a34a | Dark accent |

## Neutrals

| Token | Light | Dark |
|-------|-------|------|
| Background | `white` | `gray-950` |
| Card bg | `white` or `gray-50` | `gray-900` |
| Border | `gray-200` | `gray-800` |
| Body text | `gray-900` | `white` |
| Secondary text | `gray-500` | `gray-400` |
| Muted text | `gray-400` | `gray-500` |

## Semantic

| Context | Light | Dark |
|---------|-------|------|
| Error | `red-600` | `red-400` |
| Warning bg | `yellow-50` | `yellow-900/20` |
| Success bg | `green-50` | `green-900/20` |
| Info bg | `blue-50` | `blue-900/20` |

## DO NOT USE
- Hardcoded `#000` or `#fff` for backgrounds/text
- `blue-*` for generic UI elements
- `indigo-*`, `purple-*`, `pink-*` unless intentional
- `bg-gray-900` without `dark:bg-gray-900`
