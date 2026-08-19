# GSC index-recovery — status and follow-up

toolblip.com: 44 pages indexed, 1,710 not, per Search Console's Page Indexing
report (checked 2026-08-19). No manual action — this is Google crawling the
site, reading it, and choosing not to index it (`Crawled - currently not
indexed`, 1,512 of the 1,710). Full diagnosis, evidence, and phased plan:
`reports/you-need-to-go-purrfect-castle.md` in the `toolblip/workspace` repo.
The short version: hundreds of near-identical templated tool pages, a chunk
of them non-functional or mislabeled, told Google this site publishes
low-value doorway pages at scale.

This file tracks what's been fixed in this repo and what's still open, so
the next pass (mine or someone else's) doesn't have to re-derive it.

## What this pass fixed

- **Absorbed two long-stuck PRs** (`fix/sitemap-lastmod` #134, open since
  8/12; `fix/broken-tool-pages` #135, open since 8/12, grew to 7 commits /
  286 files fixing or removing ~140 broken tool pages) — both were blocked
  by a pre-existing, unrelated CI failure (see "CI is red" below), not by
  their own content. Merged into `fix/seo-index-recovery`.
- **Split `app/sitemap.ts` into three sitemaps** — `sitemap-core.xml`,
  `sitemap-tools.xml`, `sitemap-blog.xml` (route handlers, see
  `lib/sitemap-xml.ts`) — declared separately in `app/robots.ts`. Search
  Console reports indexed/discovered per sitemap, so this is how to tell
  whether the tool corpus or the blog is recovering.
- **Removed `/tools` and `/frontend-health` from the sitemap.** `/tools`
  only ever redirects to `/directory`; `/frontend-health` is a status page,
  not something a searcher is looking for (now also `noindex`).
- **Added `/all-tools` to the sitemap.** It was never in one — despite
  being linked from the homepage and every tool page. It's a distinct,
  correctly self-canonicalized page (static full index), not a duplicate of
  `/directory` (filterable browse); no consolidation needed there.
- **`noindex, follow`** added to `/login`, `/signup`, `/submit-tool`,
  `/frontend-health` — account-funnel/status pages with no content for a
  searcher to land on. (`/dashboard` already had this; `/account` is a pure
  redirect to `/dashboard` and was never indexable.)
- **`dynamicParams = false`** on `app/tools/[slug]/page.tsx` — any slug not
  in the tool catalog or an alias map now 404s immediately. (Had to also
  fold this file's local `REDIRECTS` map into `generateStaticParams`, or 62
  of its 88 legacy-alias slugs — `base64`, `sass`, `keywords-generator`,
  etc. — would have started 404ing instead of redirecting.)
- **FAQPage JSON-LD now only emits for tools with a real per-tool FAQ.**
  `lib/faq.ts` already has a good `OVERRIDES` map — 368/801 tools (now
  368/726) have hand-written, genuinely differentiated FAQs, built up over
  47 incremental commits. The other ~358 fall back to `templateFaqs()`,
  built from 11 category templates; measured at ~75% identical answer text
  across unrelated tools once the tool name is substituted back in. Both
  still render on the page (still useful to a reader), but `FaqSection` now
  only declares `FAQPage` structured data when `hasFaqOverride(slug)` is
  true. **Do not delete `lib/faq.ts` or the override campaign** — it's good
  work, in progress, and should keep going; this only stops the templated
  half from being declared to Google as unique content it isn't.
- **21 keyword-stuffed slugs renamed** to their clean form (`*-express`,
  `*-tool`, `*-new` suffixes dropped: `photo-resize-tool` → `photo-resize`,
  `keyword-generator-express` → `keyword-generator`, etc.), each with a 308
  in `next.config.mjs` from the old URL. Zero functional risk — same
  component, only the slug and canonical URL changed.
- **3 verified byte-identical duplicates removed** (same component
  literally rendered under two slugs): `sql-to-json-v2`,
  `regex-pattern-generator-v2`, `text-statistics-advanced` → 308 to their
  canonical sibling.
- **7 confirmed functionally-broken tool pages removed**, each verified by
  reading the component source, not just the slug name: the rendered UI
  only accepts a file type that doesn't match what the URL promises.
  `vsd-to-jpg` / `vsdx-to-jpg` served an EPS uploader (Visio ≠ EPS);
  `vsd-to-pdf` / `vsdx-to-pdf` served an `.xlsx`-only parser;  `mp4-to-avi`
  served a video→GIF tool; `webp-to-gif` served a `video/*`-only dropzone
  on a static image; `json-to-tsv` had no real delimiter option and just
  produced CSV. Redirected to the nearest genuine equivalent rather than to
  `/tools` or `/directory` generically (see "existing soft-404 pattern"
  below for why that distinction matters).
- **Removed `PLAN-batch2.md`** — it proposed adding 29 more tools, several
  explicitly labeled as fake/stub in their own spec ("demo hash string,
  label demo only, not cryptographically secure"; codec wrappers labeled
  "not supported in browser"). That is the exact pattern that produced the
  May 2026 indexing collapse. Building it would work directly against this
  recovery; don't.

## Self-review found real regressions — fixed, not just style nits

A full self-review of the first commit here caught 6 bugs the rename/cleanup
work introduced and 9 pre-existing bugs in code absorbed from the merged
`fix/broken-tool-pages` branch. Both categories are worth understanding
before touching `data/tools.ts` slugs or `ToolUI.tsx`'s switch again.

**What the renames broke (fixed in a follow-up commit):** `data/tools.ts`'s
`TOOL_SLUG_ALIASES` map and `page.tsx`'s separate local `REDIRECTS` map both
predate this pass, and several of them used a slug this pass renamed *onto*
as their alias *source* — e.g. `TOOL_SLUG_ALIASES['keyword-generator'] =
'keyword-generator-express'` already existed (written back when the
"-express" slug was canonical), and this pass's `next.config.mjs` redirect
sends `keyword-generator-express` back to `keyword-generator` — an infinite
loop. 7 renamed slugs hit this exact loop; 2 more (`html-to-plain-text`,
`lorem-ipsum`) hit a non-looping version that silently hijacked the newly-
renamed tool to a *different*, unrelated one. Separately, `ToolUI.tsx`'s
switch is first-match-wins, and this pass's "insert a case for the new slug
right after the old one" approach sometimes landed a case that either
shadowed, or was shadowed by, an already-existing dead case for that same
slug — 4 instances (`color-format-converter`, `keyword-generator`,
`json-path-evaluator`, `html-to-plain-text`) required actually comparing the
two candidate components against the tool's own `description` to pick the
right one, not just picking whichever compiled. And `data/tool-content.ts`
still had all 21 renamed tools' content keyed under their old slug -
`getToolContent()` does an exact match, so the rename silently dropped their
description/examples for the reader.

**What was already broken in the absorbed branch (not this pass's
regression, but shipped by merging it in) — flagged, not fixed:** the same
first-match-wins switch issue predates this pass in ~15+ more cases spanning
favicon-\*, css-animation/cursor-generator, and several cron-\* slugs, where
an early catch-all group added before this repo's more recent "70 fake stub
tool components -> real implementations" work shadows the dedicated
component that work added — meaning several of those newer, purpose-built
components were dead code the moment they were written. This pass fixed the
subset that also collided with something *this* pass touched; the rest is
still there. On top of that, the review surfaced 9 real, unrelated bugs in
individual tool components pulled in from that same branch: an LDAP filter
generator with no RFC 4515 escaping (filter-injection), a word cloud
generator whose canvas font never resolves (`var(--f-sans)` isn't valid
Canvas 2D syntax, so every word renders at the default size), a color-
blindness simulator that's blank on first upload (canvas refs not yet
mounted when it tries to draw), an SSH key generator that claims Ed25519
keys work with plain OpenSSH file loading (they need the OPENSSH container
format), and five more listed in the PR's review history. None of these are
SEO-related and none were touched in this pass — full audit of the ~140
components absorbed from that branch is real follow-up work, not a quick
fix.

