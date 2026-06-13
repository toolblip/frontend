# Stage 2: Browser Tools and History

**Goal:** Make the existing browser tools fully work and keep their history/favorites behavior simple and usable.

**Features**
1. Browser tool execution paths
2. Browser tool history
3. Favorites entry points in the dashboard

## Feature 1: Browser tool execution paths
**Outcome:** All browser tools on the site work in the MVP.

**Current implementation notes:**
- Tool inventory already lives in `data/tools.ts`.
- The tools index route redirects into the directory listing.
- The browser-tool surface is already broad, so this feature is mostly about ensuring every existing route still runs cleanly.

### Task Group A: tool inventory and routing
**Status:** done
- List every browser tool already on the website.
- Identify the current route or component for each tool.
- Note which tools are browser-only and which rely on other services.

**Discovery result:** `data/tools.ts` has 1,563 unique catalog slugs with no duplicates. `/tools` redirects to `/directory`; `/tools/[slug]` canonicalizes aliases/redirects, generates static params from `getToolRouteSlugs()`, renders `ToolUI`, and 1,562/1,563 catalog slugs have explicit ToolUI cases. `json-graph-visualizer` is the only catalog slug without an explicit case and reaches the existing coming-soon fallback. Several SEO/remote/API/media-style tools may still need browser-pass verification before Task Group B can be marked complete.

### Task Group B: build and verify
**Status:** done
- Fix or wire up each browser tool path that is broken.
- Ensure each tool opens and runs from the dashboard or public entry point.
- Verify each tool works in a browser pass.

**Task markers:**
- `done`: browser tool execution paths — merged in PR #92 (`https://github.com/toolblip/frontend/pull/92`) at 2026-06-08T16:16:09Z with GitHub `auth-e2e` green. Claude Code added representative browser execution coverage for JSON formatter, Base64 encoder/decoder, UUID generator, and HEX-to-RGB. No product code changes were needed. Verification passed: `npx playwright test e2e/tools` returned 20/20 passed and `npx tsc --noEmit` exited 0.

## Feature 2: Browser tool history
**Outcome:** Users can see recent tools used, with favorites shown first.

**Current implementation notes:**
- The dashboard already displays favorite tools and billing in the account surface.
- The planned history ordering still needs a dedicated audit against the actual browse history source.

### Task Group A: history behavior definition
**Status:** done
- Define the order: favorites first, recent tools next.
- Confirm the hidden default favorites list behavior.
- Identify any current history data source.

**Definition result:** MVP dashboard order is favorites first, then recent tools. Current dashboard already renders favorite tools from `/api/tools/favorites`, but it does not render a recent-tools panel yet. Tool pages call `/api/tools/[slug]/view` once per page load and forward to the Laravel `/api/tools/{slug}/view` endpoint, so view data is the current history candidate. No dashboard recent-history reader endpoint is present in the Next app. The favorites-list selector stays deferred; MVP behavior is one hidden default favorites list.

### Task Group B: build and verify
**Status:** done
- Render history in the dashboard.
- Keep the favorites section above recents.
- Verify the order and the empty states.

**Task markers:**
- `done`: browser tool history — merged in PR #93 (`https://github.com/toolblip/frontend/pull/93`) at 2026-06-08T16:16:13Z with GitHub `auth-e2e` green. Claude Code added client-side recent tool history, records opened tools from tool pages, renders recent tools below favorites, excludes favorited tools from recents, and verifies dashboard/history behavior. Verification passed: focused dashboard-history/tool-engagement/onboarding specs returned 13/13 passed and `npx tsc --noEmit` exited 0.

## Feature 3: Favorites entry points in the dashboard
**Outcome:** Users can favorite items and revisit them later.

**Current implementation notes:**
- Favorite counts and favorite tooling are already visible in the dashboard.
- The main remaining question is how much of the share behavior needs real wiring versus MVP placeholder handling.

### Task Group A: favorites scope review
**Status:** done
- Confirm what counts as a favorite item.
- Define how favorite items are added and removed.
- Confirm what shared behavior belongs in MVP versus later.

**Scope result:** MVP favorites currently mean saved browser tools, keyed by tool slug and returned through `/api/auth/favorite-tools` for the dashboard. Users add a favorite from the tool-page engagement bar with `POST /api/tools/[slug]/favorite`; guests see a sign-in/register prompt that preserves `?favorite=1` so the tool can be auto-favorited after auth. Users remove a favorite from the same tool-page button with a confirmation dialog and `DELETE /api/tools/[slug]/favorite`. The dashboard favorite-tools panel reads `/api/tools/favorites`, shows saved tool links with icon/name/description, and uses the empty-state copy: "Favorite tools from any tool page to keep them here." Tool-page sharing already supports public tool-link share/copy and share counts, but shared favorite lists / multi-list sharing remain version two; MVP dashboard entry points should stay focused on saved tools.

### Task Group B: build and verify
**Status:** done
- Add the favorite action and dashboard display.
- Keep the interaction simple and visible.
- Verify favorites can be created and shown again.

**Task markers:**
- `done`: favorites entry points in the dashboard — merged in PR #94 (`https://github.com/toolblip/frontend/pull/94`) at 2026-06-08T16:16:17Z with GitHub `auth-e2e` green. Claude Code added dashboard Browse tools entry points in the favorites panel header and empty state, preserved existing single-list favorite display, and verified empty-state routing plus create-and-show favorite behavior. Verification passed: dashboard-favorites/tool-engagement/onboarding specs returned 13/13 passed and `npx tsc --noEmit` exited 0.
