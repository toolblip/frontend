---
featuredImage: 'https://toolblip.com/api/og?title=JWT%20Security%20Checklist%3A%2012%20Things%20to%20Verify%20Before%20You%20Ship&category=Developer%20Tools&date=2026-04-23'
title: "JWT Security Checklist: 12 Things to Verify Before You Ship"
description: "Use this practical JWT security checklist to catch weak signing, unsafe storage, missing expiration, and authorization bugs before they reach production."
date: 2026-04-23
category: Developer Tools
---

JSON Web Tokens are simple to decode, but easy to misuse in production. A JWT looks like a harmless string, travels through APIs cleanly, and can be verified without a database lookup. But one bad assumption  -  accepting the wrong algorithm, storing tokens in the wrong place, skipping expiration, trusting claims too early  -  can turn your authentication layer into a security hole.

This checklist is for developers reviewing JWT-based authentication before shipping. It catches the practical mistakes that show up in SaaS APIs, mobile backends, admin tools, and microservices.

If you need to inspect a token while following along, open Toolblip's [JWT Decoder](/tools/jwt-decoder). It lets you view the header and payload in your browser so you can verify claims, expiration, issuer, audience, and signing metadata.

## The Short Version: JWTs Are Signed Data, Not Magic Sessions

A JWT has three Base64URL-encoded parts: `header.payload.signature`. The header says which algorithm signed the token. The payload contains claims like user ID, issuer, audience, role, and expiration. The signature proves the header and payload were signed by someone with the correct secret or private key.

The payload is not encrypted by default. Anyone holding the token can decode and read it. Signing prevents tampering; it does not hide data.

A safer mental model is: **JWT = readable claims + tamper-resistant signature + validation rules**. Those validation rules matter as much as the signature. A validly signed token can still be unsafe if it was issued for the wrong audience, expired months ago, or contains claims your API should not trust.

## JWT Security Checklist

### 1. Decode the Token and Inspect the Header

Start with the header. A typical JWT header looks like this:

```json
{
  "alg": "RS256",
  "typ": "JWT",
  "kid": "prod-key-2026-04"
}
```

Check three things:

- `alg` is the algorithm you expect
- `typ` is sane, usually `JWT`
- `kid` only selects from trusted keys you control

The most important field is `alg`. Your verifier should not blindly trust the algorithm from the token. It should explicitly allow the algorithm your system uses.

The exact API depends on your library, but the principle is universal: explicitly pass the allowed algorithms to the verifier. Do not let an attacker choose how their token is verified.

### 2. Never Accept `alg: none`

Old JWT libraries sometimes supported unsigned tokens using `alg: "none"`. Modern libraries usually block this by default, but it is still worth checking because legacy apps and custom middleware exist.

An unsigned token might look like this:

```json
{
  "alg": "none",
  "typ": "JWT"
}
```

Your production verifier should reject this every time. If a token grants access, it must be signed. If your test suite does not already include a case for `alg: none`, add one.

### 3. Choose the Right Signing Algorithm

Most teams should use one of two approaches:

- `HS256` for simple systems where one trusted backend signs and verifies tokens with the same secret
- `RS256` or `ES256` when different services need to verify tokens without sharing the signing private key

With `HS256`, the same secret signs and verifies tokens. If a verifying service leaks the secret, it can also mint new tokens. With `RS256`, the auth service signs with a private key, while other services verify with a public key. For microservices, partner APIs, and distributed systems, asymmetric signing is usually safer.

### 4. Validate Expiration Every Time

Every access token should have an `exp` claim:

```json
{
  "sub": "user_123",
  "exp": 1776942120
}
```

The value is a Unix timestamp in seconds. Your API should reject expired tokens automatically. Do not only decode the token and read `sub`; verify the signature and validate time-based claims in one step.

Typical access-token lifetimes are short: 5–15 minutes for high-risk apps, 15–60 minutes for normal web apps, and only a few hours when risk is low and refresh-token handling is strong. If you see access tokens lasting days or months, pause. That is usually a refresh-token job, not an access-token job. The [Unix timestamp guide](/blog/2026-04-17-unix-timestamp-guide) can help sanity-check `exp`, `iat`, or `nbf` values while debugging.

