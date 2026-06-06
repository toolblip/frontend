# Stage 5: Admin Area and User Management

**Goal:** Ship a vanilla admin area that can manage users and handle the basic support actions already agreed for MVP.

**Features**
1. Admin user list and lookup
2. Admin plan actions
3. Basic support actions

## Feature 1: Admin user list and lookup
**Outcome:** Admins can find a user and open the user detail view.

### Task Group A: admin surface review
- Confirm the admin route and access gate.
- Define the minimum user fields needed for lookup.
- Confirm the empty-state and access-denied states.

### Task Group B: build and verify
- Add the user list and lookup flow.
- Keep the layout simple and readable.
- Verify an admin can open a user record.

## Feature 2: Admin plan actions
**Outcome:** Admins can upgrade, downgrade, or cancel a user plan.

### Task Group A: action scope review
- Confirm the three allowed plan actions.
- Define the confirmation states.
- Confirm what audit trail or note is needed.

### Task Group B: build and verify
- Add upgrade, downgrade, and cancel controls.
- Keep the actions restricted to admins.
- Verify each action updates the visible state.

## Feature 3: Basic support actions
**Outcome:** Admins can do simple support work without extra admin complexity.

### Task Group A: support scope review
- Confirm what basic support means for MVP.
- Keep the support flow limited to user management.
- Identify anything that should stay out for now.

### Task Group B: build and verify
- Add the support-oriented controls or notes.
- Keep the surface minimal.
- Verify the admin can complete the support flow.
