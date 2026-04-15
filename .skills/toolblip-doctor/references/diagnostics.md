# Toolblip Diagnostics

## Pre-flight Checklist

### 1. Run build
```bash
cd /Users/ray/Work/toolblip && npm run build 2>&1 | grep -E "Error|error|Failed"
```
Must return zero errors.

### 2. Check dark mode
```bash
grep -rn "text-white\b" src/app/ --include="*.tsx" | grep -v "dark:text-white"
```
Any result = light mode broken.

### 3. Check imports
```bash
grep -rn "import.*from.*@/components" src/app/ --include="*.tsx" | head -20
```
Verify all imports resolve.

### 4. Check routing
```bash
grep -rn "href=" src/app/ --include="*.tsx" | grep -v "next/link" | grep -v "target=" | grep -v "mailto:"
```
Internal links should use `<Link>`, not raw `<a>`.

### 5. Check images
```bash
grep -rn "<img" src/ --include="*.tsx"
```
All images should use Next.js `<Image>` component or have proper alt text.

## Common Fixes

| Issue | Fix |
|-------|-----|
| Build error after edit | Check for unbalanced JSX tags |
| Dark mode broken | Search for `text-white` without `dark:` variant |
| Hydration error | Check client/server date usage |
| Missing styles | Verify Tailwind class names are correct |
| 404 page flashing | Check `not-found.tsx` renders correctly |
