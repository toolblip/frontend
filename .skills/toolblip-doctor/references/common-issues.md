# Toolblip Common Issues & Fixes

## Issue: Dark-only components

**Pattern:** `bg-gray-900` without dark variant
**Fix:** `bg-white dark:bg-gray-900`
**Files to check:** All page.tsx and component files

## Issue: Missing responsive prefixes

**Pattern:** `text-lg` without `sm:text-xl lg:text-2xl`
**Fix:** Always provide responsive scaling for text
**Files to check:** Hero sections, card titles, navigation

## Issue: Link vs Anchor tags

**Pattern:** `<a href="/tools">` (internal link)
**Fix:** Use `<Link>` from `next/link` for internal navigation
**Files to check:** All pages with internal links

## Issue: Missing aria-labels

**Pattern:** `<button>` without aria-label on icon-only buttons
**Fix:** Add `aria-label="..."` to all icon buttons
**Files to check:** ThemeToggle, navigation, form buttons

## Issue: Missing alt text on images

**Pattern:** `<img>` without alt attribute
**Fix:** Add `alt="..."` or `alt=""` for decorative images
**Files to check:** FeaturedImage, any inline img tags

## Issue: Dynamic import missing

**Pattern:** Heavy client component loaded without `dynamic()`
**Fix:** `dynamic(() => import('@/components/tools/X'))`
**Files to check:** Tool pages using large components
