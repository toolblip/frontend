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

## Family-verification pass, round 4 — the remaining 54 families down to size 2

Worked through every family left after round 3 (all size ≤7). Used three
parallel analysis passes (one per ~18 families) to read each component
against every slug's own description before deciding redirect/remove/keep,
since the earlier heuristic (does the slug fit an "X-to-Y" conversion
pattern) stops finding anything at this tail — every remaining mismatch
needed an actual read of the component logic.

**34 slugs removed from the registry: 11 redirected to a real different
tool, 23 removed outright with no real destination.** Two new tools
registered. 627 live tools remain (down from 659), 41 families still share
a component across 113 slugs (down from 54/150), largest now size 7.

Redirects:
- `percentage-off-calculator` → `discount-calculator` — a pure
  duplicate-routing bug, not a missing feature: `PercentageCalculatorClient`
  has no discount mode, but a separate, real, already-correct
  `DiscountCalculatorClient` existed under its own slug the whole time.
- `volume-unit-converter`, `speed-converter`, `unit-measurement-converter` →
  `all-in-one-unit-converter` — `UnitConverterClient` only implements
  length/weight/temperature; the promised volume/speed categories don't
  exist in it at all, but do in the separate all-in-one tool.
- `text-diff`, `json-diff` → `code-diff` — closes out the mismatch round
  3's own self-review flagged as follow-up work: `TextDiffClient` only
  computes a Levenshtein similarity score, no line highlighting and no
  JSON-structural comparison despite both slugs promising exactly that.
- `image-metadata-viewer`, `metadata` → `exif-remover` — the metadata
  viewer only reads basic File API properties (name/size/type/dimensions),
  zero EXIF/IPTC/XMP parsing despite both descriptions promising it;
  `exif-remover` has a real hand-rolled JPEG/TIFF EXIF tag parser that
  displays the real tags before stripping them.
- `syllable-word-counter` → `readability-score-calculator` — promises
  "estimate reading level," `SyllableCounterClient` only counts syllables
  per word, no grade-level formula at all.
- `random-paragraph-generator` → `lorem-ipsum-paragraphs` — promises
  "lorem ipsum text," `RandomParagraphGeneratorClient` generates templated
  tech-jargon mad-libs sentences with zero actual Latin lorem ipsum.
- `seo-tag-analyzer` → `meta-tag-generator` — promises "analyze and
  generate... with preview," `SeoMetaTagAnalyzerClient` only fetches a URL
  and scores its existing tags, no generation UI at all.

