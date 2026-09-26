# Tool indexing review, 2026-09-26

## Snapshot and scope

Source revision: `5556e22`. The original catalog had **473 tools: 354 eligible and 119 noindex**. The earlier 169 noindex count is stale. The [JSON inventory](gsc-indexability-inventory-2026-09-26.json) archives all 119 original rows, including tools subsequently retired as redirects. It isn't a live count of pending tools.

This audit inspected dispatch/source and existing committed QA evidence. It did not run fresh public browser QA. The archive records catalog dispositions from the shared worktree on 2026-09-26; it doesn't certify deployed redirects. Canonical routes still need their own evidence.

## Explicit policy replaces the FAQ gate

`data/tool-indexing-policy.ts` freezes the original 354 eligible slugs. Their effective status is `legacy-eligible-needs-review` while they remain canonical catalog entries. This preserves eligibility without claiming a quality review. Removed entries and aliases are ineligible even if they remain in the historical list.

`getToolIndexingStatus` reports effective status for audits. `isToolIndexable` is the shared robots/sitemap gate. Neither imports the FAQ registry. Adding an FAQ cannot promote a page, and removing an FAQ cannot silently deindex a baseline page. New catalog tools default to `pending`; unknown slugs are `not-in-catalog`. Explicit `hold` decisions override legacy eligibility. No broad eligibility change is part of this work.

A future `reviewed` decision must include a valid `YYYY-MM-DD` review date and a nonblank evidence reference. Invalid metadata fails closed as `hold`. The reference must document fresh public-route QA, a distinct useful purpose, and copy that accurately describes the implementation and its limits. Metadata validation checks format, not the truth of the evidence; a reviewer must inspect it. Add decisions deliberately in `TOOL_INDEXING_DECISIONS`, never by regenerating the baseline from FAQs.

No automatic promotion applies to the eight candidates below, historical signoffs, stored scenario passes, or the 12-tool recovery cohort. The cohort remains at its existing policy status until the parent review records browser QA and an explicit decision.

## What the evidence supports

The original classification is 99 `keep-noindex`, 8 `promote-review`, and 12 `duplicate`. These are audit recommendations, not runtime policy statuses. There are 49 historical human signoffs and 40 recorded both-engine passes among the original 119. `MANUAL_TOOL_QA.md` has 185 unique checked slugs despite its stale 182 header. Prior signoff and missing fixtures don't establish current acceptance. Line-count “working” labels in `tool-audit.csv` aren't acceptance evidence.

Recorded Chrome/WebKit scenario passes don't prove all-mode behavior or fresh production acceptance. Developer-data reports retain run shutdown failures alongside per-route passes. Utility/general results are mixed. Security, network, and image integration remain qualified. Missing, failed, and not-run checks remain gaps in the inventory.

The original prose shortlist claims both-engine evidence for all eight candidates. Its structured rows for `json-to-typescript`, `json-to-python`, and `ipynb-formatter` instead say no committed route summary and do not record both-engine passes. This archive preserves that discrepancy. Locate the actual route evidence before approval.

Private absolute paths and full report logs are omitted. Each JSON row retains its component, report reference, engine statuses, concrete recorded assertions, historical signoff, gaps, and recommendation. Duplicate source references are included where available.

## Eight candidates still awaiting review

- `json-to-typescript`: No concrete assertions in the structured source row; locate evidence.
- `time-zone-converter`: Summer NY/London/Tokyo conversion and both DST ambiguity paths; Tool fits a 320px viewport
- `html-table-generator`: Quoted CSV comma stays in one table cell; Populated result or error state fits a 320px viewport before Clear; Tool contents fit a 320px viewport
- `ldap-filter-generator`: LDAP parentheses escaped as RFC filter octets; Populated result or error state fits a 320px viewport before Clear; Tool contents fit a 320px viewport
- `json-to-python`: No concrete assertions in the structured source row; locate evidence.
- `split-csv`: CSV bytes preserve embedded newline, commas and escaped quotes; Tool fits a 320px viewport
- `html-minifier`: Closing script tag and inline word separator preserved; Populated result or error state fits a 320px viewport before Clear; Tool contents fit a 320px viewport
- `ipynb-formatter`: No concrete assertions in the structured source row; locate evidence.

