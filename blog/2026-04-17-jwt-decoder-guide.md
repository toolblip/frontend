---
title: "JWT Decoder: Inspect and Validate JSON Web Tokens"
description: "Decode and inspect JSON Web Tokens (JWT) in real-time. View header, payload, and signature without a server. Learn what JWTs contain and how to validate them."
publishDate: "2026-04-17"
slug: jwt-decoder-guide
readingTime: 6 min
tags: ["jwt", "authentication", "developer-tools", "security", "javascript"]
---

If you work with modern web applications, you've seen JWTs — those long strings of dots-separated base64 that show up in browser storage, API responses, and auth headers. But what do they actually contain? And how do you inspect one without sending it to a third-party service?

A JWT decoder answers both questions, entirely in your browser.

## What Is a JWT?

A JSON Web Token (JWT, pronounced "jot") is a compact, URL-safe way to represent claims between two parties. JWTs are most commonly used for **authentication** and **authorization** in web applications.

A JWT looks like this:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

It has three parts separated by dots:

| Part | Name | Purpose |
|------|------|---------|
| `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9` | **Header** | Metadata about the token |
| `eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ` | **Payload** | The actual claims/data |
| `SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c` | **Signature** | Proves the token wasn't tampered with |

## The Three Parts Explained

### 1. The Header

The header is base64url-encoded JSON. Decode it and you get:

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

- **`alg`**: The algorithm used to sign the token. `HS256` (HMAC using SHA-256) is the most common for symmetric signing. `RS256` (RSA Signature) is common for asymmetric (public/private key) setups.
- **`typ`**: The token type — almost always `"JWT"`.

### 2. The Payload

The payload is also base64url-encoded JSON. Decode it and you get:

```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022
}
```

The payload contains **claims** — statements about a user or subject. There are three types:

**Registered claims** (predefined by the JWT spec):

| Claim | Meaning |
|-------|---------|
| `iss` | Issuer — who issued the token |
| `sub` | Subject — who the token is about |
| `aud` | Audience — who the token is intended for |
| `exp` | Expiration time (Unix timestamp) |
| `nbf` | Not before — token not valid before this time |
| `iat` | Issued at — when the token was created |
| `jti` | JWT ID — unique identifier for this token |

**Public claims**: Any key-value pair — like `name`, `email`, `role`.

**Private claims**: Custom claims agreed upon by two parties, like `plan: "pro"` or `org_id: "acme"`.

### 3. The Signature

The signature is computed by combining the base64url-encoded header, the base64url-encoded payload, and a secret key, then running them through the algorithm specified in the header:

```
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)
```

This signature proves that:
1. The header and payload weren't tampered with
2. The party signing the token held the secret (or private key)

## Why You Need a JWT Decoder

### Reason 1: Inspect Tokens Without Trusting a Third Party

Copy-pasting a JWT into a third-party decoder means you're sending your token to someone else's server. That might be fine for a personal project, but for production tokens containing sensitive claims, that's a security risk.

A client-side JWT decoder processes everything locally. No network request is made.

### Reason 2: Debug Auth Issues Fast

"Users are getting logged out unexpectedly" or "This API endpoint returns 403" — these are often token issues. Is the token expired? Is the `sub` claim what you expected? Is the algorithm what your server expects? A decoder lets you answer these questions in seconds.

### Reason 3: Learn How Auth Systems Work

Inspecting real tokens from apps you use is a great way to understand how authentication systems are designed. You'll see which claims an app uses, how it structures roles, and when tokens expire.

## How to Validate a JWT

Decoding a JWT is not the same as validating it. A JWT can be decoded without verifying its signature — the signature is what makes it trustworthy.

**Never trust a decoded JWT payload alone.** Always verify the signature server-side.

That said, a decoder helps you diagnose validation failures:

| Error | What It Usually Means |
|-------|----------------------|
| `"Signature verification failed"` | The secret key or public key doesn't match what was used to sign |
| `"Token expired"` | The `exp` claim is in the past |
| `"Token not yet valid"` | The `nbf` claim is in the future |
| `"Invalid signature"` | The algorithm doesn't match between client and server |

## Common JWT Pitfalls

### Pitfall 1: Storing Tokens in localStorage

localStorage is accessible to any JavaScript on your page — including third-party scripts. XSS attacks can steal tokens stored there. The `HttpOnly` cookie approach is more secure because JavaScript can't read it.

### Pitfall 2: Not Checking Expiration

A JWT with a 1-year expiration is valid for a year. If the token is compromised, an attacker has a full year of access. Use short expiration times (minutes to hours) and use refresh tokens for long-lived sessions.

### Pitfall 3: Leaking Tokens in URLs

Tokens in URLs can end up in server logs, browser history, and referrer headers. Always send tokens via the `Authorization: Bearer <token>` header, not as a query parameter.

### Pitfall 4: Algorithm Confusion

The `alg: "none"` vulnerability allows attackers to strip the signature. Always validate the algorithm server-side and reject unexpected algorithms:

```javascript
// Dangerous — allows alg:none
const decoded = jwt.verify(token, secret);

// Safe — explicitly specify expected algorithm
const decoded = jwt.verify(token, secret, { algorithms: ['HS256'] });
```

## Reading a JWT in JavaScript

You can decode a JWT without a library:

```javascript
function decodeJWT(token) {
  const [headerB64, payloadB64, signature] = token.split('.');
  
  const decodeBase64 = (str) => {
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
    return JSON.parse(atob(padded));
  };
  
  return {
    header: decodeBase64(headerB64),
    payload: decodeBase64(payloadB64),
    signature
  };
}

const { header, payload } = decodeJWT(token);
console.log(payload.sub); // "1234567890"
console.log(payload.exp); // Unix timestamp — check if expired
```

> **Note:** This decodes but does NOT verify the signature. Always use a proper library like `jose` (Node.js/browser) or `pyjwt` (Python) for verification.

## The Three Types of JWT Claims

**1. Registered claims** — Standard fields defined by RFC 7519. Use them consistently:
- `exp` — Always set an expiration
- `iat` — Set automatically by most libraries
- `iss` — Set your application identifier

**2. Public claims** — Registered in the [IANA JWT registry](https://www.iana.org/assignments/jwt/jwt.xhtml) to avoid collisions:
- `email`, `name`, `picture` — common OAuth/OIDC claims

**3. Private claims** — Custom keys for your application:
- `role: "admin"`, `plan: "pro"`, `org_id: "42"`

## Try It Now

The [JWT Decoder on Toolblip](/tools/jwt-decoder) is 100% client-side. Paste any JWT and instantly see the decoded header, payload, and expiration status. No data is sent to any server.

---

JWTs are the backbone of modern web authentication. Understanding what they contain, how they're signed, and what their pitfalls are will make you a significantly better developer when working with any auth system.