Removed outright (no real alternative found anywhere in the catalog,
including a check for orphaned unwired components under a matching
filename — all confirmed stubs): `json-to-go-struct`, `srt-to-json`,
`json-to-url-encoded`, `json-to-php-array` (CsvToJsonClient family — the
shared component only ever does CSV→JSON regardless of slug, and every
orphaned candidate, e.g. `JsonToGoStructClient`, `JSONToURLEncodedV2Client`,
is itself a `JSON.parse` → pretty-print stub); `markup-calculator`,
`scrypt-hash-generator`, `regex-cheatsheet`, `wifi-qr-code-generator`,
`vcard-qr-generator` (each an orphaned stub with no real logic for the
promised feature — markup pricing math, Scrypt KDF, structured WiFi/vCard
payload encoding, static reference content); `robots-txt-tester`,
`robots-txt-simulator` (no per-URL "is this allowed for Googlebot" testing
exists anywhere in the catalog); `avi-to-gif`, `mkv-to-gif`, `mp4-to-gif`,
and — found incidentally, not part of any family, but the same underlying
defect — `gif-maker` itself: no real animated-GIF encoder exists anywhere
in this codebase, and `GifMakerClient`'s own `canvas.toDataURL('image/gif')`
call is a spec no-op (the Canvas spec only guarantees `image/png` support,
so browsers silently fall back to PNG), meaning even the one dedicated "GIF
Maker" tool never actually produced a GIF; `ai-rephraser`, `humanizer-ai`
(a hardcoded ~80-word synonym-substitution table with zero API calls
anywhere in the codebase — no tone change, no rewriting, and "bypass AI
detection" is a flatly false claim, not just an overclaim);
`content-summarizer`, `summarizer` (`trimmed.slice(0, limit)` character
truncation behind a fake 1-second loading spinner — no key-point extraction
of any kind, the exact "fake processing" doorway pattern the original SEO
diagnosis flagged); `vsd-to-docx`, `vsdx-to-docx`, `vsd-to-pptx`,
`vsdx-to-pptx` (`handleProcess` is `setOutput(input)` — a literal unchanged
echo — behind an unfilled placeholder template and a dead
`// Visio to Word conversion logic here` comment; no real Visio parser
exists anywhere in the codebase).

**Two new tools registered, not redirected or removed** — `svg-to-jpg` and
`svg-to-webp`. Found while checking `svg-to-png`: `ImageFormatConverterClient`
rejected `image/svg+xml` uploads entirely even though the rest of its
pipeline (`new Image()` from a blob URL → `canvas.drawImage` →
`canvas.toBlob`) handles SVG rasterization fine — a one-line
`ACCEPTED_TYPES` gap, not a missing capability. Fixed the component, then
found the exact rgb-to-hex pattern from round 3 again: real, dedicated
`case 'svg-to-jpg'`/`case 'svg-to-webp'` switch cases already existed with
no `data/tools.ts` entry ever routing to them. Registered both.

**Four real code bugs fixed, unrelated to redirect/remove decisions** (the
components themselves are legitimate and stay live under their existing
slugs):
- `PasswordGeneratorClient` had the same modulo-bias defect
  (`pool[rnd[i] % pool.length]`) that `lib/secureRandom.ts` was built to fix
  in round 2 — just never applied here. Swapped in `randomFromAlphabet`.
- `UptimeCalculatorClient` crashed on any whole-number SLA input (typing
  `95` in the number field, or the slider's own min of `90`) —
  `String(sla).split('.')[1].length` throws when there's no `.` to split.
  Fixed to handle a missing decimal part.
- `TextSorterClient`'s `'random'` sort mode was fully implemented in the
  switch statement but had no corresponding `<option>` in the `<select>` —
  dead, unreachable code exposed by the family read. Added the option.
- `PdfPasswordRemoverClient` had a limitation-warning `<div>` sitting after
  the component function's closing brace — valid but discarded JSX that
  never rendered. Moved it inside the actual return.

Verified with the same shadowing/coverage parser (0 conflicts, 0 missing
across 627 live slugs), the chain-resolution trace (0 loops, 0 dead ends
across 867 sources — proactively checked every alias/redirect pointing at
an affected slug *before* committing, based on the exact chain-lengthening
and false-dead-end mistakes round 3's own self-review caught after the
fact), `tsc --noEmit`, a full `next build`, and live testing of every
changed URL plus a random 15-tool sample. One process note: the first
`next build` silently didn't pick up the two newly-registered slugs in the
running `next start` server — traced to a stale server process left
listening on port 3000 from the previous round's testing, not a build
problem; a `rm -rf .next` clean rebuild plus killing the stale process
resolved it. Worth remembering for future rounds: always confirm the port
is actually free before trusting a live-server verification pass.

Left deliberately unactioned this round (real, but smaller, description-only
overclaims with no better redirect/removal target — flagged for a future
content-accuracy pass, not a routing fix): `lorem-ipsum`'s "via API" claim
(pure client-side); `lorem-ipsum-bytes`'s "byte-size control, HTML tags"
claim (only paragraph-count control exists); `title-case-converter`'s
"small words, numbers, custom exceptions" claim (plain Title Case only);
`markdown-editor`'s "Export to... PDF" claim (unverified, likely false);
`json-to-typescript-interface`/`-types`' strict/readonly/nullable-modifier
claims (unverified, moderate confidence); `robots-txt-editor`'s "live
crawler simulation" claim; `color-contrast-auditor`'s "suggested fixes"
claim; `image-rotate`/`rotate`'s "custom angle" claim (fixed 90/180/270°
buttons only); `mac-address-generator`/`random-mac-generator`'s "OUI,
EUI-64" claims (3 separator formats, no vendor-prefix or 64-bit support);
`readability-score-calculator`'s ARI/Coleman-Liau claim (only
Flesch-Kincaid + SMOG implemented); `random-color-generator`'s "random
colors" claim (`ColorHarmonyGeneratorClient` is a deterministic
hue-harmony generator, not random — no clean redirect target and a real
fix means adding an actual random mode, judged out of scope for this
pass); `word-density-analyzer`'s "phrase frequency" claim (single words
only). Also noted but not acted on: 4 near-duplicate-description
consolidation candidates (`word-combinations-generator`/`word-combinations`,
`jwt-tester`/`jwt-token-tester`, `english-collocations-checker`/
`collocations-checker`, `all-in-one-unit-converter`/`general-unit-converter`)
— not mismatches, just two slugs describing the same real tool, worth a 301
in a future pass to reduce duplicate-content surface.

## Self-review of round 4 — 9 findings, 9 fixed

10 finder angles run in parallel against this round's larger diff. Every
finding was real; all fixed.

- **A genuine live bug my own fix exposed.** The `'random'` sort mode I
  just made reachable in `TextSorterClient` called `sort(input)`
  independently in the render (`value={sort(input)}`) and again in the
  copy handler — since the comparator calls `Math.random()`, each call
  produced an *independent* shuffle, so the copied text never matched what
  was on screen, and any unrelated re-render (toggling the case-sensitive
  checkbox) silently reshuffled the visible output. Memoized the result
  per `(input, mode, caseSensitive)` and had both the display and the copy
  button read the same value. Also swapped the biased
  `sort(() => Math.random() - 0.5)` shuffle for a real Fisher-Yates while
  already in the function.
