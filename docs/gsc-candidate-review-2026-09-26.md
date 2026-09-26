# Eight candidate tools: review and CI repair, 2026-09-26

This review covers the eight candidates from the earlier [indexability inventory](gsc-indexability-review-2026-09-26.md). It checks actual component dispatch, browser output, distinct purpose and copy. Historical shortlist labels were not used as acceptance evidence.

The content review follows [Google's guidance on helpful, reliable content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content): describe what the tool actually does, explain its limits, and give readers useful examples. Eligibility does not guarantee Google will index a page.

## Public QA and distinct-purpose decisions

Public baseline: `https://toolblip.com`, 2026-09-26. Chrome used a fresh Playwright context, not a signed-in profile. Desktop was 1440 × 1000; mobile was 375 × 1000. Copy checks captured the actual clipboard API payload. CSV and notebook checks read the downloaded bytes. Invalid input, reset controls and page overflow were checked.

Chrome baseline: 14 passing cases, 2 LDAP failures (exit 1). WebKit: 15 passing cases, including SSR/sitemap, and 2 LDAP failures (exit 1). Subsequent screenshot review added mobile layout regressions: timezone Copy was 46.5px high and the CSV filename was 60.75px high because words were split across lines. Both public regressions failed (exit 1). These are separate from the local repairs. Four candidates qualify for indexing; four remain held. Independent review found one additional HTML title-text defect after the initial public fixtures passed. The effective catalog becomes 341 eligible and 103 excluded, from 337 and 107.

| Candidate | Distinct purpose and checked output | Decision |
| --- | --- | --- |
| `json-to-typescript` | Generates sample-derived declarations rather than formatting JSON. Checked reserved property keys, invalid type names, nested nulls, mixed arrays, generated syntax and object-array aliases. | Reviewed; enable indexing |
| `time-zone-converter` | Converts a dated wall time across several zones rather than converting a Unix timestamp. Summer and DST behavior passed, but the mobile Copy label broke across lines. | Keep excluded; local layout repair needs deployed public QA |
| `html-table-generator` | Converts CSV rows and separate headers to escaped HTML, with table styling and preview. Checked quoted comma, escaped markup, malformed CSV and column behavior. | Reviewed; enable indexing |
| `ldap-filter-generator` | Builds directory search clauses with boolean composition and presence/comparison operators. Public equals output left an asterisk as a wildcard instead of a literal. | Keep excluded; parent deployment and public recheck required |
| `json-to-python` | Produces a Python `data = ...` literal assignment. Checked quoted keys, nested lists, booleans and None; this is not a model generator. | Reviewed; enable indexing |
| `split-csv` | Splits CSV records into downloaded parts while repeating headers. Downloaded multiline/comma/quote bytes passed; mobile loaded-file text was split into narrow columns. | Keep excluded; local layout repair needs deployed public QA |
| `html-minifier` | Conservatively removes ordinary comments and trims outer whitespace. Inline spacing, scripts and pre passed, but independent review found literal title text was removed. | Keep excluded; RCDATA repair needs deployed public QA |
| `ipynb-formatter` | Formats notebook JSON while preserving cell source, metadata and outputs. Distinct from notebook cleaning and HTML export. Checked whole-document equality, downloads and malformed notebook errors. | Reviewed; enable indexing |

All eight received curated descriptions, examples, limits and FAQs grounded in their selected components. The TypeScript output form is inferred from input, not selected by a mode switch. The table generator uses headers to choose column count. Notebook sorting is optional and changes document order. Time zone rules come from the browser. These copy edits require the parent's normal postdeploy spot check.

### Four repairs remain staged

Public input `A(B)` followed by NUL, `*` and backslash returned `(cn=A\28B\29\00*\5c)`. Equality must escape the literal asterisk as `\2a`; the presence operator is the explicit wildcard path. The local component now escapes it and disables Copy when validation fails. The browser regression must pass publicly after deployment before a `reviewed` decision can be added. This review does not claim the repair is already public. Timezone results now wrap their flex row while keeping Copy on one line. The CSV banner now uses normal paragraph flow. Both layout changes also need public verification before promotion.

The minifier omitted `title` from its protected elements, so `<title>A<!--keep-->B</title>` became `<title>AB</title>`. The [HTML Standard](https://html.spec.whatwg.org/dev/syntax.html) treats title and textarea contents as escapable raw text. New unit and browser regressions preserve comment-like text and entities in both elements. The narrow repair adds title and checks the actual tag-name boundary, so custom elements such as title-card still follow ordinary comment handling. The original parser structure is retained.

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
# Existing public pages, expecting all eight to be excluded before this release
npx playwright test --config playwright.candidates.config.ts

# Parent postdeploy check after this first-stage policy ships
CANDIDATE_EXPECT_INDEXED=json-to-typescript,html-table-generator,json-to-python,ipynb-formatter npx playwright test --config playwright.candidates.config.ts

# Normal CI still uses the original Playwright config and standard Chromium
npm run test:e2e
```

For built-local checks, set `CANDIDATE_BASE_URL` to the app URL. WebKit needs a local HTTPS server because the production CSP upgrades insecure asset requests; the verification used a temporary HTTPS proxy and accepted its self-signed test certificate without stripping CSP. The public config is separate from normal test defaults. `CANDIDATE_EXPECT_INDEXED` accepts a comma-separated list for the parent's postdeploy robots/sitemap checks. It does not change policy or relax functionality assertions. WebKit installation in this environment stalled extracting its downloaded archive; a temporary config used the matching archive extracted under `/tmp`.

## Verification record

Regression sequence:

- HTML unit red: title and uppercase TITLE lost literal comment-like text (2 failed, 61 passed, exit 1). The textarea variants passed before the repair.
- Targeted public HTML red: title lost `<!--keep-->` (1 failed, exit 1). The public baseline has not been rerun after the repair.
- Focused HTML and indexing-policy units after repair: 77 passed, exit 0.
- First full E2E on host Node 26 and installed Chrome: 206 passed, 4 failed, exit 1. All 13 original failures passed; account settings and three sponsor cases timed out. Trace diagnostics also stalled writing ZIP files under Node 26.
- The CI workflow specifies Node 22. A temporary official Node 22 runtime and matching standard Chromium passed all nine account-settings/sponsor diagnostics with valid traces, exit 0. No assertions, timeouts or source code were changed for those additional failures. This establishes the CI-runtime result; it does not isolate which host runtime/browser difference caused each timeout.

Final sequential checks completed so far:

| Check | Result | Exit |
| --- | --- | --- |
| Full E2E, Node 22 and standard Chromium | 210 passed, 4.5 minutes; no skips or retries | 0 |
| Full unit suite, one worker | 867 passed in 69 files | 0 |
| Standalone `tsc --noEmit` | Passed | 0 |
| Production build | Passed; 1553 static pages generated | 0 |
| Built-local candidates over HTTPS, Chrome and WebKit | 34 passed: all eight at 1440px/375px plus SSR/canonical/robots/sitemap per engine | 0 |

The initial local HTTP run passed all 17 Chrome checks but failed WebKit hydration because its asset requests were upgraded to HTTPS. The completed HTTPS run retains the production CSP and passes all 34 checks. Mobile screenshots confirm the timezone Copy labels and CSV filename remain readable. Generated `data/short-links.json` and `next-env.d.ts` were restored from HEAD after verification; existing production short-link seeds are preserved. Raw logs, traces and screenshots stay outside the repository. Parent owns independent review, commit/push/PR, deployment and the four staged promotion decisions.
