# Frontend Stack Research for Toolblip

**Date:** 2026-04-11
**Status:** Research Complete

---

## Current State

Toolblip already has an Astro project set up and running on Cloudflare Pages:

- **Astro v6** with `@astrojs/cloudflare` adapter
- **`output: 'static'`** — purely static site deployed to CF Pages
- **Tailwind CSS v4** via `@tailwindcss/vite`
- **Cloudflare Pages Functions** (`functions/_middleware.ts`) proxying `/api/*` and `/sanctum/*` to the Laravel backend at `api.toolblip.com`
- Tool pages (JSON Formatter, Base64, etc.) are Astro pages with vanilla JS for interactivity
- ~162 lines per tool page (Astro + vanilla JS inline scripts)

---

## Option 1: Inertia.js (SPA or SSR)

### Does Inertia.js support SSR with Laravel?

**Yes.** Inertia.js v3 supports SSR through the `@inertiajs/vite` plugin. Laravel's Breeze and Jetstream starter kits include Inertia SSR support via `npm run build:ssr`. The setup uses Node.js 22+ as the rendering server.

### Setup Complexity

**High for a production deployment to Cloudflare Pages.** Here is why:

1. Inertia SSR requires a **Node.js server** running alongside the PHP/Laravel app. It renders JavaScript pages on the server and sends pre-rendered HTML to the browser.
2. For Cloudflare Pages, you cannot run a persistent Node.js server. CF Pages runs functions serverlessly (stateless, ephemeral requests).
3. To use Inertia SSR on CF Pages you would need either:
   - A separate Node.js host for the SSR renderer (additional infrastructure, cost, complexity)
   - Or use `@inertiajs/ SSR` in a CF Worker (possible but fragile and poorly documented)

### SEO Implications (Inertia SPA mode)

If you run Inertia as a pure SPA (no SSR), here are the SEO problems:

- Search engines receive an **empty shell** (`<div id="app"></div>`) on first load
- You must add **@inertiajs/ssr** (Node.js) or use a service like **Laravel Forge + Vapor** to pre-render pages
- For a tool site like Toolblip, this is a real problem for:
  - Landing page (`/`) — high SEO importance for organic traffic
  - Tool index pages (`/tools`) — category listings
  - Individual tool pages (`/tools/json-formatter`) — these rank for long-tail keywords like "JSON formatter online"
- Workaround: use Inertia's `<title>` and `<meta>` head tags, but crawlers still need JavaScript execution to see content
- Verdict: **bad for SEO without SSR**, and SSR adds significant complexity

---

## Option 2: Next.js on Cloudflare Pages

### @cloudflare/next-on-pages (the old way)

`@cloudflare/next-on-pages` only supports the **Edge runtime**, which intentionally limits Node.js APIs. This means:

- No full Node.js runtime support
- Many Next.js SSR features break or require workarounds
- ISR (Incremental Static Regeneration) is limited
- **Not recommended** for SSR-heavy Next.js apps in 2026

### OpenNext + Cloudflare Workers (the current recommended way)

The Cloudflare team now officially recommends `@opennextjs/cloudflare` for Next.js on Cloudflare infrastructure. Key facts:

- Deploys Next.js to **Cloudflare Workers** (not Pages)
- Supports **App Router, SSR, ISR, Server Actions, Route Handlers**
- Supports Next.js **Node.js runtime** (not just Edge)
- Feature support table (from `opennext.js.org/cloudflare`):

| Feature              | Status |
|----------------------|--------|
| App Router           | Supported |
| SSR                  | Supported |
| ISR                  | Supported |
| Server Actions       | Supported |
| Response Streaming   | Supported |
| Middleware           | Supported |
| Image Optimization   | Via Cloudflare Images |
| Partial Prerendering | Supported |
| Node.js Middleware (15.2+) | Not yet supported |

### Next.js Version Support

- Supports **Next.js 16** (all minors)
- Supports **Next.js 15** (latest minors)
- **Next.js 14 drops Q1 2026** (no longer supported by Next.js team)
- If you start a new Next.js project today, use **Next.js 15 or 16**

### Key Problem for Toolblip

**Next.js means decoupling from Laravel's PHP backend.** If you use Next.js for the frontend, you cannot run it on the same server as Laravel/PHP. You have two choices:

1. **Keep Laravel as a separate API** (`api.toolblip.com`) — Next.js calls it via HTTP. This works but means maintaining two separate codebases, two deployments, two pipelines.
2. **Migrate everything to Next.js** — Drop PHP entirely. Rewrite Laravel auth, DB, and Stripe logic in Next.js API routes. Massive effort and risk.

For a team that knows Laravel PHP and some React, the migration cost is substantial.

---

## Option 3: Astro + React Islands (Already In Place)

This is the **hybrid approach** and the one Toolblip is already using.

### How it works

- **Marketing pages** (landing, about, pricing, tool index) are **statically generated** at build time by Astro. Excellent SEO, fast TTFB from Cloudflare's edge CDN.
- **Interactive tool components** (JSON formatter, Base64 encoder) are **React (or vanilla JS) components with `client:` directives**. They hydrate in the browser.
- **Auth/Stripe** calls go through the Laravel API via the CF Pages Function proxy already in place.

### Astro's React Islands Architecture

```
Marketing pages (static, SSR at build time)
  - Landing page: static HTML
  - Tool index: static HTML with links
  - Tool pages: static HTML shell + React island for interactivity

React islands:
  - JSONFormatter island (client:load)
  - Base64Encoder island (client:load)
  - Each tool is its own island
```

### What you get with Astro

