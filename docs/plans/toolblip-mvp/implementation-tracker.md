# Toolblip MVP Implementation Tracker

## Work order

### Phase 1: Independent discovery and scope checks
1. Stage 1 / Feature 1 / Task Group A — dashboard shell and navigation
2. Stage 1 / Feature 2 / Task Group A — pricing flow review
3. Stage 1 / Feature 3 / Task Group A — identify unsupported tools
4. Stage 1 / Feature 4 / Task Group A — SEO audit
5. Stage 2 / Feature 1 / Task Group A — tool inventory and routing
6. Stage 2 / Feature 2 / Task Group A — history behavior definition
7. Stage 2 / Feature 3 / Task Group A — favorites scope review
8. Stage 3 / Feature 1 / Task Group A — favorite behavior definition
9. Stage 3 / Feature 2 / Task Group A — share scope review
10. Stage 3 / Feature 3 / Task Group A — list behavior review
11. Stage 4 / Feature 1 / Task Group A — plan behavior definition
12. Stage 4 / Feature 2 / Task Group A — cancel flow review
13. Stage 4 / Feature 3 / Task Group A — context scope review
14. Stage 4 / Feature 4 / Task Group A — billing state review
15. Stage 5 / Feature 1 / Task Group A — admin surface review
16. Stage 5 / Feature 2 / Task Group A — action scope review
17. Stage 5 / Feature 3 / Task Group A — support scope review

### Phase 2: Build and verify in dependency order
18. Stage 1 / Feature 1 / Task Group B — dashboard shell and navigation
19. Stage 1 / Feature 2 / Task Group B — pricing plan selection and checkout entry
20. Stage 1 / Feature 3 / Task Group B — browser-only fallback messaging
21. Stage 1 / Feature 4 / Task Group B — bare-minimum SEO for launch pages
22. Stage 2 / Feature 1 / Task Group B — browser tool execution paths
23. Stage 2 / Feature 2 / Task Group B — browser tool history
24. Stage 2 / Feature 3 / Task Group B — favorites entry points in the dashboard
25. Stage 3 / Feature 1 / Task Group B — favorite item saving
26. Stage 3 / Feature 2 / Task Group B — share flow for favorite items
27. Stage 3 / Feature 3 / Task Group B — single default favorites list behavior
28. Stage 4 / Feature 1 / Task Group B — plan selection and plan change behavior
29. Stage 4 / Feature 2 / Task Group B — cancellation flow
30. Stage 4 / Feature 3 / Task Group B — lightweight saved context for paid users
31. Stage 4 / Feature 4 / Task Group B — billing status display
32. Stage 5 / Feature 1 / Task Group B — admin user list and lookup
33. Stage 5 / Feature 2 / Task Group B — admin plan actions
34. Stage 5 / Feature 3 / Task Group B — basic support actions

## Task state markers

Use these markers to keep the board lean and easy to scan:
- `todo` — not started yet
- `working` — actively being worked on now
- `blocked` — waiting on a dependency or decision
- `done` — finished and verified
- `needs attention` — stuck, needs Harun to review, or cannot move without a decision
- `lean` — intentionally trimmed or deferred because it is not worth the MVP cost

## Current lean board

- todo: all work-order items not started yet
- working: none
- blocked: none
- todo: Stage 1 / Feature 2 / Task Group B — pricing plan selection and checkout entry implementation is ready to start now that the canonical launcher is repaired.
- done: Stage 1 / Feature 1 / Task Group A — dashboard shell and navigation; Stage 1 / Feature 1 / Task Group B — dashboard shell and navigation verification via merged PR #88; Stage 1 / Feature 2 / Task Group A — pricing flow review; Stage 1 / Feature 3 / Task Group A — identify unsupported tools; Stage 1 / Feature 4 / Task Group A — SEO audit; Stage 2 / Feature 1 / Task Group A — tool inventory and routing; Stage 2 / Feature 2 / Task Group A — history behavior definition; Stage 2 / Feature 3 / Task Group A — favorites scope review; Stage 3 / Feature 1 / Task Group A — favorite behavior definition; Stage 3 / Feature 2 / Task Group A — share scope review; Stage 3 / Feature 3 / Task Group A — list behavior review; Stage 4 / Feature 1 / Task Group A — plan behavior definition; Stage 4 / Feature 2 / Task Group A — cancel flow review; Stage 4 / Feature 3 / Task Group A — context scope review; Stage 4 / Feature 4 / Task Group A — billing state review; Stage 5 / Feature 1 / Task Group A — admin surface review; Stage 5 / Feature 2 / Task Group A — action scope review; Stage 5 / Feature 3 / Task Group A — support scope review
- lean: none yet

