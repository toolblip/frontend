# Stage 5: Admin Area and User Management

**Goal:** Ship a vanilla admin area that can manage users and handle the basic support actions already agreed for MVP.

**Features**
1. Admin user list and lookup
2. Admin plan actions
3. Basic support actions

## Feature 1: Admin user list and lookup
**Outcome:** Admins can find a user and open the user detail view.

### Task Group A: admin surface review
**Status:** done
- Confirm the admin route and access gate.
- Define the minimum user fields needed for lookup.
- Confirm the empty-state and access-denied states.

**Review result:** No admin route or local admin API exists yet. The current authenticated surface is `/dashboard`, backed by `/api/auth/me`, `/api/auth/profile`, `/api/subscription`, and `/api/tools/favorites`; user objects are loosely typed with `id`, `name`, `email`, and extra fields such as `email_verified_at`. MVP admin lookup should add a dedicated admin-only route (for example `/admin/users`) with an explicit admin gate based on the Laravel-authenticated user role/flag, plus access-denied and unauthenticated states. Minimum lookup fields: user id, name, email, email verification state, current plan/tier, subscription status, plan end date, created date if available, and enough detail to open a user record.

### Task Group B: build and verify
**Status:** done
- Add the user list and lookup flow.
- Keep the layout simple and readable.
- Verify an admin can open a user record.

**Task markers:**
- `done`: admin user list and lookup — merged in PR #102 (`https://github.com/toolblip/frontend/pull/102`) at 2026-06-08T15:36:23Z with GitHub `auth-e2e` green. Claude Code added `/admin/users` and `/admin/users/[id]` admin-gated lookup surfaces, Next proxies for Laravel `/api/admin/users[/{id}]`, unauthenticated and access-denied states, and focused hermetic e2e coverage. Backend note: production needs Laravel `GET /api/admin/users` and `GET /api/admin/users/{id}` to exist and return the documented `{ data: ... }` fields.

## Feature 2: Admin plan actions
**Outcome:** Admins can upgrade, downgrade, or cancel a user plan.

### Task Group A: action scope review
**Status:** done
- Confirm the three allowed plan actions.
- Define the confirmation states.
- Confirm what audit trail or note is needed.

**Review result:** MVP admin plan actions should be limited to three explicit actions: upgrade to a selected paid tier, downgrade to a lower tier or Free, and cancel a plan on user request. The current app has user-facing checkout through `/api/subscription/checkout`, billing status through `/api/subscription`, and customer self-service through the Laravel billing portal at `${API_BASE}/api/subscription/portal`, but no dedicated admin route, admin API, or admin-only plan mutation endpoint. Task Group B should add admin-only controls behind the same explicit admin gate planned for the user lookup surface, require a confirmation step that names the target user, current plan, requested action, target plan when applicable, and effective timing, then refresh the visible user/subscription state after success. The minimum audit trail should capture admin id/email, target user id/email, action type, previous plan/status, new plan/status or cancellation effective date, reason/support note, timestamp, and upstream billing/reference id if the backend returns one.

### Task Group B: build and verify
**Status:** done
- Add upgrade, downgrade, and cancel controls.
- Keep the actions restricted to admins.
- Verify each action updates the visible state.

**Task markers:**
- `done`: admin plan actions — merged in PR #103 (`https://github.com/toolblip/frontend/pull/103`) at 2026-06-08T16:11:37Z with GitHub `auth-e2e` green. Claude Code added admin-gated upgrade/downgrade/cancel controls on the user record, confirmation copy with target user/current plan/action/target plan/effective timing, optional reason/support note capture, refreshed visible state after success, and audit summary output. Backend note: production needs Laravel `POST /api/admin/users/{id}/plan` to exist and return the documented `{ data, audit }` shape.

## Feature 3: Basic support actions
**Outcome:** Admins can do simple support work without extra admin complexity.

### Task Group A: support scope review
**Status:** done
- Confirm what basic support means for MVP.
- Keep the support flow limited to user management.
- Identify anything that should stay out for now.

**Review result:** MVP basic support should stay inside the admin user-management surface and avoid adding a separate ticketing/helpdesk product. The current dashboard already lets the signed-in user update profile name/email, resend verification email, change password, view favorites, and manage billing through the customer portal, but there is no admin-only support route, support-note model, impersonation flow, account lock/unlock, or admin password reset flow. Task Group B should add only minimal admin support affordances attached to a user record: view the user's verification/profile/subscription/favorites-support context, record an internal support note/reason, trigger safe support actions that already map to backend capabilities (for example resend verification email or open billing/support context), and preserve an audit trail. Out of scope for MVP: live chat, ticket queues, impersonation, manual password setting, broad content moderation, and tool-specific support workflows.

### Task Group B: build and verify
**Status:** done
- Add the support-oriented controls or notes.
- Keep the surface minimal.
- Verify the admin can complete the support flow.

**Task markers:**
- `done`: basic support actions — merged in PR #104 (`https://github.com/toolblip/frontend/pull/104`) at 2026-06-08T16:14:17Z with GitHub `auth-e2e` green. Claude Code added admin-gated support context, pending-verification resend, internal support note/reason capture, support notes listing, refreshed user state, and audit details on the user record. Backend note: production needs Laravel `POST /api/admin/users/{id}/support` to exist and return the documented `{ data, message?, notes?, audit }` shape.
