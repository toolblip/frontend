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
- Map the current free and paid plans.
- Confirm the upgrade and downgrade triggers.
- Confirm the selected-plan path after checkout.

### Task Group B: build and verify
- Wire upgrade and downgrade actions.
- Keep the plan state visible.
- Verify a plan change updates the UI.

## Feature 2: Cancellation flow
**Outcome:** A user can cancel their plan when they ask.

### Task Group A: cancel flow review
- Confirm who can cancel a plan.
- Define the cancellation confirmation state.
- Confirm what happens after cancellation.

### Task Group B: build and verify
- Add the cancel action.
- Show the cancellation state clearly.
- Verify cancellation completes.

## Feature 3: Lightweight saved context for paid users
**Outcome:** Paid users can keep simple resume defaults and last-used settings.

### Task Group A: context scope review
- Confirm the small set of data to store.
- Keep the memory user-controlled.
- Confirm what is explicitly out of scope.

### Task Group B: build and verify
- Save last-used settings or defaults.
- Restore the saved context on return.
- Verify the saved state survives a reload.

## Feature 4: Billing status display
**Outcome:** The dashboard shows whether the account is free or paid and what plan is active.

### Task Group A: billing state review
- Identify the billing data source.
- Confirm the visible fields.
- Confirm the empty or unknown state.

### Task Group B: build and verify
- Render billing status in the dashboard.
- Keep the labels concise.
- Verify each plan state displays correctly.
