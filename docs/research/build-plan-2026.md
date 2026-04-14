# Tinytools  -  Build Plan 2026
*Research compiled: April 7, 2026. Based on market-analysis-2026.md, competitor-deep-dive-2026.md, domain-research-2026.md.*

---

## Context Summary

**What's decided:** Free tools site, browser-side processing only, Astro + Tailwind + Cloudflare Pages, Google AdSense → paid plan later, MIT open source frontend with GitHub issue link on every page.

**First 10 tools:** word counter, character counter, JSON formatter, base64 encode/decode, case converter, URL encode/decode, image cropper (with visa presets), UUID generator, remove duplicate lines, markdown to HTML. QR code tool builds inside Tinytools first, spins off if traction.

---

## 1. Technical Implementation Plan  -  Per Tool

### Browser APIs and Libraries for Each Launch Tool

| Tool | Primary Implementation | Library / API | Notes |
|---|---|---|---|
| Word Counter | Pure JS | None | Count words via `str.split(/\s+/).filter(Boolean).length`. Also count sentences, paragraphs, reading time. Zero dependencies. |
| Character Counter | Pure JS | None | `str.length` for characters. With/without spaces. Tweet-style countdown (280, 2200, etc). Zero dependencies. |
| JSON Formatter | Pure JS | None | `JSON.parse()` + `JSON.stringify(null, 2)`. Add syntax highlighting with a lightweight highlighter (Prism.js ~6KB or a custom tokenizer). Validate JSON inline. |
| Base64 Encode/Decode | Pure JS | None | `btoa()` / `atob()` for text. For files: `FileReader.readAsDataURL()` gives base64. Handle URL-safe variant (`+` → `-`, `/` → `_`). Zero dependencies. |
| Case Converter | Pure JS | None | Title case, UPPER, lower, camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE. Pure string manipulation. Zero dependencies. |
| URL Encode/Decode | Pure JS | None | `encodeURIComponent()` / `decodeURIComponent()`. Also handle full URL encode (`encodeURI`). Zero dependencies. |
| Image Cropper | Canvas API + Cropper.js | `cropperjs` (npm, ~18KB gzip) | Canvas API for crop, resize, export. Cropper.js for the interactive drag UI. For visa/passport presets: hardcode aspect ratios (US visa: 2x2in at 600dpi, UK passport: 35x45mm, etc). Export via `canvas.toBlob()`. No server needed. |
| UUID Generator | Pure JS (with crypto) | `crypto.randomUUID()` | The Web Crypto API `crypto.randomUUID()` is available in all modern browsers. For older support or v4 custom logic, use `crypto.getRandomValues(new Uint8Array(16))`. Can also generate bulk UUIDs with copy-all. Zero npm dependencies. |
| Remove Duplicate Lines | Pure JS | None | Split on `\n`, deduplicate with `Set` or `Map` (to preserve order), rejoin. Options: case-insensitive dedup, trim whitespace, remove empty lines. Zero dependencies. |
| Markdown to HTML | `marked` (npm) | `marked` (~25KB gzip) | `marked.parse(input)` is the fastest path. Alternative: `markdown-it` (~50KB, more spec-compliant). Show rendered preview alongside HTML output. Sanitize output with `DOMPurify` to prevent XSS in the preview iframe. |
| QR Code (basic) | Canvas API | `qrcode` (npm, ~20KB) or `qr-creator` | `qrcode` npm package generates QR codes to canvas or SVG, fully browser-side. No server needed. Start with URL input only; expand types later. |

### Dependency Summary

| npm Package | Tools Using It | Bundle Size (gzip) | Purpose |
|---|---|---|---|
| `cropperjs` | Image Cropper | ~18KB | Interactive crop UI |
| `marked` | Markdown to HTML | ~25KB | Markdown parsing |
| `DOMPurify` | Markdown to HTML | ~7KB | XSS sanitization for HTML preview |
| `qrcode` | QR Code | ~20KB | QR generation to canvas/SVG |
| Prism.js (optional) | JSON Formatter | ~6KB | Syntax highlighting |

Everything else is pure browser APIs (JS, Canvas API, Web Crypto API, FileReader API). No tool requires server processing.

### Anything That Can't Be Done Client-Side?

Nothing in the first 10 tools requires a server. Every tool in the launch set is fully browser-side:
- Text processing: pure JS
- JSON/Base64/URL/UUID: browser APIs
- Markdown: `marked` library
- Image crop: Canvas API + Cropper.js
- QR code: `qrcode` library + Canvas API

