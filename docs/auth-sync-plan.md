# Synchronized Auth Flow Implementation Plan

**Goal:** Make Toolblip login, signup, forgot password, reset password, and new-password login work consistently between the Next.js frontend and Laravel API.

**Architecture:** Keep the browser talking to local Next.js auth routes (`/api/auth/*`) and keep those routes as the only frontend-facing contract. Next.js proxies to Laravel with a consistent JSON shape and stores the Sanctum token in an httpOnly cookie. Laravel owns validation, token creation, reset-token lifecycle, and protected auth routes.

**Tech Stack:** Next.js App Router route handlers, React auth provider, Laravel Sanctum, Laravel password broker, PHPUnit feature tests.

---

## Current Findings

- Frontend auth pages already exist:
  - `app/login/LoginForm.tsx`
  - `app/signup/SignupForm.tsx`
  - `app/forgot-password/page.tsx`
  - `app/reset-password/[token]/page.tsx`
- Frontend proxy routes already exist:
  - `app/api/auth/login/route.ts`
  - `app/api/auth/register/route.ts`
  - `app/api/auth/forgot-password/route.ts`
  - `app/api/auth/reset-password/route.ts`
  - `app/api/auth/me/route.ts`
  - `app/api/auth/logout/route.ts`
- API auth controller exists at `api/app/Http/Controllers/AuthController.php`.
- `app/api/auth/me/route.ts` currently nests the Laravel response incorrectly. Laravel returns `{ user: ... }`, but the Next route returns `{ user: { user: ... }, token }`.
- `api/routes/api.php` and `api/routes/api/v1.php` put `/auth/me` and `/auth/logout` behind throttling only. They need `auth:sanctum` too.
- Laravel register/reset validate password length but not `password_confirmation` with Laravel's `confirmed` rule.
- Invalid login currently throws `ValidationException`, which is rendered as 422 validation error. Auth should return 401 with an auth-specific error code/message.
- Login/signup pages make direct production API status probes with empty credentials. That bypasses the Next auth contract and can create CORS/noise. Remove these probes; show server status only from real submit responses.
- `php artisan test tests/Feature/AuthTest.php` currently fails before tests run with `Target class [queue.listener] does not exist`; this is a local Laravel console/test bootstrap issue to handle during implementation.

---

## Task 1: Lock the API auth contract with tests

**Files:**
- Modify: `api/tests/Feature/AuthTest.php`

**Test coverage to add/update:**
- Register succeeds only when `password_confirmation` matches.
- Register returns 422 validation error when password confirmation mismatches.
- Login succeeds and returns `{ user, token }`.
- Invalid login returns HTTP 401 with `error.code = INVALID_CREDENTIALS`.
- `/api/auth/me` without token returns 401.
- `/api/auth/me` with Sanctum token returns `{ user }`.
- Logout with Sanctum token invalidates the current token.
- Forgot password always returns generic success for existing and missing emails.
- Reset password rejects confirmation mismatch.
- Reset password accepts a valid password broker token.
- After reset, old password no longer logs in and new password logs in.

**Verification:**
```bash
cd /Users/ray/Work/toolblip/api
php artisan test tests/Feature/AuthTest.php --colors=never
```
Expected first run before implementation: failures around confirmation, invalid login status, middleware protection, or reset behavior.

---

## Task 2: Fix Laravel auth behavior

**Files:**
- Modify: `api/app/Http/Controllers/AuthController.php`
- Modify: `api/routes/api.php`
- Modify: `api/routes/api/v1.php`

**Implementation:**
- Add `confirmed` validation to `password` for register and reset password.
- Return a direct 401 JSON response for invalid login:
  ```php
  return response()->json([
      'error' => [
          'code' => 'INVALID_CREDENTIALS',
          'message' => 'Invalid email or password.',
      ],
      'message' => 'Invalid email or password.',
  ], 401);
  ```
