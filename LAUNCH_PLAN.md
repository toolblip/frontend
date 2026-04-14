# Toolblip Static Launch Plan

*Compiled: April 8, 2026. Based on current site audit and existing research.*

---

## 1. Can Toolblip Launch With the Static Site As-Is?

**Yes.** The site is launch-ready today with minor gaps.

What's already in place:
- 10 functional tools, all 100% client-side
- Clean homepage with hero, trust badges, and tool grid
- `/tools/` index page with all tools listed
- `ToolLayout.astro` with breadcrumbs, JSON-LD schema (BreadcrumbList + SoftwareApplication), related tools, and Crontinel sponsor slots
- `BaseLayout.astro` with full SEO meta (OG, Twitter cards, canonical URLs), GA4 with consent-gated loading, cookie consent banner
- Privacy policy and Terms of Service pages
- `robots.txt` with sitemap reference
- Auto-generated sitemap via `@astrojs/sitemap`
- Security headers (`_headers` file: CSP, X-Frame-Options, Referrer-Policy)
- Immutable caching for static assets
- Built `dist/` directory ready to serve
- Cloudflare Pages deployment configured via `wrangler.toml`

What's missing for a credible launch (minor, fixable in hours):
- No `/about` page (AdSense wants this; also builds trust)
- No 404 page
- No OG images (the `ogImage` prop exists in BaseLayout but no images are provided)
- No FAQ sections on tool pages (slots exist in ToolLayout but most tools don't fill them)
- No "How to Use" content on tool pages (slot exists, unused)
- Tools index is duplicated (homepage and `/tools/` have identical hardcoded tool arrays instead of a central registry)

None of these block a launch. The site works, looks professional, and every tool functions correctly.

---

## 2. Current Tool Inventory

| # | Tool | Slug | Category | Dependencies | Status |
|---|------|------|----------|-------------|--------|
| 1 | Word Counter | `/tools/word-counter/` | Text | None (pure JS) | Ready |
| 2 | Character Counter | `/tools/character-counter/` | Text | None (pure JS) | Ready |
| 3 | JSON Formatter | `/tools/json-formatter/` | Developer | None (pure JS) | Ready |
| 4 | Base64 Encode/Decode | `/tools/base64/` | Developer | None (pure JS) | Ready |
| 5 | Case Converter | `/tools/case-converter/` | Text | None (pure JS) | Ready |
| 6 | URL Encode/Decode | `/tools/url-encode/` | Developer | None (pure JS) | Ready |
| 7 | Image Cropper | `/tools/image-cropper/` | Image | Cropper.js (CDN) | Ready |
| 8 | UUID Generator | `/tools/uuid-generator/` | Developer | None (Web Crypto) | Ready |
| 9 | Remove Duplicate Lines | `/tools/remove-duplicate-lines/` | Text | None (pure JS) | Ready |
| 10 | Markdown to HTML | `/tools/markdown-to-html/` | Developer | marked (CDN likely) | Ready |

All 10 tools are built, functional, and have proper SEO titles, meta descriptions, and structured data. Each tool has a related-tools section linking to 2-3 other tools.

The site ships zero npm runtime dependencies for tools (Cropper.js and marked load from CDN or are inlined). Build deps are Astro, Tailwind, and the Cloudflare adapter.

---

## 3. MVP Launch Requirements

### Must exist for a credible launch (do before announcing anywhere):

1. **About page** (`/about`) -- 1-2 paragraphs about who built it and why. Required for AdSense approval. Takes 30 minutes.
2. **404 page** -- Astro supports `src/pages/404.astro`. Takes 15 minutes.
3. **Google Search Console verification** -- DNS TXT record via Cloudflare. Submit sitemap. Takes 10 minutes.
4. **GA4 measurement ID set** -- The `PUBLIC_GA_MEASUREMENT_ID` env var must be set in Cloudflare Pages. Takes 5 minutes.

### Should exist but won't block launch:

5. **"How to Use" steps on 3-4 flagship tools** -- JSON Formatter, Image Cropper, Base64. The slot already exists in ToolLayout. Adds SEO content depth. 1 hour total.
6. **FAQ sections on 3-4 flagship tools** -- Same story. The slot exists. 1 hour total.
7. **OG images** -- Even a single branded template image (`/og/default.png`) set as the fallback would be better than nothing. 30 minutes.
8. **Centralize the tool array** -- The homepage and `/tools/` page both hardcode the same tool list. Extract to a shared `src/data/tools.ts` file. 30 minutes. Prevents drift.

### Does NOT need to exist at launch:

- Category hub pages (`/tools/text/`, `/tools/developer/`)
- Tool search/filter
- AdSense (apply after launch; approval takes 1-4 weeks anyway)
- Backend API, auth, saved history
- Dark mode toggle (already dark by default)

---

## 4. Fake-Door Validation

These features can be tested as "coming soon" or waitlist captures before building them. Place these as UI elements on existing pages to gauge interest.

| Feature | Fake-Door Placement | What to Measure |
|---------|---------------------|----------------|
| **Save history / favorites** | Small "Save" button (grayed out) on each tool with tooltip "Coming soon -- sign up to get notified" | Click rate on disabled button |
| **API access** | Footer link "Toolblip API (coming soon)" on developer tools | Click-through to a `/api` landing page with email capture |
| **Browser extension** | Banner on homepage: "Want Toolblip in your browser toolbar?" with email input | Email signups |
| **Bulk file processing** | "Process multiple files" toggle (disabled) on Image Cropper and future image tools | Click rate |
| **Export to cloud** | "Save to Google Drive" button (grayed) on tools that produce output files | Click rate |
| **Pro plan** | Tiny "Pro" badge next to planned premium features in the tool grid with "notify me" | Email signups; validates willingness to pay before building auth |

The email capture for API access and browser extension are the highest-signal fake doors. Both require only a static landing page with an email input that writes to a Google Sheet (via a Cloudflare Pages Function or a simple form service like Formspree).

---

## 5. Optimal Order of Initial Tools for SEO + Utility

The 10 existing tools are a strong base. Here are the next tools to build, ordered by (search volume x rankability / build effort):

### Priority 1: Build in first 2 weeks post-launch (highest ROI)

| # | Tool | Est. Monthly Searches | KD | Build Time | Why Now |
|---|------|----------------------|-----|-----------|---------|
| 11 | **Regex Tester** | 400K-800K | 25 | 4 hrs | Core dev tool, high utility, drives repeat visits |
| 12 | **Hash Generator (SHA-256/MD5)** | 150K-300K | 14 | 2 hrs | Web Crypto API, zero deps, quick build |
| 13 | **Lorem Ipsum Generator** | 300K-600K | 15 | 2 hrs | Pure JS, high volume, trivial to build |
| 14 | **Unix Timestamp Converter** | 100K-200K | 12 | 2 hrs | Pure JS, devs search this constantly |
| 15 | **JWT Decoder** | 100K-200K | 14 | 2 hrs | Pure JS, no library needed, dev audience |

### Priority 2: Build in weeks 3-4 (image/conversion tools unlock a new category)

| # | Tool | Est. Monthly Searches | KD | Build Time | Why Now |
|---|------|----------------------|-----|-----------|---------|
| 16 | **WebP to JPG** | 200K-400K | 18 | 2 hrs | Canvas API, massive volume, trivial build |
| 17 | **HEIC to JPG** | 300K-600K | 20 | 4 hrs | heic2any lib, huge volume, low competition |
| 18 | **SVG to PNG** | 150K-300K | 14 | 2 hrs | Canvas API, very simple |
| 19 | **CSV to JSON** | 150K-300K | 14 | 3 hrs | papaparse, dev audience |
| 20 | **JSON to CSV** | 100K-200K | 13 | 1 hr | Built alongside CSV to JSON |

### Why this order works:

- Tools 11-15 are all **zero-dependency pure JS** builds that can ship in a single day. They target developer keywords (KD 12-25) where a new site can rank in 3-6 months.
- Tools 16-20 open the **image conversion** and **data format** categories, which have the highest raw search volume in the low-KD band. Image conversion tools (WebP/HEIC) are the single biggest organic traffic opportunity for a tools site.
- Every tool cross-links to existing tools and to each other, building internal link authority across the site.

---

## 6. 30-Day Launch Sequence

### Day 0 (Launch Day)

- [ ] Create `/about` page
- [ ] Create `404.astro` page
- [ ] Set GA4 measurement ID in Cloudflare Pages env
- [ ] Verify domain in Google Search Console, submit sitemap
- [ ] Verify in Bing Webmaster Tools, submit sitemap
- [ ] Deploy to production (push to main)
- [ ] Manually request indexing for homepage and `/tools/` in Search Console

### Days 1-3: Announce

- [ ] Post to Reddit: r/webdev ("I built a free client-side dev tools site"), r/SideProject
- [ ] Post on X (@HarunRRayhan) with screenshots of 2-3 tools
- [ ] Submit to Product Hunt (schedule for a weekday morning)
- [ ] Submit to HackerNews (Show HN)
- [ ] Submit to tool directories: alternativeto.net, toolbox.so

### Days 4-7: Content + SEO hardening

- [ ] Add "How to Use" and FAQ sections to the 4 highest-traffic tools (JSON Formatter, Base64, UUID Generator, Word Counter)
- [ ] Add a default OG image for social sharing
- [ ] Monitor Search Console for crawl errors daily
- [ ] Centralize tool array into `src/data/tools.ts`

### Days 8-14: Ship 5 new tools

- [ ] Build and deploy: Regex Tester, Hash Generator, Lorem Ipsum Generator, Unix Timestamp Converter, JWT Decoder
- [ ] Add "How to Use" + FAQ to each new tool
- [ ] Cross-link all new tools with existing related tools
- [ ] Apply for Google AdSense (site now has 15 tool pages + about + privacy + terms = 18 pages)

### Days 15-21: Image conversion tools

- [ ] Build and deploy: WebP to JPG, HEIC to JPG, SVG to PNG
- [ ] Add image tools category section to homepage
- [ ] Create `/tools/image/` category hub page (optional but good for SEO)

### Days 22-30: Data format tools + review

- [ ] Build and deploy: CSV to JSON, JSON to CSV
- [ ] Review Search Console: which pages are indexed? Which keywords are showing impressions?
- [ ] Review GA4: which tools get the most usage? Where do users drop off?
- [ ] Check Core Web Vitals in Search Console (data takes 2-4 weeks to populate)
- [ ] If AdSense approved: add 2 manual ad placements per tool page (already have sponsor slot placeholders in ToolLayout)

**End of Day 30 target: 20 tools live, indexed in Google, AdSense applied for, initial traffic data flowing.**

---

## 7. 90-Day Expansion Sequence (Days 31-90)

### Days 31-45: PDF tools (new high-volume category)

- [ ] Build: Rotate PDF, Image to PDF, PDF to Image (using pdf-lib + PDF.js)
- [ ] Build: Merge PDF, Split PDF (pdf-lib)
- [ ] Create `/tools/pdf/` category hub
- [ ] These 5 tools target 1.5M-3M combined monthly searches

### Days 46-60: Grow image + dev tool depth

- [ ] Build: Compress Image (browser-image-compression), Resize Image (Canvas API)
- [ ] Build: Color Picker, Hex to RGB/HSL, Contrast Checker (WCAG)
- [ ] Build: YAML to JSON, JSON to YAML (js-yaml)
- [ ] Build: Cron Expression Parser (cronstrue -- on-brand with Crontinel, cross-promo opportunity)
- [ ] Build: Text Diff / Compare (diff npm lib)

### Days 61-75: High-value additions

- [ ] Build: Remove Image Background (@imgly/background-removal WASM -- biggest differentiator vs competitors who require cloud APIs)
- [ ] Build: QR Code Generator (qrcode npm lib)
- [ ] Build: Social Media Image Resizer (Instagram/Twitter/LinkedIn presets in one tool)
- [ ] Build: Percentage Calculator, Age Calculator (massive volume, trivial builds)
- [ ] Set up fake-door pages for API access and browser extension

### Days 76-90: Optimization + monetization

- [ ] Review all tool pages for SEO: update titles, descriptions, and content based on actual Search Console keyword data
- [ ] Add FAQ schema markup to all tool pages (drives rich snippets in search results)
- [ ] If traffic exceeds 10K monthly sessions: apply to Ezoic for better ad RPM
- [ ] Build email capture for waitlist (API access, Pro plan, browser extension)
- [ ] Evaluate fake-door data: which features had the highest click-through? Plan backend work accordingly.
- [ ] Target: 40+ tools live, early organic traffic from long-tail keywords, ad revenue starting

### Monthly tool velocity target after Day 90:

Ship 4-6 tools per month. Each new tool is a new indexable page targeting a specific keyword. The site compounds in value as it builds topical authority across text, developer, image, PDF, and conversion tool categories.

---

## 8. Directory Launch (Days 61-120)

The directory launches after the core tool site has 30+ tools. Its purpose is to surface third-party tools and MCP servers to the same audience that uses Toolblip's first-party tools.

### Days 61-75: Directory Infrastructure

- [ ] Create `src/data/directory/` folder structure
- [ ] Build 20-30 seed entries manually (high-quality tools in dev and image categories)
- [ ] Build `public/directory-manifest.json` aggregation script (run at build time)
- [ ] Create `/directory/` index page with client-side filtering (same pattern as `/tools/`)
- [ ] Create `/directory/submit/` form page (static form, submissions written to staging via Cloudflare Pages Function)
- [ ] Add directory entry pages to sitemap

### Days 76-90: MCP Server Launch Prep

- [ ] Scaffold `@toolblip/mcp-server-tools` repo (TypeScript, MCP SDK, 10 initial functions)
- [ ] Scaffold `@toolblip/mcp-server-reference` repo with seed reference data (HTTP status codes, MIME types)
- [ ] Implement functions in `toolblip-tools`: base64, url, sha256, uuid, json_format, json_minify, html_escape, unix_timestamp, csv_to_json, regex_test
- [ ] Create `/mcp/tools/` landing page on toolblip.com with install instructions
- [ ] Publish `@toolblip/mcp-server-tools` and `@toolblip/mcp-server-reference` to npm
- [ ] Add both MCP servers as entries in the directory

### Days 91-105: MCP Expansion + Directory Growth

- [ ] Expand `toolblip-tools` to 20+ functions (yaml, xml, md5, jwt_decode, cron_parser, etc.)
- [ ] Implement `toolblip-directory` MCP server (reads from directory-manifest.json)
- [ ] Create `/mcp/directory/` and `/mcp/reference/` landing pages
- [ ] Publish `toolblip-directory` to npm
- [ ] Grow directory to 50+ entries (web tools + MCP servers)
- [ ] Announce MCP servers on HackerNews and relevant AI/developer communities

### Days 106-120: Directory SEO + Monetization

- [ ] Add featured listing slots to directory category pages
- [ ] Set up affiliate accounts with top-ranked paid tools
- [ ] Create `/directory/category/[cat]/` pages for all categories
- [ ] Submit to MCP community registries and directories
- [ ] Review: monitor npm downloads, directory traffic, referral conversions

**Target at Day 120: 50+ directory entries, 3 MCP servers on npm, MCP server docs on toolblip.com**

---

## 9. What Not to Build Yet

These are tempting but premature. Do not start them until the milestones above are hit.

| What | Why Not Yet |
|------|-------------|
| Backend / user accounts | The static site works for 100+ tools. Add auth only when fake-door validation shows demand for saved history. |
| Paid tier / Pro features | Build an audience first. A free tool with 50K monthly visitors converts better to paid than a paid tier with 100 users. |
| Browser extension | Fake-door email capture validates demand before writing extension code. |
| Mobile app | No evidence the audience wants a native app. |
| AI-generated tool descriptions | Toolblip's editorial voice should be human-written. AI can assist research but not author final copy. |
| Multi-language support | English covers 95% of target keywords. Add i18n only when a second language has enough volume to justify maintenance. |
| Community features (comments, ratings) | Adds moderation burden and liability. Directory submissions replace community voting with editorial curation. |

---

## TL;DR Recommendation

1. **Launch now.** The site is ready. Add an `/about` page and a 404 page (1 hour of work), then deploy.

2. **The 10 existing tools are enough for a credible launch.** Word counter, JSON formatter, Base64, UUID generator, image cropper -- these cover the core dev utility set. No tool is half-built or broken.

3. **First tools to add post-launch: Regex Tester, Hash Generator, Lorem Ipsum Generator, Unix Timestamp Converter, JWT Decoder.** All pure JS, all buildable in one day, all target developer search queries.

4. **Biggest organic traffic opportunity: image format conversion (WebP to JPG, HEIC to JPG).** These have 200K-600K monthly searches at KD 18-20. Build them in week 3.

5. **Do not wait for AdSense approval to launch.** Apply after the site has 15+ pages (day 8-14). The sponsor slot placeholders for Crontinel are already in place and serve as house ads in the meantime.

6. **Do not build the Laravel backend yet.** The static site can grow to 40+ tools and meaningful traffic before auth/history/API features matter. Backend work should be triggered by fake-door validation data, not by assumption.

7. **Fake-door the API and browser extension.** These are the two features most likely to convert developers into returning users. Test demand with email capture before writing code.

8. **Ship 2-3 tools per week for the first 90 days.** Each tool is a new keyword target. The site's value compounds with every tool added. Speed of shipping matters more than polish at this stage.

9. **Start the directory at Day 61.** After the core tool site is established and 30+ tools are live, shift some engineering time to building the directory. By Day 90 it should have 50+ curated entries and be generating affiliate revenue signals.

10. **Build MCP servers in parallel with the directory.** They share engineering investment (TypeScript, documentation, npm ops) and serve the same goal: making Toolblip the go-to utility layer for both humans and AI agents. Three servers (tools, reference, directory) can each be built in roughly 1 week by a single engineer.
