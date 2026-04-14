# Tiny Tools — Research

## Concept
Large collection of free browser-based tools. Reference: tinywow.com, ilovepdf.com, smallpdf.com.

## Business model
- Free tier (most tools, ad-supported)
- Paid tier (higher limits, no ads, bulk processing)
- Guest subscriptions (one-time purchase for heavy use)
- Display ads for free users (Google AdSense / direct deals)
- SEO as primary growth channel — each tool = its own landing page

## Status
Research phase — no code yet.

## Research questions
- Which tool categories have high search volume + weak competition?
- What stack supports hundreds of browser-based tools efficiently? (likely: Astro/Next.js front, WASM for heavy processing, edge functions)
- What's the minimum viable tool count to launch and rank?
- Ad revenue benchmarks for tool sites (RPM, fill rate)?
- Freemium conversion benchmarks for similar tools?
- How to structure URLs for SEO? (/tools/compress-pdf, /tools/resize-image, etc.)

## Build philosophy
- Slow build — ship 5-10 tools, get traffic, add more
- Each tool is an SEO landing page
- WASM for client-side processing (no server costs for free users)
- Progressive enhancement — works without JS for basic features

## Directories
- `research/` — competitor analysis, keyword research, tool ideas
- `ideas/` — tool concepts ranked by SEO opportunity
