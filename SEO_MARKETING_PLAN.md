# Toolblip SEO + Marketing Plan

*Compiled: April 11, 2026. Status: Pre-launch (DNS not yet configured).*

---

## Table of Contents

1. [Target Audience](#1-target-audience)
2. [Keyword Research](#2-keyword-research)
3. [On-Page SEO Checklist](#3-on-page-seo-checklist)
4. [Content Strategy](#4-content-strategy)
5. [Technical SEO](#5-technical-seo)
6. [Off-Page SEO + Link Building](#6-off-page-seo--link-building)
7. [GSC Monitoring](#7-gsc-monitoring)
8. [Distribution Channels](#8-distribution-channels)
9. [Launch Strategy (Weeks 1-4)](#9-launch-strategy-weeks-1-4)
10. [Community Building](#10-community-building)
11. [Toolblip MCP Package Marketing](#11-toolblip-mcp-package-marketing)
12. [Metrics to Track](#12-metrics-to-track)
13. [30-Day Sprint Plan](#13-30-day-sprint-plan)

---

## 1. Target Audience

### Segment A: Developer Power Users (primary)

**Who they are:** Full-stack and backend developers, DevOps engineers, and freelancers who constantly reach for browser-based tools. They have 12+ tabs open and bookmark utilities they use weekly.

**What they search for:**
- "json formatter online"
- "base64 decode online"
- "uuid generator"
- "regex tester online"
- "jwt decoder"

**Pain points:**
- Paid tools that gatekeep basic functionality
- Tools that send data server-side (privacy concern)
- Cluttered UIs with ads and upsells
- No reliable go-to site that has everything in one place

**What Toolblip solves:** 100% client-side, clean UI, fast, no account required. One domain for everything.

**Acquisition:** Google search (high intent), X/Twitter (tech community), Reddit r/webdev, r/programming.

---

### Segment B: AI/Agent Builders (secondary, growing fast)

**Who they are:** Developers building AI workflows, LLM applications, and agent pipelines. They use Claude, Cursor, VS Code + Continue, and are actively hunting for MCP servers to extend their agents.

**What they search for:**
- "MCP server list"
- "model context protocol tools"
- "Claude MCP server"
- "MCP server directory"
- "how to use MCP with Claude Code"

**Pain points:**
- MCP ecosystem is fragmented. Servers live in GitHub readmes, Discord threads, and scattered blog posts. No canonical registry exists.
- Discovery is manual and painful.
- Quality is wildly inconsistent. No curation signal.

**What Toolblip solves:** A curated, searchable MCP server directory + `@toolblip/mcp` packages that are production-ready and documented.

**Acquisition:** X/Twitter (AI developer Twitter is extremely active), HackerNews, GitHub, Model Context Protocol Discord.

---

### Segment C: Technical Non-Developers (tertiary, SEO volume)

**Who they are:** Designers, content creators, QA testers, data analysts, and operations people who occasionally need developer-adjacent tools. They find Toolblip via Google.

**What they search for:**
- "word counter online"
- "image converter"
- "webp to jpg"
- "remove duplicate lines"
- "lorem ipsum generator"

**Pain points:**
- They don't know what tool to use or trust. They pick the first Google result.
- They want simple, fast, no-nonsense tools.
- They are not your monetization path (yet) but they are your organic traffic flywheel.

**What Toolblip solves:** Clean tools that just work. No signup, no friction.

**Acquisition:** Entirely Google. These users do not hang out in communities where you can reach them proactively.

---

## 2. Keyword Research

### Primary Target Keywords (15+)

Priority is based on: **search volume + keyword difficulty + Toolblip's realistic ability to rank in 6 months** given a new domain.

| # | Keyword | Monthly Searches (est.) | KD (est.) | Intent | Priority | Notes |
|---|---------|------------------------|-----------|--------|----------|-------|
| 1 | json formatter online | 300K-600K | 30 | Transactional | **HIGH** | Core tool page. Exact-match slug already exists. |
| 2 | base64 decode online | 200K-400K | 22 | Transactional | **HIGH** | Core tool. High-intent dev keyword. |
| 3 | uuid generator | 150K-300K | 18 | Transactional | **HIGH** | Pure JS, already built. Easy to rank. |
| 4 | regex tester online | 400K-800K | 25 | Transactional | **HIGH** | Build this first post-launch (Priority 1 tool). |
| 5 | url encode decode online | 100K-200K | 16 | Transactional | **HIGH** | Already built. Low competition. |
| 6 | word counter online | 400K-800K | 28 | Transactional | **HIGH** | High volume. New site can compete in 4-6 months. |
| 7 | jwt decoder online | 100K-200K | 14 | Transactional | **HIGH** | Low KD. Dev audience. Build immediately post-launch. |
| 8 | webp to jpg online | 200K-400K | 18 | Transactional | **HIGH** | Highest volume image tool. Build week 3. |
| 9 | heic to jpg converter | 300K-600K | 20 | Transactional | **HIGH** | Very high volume. heic2any library makes this easy. |
| 10 | sha256 hash generator | 100K-200K | 13 | Transactional | **HIGH** | Web Crypto API. Zero deps. Fast to build. |
| 11 | lorem ipsum generator | 300K-600K | 15 | Transactional | **MED** | High volume but lots of competition. Still worth it. |
| 12 | unix timestamp converter | 100K-200K | 12 | Transactional | **MED** | Low KD. Devs search this constantly during debugging. |
| 13 | MCP server directory | 5K-20K | 8 | Transactional | **HIGH** | Low volume now but near-zero competition. Growing fast as MCP ecosystem expands. First-mover advantage. |
| 14 | what is an MCP server | 5K-15K | 6 | Informational | **MED** | Blog content target. Grows as MCP awareness spreads. |
| 15 | model context protocol tools | 5K-15K | 5 | Informational | **MED** | Blog content + directory page target. |
| 16 | Claude MCP server list | 3K-10K | 4 | Transactional | **HIGH** | Near-zero competition. Directory target. AI audience is high-intent. |
| 17 | toolblip vs smithery | <1K | 1 | Brand | **LOW** | Own this from day one with a dedicated comparison page or FAQ entry. |
| 18 | free developer tools online | 50K-150K | 35 | Informational | **LOW** | Broad, high KD. Target via homepage with long-form copy. Not a priority to rank for directly. |
| 19 | csv to json converter | 150K-300K | 14 | Transactional | **MED** | Build in first 30 days (Priority 2 tool). |
| 20 | remove duplicate lines online | 30K-60K | 10 | Transactional | **MED** | Already built. Very low KD. Should rank quickly. |

### Keyword Priority Summary

- **Win now (< 3 months):** remove duplicate lines, unix timestamp, jwt decoder, sha256, url encode, uuid generator, Claude MCP server list
- **Win at 3-6 months:** base64, word counter, json formatter, webp to jpg, MCP server directory
- **Win at 6-12 months:** regex tester, heic to jpg, lorem ipsum, csv to json
- **Informational content (blog):** what is an MCP server, model context protocol tools, how to use MCP with Claude Code

---

## 3. On-Page SEO Checklist

### Homepage (`/`)

- [ ] Title tag: `Toolblip — Free Online Developer Tools & MCP Server Directory` (under 60 chars)
- [ ] Meta description: Summarizes both pillars (tools + MCP directory). Include "free", "online", "developer tools". Under 155 chars.
- [ ] H1: One clear H1 that names what the site is. Currently unclear if set.
- [ ] Hero copy: Explain value in 2 sentences. No jargon. Human-readable.
- [ ] OG image: Branded image (dark bg, Toolblip logo, tagline). Required for Twitter/X cards and link previews.
- [ ] Canonical URL: `https://toolblip.com/` (no trailing slash inconsistencies)
- [ ] Structured data: `WebSite` schema with `SearchAction` (enables Google Sitelinks Search Box if traffic warrants it)
- [ ] Internal links: Homepage links to `/tools/`, `/mcp/`, and at least the top 6 individual tool pages
- [ ] Mobile: Verify layout on 375px viewport. Tailwind should handle this but verify.
- [ ] Core Web Vitals: LCP target < 2.5s, CLS < 0.1 (static site on CF Pages should easily hit this)

### Tool Pages (`/tools/[slug]/`)

- [ ] Title tag: `[Tool Name] — Free Online Tool | Toolblip` (e.g., "JSON Formatter — Free Online Tool | Toolblip")
- [ ] Meta description: Describe what the tool does + key feature (free, client-side, no signup). Mention primary keyword naturally.
- [ ] H1: `[Tool Name]` — exact match or close variant of target keyword
- [ ] H2: "How to Use [Tool Name]" — steps section (3-5 numbered steps)
- [ ] H2: "Frequently Asked Questions" — at least 3 FAQs per tool
- [ ] FAQ schema (`FAQPage` JSON-LD) — drives rich snippets in SERPs
- [ ] `SoftwareApplication` schema — already in ToolLayout, verify `applicationCategory`, `operatingSystem`, `offers` fields are populated
- [ ] `BreadcrumbList` schema — already in ToolLayout, verify
- [ ] Canonical URL: self-referencing, HTTPS, no trailing slash conflicts
- [ ] Related tools section: 2-3 internal links to related tools (already in ToolLayout)
- [ ] OG image: Tool-specific OG image (or branded default as fallback)
- [ ] Word count: Tool pages should have at least 300 words of human-readable content (tool description + how-to + FAQ = easily 400+ words)
- [ ] Primary keyword in: title, H1, first 100 words of content, meta description
- [ ] Internal link from at least one other existing page

### Tools Index (`/tools/`)

- [ ] Title tag: `All Free Online Developer Tools | Toolblip`
- [ ] Meta description: "Browse [N] free, client-side developer tools. No signup required. JSON formatter, Base64, UUID generator, image converters, and more."
- [ ] H1: `Developer Tools`
- [ ] Intro paragraph: 2-3 sentences explaining what the page is. Include primary keywords.
- [ ] Filter/search (client-side): Already planned. Helps users and reduces bounce.
- [ ] Category section headers: Use H2 for each category (Text Tools, Developer Tools, Image Tools, etc.)
- [ ] Structured data: `ItemList` schema listing all tools with `name`, `url`, and `description`
- [ ] Canonical: `https://toolblip.com/tools/`
- [ ] Pagination: If tool count exceeds 50, consider pagination or "show more" to keep page weight down

### Blog (`/blog/`) — when created

- [ ] Title tag: `[Post Title] | Toolblip Blog`
- [ ] Meta description: Summarize the post. Include primary keyword.
- [ ] H1: Post title
- [ ] H2/H3: Logical heading hierarchy (never skip levels)
- [ ] Author byline: Even "Toolblip Team" is better than nothing. Google values authorship signals.
- [ ] Published date + last updated date: Visible and in ISO format for schema
- [ ] `Article` schema with `datePublished`, `dateModified`, `author`, `publisher`
- [ ] Internal links: Each post links to 2-3 relevant tool pages
- [ ] CTA at end: Link to the relevant tool ("Try our JSON Formatter →")
- [ ] Reading time estimate: Small trust signal, easy to add
- [ ] OG image: Per-post (can be templated)

---

## 4. Content Strategy

Blog should launch when the site has 30+ tools and initial GSC data shows which informational queries are generating impressions. Do not create `/blog/` before Day 30.

### 12 Blog Post Topics

| # | Title | Target Keyword | SEO Angle | Notes |
|---|-------|---------------|-----------|-------|
| 1 | What Is an MCP Server? A Plain-English Guide for Developers | what is an MCP server | Informational. High growth potential as MCP awareness rises. First post to publish. | Link to /mcp/ directory page throughout. |
| 2 | The Complete List of MCP Servers for Claude Code (2026) | Claude MCP server list | Transactional/informational. This is the MCP directory in blog form. Update monthly. | One of the highest-value posts for the MCP audience. Drives backlinks naturally. |
| 3 | JSON Formatting Best Practices: Why Your API Responses Look Wrong | json formatter best practices | Informational. Long-tail. Targets developers debugging JSON issues. | Link to /tools/json-formatter/ prominently. |
| 4 | Base64 Encoding Explained: What It Is and Why Developers Use It | base64 encoding explained | Informational. Targets developers learning Base64 for the first time. | Link to /tools/base64/. High educational value. |
| 5 | How to Convert HEIC to JPG on Any Device (No App Needed) | heic to jpg online | Transactional/informational hybrid. Targets iPhone users who get HEIC images and need to convert. | Massive search volume. Link to /tools/heic-to-jpg/. |
| 6 | UUID vs ULID vs NanoID: Which Should You Use? | uuid vs ulid | Informational. Developer audience. Drives high-quality backlinks from devs writing about IDs. | Link to /tools/uuid-generator/. |
| 7 | How to Use Regex in JavaScript: A Practical Guide with a Live Tester | regex javascript tutorial | Informational. High-volume, high-competition. Worth targeting because it ranks the tool alongside it. | Embed or prominently link /tools/regex-tester/. |
| 8 | What Is the Model Context Protocol (MCP) and Why Does It Matter? | model context protocol explained | Informational. Foundation content for the MCP directory. Broad and linkable. | Link to /mcp/ section. Written for a developer who has heard of MCP but not used it. |
| 9 | 10 Developer Tools That Should Be in Every Bookmark Bar | free developer tools online | Informational/listicle. Targets broad "tools" queries. Internal links to all 10 tools. | SEO-driven listicle. Highly shareable. |
| 10 | How to Decode a JWT Without an App (And What's Actually Inside) | jwt decoder online | Informational. Targets developers debugging auth issues. Very high relevance for the audience. | Link to /tools/jwt-decoder/. |
| 11 | The Toolblip MCP Package: Give Your AI Agent Instant Dev Superpowers | @toolblip/mcp npm | Brand/product. Targets developers searching for MCP packages on npm and Google. | Tutorial-style. Shows real code. Drives npm installs. |
| 12 | CSV to JSON: When to Convert and How to Do It Right | csv to json online | Informational/transactional. Developer + data analyst crossover. Evergreen. | Link to /tools/csv-to-json/. |

### Content Velocity

- **Months 1-2:** 0 blog posts. Focus on tools and directory.
- **Month 3:** Publish posts 1, 2, 9 (MCP guide, MCP server list, tools listicle)
- **Month 4:** Publish posts 3, 5, 10 (JSON, HEIC converter, JWT)
- **Month 5+:** One post per month from remaining list, prioritized by GSC impression data

---

## 5. Technical SEO

### Core Web Vitals Targets

Toolblip is a static Astro site on Cloudflare Pages. It should already hit these, but verify after DNS is live.

| Metric | Target | Current Status | Notes |
|--------|--------|---------------|-------|
| LCP (Largest Contentful Paint) | < 2.5s | Unknown (DNS not live) | CF Pages CDN should handle this. Monitor after launch. |
| CLS (Cumulative Layout Shift) | < 0.1 | Unknown | Verify that tool iframes or dynamic elements don't cause layout shift. |
| INP (Interaction to Next Paint) | < 200ms | Unknown | Client-side tools should be fast. Test with Lighthouse. |
| FCP (First Contentful Paint) | < 1.8s | Expected good | Static HTML on CF Pages is nearly instant. |

**How to check:** After DNS is live, run PageSpeed Insights on homepage and 3 tool pages. Fix any issues before submitting to GSC.

### Sitemap

- Auto-generated via `@astrojs/sitemap`. Verify it includes all tool pages and is referenced in `robots.txt`.
- Submit sitemap URL to Google Search Console and Bing Webmaster Tools on day 1 after DNS.
- Sitemap URL: `https://toolblip.com/sitemap-index.xml`
- Exclude: `/404/`, any utility/redirect pages

### Canonical URLs

- Every page must have a `<link rel="canonical">` tag pointing to its own URL.
- No trailing slash inconsistency: pick one convention (no trailing slash) and stick to it. `robots.txt` and Cloudflare should redirect the other variant.
- When blog posts are added: canonical = the post URL, not any pagination or tag page.

### Robots.txt

Current `robots.txt` references sitemap. Verify:
- `Disallow: /` is NOT set
- Sitemap reference is correct HTTPS URL
- No dev/staging paths accidentally excluded

### Schema.org Setup for Tool Listings

Each tool page should have two JSON-LD blocks:

**Block 1: SoftwareApplication**
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "JSON Formatter",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "url": "https://toolblip.com/tools/json-formatter/",
  "description": "Free online JSON formatter and validator. Works entirely in your browser."
}
```

**Block 2: BreadcrumbList**
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://toolblip.com/" },
    { "@type": "ListItem", "position": 2, "name": "Tools", "item": "https://toolblip.com/tools/" },
    { "@type": "ListItem", "position": 3, "name": "JSON Formatter" }
  ]
}
```

**Block 3 (FAQ pages only): FAQPage**
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is this JSON formatter free?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Toolblip is completely free and runs entirely in your browser. No data is sent to any server."
      }
    }
  ]
}
```

Both blocks are already scaffolded in `ToolLayout.astro`. Verify the field values are correct and not default/placeholder text.

### MCP Directory Schema

When `/directory/` launches, use `ItemList` schema for category pages and a custom `SoftwareApplication` schema variant for individual MCP server entries.

### 404 and Redirect Handling

- Build `src/pages/404.astro` before launch.
- Cloudflare Pages serves `404.html` from the build output automatically.
- Set up a Cloudflare redirect rule: `toolblip.com/*` → `https://toolblip.com/$1` (enforce HTTPS and no-www or with-www, pick one).

---

## 6. Off-Page SEO + Link Building

### 6 Backlink Sources to Pursue

**1. AlternativeTo.net**
- Submit Toolblip as an alternative to SmallDev.tools, DevUtils, and TinyTools.
- Free listing. Strong DR (Domain Rating). Multiple pages link back.
- Action: Submit after launch. Takes 24-48 hours to appear.

**2. Toolbox.so and similar curated tool directories**
- These directories accept submissions and have genuine editorial curation.
- Each listing is a contextual backlink from a relevant domain.
- Other targets: devurls.com, untools.co (if they accept submissions), hackingui.com/tools.
- Action: Submit to 5-10 tool directories in the first week after launch.

**3. GitHub Awesome Lists**
- Search for `awesome-mcp-servers`, `awesome-developer-tools`, `awesome-online-tools` on GitHub.
- Open PRs to add Toolblip to relevant lists.
- These are high-authority .github.io or README links. Many are indexed and crawled.
- Action: Submit PRs to 3-5 awesome lists in week 1. Target: `awesome-mcp-servers` first.

**4. MCP Community Sites (mcp.run, Smithery.ai, MCP.so)**
- Submit Toolblip's MCP servers (`@toolblip/mcp-server-tools`, `@toolblip/mcp-server-reference`) to existing MCP registries.
- These are the highest-quality contextual backlinks for the MCP directory vertical.
- Also submit Toolblip as a directory/resource for MCP discovery.
- Action: After `@toolblip/mcp` is published to npm, submit to all major MCP registries.

**5. HackerNews + Reddit "Show HN" / "I Made This" Posts**
- A well-received HN post generates dozens of backlinks from personal blogs and newsletters that aggregate HN links.
- Reddit posts (r/webdev, r/SideProject) less so for backlinks but drive referral traffic that signals Google.
- Action: Launch HN post on day 2-3 (not day 1; fix any critical bugs first). Submit to Reddit same day.

**6. Developer Newsletter Sponsorships and Mentions**
- Newsletters like Bytes.dev, JavaScript Weekly, Node Weekly, and TLDR Tech have "cool tools" or "community" sections.
- Some accept free submissions. Others charge for sponsorship. Start with free submissions.
- A mention in a mid-tier dev newsletter (5K-50K subscribers) typically generates 50-200 backlinks from subscribers who blog or syndicate.
- Action: Email 3-5 newsletter editors 1-2 weeks after launch with a brief pitch. Not before.

### MCP Community Outreach Strategy

The MCP ecosystem is new and community-driven. The community is small, reachable, and responds to genuine contributors.

**Where to participate:**
- Model Context Protocol Discord (official Anthropic MCP Discord)
- MCP-specific GitHub discussions and issue trackers
- X/Twitter: follow and engage with @modelcontextprotocol, MCP maintainers, and Anthropic developer relations

**How to earn goodwill, not spam:**
1. List other people's MCP servers in the Toolblip directory with accurate, well-written descriptions
2. DM MCP server maintainers: "I listed your server in the Toolblip directory — here's the link. Let me know if you want to update the description."
3. Open issues or PRs on MCP server repos when you find bugs or documentation gaps
4. Share MCP servers on X with your commentary — add value, not just retweets
5. Never cold-spam "hey submit to my directory" — reach out with value first

**Goal:** Be seen as a community resource, not a marketing account.

### Directory Submissions (Full List)

Submit to these in week 1 after launch:

| Directory | Category | Notes |
|-----------|----------|-------|
| alternativeto.net | Developer Tools | Submit as alternative to SmallDev.tools, DevUtils |
| toolbox.so | Developer Tools | Curated list |
| GitHub: awesome-developer-tools | Open Source | PR submission |
| GitHub: awesome-mcp-servers | AI/MCP | PR submission |
| GitHub: awesome-claude | AI Tools | PR submission |
| devhunt.org | Product Launch | Weekly product hunt for devs |
| stackshare.io | Tool stack | Add Toolblip as a discoverable tool |
| producthunt.com | Product Launch | Schedule for Tuesday-Thursday morning |
| ycombinator.com/launches | Startup | If applicable later |
| uneed.best | Tools directory | Free submission |

---

## 7. GSC Monitoring

### What to Check Weekly (Every Monday)

**1. Coverage > Pages**
- Are all tool pages indexed? New pages should be indexed within 1-2 weeks of launch.
- Are any pages "Discovered but not indexed"? This usually means low content or crawl budget issues.
- Flag any "Excluded" pages that should be indexed.

**2. Performance > Queries**
- Which queries are generating impressions? These are your early keyword opportunities.
- Click-through rate (CTR) < 2% on any query with >100 impressions = title/description needs improvement.
- Average position 11-20 on any keyword = you're close to page 1. Strengthen that page's content.

**3. Performance > Pages**
- Which pages get the most clicks? These are your top performers — add internal links from other pages to them.
- Which pages have high impressions but zero clicks? Usually position 20+ — these need content improvement.

**4. Core Web Vitals**
- Takes 4-6 weeks after launch to populate. Check monthly once data appears.
- Fix any "Poor" URLs immediately.

**5. Links > Top Linking Sites**
- Who is linking to you? Monitor for new backlinks from directory submissions and community posts.
- Disavow toxic links (unlikely at this stage, but worth monitoring).

**Weekly GSC checklist (takes < 15 minutes):**
- [ ] Check index count — growing week over week?
- [ ] Check for any new crawl errors
- [ ] Check top 10 queries — any surprises?
- [ ] Check CTR for top 20 pages — any below 1%?
- [ ] Note any queries in position 11-20 — add to content improvement backlog

---

## 8. Distribution Channels

Ranked by expected ROI given Harun's time constraints. Do highest-ROI channels first.

| Rank | Channel | Why | Time Investment | Expected Return |
|------|---------|-----|----------------|-----------------|
| 1 | **Google Search (SEO)** | Long-term, compounding, free. The #1 traffic source for developer tools at scale. | Low (set up once, maintain weekly) | High — primary growth driver |
| 2 | **X/Twitter (@HarunRRayhan)** | AI/dev Twitter is active and shares tool discoveries fast. Short feedback loops. | Medium (30 min/day) | High for MCP audience especially |
| 3 | **HackerNews (Show HN)** | One good HN post can generate 1K-10K visitors in 24 hours + many backlinks | Low (one-time, then periodic) | Very high (burst traffic) |
| 4 | **Reddit (r/webdev, r/SideProject, r/ClaudeAI)** | Organic posts in relevant subreddits drive targeted traffic | Medium (3-4 posts spread out) | Medium-High |
| 5 | **GitHub** | Awesome lists, MCP repo README mentions, starring/watching | Low (one-time submissions) | Medium (long-lasting backlinks) |
| 6 | **Product Hunt** | Launch event. Good for a burst of early adopters and feedback. | Medium (launch preparation) | Medium (one-time) |
| 7 | **Model Context Protocol Discord** | Small community, high concentration of target users for MCP directory. | Low (periodic participation) | High for MCP segment |
| 8 | **Developer Newsletters** | Reaches established developer audiences via trusted sources | Low (submit, then wait) | Medium |
| 9 | **Dev.to / Hashnode** | Cross-post blog content for reach. Drives some search traffic. | Low | Low-Medium |
| 10 | **LinkedIn** | Lower developer density than X, but useful for enterprise segment eventually | Low | Low (for now) |

**Do not invest time in:** YouTube (too time-intensive), Instagram (wrong audience), TikTok (wrong audience at this stage), Mastodon/Bluesky (niche, low volume).

---

## 9. Launch Strategy (Weeks 1-4)

*Note: toolblip.com DNS is not yet configured. The timeline below starts from DNS go-live, not from today.*

### Pre-Launch (Before DNS goes live)

- [ ] Set DNS records. Point `toolblip.com` to Cloudflare Pages.
- [ ] Verify SSL certificate is active.
- [ ] Add Google Search Console TXT record for domain verification.
- [ ] Set `PUBLIC_GA_MEASUREMENT_ID` in Cloudflare Pages env vars.
- [ ] Build and deploy `dist/` to production.
- [ ] Run PageSpeed Insights on homepage and 3 tool pages. Note baseline scores.
- [ ] Verify sitemap is accessible at `https://toolblip.com/sitemap-index.xml`.
- [ ] Verify all 10 tool pages load correctly.
- [ ] Verify no console errors on any tool page.

### Week 1 (Days 1-7): Launch + Announce

**Day 1:**
- Deploy to production with DNS live.
- Verify GSC property claimed and sitemap submitted.
- Request manual indexing for: `/`, `/tools/`, and top 5 tool pages via GSC.
- Post on X: "I built Toolblip — free developer tools that run entirely in your browser. JSON formatter, Base64, UUID generator, image tools. No account. No tracking. toolblip.com"

**Day 2-3:**
- Submit Show HN post: "Show HN: Toolblip – free client-side developer tools and MCP server registry"
- Post to Reddit r/webdev (follow up with r/SideProject same day or next)
- Submit to AlternativeTo.net, toolbox.so, devhunt.org
- Open PRs on 2-3 GitHub awesome lists

**Day 4-7:**
- Monitor HN and Reddit for comments — respond to every comment within 2 hours
- Log all feedback to a `FEEDBACK.md` file
- Submit to 5 more tool directories from the list above
- Fix any critical bugs or UX issues surfaced by early users
- Add "How to Use" + FAQ content to: JSON Formatter, Base64, UUID Generator, Word Counter

### Week 2 (Days 8-14): Ship New Tools

- Build and deploy: Regex Tester, SHA-256 Hash Generator, Lorem Ipsum Generator
- Add "How to Use" + FAQ to each new tool on launch
- Cross-link new tools to existing related tools and vice versa
- Apply for Google AdSense (site now has 13+ pages with real content)
- Post on X showcasing each new tool (3 posts this week, one per tool)
- Submit to Bing Webmaster Tools if not already done
- Monitor GSC daily: are pages being crawled?

### Week 3 (Days 15-21): Image Tools + MCP Teaser

- Build and deploy: Unix Timestamp Converter, JWT Decoder
- Build and deploy: WebP to JPG (highest volume image tool)
- Build and deploy: HEIC to JPG (second highest volume image tool)
- Post on X about the image tools — these have broad appeal beyond dev audience
- Create `/mcp/` landing page teaser with "Coming soon" + email capture
- Post about the MCP directory plans to build early interest from the MCP community
- Participate in MCP Discord with genuine contributions (no spam)

### Week 4 (Days 22-28): Review, Optimize, Plan Month 2

- Review GSC: which pages have impressions? Which queries are surfacing?
- Review GA4: which tools get the most usage? Average session duration? Bounce rate?
- Update meta titles + descriptions for any page with CTR below 1%
- Identify the 3 most-used tools and add deeper content (more FAQs, expanded how-to)
- Write and publish first blog post: "What Is an MCP Server?" — targets early MCP queries
- Plan month 2: which 5 tools to build next, based on search volume + user feedback
- Set up monthly review ritual: GSC + GA4 + keyword rank tracking

---

## 10. Community Building

### Getting MCP Server Maintainers to List Their Servers

The directory's value is its content. The content comes from maintainers. Here is how to get them without being annoying.

**Step 1: Seed the directory yourself (before asking anyone)**
- Manually add 20-30 high-quality MCP servers before the directory page goes live.
- Write accurate, well-researched descriptions for each entry.
- This shows maintainers that their server will be listed with care, not just scraped.

**Step 2: DM maintainers with the listing, not the ask**
- "Hey, I found your MCP server and listed it on Toolblip. Here's the link: [URL]. Let me know if you'd like to update the description or add anything."
- This is the golden template. You're giving first, not asking.
- Most maintainers will check the listing, share it with their followers, and appreciate it.

**Step 3: Offer a "submit your server" form**
- `/directory/submit/` should be live early. Make it dead simple: server name, GitHub URL, description, category.
- Mention the submission form in the MCP Discord as a resource, not an ad.

**Step 4: Partner with active MCP contributors**
- Identify 5-10 people who are very active in the MCP community on X or GitHub.
- Engage genuinely with their content for 2-3 weeks before asking anything.
- Then ask if they'd be willing to help curate a category or review listings.

**Step 5: Create a "Featured Server" slot**
- Once the directory has 20+ entries, add a "Featured This Week" section on `/directory/`.
- Rotate which server is featured. DM maintainers when their server is featured.
- This creates a reason for maintainers to share the directory without you having to ask.

### Building a Returning User Habit

For the tools side, the goal is to become the site developers type from memory:

- Domain must be memorable: toolblip.com is short and distinctive.
- Every tool should suggest related tools ("You might also need: JWT Decoder, Hash Generator")
- Fake-door "Save to history" button: captures email for notification when the feature launches
- "What tool should I build next?" feedback form on the homepage or in the site footer

---

## 11. Toolblip MCP Package Marketing

The `@toolblip/mcp` npm package is Toolblip's most defensible moat. It turns the directory into infrastructure.

### Target: Get the first 1,000 npm installs

**Channel 1: npm package page**
- The npm page for `@toolblip/mcp-server-tools` is itself a discoverable surface.
- Write a complete, professional README with working code examples, a list of all available tools, and clear installation instructions.
- Example README structure: What it does, Quick install, Available tools (table), Usage with Claude Code, Usage with Cursor, Contributing.

**Channel 2: MCP registries**
- Submit the package to: mcp.run, Smithery.ai, MCP.so, and any Anthropic-maintained MCP resource list.
- These get indexed and drive organic discovery from developers searching for MCP servers.

**Channel 3: Integration tutorials on toolblip.com/mcp/**
- Create dedicated landing pages for `/mcp/tools/`, `/mcp/reference/`, `/mcp/directory/`.
- Each page should have a copy-paste install command at the top (`npx @toolblip/mcp-server-tools`).
- Include screenshots or animated GIFs of the tools working inside Claude Code and Cursor.

**Channel 4: Blog post (month 3)**
- "The Toolblip MCP Package: Give Your AI Agent Instant Dev Superpowers"
- Tutorial-style. Shows real working code. Links to all three packages.
- Cross-post to Dev.to and Hashnode for extra reach.

**Channel 5: X/Twitter thread**
- "I built an MCP server so AI agents can use developer tools natively. Here's what it can do: [thread]"
- Show real Claude Code screenshots using the package.
- Threads with demo screenshots consistently outperform plain text posts in this community.

**Channel 6: GitHub README mentions**
- Add `@toolblip/mcp-server-tools` as an example MCP server in relevant GitHub awesome lists.
- The `awesome-mcp-servers` list is the single highest-value placement.

**Metric to watch:** Weekly npm downloads. Target: 50 installs/week by month 3, 200/week by month 6.

---

## 12. Metrics to Track

### Monthly KPIs

| Metric | Source | Target (Month 1) | Target (Month 3) | Target (Month 6) |
|--------|--------|-----------------|-----------------|-----------------|
| Organic search clicks | GSC | 100 | 1,000 | 10,000 |
| Organic impressions | GSC | 5,000 | 50,000 | 500,000 |
| Indexed pages | GSC | 15 | 25 | 50+ |
| Unique visitors/month | GA4 | 200 | 2,000 | 20,000 |
| Tool page avg. session duration | GA4 | > 1 min | > 1.5 min | > 2 min |
| npm weekly downloads (@toolblip/mcp) | npmjs.com | 10 | 50 | 200 |
| Directory listings count | Internal | 0 | 20 | 50 |
| Backlinks (new domains/month) | GSC Links | 5 | 15 | 30 |
| Average SERP position (top 10 keywords) | GSC | 40+ | 20+ | 10+ |
| Email list signups (fake-door/waitlist) | Formspree/GSheets | 10 | 100 | 500 |

### Secondary Metrics to Monitor

- **Bounce rate by tool:** High bounce = tool works on first try (good) OR users are confused (bad). Interpret alongside session duration.
- **Which tools are most used:** GA4 page views per tool. Informs which tools to add more content to and which new tools to prioritize.
- **Reddit + HN referral traffic:** GA4 source/medium. Quantifies the value of community posts.
- **X referral traffic:** GA4 source = t.co. Watch the week of any X post.
- **AdSense RPM (once approved):** Revenue per 1,000 pageviews. Target RPM for a developer tools site: $3-8. If below $3, optimize ad placement.
- **Core Web Vitals pass rate:** GSC Core Web Vitals report. Aim for >90% "Good" URLs.

### What NOT to Track (Yet)

- MRR / revenue: not relevant until Pro tier or AdSense is live
- Social followers: vanity metric at this stage
- User accounts: not built yet

---

## 13. 30-Day Sprint Plan

This plan assumes DNS goes live at the start of Day 1. Time estimates reflect solo founder pace.

### Days 1-2: Go Live

| Task | Time | Priority |
|------|------|----------|
| Configure DNS + verify SSL | 30 min | Critical |
| Add About page and 404 page | 1 hr | Critical |
| Set GA4 env var in CF Pages | 10 min | Critical |
| Verify GSC and submit sitemap | 20 min | Critical |
| Request manual indexing for top 5 pages | 10 min | High |
| Run PageSpeed Insights, note baseline | 20 min | High |
| Post launch announcement on X | 30 min | High |
| Submit Show HN | 30 min | High |

### Days 3-5: Announce + Submit

| Task | Time | Priority |
|------|------|----------|
| Post to Reddit (r/webdev) | 30 min | High |
| Post to Reddit (r/SideProject) | 20 min | High |
| Submit to AlternativeTo, toolbox.so, devhunt.org | 1 hr | High |
| Open PRs on 3 GitHub awesome lists | 1 hr | High |
| Respond to all HN/Reddit comments | Ongoing | High |
| Add "How to Use" + FAQ to JSON Formatter | 1 hr | High |
| Add "How to Use" + FAQ to Base64 | 45 min | High |
| Add "How to Use" + FAQ to UUID Generator | 45 min | High |

### Days 6-10: Build New Tools

| Task | Time | Priority |
|------|------|----------|
| Build and deploy Regex Tester | 4 hrs | High |
| Build and deploy SHA-256 Hash Generator | 2 hrs | High |
| Build and deploy Lorem Ipsum Generator | 2 hrs | High |
| Add "How to Use" + FAQ to each new tool | 2 hrs | High |
| Cross-link new tools to existing tools | 1 hr | High |
| Apply for Google AdSense | 20 min | Medium |
| Submit to 5 more directories | 1 hr | Medium |
| Post on X about Regex Tester | 20 min | Medium |

### Days 11-17: More Tools + MCP Teaser

| Task | Time | Priority |
|------|------|----------|
| Build and deploy Unix Timestamp Converter | 2 hrs | High |
| Build and deploy JWT Decoder | 2 hrs | High |
| Build and deploy WebP to JPG | 2 hrs | High |
| Build and deploy HEIC to JPG | 4 hrs | High |
| Create /mcp/ teaser page with email capture | 2 hrs | Medium |
| Centralize tool array to src/data/tools.ts | 1 hr | Medium |
| Join MCP Discord, introduce Toolblip | 30 min | Medium |
| Post on X about image conversion tools | 20 min | Medium |

### Days 18-24: First Category Hub + Content

| Task | Time | Priority |
|------|------|----------|
| Create /tools/image/ category hub page | 2 hrs | Medium |
| Build and deploy CSV to JSON converter | 3 hrs | High |
| Build and deploy JSON to CSV converter | 1 hr | High |
| Add FAQ to all new tool pages | 2 hrs | High |
| Write and publish blog post #1: "What Is an MCP Server?" | 3 hrs | Medium |
| Set up fake-door email captures (API access, Pro plan) | 2 hrs | Medium |
| Review GSC data — which pages indexed? Which queries? | 30 min | High |

### Days 25-30: Review + Plan Month 2

| Task | Time | Priority |
|------|------|----------|
| GSC audit: CTR, impressions, index coverage | 1 hr | High |
| GA4 audit: top tools, session duration, bounce rate | 1 hr | High |
| Update title/description for pages with CTR < 1% | 1 hr | High |
| Create OG image (default branded fallback) | 1 hr | Medium |
| Email newsletter editors with Toolblip pitch (3-5 newsletters) | 1 hr | Medium |
| Plan month 2 tools based on data (write MONTH2_PLAN.md) | 1 hr | Medium |
| Commit and push everything clean | 30 min | High |

**End of Day 30 targets:**
- 18+ tools live and indexed
- About page, 404 page, sitemap, GSC all configured
- AdSense application submitted
- First blog post published
- Email capture in place for API/Pro waitlist
- MCP teaser page live
- GSC showing impressions on at least 10 keywords

---

*End of SEO + Marketing Plan. Review and update monthly based on GSC + GA4 data.*
