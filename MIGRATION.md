# Astro → Next.js Migration Plan

**Goal:** Migrate Toolblip frontend from Astro (`src/pages/`) to Next.js App Router (`src/app/`) while preserving all functionality and zero downtime.

---

## Current State

The codebase has **two parallel routing systems**:

```
src/
├── app/                    ← Next.js App Router (active)
│   ├── layout.tsx         ← Next.js root layout (already done)
│   ├── page.tsx            ← Next.js homepage (already done)
│   ├── directory/page.tsx ← Directory page (already done)
│   ├── tools/
│   │   ├── page.tsx       ← Tools listing (already done)
│   │   └── [slug]/page.tsx ← Dynamic tool pages (already done)
│   └── globals.css
│
├── pages/                 ← Astro pages (to be migrated)
│   ├── index.astro        ← DUPLICATE homepage (Astro)
│   ├── about.astro
│   ├── advertise.astro
│   ├── donate.astro
│   ├── login.astro
│   ├── privacy.astro
│   ├── signup.astro
│   ├── terms.astro
│   ├── 404.astro
│   └── tools/             ← STALE (empty dirs, page.tsx deleted)
│
├── components/            ← Shared components
│   ├── tools/             ← 19 React client components (keep as-is)
│   ├── ToolCard.astro
│   ├── SponsorCard.astro
│   ├── SponsorSlot.astro
│   └── UsageLimitPopup.astro
│
├── layouts/
│   ├── BaseLayout.astro   ← Nav + Footer + Cookie banner
│   └── ToolLayout.astro   ← Breadcrumb + Ad slots + Tool wrapper
│
└── lib/
    ├── api.ts             ← API client (keep as-is)
    ├── auth.ts            ← Client-side auth helpers (keep as-is)
    └── usage.ts           ← Usage tracking (keep as-is)
```

**Already working in Next.js:** Homepage, /tools, /tools/[slug], /directory
**Still in Astro:** Static pages (about, login, signup, etc.)
**Can be deleted:** `src/pages/` entirely + `src/layouts/` + `src/components/ToolCard.astro` + `src/components/SponsorSlot.astro` + `src/components/UsageLimitPopup.astro`

---

## Migration Phases

### Phase 1: Static Marketing Pages
**Priority: High | Effort: Low | Risk: Low**

Copy-paste these pages — they're mostly static HTML with Tailwind:

| Page | Astro File | Next.js Route | Notes |
|------|-----------|---------------|-------|
| Homepage | `pages/index.astro` | `app/page.tsx` | Already done (Next.js) |
| About | `pages/about.astro` | `app/about/page.tsx` | Static text |
| Privacy | `pages/privacy.astro` | `app/privacy/page.tsx` | Static text |
| Terms | `pages/terms.astro` | `app/terms/page.tsx` | Static text |
| Donate | `pages/donate.astro` | `app/donate/page.tsx` | Static text |
| Advertise | `pages/advertise.astro` | `app/advertise/page.tsx` | Static text |
| 404 | `pages/404.astro` | `app/not-found.tsx` | Next.js special file |

**What to copy:** Page content and Tailwind classes
**What changes:** `<BaseLayout>` → `<RootLayout>` children pattern; Astro component syntax → JSX

### Phase 2: Auth Pages (Login + Signup)
**Priority: High | Effort: Medium | Risk: Medium**

Both pages have working forms that call the Laravel API.

| Page | Next.js Route | Key Logic |
|------|---------------|-----------|
| Login | `app/login/page.tsx` | Email/password form → POST /api/auth/login |
| Signup | `app/signup/page.tsx` | Name/email/password form → POST /api/auth/register |

**Auth flow (Laravel Sanctum SPA mode):**
- POST to `/api/auth/login` with credentials
- Laravel returns Set-Cookie + JSON `{ user, token }`
- Store token in `localStorage` (or keep cookie-only via `credentials: 'include'`)
- Protect routes server-side with Sanctum session

**TODO:** Update `lib/api.ts` to use `credentials: 'include'` consistently (currently uses Bearer token approach — decide which to use)

**Post-login redirect:** Set cookie `tb_session=token` and redirect to `/`

### Phase 3: Directory + Next.js Polish
**Priority: Medium | Effort: Low | Risk: Low**

