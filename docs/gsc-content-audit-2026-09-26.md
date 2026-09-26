# Tool content audit, 26 September 2026

## Evidence and limits

Baseline: `origin/main` at `273d75c`. PR #362 already fixed sitemap, canonical, and www handling and was deployed. This change preserves those fixes.

Search Console was inspected in Chrome on September 26. The page indexing report was last updated September 21: **13 indexed, 1,569 crawled but currently not indexed, and 0 discovered but not indexed**. This is historical all-known URL inventory, not just the current sitemap. Live HTTP checks found separate self-canonical JWT and Markdown pages and no robots block.

### Search Console observations

- Indexed examples had old crawl dates: the root on September 17; `lorem-ipsum-full` and `url-parameter-extractor` on June 1; `lorem-ipsum-simple` on May 28; `login` on May 24; `pricing`, `broken-link-checker`, and `color-picker-quick` on May 23; `image-to-svg-converter` and `favicon-checker-express` on May 22. Some now redirect, are intentionally noindex, or have been removed. Historical totals alone cannot measure this change.
- The first 250 crawled-but-not-indexed rows, sorted newest first, contained 4 September crawl dates, 22 August dates, and 224 July dates. The September rows were JWT canonical/quick on September 18 and Lorem canonical/pro on September 15. The sample ended July 5. This distribution does not describe all 1,569 excluded URLs.
- Crawl stats, last updated September 24, showed 2,913 requests to `toolblip.com` over 90 days, a 563 ms average response time, and no main-host problems in that period. Responses were 95% HTTP 200. Refresh accounted for 99% of crawling and discovery less than 1%. File types were 51% JSON, 23% HTML, and 15% JavaScript; page-resource loads accounted for 71% of requests.
- The main host's unauthorized breakdown had 60 requests. Its first 10 examples were all `/api/auth/me`, an expected anonymous authentication resource. This sample gives no evidence that those 401s blocked public page fetching.
- All hosts combined had 3,195 requests. `app.toolblip.com` accounted for 104 and had historical issues; the main host did not. App/API errors do not establish a main-site availability failure.
- JWT URL Inspection showed a successful smartphone fetch, indexing allowed, and both declared and Google-selected canonical set to `jwt-decoder`. It remained crawled but not indexed. No manual actions or security issues were reported.

The observation record is `/tmp/tb-gsc-live-evidence.txt`. Live legacy checks also returned HTTP 308 for JWT v2/prime/quick, Reading Time Express, Regex Match Tool, Lorem Ipsum Full/Simple, and Color Picker Quick. An HTTP 200 meta-refresh explanation was not confirmed; regression tests require a permanent HTTP status and a Location header.

A source scan reproduced 490 catalog entries, 317 passing the existing FAQ-based indexability gate. Grouping catalog switch cases that return the same component with no props found **36 candidate families, totaling 93 pages and 61 indexable pages**. These are candidates, not 93 proven duplicates. Shared components can implement distinct format conversions or route-dependent behavior. FAQ existence alone is not full quality approval.

For the following 17 alias pages, inspection confirmed the exact same no-prop JSX return as the retained destination. Their components and local helpers contain no pathname, search-param, route-param, or browser-location branching. This pass did not consolidate other shared components or image/PDF tools.

| Retired slug(s) | Retained slug | Component |
| --- | --- | --- |
| text-case-converter, title-case-converter | case-converter | CaseConverterClient |
| url-encoder | url-encode | UrlEncodeClient |
| regex-match-tester, regex-pattern-tester | regex-tester | RegexTesterClient |
| random-password-generator | password-generator | PasswordGeneratorClient |
| markdown-preview, markdown-editor | markdown-to-html | MarkdownToHtmlClient |
| lorem-ipsum-words | lorem-ipsum-generator | LoremIpsumGeneratorClient |
| jwt-inspector, jwt-token-decoder | jwt-decoder | JwtDecoderClient |
| read-time-calculator, reading-pace-calculator, reading-time-estimator | reading-time-calculator | ReadingTimeCalculatorClient |
| text-statistics-calculator | text-statistics | TextStatisticsClient |
| sla-uptime-calculator | uptime-calculator | UptimeCalculatorClient |
| general-unit-converter | all-in-one-unit-converter | AllInOneUnitConverterClient |

## Changes

