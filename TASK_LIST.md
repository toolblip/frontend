# Toolblip Task List

## Phase 0: Ship It
- [ ] Fix Railway frontend deployment (`toolblip.com` returns 502)
- [ ] Verify `toolblip.com` serves correctly over HTTPS
- [ ] Verify `api.toolblip.com` still responding
- [ ] Set up Railway auto-deploy from GitHub `main` branch
- [x] Fix or replace Port Scanner tool → kept as "Coming Soon" (CORS limitation)
- [x] Test all tools build without TypeScript errors ✅
- [ ] Mobile responsiveness audit — test every tool on mobile viewport
- [ ] Verify 404 page works for invalid tool slugs
- [ ] Verify `error.tsx` renders correctly (lucide-react installed ✅)
- [x] Remove stale Vercel project / clean up old deployments ✅ (workflow deleted)

## Phase 1: Polish & Core Pages
### Homepage
- [x] Hero section with tagline + CTA ("36 Free Developer Tools. No signup. No tracking.") ✅
- [x] Featured/popular tools grid (top 8-12) ✅
- [x] Category quick-nav (Text, Developer, Image, CSS, SEO, Color, Conversion, Math) ✅
- [x] "Why Toolblip?" section (free, no signup, client-side privacy, fast) ✅
- [x] Footer: links, copyright, social ✅

### Site Pages
- [x] `/about` ✅
- [x] `/privacy` ✅
- [x] `/terms` ✅
- [ ] `/blog` — working blog index (needs at least 1 post)
- [x] `/api-docs` ✅
- [x] `/directory` ✅
- [x] `/advertise` ✅
- [x] `/donate` ✅

### SEO Foundation
- [x] Dynamic `<title>` and `<meta description>` per tool page ✅
- [x] Open Graph tags for social sharing (per tool) ✅
- [x] Verify `sitemap.xml` includes all 36 tools ✅
- [x] `robots.txt` — allow all ✅
- [x] Structured data (JSON-LD WebApplication schema) per tool ✅
- [x] Canonical URLs on all pages ✅
- [ ] Google Search Console — verify & submit sitemap

### UX Polish
- [ ] Loading states for tools that fetch external data
- [ ] Consistent copy-to-clipboard experience across all tools
- [x] Breadcrumbs on tool pages (Home > Category > Tool) ✅
- [x] "Related tools" section on each tool page ✅
- [ ] Dark/light mode QA on ALL pages
- [ ] Smooth page transitions / loading spinner

## Phase 2: Content & Blog
### Launch Content
- [ ] "Introducing Toolblip" — launch blog post
- [ ] "36 Free Online Developer Tools" — listicle post
- [ ] "Top 10 CSS Tools Every Developer Needs" — niche post
- [ ] "JSON Formatter: How to Pretty-Print JSON" — tool tutorial
- [ ] "Regex Cheat Sheet + Online Tester" — SEO magnet post

### Content Strategy
- [ ] One blog post per tool category (8 categories × 1 post)
- [ ] Internal linking: each blog post links to relevant tools
- [ ] Keyword-rich tool descriptions (target long-tail: "online json formatter", "css gradient generator", "color contrast checker")

### Content Calendar
- [ ] Week 1-2: Launch post + 3 category posts
- [ ] Week 3-4: 3 more category posts
- [ ] Month 2+: 1 post/week targeting specific tool keywords
