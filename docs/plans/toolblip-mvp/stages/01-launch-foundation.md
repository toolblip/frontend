# Stage 1: Launch Foundation

**Goal:** Make the public launch path work end to end: dashboard entry, pricing, and the fallback path for incomplete tools.

**Features**
1. Dashboard shell and navigation
2. Pricing plan selection and checkout entry
3. Browser-only fallback messaging for unsupported tools
4. Bare-minimum SEO for launch pages

## Feature 1: Dashboard shell and navigation
**Outcome:** Users can land in the dashboard, see the basic shell, and move toward pricing or tools.

**Current implementation notes:**
- The dashboard route already exists.
- Dashboard onboarding already handles welcome and pricing steps.
- The dashboard already supports a fallback state when a plan is missing.

### Task Group A: scope and surfaces
**Status:** working
- Identify the existing dashboard route(s) and layout components.
- Confirm the minimum dashboard state needed for launch.
- List the pages that should link into the dashboard.

**Task markers:**
- `done`: dashboard route and layout discovery — `/dashboard` is the live dashboard route, `/account` redirects to it, `app/dashboard/layout.tsx` owns dashboard metadata, and `app/dashboard/page.tsx` owns the client shell/onboarding surface.
- `done`: dashboard minimum state check — the launch-minimum dashboard state is present: auth-preserving login redirect, legal/plan onboarding overlays, free/no-plan fallback back to pricing, profile settings, email verification prompt, favorites count/list/empty state, subscription summary, billing portal entry for paid users, and a back-to-home escape route.
- `done`: dashboard link surface inventory — the dashboard is linked from the authenticated navbar dropdown, the v2 desktop and mobile nav, the login and signup next-paths, pricing plan and free-plan flows, account redirect, and verify-email success.


### Task Group B: build and verify
- Add or update the dashboard shell.
- Make sure the primary navigation is visible and stable.
- Verify the dashboard loads without a selected plan.

## Feature 2: Pricing plan selection and checkout entry
**Outcome:** Users can choose a plan and move into the paid flow without dead ends.

**Current implementation notes:**
- Pricing pages already exist.
- The pricing page already exposes plan cards and metadata.
- Checkout selection already routes through the dashboard onboarding flow.

### Task Group A: pricing flow review
- Review current pricing card content and plan states.
- Map the selected-plan path and the no-plan fallback path.
- Confirm the checkout entry point and post-selection redirect.

**Task markers:**
- `done`: review current pricing card content and plan states — pricing cards already exist with plan states and account status messaging; the free-plan CTA routes to `/signup?next=/dashboard?plan=free`, and paid plans route to `/login?next=/dashboard?plan=...&billing=...` or straight dashboard when authenticated.
- `done`: map the selected-plan path and no-plan fallback path — selected plan and billing are carried into dashboard onboarding via query params, and a completed onboarding record without a plan reopens at pricing step 2.
- `done`: confirm the checkout entry point and post-selection redirect — the onboarding flow and pricing referral both preserve plan and billing from pricing through login/signup into dashboard onboarding; the onboarding BDD regression passes 6/6.

### Task Group B: build and verify
- Wire the pricing selection action to the dashboard flow.
- Ensure plan selection updates the next screen shown after checkout.
- Verify the redirect behavior in browser.

## Feature 3: Browser-only fallback messaging
**Outcome:** Any tool that needs more than browser support shows a clear coming soon state.

**Current implementation notes:**
- The tool UI already includes a coming-soon fallback component.
- The fallback copy is explicit enough to signal the gap without blocking the browser-only path.

### Task Group A: identify unsupported tools
- List which tools are browser-only today and which need backend support.
- Define the coming soon rules for unsupported tools.
- Confirm where the fallback message should appear.

### Task Group B: build and verify
- Add the coming soon state to unsupported tool entry points.
- Keep supported browser tools usable.
- Verify the fallback copy is visible and clear.

## Feature 4: Bare-minimum SEO for launch pages
**Outcome:** Launch pages have the minimal metadata needed to be indexable and understandable.

**Current implementation notes:**
- The homepage, pricing page, and SEO hub already have metadata.
- Remaining SEO work is likely about tightening coverage on any launch-specific routes.

### Task Group A: SEO audit
- Check titles, descriptions, and canonical behavior on launch pages.
- Identify the key public routes that need metadata.
- Confirm any missing metadata pieces.

### Task Group B: build and verify
- Add the minimum metadata needed for launch pages.
- Verify visible previews and route metadata.
- Confirm no launch page is left without basic SEO coverage.
