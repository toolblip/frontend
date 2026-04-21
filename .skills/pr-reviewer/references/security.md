# Security Review Checklist

Apply this checklist to every PR. Flag vulnerabilities by severity:

- 🔴 **Critical**: Secret exfiltration, injection, auth bypass, data exposure
- 🟠 **High**: XSS, CSRF, IDOR, sensitive data in logs/URLs, insecure defaults
- 🟡 **Medium**: Missing rate limiting, weak cryptography, incomplete validation
- 🟢 **Low**: Informational, dependency hygiene, minor concerns

---

## 🔐 Authentication & Authorization

- [ ] **Auth bypass**: No new endpoints bypass authentication when they shouldn't
- [ ] **IDOR**: No direct object reference access without ownership check (e.g., `/api/users/:id` without verifying current user owns that record)
- [ ] **Privilege escalation**: No way for low-privilege users to access admin functions
- [ ] **Session fixation**: Login resets or regenerates session ID
- [ ] **Token exposure**: Auth tokens not in URL query params, not logged, not returned in error responses

## 🕷️ Injection (SQL, Command, XSS, HTML)

- [ ] **SQL injection**: All DB queries use parameterization — never string concatenation/interpolation with user input
- [ ] **Command injection**: No `exec()`, `system()`, `shell_exec()` with user-controlled input
- [ ] **XSS**: `dangerouslySetInnerHTML` used only with explicitly sanitized content; user input escaped in template output
- [ ] **HTML injection**: User content rendered in HTML contexts without escaping
- [ ] **CSS injection**: No user-controlled values injected into `style` attributes without validation

## 🔑 Secrets & Credentials

- [ ] No secrets, API keys, tokens, or credentials in the diff (check for `api_key`, `secret`, `password`, `token`, `PRIVATE_KEY` in new/modified files)
- [ ] No credentials logged or included in error responses
- [ ] `.env` / `.env.example` updated if new env vars are needed (without real values)
- [ ] No hardcoded secrets that should be env vars
- [ ] GitHub tokens, Stripe keys, AWS credentials, database URLs — all from environment variables

## 📡 Data Exposure

- [ ] API responses don't return more data than necessary (no accidentally exposing `password_hash`, `internal_id`, `full_pii`)
- [ ] Internal errors return generic messages to clients (not stack traces, not raw SQL errors)
- [ ] CORS policy is explicit (not `*` for sensitive endpoints)
- [ ] No sensitive data in URL query parameters (`?token=xxx`, `?user_id=xxx`)
- [ ] Rate limiting on sensitive endpoints (auth, payment, API)

## 🔒 Cryptography

- [ ] Passwords hashed with bcrypt/argon2 (not MD5, SHA1, or plain text)
- [ ] Sensitive data at rest encrypted where required
- [ ] TLS used for all data in transit (no mixed HTTP/HTTPS on sensitive pages)
- [ ] CSRF tokens present on state-changing forms (POST, PUT, DELETE)

## 📦 Dependencies

- [ ] New dependencies checked: run `npm audit` or equivalent
- [ ] No packages with known critical vulnerabilities
- [ ] No packages from untrusted sources or unofficial registries
- [ ] Version pins for critical dependencies (not just `*` or `latest`)

## �-configuration

- [ ] Security headers not removed (CSP, HSTS, X-Frame-Options, X-Content-Type-Options)
- [ ] CSP not weakened (no `'unsafe-inline'` without justification)
- [ ] Redirects with user input validated (no open redirect vulnerabilities)
- [ ] File upload paths validated (type check, size check, filename sanitized)
- [ ] No directory traversal vulnerabilities (path traversal via `../` in user-controlled paths)

## 🔧 Security Review Output Format

For each finding:

```
🔴/🟠/🟡/🟢 [CATEGORY] — <title>
**File:** `path/to/file`
**Location:** line N
**Finding:** <what the code does>
**Risk:** <why this is a vulnerability>
**Fix:** <how to fix it>
```

At the end:

```
## Summary
🔴 Critical: N | 🟠 High: N | 🟡 Medium: N | 🟢 Low: N

[Blocking findings summary — what must be fixed before merge]
```
