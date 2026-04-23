---
title: "Debug JWT Tokens Without a Library: Base64 + JSON View in Your Browser"
description: "Every JWT is just Base64-encoded JSON with a signature. Learn how to decode and inspect JWT claims in your browser — no npm install, no external API calls, no library required."
date: '2026-04-23'
category: Developer Tools
tags:
  - jwt
  - base64
  - json
  - debugging
  - authentication
  - web-development
  - api-development
  - privacy
  - developer-tools
  - security
author: Toolblip Team
readingTime: 9 min
featuredImage: 'https://api.radtx.com/gradient/0ea5e9-8b5cf6/1200/630'
---

If you've ever stared at a JWT like `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c` and wondered what the hell it actually says — you're not alone.

JWTs are everywhere in modern web development. They power API authentication, OAuth tokens, session management, and more. But debugging them shouldn't require installing a library, spinning up a debugger, or sending your tokens to a third-party website that logs everything you decode.

This guide shows you exactly how to decode and inspect any JWT in your browser — using nothing but a Base64 decoder and a JSON formatter.

## What a JWT Actually Looks Like

A JWT is three Base64-encoded strings joined by dots:

```
header.payload.signature
```

Each part is URL-safe Base64 (`base64url`), not standard Base64.

**The header** — decode it and you get something like:
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**The payload** — decode it and you get the claims:
```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022,
  "exp": 1516242622
}
```

**The signature** — this is where it gets cryptographic. It's the header and payload signed with a secret key. You can't decode the signature — but you can verify it if you have the secret.

The important point: **the header and payload are just encoded, not encrypted**. Anyone can read them. The signature only proves that the payload hasn't been tampered with — it doesn't hide anything.

## The Manual Decode Process

Here's how to decode a JWT by hand using Toolblip's browser-based tools.

### Step 1: Copy the Token

Take your JWT and split it on the `.` character. You want the **middle section** — the payload.

For the example token above, the payload is:
```
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ
```

### Step 2: Decode Base64 URL

Open the [Toolblip Base64 Decoder](/tools/base64-decoder). Paste the payload string. Click decode.

You'll get the raw JSON string:
```json
{"sub":"1234567890","name":"John Doe","iat":1516239022,"exp":1516242622}
```

### Step 3: Format the JSON

Copy the decoded string and paste it into the [Toolblip JSON Formatter](/tools/json-formatter). Instantly you get:

```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022,
  "exp": 1516242622
}
```

Now you can actually read it.

### Step 4: Interpret the Claims

Here's what those fields mean:

| Claim | Meaning |
|---|---|
| `sub` | Subject — the user ID or entity this token represents |
| `name` | Human-readable name associated with the token |
| `iat` | Issued At — Unix timestamp when the token was created |
| `exp` | Expiration — Unix timestamp after which the token is invalid |

If `exp` (1516242622) is in the past relative to your current time, the token is expired. You can check the current Unix timestamp at the [Toolblip Unix Timestamp Converter](/tools/unix-timestamp-converter).

## Common JWT Debugging Scenarios

### Scenario 1: Token Expired

You send a request with an `Authorization: Bearer <token>` header and get a `401 Unauthorized` back. Decode the token. Check `exp`. Is it in the past?

```bash
# Current timestamp
date +%s
# 1745452800 (example)

# If exp < current, token is expired
```

If it's expired, you need to get a fresh token from your auth endpoint. No amount of debugging will make an expired token valid.

### Scenario 2: Wrong Subject ID

You're testing a user deletion flow. The API says it deleted user `12345`, but the webhook fired for user `12346`. Decode the JWT's payload and check `sub`.

If `sub` is wrong in the JWT, the issue is in your auth server — the token was issued with the wrong user ID.

### Scenario 3: Alg Mismatch Vulnerability

This one matters for security. If a JWT header shows `"alg": "none"` or an algorithm you didn't configure your server to accept (like `"alg": "HS256"` when you expected `"RS256"`), that's a potential vulnerability.

