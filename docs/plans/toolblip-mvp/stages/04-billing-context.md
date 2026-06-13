# Stage 4: Billing, Context, and Plan Controls

**Goal:** Make paid plan handling work cleanly, including upgrade, downgrade, cancel, and lightweight saved context.

**Features**
1. Plan selection and plan change behavior
2. Cancellation flow
3. Lightweight saved context for paid users
4. Billing status display

## Feature 1: Plan selection and plan change behavior
**Outcome:** Users can upgrade or downgrade a plan from the dashboard flow.

### Task Group A: plan behavior definition
**Status:** done
- Map the current free and paid plans.
- Confirm the upgrade and downgrade triggers.
- Confirm the selected-plan path after checkout.

**Discovery summary:** Current plan shape is Free, Starter, Pro (`ultra` tier), and Max. Public pricing loads `/api/plans` with fallback plan data, sends unauthenticated users to login/signup with `/dashboard?plan=<tier>&billing=<cycle>`, and authenticated users into dashboard onboarding. Dashboard onboarding creates checkout sessions for paid plans through `/api/subscription/checkout`, completes Free locally, and shows the active tier from `/api/subscription`. Active paid users currently manage upgrade/downgrade/cancel behavior through the billing portal entry points (`Manage Billing` and `Downgrade to Free`). Verified with `npm run test:e2e -- e2e/auth/onboarding.spec.ts e2e/pricing.spec.ts` on 2026-06-07 04:12 +06: 7/7 passed.

### Task Group B: build and verify
**Status:** done
- Wire upgrade and downgrade actions.
- Keep the plan state visible.
- Verify a plan change updates the UI.

**Task markers:**
- `done`: plan selection and plan change behavior — complete via merged PR #98 (`https://github.com/toolblip/frontend/pull/98`). Claude Code added the paid-dashboard `Upgrade or change plan` link to `/pricing`, preserved visible current-plan state and existing portal actions, added `e2e/auth/dashboard-plan-change.spec.ts`, and verified 11/11 focused Playwright tests passed plus `npx tsc --noEmit` exit 0 and GitHub `auth-e2e` green.

## Feature 2: Cancellation flow
**Outcome:** A user can cancel their plan when they ask.

### Task Group A: cancel flow review
**Status:** done
- Confirm who can cancel a plan.
- Define the cancellation confirmation state.
- Confirm what happens after cancellation.

**Discovery summary:** Active paid users can reach cancellation through the dashboard subscription card. The current UI exposes `Manage Billing` and `Downgrade to Free`, and both call the Laravel billing portal at `${API_BASE}/api/subscription/portal`; there is no separate Next.js proxy route for `/api/subscription/portal` and no local cancel endpoint. Pricing copy says users can cancel anytime and keep access until the end of the billing period. The dashboard is already prepared to show a scheduled-cancellation/ending state through `subscription.plan_ends_at`: when `subscription_status` is not `active`, it labels the plan as `Active until <date>`; otherwise it labels `Renews on <date>`. Task Group B should make the cancel action explicit, keep paid access active until `plan_ends_at`, and verify the cancelled/scheduled-cancel state rather than treating cancellation as an immediate downgrade. Verified current onboarding/pricing regressions on 2026-06-07 04:36 +06 with `npm run test:e2e -- e2e/auth/onboarding.spec.ts e2e/pricing.spec.ts`: 7/7 passed.

### Task Group B: build and verify
**Status:** done
- Add the cancel action.
- Show the cancellation state clearly.
- Verify cancellation completes.

**Task markers:**
- `done`: cancellation flow — merged in PR #99 (`https://github.com/toolblip/frontend/pull/99`) at 2026-06-08T16:19:10Z with GitHub `auth-e2e` green. Claude Code added an explicit dashboard `Cancel plan` action using the billing-portal handler, added period-end access copy and a scheduled-cancellation banner that preserves paid access until `plan_ends_at`, added `e2e/auth/dashboard-cancel-flow.spec.ts`, and verified 9/9 focused Playwright tests passed plus `npx tsc --noEmit` exit 0.

