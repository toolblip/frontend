# Toolblip MVP Launch Plan

**Date:** April 17, 2026
**Goal:** Launch Toolblip as a polished, marketable free online tools platform

---

## Phase 0: Ship It (Fix What's Broken) — 1-2 days
*Nothing launches if the site doesn't work.*

### Infrastructure
- [ ] Fix Railway frontend deployment (custom domain `toolblip.com` → 502)
- [ ] Verify `toolblip.com` serves correctly over HTTPS
- [ ] Remove stale Vercel project (done ✅ — workflow deleted)
- [ ] Verify `api.toolblip.com` still responding
- [ ] Set up Railway auto-deploy from GitHub `main` branch
- [ ] Test all 36 tools work on production

### Critical Fixes
- [ ] Port Scanner — currently "Coming Soon" (browser CORS limitation). Either build a server-side proxy or replace with a different tool
- [ ] Mobile responsiveness audit — test every tool on mobile viewport
- [ ] 404 page — verify it works for invalid tool slugs
- [ ] Error boundary — verify `error.tsx` renders correctly (lucide-react now installed)

---

## Phase 1: Polish & Core Pages — 3-5 days
*Make it look like a real product, not a side project.*

### Homepage
- [ ] Hero section with tagline + CTA (e.g., "36 Free Developer Tools. No signup. No tracking.")
- [ ] Featured/popular tools grid (top 8-12)
- [ ] Category quick-nav (Text, Developer, Image, CSS, SEO, Color, Conversion, Math)
- [ ] "Why Toolblip?" section (free, no signup, client-side privacy, fast)
- [ ] Footer: links, copyright, social

### Site Pages
- [ ] `/about` — what is Toolblip, who's behind it, mission
- [ ] `/privacy` — privacy policy (tools run client-side, minimal data collection)
- [ ] `/terms` — terms of service
- [ ] `/blog` — working blog index page (can start empty or with a launch post)
- [ ] `/api-docs` — public API documentation (even if basic)
- [ ] `/directory` — full categorized tools directory (can redirect to `/tools`)
- [ ] `/advertise` — advertising info (future monetization placeholder)
- [ ] `/donate` — support the project (Ko-fi / Buy Me a Coffee link)

### SEO Foundation
- [ ] Dynamic `<title>` and `<meta description>` per tool page
- [ ] Open Graph tags for social sharing (per tool)
- [ ] `sitemap.xml` (already exists — verify it includes all tools)
- [ ] `robots.txt` — allow all
- [ ] Structured data (JSON-LD) for each tool (WebApplication schema)
- [ ] Canonical URLs
- [ ] Google Search Console — verify & submit sitemap

### UX Polish
- [ ] Loading states for tools that fetch external data
- [ ] Consistent copy-to-clipboard experience across all tools
- [ ] Tool page breadcrumbs (Home > Category > Tool)
- [ ] "Related tools" section on each tool page
- [ ] Dark/light mode toggle working on ALL pages (mostly done ✅)
- [ ] Smooth page transitions (loading spinner)

---

## Phase 2: Content & Blog — 1-2 weeks (parallel with Phase 1)
*Organic traffic engine starts here.*

### Launch Content
- [ ] "Introducing Toolblip" — launch blog post
- [ ] "36 Free Online Developer Tools" — listicle-style post
- [ ] "Top 10 CSS Tools Every Developer Needs" — niche post
- [ ] "JSON Formatter: How to Pretty-Print JSON" — tool-specific tutorial
- [ ] "Regex Cheat Sheet + Online Tester" — SEO magnet post

### Content Strategy
- [ ] One blog post per tool category (8 categories × 1 post = 8 posts)
- [ ] Each blog post links to relevant tools → internal linking for SEO
- [ ] Target long-tail keywords: "online json formatter", "css gradient generator", "color contrast checker"
- [ ] Each tool page itself IS SEO content — ensure descriptions are keyword-rich

### Content Calendar
- Week 1-2: Launch post + 3 category posts
- Week 3-4: 3 more category posts
- Month 2+: 1 post/week targeting specific tool keywords

---

## Phase 3: Marketing & Distribution — Week 2-4 (overlaps with Phase 2)
*Get eyeballs on the product.*