### 5. Check `nbf` and `iat` for Clock Problems

Two other time claims are common:

```json
{
  "iat": 1776941220,
  "nbf": 1776941220
}
```

`iat` means issued at. `nbf` means not before. They help prevent tokens from being used before they are valid and make debugging token age easier.

Allow a small amount of clock skew between services, usually 30–120 seconds. Do not allow huge skew just to hide server time problems. If your services disagree by several minutes, fix NTP or infrastructure time sync instead of relaxing auth validation.

### 6. Validate the Issuer

The `iss` claim says who issued the token:

```json
{
  "iss": "https://auth.example.com"
}
```

Your API should reject tokens from unknown issuers. This is especially important when you use Auth0, Clerk, Cognito, Firebase Auth, Supabase, or an internal OAuth server.

Do not only check whether the token is signed by *some* trusted key. Check that it came from the expected issuer for this environment.

Example:

```js
jwt.verify(token, publicKey, {
  algorithms: ["RS256"],
  issuer: "https://auth.example.com"
});
```

Staging and production should usually have different issuers.

### 7. Validate the Audience

The `aud` claim says who the token is for:

```json
{
  "aud": "api.example.com"
}
```

Audience validation prevents a token issued for one service from being replayed against another. Without it, a token meant for `profile-api` might accidentally work against `billing-api`.

Example:

```js
jwt.verify(token, publicKey, {
  algorithms: ["RS256"],
  issuer: "https://auth.example.com",
  audience: "https://api.example.com"
});
```

If you are confused about how JWTs fit into OAuth, read [JWT vs OAuth 2.0](/blog/2026-04-30-jwt-vs-oauth2). The short version: JWT is a token format; OAuth 2.0 is an authorization framework. OAuth systems often issue JWT access tokens, but they are not the same thing.

### 8. Keep Sensitive Data Out of the Payload

A JWT payload is usually readable by anyone holding the token. Do not put secrets in it.

Avoid claims like password reset codes, provider secrets, internal notes, or private customer data. Reasonable claims include `sub`, `role`, `plan`, `iss`, `aud`, and `exp`. Even then, keep payloads small. JWTs often travel in headers, and oversized tokens cause performance, proxy, and logging problems.

### 9. Do Not Trust Role Claims Without a Freshness Strategy

Embedding roles in JWTs is convenient:

```json
{
  "sub": "user_123",
  "role": "admin"
}
```

But what happens when that user is demoted, banned, or removed from an organization? If the token is valid for another hour, your system may keep treating them as an admin for another hour.

You have a few options: use very short-lived access tokens, check high-risk permissions against the database, include a `tokenVersion` or `sessionVersion`, or use introspection for sensitive admin actions. Cached role claims can be fine for normal page access. For destructive actions  -  deleting users, changing billing, exporting customer data  -  prefer a fresh permission check.

### 10. Store Browser Tokens Deliberately

Token storage has tradeoffs. `localStorage` is easy, but JavaScript can read it after XSS. HttpOnly cookies are harder for injected JavaScript to steal, but you must handle CSRF. In-memory storage reduces persistence risk, but tokens disappear on refresh. A reasonable default for many web apps is a short-lived access token in memory, a refresh token in a secure HttpOnly SameSite cookie, a strong Content Security Policy, and no tokens in query strings.

Never put JWTs in URLs like this:

```text
https://example.com/dashboard?token=eyJhbGciOi...
```

URLs leak through history, logs, analytics, referrers, screenshots, and support tickets.

### 11. Rotate Keys and Handle `kid` Safely

If your JWT header includes `kid`, your verifier uses it to pick the right key. That is useful for rotation, but dangerous if implemented carelessly. Do not use `kid` to read arbitrary files, build SQL queries, or fetch attacker-controlled URLs. Prefer a fixed trusted-key map:


```js
const trustedKeys = {
  "prod-key-2026-04": publicKeyApril,
  "prod-key-2026-05": publicKeyMay
};

const key = trustedKeys[header.kid];
if (!key) throw new Error("Unknown key id");
```

If you use JWKS, fetch keys only from a trusted issuer URL, cache them, and still enforce issuer/audience validation.

### 12. Log Token Metadata, Not Whole Tokens

When authentication breaks, it is tempting to log the full token. Don't.

A JWT in logs is effectively a credential until it expires. Logs are copied to observability platforms, support tools, backups, and sometimes developer laptops.

Log safe metadata instead: error reason, issuer, audience, subject, key ID, and expiration. If you must log a token identifier, use `jti` or a hash of the token, not the raw token.

## A Practical JWT Review Workflow

Here is a quick workflow you can use during a code review.

### Step 1: Decode a Real Token

Paste a non-production sample token into the [JWT Decoder](/tools/jwt-decoder). Confirm the header, payload, and expiration look like what your code expects.

Check:

- Algorithm
- Key ID
- Issuer
- Audience
- Subject
- Expiration
- Role or scope claims

### Step 2: Read the Verification Code

Find the exact line where your API verifies the token. You are looking for explicit validation, not just decoding.

Good signs:

```js
jwt.verify(token, publicKey, {
  algorithms: ["RS256"],
  issuer: "https://auth.example.com",
  audience: "https://api.example.com"
});
```

Risky signs:

```js
const payload = jwt.decode(token);
req.user = payload;
```

Decoding is for inspection. Verification is for trust.

### Step 3: Test Failure Cases

Do not only test the happy path. Add tests for:

- Expired token
- Wrong issuer
- Wrong audience
- Unknown `kid`
- Modified payload
- Missing signature
- Wrong algorithm
- User whose role changed after token issue

A simple modified-payload test catches a surprising number of broken implementations. Change `"role":"member"` to `"role":"admin"` in the payload and confirm the API rejects it because the signature no longer matches.

### Step 4: Review Related Auth Decisions

JWTs rarely exist alone. They sit inside broader auth decisions: API keys, OAuth flows, refresh tokens, cookies, CSRF, and authorization checks.

If you are deciding between token types, the [API Key vs JWT guide](/blog/2026-05-06-api-key-vs-jwt-authentication) explains when each one fits. If you are debugging tokens specifically, the [debug JWT tokens guide](/blog/2026-04-23-debug-jwt-tokens-base64-json-browser) walks through decoding and reading the Base64URL parts in the browser.

## Common JWT Mistakes to Catch Before Production

Watch for three patterns during review. First, JWTs should not become permanent sessions; if an access token lasts forever, expiration no longer protects you. Second, a valid signature is not full authorization. It proves the issuer signed the claims, not that the user may perform every action right now. Third, logout and revocation need an explicit plan. Stateless tokens keep working until they expire unless you add short lifetimes, session versions, refresh-token rotation, or a denylist for compromised sessions.

## Final Pre-Ship Checklist

Before you ship JWT authentication, confirm:

- [ ] Tokens are signed with an approved algorithm
- [ ] `alg: none` is rejected
- [ ] The verifier explicitly restricts algorithms
- [ ] `exp` is required and enforced
- [ ] Clock skew is small and intentional
- [ ] `iss` is validated
- [ ] `aud` is validated
- [ ] Sensitive data is not stored in the payload
- [ ] Role/scope claims have a freshness strategy
- [ ] Browser storage choice is deliberate
- [ ] `kid` only selects trusted keys
- [ ] Full tokens are not logged
- [ ] Logout/revocation behavior is understood

JWTs are useful because they are portable, compact, and easy to verify. They are risky for the same reasons: once a token exists, it can move quickly through systems, logs, browsers, proxies, and APIs.

A secure JWT implementation is not just "we signed it." It is signing plus expiration, issuer validation, audience validation, safe storage, careful authorization, and a plan for rotation and revocation. Run this checklist before launch, and you will avoid most of the mistakes that make JWT bugs painful later.
