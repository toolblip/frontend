---
name: toolblip-frontend-design
description: Create distinctive, production-grade frontend interfaces for Toolblip. Use when: (1) designing or redesigning pages, components, or layouts, (2) asked to build new pages, tools, or features, (3) asked to improve the look and feel or make it more visually striking, (4) asked to create landing pages, tool UIs, marketing sections, or any web UI for toolblip.com. Triggered by phrases like "design", "build", "create page", "new tool", "redesign", "make it look better", "visually striking".
---

# Toolblip Frontend Design

Create distinctive, production-grade frontend interfaces for Toolblip that avoid generic "AI slop" aesthetics.

## Project Context

- **Repo:** `/Users/ray/Work/toolblip`
- **Stack:** Next.js 16 + Tailwind CSS v4 + TypeScript
- **Brand:** Developer tools, privacy-first, no-nonsense. Tone is confident and useful — not flashy, not corporate.
- **Colors:** Green accent (`green-500`/`green-600`) on neutral grays. Available tokens:
  - Background: `white` (light) / `gray-950` (dark)
  - Cards: `white` or `gray-50` (light) / `gray-900` (dark)
  - Borders: `gray-200` (light) / `gray-800` (dark)
  - Text: `gray-900` (light) / `white` (dark)
  - Muted: `gray-500` (light) / `gray-400` (dark)
- **Fonts:** System font stack. For display/hero text, consider weight and size contrast over font choice.
- **Theme:** Always support light AND dark mode via `dark:` variant.

## Design Thinking

Before coding, commit to a clear direction:

1. **Purpose:** What problem does this solve? Who is the user?
2. **Tone:** Toolblip is developer-facing but human. Direction options:
   - Clean/technical (structured grids, monospace accents, tight spacing)
   - Warm/approachable (softer corners, friendlier copy, generous whitespace)
   - Bold/functional (high contrast, oversized type, no decoration)
3. **Differentiation:** What makes this memorable? One strong idea beats many small ideas.
4. **Technical:** Keep it production-ready. No placeholder content, no TODOs in UI.

## Implementation Guidelines

### Typography
- Use size contrast aggressively: hero text `text-4xl sm:text-5xl`, body `text-sm`
- Monospace accents for technical terms, code snippets, slugs
- Line height: `leading-relaxed` for body, `leading-tight` for headings

### Color & Theme
- Use CSS variables via `@theme` block in globals.css for consistency
- Commit to one dominant color with sharp accents
- Light mode should feel bright and clean; dark mode should feel calm and focused
- Never use purple gradients on white backgrounds (AI slop cliché)

### Motion
- CSS transitions preferred: `transition-colors`, `transition-all`
- Page load: subtle stagger via `animation-delay` on hero elements
- Hover states: scale, shadow lift, or border color change — not just color shift
- Avoid excessive motion — one well-timed animation beats constant movement

### Spatial Composition
- Hero: generous vertical padding (`py-14` to `py-20`)
- Cards: `rounded-xl` with `p-4` or `p-5`, consistent gap-3 or gap-4
- Sections: `py-10` or `py-12` between major blocks
- Grid: 1 col mobile → `sm:grid-cols-2` → `lg:grid-cols-3`
- Use `max-w-6xl` or `max-w-5xl` for content, `max-w-2xl` for text-heavy pages

### Visual Details
- Use SVG icons inline for small UI accents (no emoji in production UI)
- Subtle shadows: `shadow-sm` for cards, `shadow-md` on hover
- Borders: `border` for subtle separation, `border-2` for active/focus
- Backgrounds: `bg-gradient-to-br from-green-50 to-transparent` for callouts (light mode)
- Decorative: use subtle grid patterns or noise sparingly — never as default

## Anti-Patterns (Never Do These)

- `text-white` without `dark:text-white` — breaks light mode
- `bg-gray-900` without light alternative — dark-only backgrounds
- `border-gray-700` in cards — borders should match the surface
- Emoji in navigation or UI — use SVG icons
- Lorem ipsum or "Example text" in production pages
- Generic Inter/Roboto/Arial fonts
- Purple-on-white gradient backgrounds
- Centered-only layouts — use asymmetry or intentional structure

## Workflow

1. Read the page file you're modifying before changing it
2. Choose a design direction and state it in plain text
3. Implement the code with both light and dark variants
4. Verify build passes: `npm run build`
5. Test in browser (dark mode + light mode)

## Reference Files

- `references/color-system.md` — approved color tokens
- `references/component-patterns.md` — reusable component patterns for Toolblip
- `references/checklist.md` — pre-commit design checklist
