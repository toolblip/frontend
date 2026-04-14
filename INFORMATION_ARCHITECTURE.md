# Toolblip Information Architecture

*Compiled: April 8, 2026*

---

## 1. Site Map

```
toolblip.com/
|
+-- / (homepage: hero + tool grid + trust section)
|
+-- /tools/ (all tools index, filterable/searchable)
|   +-- /tools/json-formatter/
|   +-- /tools/base64/
|   +-- /tools/regex-tester/
|   +-- ... (individual tool pages, flat under /tools/)
|
+-- /categories/ (category hub index: links to all category pages)
|   +-- /categories/text/
|   +-- /categories/developer/
|   +-- /categories/image/
|   +-- /categories/pdf/
|   +-- /categories/encoding/
|   +-- /categories/data-conversion/
|   +-- /categories/color-design/
|   +-- /categories/math-utility/
|
+-- /directory/ (third-party tool & MCP server directory)
|   +-- /directory/[slug]/ (individual directory entry)
|   +-- /directory/submit/ (tool submission form)
|   +-- /directory/category/[cat]/ (filtered by category)
|
+-- /mcp/ (MCP server landing pages and docs)
|   +-- /mcp/tools/ (toolblip-tools MCP server docs)
|   +-- /mcp/reference/ (toolblip-reference MCP server docs)
|   +-- /mcp/directory/ (toolblip-directory MCP server docs)
|
+-- /about/
+-- /privacy/
+-- /terms/
+-- /404/
+-- /sitemap.xml (auto-generated)
+-- /robots.txt
```

### Why this hierarchy

- **Tools stay flat under `/tools/`** because that is already built, indexed, and working. Restructuring URLs later means redirects and lost link equity.
- **Categories get their own `/categories/` branch** instead of nesting tools under category paths. This gives categories dedicated SEO-targetable pages without forcing a two-level URL on every tool.
- **Homepage** remains the primary entry point with a curated tool grid. As tool count grows, the homepage shifts from "show all tools" to "show featured/popular tools" with a link to the full index.
- **Blog is deferred.** A `/blog/` section is useful eventually for long-tail SEO ("how to validate JSON", "what is Base64 encoding") but adds maintenance burden. Do not create it until the site has 30+ tools and organic traffic data from Search Console that reveals which informational queries to target. When you do create it, use `/blog/` at the root level.

---

## 2. URL Structure

### Decision: Keep `/tools/[slug]/` (flat)

The current pattern is `/tools/json-formatter/`. This is the correct long-term choice. Here is the evaluation of the alternatives:

| Pattern | Example | Pros | Cons | Verdict |
|---------|---------|------|------|---------|
| `/tools/[slug]/` | `/tools/json-formatter/` | Already built. Flat, simple, predictable. Scales to 500+ tools without URL changes. Google treats `/tools/` as a clear section signal. | Slightly longer than top-level. | **Use this.** |
| `/[slug]/` | `/json-formatter/` | Shortest URL. Some SEO practitioners believe shorter = better. | Collides with static pages (`/about`, `/privacy`, `/blog`). No structural signal that this is a "tool." Impossible to distinguish tool pages from content pages in analytics, Search Console, or sitemaps. Forces awkward namespace management as the site grows. | Reject. |
| `/[category]/[slug]/` | `/developer/json-formatter/` | Groups tools visually by category. | Forces a 1:1 tool-to-category mapping. Some tools span categories (e.g., CSV to JSON is both "developer" and "data conversion"). Changing a tool's category means changing its URL, which means redirects. Adds a path segment that conveys little to the user. Already rejected in LAUNCH_PLAN.md. | Reject. |
| `/tools/[category]/[slug]/` | `/tools/developer/json-formatter/` | Clear hierarchy in URL. | Same problems as above: forces single-category assignment, URL breakage on re-categorization, extra path depth. Google does not weight URL path hierarchy for ranking. | Reject. |

### Slug rules

- All lowercase, hyphenated: `json-formatter`, `webp-to-jpg`, `sha256-hash-generator`
- No abbreviations unless universally understood: `uuid-generator` (fine), `url-encode` (fine), `b64` (not fine)
- Conversion tools use the pattern `[from]-to-[to]`: `csv-to-json`, `webp-to-jpg`, `heic-to-jpg`
- Encode/decode tools use the base name: `base64`, `url-encode` (not `base64-encode-decode`)
- Generator tools use `[thing]-generator`: `uuid-generator`, `password-generator`, `lorem-ipsum-generator`
- Maximum 4 words in a slug. If a tool name is longer, abbreviate sensibly.

