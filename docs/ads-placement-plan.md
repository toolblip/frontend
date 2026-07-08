# Toolblip custom ads — brainstorm, research, and build plan

**Status:** Post-MVP. Stripe live. Ads shown to **guests** and **free-tier logged-in users** only. **Starter / Pro / Max** keep **No ads** (already on pricing cards).

**Goal:** First-party **custom sponsor placements** (you sell slots; you configure creatives). Optional programmatic networks later.

---

## 1. What we already have

| Asset | Notes |
|--------|--------|
| `/advertise` | Formats: above-tool, below-tool, per-tool sponsorship; from $100/mo; labeled sponsors |
| `data/sponsors/crontinel-house-ad.json` | Example native creative (name, tagline, url, logo, CTA) — **not rendered anywhere yet** |
| Pricing copy | Paid plans: **No ads** — product promise to honor |
| Tool pages | `app/tools/[slug]/page.tsx`: breadcrumb → header → SEO blocks → `ToolUI` → FAQ |
| Auth | `useAuth()` on client; subscription tier via `/api/subscription` on dashboard — **not yet on public shell** |

**Gap:** No `AdSlot` component, no eligibility helper, no admin/API for creatives, SEO copy still says "no ads" in some generated tool text (fix when ads ship).

---

## 2. Research takeaways (developer-tool sites)

- **Native / contextual** beats loud display: card with logo, one-line value prop, CTA — matches `/advertise` and Crontinel JSON.
- **Placement:** Do not cover inputs or primary actions. Best moments: **after** the user sees the tool (below UI), **before** tool on desktop only if clearly labeled; **sidebar** on wide tool layout (300×250 / 300×600 mental model).
- **Density:** Keep sponsored units **≤ 2 per tool page** (above + below OR sidebar + below). Avoid interstitials and auto-play video.
- **Trust:** Always **"Sponsored"** label; link `rel="sponsored noopener"`; optional link to `/advertise` on house ads.
- **Category fit:** Dev tools convert well for infra, APIs, monitoring, auth, hosting — rotate house ad + sold category slots.

---

## 3. Ad **options** (what we can sell / show)

### A. Custom native card (v1 — recommended)

- JSON or DB-backed creative: `title`, `tagline`, `url`, `logo`, `cta`, `brandColor`, optional `image`.
- Renders as Toolblip-styled card (border, subtle bg), not iframe.
- **Pros:** Full control, fast, privacy-friendly, matches brand. **Cons:** Manual trafficking.

### B. Per-tool exclusive sponsorship

- One sponsor **owns** a slug (e.g. `json-formatter`) for a date range.
- Overrides global/house rotation for that tool only.
- **Pros:** High CPM story on `/advertise`. **Cons:** Needs scheduling + conflict checks.

### C. Category / route targeting

- Placements on all `Developer` tools, or only `/blog/*`, or homepage hero strip.
- **Pros:** Packages for advertisers. **Cons:** Slightly more config schema.

### D. House / filler

- Default rotation (Crontinel, Toolblip cross-sell, `/advertise` "Your ad here") when no paid slot.
- **Pros:** Never empty slots. **Cons:** Don't over-show house on paid-tier promise pages (N/A — those users see no ads).

### E. Programmatic (phase 2+, optional)

- EthicalAds, Carbon, AdSense, etc.
- **Pros:** Passive revenue. **Cons:** Less control, cookie/consent, may clash with "client-side privacy" positioning — only if you want it.

---

## 4. Recommended **placements** (priority order)

| ID | Placement | Where | Who sees | Notes |
|----|-----------|-------|----------|-------|
| P1 | **Tool search / directory** | Sponsored slot in tools index + search results | Guest + free | Default toolblip house ad (cross-sell Pro, blog, featured); natural discovery surface |
| P2 | **Below tool** | After `ToolUI`, before FAQ (subset of tools) | Guest + free | Start with 10–20 high-traffic tools, not all 1,564 |
| P3 | **Blog sidebar / mid-article** | After 2nd H2 or sidebar | Guest + free | Native card; good content cross-sell |
| P4 | **Directory / homepage strip** | Top strip or between card groups | Guest + free | Low priority — only if needed |