### Launch Day Checklist
- [ ] Product Hunt launch (prepare title, tagline, first comment, maker images)
- [ ] Hacker News "Show HN" post
- [ ] Reddit posts: r/webdev, r/SideProject, r/coolgithubprojects, r/frontend
- [ ] Twitter/X thread: "I built 36 free developer tools"
- [ ] Dev.to cross-post of launch blog
- [ ] LinkedIn post (developer audience)

### Community Seeding
- [ ] Answer Stack Overflow questions linking to relevant tools (naturally, not spammy)
- [ ] Post in Discord communities (The Coding Den, Web Dev Cafe, etc.)
- [ ] Share in relevant Facebook/LinkedIn groups
- [ ] Submit to tool directories: TinyWow alternatives, CyberChef alternatives lists
- [ ] Submit to "awesome" lists on GitHub (awesome-web-tools, etc.)

### Social Presence
- [ ] Create @toolblip on Twitter/X
- [ ] Create Toolblip GitHub organization (done ✅)
- [ ] Pin a "tool of the week" tweet thread
- [ ] Share tool-specific tips as micro-content

### Developer Relations
- [ ] Create a `/tools` API for programmatic access (public, rate-limited)
- [ ] Write "Toolblip API: Free Developer Tools via API" blog post
- [ ] Submit to RapidAPI / public API directories

---

## Phase 4: Growth & Monetization — Month 2+

### Monetization (Light Touch)
- [ ] Carbon ads / EthicalAds on tool pages (developer-friendly, non-intrusive)
- [ ] Optional: premium features (saved tool history, custom presets)
- [ ] `/advertise` page with real pricing and traffic stats
- [ ] GitHub Sponsors / Ko-fi donate link

### Growth Features
- [ ] "Share your result" feature on tools (generates shareable URL/image)
- [ ] Tool embeds — let developers embed tools on their sites
- [ ] Browser extension — quick access to tools from browser toolbar
- [ ] PWA support — install Toolblip as an app
- [ ] Tool favorites/bookmarks (localStorage, no account needed)

### Analytics & Iteration
- [ ] Privacy-friendly analytics (Plausible, Umami, or Simple Analytics)
- [ ] Track: page views per tool, tool usage, bounce rate, referral sources
- [ ] A/B test homepage variants
- [ ] Monitor search console for keyword opportunities
- [ ] Build more tools based on search demand

---

## Phase 5: Scale — Month 3+

### More Tools (Based on Demand)
- [ ] SQL Formatter
- [ ] Diff Checker (text compare)
- [ ] Password Generator
- [ ] QR Code Generator
- [ ] SVG Editor/Optimizer
- [ ] HTML to JSX Converter
- [ ] CSS to Tailwind Converter
- [ ] Timestamp Converter (Unix ↔ Human)
- [ ] IP Address Lookup
- [ ] DNS Lookup Tool

### Technical Improvements
- [ ] CDN caching for static assets (Cloudflare)
- [ ] Image optimization (WebP/AVIF)
- [ ] Core Web Vitals optimization
- [ ] Rate limiting on API
- [ ] Monitoring & uptime alerts
- [ ] Database backups (Railway PostgreSQL)

### Community Building
- [ ] Open source tool submissions (community contributes tools)
- [ ] Tool request board (users vote on what to build next)
- [ ] Newsletter: "Tool of the Week" email
- [ ] YouTube shorts/tutorials for individual tools

---

## Quick Reference: Current State

| Area | Status | Phase |
|------|--------|-------|
| Railway deployment | ❌ `toolblip.com` 502 | Phase 0 |
| 36 tools working | ✅ 35/36 (Port Scanner blocked) | Phase 0 |
| Homepage | 🟡 Basic, needs hero + CTA | Phase 1 |
| Blog | 🟡 Page exists, no content | Phase 1-2 |
| SEO | 🟡 Sitemap exists, no meta tags | Phase 1 |
| Auth | ✅ Login/Signup/Logout | Done |
| Guest mode | ✅ Works without API | Done |
| Dark/light mode | ✅ Working | Done |
| Logo | ✅ Finalized | Done |
| Marketing | ❌ Not started | Phase 3 |
| Analytics | ❌ Not set up | Phase 4 |

---

## Priority Order (Do This First)

1. **Fix Railway deployment** (Phase 0) ← blocking everything
2. **Homepage redesign** with hero + CTA (Phase 1)
3. **SEO meta tags** on every tool page (Phase 1)
4. **Launch blog post** (Phase 2)
5. **Product Hunt + Reddit launch** (Phase 3)
