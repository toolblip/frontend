# Toolblip Performance Optimization Guide

## Target Metrics

| Metric | Target | Priority |
|--------|--------|----------|
| LCP | < 2.5s | High |
| FCP | < 1.8s | High |
| CLS | < 0.1 | High |
| TBT | < 200ms | Medium |
| Bundle size | < 200KB gzipped | Medium |

## Common Fixes

### 1. Image Optimization
```tsx
// BAD
<img src="/hero.png" />

// GOOD — Next.js Image
import Image from 'next/image';
<Image src="/hero.png" width={800} height={400} alt="..." />
```

### 2. Dynamic Imports for Heavy Components
```tsx
// Tool pages already use this pattern:
const HeavyComponent = dynamic(() => import('@/components/tools/X'));

// Ensure ALL tool components are dynamically imported
```

### 3. Font Loading
Toolblip uses system fonts — no web font loading needed. Good.

### 4. Script Loading
```tsx
// Use next/script for third-party scripts
import Script from 'next/script';
<Script src="https://..." strategy="lazyOnload" />
```

### 5. Static Generation
All Toolblip pages should be statically generated where possible:
```tsx
// Good — pages are static by default in Next.js App Router
export const dynamic = 'force-static';
```

## Vercel-Specific
- Use `vercel.json` for edge caching headers
- Images served via Vercel CDN automatically
- No `output: 'export'` — keeps ISR capabilities
