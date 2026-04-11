# Toolblip MVP Task List

## Phase 1: Foundation

- [x] ~~Create Next.js repo from scratch (migrate from Astro)~~ ✅
- [x] ~~Set up project structure (src/app/, src/components/, src/lib/)~~ ✅
- [x] ~~Configure env vars (NEXT_PUBLIC_API_URL, NEXT_PUBLIC_APP_URL)~~ ✅
- [ ] Deploy to Vercel (verify build works) — code ready, requires Vercel auth
- [ ] Connect custom domain (toolblip.com) via Vercel
- [ ] Set up Cloudflare CDN/DNS (verify SSL, proxy to Vercel)
- [ ] Verify Vercel → Railway API calls work (CORS)

## Phase 2: Backend MVP

- [ ] Create Laravel API repo (toolblip-api)
- [ ] Set up Laravel on Railway (Docker)
- [ ] Configure PostgreSQL + Redis on Railway
- [ ] Set up .env on Railway (CORS, APP_URL, DB)
- [ ] Deploy Laravel to Railway
- [ ] Connect api.toolblip.com CNAME to Railway
- [ ] Verify SSL on api.toolblip.com

## Phase 3: Directory (Core Feature)

- [ ] Create tools DB table + migration
- [ ] Create mcp_servers DB table + migration
- [ ] Build GET /api/tools endpoint
- [ ] Build GET /api/mcp/servers endpoint
- [x] ~~Build directory page in Next.js~~ ✅
- [ ] Add search functionality (frontend + backend)
- [x] ~~Add tool detail pages~~ ✅ (static pages generated, interactive components pending)
- [ ] Deploy and verify

## Phase 4: Auth (for Pro features)

- [ ] Create users table + migration
- [ ] Build /api/auth/register endpoint
- [ ] Build /api/auth/login endpoint
- [ ] Set up Sanctum tokens
- [ ] Create login/register pages in Next.js
- [ ] Add protected routes

## Phase 5: MCP Package

- [ ] Publish @toolblip/mcp to npm (check if already done)
- [ ] Add tool definitions to MCP package
- [ ] Add directory search to MCP package
- [ ] Write README + integration docs

## Phase 6: Polish + Launch

- [ ] Add SEO meta tags to all pages
- [ ] Add sitemap.xml + robots.txt
- [ ] Add GA4 or Plausible analytics
- [ ] Add OG tags + social previews
- [ ] Test on mobile
- [ ] Performance audit (Lighthouse)
- [ ] Submit to directories (TinyTools, etc.)
