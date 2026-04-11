# Toolblip PRD

## Product Overview

**Toolblip** is a curated directory of first-party developer tools paired with an MCP server registry. It sits at the intersection of developer tooling and AI agent infrastructure.

Three pillars:
1. **First-party client-side tools** — lightweight, browser-based utilities for developers (JSON formatters, regex testers, encoders, etc.)
2. **MCP server directory** — searchable registry of Model Context Protocol servers for AI/agent builders
3. **Toolblip MCP packages** — official npm packages that expose Toolblip tools and directory data to AI agents via the MCP spec

---

## Target Users

- **Developers** searching for online developer tools (SEO-driven traffic: JSON validators, regex testers, Base64 encoders, etc.)
- **AI/agent builders** looking for MCP server integrations to power AI workflows
- **Teams evaluating developer tool stacks** — browsing categories, comparing tools, finding the right fit

---

## Product Vision

> _Be the canonical directory for developer tools — the place you land when you need a tool, and the way AI agents find and use tools._

We want Toolblip to be both a human-facing search engine for dev tools AND a machine-readable registry that AI agents can query natively via MCP.

---

## Revenue Model

- **Freemium** — core tools are free; Pro features (advanced options, higher usage limits, team features) require a paid plan
- **Affiliate revenue** — listings link out to paid tools/SaaS with affiliate codes (commission on referrals)
- **MCP packages** — official `@toolblip/mcp` and related packages (future revenue via Pro tier for agents)

---

## Competitive Landscape

| Competitor | Focus | Gap Toolblip fills |
|---|---|---|
| TinyTools.dev | Curated dev tool links | Less SEO-optimized, no MCP story |
| SmallDev.tools | Simple in-browser tools | No directory/model, limited discoverability |
| ConvertTools | Unit/data converters | General audience, not developer-specific |
| DevUtils.com | macOS dev tools | Desktop-only, no AI agent integration |
| **Toolblip** | **Web + AI-native** | **SEO-driven tool pages + MCP server registry + agent-native packages** |

**MCP directory: no equivalent curated directory exists.** Most MCP servers live in GitHub repos or Discord threads. A dedicated, searchable, SEO-optimized MCP registry fills a real gap as the MCP ecosystem grows.

---

## MVP Scope (v1)

### What we're building now
- **10 existing client-side tools** (already built in Astro, to be migrated to Next.js)
- **Directory** — searchable MCP server + tool category pages with basic listing
- **MCP packages** — `@toolblip/mcp` already scaffolded, needs polish and tool definitions

### What's deferred
- Pro features / usage limits
- User accounts and history
- Advanced search / filters
- Tool submissions (user-generated)

---

## Build Order

1. **Directory pages + search** (Next.js + Laravel API + PostgreSQL) — core SEO and discoverability
2. **MCP package polish** — define tool specs, add directory search capability, write docs
3. **First-party tool Pro features** — usage limits, advanced modes, team features
4. **User accounts + history** — auth, saved tools, usage history

---

## Success Metrics (v1)

- Directory pages indexed and ranking for target keywords
- MCP servers submitted and listed
- `@toolblip/mcp` published and usable by AI agents
- 10 tool pages migrated and live
