# Toolblip Task List

## Phase 0: Ship It
- [x] Fix Railway frontend deployment (`toolblip.com` returns 502) ✅ FIXED — targetPort was 3000, app listens on 8080
- [x] Verify `toolblip.com` serves correctly over HTTPS ✅ VERIFIED — HTTP 200
- [x] Verify `api.toolblip.com` still responding ✅ VERIFIED — HTTP 200, 35 tools
- [x] Set up Railway auto-deploy from GitHub `main` branch ✅ Auto-deploys on push
- [x] Fix or replace Port Scanner tool → kept as "Coming Soon" (CORS limitation)
- [x] Test all tools build without TypeScript errors ✅
- [ ] Mobile responsiveness audit — test every tool on mobile viewport
- [ ] Verify 404 page works for invalid tool slugs
- [x] Verify `error.tsx` renders correctly ✅ (lucide-react installed)
- [x] Remove stale Vercel project / clean up old deployments ✅

## Phase 1: Polish & Core Pages
### Homepage
- [x] Hero section with tagline + CTA ✅
- [x] Featured/popular tools grid (top 8-12) ✅
- [x] Category quick-nav ✅
- [x] "Why Toolblip?" section ✅
- [x] Footer: links, copyright, social ✅

### Site Pages
- [x] `/about` ✅
- [x] `/privacy` ✅
- [x] `/terms` ✅
- [ ] `/blog` — needs content (launch post written ✅, needs indexing)
- [x] `/api-docs` ✅
- [x] `/directory` ✅
- [x] `/advertise` ✅
- [x] `/donate` ✅

### SEO Foundation
- [x] Dynamic `<title>` and `<meta description>` per tool page ✅
- [x] Open Graph tags for social sharing (per tool) ✅
- [x] `sitemap.xml` includes all 36 tools ✅
- [x] `robots.txt` ✅
- [x] Structured data (JSON-LD WebApplication schema) per tool ✅
- [x] Canonical URLs ✅
- [ ] Google Search Console — verify & submit sitemap

### UX Polish
- [ ] Loading states for tools that fetch external data
- [ ] Consistent copy-to-clipboard experience across all tools
- [x] Breadcrumbs on tool pages ✅
- [x] "Related tools" section on each tool page ✅
- [ ] Dark/light mode QA on ALL pages
- [ ] Smooth page transitions / loading spinner

## Phase 2: Content & Blog
### Launch Content
- [x] "Introducing Toolblip" — launch blog post ✅
- [ ] "36 Free Online Developer Tools" — listicle post
- [ ] "Top 10 CSS Tools Every Developer Needs" — niche post
- [ ] "JSON Formatter: How to Pretty-Print JSON" — tool tutorial
- [ ] "Regex Cheat Sheet + Online Tester" — SEO magnet post

### Content Strategy
- [ ] One blog post per tool category (8 categories × 1 post)
- [ ] Internal linking: each blog post links to relevant tools
- [ ] Keyword-rich tool descriptions

### Content Calendar
- [ ] Week 1-2: Launch post + 3 category posts
- [ ] Week 3-4: 3 more category posts
- [ ] Month 2+: 1 post/week targeting specific tool keywords
