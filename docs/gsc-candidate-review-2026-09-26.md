# Eight candidate tools: review and CI repair, 2026-09-26

This review covers the eight candidates from the earlier [indexability inventory](gsc-indexability-review-2026-09-26.md). It checks actual component dispatch, browser output, distinct purpose and copy. Historical shortlist labels were not used as acceptance evidence.

The content review follows [Google's guidance on helpful, reliable content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content): describe what the tool actually does, explain its limits, and give readers useful examples. Eligibility does not guarantee Google will index a page.

## Public QA and distinct-purpose decisions

Public baseline: `https://toolblip.com`, 2026-09-26. Chrome used a fresh Playwright context, not a signed-in profile. Desktop was 1440 × 1000; mobile was 375 × 1000. Copy checks captured the actual clipboard API payload. CSV and notebook checks read the downloaded bytes. Invalid input, reset controls and page overflow were checked.

Historical predeployment results: Chrome baseline had 14 passing cases, 2 LDAP failures (exit 1). WebKit: 15 passing cases, including SSR/sitemap, and 2 LDAP failures (exit 1). Subsequent screenshot review added mobile layout regressions: timezone Copy was 46.5px high and the CSV filename was 60.75px high because words were split across lines. Both public regressions failed (exit 1). At that stage, four candidates qualified for indexing and four remained held. Independent review found one additional HTML title-text defect after the initial public fixtures passed. Stage 1 changed the effective catalog to 341 eligible and 103 excluded, from 337 and 107. The public PASS and final decisions below supersede those holds.

| Candidate | Distinct purpose and checked output | Decision |
| --- | --- | --- |
| `json-to-typescript` | Generates sample-derived declarations rather than formatting JSON. Checked reserved property keys, invalid type names, nested nulls, mixed arrays, generated syntax and object-array aliases. | Reviewed; enable indexing |
| `time-zone-converter` | Converts a dated wall time across several zones rather than converting a Unix timestamp. Summer and both DST errors passed; the repaired mobile Copy label is readable in both engines. | Reviewed; enable indexing |
| `html-table-generator` | Converts CSV rows and separate headers to escaped HTML, with table styling and preview. Checked quoted comma, escaped markup, malformed CSV and column behavior. | Reviewed; enable indexing |
| `ldap-filter-generator` | Builds directory search clauses with boolean composition and presence/comparison operators. Deployed equals output escapes the literal asterisk; invalid attributes disable Copy. | Reviewed; enable indexing |
| `json-to-python` | Produces a Python `data = ...` literal assignment. Checked quoted keys, nested lists, booleans and None; this is not a model generator. | Reviewed; enable indexing |
| `split-csv` | Splits CSV records into downloaded parts while repeating headers. Downloaded multiline/comma/quote bytes passed; the repaired mobile filename is readable in both engines. | Reviewed; enable indexing |
| `html-minifier` | Conservatively removes ordinary comments and trims outer whitespace. Inline spacing, scripts and pre passed; deployed title/textarea text and entities are preserved. | Reviewed; enable indexing |
| `ipynb-formatter` | Formats notebook JSON while preserving cell source, metadata and outputs. Distinct from notebook cleaning and HTML export. Checked whole-document equality, downloads and malformed notebook errors. | Reviewed; enable indexing |

All eight received curated descriptions, examples, limits and FAQs grounded in their selected components. The TypeScript output form is inferred from input, not selected by a mode switch. The table generator uses headers to choose column count. Notebook sorting is optional and changes document order. Time zone rules come from the browser. The stage-1 public run below checked the deployed pages after these edits.

### Historical repair findings before stage 1

Public input `A(B)` followed by NUL, `*` and backslash returned `(cn=A\28B\29\00*\5c)`. Equality must escape the literal asterisk as `\2a`; the presence operator is the explicit wildcard path. The local component now escapes it and disables Copy when validation fails. At the time of this finding, the browser regression still needed a public pass before a `reviewed` decision could be added. Timezone results now wrap their flex row while keeping Copy on one line. The CSV banner now uses normal paragraph flow. Both layout changes also needed public verification before promotion; the later PASS below closes that gate.

The minifier omitted `title` from its protected elements, so `<title>A<!--keep-->B</title>` became `<title>AB</title>`. The [HTML Standard](https://html.spec.whatwg.org/dev/syntax.html) treats title and textarea contents as escapable raw text. New unit and browser regressions preserve comment-like text and entities in both elements. The narrow repair adds title and checks the actual tag-name boundary, so custom elements such as title-card still follow ordinary comment handling. The original parser structure is retained.

### Stage 1 public PASS and final promotion

Stage 1 deployed PR368 commit `25f272822d470583ec814029e461a4a1a6c3165b`. Parent verified Railway deployment `1d2119c9-8e9f-4a63-a4bf-f56112c46d84` as `SUCCESS` and GitHub deployment `6679714953` at that SHA. The public readiness check returned HTTP 200 with 341 tool sitemap URLs at `2026-09-26T14:03:41.510Z`.

The public run started at `2026-09-26T14:04:32.190Z` and took 100.4 seconds: **34 passed, exit 0**, comprising 17 Chrome and 17 WebKit checks, with no failures, skips or retries. Each engine checked all eight routes at 1440px and 375px, plus SSR/canonical/robots/sitemap agreement. The expected public indexables were the stage-1 four: `json-to-typescript`, `html-table-generator`, `json-to-python`, and `ipynb-formatter`. The other four still correctly served noindex during that run.

The PASS report was updated at `2026-09-26T14:07:06Z`: `/tmp/tb-followup-public-result.md`. The log `/tmp/tb-followup-public-final.log` records `PLAYWRIGHT_EXIT_CODE=0` and `FINAL_VERDICT=PASS`; machine-readable results are `/tmp/tb-followup-public-lawjg1jr/results.json`. These local artifacts are outside the repository. The persisted cases are in `e2e/indexing-candidates.spec.ts`.

| Public URL | Passed cases in both engines and both widths |
| --- | --- |
| https://toolblip.com/tools/json-to-typescript | Identifiers, reserved keys, heterogeneous arrays, nested null, generated syntax, object-array alias, invalid JSON/type names, clipboard and Clear. |
| https://toolblip.com/tools/time-zone-converter | Summer conversion to `2024-07-01 17:00` and `2024-07-02 01:00`, clipboard, both DST errors, Clear and Copy-label height at most 32px. |
| https://toolblip.com/tools/html-table-generator | Quoted CSV comma, escaped markup, two table cells, clipboard, malformed CSV and Clear. |
| https://toolblip.com/tools/ldap-filter-generator | Literal special characters produce `(cn=A\28B\29\00\2a\5c)`, matching clipboard payload, invalid attribute disables Copy, and Clear. |
| https://toolblip.com/tools/json-to-python | Quoted keys, nested lists, Python True/None/False literals, clipboard, malformed JSON and Clear. |
| https://toolblip.com/tools/split-csv | Two downloaded parts preserve embedded newline/comma/quotes and headers, filename height at most 24px, malformed CSV and Clear. |
| https://toolblip.com/tools/html-minifier | Inline separators, script strings and pre whitespace; title/textarea preserve literal comment-like text and entities, including parsed DOM text equality; clipboard, unclosed comment and Clear. |
| https://toolblip.com/tools/ipynb-formatter | Whole-document notebook equality including metadata and outputs, downloaded JSON equality, clipboard, malformed notebook and Clear. |

All cases retained their canonical, description, robots and overflow assertions. The verifier also inspected all four mobile timezone/CSV screenshots (two per engine) and confirmed readable Copy labels and filenames. Earlier red reports remain historical evidence of the repaired defects.

Final review dated **2026-09-26** promotes only `time-zone-converter`, `ldap-filter-generator`, `split-csv`, and `html-minifier` from hold to reviewed. The other four remain reviewed. The policy now has **8 reviewed candidates, 345 eligible and 99 excluded out of 444 catalog tools**. The frozen 354-slug legacy baseline and original catalog snapshot are unchanged; aliases, unknown slugs and other excluded tools gain no eligibility.

This final policy change still requires the parent's commit, CI and deployment. The public PASS proves stage-1 behavior, not deployment of this second policy change or Google indexing.

## Exact CI failure causes

The focused baseline reproduced 13 failures and one passing invalid-login case. The first local history run hit cold compilation before its historical duplicate-count assertion; the main CI log separately records four links where two were expected.

| Cases | Cause | Retained verification |
| --- | --- | --- |
| Dashboard history (1) | Each recent row now has both a named tool link and a View action; counting all anchors doubled the row count. | Two named recent links in newest-first order, plus two View actions with matching destinations. |
| OAuth (2), login (2), signup (1), logout (1) | Dashboard overview no longer displays account email. Logout is inside Account menu. | Authenticated menu, exact `/api/auth/me` name/email/id, HTTP-only cookie where previously checked, a nondefault protected next route, logout cookie removal, 401 and protected dashboard redirect. |
| OAuth legal onboarding (1) | Free-plan card moved to Subscription. | Legal checkbox gate, acceptance, dialog closure, subscription card and server-side accepted state. |
| Session restoration (1) | Profile and subscription details moved off overview. | Reload profile, exact user identity, subscription features and plans link. |
| Soft navigation (1) | Counter sampled before the initial hydration-driven `/api/auth/me` request. | Await initial response; require exactly one auth request and no additional document or auth requests across client navigation. |
| Base64 (1) | Action labels changed to Encode to Base64 / Decode from Base64; mode controls are tabs. Input must wait for hydration. | Exact encode/decode round trip. |
| Hex to RGB (1) | Retired route redirects to the color-format converter, with a different default. | Canonical redirect, exact default RGB and live conversion to white. |
| Engagement (1) | Share card now contains the title, QR code, short links and Share via labels, with no disabled URL textbox. | Exact redirect target, social URLs, actual Chrome clipboard value, share count, favorite authentication and persistence. |

No test is skipped, deadlines and retry settings are unchanged, and no API repository changes were made.

## Reproduce candidate checks

```sh
# Historical pre-stage-1 command, expecting all eight excluded
npx playwright test --config playwright.candidates.config.ts

# Completed stage-1 public check, expecting four reviewed candidates
CANDIDATE_EXPECT_INDEXED=json-to-typescript,html-table-generator,json-to-python,ipynb-formatter npx playwright test --config playwright.candidates.config.ts

# Normal CI still uses the original Playwright config and standard Chromium
npm run test:e2e
```

For built-local checks, set `CANDIDATE_BASE_URL` to the app URL. WebKit needs a local HTTPS server because the production CSP upgrades insecure asset requests; the verification used a temporary HTTPS proxy and accepted its self-signed test certificate without stripping CSP. The public config is separate from normal test defaults. `CANDIDATE_EXPECT_INDEXED` accepts a comma-separated list for the parent's postdeploy robots/sitemap checks. It does not change policy or relax functionality assertions. WebKit installation in this environment stalled extracting its downloaded archive; a temporary config used the matching archive extracted under `/tmp`.

## Verification record

Regression sequence:

- HTML unit red: title and uppercase TITLE lost literal comment-like text (2 failed, 61 passed, exit 1). The textarea variants passed before the repair.
- Targeted public HTML red: title lost `<!--keep-->` (1 failed, exit 1). This was the predeployment red result; the later stage-1 public run passed.
- Focused HTML and indexing-policy units after repair: 77 passed, exit 0.
- First full E2E on host Node 26 and installed Chrome: 206 passed, 4 failed, exit 1. All 13 original failures passed; account settings and three sponsor cases timed out. Trace diagnostics also stalled writing ZIP files under Node 26.
- The CI workflow specifies Node 22. A temporary official Node 22 runtime and matching standard Chromium passed all nine account-settings/sponsor diagnostics with valid traces, exit 0. No assertions, timeouts or source code were changed for those additional failures. This establishes the CI-runtime result; it does not isolate which host runtime/browser difference caused each timeout.

Historical stage-1 local checks before deployment:

| Check | Result | Exit |
| --- | --- | --- |
| Full E2E, Node 22 and standard Chromium | 210 passed, 4.5 minutes; no skips or retries | 0 |
| Full unit suite, one worker | 867 passed in 69 files | 0 |
| Standalone `tsc --noEmit` | Passed | 0 |
| Production build | Passed; 1553 static pages generated | 0 |
| Built-local candidates over HTTPS, Chrome and WebKit | 34 passed: all eight at 1440px/375px plus SSR/canonical/robots/sitemap per engine | 0 |

The initial local HTTP run passed all 17 Chrome checks but failed WebKit hydration because its asset requests were upgraded to HTTPS. The completed HTTPS run retains the production CSP and passes all 34 checks. Mobile screenshots confirm the timezone Copy labels and CSV filename remain readable. Generated `data/short-links.json` and `next-env.d.ts` were restored from HEAD after verification; existing production short-link seeds are preserved. Raw logs, traces and screenshots stay outside the repository. That was the predeployment verification record. Parent owns independent review, commit/push/PR and deployment of the final promotion recorded above.


## Final promotion validation

The policy-only promotion was validated under Node `v22.23.3` after reading the public PASS report. Focused policy/path/product-recovery/sitemap checks passed 47/47, recovery-script checks passed 14/14, and the full unit suite passed 867/867 in 69 files. Standalone `tsc --noEmit` and the production build passed. All completed checks exited 0.

The built app served exactly 345 unique tool sitemap URLs, matching the full eligible policy set. All eight reviewed routes returned HTTP 200 with `index, follow` and their exact public canonical URL. Every alias and all 99 excluded catalog tools were absent from that sitemap. An independent before/after policy comparison found only the four authorized additions, no removals, and a byte-identical frozen legacy baseline. The temporary loopback server was stopped.

The first sandbox build stalled during compilation and was cancelled (exit 130); the unchanged build outside the sandbox passed and generated 1553 static pages. The earlier offline dependency install failed because one package was not cached (exit 1); the normal cache-preferred install succeeded (exit 0). These are environment attempts, not passing checks. No app code, test deadlines or assertions were relaxed. The earlier 210-case local E2E result remains stage-1 evidence; that suite and public browser tests were not rerun for this policy-only change. Generated `data/short-links.json` and `next-env.d.ts` match HEAD. This final promotion has not been committed or deployed by this task.