- **The two new SVG tools were broken for a common class of real input.**
  Many real-world SVGs declare only a `viewBox`, no explicit
  `width`/`height` — for those, `img.naturalWidth`/`naturalHeight` come
  back `0`, sizing the canvas to 0×0 and failing the conversion. Added a
  fallback that reads the dimensions straight out of the SVG markup
  (explicit width/height attributes, or the viewBox) when the image's own
  reported size is 0. Also hardened the upload check itself: `.svg`'s MIME
  type is well known to come back empty depending on OS/browser
  (especially via drag-and-drop), which would've rejected valid SVGs at
  the door — added a file-extension fallback alongside the MIME check.
- **5 dead links in 3 already-indexed blog posts**, pointing at tool pages
  this and earlier rounds removed with no redirect (`/tools/regex-cheatsheet`
  ×3, `/tools/json-to-go-struct` ×2) — exactly the kind of broken link a
  GSC-recovery initiative shouldn't be creating in its own indexed content.
  `regex-cheatsheet` has a real blog post covering the same material
  (`/blog/regex-cheatsheet`) — repointed the 3 links there rather than
  adding an unusual tool→blog-post redirect. No real destination exists for
  `json-to-go-struct` — removed the 2 dead links rather than point them at
  a red herring.
- **A live tool permanently unreachable at its own URL — a new bug class
  the family-fingerprinting method can't see.** `serp-simulator` is a real,
  live `data/tools.ts` entry rendering a real, distinct component
  (`SerpPreviewClient`, not `GoogleSerpSimulatorClient`), but
  `page.tsx`'s `REDIRECTS` map had a `'serp-simulator': 'google-serp-simulator'`
  entry with the *same key* as the live slug — and `REDIRECTS` is checked
  before `getCanonicalToolSlug`, so every visit permanently redirected away
  before the real tool ever rendered. The project already knew about this
  (`app/sitemap-tools.xml/route.ts` excluded it from the sitemap via a
  `SHADOWED_BY_REDIRECT` set with a comment describing the exact bug) but
  had worked around the symptom instead of the cause. The family-fingerprint
  script that drives this whole sweep groups slugs by which component they
  render *if reached* — it has no way to know a slug's own switch case is
  unreachable because something upstream shadows it first. Checked for more
  instances of this pattern (a live tool slug also appearing as a key in
  `TOOL_SLUG_ALIASES` or `page.tsx` `REDIRECTS`) — this was the only one.
  Removed the shadowing redirect and un-excluded the slug from the sitemap.
- **A real crash and a real usability bug in the exact function this
  round's own crash-fix hunk touches.** `UptimeCalculatorClient`'s number
  input clamped `[90, 99.999]` on every keystroke's `onChange`, so typing
  "9" (the first digit of, say, "95.5") from an empty field immediately
  snapped back to "90" — making most values impossible to type digit by
  digit, only pasteable or reachable via the slider. Moved the clamp to
  `onBlur`; `onChange` now only guards against `NaN`.
- **Sitemap freshness signal not bumped**, in the same file
  (`app/sitemap-tools.xml/route.ts`) whose own comment says to bump
  `TOOL_PAGES_LAST_MODIFIED` "when the tool catalog changes meaningfully" —
  exactly what round 4 did (34 removals, 2 additions) without touching this
  file. Bumped the date and folded in the `serp-simulator` sitemap fix
  above in the same edit.
- **Two floating multi-line comments with no blank-line separator before
  the next unrelated map entry** in `page.tsx`'s `REDIRECTS` (the
  `test-robots-txt-online` and `mp4-gif` removal rationales, both added
  this round) — a future reader could misattribute either explanation to
  the entry that happens to follow it. Added the missing blank lines.
- **A confusing, technically-wrong regex** in `PasswordGeneratorClient`:
  `/[O0Il1|`'"]/g` — inside a character class, `|` is a literal pipe, not
  regex alternation, so this was also (harmlessly, since none of those
  characters are in the symbol pool) stripping backtick/pipe/quote
  characters under the "exclude ambiguous" label. Simplified to `/[O0Il1]/g`,
  matching `RandomStringGeneratorClient`'s identical definition of
  "ambiguous" elsewhere in the catalog.

