# Toolblip Design Checklist

## Before Committing

- [ ] Light mode: all text readable, no invisible content
- [ ] Dark mode: all text readable, no white glare
- [ ] Both modes tested in browser (use browser devtools toggle)
- [ ] Build passes: `npm run build`
- [ ] No `text-white` without `dark:text-white`
- [ ] No `bg-gray-900` without `dark:bg-gray-900`
- [ ] No emoji in navigation or button labels (use SVG icons)
- [ ] All interactive elements have hover/focus states
- [ ] Responsive: tested at 375px, 768px, 1280px
- [ ] No Lorem ipsum or placeholder text
- [ ] Semantic HTML (correct heading order, button vs link, etc.)
- [ ] Accessibility: aria-labels on icon buttons, alt on images
- [ ] No generic fonts (Inter, Roboto, Arial)
- [ ] No purple-on-white gradients
- [ ] Copy reads like a human wrote it (no em dashes, no "empowering", no "seamless")