## Top impediments

Keep the 10 most important blockers here so the morning report can stay short.

- Toolblip repo root `./claude.sh` is now present and executable, so Task Group B coding can proceed.

## Working log

Keep a short, chronological record of what the supervisor and worker validated.

- 2026-06-08 10:01 Dhaka — repaired the repo-local `./claude.sh` launcher and verified `./claude.sh st` reports a runnable daemon. Task Group B coding can now proceed from the canonical Toolblip launcher.
- 2026-06-07 06:09 Dhaka — completed Stage 5 / Feature 3 / Task Group A support scope review. Confirmed MVP basic support should stay inside the admin user-management surface: view user verification/profile/subscription/favorites-support context, record internal support notes/reasons, trigger safe backend-backed support actions such as verification resend or billing/support context, and preserve audit details. Explicitly out of scope for MVP: separate ticket queues/helpdesk, live chat, impersonation, manual password setting, broad content moderation, and tool-specific support workflows. Verification passed: `npm run test:e2e -- e2e/auth/onboarding.spec.ts e2e/pricing.spec.ts` returned 7/7 passed. Rechecked repo root launcher: `./claude.sh` is still missing, so implementation/coding Task Group B work remains blocked until Harun provides or repairs the canonical launcher.
- 2026-06-07 05:47 Dhaka — completed Stage 5 / Feature 2 / Task Group A action scope review and moved on to Stage 5 / Feature 3 / Task Group A support scope review. Confirmed admin plan actions should be limited to upgrade, downgrade, and cancel; there is currently no admin route, admin API, or admin-only plan mutation endpoint. Existing plan surfaces are user checkout through `/api/subscription/checkout`, subscription status through `/api/subscription`, and user self-service billing through the Laravel billing portal at `${API_BASE}/api/subscription/portal`. Task Group B should add admin-only controls with a confirmation step naming target user, current plan, action, target plan when applicable, and effective timing. Minimum audit trail: admin id/email, target user id/email, action type, previous and new plan/status, reason/support note, timestamp, and upstream billing/reference id if available. Verification passed: `npm run test:e2e -- e2e/auth/onboarding.spec.ts e2e/pricing.spec.ts` returned 7/7 passed. Rechecked repo root launcher: `./claude.sh` is still missing or not executable, so implementation/coding Task Group B work remains blocked until Harun provides or repairs the launcher.
- 2026-06-07 05:31 Dhaka — completed Stage 5 / Feature 1 / Task Group A admin surface review and moved on to Stage 5 / Feature 2 / Task Group A action scope review. Confirmed there is no current `/admin` route or local admin API; the app only exposes the authenticated dashboard plus auth/profile/subscription/favorites proxy routes. Defined MVP admin lookup as a new dedicated admin-only route gated by an explicit Laravel-authenticated role/flag, with unauthenticated and access-denied states. Minimum user lookup fields should include user id, name, email, email verification state, current plan/tier, subscription status, plan end date, created date if available, and enough detail to open a user record. Verification passed: `npm run test:e2e -- e2e/auth/onboarding.spec.ts e2e/pricing.spec.ts` returned 7/7 passed. Rechecked repo root launcher: `./claude.sh` is still missing or not executable, so implementation/coding Task Group B work remains blocked until Harun provides or repairs the launcher.
- 2026-06-07 05:12 Dhaka — completed Stage 4 / Feature 4 / Task Group A billing state review and moved on to Stage 5 / Feature 1 / Task Group A admin surface review. Confirmed dashboard billing status is sourced through `/api/subscription`, which proxies Laravel `/api/subscription` using `auth_token`; the dashboard stores the result in `subscription` and currently renders plan/free/active labels, renewal or active-until dates from `plan_ends_at`, storage/file/seat chips, and billing portal actions. The shared subscription type also carries `subscription_status`, API access, and priority support, but unknown/error handling is effectively the `subscription === null` loading state because fetch errors are ignored. Task Group B should explicitly verify free, paid-active, scheduled-cancel/active-until, and API-error/unknown display states. Verification passed: `npm run test:e2e -- e2e/auth/onboarding.spec.ts e2e/pricing.spec.ts` returned 7/7 passed. Rechecked repo root launcher: `./claude.sh` is still missing or not executable, so no coding/implementation Task Group B work can start.
- 2026-06-07 04:54 Dhaka — completed Stage 4 / Feature 3 / Task Group A context scope review and moved on to Stage 4 / Feature 4 / Task Group A billing state review. Confirmed current saved-context persistence is local-only and scattered: `tb_settings` saves theme/density/font in `components/ThemeProvider.tsx`, onboarding intent uses per-user `toolblip_onboarding_<userId>`, and tool inputs/settings are mostly component `useState` without reload persistence. Defined MVP saved context as paid-gated, explicit user-controlled per-tool defaults/last-used settings/resume state; out of scope: heavier AI memory/recommendations, full history archives, cross-tool recommendations, and automatic capture of secrets or file contents. Rechecked repo root launcher: `./claude.sh` is still missing or not executable, so no coding/implementation Task Group B work can start.
- 2026-06-07 04:36 Dhaka — completed Stage 4 / Feature 2 / Task Group A cancel flow review and moved on to Stage 4 / Feature 3 / Task Group A context scope review. Confirmed cancellation currently belongs to active paid users through the dashboard subscription card: `Manage Billing` and `Downgrade to Free` both call `${API_BASE}/api/subscription/portal`; pricing copy promises cancel-anytime with access through the billing period; the dashboard already reads `plan_ends_at` and displays `Renews on <date>` for active status or `Active until <date>` for non-active status. Found no separate local cancel endpoint or Next.js `/api/subscription/portal` proxy, so Task Group B should make cancellation explicit through the billing portal or a new backend route, preserve paid access until `plan_ends_at`, and verify the scheduled-cancel UI state. Verification passed: `npm run test:e2e -- e2e/auth/onboarding.spec.ts e2e/pricing.spec.ts` returned 7/7 passed. Rechecked repo root launcher: `./claude.sh` is still missing or not executable, so no coding/implementation Task Group B work can start.
- 2026-06-07 04:12 Dhaka — completed Stage 4 / Feature 1 / Task Group A plan behavior definition and moved on to Stage 4 / Feature 2 / Task Group A cancel flow review. Confirmed plan mapping from the live app: Free, Starter, Pro (`ultra` tier), and Max load from `/api/plans` with frontend fallback data; pricing CTAs preserve `/dashboard?plan=<tier>&billing=<cycle>` through login/signup; dashboard onboarding starts checkout through `/api/subscription/checkout` for paid tiers and completes Free locally; dashboard billing reads `/api/subscription` and uses billing-portal actions for active paid users, including `Manage Billing` and `Downgrade to Free`. Verification passed: `npm run test:e2e -- e2e/auth/onboarding.spec.ts e2e/pricing.spec.ts` returned 7/7 passed. Rechecked repo root launcher: `./claude.sh` is still missing or not executable, so no coding/implementation Task Group B work can start.
- 2026-06-07 03:55 Dhaka — completed Stage 3 / Feature 3 / Task Group A list behavior review, cleared the pending graceful restart at the task boundary, and moved on to Stage 4 / Feature 1 / Task Group A plan behavior definition. Confirmed MVP favorites remain one hidden default list: the dashboard reads one flat `/api/tools/favorites` collection, proxies Laravel `/api/auth/favorite-tools`, renders a single `Favorite tools` panel, and links each saved tool directly to `/tools/[slug]`. Found no current list picker, list-management UI, collection/folder model, or shared favorites-list object. Rechecked repo root launcher: `./claude.sh` is still missing or not executable, so no coding/implementation Task Group B work can start.
- 2026-06-07 03:37 Dhaka — completed Stage 3 / Feature 2 / Task Group A share scope review and moved on to Stage 3 / Feature 3 / Task Group A list behavior review. Confirmed MVP sharing is link-based: favorite items share their public canonical tool URL at `/tools/[slug]`, not an in-app shared favorites-list object. Current tool pages already render `ShareButtons` with copy-link plus Twitter/X and LinkedIn share URLs. Dashboard favorite cards currently link to the tool page only; Task Group B should add a simple share action from saved favorite items that copies or opens the same public URL and verifies the shared URL opens the correct tool. Rechecked repo root launcher: `./claude.sh` is still missing, so no coding/implementation Task Group B work can start.
- 2026-06-07 03:19 Dhaka — completed Stage 3 / Feature 1 / Task Group A favorite behavior definition and moved on to Stage 3 / Feature 2 / Task Group A share scope review. Confirmed favorite item model is a saved browser tool keyed by slug; tool pages add via `POST /api/tools/[slug]/favorite`, remove via `DELETE /api/tools/[slug]/favorite` after an unfavorite confirmation dialog, and preserve guest favorite intent through login/signup with `?favorite=1`. Dashboard reads `/api/tools/favorites` and renders saved tool cards with empty state: "Favorite tools from any tool page to keep them here." Rechecked repo root launcher: `./claude.sh` is still missing, so no coding/implementation Task Group B work can start.
- 2026-06-07 02:58 Dhaka — completed Stage 2 / Feature 3 / Task Group A favorites scope review and moved on to Stage 3 / Feature 1 / Task Group A favorite behavior definition. Confirmed MVP favorites are saved browser tools keyed by slug; tool pages add favorites through `POST /api/tools/[slug]/favorite`, remove them through `DELETE /api/tools/[slug]/favorite` after a confirmation dialog, and preserve guest favorite intent with `?favorite=1` through login/signup. The dashboard reads `/api/tools/favorites` / Laravel `/api/auth/favorite-tools` and shows saved tool links with the current empty state: "Favorite tools from any tool page to keep them here." Tool-page public share/copy is already present, while shared favorite lists remain version two.
- 2026-06-07 02:39 Dhaka — completed Stage 2 / Feature 2 / Task Group A history behavior definition and moved on to Stage 2 / Feature 3 / Task Group A favorites scope review. Defined MVP dashboard order as favorite tools first, then recent tools; confirmed current dashboard only renders favorite tools from `/api/tools/favorites` and has no recent-tools panel yet; confirmed tool pages record views through `/api/tools/[slug]/view`, but the dashboard has no current recent-history reader endpoint. Hidden default favorites-list behavior remains single-list/no selector for MVP.
- 2026-06-07 02:39 Dhaka — completed Stage 2 / Feature 1 / Task Group A tool inventory and routing and moved on to Stage 2 / Feature 2 / Task Group A history behavior definition. Verified `data/tools.ts` contains 1,563 unique catalog slugs with no duplicates; `/tools` redirects to `/directory`; `/tools/[slug]` canonicalizes aliases/redirects, generates static params from `getToolRouteSlugs()`, renders `ToolUI`, and 1,562/1,563 catalog slugs have explicit ToolUI cases. The only catalog slug without an explicit case is `json-graph-visualizer`, which falls through to the existing coming-soon fallback. Found no `./claude.sh` launcher in the repo root, so implementation/coding work must stop and notify Harun before any Task Group B coding.
- 2026-06-07 02:22 Dhaka — completed Stage 1 / Feature 4 / Task Group A SEO audit and moved on to Stage 2 / Feature 1 / Task Group A tool inventory and routing. Confirmed homepage, pricing, dashboard layout, dynamic tool pages, SEO hub, comparison hub, and blog routes have baseline title/description/social metadata; identified missing canonical/noindex decisions for pricing, dashboard, tools/directory, login/signup, and submit-tool follow-up.
- 2026-06-07 02:04 Dhaka — completed unsupported-tool discovery and moved on to Stage 1 / Feature 4 / Task Group A SEO audit. Verified `data/tools.ts` has 1,563 unique catalog slugs; `app/tools/[slug]/ToolUI.tsx` has explicit cases for every catalog slug except `json-graph-visualizer`, which reaches the default `ComingSoonUI`. Recorded MVP fallback rules for server/API/remote-inspection/AI/heavy-media tools.
- 2026-06-06 15:34 Dhaka — completed the pricing flow review and moved on to unsupported tools discovery. Verified the onboarding BDD regression passes 6/6 and confirmed pricing cards, free-plan redirect, paid-plan redirect, and dashboard onboarding handoff all preserve the selected plan and billing state.
- 2026-06-06 15:28 Dhaka — completed the dashboard link surface inventory and moved on to the pricing flow review. Confirmed dashboard entry points exist from the authenticated navbar dropdown, the v2 desktop/mobile nav, the login/signup next-paths, the pricing free/paid plan CTAs, the account redirect, and verify-email success.
- 2026-06-06 15:20 Dhaka — moved one Stage 1 / Feature 1 / Group A task forward: dashboard minimum state check is done. Confirmed the dashboard has auth-preserving login redirect, terms/onboarding handling, plan-selection/no-plan fallback, profile settings, email verification prompt, favorites panel, subscription/billing panel, and back-to-home escape route.
- 2026-06-06 15:18 Dhaka — moved one Stage 1 / Feature 1 / Group A task forward: dashboard route/layout discovery is done. Confirmed `/dashboard`, `/account` redirect, dashboard metadata layout, client dashboard page, top nav dashboard links, account-menu link, login/signup default return paths, and pricing `?plan=` onboarding entry.
- 2026-06-06 15:11 Dhaka — confirmed dashboard onboarding routes straight to checkout for paid plans.
- 2026-06-06 15:11 Dhaka — confirmed onboarding without a selected plan reopens at pricing.
- 2026-06-06 15:11 Dhaka — added live context refresh rule for Supervisor T and cron jobs.
- 2026-06-06 15:11 Dhaka — created `docs/plans/toolblip-mvp/runtime/supervisor-t.json` as the live heartbeat/state file.
- 2026-06-06 15:19 Dhaka — worker message contract clarified: start = "currently working on this task", done = "Once task is done it works.", blocked = "This task is now moved to blockers for this reason: <reason>".