| Requirement | How Astro Handles It |
|---|---|
| SSR for SEO | Static generation (SSG) for all pages. Marketing pages are fully server-rendered HTML. Tool pages have rich content (descriptions, FAQs, usage examples) in static HTML. |
| Client-side tools | React/Vue/Svelte/vanilla JS islands with `client:load` or `client:visible` directives |
| Fast new tool creation | Copy an existing tool Astro page + React island. ~160 lines per tool. |
| Cloudflare Pages | `@astrojs/cloudflare` adapter. Zero config. Already working. |
| Laravel backend | CF Pages Function proxy (`functions/_middleware.ts`). Already working. |
| Team skill set | Astro's `.astro` files are HTML-first with frontmatter. React islands use standard React. Both align with Laravel + some React knowledge. |

### Performance Benefits

- **Marketing pages:** Served as static HTML from 300+ CF edge locations. Near-zero TTFB.
- **Tool pages:** Static shell + lazy-hydrated React islands. The HTML arrives fast; JS hydrates on interaction.
- **No Node.js server needed.** Entire site runs on CF Pages.

### SEO for Tool Pages

Tool pages at `/tools/json-formatter` rank well because:
- Full static HTML with page title, meta description, FAQ schema (`application/ld+json`)
- Content is server-rendered at build time (not in JS)
- Google indexes the content without needing JavaScript execution
- Compare: Inertia SPA would require SSR to get this same SEO quality

---

## Comparative Analysis

| Criteria | Inertia SPA | Inertia SSR | Next.js (OpenNext/CF Workers) | Astro + Islands (current) |
|---|---|---|---|---|
| SEO quality | Poor | Good | Excellent | Excellent |
| SSR complexity | None (SPA) | High (Node server) | Medium (OpenNext adapter) | None (SSG is built-in) |
| Deploys to CF Pages | Yes (static assets) | No (needs Node server) | No (CF Workers, not Pages) | Yes (native adapter) |
| Laravel integration | Native (same app) | Native (same app) | HTTP API only | HTTP API via proxy |
| New tool speed | Fast (Laravel views) | Fast | Fast (React pages) | Fast (copy-paste Astro page) |
| Team learning curve | Low (Laravel + React) | High (Node SSR) | Medium (Next.js 15) | Low (Astro + React islands) |
| Scalability | Good | Good | Excellent (edge) | Good (static is very scalable) |
| npm package compatibility | Good | Good | Some edge runtime issues | Good (Node.js build, not edge) |

---

## How Other Tool Sites Are Built

Based on public data:

- **keystatic.com** — Astro with first-class CMS. They chose Astro because of the static + islands architecture and Node.js build compatibility.
- **Precedent.dev** — Next.js (but not on CF Pages)
- **Public APIs list sites** — Mostly static Gatsby/Next.js/Hugo
- Most small tool sites use **static + vanilla JS** or **static + React islands** — exactly what Toolblip already has

The pattern for successful tool aggregator sites:
1. Static marketing pages for SEO
2. Client-side interactive tools
3. Backend API for auth/billing
4. Deployed to a CDN (Vercel, Netlify, or CF Pages)

---

## Recommendation

### Winner: **Astro with React Islands (keep the current setup)**

Toolblip already has the best architecture for this use case. The existing Astro + Cloudflare Pages setup is sound. Here is why it wins:

1. **SEO is already solved.** Static HTML for all pages, including tool pages with FAQ schema. No SSR complexity needed.
2. **Cloudflare Pages is the right host.** Static output is served from 300+ edge locations. The CF Pages Function proxy handles Laravel API communication.
3. **Fast to build new tools.** Copy `src/pages/tools/json-formatter/` to a new directory, replace the vanilla JS logic. ~160 lines per tool.
4. **Laravel stays as the backend.** No migration needed. Auth, DB, and Stripe stay in PHP.
5. **Team skill alignment.** Astro's syntax is approachable for PHP developers. React islands use existing React knowledge.

### What to Improve in the Current Setup

1. **Add React islands properly.** Currently tools use inline vanilla JS. Extract each tool into a proper `React` component with `client:load` directive. This makes complex tools easier to maintain.
2. **Tool template system.** Create a `src/templates/ToolPage.astro` template that standardizes layout, SEO markup, FAQ schema, and the tool island mounting. New tools then only need the React component + frontmatter.
3. **Consider `output: 'server'` with `@astrojs/cloudflare`** only if you hit a case where truly dynamic SSR is needed (e.g., per-user tool recommendations from DB). For now, `static` is sufficient.
4. **Upgrade Astro to v7+** if available for longer-term support.

### When to Choose Next.js Instead

Only consider Next.js (via OpenNext + CF Workers) if:
- You want to move auth and billing logic from Laravel into the Next.js app (full-stack Next.js)
- You are willing to maintain a separate Laravel API-only service
- You need advanced Next.js features like full ISR with on-demand revalidation
- The team is comfortable with Next.js 15 App Router patterns

The Laravel backend is not a reason to choose Inertia. You already have a working API proxy. The backend being PHP/Laravel does not force any particular frontend framework choice.

---

## Action Items

1. [ ] Extract existing tool vanilla JS into proper React components (`src/components/tools/`)
2. [ ] Create a `src/layouts/ToolLayout.astro` with standardized SEO, schema, and island mounting
3. [ ] Document the tool creation workflow in CONTRIBUTING.md
4. [ ] If a future tool needs real server data (not just client-side), evaluate `output: 'server'` with `@astrojs/cloudflare`
5. [ ] Revisit Next.js if the Laravel backend gets deprecated or full-stack consolidation becomes a priority
