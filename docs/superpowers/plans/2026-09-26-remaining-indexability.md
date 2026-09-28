# Remaining indexability implementation plan

> Execute inline with the executing-plans skill. User authorized execution, no nested agents, commits, pushes or deployments.

**Goal:** Individually review all 99 currently excluded canonical tools and deliver reproducible decisions, useful copy improvements and functional evidence.

**Architecture:** Derive the cohort from the live catalog and shared indexing policy at `41ec66f`. Keep the 354-entry frozen baseline and eight previous decisions unchanged. Record source, distinct purpose, content findings, actual public QA and the next action separately for each route.

**Tech stack:** Next.js, TypeScript, Vitest, Playwright Chrome/WebKit; Node 22.23.3.

**Spec:** User's remaining indexing review brief; staged protocol in `docs/gsc-candidate-review-2026-09-26.md`.

## Constraints and review focus

- Work only in this worktree and `fix/remaining-indexability-review`; leave favorite/auth/workflow to parent.
- No redirects or catalog deletions without parent's structural review. Duplicate recommendations include target and behavior evidence.
- Functional/browser evidence must test output values, invalid input and downloads where applicable. Heading checks alone cannot qualify a tool.
- A new or changed behavior stays held until parent deploys and public Chrome/WebKit QA passes at desktop and 375px.
- Public HTTPS uses normal TLS. Self-signed acceptance is permitted only for a local HTTPS proxy. Preserve production CSP.
- Network tools need honest live results/errors, never mocked public acceptance. Random generators require shape/range/uniqueness invariants; numbers require independently calculated answers; converters require exact round trips or bytes.
- Never infer eligibility from FAQ presence, line count, old QA or source presence.

## Task 1: Current inventory and traceability

- [ ] Evaluate `data/tools.ts` and `lib/indexable-tools.ts` through an esbuild bundle. Assert 444/345/99 and exactly 99 unique excluded canonical slugs.
- [ ] Map each route to the first active dispatch in `app/tools/[slug]/ToolUI.tsx`, including shared wrappers and helpers.
- [ ] Create `docs/gsc-remaining-review-2026-09-26.json` and readable companion with source paths, content review, decision, evidence and exact next action.
- [ ] Compare helper inventory when available; never mutate historical `docs/gsc-indexability-inventory-2026-09-26.json`.

## Task 2: Review and exercise families

Execute sequentially. For each route read component logic and current content, identify a distinct purpose or exact redundancy, then exercise valid and invalid cases on the public route. Save cases and public outcomes per slug.

1. Numbers/units/time/image geometry: independent arithmetic, negative/empty/non-finite inputs and output units.
2. Encoders/hashes/UUID/random: known vectors, Unicode, malformed input, output formats and boundaries.
3. JSON/regex/developer/network: structural preservation, escaping, invalid syntax, live request success/error semantics.
4. Text/language/search references: counted tokens, matching/extraction, corpus limits, deterministic examples and unsupported claims.
5. CSS/color/image/export: generated CSS values, color conversion values, output pixels/file signatures and unsafe/invalid uploads.
6. SEO previews/document templates/miscellaneous: actual meta/template values, escaping, stated scope, offline/reference limits and download bytes.

- [ ] Persist purpose-specific Playwright cases in `e2e/remaining-indexability.spec.ts` with a separate public config.
- [ ] Run sequential Chrome/WebKit projects at 1440px and 375px; assert populated overflow and canonical/noindex for the held cohort.
- [ ] For each failure distinguish a test locator/hydration issue from a product defect before changing code. Preserve failed evidence.

## Task 3: Bounded repairs and copy

- [ ] For bounded bugs use systematic-debugging and TDD: reproduce, add failing regression, minimal fix, rerun regression.
- [ ] Add source-grounded descriptions, worked examples and limitations through `data/reviewed-tool-content.ts` or a dedicated reviewed-content module. Use humanizer voice; no invented capability.
- [ ] Content edits do not grant eligibility. Record any behavior repair as `fixed-awaitpublic`; keep policy held for parent staging.

## Task 4: Verification and handoff

- [ ] Run relevant units then full units with one worker, standalone TypeScript and production build under Node 22.23.3. Escalate the build once if sandbox execution stalls; do not repeatedly retry.
- [ ] Restore any generated `next-env.d.ts` / `data/short-links.json` changes to HEAD without touching other edits.
- [ ] Validate exact cohort equality, each row's evidence and decision, unchanged frozen baseline/eight decisions, and `git diff --check`.
- [ ] Write `/tmp/tb-remaining-result.md` with exact promotable/hold/duplicate/fixed-awaitpublic counts, commands/results, deployment gates and remaining concerns. Parent owns full E2E coordination, independent review, git/PR/deploy/GSC.

## Execution record

- Initial source extraction: 444 canonical rows, 99 outside frozen legacy and reviewed decisions; HEAD `41ec66f`, clean branch.
- `npm ci --prefer-offline --no-audit --no-fund`: passed, 469 packages installed with matching Node.
- Requested `ai-seo-geo-aeo` skill was not found in installed skill roots or workspace. This task uses source/functional evidence and existing staged policy; it does not make new search-engine policy claims.
