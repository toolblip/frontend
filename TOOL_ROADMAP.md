# Toolblip Tool-Cluster Roadmap

*Compiled: April 8, 2026*
*Updated: April 11, 2026 -- Expanded Vision Added*

---

## The Three Pillars of Toolblip

Toolblip serves three distinct but related audiences:

### Pillar 1: First-Party Client-Side Tools

The original plan: a curated set of high-quality, 100% client-side online tools. These live at `toolblip.com/tools/[slug]` and require no backend, no account, and no payment. They are the foundation of the site's SEO value and the primary traffic driver.

**This roadmap covers Pillar 1 in full.**

### Pillar 2: Third-Party Tool & MCP Server Directory

A searchable directory at `toolblip.com/directory/` where users can discover:
- Standalone web tools built by other developers and companies
- MCP (Model Context Protocol) servers published by tool vendors and AI researchers
- AI-native tools and agents that expose MCP interfaces

This is a **curated discovery layer**. Toolblip does not build these tools -- it indexes, categorizes, and surfaces them to an audience actively searching for utility. Revenue comes from affiliate links, featured listings, and paid directory placements.

See [Directory Strategy](#directory-strategy) below for details.

### Pillar 3: Toolblip MCP Servers

A set of first-party MCP servers that package Toolblip's tools, data, and functionality as consumable resources for AI models and AI-powered applications. These MCP servers are the **machine接口** of Toolblip: instead of a human visiting a web page, an AI agent calls the MCP server to get real-time data, execute utility functions, and integrate Toolblip into autonomous workflows.

See [MCP Server Strategy](#mcp-server-strategy) below for details.

---

## Directory Strategy

### What the Directory Is

A curated, searchable index of third-party tools and MCP servers. Users come to the directory to:
- Discover tools that solve a specific problem (e.g., "image background removal", "PDF merge")
- Find MCP servers that expose specific capabilities for AI integration
- Compare alternatives based on pricing, platform support, and feature sets

### What the Directory Is Not

- Not a spam list of 10,000 uncurated links
- Not a paid-only listing with no organic signal
- Not a competitor to product hunt or alternative.to -- it is narrower and more technical (MCP-first)

### Data Model

Each directory entry represents one tool or MCP server:

```typescript
interface DirectoryEntry {
  slug: string;
  name: string;
  description: string;
  type: 'web-tool' | 'mcp-server' | 'api';
  category: string[];       // e.g., ['image', 'background-removal', 'mac', 'paid']
  pricing: 'free' | 'freemium' | 'paid' | 'open-source';
  websiteUrl: string;
  documentationUrl?: string;
  mcpRegistryUrl?: string;   // For MCP servers, link to their registry entry
  npmUrl?: string;          // For npm-published MCP servers
  logoUrl?: string;
  tags: string[];            // e.g., ['mac', 'windows', 'api', 'no-auth']
  featured?: boolean;
  dateAdded: string;
  metadata?: Record<string, string>;  // type-specific fields (e.g., MCP transport type)
}
```

### Directory Categories

Organized by tool type and use case:

| Category | Covers |
|----------|--------|
| `image` | Background removal, image editing, format conversion |
| `pdf` | Merge, split, convert, annotate |
| `text` | Writing aids, grammar, summarization |
| `developer` | Code generation, API testing, deployment tools |
| `data` | CSV/JSON transformation, database GUIs |
| `ai` | MCP servers, AI agents, LLM tooling |
| `browser` | Browser extensions, bookmarklets |
| `productivity` | Scheduling, note-taking, automation |

### How Listings Get Added

1. **Manual curation** -- The team discovers and adds tools manually. High quality, low volume. Start with 20-50 curated entries.
2. **Submit a tool** -- A form on `/directory/submit` lets developers submit their own tool. Submissions are reviewed before going live (anti-spam, quality gate).
3. **Auto-import from registries** -- Pull MCP servers from the official MCP registry (when one exists) and GitHub topics (`mcp-server`, `model-context-protocol`).

### Revenue Model

- **Featured listings** -- Paid placement at the top of category pages ($50-200/month per listing)
- **Affiliate links** -- Revenue share on paid tool signups (typical affiliate: 15-30% revenue share)
- **Sponsored categories** -- Tool vendors pay to sponsor a category page

### Directory Page URLs

```
/directory/              -- Full directory index, filterable by type/category/pricing
/directory/[slug]/       -- Individual tool/MCP server detail page
/directory/submit/       -- Submission form
/categories/[slug]/      -- Cross-links to directory categories
```

---

## MCP Server Strategy

### What Toolblip MCP Server Is

Toolblip publishes a single first-party MCP server package: `@toolblip/mcp`. It exposes Toolblip's functionality and data via the Model Context Protocol. AI models and AI agents can connect to it to:
- Execute utility functions (format conversion, encoding, hashing, image processing, PDF manipulation)
- Query curated reference data (HTTP status codes, MIME types, regex cheatsheets)
- Search the Toolblip directory programmatically

### Why Build a Single MCP Server

1. **AI agents are the next browser.** Just as web browsers became the dominant interface for humans, AI agents will become the dominant interface for machine tasks. Toolblip's utility is useful to humans today; making it consumable by AI future-proofs the product.
2. **Distribution via AI platforms.** MCP servers listed in the Toolblip directory become installable by any AI platform that supports MCP (Claude Desktop, Cursor, Copilot, etc.). This is free distribution to every AI user.
3. **Data and reference layer.** Not everything on Toolblip is a function. HTTP status codes, MIME types, regex syntax references -- these are static reference data that AI models can retrieve from an MCP server, keeping them accurate and up-to-date without training.
4. **One package to publish, one package to maintain.** Consolidating into a single npm package simplifies versioning, releases, and consumer configuration.

### Package Structure

The `@toolblip/mcp` package is a single TypeScript npm package that exposes three capability areas:

**Tool Utilities** -- Functions for encoding, hashing, formatting, conversion, and more:
```
- base64_encode / base64_decode
- url_encode / url_decode
- sha256_hash / md5_hash
- uuid_generate
- json_format / json_minify
- html_escape / html_unescape
- unix_timestamp_to_date / date_to_unix_timestamp
- csv_to_json / yaml_to_json / xml_to_json
- regex_test / regex_escape
```

**Image Tools** -- Canvas-based image manipulation:
```
- image_crop / image_resize / image_compress
- image_format_convert (WebP, JPG, PNG, HEIC)
- image_to_base64 / base64_to_image
- qr_generate / qr_read
```

**PDF Tools** -- pdf-lib-based PDF manipulation:
```
- pdf_merge / pdf_split / pdf_rotate
- pdf_add_watermark / pdf_reorder_pages
- pdf_to_images / images_to_pdf
```

**Reference Data** -- Read-only resources and query functions:
```
Resources:
- http-status-codes://
- mime-types://
- regex-cheatsheet://
- ascii-table://
- color-names://
- country-codes://
- timezones://
- unicode-emojis://

Functions:
- search_http_status_code / search_mime_type
- lookup_country_code / search_color
```

**Directory Search** -- Toolblip directory access:
```
Resources:
- directory://tools
- directory://mcp-servers
- directory://featured

Functions:
- search_tools / get_tool
- get_mcp_servers / get_similar_tools
```

**Implementation:** TypeScript, published as `@toolblip/mcp` on npm. Implements the MCP transport protocol using the `@modelcontextprotocol/sdk`. Ships as a single static bundle with embedded reference data.

**Who uses it:** AI coding assistants that want utility functions, reference data, and directory search without calling external APIs. Any AI agent that needs encoding, conversion, or tool discovery on the fly.

---

### How AI Models Consume `@toolblip/mcp`

The MCP protocol allows any MCP-compatible AI model or platform to connect to Toolblip's server. Here is the consumption flow:

```
1. Developer / User installs Toolblip MCP server:
   - Claude Desktop: Add to claude_desktop_config.json
   - Cursor: Add to MCP settings
   - Any MCP-compatible platform: Clone repo, add to config

2. AI model starts a session with the user.

3. When the user asks for something that maps to a Toolblip function
   (e.g., "hash this string with SHA-256"), the model calls the MCP server.

4. The MCP server executes the function and returns the result to the model.

5. The model responds to the user with the result.
```

Example in Claude Desktop's `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "@toolblip/mcp": {
      "command": "npx",
      "args": ["-y", "@toolblip/mcp"]
    }
  }
}
```

### MCP Server Roadmap

| Package | Priority | Est. Build | Notes |
|---------|:--------:|:----------:|-------|
| `@toolblip/mcp` | P0 | 2-3 weeks | Single unified package. All tool utilities, reference data, and directory search in one npm package. Published to npm at `@toolblip/mcp`. |

**Total MCP engineering investment: ~2-3 weeks.**

`@toolblip/mcp` is a TypeScript/npm package. It can be built in parallel with the web tool roadmap (they share no code but do share the same product context).

---

## Current Inventory (10 tools live)

| # | Tool | Category |
|---|------|----------|
| 1 | Word Counter | Text |
| 2 | Character Counter | Text |
| 3 | Case Converter | Text |
| 4 | Remove Duplicate Lines | Text |
| 5 | JSON Formatter | Developer |
| 6 | Base64 Encode/Decode | Developer |
| 7 | URL Encode/Decode | Developer |
| 8 | Markdown to HTML | Developer |
| 9 | UUID Generator | Developer |
| 10 | Image Cropper | Image |

---

## Tool Clusters

### Cluster 1: Text and Writing Tools

All pure client-side. No backend needed for any tool in this cluster.

| # | Tool | Already Built | Client-Side | Est. KD | Monthly Searches |
|---|------|:---:|:---:|:---:|:---:|
| 1 | Word Counter | Yes | Yes | - | - |
| 2 | Character Counter | Yes | Yes | - | - |
| 3 | Case Converter | Yes | Yes | - | - |
| 4 | Remove Duplicate Lines | Yes | Yes | - | - |
| 5 | Lorem Ipsum Generator | No | Yes | 15 | 300K-600K |
| 6 | Text Diff / Compare | No | Yes | 18 | 50K-100K |
| 7 | Sort Lines Alphabetically | No | Yes | 10 | 30K-50K |
| 8 | Add Line Numbers | No | Yes | 8 | 10K-20K |
| 9 | Remove Empty Lines | No | Yes | 8 | 15K-30K |
| 10 | Find and Replace | No | Yes | 12 | 40K-80K |
| 11 | Text to Slug / URL Slug Generator | No | Yes | 10 | 20K-40K |
| 12 | Reverse Text | No | Yes | 8 | 10K-20K |
| 13 | Truncate Text | No | Yes | 6 | 5K-10K |
| 14 | Random String Generator | No | Yes | 12 | 30K-60K |

**Client-side feasibility: 100%.** Every tool here is trivial JS string manipulation.


### Cluster 2: Developer / Code Tools

Pure client-side for most. A few (marked below) benefit from backend but have workable client-side alternatives.

| # | Tool | Already Built | Client-Side | Notes |
|---|------|:---:|:---:|:---:|
| 1 | JSON Formatter | Yes | Yes | - |
| 2 | Base64 Encode/Decode | Yes | Yes | - |
| 3 | URL Encode/Decode | Yes | Yes | - |
| 4 | Markdown to HTML | Yes | Yes | - |
| 5 | UUID Generator | Yes | Yes | - |
| 6 | Regex Tester | No | Yes | High volume (400K-800K), KD 25 |
| 7 | JWT Decoder | No | Yes | Pure JS decode, no library needed |
| 8 | Unix Timestamp Converter | No | Yes | Date math, trivial |
| 9 | Cron Expression Parser | No | Yes | cronstrue lib, cross-promo with Crontinel |
| 10 | JSON to YAML | No | Yes | js-yaml lib |
| 11 | YAML to JSON | No | Yes | js-yaml lib |
| 12 | CSV to JSON | No | Yes | papaparse lib |
| 13 | JSON to CSV | No | Yes | Built alongside CSV-to-JSON |
| 14 | HTML Entity Encode/Decode | No | Yes | Pure JS |
| 15 | Minify JS / CSS / HTML | No | Yes | terser/csso in browser, or simple regex |
| 16 | Beautify / Pretty Print (JS, CSS, HTML) | No | Yes | prettier standalone browser build |
| 17 | SQL Formatter | No | Yes | sql-formatter lib |
| 18 | JSON Path Evaluator | No | Yes | jsonpath-plus lib |
| 19 | XML to JSON | No | Yes | fast-xml-parser lib |
| 20 | Diff Viewer (code) | No | Yes | diff + syntax highlighting |
| 21 | HTTP Status Code Reference | No | Yes | Static reference page |

**Client-side feasibility: 100%.** All tools use browser-native APIs or small client-side libraries. No backend required.


### Cluster 3: Image and Media Tools

Mixed: most are client-side via Canvas API or WASM. A few heavy operations (background removal) use large WASM bundles but still run in-browser.

| # | Tool | Client-Side | Backend Needed? | Notes |
|---|------|:---:|:---:|:---:|
| 1 | Image Cropper (built) | Yes | No | Cropper.js |
| 2 | WebP to JPG | Yes | No | Canvas API |
| 3 | HEIC to JPG | Yes | No | heic2any lib (~200KB) |
| 4 | SVG to PNG | Yes | No | Canvas API |
| 5 | PNG to JPG | Yes | No | Canvas API |
| 6 | JPG to PNG | Yes | No | Canvas API |
| 7 | Image Compressor | Yes | No | browser-image-compression lib |
| 8 | Image Resizer | Yes | No | Canvas API |
| 9 | Remove Image Background | Yes (WASM) | No | @imgly/background-removal (~40MB WASM, lazy-loaded) |
| 10 | Social Media Image Resizer | Yes | No | Canvas API with platform presets |
| 11 | QR Code Generator | Yes | No | qrcode npm lib |
| 12 | QR Code Reader | Yes | No | jsQR lib + camera/file input |
| 13 | Image to Base64 | Yes | No | FileReader API |
| 14 | Favicon Generator | Yes | No | Canvas API, output multi-size ICO/PNG |
| 15 | Screenshot to Code | No | **Yes** | Needs vision model API |

**Client-side feasibility: 93% (14/15).** Only "Screenshot to Code" requires a backend (vision model). Background removal is client-side WASM but has a large initial download.


### Cluster 4: Data and Format Conversion Tools

All pure client-side.

| # | Tool | Client-Side | Notes |
|---|------|:---:|:---:|
| 1 | CSV to JSON | Yes | papaparse |
| 2 | JSON to CSV | Yes | Custom or papaparse |
| 3 | XML to JSON | Yes | fast-xml-parser |
| 4 | JSON to XML | Yes | fast-xml-parser |
| 5 | YAML to JSON | Yes | js-yaml |
| 6 | JSON to YAML | Yes | js-yaml |
| 7 | TSV to JSON | Yes | Simple split |
| 8 | Markdown to Plain Text | Yes | strip-markdown |
| 9 | Number Base Converter (bin/oct/hex/dec) | Yes | Pure JS |
| 10 | Unit Converter (length, weight, temp) | Yes | Pure JS |

**Client-side feasibility: 100%.** No backend needed for any conversion tool.


### Cluster 5: Encoding / Crypto / Hash Tools

All client-side via Web Crypto API or pure JS.

| # | Tool | Client-Side | Notes |
|---|------|:---:|:---:|
| 1 | Hash Generator (MD5/SHA-1/SHA-256/SHA-512) | Yes | Web Crypto API (MD5 via js-md5) |
| 2 | HMAC Generator | Yes | Web Crypto API |
| 3 | Bcrypt Hash Generator | Yes | bcryptjs in browser |
| 4 | Password Generator | Yes | Web Crypto API |
| 5 | ROT13 Encoder/Decoder | Yes | Pure JS |
| 6 | Morse Code Translator | Yes | Pure JS lookup table |
| 7 | CRC32 Checksum | Yes | Pure JS |
| 8 | AES Encrypt/Decrypt | Yes | Web Crypto API |

**Client-side feasibility: 100%.** Web Crypto API covers the heavy lifting.


### Cluster 6: PDF Tools

Mostly client-side using pdf-lib and PDF.js. Some advanced operations need a backend.

| # | Tool | Client-Side | Backend Needed? | Notes |
|---|------|:---:|:---:|:---:|
| 1 | Merge PDF | Yes | No | pdf-lib |
| 2 | Split PDF | Yes | No | pdf-lib |
| 3 | Rotate PDF | Yes | No | pdf-lib |
| 4 | Compress PDF | Partial | Optional | pdf-lib can rewrite; true compression needs ghostscript backend |
| 5 | PDF to Image | Yes | No | PDF.js renders to canvas, then export |
| 6 | Image to PDF | Yes | No | pdf-lib embeds images |
| 7 | Add Watermark to PDF | Yes | No | pdf-lib draws text/image overlay |
| 8 | PDF Page Reorder | Yes | No | pdf-lib |
| 9 | HTML to PDF | No | **Yes** | Needs Puppeteer/wkhtmltopdf for accurate rendering |

**Client-side feasibility: 78% (7/9).** Compress PDF works partially client-side. HTML to PDF needs a backend for reliable output.


### Cluster 7: Color and Design Tools

All pure client-side.

| # | Tool | Client-Side | Notes |
|---|------|:---:|:---:|
| 1 | Color Picker | Yes | Canvas + EyeDropper API |
| 2 | Hex to RGB/HSL Converter | Yes | Pure JS math |
| 3 | Contrast Checker (WCAG) | Yes | WCAG luminance formula |
| 4 | Color Palette Generator | Yes | Color theory algorithms |
| 5 | Gradient CSS Generator | Yes | Live preview + CSS output |
| 6 | Tailwind Color Reference | Yes | Static data |
| 7 | CSS Box Shadow Generator | Yes | Live preview |
| 8 | Border Radius Previewer | Yes | Live preview |

**Client-side feasibility: 100%.** No backend needed.


### Cluster 8: Math and Utility Tools

All pure client-side. High search volume, very easy to build.

| # | Tool | Client-Side | Notes |
|---|------|:---:|:---:|
| 1 | Percentage Calculator | Yes | Pure JS, massive search volume |
| 2 | Age Calculator | Yes | Date math |
| 3 | Byte/KB/MB/GB Converter | Yes | Pure JS |
| 4 | Aspect Ratio Calculator | Yes | GCD math |
| 5 | Countdown Timer / Stopwatch | Yes | setInterval |
| 6 | Time Zone Converter | Yes | Intl.DateTimeFormat API |

**Client-side feasibility: 100%.**

---

## Client-Side vs Backend Summary

| Cluster | Total Tools | Pure Client-Side | Backend Needed |
|---------|:-----------:|:----------------:|:--------------:|
| Text and Writing | 14 | 14 (100%) | 0 |
| Developer / Code | 21 | 21 (100%) | 0 |
| Image and Media | 15 | 14 (93%) | 1 (Screenshot to Code) |
| Data and Format Conversion | 10 | 10 (100%) | 0 |
| Encoding / Crypto / Hash | 8 | 8 (100%) | 0 |
| PDF | 9 | 7 (78%) | 2 (HTML to PDF, Compress PDF fully) |
| Color and Design | 8 | 8 (100%) | 0 |
| Math and Utility | 6 | 6 (100%) | 0 |
| **Total** | **91** | **88 (97%)** | **3** |

Only 3 tools out of 91 require a backend. The rest are fully client-side.

---

## Best First Cluster for Launch: Developer / Code Tools

**Recommendation: Expand the Developer / Code Tools cluster first.**

Rationale:

1. **SEO volume is massive.** Regex Tester alone targets 400K-800K monthly searches. JWT Decoder, Unix Timestamp Converter, and Hash Generator each target 100K-300K. These are queries developers search repeatedly.

2. **Already have 5 dev tools live.** Adding more builds topical authority in Google's eyes. A site with 10 developer tools ranks better for each individual tool than a site with 2 developer tools and 8 scattered across other categories.

3. **Zero dependencies, fastest build.** Every Priority 1 tool is pure JS with no library needed (or tiny ones). A developer can ship all 5 in a single day.

4. **Audience match.** Developers are the ideal first audience: they share tools on Reddit/HN, they bookmark useful sites, and they are the demographic most likely to return. Building developer trust first creates a base for expanding into general-audience tools (image, PDF, text) later.

5. **Low keyword difficulty.** KD 12-25 range means a new site can start ranking in 3-6 months with decent on-page SEO and a few backlinks from launch announcements.

Second cluster to prioritize: **Image and Media Tools** (WebP/HEIC conversion). These have the highest raw search volume of any cluster and target a broader audience beyond developers.

---

## First 10 Tools to Build (Priority Order)

These are the next 10 tools beyond the 10 already live, in exact build order.

| Priority | Tool | Cluster | Build Time | Justification |
|:--------:|------|---------|:----------:|---------------|
| 1 | **Regex Tester** | Developer | 4 hrs | Highest search volume of any single dev tool (400K-800K/mo). Core utility that drives repeat visits. Pure JS with Web API. |
| 2 | **Hash Generator (SHA-256/MD5)** | Encoding | 2 hrs | Web Crypto API, zero deps. 150K-300K searches/mo at KD 14. Complements Base64 tool already live. |
| 3 | **Lorem Ipsum Generator** | Text | 2 hrs | 300K-600K searches/mo. Trivial to build. Appeals to designers and developers alike, broadening the audience. |
| 4 | **Unix Timestamp Converter** | Developer | 2 hrs | 100K-200K searches/mo. Developers search this constantly. Pure JS Date math. |
| 5 | **JWT Decoder** | Developer | 2 hrs | 100K-200K searches/mo. No library needed (it is just Base64 + JSON parse). Strong dev audience signal. |
| 6 | **WebP to JPG** | Image | 2 hrs | 200K-400K searches/mo. Canvas API, trivial build. Opens the image conversion category. |
| 7 | **HEIC to JPG** | Image | 4 hrs | 300K-600K searches/mo. Uses heic2any lib. Huge demand from iPhone users sharing photos. |
| 8 | **SVG to PNG** | Image | 2 hrs | 150K-300K searches/mo. Canvas API. Pairs with the image cluster from tools 6-7. |
| 9 | **CSV to JSON** | Data | 3 hrs | 150K-300K searches/mo. papaparse lib. Opens data conversion category. |
| 10 | **JSON to CSV** | Data | 1 hr | 100K-200K searches/mo. Built alongside CSV to JSON with shared logic. |

**Total estimated build time: ~24 hours of dev work.**

Tools 1-5 should ship in the first 2 weeks. Tools 6-10 in weeks 3-4. This matches the timeline in LAUNCH_PLAN.md.

---

## After the First 10: Next Wave (tools 21-30)

| Tool | Cluster | Why |
|------|---------|-----|
| Cron Expression Parser | Developer | Cross-promo with Crontinel, niche but loyal audience |
| Password Generator | Encoding | High volume, trivial build |
| Merge PDF | PDF | Opens PDF cluster, massive volume |
| Image Compressor | Image | High demand, browser-image-compression lib |
| Color Picker | Color | Opens design cluster |
| JSON to YAML / YAML to JSON | Developer | Pair build, dev audience |
| Sort Lines Alphabetically | Text | Simple, fills out text cluster |
| Percentage Calculator | Math | Massive volume, trivial build |
| Contrast Checker (WCAG) | Color | Accessibility angle, good for backlinks |
| QR Code Generator | Image | High volume, simple lib |

---

## Notes

- This roadmap builds on LAUNCH_PLAN.md sections 5-7. The launch sequence and timeline in that document remain the execution plan.
- All search volume estimates are approximate ranges based on Ahrefs/Semrush-class data for US English queries.
- KD (Keyword Difficulty) scores are on a 0-100 scale. Anything under 30 is rankable for a new site with good on-page SEO.
- "Backend needed" means the tool cannot deliver acceptable quality using only browser APIs. It does not mean it is impossible client-side, just that the result would be poor enough to hurt user trust.
