---
title: How to Generate Random strings Securely in JavaScript
description: >-
  Learn how to generate random strings in JavaScript using crypto-secure
  methods. Covers UUIDs, random tokens, password generators, and common security
  pitfalls.
slug: random-string-generation-javascript
date: '2026-04-17'
category: Developer Tools
tags:
  - javascript
  - security
  - random
  - uuid
  - tokens
  - web-development
author: Toolblip Team
readingTime: 5 min
descriptionSEO: >-
  How to generate cryptographically secure random strings in JavaScript. UUID
  v4, random tokens, passwords — secure methods with code examples.
featuredImage: 'https://api.radtx.com/gradient/0ea5e9-8b5cf6/1200/630'
---

Random strings are everywhere in software — session tokens, password reset links, API keys, UUIDs. Getting them wrong creates security vulnerabilities that are hard to catch. This guide shows you how to do it properly.

## Why It Matters

Computers are deterministic. Generating "random" strings with `Math.random()` or `Date.now()` isn't truly random — it's pseudorandom, predictable, and exploitable. If you use `Math.random()` to generate a password reset token, an attacker who can guess the seed can reset any user's password.

**Rule: always use the Web Crypto API for security-sensitive randomness.**

## Generate a UUID v4

The simplest secure use case — a unique identifier with enough entropy that guessing is impossible.

```javascript
// Modern browsers and Node.js 19+
const uuid = crypto.randomUUID();
console.log(uuid); // "f47ac10b-58cc-4372-a567-0e02e2d5f6b1"

// Node.js fallback (all versions)
import { randomUUID } from 'crypto';
const uuid = randomUUID();
```

**Why this is secure:** 122 bits of cryptographically strong entropy from the OS random number generator. Brute-forcing is computationally infeasible.

## Generate a Random Token

For API keys, session tokens, or password reset links:

```javascript
// Generate a 32-byte (256-bit) random token, base64 encoded
function generateToken(lengthBytes = 32) {
  const bytes = crypto.getRandomValues(new Uint8Array(lengthBytes));
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

const token = generateToken(); // "T8f9KwH3xLR2QpVl_YN7A..."
```

**Key points:**
- `crypto.getRandomValues()` is the browser and Node.js API for secure randomness
- Use `Uint8Array` to get raw random bytes
- Use base64url encoding (not plain base64) for URL-safe tokens
- Strip padding (`=`) to keep it compact

## Generate a Random Password

```javascript
function generatePassword(length = 16) {
  const charset = {
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  };

  const allChars = Object.values(charset).join('');
  const entropy = new Uint8Array(length);
  crypto.getRandomValues(entropy);

  let password = '';
  for (let i = 0; i < length; i++) {
    password += allChars[entropy[i] % allChars.length];
  }

  // Ensure at least one char from each category
  const required = [
    charset.lowercase[entropy[0] % 26],
    charset.uppercase[entropy[1] % 26],
    charset.numbers[entropy[2] % 10],
    charset.symbols[entropy[3] % charset.symbols.length],
  ];
  // Replace first 4 chars with required, rest with random
  return required.join('') + password.slice(4);
}

console.log(generatePassword()); // "Ab3@xK9LmNopQ2rs"
```

**Note:** This approach has a slight bias (modulo arithmetic isn't perfectly uniform), but for passwords it's negligible. For cryptographic keys, use a proper CSPRNG.

## Generate a Cryptographic Key

For signing tokens, encrypting data, or any cryptographic purpose:

```javascript
// Generate a 256-bit (32 byte) key for AES-256
const keyBytes = crypto.getRandomValues(new Uint8Array(32));
const keyHex = Array.from(keyBytes)
  .map(b => b.toString(16).padStart(2, '0'))
  .join('');

console.log(keyHex); // "a4f2c8d3e9b1..." (64 hex chars)

// For use with SubtleCrypto
crypto.subtle.importKey(
  'raw',
  keyBytes,
  { name: 'AES-GCM' },
  false, // not extractable
  ['encrypt', 'decrypt']
);
```

## Common Mistakes to Avoid

### ❌ `Math.random()` for Tokens

```javascript
// NEVER do this
const token = Math.random().toString(36).substring(2);
// Predictable and low entropy
```

`Math.random()` is a PRNG (pseudo-random number generator) with only ~58 bits of state. It's fine for UI randomness (animations, shuffling), not security tokens.

### ❌ `Date.now()` or `timestamp` in Tokens

```javascript
// NEVER do this
const token = btoa(Date.now() + Math.random());
// Entirely predictable — attacker knows approximately when token was created
```

### ❌ Short Tokens

A 6-character alphanumeric token has only ~77 bits of entropy (`log2(62^6)`). That's breakable with commodity hardware in hours. Use at least 128 bits (22 base64 characters) for security-sensitive tokens.

### ❌ Sequential IDs as Secrets

Auto-increment IDs, UUID v1 (time-based), or any enumerable ID are not secrets. They look random but aren't.

## Quick Reference

| Purpose | Method | Bits of Entropy |
|--------|--------|----------------|
| UUID | `crypto.randomUUID()` | 122 bits |
| API token | `crypto.getRandomValues()` + base64url | 256 bits |
| Password | `crypto.getRandomValues()` with charset | ~100 bits |
| Cryptographic key | `crypto.getRandomValues()` | 256 bits |
| Nonce/IV | `crypto.getRandomValues()` | 96–256 bits |

## In Node.js

```javascript
import { randomBytes, randomUUID } from 'crypto';

// Random bytes
const bytes = randomBytes(32); // Buffer of 32 random bytes

// UUID
const uuid = randomUUID();

// Hash-based (for deterministic tokens with a secret)
import { createHmac } from 'crypto';
const token = createHmac('sha256', secret)
  .update(randomBytes(32).toString('hex'))
  .digest('hex');
```

## Useful Tools

- **[UUID Generator](/tools/uuid-generator)** — Generate UUIDs v4 instantly in your browser
- **[Hash Generator](/tools/hash-generator)** — Generate SHA/MD5 hashes
- **[Base64 Encoder](/tools/base64)** — Encode any string to base64

No data leaves your browser. Everything runs client-side using the Web Crypto API.