- `app/directory/page.tsx` already exists and works
- Move tool data fetching from static hardcoded array → API call to `/api/tools`
- Add search/filter UI connecting to `getTools()` from `lib/api.ts`

### Phase 4: Cleanup
**Priority: Low | Effort: Low | Risk: Low**

Delete migrated Astro files:
```
src/pages/           ← entire directory
src/layouts/        ← entire directory
src/components/
  ToolCard.astro    ← delete
  SponsorCard.astro  ← delete
  SponsorSlot.astro  ← delete
  UsageLimitPopup.astro ← delete
```

---

## Component Migration Map

### Keep As-Is (no changes needed)
```
src/components/tools/*.tsx    ← All 19 React client components
src/lib/api.ts              ← API client
src/lib/auth.ts             ← Auth helpers
src/lib/usage.ts            ← Usage tracking
public/favicon.svg          ← Assets
public/robots.txt           ←
```

### Convert Astro → Next.js
```
BaseLayout.astro    → app/layout.tsx (already done) + extract Nav/Footer as components
ToolLayout.astro    → app/tools/[slug]/page.tsx (already partially done)
ToolCard.astro      → app/tools/page.tsx uses Link + div grid (no component needed)
SponsorCard.astro   → app/components/SponsorCard.tsx (simple component)
SponsorSlot.astro   → app/components/SponsorSlot.tsx (simple component)
UsageLimitPopup.astro → app/components/UsageLimitPopup.tsx (client component)
```

### Re-create from Scratch (not in current codebase)
```
app/components/Nav.tsx          ← Extract from BaseLayout
app/components/Footer.tsx        ← Extract from BaseLayout
app/components/CookieBanner.tsx  ← Extract from BaseLayout
app/components/ToolGrid.tsx      ← Replaces ToolCard.astro in tools listing
```

---

## SEO & Metadata

Next.js App Router handles this natively via `generateMetadata()`.

Each page should export:
```typescript
export const metadata = {
  title: 'Page Title',
  description: '...',
  openGraph: { title, description, images },
  twitter: { card: 'summary_large_image' },
};
```

**Canonical URLs:** Already handled in `tools/[slug]/page.tsx` via `alternates.canonical`.

**sitemap.xml:** Add `next-sitemap` package post-migration:
```bash
npm install next-sitemap
```

---

## Routing Summary

| Route | Strategy | Notes |
|-------|----------|-------|
| `/` | Static (SSG) | Homepage — already done |
| `/tools` | Static (SSG) | Tool listing — already done |
| `/tools/[slug]` | Static (SSG+ISR) | Dynamic tool pages — already done |
| `/directory` | Static (SSG) | Directory — already done |
| `/login` | Static | Login page |
| `/signup` | Static | Signup page |
| `/about` | Static | About page |
| `/privacy` | Static | Privacy policy |
| `/terms` | Static | Terms of service |
| `/donate` | Static | Donate page |
| `/advertise` | Static | Advertise page |
| `/404` | `not-found.tsx` | Next.js built-in |

---

## Post-Migration Checklist

- [ ] Delete `src/pages/`, `src/layouts/`, stale Astro components
- [ ] Update `package.json` — remove Astro dependencies, keep Next.js deps
- [ ] Add `next-sitemap` for SEO
- [ ] Add `@tailwindcss/vite` or `@tailwindcss/postcss` to Next.js config
- [ ] Test all 19 tool pages work in Next.js
- [ ] Test auth flow (login, signup, logout)
- [ ] Test directory search
- [ ] Verify OG tags and meta descriptions on all pages
- [ ] Update Vercel deployment config

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| SEO drop during migration | Keep URLs identical — all routes map 1:1 |
| Auth breakage | Test cookie-based auth in Next.js before deleting Astro |
| Build size bloat | React components are already client-only — no SSR cost |
| Deployment downtime | Deploy Next.js to separate preview URL first, swap when verified |

---

## When to Do Each Phase

| Phase | When | Why |
|-------|------|-----|
| Phase 1 | Any time | Low risk, just copy-paste |
| Phase 2 | Before deleting Astro | Auth must work in Next.js first |
| Phase 3 | Optional | Can run against Astro API proxy still |
| Phase 4 | Last | After all pages verified working in Next.js |

**Recommended:** Do Phase 1 + 2 fully before deleting any Astro files. Run both in parallel until auth is confirmed working.
