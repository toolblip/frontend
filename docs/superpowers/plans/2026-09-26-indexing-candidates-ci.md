# Indexing candidates and CI implementation plan

Goal: review eight excluded tools against actual functionality and public evidence, and repair the 13 known CI failures without weakening their behavioral checks.

Architecture: keep the explicit indexing gate and current component dispatch. Repair concrete defects in their existing modules. Browser assertions follow the current UI while retaining authenticated identity, session, routing, transformation and download checks.

Spec: the approved follow-up supplied on 2026-09-26; candidate inventory in `docs/gsc-indexability-review-2026-09-26.md`.

Execution: native Codex fallback, no agents. Parent owns independent review, commits, deployment and cleanup. No credentials, unrelated refactors, retries or timeout increases.

- [x] Install fresh dependencies and reproduce the CI failures with focused Playwright runs.
- [x] Trace dashboard identity/subscription relocation, named and View recent links, hydration timing, Base64/hex dispatch and share UI. Correct stale assertions while preserving real checks; regress any production repair.
- [x] Add `e2e/indexing-candidates.spec.ts`, runnable against a public base URL with a separate config. Exercise all eight actual UIs, invalid input, clear, copy/download where offered, desktop/mobile, Chrome/WebKit.
- [x] Record public baseline before policy decisions. Check TypeScript identifiers/keys/mixed arrays/null; timezone summer and both DST failures; table quoted CSV and escaping; LDAP octet escaping; Python literal format; CSV multiline download bytes; minifier inline spaces/script/pre/title/textarea; notebook metadata and malformed input.
- [x] Fix concrete candidate defects with failing regression cases first. Improve only accurate descriptions/examples/limits/FAQs using humanizer.
- [x] Record eight distinct-purpose and indexing decisions in a dated review. Only promote complete public/content/functionality passes. Local repairs await parent deployment and public recheck.
- [x] Verify SSR canonical/robots and sitemap against the chosen policy. Preserve GSC/recovery tests.
- [x] Run full E2E after focused passes, full unit tests with one worker, standalone TypeScript, then production build sequentially. Record commands, exit codes and any remaining failures.
- [x] Stop owned servers and write `/tmp/tb-followup-result.md`, with progress in `/tmp/tb-followup-progress.md`.

Acceptance: all 13 original CI cases pass meaningful assertions; all eight have explicit evidence-backed decisions; no unverified promotion; regression and browser evidence demonstrate fixes; final verification and limitations are reported honestly.