### WASM Candidates (Post-Launch)

These are not in the launch set but are the natural next additions that benefit from WASM:
- **Image format conversion** (HEIC to JPG, WebP to JPG): `heic2any` is pure JS but slow on large files; WASM-compiled libvips is faster
- **PDF manipulation** (rotate PDF, compress PDF): `pdf-lib` is pure JS and handles basic ops fine; WASM becomes relevant for compression quality
- **Background removal**: `@imgly/background-removal` runs a WASM ML model fully in-browser  -  viable post-launch addition
- **Image compression**: `squoosh` (Google) uses WASM codecs; `browser-image-compression` is a pure-JS fallback

For the 10 launch tools: no WASM needed.

---

## 2. AdSense Placement Strategy

### Optimal Ad Placement on a Tool Page

A tool page has a predictable layout: hero/tool area above fold, instructional content below. Ad placement must not interfere with the tool interaction itself (Google policy + UX) but should capture attention during natural pause points.

**Recommended layout (top to bottom):**

```
[HEADER / NAV]
[H1 + Tool Description  -  2-3 sentences]
[TOOL INTERFACE  -  input/output/button]          ← NO ADS HERE
[LEADERBOARD AD  -  728x90 or responsive]        ← Place here: after tool, before content
[HOW TO USE  -  3-4 steps]
[IN-CONTENT AD  -  336x280 or responsive]        ← Place here: mid-content, after step 2-3
[FAQ SECTION  -  5-7 Q&As]
[RELATED TOOLS GRID]
[IN-CONTENT AD  -  300x250]                      ← Place here: after FAQ, before footer
[FOOTER]
```

**Key rules:**
1. Never place ads inside or overlapping the tool interface  -  Google rejects this as accidental click bait and it destroys UX
2. The first ad appears below the fold of the tool interaction  -  users have engaged before seeing the ad
3. Sidebar ads (300x600 wide skyscraper) work on desktop if the tool content is narrow and you have space; they don't exist on mobile
4. On mobile, stick to responsive ads that collapse to 320x50 or 300x250

### Best Ad Sizes for Utility Sites

| Format | Size | Why It Works |
|---|---|---|
| Leaderboard | 728x90 (responsive) | Best after-tool placement on desktop; high fill rates |
| Medium Rectangle | 300x250 | Universal: works in content, in sidebars, on mobile |
| Large Rectangle | 336x280 | Higher RPM than 300x250 when space allows |
| Wide Skyscraper | 160x600 | Sidebar on desktop only; high CPM for tech audience |
| Responsive Ad | Auto | Let Google optimize size; generally best for mobile |

**For a new site launching with AdSense:** Use 2-3 responsive display ads per page initially. Google's auto ads feature can be enabled temporarily to let Google find optimal placements  -  run it for 2-4 weeks, then hardcode the positions that worked and disable auto ads (which can slow page load).

### RPM Expectations for This Tool Set

From the market research: developer-focused tools earn $6-12 RPM vs $3-6 for general utility tools. The launch set is a mix:
- Word/character counter, case converter, remove duplicate lines: general audience → $3-5 RPM
- JSON formatter, base64, URL encode/decode, UUID, markdown to HTML: developer audience → $6-10 RPM
- Image cropper: mixed → $4-7 RPM

Blended estimate at launch: **$4-7 RPM**. This is with AdSense. Moving to Ezoic at 10k sessions lifts this to $5-9 RPM.

### AdSense Policies That Affect Tool Sites

**File upload tools:** Google has no specific restriction on tools that accept file uploads, as long as:
- Files are processed client-side (no server transmission to third parties)
- You don't claim to handle medical, legal, or financial documents in ways that imply professional advice
- The privacy policy clearly states what happens to uploaded files ("all processing occurs in your browser; no files are sent to our servers")

**Content policies to watch:**
- Ads cannot be placed in a way that encourages accidental clicks (near buttons, in scroll paths)
- Pages must have substantial content beyond just the tool (the "how to use" + FAQ sections cover this)
- No ads on pages with very thin content  -  this is why the content skeleton below the tool matters
- Tool pages with only an input field and output box with no supporting content may be flagged as "low value"  -  the content sections protect against this

