# GSC recovery follow-up, 2026-09-26

Baseline: main `5556e22`. All five workstreams are authorized. Implementation and integrated local validation are complete. Independent review findings are fixed and verified. Merge, deployment, production verification, and the first Actions execution remain release steps.

## Workstreams

- [x] Duplicates: audit 25 families and 65 routes; consolidate 29 verified aliases into canonical destinations and cover nine historical category paths.
- [x] Indexing policy: preserve baseline eligibility explicitly, keep unreviewed tools gated, and document the current inventory without automatic promotions.
- [x] Twelve priority tools: implement curated content and focused behavior repairs. Integrated browser acceptance is tracked below.
- [x] Links: add priority discovery links and seven published tutorial mappings to canonical routes. Integrated HTTP acceptance is tracked below.
- [x] Tracking: implement the fixed cohort, read-only collector, comparisons, weekly workflow, and operator documentation.

## Measurement baseline

The credential was explicitly approved and securely configured as a GitHub repository secret. No credential value belongs in source, reports, or logs.

The local Node 26.8.2 measurement baseline was verified on September 26, 2026 in `/tmp/tb-gsc-recovery-baseline/report.json`: all 24 measurements completed. All twelve URLs were not indexed; eleven were crawled but currently not indexed, and Image Resizer had an unknown Google canonical. September 17–23 had no reported impressions. This establishes a baseline, not recovery.

The workflow uses Node 24 and runs Monday at 03:00 UTC or manually. Its first Actions execution remains pending merge.

## Integrated local validation

- [x] Tracker: 14 Node tests passed with synthetic credentials and injected transport/time.
- [x] Full Vitest suite after integration fixes: `npx vitest run --maxWorkers=1 > /tmp/tb-recovery-default-vitest.log 2>&1` passed with exit code 0 (69 files, 862 tests), without a timeout override.
- [x] Standalone TypeScript check and production build completed with exit code 0; 1,553 pages generated.
- [x] Production-server HTTP acceptance: 46 flat aliases and nine category aliases, policy-aware metadata, 337 canonical tool sitemap URLs, discovery links and unknown-blog 404.
- [x] Browser acceptance: 68 Playwright tests passed, including focused regressions and populated examples at 1440px/375px; eight existing functional fixtures also passed in isolated Chrome. Together these cover all twelve priority tools.
- [x] Final diff whitespace check passed; evidence saved in `/tmp/tb-recovery-validation-result.md` and `/tmp/tb-recovery-final-*.log`.

## Release pending

- [x] Final independent review: findings fixed and verified.
- [ ] Merge.
- [ ] Deploy and verify production responses and tool behavior.
- [ ] Run the merged Actions workflow and retain its artifact before the 90-day retention expires.
- [ ] Compare subsequent measurements with the fixed baseline; never infer indexing from local tests or successful collection alone.