## Feature 3: Lightweight saved context for paid users
**Outcome:** Paid users can keep simple resume defaults and last-used settings.

### Task Group A: context scope review
**Status:** done
- Confirm the small set of data to store.
- Keep the memory user-controlled.
- Confirm what is explicitly out of scope.

**Discovery summary:** MVP saved context should stay lightweight, paid-gated, and user-controlled. The current app has no dedicated saved-context API/model or dashboard saved-context section; existing persistent state is local-only UI/preferences state: `tb_settings` stores theme/density/font in `components/ThemeProvider.tsx`, onboarding intent is kept under per-user `toolblip_onboarding_<userId>`, and individual browser tool inputs/settings are mostly in component `useState` without reload persistence. Task Group B should start with a small schema for per-tool defaults/last-used settings/resume state, avoid storing sensitive generated input/output by default, require an explicit save/clear control, gate cloud persistence to paid users through subscription state, and leave heavier AI memory/recommendations, cross-tool recommendations, full history archives, and automatic secret/file capture out of MVP.

### Task Group B: build and verify
**Status:** done
- Save last-used settings or defaults.
- Restore the saved context on return.
- Verify the saved state survives a reload.

**Task markers:**
- `done`: lightweight saved context for paid users — merged in PR #100 (`https://github.com/toolblip/frontend/pull/100`) at 2026-06-08T16:19:14Z with GitHub `auth-e2e` green. Claude Code added a reusable paid-gated saved-context mechanism demonstrated on JSON Formatter, with explicit save/clear controls, per-user+tool localStorage persistence for settings only, no input/output/file/secret capture, `e2e/tools/tool-context.spec.ts`, 7/7 focused Playwright tests passing, and `npx tsc --noEmit` exit 0.

## Feature 4: Billing status display
**Outcome:** The dashboard shows whether the account is free or paid and what plan is active.

### Task Group A: billing state review
**Status:** done
- Identify the billing data source.
- Confirm the visible fields.
- Confirm the empty or unknown state.

**Discovery summary:** Dashboard billing status is sourced from the Next.js `/api/subscription` route, which proxies Laravel `${NEXT_PUBLIC_API_URL || "https://api.toolblip.com"}/api/subscription` using the `auth_token` cookie. The dashboard also calls `/api/subscription` client-side with the bearer token and keeps the result in `subscription`. Visible MVP fields already include plan name/tier (`free`, `starter`, `ultra` displayed as Pro, `max`), `is_pro`, `subscription_status`, `plan_ends_at`, storage GB, max file size, team seats, API access, and priority support in the shared subscription type, though the current dashboard only renders the plan label, active/free copy, renewal or active-until date, storage/file/seat chips, and billing portal actions. Empty/unknown state is currently `subscription === null`, rendered as `Loading...` / `Checking subscription...`; unauthenticated API calls return 401 from the route, and fetch errors are ignored, which can leave the loading state as the only unknown-state UI. Task Group B should keep the concise labels, add/verify explicit free, paid-active, scheduled-cancel/active-until, and API-error/unknown display states, and avoid treating missing subscription data as a silent success. Verified current onboarding/pricing regressions on 2026-06-07 05:12 +06 with `npm run test:e2e -- e2e/auth/onboarding.spec.ts e2e/pricing.spec.ts`: 7/7 passed.

### Task Group B: build and verify
**Status:** done
- Render billing status in the dashboard.
- Keep the labels concise.
- Verify each plan state displays correctly.

**Task markers:**
- `done`: billing status display — merged in PR #101 (`https://github.com/toolblip/frontend/pull/101`) at 2026-06-08T16:15:15Z with GitHub `auth-e2e` green. Claude Code added an explicit subscription-error flag and retry state so the dashboard shows `Billing status unavailable` instead of staying stuck on `Checking subscription...`, preserved concise free, paid-active, and scheduled-cancel/active-until labels, added `e2e/auth/dashboard-billing-status.spec.ts`, and verified 11/11 focused Playwright tests passed plus `npx tsc --noEmit` exit 0.