**Core Web Vitals and AdSense:** Google's PageSpeed Insights score affects both ad RPM (better UX → higher CPM bids from advertisers) and organic rankings. Astro's static output + Cloudflare Pages CDN should keep LCP under 2.5s. Lazy-load all ads with `loading="lazy"` attribute on ad slots. Do not load ads in the critical rendering path.

**AdSense approval for a new site:** Requires:
- At least 10-15 pages of real content (10 tool pages qualify)
- A privacy policy page (required  -  mention client-side processing)
- A contact/about page
- No copyrighted content, no misleading tools
- Site must be live for at least 2-4 weeks before applying (some accounts approved faster, some take up to 2 months)
- No minimum traffic requirement officially, but very low traffic sites can be rejected  -  aim to have 500+ monthly visitors before applying

---

## 3. Astro Site Structure

### Project Directory Structure

```
/
├── src/
│   ├── components/
│   │   ├── tools/
│   │   │   ├── WordCounter.tsx          # Each tool is a React/Preact island
│   │   │   ├── JsonFormatter.tsx
│   │   │   ├── Base64Tool.tsx
│   │   │   ├── CaseConverter.tsx
│   │   │   ├── UrlEncodeDecode.tsx
│   │   │   ├── ImageCropper.tsx
│   │   │   ├── UuidGenerator.tsx
│   │   │   ├── RemoveDuplicateLines.tsx
│   │   │   ├── MarkdownToHtml.tsx
│   │   │   └── QrCodeGenerator.tsx
│   │   ├── layout/
│   │   │   ├── Header.astro
│   │   │   ├── Footer.astro
│   │   │   └── AdSlot.astro             # Reusable ad slot component
│   │   ├── ToolCard.astro               # Tool card for index/category pages
│   │   ├── RelatedTools.astro           # Related tools section on tool pages
│   │   └── ToolSearch.tsx               # Client-side search island
│   ├── layouts/
│   │   ├── BaseLayout.astro             # HTML shell, meta, fonts
│   │   └── ToolLayout.astro             # Tool page layout: H1, tool, content, ads, related
│   ├── pages/
│   │   ├── index.astro                  # Homepage
│   │   ├── tools/
│   │   │   ├── index.astro              # All tools index (searchable grid)
│   │   │   ├── text/
│   │   │   │   └── index.astro          # Text tools category hub
│   │   │   ├── developer/
│   │   │   │   └── index.astro          # Developer tools category hub
│   │   │   ├── image/
│   │   │   │   └── index.astro          # Image tools category hub
│   │   │   ├── word-counter.astro       # Individual tool pages
│   │   │   ├── character-counter.astro
│   │   │   ├── json-formatter.astro
│   │   │   ├── base64.astro
│   │   │   ├── case-converter.astro
│   │   │   ├── url-encode-decode.astro
│   │   │   ├── image-cropper.astro
│   │   │   ├── uuid-generator.astro
│   │   │   ├── remove-duplicate-lines.astro
│   │   │   └── markdown-to-html.astro
│   │   ├── about.astro
│   │   ├── privacy.astro
│   │   └── contact.astro
│   ├── data/
│   │   └── tools.ts                     # Central tool registry (metadata for all tools)
│   ├── styles/
│   │   └── global.css                   # Tailwind imports + custom CSS vars
│   └── lib/
│       └── tools.ts                     # Helper functions (getToolsByCategory, getRelatedTools)
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   └── og/                             # OG images per tool (generated or static)
├── astro.config.mjs
├── tailwind.config.mjs
└── package.json
```

### Central Tool Registry (tools.ts)

The tool registry is the single source of truth for all tool metadata. Every tool page, category page, sitemap, search index, and related-tools widget reads from this file.

```typescript
// src/data/tools.ts
export type Tool = {
  slug: string;           // URL slug: "word-counter"
  title: string;          // "Word Counter"
  description: string;    // Short description for cards and meta
  longDescription: string;// Longer description for tool page intro
  category: 'text' | 'developer' | 'image' | 'pdf' | 'file';
  tags: string[];         // For search indexing
  keywords: string[];     // Primary SEO keywords
  related: string[];      // Slugs of related tools
  launchDate: string;     // ISO date
};

export const tools: Tool[] = [
  {
    slug: 'word-counter',
    title: 'Word Counter',
    description: 'Count words, characters, sentences, and paragraphs instantly.',
    longDescription: '...',
    category: 'text',
    tags: ['writing', 'text', 'count', 'words'],
    keywords: ['word counter', 'word count', 'count words online'],
    related: ['character-counter', 'remove-duplicate-lines', 'case-converter'],
    launchDate: '2026-04-15',
  },
  // ... all tools
];
```