### Category page URLs

Categories live at `/categories/[category-slug]/`:

| Category | URL |
|----------|-----|
| Text and Writing | `/categories/text/` |
| Developer / Code | `/categories/developer/` |
| Image and Media | `/categories/image/` |
| PDF | `/categories/pdf/` |
| Encoding / Crypto / Hash | `/categories/encoding/` |
| Data and Format Conversion | `/categories/data-conversion/` |
| Color and Design | `/categories/color-design/` |
| Math and Utility | `/categories/math-utility/` |

Using `/categories/` instead of `/tools/text/` avoids ambiguity: `/tools/text/` could be mistaken for a tool called "text." It also keeps the `/tools/` path clean for tool pages only.

---

## 3. Navigation Model

### Current state

The nav has one link: "All Tools". The footer has "Privacy" and "Terms". This works for 10 tools but breaks at 30+.

### Target navigation (implement incrementally)

#### Primary nav (header, always visible)

```
[Toolblip logo]                    [All Tools]  [Categories v]  [About]
```

- **All Tools** links to `/tools/` (the full index)
- **Categories** is a dropdown/flyout showing the 8 category names, each linking to its `/categories/[slug]/` page
- **About** links to `/about/`
- On mobile: hamburger menu with the same items, categories expandable as an accordion

#### When to add each nav element

| Milestone | Nav change |
|-----------|------------|
| Now (10 tools) | Keep current single "All Tools" link. Add "About" after creating that page. |
| 15-20 tools | Add "Categories" dropdown with the 3-4 categories that have 3+ tools each. Do not show empty categories. |
| 30+ tools | Add search to the nav bar (client-side search against a tool manifest JSON). |
| 50+ tools | Consider a sidebar nav on `/tools/` and category pages for filtering by category. |

#### Footer nav expansion

```
Tools: All Tools | Text | Developer | Image | PDF
Company: About | Privacy | Terms
```

Add category links to the footer once category pages exist. This provides crawl paths for Google and contextual links for users.

#### Mobile pattern

- Hamburger menu for primary nav
- On `/tools/` index: category filter chips at the top (horizontally scrollable), one chip per category, tapping a chip filters the grid in place (no page navigation)
- On category pages: same chip bar but with the current category highlighted

### Search

At 30+ tools, add a search input to the `/tools/` page and the nav bar. Implementation:

1. Build a `tools-manifest.json` at build time containing `{slug, name, description, category, keywords}` for every tool
2. Load it on the client and filter with a simple substring/fuzzy match
3. Show results as a dropdown below the search input (max 8 results)
4. No backend needed. The manifest will be under 50KB even at 200 tools.

---

## 4. Internal Linking Strategy

Internal links serve two purposes: helping users discover related tools, and distributing PageRank/authority across the site.

### Link types and where to place them

#### 4.1 Related tools (tool page -> tool pages)

Already implemented in the `related` slot of ToolLayout. Current implementation is manual (each tool hardcodes 2-3 related links). Rules for scaling:

- Every tool page must link to 3-5 related tools
- "Related" means: same category, complementary function (encode/decode pairs), or common workflow (JSON Formatter -> JSON to YAML -> YAML to JSON)
- When the tool registry is centralized to `src/data/tools.ts`, add a `relatedSlugs: string[]` field to each tool entry and render the related section automatically from ToolLayout
- Link text should be the tool name, not "click here" or generic anchor text

#### 4.2 Category page -> tool pages

Each category page lists all tools in that category with name, description, and link. This is the primary way category pages pass authority to tool pages.

- Show tools sorted by popularity (most-used first, once analytics data exists) or alphabetically initially
- Each tool card links to `/tools/[slug]/`

#### 4.3 Tool page -> category page

The breadcrumb in ToolLayout currently shows: Home > Tools > [Tool Name]

Update it to: Home > Tools > [Category Name] > [Tool Name]

- "Tools" links to `/tools/`
- "[Category Name]" links to `/categories/[category-slug]/`
- This creates a bidirectional link between every tool and its primary category