All eight require fresh public QA, distinct-purpose review, honest copy, and an explicit dated evidence reference before `reviewed` status. A duplicate never inherits its canonical tool's approval.

## Complete historical 119-row index

The detailed gaps and engine evidence are in the linked JSON. Rows marked `historical-redirect` are retained for traceability and excluded from live pending inventory.

| Slug | Disposition at archive | Original recommendation | Recorded both-engine pass | Historical signoff |
| --- | --- | --- | --- | --- |
| `json-to-markdown-table` | current-canonical-at-archive | keep-noindex | no | yes |
| `image-aspect-ratio-calculator` | current-canonical-at-archive | keep-noindex | no | no |
| `hash-from-text` | current-canonical-at-archive | keep-noindex | no | no |
| `image-trimmer` | current-canonical-at-archive | keep-noindex | no | no |
| `erase-color` | current-canonical-at-archive | keep-noindex | no | yes |
| `square-crop` | current-canonical-at-archive | keep-noindex | no | no |
| `htaccess-redirect-generator` | current-canonical-at-archive | keep-noindex | no | yes |
| `percentage-calculator` | current-canonical-at-archive | keep-noindex | no | yes |
| `gradient-generator` | current-canonical-at-archive | keep-noindex | no | yes |
| `json-to-typescript` | current-canonical-at-archive | promote-review | yes | no |
| `slug-permalink-checker` | current-canonical-at-archive | keep-noindex | no | yes |
| `slideshow-generator` | current-canonical-at-archive | keep-noindex | yes | no |
| `quote-of-the-day` | current-canonical-at-archive | keep-noindex | yes | no |
| `morse-code-translator` | current-canonical-at-archive | keep-noindex | no | yes |
| `time-zone-converter` | current-canonical-at-archive | promote-review | yes | no |
| `html-table-generator` | current-canonical-at-archive | promote-review | yes | no |
| `twitter-card-preview` | current-canonical-at-archive | keep-noindex | no | no |
| `shell-command-reference` | current-canonical-at-archive | keep-noindex | yes | no |
| `physics-constants-reference` | current-canonical-at-archive | keep-noindex | yes | no |
| `text-sorter` | historical-redirect → `text-line-sorter` | duplicate | no | yes |
| `slug-generator` | current-canonical-at-archive | keep-noindex | no | yes |
| `graphql-playground` | current-canonical-at-archive | keep-noindex | no | no |
| `websocket-tester` | current-canonical-at-archive | keep-noindex | no | no |
| `ldap-filter-generator` | current-canonical-at-archive | promote-review | yes | no |
| `regex-pattern-generator` | current-canonical-at-archive | keep-noindex | yes | no |
| `image-to-base64` | historical-redirect → `base64-image-converter` | duplicate | no | no |
| `json-to-typescript-interface` | historical-redirect → `json-to-typescript` | duplicate | yes | no |
| `currency-converter` | current-canonical-at-archive | keep-noindex | no | yes |
| `mime-types-reference` | current-canonical-at-archive | keep-noindex | yes | no |
| `json-editor` | current-canonical-at-archive | keep-noindex | yes | no |
| `json-tree-view` | current-canonical-at-archive | keep-noindex | yes | no |
| `html-entity-encoder` | current-canonical-at-archive | keep-noindex | yes | no |
| `md5-hash-generator` | current-canonical-at-archive | keep-noindex | no | no |
| `hash-diff-checker` | current-canonical-at-archive | keep-noindex | no | no |
| `lorem-ipsum-detector` | current-canonical-at-archive | keep-noindex | no | yes |
| `word-cloud-generator` | current-canonical-at-archive | keep-noindex | no | no |
| `json-to-python` | current-canonical-at-archive | promote-review | yes | no |
| `text-highlighter` | current-canonical-at-archive | keep-noindex | no | yes |
| `word-combinations-generator` | current-canonical-at-archive | keep-noindex | no | yes |
| `sentiment-analyzer` | current-canonical-at-archive | keep-noindex | no | yes |
| `hex-named-color-converter` | current-canonical-at-archive | keep-noindex | no | yes |
| `grammar-checker-v2` | current-canonical-at-archive | keep-noindex | no | yes |
| `json-validator` | current-canonical-at-archive | keep-noindex | yes | no |
| `word-alphabetizer` | current-canonical-at-archive | keep-noindex | no | yes |
| `jwt-tester` | historical-redirect → `jwt-token-tester` | duplicate | no | no |
| `metric-imperial-converter` | current-canonical-at-archive | keep-noindex | no | yes |
| `jwt-token-tester` | current-canonical-at-archive | keep-noindex | no | no |
| `grammar-score-checker` | current-canonical-at-archive | keep-noindex | no | yes |
| `regex-description-generator` | current-canonical-at-archive | keep-noindex | yes | no |
| `grammar-checker-pro` | current-canonical-at-archive | keep-noindex | no | yes |
| `reading-level-estimator` | current-canonical-at-archive | keep-noindex | no | yes |
| `color-format-converter` | current-canonical-at-archive | keep-noindex | no | yes |
| `google-serp-preview` | current-canonical-at-archive | keep-noindex | no | no |
| `curl-gen` | current-canonical-at-archive | keep-noindex | yes | no |
| `temp-converter` | current-canonical-at-archive | keep-noindex | no | yes |
| `word-freq` | current-canonical-at-archive | keep-noindex | no | yes |
| `regex-explainer` | current-canonical-at-archive | keep-noindex | yes | no |
| `passive-voice-detector` | current-canonical-at-archive | keep-noindex | no | yes |
| `word-scramble-generator` | current-canonical-at-archive | keep-noindex | no | yes |
| `uuid-normalizer` | current-canonical-at-archive | keep-noindex | no | no |
| `pressure-converter` | current-canonical-at-archive | keep-noindex | no | yes |
| `energy-converter` | current-canonical-at-archive | keep-noindex | no | yes |
| `business-plan-generator` | current-canonical-at-archive | keep-noindex | yes | no |
| `font-to-png` | current-canonical-at-archive | keep-noindex | no | no |
| `press-release-generator` | current-canonical-at-archive | keep-noindex | no | no |
| `split-csv` | current-canonical-at-archive | promote-review | yes | no |
| `unicode-escape-encoder` | current-canonical-at-archive | keep-noindex | no | yes |
| `remove-extra-spaces` | current-canonical-at-archive | keep-noindex | no | yes |
| `random-choice-wheel` | current-canonical-at-archive | keep-noindex | yes | no |
| `image-shadow-generator` | current-canonical-at-archive | keep-noindex | yes | no |
| `hmac-generator` | current-canonical-at-archive | keep-noindex | no | no |
| `secure-random-generator` | current-canonical-at-archive | keep-noindex | no | no |
| `css-naming-convention` | current-canonical-at-archive | keep-noindex | yes | no |
| `html-minifier` | current-canonical-at-archive | promote-review | yes | no |
| `random-pin-generator` | current-canonical-at-archive | keep-noindex | yes | no |
| `uuid-comparator` | current-canonical-at-archive | keep-noindex | no | no |
| `token-builder` | current-canonical-at-archive | keep-noindex | no | no |
| `image-scale-calculator` | current-canonical-at-archive | keep-noindex | no | no |
| `http-headers-inspector` | current-canonical-at-archive | keep-noindex | yes | no |
| `headline-analyzer` | current-canonical-at-archive | keep-noindex | no | yes |
| `text-structure-validator` | current-canonical-at-archive | keep-noindex | no | yes |
| `uuid-compare` | current-canonical-at-archive | keep-noindex | no | no |
| `frequency-converter` | current-canonical-at-archive | keep-noindex | no | yes |
| `force-converter` | current-canonical-at-archive | keep-noindex | no | yes |
| `random-color-generator` | current-canonical-at-archive | keep-noindex | no | yes |
| `time-duration-calculator` | current-canonical-at-archive | keep-noindex | yes | no |
| `timestamp-diff-calculator` | current-canonical-at-archive | keep-noindex | yes | no |
| `pixel-density-calculator` | current-canonical-at-archive | keep-noindex | no | no |
| `html-to-plain-text` | current-canonical-at-archive | keep-noindex | no | yes |
| `spelling-checker` | historical-redirect → `grammar-checker` | duplicate | no | yes |
| `text-complexity-analyzer` | current-canonical-at-archive | keep-noindex | no | yes |
| `text-deduplicator` | current-canonical-at-archive | keep-noindex | no | yes |
| `slug-health-checker` | current-canonical-at-archive | keep-noindex | no | yes |
| `text-sentence-shuffler` | current-canonical-at-archive | keep-noindex | no | yes |
| `regex-pattern-builder` | current-canonical-at-archive | keep-noindex | yes | no |
| `css-animation-generator` | current-canonical-at-archive | keep-noindex | yes | no |
| `scientific-notation-converter` | current-canonical-at-archive | keep-noindex | no | yes |
| `css-cursor-generator` | current-canonical-at-archive | keep-noindex | yes | no |
| `http-status-checker` | current-canonical-at-archive | keep-noindex | yes | no |
| `keyword-density-analyzer` | historical-redirect → `keyword-density-checker` | duplicate | no | no |
| `random-choice-picker` | current-canonical-at-archive | keep-noindex | yes | no |
| `list-difference-finder` | current-canonical-at-archive | keep-noindex | no | yes |
| `word-combinations` | historical-redirect → `word-combinations-generator` | duplicate | yes | no |
| `regex-escape` | current-canonical-at-archive | keep-noindex | no | no |
| `what-if-scenario-calculator` | current-canonical-at-archive | keep-noindex | yes | no |
| `word-finder` | current-canonical-at-archive | keep-noindex | no | yes |
| `shell-command-generator` | current-canonical-at-archive | keep-noindex | yes | no |
| `sentence-extractor` | current-canonical-at-archive | keep-noindex | no | yes |
| `json-to-typescript-types` | historical-redirect → `json-to-typescript` | duplicate | yes | no |
| `favicon-png-maker` | historical-redirect → `favicon-generator` | duplicate | no | no |
| `hex-to-decimal-converter` | current-canonical-at-archive | keep-noindex | no | yes |
| `paragraph-generator` | current-canonical-at-archive | keep-noindex | no | yes |
| `random-id-generator` | current-canonical-at-archive | keep-noindex | yes | no |
| `readability-score-calculator` | historical-redirect → `readability-score` | duplicate | no | yes |
| `favicon-icon-generator` | historical-redirect → `favicon-generator` | duplicate | no | no |
| `google-serp-simulator` | current-canonical-at-archive | keep-noindex | no | no |
| `smart-text-sorter` | historical-redirect → `text-line-sorter` | duplicate | no | yes |
| `jwt-token-inspector` | current-canonical-at-archive | keep-noindex | no | no |
| `ipynb-formatter` | current-canonical-at-archive | promote-review | yes | no |

## Focused verification

`npx vitest run lib/indexable-tools.test.ts` compares policy behavior with `git show 5556e22:data/tools.ts` and `git show 5556e22:lib/faq.ts`, independently of current FAQ changes. It checks every baseline slug against current canonical catalog membership, aliases and unknowns, FAQ additions/removals, explicit holds, and reviewed metadata. The expected live count is the baseline membership intersection with the current catalog, never a hardcoded post-consolidation count.

No full suite, build, deployment, or fresh public browser QA was performed in this policy task.
