# Stage 3: Favorites and Sharing

**Goal:** Let people save favorite items and share what they have saved, without adding complex multi-list UX yet.

**Features**
1. Favorite item saving
2. Share flow for favorite items
3. Single default favorites list behavior

## Feature 1: Favorite item saving
**Outcome:** A user can create and revisit favorite items.

### Task Group A: favorite behavior definition
**Status:** done
- Confirm the exact favorite item model.
- Confirm add/remove behavior.
- Decide the empty-state copy.

**Definition confirmed 2026-06-07:** MVP favorites are saved browser tools keyed by tool slug. Authenticated users add via `POST /api/tools/[slug]/favorite` and remove via `DELETE /api/tools/[slug]/favorite` after an unfavorite confirmation dialog. Guest favorite intent is preserved through login/signup with `?favorite=1`. The dashboard reads `/api/tools/favorites` and shows saved tools; empty-state copy is: "Favorite tools from any tool page to keep them here."

### Task Group B: build and verify
**Status:** done
- Implement the favorite toggle.
- Show favorites in the dashboard.
- Verify a favorite can be added and removed.

**Task markers:**
- `done`: favorite item saving — merged in PR #95 (`https://github.com/toolblip/frontend/pull/95`) at 2026-06-08T16:16:21Z with GitHub `auth-e2e` green. Claude Code verified signed-in favorite persistence across reload and the single hidden default list, added `e2e/tools/favorite-saving.spec.ts`, and ran focused Playwright coverage plus typecheck.

## Feature 2: Share flow for favorite items
**Outcome:** A user can share favorite items in the MVP.

### Task Group A: share scope review
**Status:** done
- Define the share target and share format.
- Confirm what can be shared in MVP.
- Confirm whether sharing is link-based or in-app.

**Definition confirmed 2026-06-07:** MVP sharing is link-based and shares the public canonical tool URL, not an in-app shared favorites-list object. Favorite items are saved browser tools, so the share target is `/tools/[slug]` with existing metadata and canonical URL behavior. Current tool pages already render `ShareButtons`, which supports copy-link plus Twitter/X and LinkedIn share URLs. Dashboard favorite cards currently link back to the tool page only; Task Group B should add a simple share action from saved favorite items that copies or opens the same public tool URL and verifies the shared URL opens the correct tool.

### Task Group B: build and verify
**Status:** done
- Add the share action for favorite items.
- Keep the share experience simple.
- Verify the shared item opens correctly.

**Task markers:**
- `done`: share flow for favorite items — merged in PR #96 (`https://github.com/toolblip/frontend/pull/96`) at 2026-06-08T16:18:51Z. Claude Code added a dashboard favorite-card `Copy link` action for the public canonical `/tools/[slug]` URL, kept sharing link-based with no shared-list object, added `e2e/auth/dashboard-favorite-share.spec.ts`, and ran focused Playwright coverage plus typecheck.

## Feature 3: Single default favorites list behavior
**Outcome:** Favorites stay simple with one hidden default list.

### Task Group A: list behavior review
**Status:** done
- Confirm one hidden default favorites list.
- Confirm that multi-list UI is deferred.
- Confirm the later version-two path.

**Definition confirmed 2026-06-07:** MVP favorites remain a single hidden default list. The live dashboard reads one flat favorite-tools collection from `/api/tools/favorites`, which proxies Laravel `/api/auth/favorite-tools`; dashboard cards render under one `Favorite tools` panel and link directly to `/tools/[slug]`. No list picker, list-management UI, collection/folder model, or shared favorites-list object is present in the current app surface. Version two can add named lists or shared collections later, but Task Group B should preserve the single-list/no-selector MVP behavior while adding only the simple favorite/share actions already scoped above.

### Task Group B: build and verify
**Status:** done
- Keep the default list hidden.
- Prevent multi-list UI from appearing in MVP.
- Verify the single-list behavior remains stable.

**Task markers:**
- `done`: single default favorites list behavior — merged in PR #97 (`https://github.com/toolblip/frontend/pull/97`) at 2026-06-08T16:19:07Z with GitHub `auth-e2e` green. Claude Code verified the dashboard keeps one hidden flat `Favorite tools` panel with no list picker, create/manage-list UI, or shared-list object, added `e2e/auth/dashboard-favorites-single-list.spec.ts`, and ran focused Playwright coverage plus typecheck.