When a tool belongs to multiple categories (e.g., CSV to JSON is both Developer and Data Conversion), pick one as the primary for the breadcrumb. The tool can still appear on multiple category pages.

#### 4.4 Homepage -> tool pages + category pages

- Homepage tool grid links directly to tool pages (already working)
- Once categories exist, add a "Browse by Category" section below the tool grid with links to each category page
- As tool count grows past 20, the homepage should show "Popular Tools" (6-8 tools) instead of all tools, with a "View all X tools" link to `/tools/`

#### 4.5 Cross-tool contextual links

In the "About this tool" / description section of each tool, naturally mention and link to related tools. Examples:

- On the JSON Formatter page: "Need to convert your JSON to YAML? Try our [JSON to YAML converter](/tools/json-to-yaml/)."
- On the Base64 page: "Working with URLs? You might also need our [URL Encoder/Decoder](/tools/url-encode/)."
- These in-content links carry more SEO weight than navigational links because they appear in contextual prose.

#### 4.6 "You might also need" section

Below the related tools section, add a "Popular tools" or "You might also need" block showing 3-4 tools from other categories. This creates cross-category links that prevent authority from siloing within a single category.

#### 4.7 Category page -> category page

On each category page, add a small "Other categories" section at the bottom linking to 3-4 other category pages. This ensures every category page is reachable within 2 clicks from any other category page.

### Link architecture diagram

```
Homepage
  |--- links to ---> /tools/ (all tools index)
  |--- links to ---> /categories/[slug]/ (browse by category section)
  |--- links to ---> /tools/[slug]/ (featured tools in grid)

/tools/ (all tools index)
  |--- links to ---> /tools/[slug]/ (every tool)
  |--- links to ---> /categories/[slug]/ (category filter chips)

/categories/[slug]/ (category page)
  |--- links to ---> /tools/[slug]/ (all tools in category)
  |--- links to ---> /categories/[other]/ (other categories section)
  |--- links to ---> /tools/ (breadcrumb)
  |--- links to ---> / (breadcrumb)

/tools/[slug]/ (tool page)
  |--- links to ---> /tools/[slug]/ (related tools, 3-5)
  |--- links to ---> /tools/[slug]/ (contextual in-content links, 1-2)
  |--- links to ---> /categories/[slug]/ (breadcrumb)
  |--- links to ---> /tools/ (breadcrumb)
  |--- links to ---> / (breadcrumb)
```

Every page is reachable within 3 clicks from the homepage. No orphan pages.

---

## 5. Pages to Create Before Tool Count Scales

### Before tool #20 (build now or during launch week)

These are structural pages that become necessary once you have enough tools for meaningful categorization.

| Page | URL | Why | Effort |
|------|-----|-----|--------|
| **About** | `/about/` | AdSense requirement. Trust signal. Already identified in LAUNCH_PLAN.md. | 30 min |
| **404** | `/404/` | Catches broken links and dead URLs. Show a search box and popular tools. | 15 min |
| **Centralized tool registry** | `src/data/tools.ts` | Not a page, but a prerequisite for everything else. Both homepage and `/tools/` currently hardcode the same array. Extract it so category pages, search, sitemap, and nav all read from one source. | 30 min |

### Before tool #30 (when categories become meaningful)

| Page | URL | Why | Effort |
|------|-----|-----|--------|
| **Category pages** (first 3-4) | `/categories/text/`, `/categories/developer/`, `/categories/image/` | Each category with 5+ tools deserves its own landing page. These target category-level keywords ("free online text tools", "developer tools online"). | 2 hrs total |
| **Category index** | `/categories/` | Lists all categories with tool counts. Serves as a hub page for Google to discover all category pages. | 30 min |
| **Updated /tools/ with filtering** | `/tools/` | Add category filter chips to the existing all-tools page. Client-side filtering, no new pages needed. | 1 hr |

### Before tool #50 (when discoverability becomes critical)

| Page | URL | Why | Effort |
|------|-----|-----|--------|
| **Search** | (component, not a page) | Client-side search across all tools. Add to nav bar and `/tools/` page. | 2 hrs |
| **Remaining category pages** | `/categories/pdf/`, `/categories/encoding/`, etc. | Any category with 3+ tools gets a page. | 1 hr each |
| **Homepage redesign** | `/` | Stop showing all tools. Show "Popular Tools" (6-8), "New Tools" (3-4), and "Browse by Category" section. Link to `/tools/` for the full list. | 2 hrs |

