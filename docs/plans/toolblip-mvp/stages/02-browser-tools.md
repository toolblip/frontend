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
- List every browser tool already on the website.
- Identify the current route or component for each tool.
- Note which tools are browser-only and which rely on other services.

### Task Group B: build and verify
- Fix or wire up each browser tool path that is broken.
- Ensure each tool opens and runs from the dashboard or public entry point.
- Verify each tool works in a browser pass.

## Feature 2: Browser tool history
**Outcome:** Users can see recent tools used, with favorites shown first.

**Current implementation notes:**
- The dashboard already displays favorite tools and billing in the account surface.
- The planned history ordering still needs a dedicated audit against the actual browse history source.

### Task Group A: history behavior definition
- Define the order: favorites first, recent tools next.
- Confirm the hidden default favorites list behavior.
- Identify any current history data source.

### Task Group B: build and verify
- Render history in the dashboard.
- Keep the favorites section above recents.
- Verify the order and the empty states.

## Feature 3: Favorites entry points in the dashboard
**Outcome:** Users can favorite items and revisit them later.

**Current implementation notes:**
- Favorite counts and favorite tooling are already visible in the dashboard.
- The main remaining question is how much of the share behavior needs real wiring versus MVP placeholder handling.

### Task Group A: favorites scope review
- Confirm what counts as a favorite item.
- Define how favorite items are added and removed.
- Confirm what shared behavior belongs in MVP versus later.

### Task Group B: build and verify
- Add the favorite action and dashboard display.
- Keep the interaction simple and visible.
- Verify favorites can be created and shown again.
