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

## Family-verification pass (second commit round)

Went through the 93 shared-component families the previous section
identified, largest first, checking each slug's own `data/tools.ts`
description against what its component actually does — not just whether it
compiles. Covered roughly 20 of the 93 families in this pass (the largest
ones by slug count); the rest remain as described below. Findings:

- **9 more format-mismatched conversion tools**, same pattern as the
  original 7: `AviToMovClient` only accepts `.avi` (so `mov-to-avi`,
  `mov-to-mp3`, `mov-to-mp4`, `mp4-to-mov`, `webm-to-mov` were all
  broken — only `avi-to-mov` itself worked), `AacToWavClient` only accepts
  `.aac`/`.m4a`/`.mp4` (`mov-to-wav`, `ogg-to-wav` broken). No working
  equivalent for cross-container video/audio transcoding exists anywhere in
  the catalog (real fix needs WebCodecs/ffmpeg.wasm), so these are removed
  outright rather than redirected — see "404, not 410" below.
- **A whole family of HTTP dev-tools that don't do what they say**:
  `http-status-codes`, `http-status-code-lookup`, and `http-status-ref` all
  promise a static status-code reference table; `http-request-builder` and
  `http-method-tester` promise sending a request with a chosen
  method/body/auth. All five actually rendered `HttpHeadersViewerClient` — a
  hardcoded `HEAD` fetch with no method/body control and no reference data
  at all. Two components with names that sound like the real thing
  (`HttpStatusCodesClient`, `HttpStatusCodeLookupClient`) turned out to be
  the *same* header-fetcher under a misleading filename. Redirected the
  status-table trio to `http-status-checker` (a real, different, correctly
  implemented bulk-status-checker) and the two request-builder slugs to
  `http-headers-viewer` — the closest genuinely real destination in either
  case, not a perfect match.
- **Several genuinely broken image tools**: `image-blur-hash-generator`
  ("BlurHash placeholders") and `image-enlarger` ("AI-style upscaling") both
  rendered a plain crop tool with none of that functionality — no working
  alternative exists, removed. `image-clipper` ("remove backgrounds") and
  `image-orientation-fixer` ("rotate/flip") also rendered the crop tool, but
  real background-removal (`remove-bg`) and rotate (`rotate`) tools already
  exist elsewhere in the catalog — redirected to those instead of removing.
  `png-to-ico`, `icon-favicon-creator`, `ico-file-generator`, and
  `favicon-preview` all promise real `.ico` output or previewing an existing
  favicon; the components involved (including two correctly-named orphaned
  ones, `IconFaviconCreatorClient` and `IcoFileGeneratorClient`) just
  re-download the uploaded image unchanged with no resizing or ICO
  encoding at all. No real ICO-encoding implementation exists to redirect
  to — removed.
- **`tiff-to-text` promised OCR**, rendered a live-microphone speech
  transcriber (`AudioToTextClient`) instead. No OCR implementation exists —
  removed. `text-to-image` (promised a social-graphic generator) and
  `audio-to-text` (promised uploaded-file transcription) rendered the same
  microphone tool; redirected to `banner-generator` and `speech-to-text`
  respectively — real, correctly-scoped equivalents.
- **Five real, working components had been sitting completely unwired** —
  imported nowhere, no `case` referencing them, found only because a
  correctly-named file (`LoremIpsumDetectorClient.tsx`,
  `TextToHandwritingClient.tsx`) existed for a slug that was actually
  rendering the wrong component. `TextToHandwritingClient` (real Google-font
  cursive rendering) is now wired to `text-to-handwriting`, replacing the
  microphone tool it was shadowed by.
