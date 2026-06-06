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
- working: Stage 1 / Feature 3 / Task Group A — identify unsupported tools
- blocked: none
- needs attention: none
- done: none
- lean: none yet

## Top impediments

Keep the 10 most important blockers here so the morning report can stay short.

- none yet

## Working log

Keep a short, chronological record of what the supervisor and worker validated.

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