**Avoid on v1:** Popups, sticky footers, ads inside dashboard flows, ads on paid-tier upgrades page.

**Layout note:** Today SEO paragraphs sit **above** the tool UI. For UX, consider **Phase 1b**: move SEO below tool + FAQ (SEO still in HTML for crawlers) so P2 "above tool" is truly above the widget.

---

## 5. Eligibility rules

```
showAds = !user → true (guest)
showAds = user && subscription.tier === 'free' && status in (active, trialing|null) → true
showAds = paid tier (starter|ultra|max) OR trialing on paid? → false
```

- **Trialing paid plan:** No ads (same as "No ads" benefit).
- **Loading:** Default **no ads** until subscription known (avoid flash for Pro users).
- **API:** Extend `/api/auth/me` with `subscription_tier` + `subscription_status` OR lightweight `GET /api/ads/eligibility` (cacheable).

---

## 6. Data model (v1 — git-backed JSON)

```
data/ads/
  placements.json     # slot definitions: id, pageTypes, priority
  campaigns.json      # id, sponsor, creative ref, start/end, targets { slugs?, categories?, routes? }
  creatives/*.json    # same shape as crontinel-house-ad.json
```

**Resolver (server or edge):** For `{ route, slug, category }` → pick highest-priority active campaign → creative. Fallback → house pool.

**v2 (Laravel):** `sponsor_campaigns` table + admin UI + impression/click logging — when sales volume justifies it.

---

## 7. Implementation phases (for Claude Code via `./claude.sh`)

### Phase 1 — MVP display (3–5 days)

1. `lib/ads/resolveAd.ts` + JSON loader
2. `components/ads/SponsorCard.tsx` + `AdSlot.tsx` (`placement="tool-below" | "tool-above"`)
3. `hooks/useShowAds.ts` (auth + subscription)
4. Wire P1 + P2 on `app/tools/[slug]/page.tsx` (client wrapper for slots)
5. Move `data/sponsors/crontinel-house-ad.json` → `data/ads/creatives/crontinel.json` + default house campaign
6. Update `/advertise` with screenshot + slot IDs
7. Playwright: guest sees sponsor label; mocked Pro user does not

### Phase 2 — Targeting + blog (2–3 days)

- Per-slug and category campaigns
- P4 blog slot in MDX/layout
- P3 sidebar layout on tool pages

### Phase 3 — Ops (optional)

- Click tracking (privacy-preserving aggregate)
- Simple admin page or API on Laravel
- Programmatic slot type if you choose option E

---

## 8. Copy / legal checklist before launch

- [ ] Pricing: Free tier explicitly **includes ads** (add bullet); paid **No ads** unchanged
- [ ] Privacy policy: sponsored links + optional analytics
- [ ] Remove or reword auto-generated SEO that says "no ads" (`lib/generateToolContent.ts`)
- [ ] Footer: keep **Advertise** link

---

## 9. Decisions needed from Harun

1. **v1 placements:** P1+P2 only, or include sidebar (P3)?
2. **House ad:** Always Crontinel until sold, or rotate + "Advertise here"?
3. **Free logged-in:** Same slots as guests, or lighter (P6 only)?
4. **SEO block order:** Move long SEO below tool in same sprint or later?
5. **Trafficking:** Git JSON only for now, or start Laravel admin in v1?

---

## 10. Suggested default (if you want to ship fast)

- **Placements:** P1 below tool + P2 above tool on all tool pages
- **Eligibility:** guests + free tier; hide when subscription loading or paid
- **Creatives:** JSON in repo; Crontinel as default house ad
- **Trafficking:** Git PR to update `campaigns.json` until revenue needs a UI

**Next step:** Run Phase 1 implementation through `./claude.sh` with this doc as spec.