### Scaling to 100+ Tools

**The approach that works at scale:**

1. **Static pages at build time:** Each tool page is a static `.astro` file. At 100 tools, this is 100 files  -  manageable. Alternatively, use Astro's dynamic routes (`src/pages/tools/[slug].astro`) with `getStaticPaths()` reading from `tools.ts`. The dynamic route approach makes adding tools faster (add to registry, done).

2. **Dynamic routes example:**
```astro
// src/pages/tools/[slug].astro
export async function getStaticPaths() {
  return tools.map(tool => ({
    params: { slug: tool.slug },
    props: { tool },
  }));
}
```
This generates 100 static pages from one template file. The tradeoff: less per-tool customization in the page template. In practice, 80% of tools fit the same template; the 20% that need custom layouts get their own `.astro` file.

3. **Tool search/filtering:** Use a Preact or React island for the search UI. At build time, generate a JSON search index from `tools.ts` and import it into the island. The island filters client-side  -  no server needed, no API call. Fuse.js (~10KB) handles fuzzy search well.

4. **Category pages:** Each category (`/tools/text/`, `/tools/developer/`) is a static page that reads from `tools.ts` to list its tools. Auto-generates when a new tool is added to the registry.

5. **Sitemap:** Use `@astrojs/sitemap`  -  it auto-generates from all static pages at build time. Zero maintenance.

6. **SEO metadata per tool:** Pass `tool.keywords`, `tool.description`, and `tool.title` as props to `ToolLayout.astro`, which sets all `<meta>` tags from those props.

### Handling Images / OG Images

For OG images (Twitter/LinkedIn preview cards), use one of:
- Static OG images per tool (fast, no build complexity)  -  create a template in Figma, export per tool
- `@vercel/og` or Satori + Cloudflare Workers for dynamic OG image generation at request time
- For launch: static OG images are fine. Dynamic can come later.

---

## 4. Tool Page SEO Template

### Page Structure (Every Tool Page)

```
URL:      /tools/word-counter
Title:    Word Counter  -  Free Online Word & Character Count | [Brand]
Meta:     Count words, characters, sentences, and reading time instantly. Free, 
          works in your browser, no signup required.

<h1>Word Counter</h1>
<p class="tool-intro">Count words, characters, sentences, paragraphs, and 
estimate reading time. Paste or type your text below.</p>

[TOOL INTERFACE]

[LEADERBOARD AD]

<h2>How to Use the Word Counter</h2>
<ol>
  <li>Paste or type your text into the box above.</li>
  <li>Word count, character count, and reading time update automatically.</li>
  <li>Use the copy button to copy any stat.</li>
</ol>

<h2>Frequently Asked Questions</h2>
<details><summary>How does the word counter work?</summary>...</details>
<details><summary>Does it count words in different languages?</summary>...</details>
<details><summary>What counts as a word?</summary>...</details>
<details><summary>Is there a limit to how much text I can paste?</summary>...</details>
<details><summary>Do you store the text I enter?</summary>...</details>

[IN-CONTENT AD]

<h2>Related Tools</h2>
[TOOL CARD GRID  -  Character Counter, Case Converter, Remove Duplicate Lines]
```

### H1 Pattern

The H1 should match the primary keyword exactly or nearly:
- "Word Counter" (exact match for "word counter")
- "JSON Formatter" (exact match)
- "Base64 Encode / Decode" (covers both keywords in one H1)
- "Case Converter" (exact match)
- "URL Encoder / Decoder" (covers both)
- "Image Cropper" (exact match, also targets "crop image online" via intro text)

Do not add "Online" or "Free" to the H1  -  those belong in the title tag and intro text, not the H1. The H1 should be clean and match the tool name.

### Title Tag Pattern

```
[Primary Keyword]  -  Free, [Benefit], [Feature] | [Brand]
```

Examples:
- `Word Counter  -  Free Word & Character Count Online | Tinytools`
- `JSON Formatter  -  Validate & Beautify JSON Online | Tinytools`
- `Base64 Encode / Decode  -  Free Online Converter | Tinytools`
- `UUID Generator  -  Free v4 UUID Generator Online | Tinytools`
- `Remove Duplicate Lines  -  Free Text Cleaner | Tinytools`

