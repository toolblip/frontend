# Toolblip Task List

## Phase 0: Ship It
- [ ] Fix Railway frontend deployment (`toolblip.com` returns 502)
- [ ] Verify `toolblip.com` serves correctly over HTTPS
- [ ] Verify `api.toolblip.com` still responding
- [ ] Set up Railway auto-deploy from GitHub `main` branch
- [ ] Fix or replace Port Scanner tool (browser CORS limitation)
- [ ] Test all 36 tools work on production
- [ ] Mobile responsiveness audit — test every tool on mobile viewport
- [ ] Verify 404 page works for invalid tool slugs
- [ ] Verify `error.tsx` renders correctly (lucide-react installed)
- [ ] Remove stale Vercel project / clean up old deployments

## Phase 1: Polish & Core Pages
### Homepage
- [ ] Hero section with tagline + CTA ("36 Free Developer Tools. No signup. No tracking.")
- [ ] Featured/popular tools grid (top 8-12)
- [ ] Category quick-nav (Text, Developer, Image, CSS, SEO, Color, Conversion, Math)
- [ ] "Why Toolblip?" section (free, no signup, client-side privacy, fast)
- [ ] Footer: links, copyright, social

### Site Pages
- [ ] `/about` — what is Toolblip, who's behind it, mission
- [ ] `/privacy` — privacy policy (tools run client-side, minimal data)
- [ ] `/terms` — terms of service
- [ ] `/blog` — working blog index (can start with launch post)
- [ ] `/api-docs` — public API documentation
- [ ] `/directory` — full categorized tools directory (or redirect to `/tools`)
- [ ] `/advertise` — advertising info placeholder
- [ ] `/donate` — Ko-fi / Buy Me a Coffee link

### SEO Foundation
- [ ] Dynamic `<title>` and `<meta description>` per tool page
- [ ] Open Graph tags for social sharing (per tool)
- [ ] Verify `sitemap.xml` includes all 36 tools
- [ ] `robots.txt` — allow all
- [ ] Structured data (JSON-LD WebApplication schema) per tool
- [ ] Canonical URLs on all pages
- [ ] Google Search Console — verify & submit sitemap

### UX Polish
- [ ] Loading states for tools that fetch external data
- [ ] Consistent copy-to-clipboard experience across all tools
- [ ] Breadcrumbs on tool pages (Home > Category > Tool)
- [ ] "Related tools" section on each tool page
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