## Confirmed but NOT fixed in this pass — real follow-up work

**93 tool-name families share one component across 268 live slugs**
(discovered via `case 'slug': return <Component/>` mapping in
`app/tools/[slug]/ToolUI.tsx`, cross-checked against `data/tools.ts`).
465 of the 733 pre-cleanup slugs use a component nobody else uses — those
are fine. Of the 268 in a shared family, this pass resolved 15 (the 7
removed + 3 consolidated + the family members they were grouped with).
**253 remain unresolved:**

- **3 more likely-broken** (same format-mismatch heuristic: component's
  source only handles an extension/format that doesn't match the slug's
  "X-to-Y" name) — need the same manual read I did for the 7 above before
  acting.
- **~218 "non-conversion" family members** — slugs that don't fit the
  simple "X-to-Y" pattern the heuristic checks (e.g. `lorem-ipsum-words` /
  `lorem-ipsum-paragraphs` sharing `LoremIpsumGeneratorClient`,
  `http-status-codes` / `http-headers-viewer` sharing
  `HttpHeadersViewerClient`). These could be legitimate keyword variants of
  one broader tool, or doorway pages — the heuristic can't tell without
  reading each family. This is the largest remaining chunk of work.
- **~32 "generic/format-matches"** — likely fine (component isn't hardcoded
  to a narrow format, or the format does match the slug), but only spot-
  checked, not individually verified the way the 10 fixed ones were.

