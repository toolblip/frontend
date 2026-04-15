---
name: toolblip-frontend-design
description: Create distinctive, production-grade frontend interfaces for Toolblip. Use when: (1) designing or redesigning pages, components, or layouts, (2) asked to build new pages, tools, or features, (3) asked to improve the look and feel or make it more visually striking, (4) asked to create landing pages, tool UIs, marketing sections, or any web UI for toolblip.com. Triggered by phrases like "design", "build", "create page", "new tool", "redesign", "make it look better", "visually striking".
---

# Toolblip Frontend Design

Create distinctive, production-grade frontend interfaces for Toolblip that avoid generic "AI slop" aesthetics. **Match implementation ambition to the design vision — minimalist designs need surgical precision; maximalist designs need bold, committed execution.**

## Project Context

- **Repo:** `/Users/ray/Work/toolblip`
- **Stack:** Next.js 16 + Tailwind CSS v4 + TypeScript
- **Brand:** Developer tools, privacy-first, no-nonsense. Tone is confident and useful.
- **Colors:** Green accent (`green-500`/`green-600`) on neutral grays
- **Fonts:** System font stack — weight and size contrast over font choice
- **Theme:** Always support light AND dark mode via `dark:` variant

## Design Thinking

Before writing any code, commit to a clear aesthetic direction and **commit fully**:

1. **Purpose** — What problem does this solve? Who is the user?
2. **Tone** — Pick a clear direction and execute with conviction:
   - Clean/technical: structured grids, monospace accents, tight spacing
   - Warm/approachable: softer corners, friendlier copy, generous whitespace
   - Bold/functional: high contrast, oversized type, no decoration
   - Brutalist/raw: exposed structure, aggressive typography, intentional roughness
   - Refined/minimal: surgical precision, quiet confidence, restrained palette
3. **Differentiation** — One unforgettable idea beats many small ones
4. **Complexity match** — Minimalist vision = restrained, precise code. Maximalist vision = elaborate, committed code. Don't half-execute either.

## Anti-Patterns (Never Do These)

- `text-white` without `dark:text-white`
- `bg-gray-900` without light alternative
- Emoji in navigation or UI (use SVG icons)
- Lorem ipsum in production
- Generic Inter/Roboto/Arial fonts
- Purple-on-white gradients
- Centered-only layouts without reason
- "Empowering", "seamless", "robust" in copy
- `border-gray-700` in cards that aren't dark-mode only

## Implementation Guidelines

### Typography
- Use size contrast aggressively: hero `text-4xl sm:text-5xl`, body `text-sm`
- Monospace accents for technical terms, slugs, code
- Line height: `leading-relaxed` body, `leading-tight` headings
- When going bold, GO BOLD: `text-6xl`, heavy weight, tight tracking

### Color & Theme
- Commit to one dominant color with sharp accents
- Light mode: bright and clean. Dark mode: calm and focused
- CSS variables via `@theme` block in globals.css for consistency
- Subtle texture/gradient beats flat solid every time

### Motion
- CSS transitions for all interactive states
- Page load: orchestrated stagger via `animation-delay` (50-100ms increments)
- Hover: meaningful response (scale 1.02, shadow lift, border shift)
- One well-timed reveal creates more delight than scattered micro-interactions
- For maximalist designs: layered animations, scroll triggers, ambient motion
- For minimalist designs: one perfect transition, nothing gratuitous

### Spatial Composition
- Hero: generous vertical padding (`py-14` to `py-20`)
- Sections: `py-10` to `py-12` between major blocks
- Cards: `rounded-xl`, consistent `p-4` or `p-5`, `gap-3` or `gap-4`
- Grid: 1 col mobile → `sm:grid-cols-2` → `lg:grid-cols-3`
- Use `max-w-6xl` / `max-w-5xl` for content, `max-w-2xl` for text-heavy
- Break the grid intentionally when the design calls for it

### Visual Details
- SVG icons inline for small UI accents
- Subtle shadows: `shadow-sm` at rest, `shadow-md` on hover
- Borders: `border` for subtle separation, `border-2` for active/focus
- Backgrounds: `bg-gradient-to-br from-green-50 to-transparent` for callouts
- Decorative: subtle grid patterns, noise, geometric shapes — used with intent

## Workflow

1. Read the page file you're modifying
2. Choose a design direction and state it in plain text
3. Implement with both light and dark variants
4. Verify build: `npm run build`
5. Test in browser (dark mode + light mode)

## Reference Files

- `references/color-system.md` — approved color tokens
- `references/component-patterns.md` — reusable component patterns
- `references/checklist.md` — pre-commit design checklist