Title tag max: 60 characters before Google truncates. Brand name at the end, separated by pipe.

### Meta Description Pattern

```
[Primary action] online for free. [Key benefit]. [Differentiator]. 
No signup required, works in your browser.
```

Examples:
- `Count words, characters, and sentences in real time. Free word counter tool  -  no ads on the tool, no signup, works instantly in your browser.`
- `Format, validate, and beautify JSON online. Highlights errors, auto-indents your code. Free JSON formatter  -  no data sent to servers.`

Target: 145-155 characters. Include primary keyword in first 50 characters.

### Schema Markup

Use `WebApplication` schema for tool pages:

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Word Counter",
  "url": "https://tinytools.com/tools/word-counter",
  "description": "Count words, characters, sentences online free.",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
}
```

Also add `BreadcrumbList` schema for the category breadcrumb:

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Tools", "item": "/tools"},
    {"@type": "ListItem", "position": 2, "name": "Text Tools", "item": "/tools/text"},
    {"@type": "ListItem", "position": 3, "name": "Word Counter"}
  ]
}
```

FAQ schema is optional but high-value  -  Google can render FAQ rich snippets in search results, which increases CTR by 20-30%:

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How does the word counter work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The word counter splits your text by whitespace and counts each segment..."
      }
    }
  ]
}
```

### Internal Linking Structure

Every tool page links to:
1. **Related tools** (3-4 tools in the same category or with overlapping use cases)  -  shown in a grid below the FAQ
2. **Category hub** (e.g., "See all Text Tools →")  -  builds crawl depth for the category page
3. **Homepage** via the nav logo  -  breadcrumb anchor text

Category hub pages link to:
1. Every tool in that category (complete list with descriptions)
2. 2-3 other category hubs ("You might also need: Developer Tools, Image Tools")

Homepage links to:
1. All category hubs
2. Featured/popular tools (top 6-8 by traffic estimate)

This creates a 3-level internal link hierarchy: Homepage → Category Hub → Tool Page. Google's crawler reaches every tool page in 3 clicks from the homepage.

---

## 5. Launch Checklist

### Pre-Launch: Must Have (No Launch Without These)

**Technical:**
- [ ] All 10 tools built and tested on desktop and mobile
- [ ] Astro build passes with no errors (`astro build`)
- [ ] Cloudflare Pages project configured and deploying from GitHub
- [ ] `robots.txt` live at `/robots.txt` (allow all, disallow nothing at launch)
- [ ] `sitemap.xml` generated by `@astrojs/sitemap` and accessible at `/sitemap.xml`
- [ ] Privacy policy page live at `/privacy` (must mention client-side processing, AdSense cookies, no data collection for file tools)
- [ ] About page live at `/about`
- [ ] Contact page or email live at `/contact`
- [ ] 404 page configured (Cloudflare Pages supports custom 404 via `404.astro`)
- [ ] OG image configured per tool (even a generic template is fine at launch)
- [ ] Canonical URLs set on every page
- [ ] No broken internal links (run `astro check` + a crawler like Screaming Frog free tier)

**SEO:**
- [ ] Google Search Console: site verified (via DNS TXT record in Cloudflare)
- [ ] Sitemap submitted to Google Search Console
- [ ] Bing Webmaster Tools: verified and sitemap submitted
- [ ] Google Analytics 4: tracking installed (via Partytown for async loading to avoid CWV impact)
- [ ] Core Web Vitals passing: LCP < 2.5s, INP < 200ms, CLS < 0.1 on mobile (run PageSpeed Insights)

**Monetization:**
- [ ] Google AdSense account created (apply with the site live; approval takes 1-4 weeks)
- [ ] AdSense auto ads temporarily enabled during approval review period
- [ ] Once approved: replace auto ads with manual hardcoded placements (2-3 per page)
- [ ] Privacy policy covers AdSense cookie consent (required for EU visitors  -  add a simple cookie consent banner or use Cloudflare's Zaraz for consent management)

**Legal / Brand:**
- [ ] Domain registered (verify toolflare.com or chosen domain via Porkbun/Namecheap first)
- [ ] HTTPS live (automatic with Cloudflare Pages)
- [ ] GitHub repo public and MIT license file committed
- [ ] GitHub issue link on every tool page (the "report an issue" or "suggest improvement" link)
- [ ] Terms of service page (basic: tools provided as-is, no warranty)

### Pre-Launch: Nice to Have (Can Do Week 1 Post-Launch)

- [ ] OG images per tool (not just a generic brand image)
- [ ] Favicon and Apple touch icon
- [ ] Twitter/X card meta tags (`twitter:card`, `twitter:image`)
- [ ] Structured data (WebApplication + FAQ schema) on all tool pages
- [ ] Breadcrumb navigation visible on tool pages
- [ ] Tool search / filter on the tools index page
- [ ] Dark mode toggle

### Launch Day Actions

1. **Submit to directories:** Product Hunt (schedule a PH launch), Hacker News (Show HN post), IndieHackers (post in the "what I'm building" thread), Reddit r/webdev, r/SideProject
2. **Submit to tool directories:** alternativeto.net, slant.co (list each tool), toolbox.so if available
3. **Ping Google to re-crawl:** In Google Search Console, use the URL Inspection tool to request indexing for the homepage, /tools/, and one or two tool pages manually
4. **Create GitHub repo and submit to awesome-lists:** GitHub's "awesome-tools" and similar lists generate backlinks
5. **Post on X:** Announce launch with a screenshot of 2-3 tools; tag relevant dev communities

### Post-Launch: First 30 Days

- [ ] Monitor Google Search Console for crawl errors and indexing status daily for first week
- [ ] Check Core Web Vitals in Search Console (takes 2-4 weeks to populate)
- [ ] Publish 1 new tool per week (start with the easiest: resize image, lorem ipsum, hash generator)
- [ ] Respond to GitHub issues  -  even 1-2 early users reporting bugs or requesting features signals the site is alive to Google
- [ ] Check AdSense for policy violations if using auto ads
- [ ] Apply for Ezoic once monthly sessions reach 10,000

### AdSense Approval Timeline

- **Week 1-2 post-launch:** Site live with content, apply for AdSense
- **Week 2-6:** AdSense review period (can be as fast as 24 hours for clean sites; average 2-3 weeks)
- **After approval:** Switch from no ads to 2-3 manual ad placements per tool page
- **Month 3-4:** If sessions exceed 10K/month, apply to Ezoic for 2-3x RPM improvement

### Minimum Viable Launch (Absolutely Bare Minimum)

If you want to launch as fast as possible and iterate:
1. 10 tools live and working
2. Privacy policy page
3. robots.txt + sitemap.xml
4. Google Analytics 4 installed
5. Google Search Console verified + sitemap submitted
6. Domain live on Cloudflare Pages

Everything else can be added post-launch. AdSense approval can be applied for while the site is still growing. The key is: get indexed on day 1. Indexing lag is 2-4 weeks for new domains; that clock starts when the site is live and the sitemap is submitted.

---

## 6. Implementation Priority Order

Based on all research above, the recommended build sequence:

### Phase 1: Foundation (Days 1-3)
1. Create Astro project with Tailwind
2. Set up Cloudflare Pages deployment from GitHub
3. Build `tools.ts` registry with all 10 tool entries
4. Build `ToolLayout.astro` with SEO meta template, ad slots, related tools section
5. Build homepage and `/tools/` index with tool cards grid

### Phase 2: Pure JS Tools (Days 4-6)
These are zero-dependency and fastest to build:
1. Word Counter
2. Character Counter
3. Case Converter
4. Remove Duplicate Lines
5. UUID Generator
6. URL Encode/Decode

### Phase 3: Library Tools (Days 7-9)
1. JSON Formatter (add Prism.js syntax highlighting)
2. Base64 Encode/Decode (add file support via FileReader)
3. Markdown to HTML (add marked + DOMPurify)

### Phase 4: UI-Intensive Tool (Days 10-12)
1. Image Cropper (Cropper.js + visa/passport presets)

### Phase 5: Content & Launch Prep (Days 13-14)
1. Write "How to Use" + FAQ content for all 10 tool pages
2. Privacy policy, About, Contact pages
3. Schema markup on all pages
4. OG images (basic template)
5. Submit sitemap, verify Search Console
6. Soft launch (GitHub public + HN post)

### Phase 6: QR Code + Growth (Days 15+)
1. Add QR code tool (basic URL-only)
2. Apply for AdSense
3. Ship 1 new tool per week

---

*Build plan compiled: April 7, 2026. Ready to execute.*
