---
name: toolblip-performance
description: Performance review and optimization for Toolblip frontend. Use when: (1) asked to check performance, speed, or load times, (2) asked to audit Lighthouse or Core Web Vitals metrics, (3) asked to reduce bundle size or improve loading, (4) asked to optimize images, fonts, or assets, (5) asked to check FCP, LCP, CLS, or FID metrics. Triggered by phrases like "performance", "Lighthouse", "bundle size", "optimize", "Core Web Vitals", "speed", "LCP", "FCP", "Toolblip performance".
---

# Toolblip Performance

Performance review and optimization for the Toolblip frontend.

## Project Context

- **Repo:** `/Users/ray/Work/toolblip`
- **Stack:** Next.js 16 (Turbopack), deployed on Vercel
- **Static export:** No, uses ISR/SSR on Vercel
- **Images:** Next.js Image component with remote patterns allowed
- **Fonts:** System font stack (no web font loading)

## Performance Checklist

### 1. Bundle Analysis
```bash
cd /Users/ray/Work/toolblip && ANALYZE=true npm run build 2>&1 | grep -E "bundle|size|chunk"
```

### 2. Static Page Count
```bash
npm run build 2>&1 | grep -E "○|●|SSG|Static|prerendered"
```
Verify all expected pages are statically generated.

### 3. Dynamic Imports
Check `src/app/` for `dynamic()` imports — these split bundles:
```bash
grep -rn "dynamic(" src/app/ --include="*.tsx"
grep -rn "dynamic(" src/components/ --include="*.tsx"
```

### 4. Image Optimization
```bash
grep -rn "<img " src/ --include="*.tsx"
```
Next.js `<Image>` is preferred over raw `<img>` for automatic optimization.

### 5. Client Components
Count "use client" components — each adds to JS bundle:
```bash
grep -rn "\"use client\"" src/ --include="*.tsx" | wc -l
```

### 6. Vercel Build Output
```bash
grep -rn "cache\|CDN\|edge" next.config.ts vercel.json 2>/dev/null
```

### 7. Lighthouse Targets

| Metric | Target | What to Check |
|--------|--------|---------------|
| LCP | < 2.5s | Hero image preload, font load, critical CSS |
| FCP | < 1.8s | Server response time, render-blocking resources |
| CLS | < 0.1 | Image dimensions, dynamic content slots |
| TBT | < 200ms | Heavy client components, third-party scripts |

### 8. Reference Files
- `references/optimization-guide.md` — detailed performance optimization guide
- `references/vercel-config.md` — Vercel-specific performance settings
