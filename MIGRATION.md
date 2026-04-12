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

### ✅ Phase 1: Static Marketing Pages — DONE

All pages migrated:

| Page | Next.js Route | Status |
|------|---------------|--------|
| About | `app/about/page.tsx` | ✅ |
| Privacy | `app/privacy/page.tsx` | ✅ |
| Terms | `app/terms/page.tsx` | ✅ |
| Donate | `app/donate/page.tsx` | ✅ |
| Advertise | `app/advertise/page.tsx` | ✅ |
| 404 | `app/not-found.tsx` | ✅ |

### ✅ Phase 2: Auth Pages — DONE

Both pages created as client components:

| Page | Next.js Route | Status |
|------|---------------|--------|
| Login | `app/login/page.tsx` | ✅ |
| Signup | `app/signup/page.tsx` | ✅ |

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

### ✅ Phase 3: Directory — Already Done

`app/directory/page.tsx` was already built in the initial Next.js scaffold.

### ⏳ Phase 4: Cleanup — Pending

**Do this after verifying auth works in Next.js:**

Delete migrated Astro files:
```
src/pages/           ← entire directory (stale, migrated)
src/layouts/        ← entire directory (BaseLayout, ToolLayout)
src/components/
  ToolCard.astro    ← stale
  SponsorCard.astro  ← stale
  SponsorSlot.astro  ← stale
  UsageLimitPopup.astro ← stale
  SponsorSlot.astro  ← stale
```

**Do NOT delete:**
- `src/components/tools/*.tsx` — all 19 React client components
- `src/lib/` — API client, auth, usage tracking
- `public/` — assets
- `blog/` — markdown blog posts

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
