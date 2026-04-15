---
name: toolblip-design
description: Toolblip UI/UX design reviews and improvements. Use when: (1) asked to redesign, restyle, or improve the look and feel of Toolblip, (2) asked to review UI/UX quality, (3) asked to check color schemes, typography, spacing, component consistency, or layout, (4) asked to make pages responsive, accessible, or mobile-friendly, (5) asked to improve navigation, page structure, or user flows. Triggered by phrases like "redesign Toolblip", "improve the UI", "check the design", "make it look better", "fix responsiveness", "Toolblip design".
---

# Toolblip Design

Comprehensive UI/UX reviews and improvements for the Toolblip frontend.

## Project Context

- **Repo:** `/Users/ray/Work/toolblip`
- **Stack:** Next.js 16 + Tailwind CSS v4 + TypeScript
- **Theme system:** `dark:` variant via `@custom-variant dark (&:where(.dark, .dark *))` in globals.css
- **Color:** Green accent (`green-500`/`green-600`), gray scale for neutrals
- **Fonts:** System font stack (no custom fonts)
- **All pages must support both light and dark modes** — never hardcode `bg-gray-900` or `text-white` without `dark:` variants

## Workflow

### 1. Audit Before Changing

Check existing files for design issues:

```bash
# Find dark-only patterns (missing dark: variants)
grep -rn "bg-gray-90\|bg-gray-95\|text-white\b" src/app/ --include="*.tsx" | grep -v "dark:"

# Check responsive breakpoints
grep -rn "sm:\|md:\|lg:\|xl:" src/app/ --include="*.tsx"

# Check accessibility
grep -rn "aria-\|role=\|alt=" src/app/ --include="*.tsx"
```

### 2. Common Issues to Fix

| Issue | Light mode | Dark mode |
|-------|-----------|-----------|
| Background | `bg-white` | `dark:bg-gray-900` |
| Card bg | `bg-white` or `bg-gray-50` | `dark:bg-gray-900` |
| Borders | `border-gray-200` | `dark:border-gray-800` |
| Body text | `text-gray-900` | `dark:text-white` |
| Secondary text | `text-gray-500` | `dark:text-gray-400` |
| Hover states | `hover:text-gray-700` | `dark:hover:text-gray-200` |

### 3. Reference Files

- `references/checklist.md` — detailed design review checklist
- `references/color-system.md` — Toolblip color token reference
- `references/typography.md` — text hierarchy and spacing guide