**8 slug collisions need a human quality call, not a mechanical merge** —
each side renders a genuinely different component, so picking a "canonical"
means judging which implementation is better, not just which slug is
cleaner:

- `grammar-checker` vs `grammar-checker-v2` vs `grammar-checker-pro`
- `color-picker` vs `color-picker-v2`
- `cron-generator` vs `cron-generator-dg`
- `hsl-to-rgb` vs `hsl-to-rgb-new`
- `lorem-ipsum-generator` vs `lorem-ipsum-generator-pro`
- `rgb-to-hex-express` vs `rgb-to-hex-new` — note both render a component
  named `HexToRgb*Client`, i.e. this pair may itself be mislabeled (a
  `hex-to-rgb` implementation serving a `rgb-to-hex` URL); check before
  picking either as canonical.
- `hex-to-rgb-express` vs `hex-to-rgb-new` — same note.

**Existing soft-404 pattern in `next.config.mjs`:** 58 of the 68
pre-existing redirect entries (from PR #135) point removed tool URLs at the
generic `/tools` or `/directory` hub rather than a genuinely equivalent
page — e.g. `whois-lookup → /tools`, `compress-mkv → /tools`. Google
treats a mass-irrelevant redirect target as a soft-404, which is exactly
the "don't 301 the junk tier to the homepage" trap the recovery plan warns
about. Worth auditing and repointing to real equivalents where one exists,
410 where none does. Did not touch these in this pass — didn't want to
re-litigate 58 individually-reasoned decisions from the prior PR without
the same care I gave the 7 I did fix.

**Tool-page content quality**, unchanged in this pass:
`data/tool-content.ts` (790KB) has 791 entries; 784 share a byte-identical
`features: ["Clean interface", "Fast processing", "No signup required",
"Works offline"]` array and an empty `examples: []`. This is real,
unaddressed thin/templated content on most tool pages — the FAQ fix above
only handles the structured-data half of the problem. **Don't mass-generate
replacement copy in one pass** (that's how the current problem was made);
the FAQ `OVERRIDES` campaign's incremental, one-batch-of-commits-at-a-time
approach with real per-tool specificity is the right model to extend to
`tool-content.ts`.

**No pruning to a "tier A" indexable subset yet.** The recovery plan's core
recommendation — cut the sitemap to a verified, working, well-described
~150-tool core and `noindex` the rest rather than trying to fix all ~726 at
once — has not been done. `sitemap-tools.xml` still lists the full catalog.
That's the highest-leverage remaining step; it's gated on actually running
a Playwright smoke test per tool (real input → correct output), not just
static analysis, which is real effort, not a mechanical follow-up.

## CI is red — not this pass's problem, flagging for whoever owns it

The `E2E Auth Regression` GitHub Action has been failing on `main` itself
(not just PR branches) for at least a week — 8 of its 14 failures are
Google OAuth / login / signup / logout / session specs, unrelated to any
SEO or content change. This blocked PRs #134 and #135 from ever merging
despite being correct, reviewed-looking, low-risk changes. It'll block this
work too. Per this repo's split of responsibilities (content/code vs.
infra/ops), diagnosing and fixing that gate is out of scope here — flagging
it because it's the actual reason none of this reaches production without
an admin merge override.
