# Toolblip Design Review Checklist

## Visual Hierarchy
- [ ] Headings use correct scale (text-3xl → text-lg)
- [ ] Body text is readable in both light and dark modes
- [ ] Spacing is consistent (use gap-4, gap-6, py-8, py-12 etc.)
- [ ] No orphaned UI elements

## Color System
- [ ] Primary accent: `green-500` (light) / `green-400` (dark)
- [ ] Neutrals: `gray-*` scale — don't mix blue or red tints
- [ ] Semantic colors: red for errors, yellow for warnings, green for success
- [ ] No `#000` or `#fff` hardcoded — use gray scale

## Dark Mode
- [ ] All backgrounds: light-first with `dark:` override
- [ ] All text: dark-gray-first with `dark:` override
- [ ] All borders: light-appropriate with `dark:` override
- [ ] Test: force light mode and verify no invisible text

## Accessibility
- [ ] All interactive elements have `aria-label` or visible text
- [ ] Color contrast ratio ≥ 4.5:1 for text
- [ ] Focus states visible (`:focus-visible` styled)
- [ ] No `aria-hidden` on content that should be visible

## Responsive Design
- [ ] Mobile-first: base classes work without prefixes
- [ ] Grid: 1 col mobile → sm:2 → lg:3 → xl:4
- [ ] Text: scales from mobile to desktop
- [ ] Touch targets: ≥ 44px for mobile

## Component Consistency
- [ ] Cards: same border-radius (rounded-xl or rounded-lg)
- [ ] Buttons: same height/padding pattern
- [ ] Forms: consistent input styling
- [ ] Icons: consistent size (text-xl for inline, text-2xl for feature)