- **Two components were real stubs (not even mismatched, just fake) behind
  security-relevant names** — `SecureRandomGeneratorClient`,
  `RandomPinGeneratorClient`, and `RandomIdGeneratorClient` all existed as
  unwired files implementing the generic `setOutput('Processed: ' + input)`
  echo pattern, while the live slugs of the same name rendered
  `RandomFractionGeneratorClient` (a fraction generator, not random
  strings/PINs/IDs at all). Given `secure-random-generator` specifically
  claims to be "cryptographically secure," left broken or silently
  redirected felt worse than fixed, so these three were rewritten for real:
  `crypto.getRandomValues()`-backed generation with rejection sampling to
  avoid modulo bias (not `Math.random()`, and not a naive `% range`, both of
  which would undermine the tool's own security claim). Same reasoning for
  `LoremIpsumDetectorClient` (rewritten as a real word-list-density check)
  and `TimeDurationCalculatorClient` (rewritten as real add/subtract time
  arithmetic) — both were unwired generic stubs too, and both were cheap,
  honest, zero-fabrication-risk fixes, unlike OCR or ICO encoding.

**404, not 410, for the removed slugs.** `proxy.ts` was going to carry a
`GONE_TOOL_SLUGS` set returning a real 410 for the removals with no redirect
target. While testing it, a bare `console.log` at the top of the `proxy()`
function **never fired, for any request, in either `next dev` or a real
`next build && next start`** — the whole proxy/middleware layer is not
executing at all in this project as currently configured. That's a serious,
pre-existing bug independent of this work: `PROTECTED_PREFIXES` (the
`/dashboard`, `/account`, `/submit-tool` auth gate) and the `www.` /
HTTP→HTTPS redirect in the same file are equally non-functional right now.
Since fixing it means debugging the same file that carries the auth logic,
it's out of scope here per the same "don't touch CI/auth code" boundary as
the broken E2E check — flagging it, not fixing it. The `GONE_TOOL_SLUGS`
addition was reverted; `proxy.ts` is untouched from `main`. The removed
slugs get a plain 404 via `dynamicParams = false` (already in place from the
first commit round), which is still a valid "don't index this" signal to
Google, just not as fast-processing as a true 410.

## Family-verification pass, round 3 — the rest of the size-3 and size-2 families

Continued past the ~20 largest families from round 2 through the remaining
87 (down to size-2). Same method: read the description, read the component,
check for an unwired real implementation before assuming redirect/removal.

**42 slugs removed from the registry, 43 total resolved** — 1 newly
registered (`rgb-to-hex`, see below), 14 redirected to a real, different
tool elsewhere in the catalog (e.g. `image-metadata-remover` →
`exif-remover`, `text-difference-checker` → `code-diff`, `mobi-to-azw3` →
`azw3-to-mobi` — same extension-gating bug class as round 2), 28 removed
outright with no real destination to point to. Examples of the
description-vs-component mismatches this method hadn't caught yet, because
they don't fit the "X-to-Y" conversion pattern the automated heuristic
checks: `css-variable-generator` promised CSS custom properties/theming,
rendered a utility-class generator with none of that; `ip-address-info`
promised geolocation/ISP lookup, rendered a random-IP *generator* (would
need a paid geolocation API anyway — removed, matching the project's
existing precedent for tools needing infra it doesn't have); `js-beautifier`
promised formatting/indenting, rendered the minifier (literally the opposite
operation); `favicon-maker`/`favicon-png-creator` had the exact same
"promises real .ico output, just re-downloads the uploaded PNG unchanged"
bug already found and fixed for 3 sibling slugs in round 2, just missed
then.

**A live infinite redirect loop, found by testing the round's own fixes,
not by the automated checker.** Redirecting `rgb-to-hex-new` → `rgb-to-hex`
(one of this round's fixes) exposed that `rgb-to-hex` had never actually
been a registered tool — only a `TOOL_SLUG_ALIASES` entry pointing it *at*
`rgb-to-hex-new`. Two live things pointing at each other: an infinite loop
the moment both existed simultaneously. The interesting part: a real,
working `RgbToHexClient` component and a dedicated `case 'rgb-to-hex':` in
`ToolUI.tsx` existed the whole time, just with no `data/tools.ts` entry to
route to them — so the fix was to actually register the tool, not redirect
around the gap. Wrote a small script
(`resolve()` in the session transcript, not checked into the repo) that
traces every alias/redirect chain across all three mechanisms
(`TOOL_SLUG_ALIASES`, `page.tsx`'s `REDIRECTS`, `next.config.mjs`
`redirects()`) to a final live/dead/loop verdict — found and fixed 5 more
dead-end chains this way (redirects pointing at slugs this round had just
removed), none of them loops, all now either resolve live or 404 directly.
**This checker is worth keeping and running after any future slug rename or
removal** — the fragmented-redirect-tables risk flagged in round 1's
self-review is real, and this is now three separate times a chain-resolution
bug slipped past manual review and was only caught by tracing all three
tables together.

Verified with the same shadowing/coverage parser (0 conflicts, 0 missing
across 659 live slugs), the new chain-resolution trace (0 loops, 0 dead
ends across 947 alias/redirect sources), a full `next build`, and a random
25-tool sample plus every changed URL hit against `next build && next
start`.

## Self-review of round 3 — 7 findings, 7 fixed

Self-reviewed via the same process as rounds 1 and 2 (10 independent finder
passes). Every finding was real; all fixed.

- **Two redirect destinations were picked from the wrong source file.**
  `json-schema-generator` and `json-patch-generator` were redirected to
  `json-schema-validator`/`json-diff` on the strength of component names
  (`JsonSchemaGeneratorClient`, `JsonPatchGeneratorClient`) that only exist
  in an orphaned, unimported file (`src/data/toolComponents.ts`) — not the
  live routing table (`app/tools/[slug]/ToolUI.tsx`) `page.tsx` actually
  renders through. Both slugs actually render `JsonLdGeneratorClient`, a
  byte-for-byte duplicate of the already-live `/tools/json-ld-generator`
  page. Retargeted both redirects there instead. `json-schema-viewer` and
  `json-schema-editor` do render the real `JsonSchemaValidatorClient` as
  claimed, so those two keep their original target — the review confirmed
  the outcome was right there, just not the stated reasoning.
- **`text-difference-checker` → `text-diff` sent traffic to a destination
  that doesn't do what either slug's description promises.** `text-diff`'s
  own `TextDiffClient` only computes a Levenshtein similarity score/edit
  count — no line highlighting, despite `text-diff`'s own description
  promising "added, removed, and unchanged lines highlighted" (a
  pre-existing mismatch on `text-diff` itself, predating this round — not
  fixed here, flagged below). Retargeted to `/tools/code-diff` instead,
  which is a real LCS-based line-by-line added/removed/context diff and
  the actual best match for what "difference checker" promises.
- **A genuine dead-end regression from this round's own chain-resolution
  audit**, caused by a real gap in that audit script: it traced
  `TOOL_SLUG_ALIASES` and `page.tsx` `REDIRECTS` chains but never checked
  whether an alias's *target* was itself a `next.config.mjs` redirect
  source. `sitemap-xml-validator-express` → `sitemap-xml-validator` was a
  working 2-hop chain before this round (the second hop being a
  `next.config.mjs` redirect to `xml-validator`) and got false-flagged as
  dead and deleted. Restored, repointed straight at `xml-validator` (1 hop,
  matching the pattern used for `xml-sitemap-validator` elsewhere in this
  same round). Checked all 4 other slugs this round's audit called dead
  ends against the same blind spot — the other 3 (`ip-address-info-v2`,
  `keyword-difficulty-tool`, `yaml-to-toml-v2`) were genuinely dead, no
  further false positives.
- **This round's own new redirects lengthened 3 pre-existing alias chains
  from 1 hop to 2** (and one page.tsx pair from 2 hops to 3):
  `favicon-checker-express`/`favicon-checker-tool` (and, one level up,
  `check-favicon`/`favicon-test`) pointed at `favicon-checker`, which this
  round redirected onward to `favicon-grabber`; `json-schema-gen-express`
  pointed at `json-schema-generator`; `text-diff-checker` pointed at
  `text-difference-checker`. Repointed all of them straight at the final
  live destination. Checked every alias/redirect pointing at a slug this
  round retargeted or removed for the same pattern — 9 pre-existing 2-hop
  chains remain (`curl-generator`, `html-to-plain-text-v2`,
  `keyword-generator-v2`, `lorem-ipsum-api-tool`,
  `shell-command-gen-express`, `temperature-converter`, `tsv-to-json`,
  `tsv-to-json-v2`, `word-frequency-analyzer`), none introduced by this
  round, none dead — left alone as pre-existing, out-of-scope items.
- **A live ad campaign (`rankwell-seo-tools`, active since 2026-07-08,
  `data/ads/campaigns.json`) still targeted `sitemap-xml-validator`** in
  its `slugs` array. That page has permanently redirected away since this
  slug was pulled from the registry (round 2), so the campaign's targeting
  entry has silently never matched since — no crash, just lost ad
  placement. Repointed the entry to `xml-validator`, the tool that slug now
  redirects to.

Re-ran the full verification suite after these fixes: shadowing/coverage
parser (0 conflicts, 0 missing across 659 live slugs), chain-resolution
trace (0 loops, 0 dead ends across 947 sources, all single-hop except the 9
pre-existing chains above), `tsc --noEmit`, full `next build`, and live
testing of every URL this round touched plus a random 15-tool sample.

## Confirmed but NOT fixed in this pass — real follow-up work

*Numbers below are from the first commit round; three family-verification
rounds since then (this doc's two sections above) have worked through every
family down to size 2. Re-running the same fingerprinting script after all
three rounds: 659 live tools, 54 families still sharing a component across
150 slugs, largest at size 7 — down from 93 families / 268 slugs after
round 1. What's left is the long tail: no more size-8+ families, mostly
3-7 slug groups where the automated "X-to-Y conversion" heuristic doesn't
apply and each slug needs a manual description-vs-component read. Apply the
same method (read the component, compare against each slug's own
`data/tools.ts` description, check for an unwired real component under a
matching filename before assuming a redirect/removal is needed) for round 4.
Also worth doing in round 4: fix `text-diff`'s own description-vs-component
mismatch (promises line-highlighting, `TextDiffClient` only computes a
similarity score — flagged during round 3's self-review, not fixed there
since it predates that round); and commit the ad-hoc chain-resolution
script used informally in rounds 2 and 3 as a real, checked-in script
(`scripts/check-redirect-chains.js` or similar) — it has caught a real bug
each of the three times it's been run, and being rewritten from scratch
each round is exactly the kind of gap that let round 3's own version
false-flag a live redirect as dead.*

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

## Self-review of the family-verification pass — 15 findings, 13 fixed

Same discipline as the first round: full self-review before merging, not
just a compile check. Findings and disposition:

**Fixed — real correctness bugs:**
- `SecureRandomGeneratorClient`'s number mode had no `min <= max` validation
  and no bound on the range size: a reversed range, an empty field, or a
  range over 2^32 could silently print `NaN` as "cryptographically secure"
  output, produce a value outside the requested range, or hang the tab in
  an infinite rejection-sampling loop. Fixed with explicit validation and a
  visible error message instead of a silent bad result.
- `randomString()` in the same file used a plain `% length` instead of
  rejection sampling — a small but real bias, and ironic given the
  neighboring `randomNumber()` had a comment explaining why that would be
  wrong. `crypto.randomUUID()` was called with no feature check, so an
  insecure context or old browser would throw uncaught mid-loop.
- `TimeDurationCalculatorClient`'s "hours" field accepted 0-999 for *all*
  three inputs, but the "time between" mode's wraparound logic
  (`if (delta < 0) delta += 86400`) only makes sense for genuine clock
  times under 24 hours — a start/end pair like `100:00:00` produced a
  negative "elapsed time." Split into `parseClockTime` (0-23h, for
  start/end) and `parseDuration` (0-999h, for the "add a duration" field,
  where large values are legitimate).
- `LoremIpsumDetectorClient`'s word-list-density approach false-positived on
  ordinary English sentences with a few short function words in common
  ("in", "at", "id", "do") and false-negatived on short genuine lorem ipsum
  snippets under 5 words. Rewrote as bigram matching against the actual
  canonical lorem ipsum text (`"lorem ipsum"`, `"dolor sit"`, etc.) — those
  adjacent-word pairs don't occur in real prose by chance, and even a
  2-3-word lorem ipsum snippet contains one.
- A pre-existing redirect (`favicon-preview-tool` → `favicon-preview`) now
  dead-ended into a 404, since this pass removed `favicon-preview` too.
  Removed the redirect so it 404s directly instead of redirect-chaining
  into another 404.
- A code comment in `next.config.mjs` claimed the removed video/audio slugs
  "are 410 via proxy.ts" — true when written, false after the `proxy.ts`
  attempt was reverted (see below). Corrected.
- Consolidated the three independent hand-rolled `crypto.getRandomValues()`
  implementations (in `SecureRandomGeneratorClient`, `RandomPinGeneratorClient`,
  `RandomIdGeneratorClient`) into `lib/secureRandom.ts` — the security bug
  above was only in one of the three copies despite all three doing the same
  thing, exactly the drift risk of writing security-sensitive logic three
  times. Also fixed: `RandomIdGeneratorClient`'s prefix field had no length
  bound, so pasting a huge string there produced an "ID" thousands of
  characters long despite the length field being capped at 64.
- Both hardcoded-hex-color findings (`LoremIpsumDetectorClient`'s result
  banner) switched to the existing `--red`/`--red-tint`/`--green`/`--green-tint`/`--fg-1`
  design tokens already used elsewhere in the codebase (verified against
  `app/globals.css`, which has dark-mode overrides for all of them) instead
  of literal hex values with no dark-mode variant.

**An important correction to my own prior conclusion.** The first round's
self-review (see below) said the dead proxy/middleware layer was "a
serious, pre-existing bug" without a known cause. This round's review
flagged that `proxy.ts` might be the wrong filename for this Next.js
version and should be `middleware.ts`. **That specific claim is wrong** —
Next.js 16's own migration guide explicitly states `middleware.ts` was
renamed to `proxy.ts`, and a build against this project prints *"The
'middleware' file convention is deprecated. Please use 'proxy' instead"* if
you use the old name. However, the underlying empirical claim (verified via
`.next/server/middleware-manifest.json`) is correct and worth acting on:
**building with `proxy.ts` present compiles `"middleware": {}` (empty) in
the manifest, while renaming the exact same file/function to the deprecated
`middleware.ts` compiles a real, working entry (`"middleware": ["/"]`)** —
tested locally, not shipped. This looks like a genuine bug in this specific
Next.js 16.2.4 Turbopack build (the new convention silently not registering
routes), not a mistake in how `proxy.ts` was written here. Concretely, this
means the auth gate on `/dashboard`, `/account`, `/submit-tool` and the
`www.`/HTTPS redirect are bypassable in production **right now**, and the
one-line-per-file fix (rename + rename the exported function) has been
verified to work, at the cost of a deprecation warning until Next.js fixes
the underlying `proxy.ts` registration bug. This is a security-relevant
finding outside this PR's scope (SEO/indexing) and outside the "don't touch
auth code" boundary this work has operated under — raised to the user
directly rather than acted on unilaterally.

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