### Before tool #100 (when the site is a destination)

| Page | URL | Why | Effort |
|------|-----|-----|--------|
| **Blog** (if SEO data justifies it) | `/blog/` | Long-form content targeting informational queries ("how to validate JSON", "what is Base64 encoding"). Only create if Search Console shows impressions for these queries. | Ongoing |
| **API landing page** | `/api/` | If fake-door validation from LAUNCH_PLAN.md shows demand. Email capture for API access waitlist. | 1 hr |
| **Changelog / What's New** | `/changelog/` | Shows recent tool additions. Gives returning visitors a reason to check back. Can be auto-generated from the tool registry by sorting on `dateAdded`. | 1 hr |

### Pages to NOT create

- **/tools/[category]/[slug]/** -- Do not nest tools under categories in the URL. Already decided above.
- **/login, /register, /dashboard** -- No auth until fake-door validation proves demand for saved history or API access. The static site can reach 100+ tools without a backend.
- **/pricing** -- No pricing page until there is something to price. The site is free.
- **/contact** -- The about page can include a contact email. A separate contact page is unnecessary overhead.
- **/blog/** before tool #50 -- Blog content requires ongoing maintenance. Focus on shipping tools first. Each tool page is its own SEO landing page with built-in content (description, how-to, FAQ).

---

## 6. Tool Registry Schema

When centralizing the tool array to `src/data/tools.ts`, use this schema. It powers the homepage grid, `/tools/` index, category pages, search, related tools, breadcrumbs, and sitemap.

```typescript
interface Tool {
  slug: string;            // URL segment: "json-formatter"
  name: string;            // Display name: "JSON Formatter"
  description: string;     // One-line description for cards and meta
  emoji: string;           // Card icon
  category: Category;      // Primary category (used in breadcrumbs)
  categories: Category[];  // All categories this tool belongs to
  relatedSlugs: string[];  // 3-5 slugs of related tools
  isNew?: boolean;         // Show "New" badge (auto-expire after 14 days?)
  dateAdded?: string;      // ISO date, used for changelog and "New" logic
  keywords?: string[];     // Extra terms for search matching
}

type Category =
  | 'text'
  | 'developer'
  | 'image'
  | 'pdf'
  | 'encoding'
  | 'data-conversion'
  | 'color-design'
  | 'math-utility';

interface CategoryMeta {
  slug: Category;
  name: string;            // "Text and Writing Tools"
  description: string;     // For the category page meta description
  emoji: string;           // Category icon
}
```

This registry becomes the single source of truth. The homepage, `/tools/` index, category pages, nav dropdown, search, and related tools all derive from it. No more duplicated arrays.

---

## 7. Directory Architecture (Pillar 2)

The directory is a curated index of third-party tools and MCP servers. It runs on the same Astro infrastructure as the tool pages but has its own data schema and rendering patterns.

### Directory Data Storage

Directory entries live in `src/data/directory/` as individual JSON or Markdown files (one file per entry). At build time, a script aggregates all entries into `public/directory-manifest.json` which feeds both the directory pages and the `@toolblip/mcp-server-directory` npm package.

```
src/data/directory/
  ├── tool-remove-bg.json
  ├── mcp-server-filesystem.json
  ├── tool-pdfmerge-online.json
  └── ...
```

This flat-file approach keeps the directory easy to maintain without a database. Entries can be submitted via a form (`/directory/submit/`) that writes to a staging folder, reviewed, then moved to the main folder.

### Directory Page Structure

| Page | URL | Purpose |
|------|-----|---------|
| Directory index | `/directory/` | Filterable grid of all entries. Filters: type (web-tool/mcp-server), category, pricing. |
| Category page | `/directory/category/[cat]/` | Filtered view for one category |
| Entry page | `/directory/[slug]/` | Full entry: description, metadata, tags, links, similar tools |
| Submit page | `/directory/submit/` | Form for developers to submit their tool |

### Directory Entry Page Layout

Each entry page contains:
- Logo, name, tagline, and type badge (web-tool / mcp-server)
- Long-form description
- Metadata grid: pricing, platform, author, license, last updated
- "Install / Use" section: direct links, npm install command for MCP servers, or "Visit Website" CTA
- Tags as clickable filter chips
- Related tools (from the same category)
- "Suggest an edit" link

### Integration with Tool Pages

The directory is **not** nested inside the tool site. It is a sibling section with its own URL namespace (`/directory/`). However, both sections share:
- The same Astro layout components (BaseLayout, nav, footer)
- The same design system (colors, typography, spacing)
- Cross-links where relevant (e.g., a tool page may link to a similar directory entry)

### SEO for the Directory

Each directory entry page targets a specific long-tail keyword: `[tool name] review`, `[tool name] alternative`, `[MCP server name]`. Category pages target broader terms: `best MCP servers for [use case]`, `free image tools online`.

Schema.org structured data on directory entry pages: `SoftwareApplication` with `applicationCategory`, `operatingSystem`, and `offers` fields.

---

## 8. MCP Server Architecture (Pillar 3)

### Overview

Toolblip MCP servers are published as npm packages (`@toolblip/mcp-server-*`) and hosted in their own GitHub repositories under the Toolblip organization. Each server is:
- A standalone Node.js package
- Built with the `@modelcontextprotocol/sdk`
- Documented at `/mcp/[server-name]/` on the Toolblip website
- Published to npm so it can be installed with `npx` or added to any MCP-compatible client

### Repository Structure

```
toolblip-mcp-tools/           -- @toolblip/mcp-server-tools repo
  ├── src/
  │   └── index.ts            -- Main server entry
  │   └── tools/              -- Individual tool implementations
  ├── package.json
  ├── README.md
  └── tsconfig.json

toolblip-mcp-reference/       -- @toolblip/mcp-server-reference repo
  ├── src/
  │   └── index.ts
  │   └── data/               -- Static JSON reference data
  ├── package.json
  └── README.md

toolblip-mcp-directory/       -- @toolblip/mcp-server-directory repo
  ├── src/
  │   └── index.ts
  │   └── manifest.ts         -- Reads from directory-manifest.json
  ├── package.json
  └── README.md
```

### MCP Server Registries

Toolblip MCP servers should be listed in:
1. **Official MCP registry** -- When the protocol has an official registry (similar to npm)
2. **Toolblip directory** -- Each MCP server also appears as a directory entry at `/directory/[slug]/`
3. **GitHub topics** -- Tag repos with `mcp-server`, `model-context-protocol`, `toolblip`
4. **npm** -- Published with full metadata, keywords, and documentation links

### MCP Server Docs on toolblip.com

Each MCP server has a landing page at `/mcp/[name]/` that contains:
- What the server does and why you would use it
- Installation instructions (npm, Claude Desktop config, Cursor config)
- Full function/resource reference (auto-generated from the server)
- Code examples in TypeScript and Python
- Changelog
- Link to the npm package and GitHub repo

These pages are built from README.md files in each MCP repo using a Astro content collection.

### MCP Security Model

- **No secrets.** Toolblip MCP servers expose only public data and stateless functions. No API keys, no user accounts, no mutable state.
- **Sandboxed execution.** Functions like `eval()` and `exec()` are never exposed, even indirectly. The `tools` server is a pure mathematical transform layer.
- **Versioned.** Each MCP server is independently versioned. Users pin to a major version. Breaking changes bump the major version.
- **Audit-friendly.** Every function call is logged server-side (optional, configurable). Users who self-host can disable logging.

---

## 9. Implementation Priority

Ordered by what to do first:

1. **Create `src/data/tools.ts`** with the registry schema above. Migrate the hardcoded arrays from `src/pages/index.astro` and `src/pages/tools/index.astro` to use it.
2. **Create `/about/` and `/404/` pages.** These are launch blockers per LAUNCH_PLAN.md.
3. **Update breadcrumbs in ToolLayout** to include the category name linking to the future category page URL. Even before category pages exist, the breadcrumb text can be there (linking to `/categories/[slug]/` which will 404 temporarily, or linking to `/tools/` with the category name as text until category pages are built).
4. **At 15-20 tools: create the first 3 category pages** (`/categories/text/`, `/categories/developer/`, `/categories/image/`). Add the "Categories" dropdown to the nav. Add "Browse by Category" section to the homepage.
5. **At 25-30 tools: add client-side search** to `/tools/` and the nav bar. Build the tool manifest at build time.
6. **At 30+ tools: redesign the homepage** to show featured/popular tools instead of all tools.