- Keep successful register/login response compatible with frontend: `{ user, token }`.
- Put protected routes behind `auth:sanctum` as well as throttling:
  ```php
  Route::middleware(['auth:sanctum', 'throttle:authenticated'])->group(function () {
      Route::post('/auth/logout', [AuthController::class, 'logout']);
      Route::get('/auth/me', [AuthController::class, 'me']);
      ...
  });
  ```
- Make logout safe when no current token object exists.
- After password reset, delete existing user tokens so old sessions are invalidated:
  ```php
  $user->tokens()->delete();
  ```

**Verification:**
```bash
cd /Users/ray/Work/toolblip/api
php artisan route:list --path=auth --no-ansi
php artisan test tests/Feature/AuthTest.php --colors=never
```

---

## Task 3: Normalize frontend auth proxy behavior

**Files:**
- Modify: `app/api/auth/me/route.ts`
- Review/possibly modify: `app/api/auth/login/route.ts`
- Review/possibly modify: `app/api/auth/register/route.ts`
- Review/possibly modify: `app/api/auth/forgot-password/route.ts`
- Review/possibly modify: `app/api/auth/reset-password/route.ts`
- Review/possibly modify: `app/api/auth/logout/route.ts`

**Implementation:**
- Fix `/api/auth/me` to unpack Laravel response:
  ```ts
  const data = await laravelRes.json();
  return NextResponse.json({ user: data.user, token });
  ```
- For proxy routes, safely parse JSON even if Laravel returns an empty/non-JSON response.
- Keep auth cookie behavior centralized in login/register only.
- Keep reset/forgot responses generic and pass Laravel status/message through.
- Ensure error responses expose both `message` and structured `error`/`errors` where available for UI.

**Verification:**
```bash
cd /Users/ray/Work/toolblip
npm run build
```

---

## Task 4: Clean up frontend forms so they use the same contract

**Files:**
- Modify: `app/login/LoginForm.tsx`
- Modify: `app/signup/SignupForm.tsx`
- Review: `app/forgot-password/page.tsx`
- Review: `app/reset-password/[token]/page.tsx`

**Implementation:**
- Remove the direct production API probes from login/signup.
- Login page should only call `/api/auth/login` on submit.
- Signup page should only call `/api/auth/register` on submit.
- If registration/login is disabled, show the server response from the real submit.
- Keep client-side password mismatch/min-length checks for fast feedback, but Laravel remains source of truth.

**Verification:**
```bash
cd /Users/ray/Work/toolblip
npm run build
```

---

## Task 5: End-to-end verification script/manual flow

**Files:**
- Optional create: `scripts/check-auth-flow.mjs` if needed for local/prod smoke testing.

**Flow to verify:**
1. Create a unique test user via frontend `/api/auth/register` or API `/api/auth/register`.
2. Confirm `/api/auth/me` returns the flat user object.
3. Logout and confirm `/api/auth/me` returns 401.
4. Login with old password succeeds.
5. Request forgot password for the test email.
6. Generate/use a broker reset token in test environment or direct API test.
7. Reset to a new password.
8. Confirm old password fails with 401.
9. Confirm new password succeeds and `/api/auth/me` works.

**Verification:**
- Backend: `php artisan test tests/Feature/AuthTest.php --colors=never`
- Frontend: `npm run build`
- Browser/local smoke if servers can run.

---

## Task 6: Commit, push, deploy

**Commit order:**
1. Commit API repo changes inside `/Users/ray/Work/toolblip/api`.
2. Push API repo.
3. Commit frontend/parent repo changes inside `/Users/ray/Work/toolblip`.
4. Push frontend/parent repo.
5. Deploy via Railway CLI if GitHub/Railway auto-deploy is stale.
6. Live-test production auth pages.

**Secret scan before commits:**
```bash
git grep -n -I -E 'TELEGRAM_BOT_TOKEN|[0-9]{8,10}:AA[A-Za-z0-9_-]{20,}' -- . ':!vendor' ':!node_modules' || true
```