**Noted, not fixed** — real but smaller, or out of scope for a routing/bug-fix
pass: `exif-remover`'s EXIF tag *parser* only decodes JPEG (gates on the
`0xff 0xd8` SOI marker), so a PNG/WebP upload via the new
`image-metadata-viewer`/`metadata` redirects shows "no readable EXIF tags"
rather than real tags — the component already discloses this honestly
("...or use a format this parser doesn't decode") and its actual
metadata-*stripping* function (re-encoding through canvas) still works for
every format, so the redirect is still a net improvement over the old
slugs' zero real EXIF functionality either way; extending the parser to
PNG `tEXt`/`eXIf` chunks and WebP's `EXIF` RIFF chunk is real work, not a
one-line fix. Two meta-level findings about the recurring cost of this
whole sweep, not concrete bugs, so not actioned as code: no CI guardrail
exists to catch a stub component before a slug describing it gets
registered and indexed (this is the 4th manual round finding
already-indexed stub tools after the fact); and slug routing is hand-split
across three independently-edited registries
(`next.config.mjs`/`page.tsx REDIRECTS`/`TOOL_SLUG_ALIASES`) with no single
source of truth, which is the root cause behind every chain-length and
shadowing bug found across all four rounds. Both are real process
improvements worth a dedicated pass, not something to bolt onto a content
cleanup PR.

Re-ran the full verification suite after these fixes: shadowing/coverage
parser (0 conflicts, 0 missing across 627 live slugs), chain-resolution
trace (0 loops, 0 dead ends across 866 sources) plus a new check for any
live tool slug shadowed by a same-key alias/redirect (0, after fixing
`serp-simulator`), `tsc --noEmit`, a clean `.next` rebuild (killing the
port first this time), and live testing of every touched URL — including
the 4 edited blog posts — plus a random 15-tool sample.

## Confirmed but NOT fixed in this pass — real follow-up work

*Numbers below are from the first commit round; four family-verification
rounds since then (this doc's sections above) have worked through every
family down to size 2, including the full long tail in round 4. Re-running
the same fingerprinting script after all four rounds: 627 live tools, 41
families still sharing a component across 113 slugs, largest at size 7 —
down from 93 families / 268 slugs after round 1. There is no natural
stopping point left in family size — every remaining family is small
(2-7 slugs) and needs the same manual description-vs-component read round
4 used. Treat round 5 as "more of round 4," not a new phase: same method
(read the component, compare against each slug's own `data/tools.ts`
description, check for an unwired real component under a matching filename
before assuming redirect/removal, proactively check every alias pointing at
an affected slug before committing rather than relying on self-review to
catch chain-lengthening after the fact). Also still open: the 12
description-only overclaims flagged at the end of round 4 (real, but no
better redirect target, deferred as a content-accuracy pass rather than a
routing fix); the 4 near-duplicate-description consolidation candidates
from round 4; and committing the ad-hoc chain-resolution script used
informally in rounds 2-4 as a real, checked-in script
(`scripts/check-redirect-chains.js` or similar) — it has caught a real bug
every time it's been run, and being rewritten from scratch each round is
exactly the kind of gap that let round 3's own version false-flag a live
redirect as dead.*

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

## Unrelated but urgent — a stale `src/content/blog/` tree is silently serving wrong content for at least 1 live post

Found while fixing a dead link in round 4's self-review: `scripts/generate-blog-manifest.mjs`
(the `prebuild` step that generates `content/blog-manifest.ts`, the file
every blog page actually renders from) scans **two** directories —
`src/content/blog/` first, then `content/blog/` — and its dedup keeps
whichever copy it sees *first* for a given slug
(`if (!postsBySlug.has(slug)) postsBySlug.set(...)`). `src/content/blog/`
is a stale duplicate (56 files, vs. 73 in the real `content/blog/`), and
because it's scanned first, **any post that exists in both directories
silently ignores edits made to the real `content/blog/` copy.**

3 posts currently overlap: `2026-04-23-visualize-nested-json-relationships.md`
(byte-identical, harmless for now), `2026-04-23-debug-regex-capture-groups-multiple-matches.md`
(only differed in the dead link this round just fixed — patched both
copies so the fix actually takes effect), and, more seriously,
**`2026-04-15-why-browser-based-tools-are-the-future.md` — the live site
is currently serving a substantively different, older description and
tag set than what's in the maintained `content/blog/` copy**, with no
indication anywhere that an edit to that file silently does nothing.

Not fixed here — didn't touch `generate-blog-manifest.mjs`'s directory
order or delete `src/content/blog/`, since neither the intended
authoritative source nor the reason `src/` exists in parallel with the
project's on `content/` convention is knowable from the code alone, and
either fix has a blast radius beyond this PR's scope (up to 56 posts,
not the 3 that happen to overlap today — a future edit to any currently-
non-overlapping post is safe only until someone creates a `src/`-side copy
of it). Needs a decision: delete the stale `src/content/blog/` (and the
matching stale `src/lib/blog.ts` this session also noticed sitting next to
the real `lib/blog.ts`) if it's genuinely dead, or reverse the scan order
if `content/blog/` isn't actually meant to be authoritative.
