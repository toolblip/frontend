# Password Reset Flow - Implementation Plan

## Current State

**Working:**
- `POST /api/auth/forgot-password` - stores token in DB, always returns 200 (prevents enumeration)
- `POST /api/auth/reset-password` - validates token + email, updates password
- `password_reset_tokens` table migrated
- `/forgot-password` page - email input form
- `/reset-password/[token]` page - new password form

**Broken:**
1. Reset password page doesn't ask for email - sends empty string to API, which silently fails
2. No actual email is sent - Laravel log driver captures it, but no real delivery
3. No `email` field on reset-password page - user can't enter their email to reset

---

## Implementation Steps

### Step 1 - Fix Reset Password Page Email Field
**Files:** `app/reset-password/[token]/page.tsx`

- Add email input field to the form (user must confirm their email)
- Pass email to the `/api/auth/reset-password` proxy call
- Add proper error display for invalid/expired tokens

### Step 2 - Add Email Input to Reset Password Proxy
**Files:** `app/api/auth/reset-password/route.ts`

- Ensure `email` field from form is passed through to Laravel API

### Step 3 - Configure Laravel Mail Driver
**Files:** `api/.env`, `api/config/mail.php`

- Set `MAIL_MAILER=log` for development (captures to `storage/logs/laravel.log`)
- Document that `MAIL_MAILER=smtp` + SMTP credentials needed for production

### Step 4 - Create Laravel Mailable for Password Reset
**Files:** `api/app/Mail/ResetPasswordMail.php`

- Create `php artisan make:mail ResetPasswordMail`
- Accept `$resetUrl` in constructor
- Blade template: clean, simple email with reset button
- Plain text fallback

### Step 5 - Update AuthController ForgotPassword to Send Email
**Files:** `api/app/Http/Controllers/AuthController.php`

- Inject `Mail` facade
- After storing token, send `ResetPasswordMail` to the user
- Wrap in try/catch - don't fail if mailer is misconfigured
- Log the full reset URL in dev mode (already in logs via log driver)

### Step 6 - Add Token Expiry Validation
**Files:** `api/app/Http/Controllers/AuthController.php`

- Check `created_at` is within 60 minutes
- Return 422 with `"token expired"` message if too old
- Delete used tokens after successful password reset

### Step 7 - Add Edge Case Handling
**Files:** `api/app/Http/Controllers/AuthController.php`

- User not found: return 200 (same as existing - prevent enumeration)
- Token not found: return 422 `"Invalid token"`
- Token expired: return 422 `"Token has expired"`
- Token already used: return 422 `"Token has already been used"`

### Step 8 - Update Forgot Password Success State
**Files:** `app/forgot-password/page.tsx`

- Show generic "check your inbox" message
- Remove dev-mode hint (not needed with real email)

### Step 9 - Test the Full Flow
Run these tests:
```bash
# 1. Request reset token
curl -X POST https://api.toolblip.com/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# 2. Check Laravel log for the token
tail -50 api/storage/logs/laravel.log | grep -A5 "password_reset"

# 3. Reset password (replace TOKEN and EMAIL)
curl -X POST https://api.toolblip.com/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","token":"TOKEN_FROM_LOG","password":"newpassword123","password_confirmation":"newpassword123"}'
```

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `api/app/Mail/ResetPasswordMail.php` | Create |
| `api/resources/views/emails/reset-password.blade.php` | Create |
| `api/app/Http/Controllers/AuthController.php` | Modify |
| `api/config/mail.php` | Modify (if needed) |
| `api/.env` | Add mail vars |
| `app/reset-password/[token]/page.tsx` | Modify - add email field |
| `app/api/auth/reset-password/route.ts` | Verify email passed through |
| `app/forgot-password/page.tsx` | Minor UX polish |

---

## Rollback Plan

- If email sending breaks: set `MAIL_MAILER=log` back to `log`, tokens still stored in DB
- If reset-password page breaks: `git checkout` to previous commit
- If AuthController breaks: `git checkout api/app/Http/Controllers/AuthController.php`