## Discovery notes
- Dashboard onboarding already exists and can surface the plan-selection flow.
- Pricing pages already have metadata and checkout entry points.
- The tool UI already has a coming-soon fallback for unsupported tools.
- SEO metadata already exists on key public launch pages, so remaining work is likely refinement rather than a blank start.
- The tools inventory already lives in `data/tools.ts`, so browser-tool coverage is an audit/cleanup problem rather than a fresh inventory build.
- Favorites and billing are already visible in the dashboard, but history ordering and sharing need a closer audit.

## Manual confirmation log

Use this section to mark items after you manually verify them.

- [ ] Stage 1 / Feature 1 complete
- [ ] Stage 1 / Feature 2 complete
- [ ] Stage 1 / Feature 3 complete
- [ ] Stage 1 / Feature 4 complete
- [ ] Stage 2 / Feature 1 complete
- [ ] Stage 2 / Feature 2 complete
- [ ] Stage 2 / Feature 3 complete
- [ ] Stage 3 / Feature 1 complete
- [ ] Stage 3 / Feature 2 complete
- [ ] Stage 3 / Feature 3 complete
- [ ] Stage 4 / Feature 1 complete
- [ ] Stage 4 / Feature 2 complete
- [ ] Stage 4 / Feature 3 complete
- [ ] Stage 4 / Feature 4 complete
- [ ] Stage 5 / Feature 1 complete
- [ ] Stage 5 / Feature 2 complete
- [ ] Stage 5 / Feature 3 complete

## Lean / de-scoped items

Use this section when a task is intentionally pushed down or removed from the MVP.

- none yet

## Notes
- Independent discovery work comes first.
- Dependent implementation and verification work comes after the independent checks.
- User confirmation is required when a task or feature is ready to be marked done.
- Move items between todo, working, blocked, done, and lean instead of duplicating them.
- If a task is stuck, move it to needs attention and explain the blocker in the top impediments list.
- Supervisor T now runs every 15 minutes, health-checks every 15 minutes, and a graceful restart every 6 hours.
- Each Supervisor T run should re-read the live planning files and use the current board state, not cached assumptions.