Decode the header of any suspicious token:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
```
Decode → `{"alg":"HS256","typ":"JWT"}`

If you see `"alg": "none"` or `"alg": "HS256"` in a token that should use RSA signatures, flag it. The [JWT alg:none attack](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/06-Session_Management_Testing/01-Testing_For_GraphQL_Query_Weakness) is a known exploitation vector.

### Scenario 4: Verifying a Token Locally

If you have the secret key for an HS256 token, you can verify it in your browser too. The [Toolblip Hash Generator](/tools/hash-generator) supports HMAC-SHA256 — you can compute the expected signature locally and compare it to the signature section of the JWT.

This is useful when debugging "why is my server rejecting this token?" — compute what the correct signature should be and see if it matches.

## Why Not Use a Library?

You might be thinking: "Why not just use `jwt.decode()` from the `jsonwebtoken` npm package?"

You should use libraries in your application code. They're the right tool for production — they handle edge cases, validate signatures properly, and handle clock skew.

But when you're debugging in the moment:

- Installing a package just to inspect one token is slow
- Third-party JWT debuggers online send your token to their servers — that's your users' auth data touching an unknown infrastructure
- You might be on a machine without Node.js, or without the right environment set up
- Copy-pasting a token into a local browser tool is faster than writing a script

The browser approach is the developer's equivalent of using `curl` instead of Postman for a quick API check. It's not replacing your tools — it's the right tool for the one-off moment.

## URL-Safe Base64: The Gotcha

Standard Base64 uses `+`, `/`, and `=` characters. JWT uses URL-safe Base64, which replaces:

- `+` → `-`
- `/` → `_`
- Trailing `=` padding is often stripped

This matters because if you paste a JWT payload into a standard Base64 decoder, it might fail or produce garbage output.

**Toolblip's Base64 tools auto-detect URL-safe Base64 and handle it correctly.** If you're using a different tool and getting weird output, check whether it's URL-safe or standard Base64.

### Quick Manual Fix

If a JWT payload won't decode in a standard Base64 decoder, add back the padding:

```javascript
// JWT payload without padding
const payload = 'eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyfQ'

// Add padding to make it valid standard Base64
const padded = payload + '='.repeat((4 - payload.length % 4) % 4)
// "eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyfQ=="
```

Then decode as standard Base64. You'll get the same result as URL-safe Base64 decoding.

## Real-World Example: Debugging an Auth Flow

Here's a real debugging scenario from API development:

**The problem:** Your frontend is sending a JWT in the `Authorization` header, but the backend keeps returning 403 Forbidden.

**The decode workflow:**

1. Copy the JWT from localStorage/sessionStorage (or your network tab)
2. Split on `.` — take the payload (middle section)
3. Paste into [Toolblip Base64 Decoder](/tools/base64-decoder)
4. Copy the decoded JSON string
5. Paste into [Toolblip JSON Formatter](/tools/json-formatter)
6. Inspect `sub`, `iat`, `exp`, and any custom claims

**What you might find:**

- `exp` is in the past → token is expired, your auth server needs to refresh it
- `sub` doesn't match the user ID you expect → auth server issued token for wrong user
- `iat` is very old → token was issued hours ago and your refresh logic isn't running
- A custom claim like `role` is missing → your auth server didn't include it when signing

This is the full debugging loop without writing a line of code.

## Security Notes

A few important things to keep in mind when debugging JWTs:

**Never decode tokens from untrusted sources in tools you don't control.** If you paste a JWT into a random website's "JWT decoder", you're sending your auth token to that server. They can log it, use it, or store it.

Toolblip's tools run 100% client-side — nothing is sent to any server. The decode and format happen in your browser using your machine's resources. Your tokens never leave your device.

**Don't put production tokens in logs.** If you're debugging a production issue and copy a JWT into a bug report, Slack message, or email — you've just shared your users' auth tokens externally. Always redact JWTs in bug reports.

**Base64 ≠ encryption.** The header and payload of a JWT are encoded, not encrypted. Anyone with the token can read the claims. Never put sensitive data like passwords or PII in the JWT payload unless you understand that anyone who sees the token can read it.

## Related Tools

- **[Base64 Encoder/Decoder](/tools/base64-decoder)** — Encode or decode Base64 and URL-safe Base64, entirely in your browser
- **[JSON Formatter](/tools/json-formatter)** — Pretty-print and validate JSON with syntax highlighting
- **[Unix Timestamp Converter](/tools/unix-timestamp-converter)** — Convert Unix timestamps to human-readable dates and vice versa
- **[Regex Tester](/tools/regex-tester)** — Test patterns against strings for validation and parsing
- **[Hash Generator](/tools/hash-generator)** — Compute HMAC-SHA256 and other hash functions client-side

## Further Reading

- [JWT.io](https://jwt.io/) — Official JWT debugger with library integration
- [RFC 7519](https://datatracker.ietf.org/doc/html/rfc7519) — The JWT specification
- [OWASP JWT Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)
- [Auth0: JWT Structure Explained](https://auth0.com/blog/inside-jwt-tokens/)

---

*No token ever leaves your browser. Toolblip's decoder and formatter both run 100% client-side — decode, inspect, and understand your JWTs privately.*