- Added 17 catalog aliases and explicit permanent Next.js redirects, retaining 11 destinations. Removed 17 catalog rows and their unreachable UI switch cases. Directory, related tools, metadata, and sitemap consumers now use the retained entries. Catalog: **490 → 473**. Indexable entries: **317 → 304** (13 retired aliases were indexable).
- Inspected `TOOL_SLUG_ALIASES`, page-local `REDIRECTS`, and `next.config.mjs`. No pre-existing redirect destination pointed to these 17 retired slugs, so there were no affected chains to flatten. Existing legacy aliases remain. Regression coverage checks idempotent alias resolution and selected redirect destinations.
- Updated active blog links in three source posts and regenerated the blog manifest. Historical content keyed to retired slugs remains; it is no longer rendered as an independent catalog page.
- Retained canonical FAQ content and added useful details about reading-speed settings, JWT claims, malformed URL decoding, punctuation-free text, and downtime precision. Moved Markdown examples to the retained page and added a short Lorem Ipsum word-count example. Corrected unsupported claims about regex explanations, Lorem Ipsum HTML wrapping, and PascalCase.
- Renamed the visible Automation Wizard to **Workflow Outline Builder**, preserving `/tools/automation-wizard` and the builder. Catalog, UI, content, FAQ, and the historical batch copy now describe a draft. It does not run triggers/actions or connect apps. Copied JSON/YAML is a generic outline with no verified runner compatibility. JSON retains entered settings; YAML omits them. The page remains indexable.

## Interpretation and follow-up

Duplicate same-intent pages and claims that exceed actual behavior are concrete content defects. Historical duplication and infrequent recent crawls in the inspected sample are more plausible contributors to nonindexing than a main-host outage. That is an inference, not Search Console's diagnosis: this audit cannot establish Google's algorithmic quality reasoning or a penalty. Consolidation removes those defects without promising an indexing date.

Google describes redirects as a strong canonical signal and recommends linking internally to canonical URLs: [duplicate URL consolidation](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls). Its [crawl guidance](https://developers.google.com/crawling/docs/crawl-budget) explains why duplicate URL inventory can waste crawling effort. These principles do not prove that crawl capacity caused Toolblip's exclusions.

After deployment, evaluate cohorts of submitted canonical URLs. Record URL Inspection's selected canonical, indexing state, and last crawl date; distinguish pages crawled before the fix from those crawled afterward. Compare that cohort over time rather than using the raw historical exclusion total, which includes retired URLs. Continue inspecting the remaining candidate families individually and audit actual functionality and claims, not FAQ presence alone.

## Validation

Baseline main CI run `36223609376` had **112 passes and 13 existing authentication/tool E2E failures**. Those failures are separate from the focused production request checks for this change.

An earlier local suite passed 336 tests. A later 341-test run overlapped a build and failed the Base64Image 10 MiB timeout test. The final suite and build are run sequentially below; no test timeout was increased. An earlier production build completed in 185 seconds.

Final validation on September 26:

- Dispatch regression: before the fix, 11 assertions passed and `url-encode` failed because it rendered `JsonFormatterClient`. Restoring its return fixed the failure. Coverage now checks all 11 retained destinations plus completeness against the consolidation map.
- `npm test`: **353 passed across 33 files**, exit 0, in 7.10 seconds. This run finished before the build started. The Base64Image 10 MiB case passed without changing its timeout. Log: `/tmp/tb-content-final-tests.log`.
- `npm run build`: **passed**, exit 0. Compilation took 49 seconds, TypeScript 9.3 seconds, and generation of 1,561 static pages 16.8 seconds. The sandbox attempt stalled at compilation; the successful retry ran outside the sandbox. Log: `/tmp/tb-content-final-build.log`; stalled-attempt log: `/tmp/tb-content-sandbox-build.log`. Build warnings included the existing unset `SHORT_LINKS_DATA_DIR`, edge-runtime static-generation limitation, unsupported `z-index`, and Node deprecation notices.
- Production request tests: **21 passed**, exit 0, in 1.5 seconds. Ran `e2e/content-consolidation.spec.ts` with `/tmp/tb-content-production.config.cjs` against `npm run start -- --hostname 127.0.0.1 --port 53193`. No dev server, mock server, or full authentication suite was started. All 17 new aliases passed permanent HTTP redirect, query preservation, destination HTTP 200, and canonical checks. Eight legacy aliases passed 301/308 plus exact Location-path checks. Directory, sitemap, workflow limits, and URL Encoder HTML assertions passed. Log: `/tmp/tb-content-final-e2e.log`.
- Production browser smoke: **passed** in installed Chrome using an isolated headless session. URL Encoder encoded Unicode and reserved characters, decoded percent-encoded input, and displayed its malformed-input error. The bundled Playwright browser was unavailable; no download was needed. Script and log: `/tmp/tb-url-encode-smoke.cjs`, `/tmp/tb-url-encode-smoke.log`.
- Generated artifacts: the production sitemap contained **304 unique tool URLs**, included all 11 destinations, and omitted all 17 retired aliases. Each retained HTML artifact had exactly one self-canonical and no noindex directive. `.next/routes-manifest.json` contained the expected 17 HTTP 308 redirects. Sitemap snapshot: `/tmp/tb-content-final-sitemap.xml`.

The temporary production server was stopped after validation. No local implementation blocker remains. The 13 baseline main-CI E2E failures remain a separate known issue; the full authentication/tool suite was not rerun here. No commit, push, merge, deployment, or public indexing outcome is claimed.
