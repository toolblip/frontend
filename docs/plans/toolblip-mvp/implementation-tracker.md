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
- working: Stage 1 / Feature 1 / Task Group A — dashboard shell and navigation
- blocked: none
- needs attention: none
- done: none
- lean: none yet

## Top impediments

Keep the 10 most important blockers here so the morning report can stay short.

- none yet

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
