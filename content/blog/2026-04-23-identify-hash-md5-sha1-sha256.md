---
featuredImage: 'https://toolblip.com/api/og?title=Identify%20Any%20Hash%3A%20MD5%2C%20SHA-1%2C%20SHA-256%2C%20bcrypt%2C%20and%20More&category=Developer%20Tools&date=2026-04-23'
title: "Identify Any Hash: MD5, SHA-1, SHA-256, bcrypt, and More"
description: "Learn how to identify common hash types by length, format, and prefixes, then verify them safely with browser-based developer tools."
date: 2026-04-23
category: Developer Tools
---

You found a hash in a database export, log file, API response, old migration script, or password reset flow. It looks like random characters:

```text
5f4dcc3b5aa765d61d8327deb882cf99
```

Is it MD5? SHA-1? SHA-256? bcrypt? Something else entirely?

That question comes up constantly during debugging, security audits, data migrations, and incident response. The tricky part is that a hash does not usually announce its algorithm. Most hash outputs are just fixed-length strings. A 64-character hexadecimal value could be SHA-256, but it could also be something else that happens to output 256 bits. A bcrypt hash is easier because it includes a prefix like `$2b$`, but many hashes are not that friendly.

This guide shows how to identify likely hash algorithms from visible clues, what those clues can and cannot prove, and how to use Toolblip's [Hash Identifier](/tools/hash-identifier) and [Hash Generator](/tools/hash-from-text) to investigate safely in your browser.

## What Is a Hash?

A hash function takes input data and produces a fixed-size fingerprint. The same input always produces the same output, but a tiny change in the input should produce a completely different result.

For example, the MD5 hash of `password` is:

```text
5f4dcc3b5aa765d61d8327deb882cf99
```

The MD5 hash of `Password` with a capital `P` is completely different:

```text
dc647eb65e6711e155375218212b3964
```

Hashes are used for file integrity checks, cache keys, deduplication, database identifiers, digital signatures, password storage, and many other developer workflows. But not all hash algorithms are appropriate for all jobs. MD5 and SHA-1 are obsolete for security-sensitive use. SHA-256 is fine for integrity checks. Passwords should use slow password hashing algorithms such as bcrypt, scrypt, Argon2, or PBKDF2.

That is why identifying a hash matters. If you discover MD5 in a password table, you have a security issue. If you discover SHA-256 in a file checksum column, that may be perfectly normal.

## The Fastest Way to Identify a Hash

The practical first pass is simple:

1. Check the character set: hex, base64, decimal, or a structured format.
2. Count the length.
3. Look for prefixes such as `$2b$`, `$argon2id$`, or `$pbkdf2`.
4. Compare the result with common hash formats.
5. Verify with known inputs if you have access to the original value.

Toolblip's [Hash Identifier](/tools/hash-identifier) automates the first four steps. Paste a hash, and it suggests likely algorithms based on format, length, and known prefixes. It runs in your browser, so you do not have to upload suspicious data or internal identifiers to a third-party server.

## Common Hash Formats by Length

Length is the easiest clue. It is not proof, but it quickly narrows the possibilities.

### 32 Hex Characters: Usually MD5

Example:

```text
5f4dcc3b5aa765d61d8327deb882cf99
```

A 32-character hexadecimal string represents 128 bits. The most common match is MD5.

MD5 is still seen in legacy systems, file checksums, old APIs, and non-security cache keys. It should not be used for password storage, signatures, or tamper-resistant verification because practical collision attacks exist.

If you see a 32-character hex value in a database column named `password`, `passwd`, `token`, or `secret`, treat that as a red flag.

### 40 Hex Characters: Usually SHA-1

Example:

```text
5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8
```

A 40-character hexadecimal string represents 160 bits. The most common match is SHA-1.

SHA-1 was widely used in older systems, Git object IDs, file integrity checks, and legacy authentication flows. Like MD5, SHA-1 is no longer recommended for security-sensitive collision resistance. It may still appear in compatibility contexts, but new systems should prefer SHA-256 or better.

### 56 Hex Characters: Often SHA-224

Example:

```text
730e109bd7a8a32b1cb9d9a09aa2325d2430587ddbc0c38bad911525
```

A 56-character hexadecimal string is 224 bits. SHA-224 is less common than SHA-1 or SHA-256, but it exists in some cryptographic libraries and compliance-driven systems.

If you encounter this length, do not assume it is custom. Check whether the application uses SHA-2 family variants.

### 64 Hex Characters: Usually SHA-256

Example:

```text
5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8
```

A 64-character hexadecimal string represents 256 bits. SHA-256 is one of the most common modern hash algorithms.

You will see SHA-256 in API signatures, webhook verification, file checksums, blockchain tooling, package integrity checks, and security-conscious application code. For general integrity checks, SHA-256 is a good default.

But SHA-256 alone is not enough for passwords. Fast hashes are designed to be fast; password hashes should be intentionally slow and salted.

### 96 Hex Characters: Often SHA-384

A 96-character hexadecimal string represents 384 bits and is commonly SHA-384. It is less common in everyday web development, but it appears in TLS, signing systems, and applications that use SHA-2 variants for compliance or interoperability.

### 128 Hex Characters: Usually SHA-512

A 128-character hexadecimal string represents 512 bits. The most common match is SHA-512.

SHA-512 is used for integrity checks, cryptographic protocols, and some password-hashing constructions. Again, a raw SHA-512 hash is not a complete password storage strategy by itself.

## Prefixes Make Password Hashes Easier to Spot

Modern password hashes often include metadata inside the stored string. That metadata may tell you the algorithm, cost factor, salt, and hash value.

### bcrypt

Example:

```text
$2b$12$wJ8Y6Q0vP1QGqJqH8Q8g6uQ8Yg0QHq5wz0gq8o6v9x0ZqJ2r9Xb2a
```

bcrypt hashes usually start with:

```text
$2a$
$2b$
$2y$
```

The number after the prefix is the cost factor. In `$2b$12$...`, the cost is `12`. Higher costs are slower to compute, which makes brute-force attacks more expensive.

### Argon2

Example:

```text
$argon2id$v=19$m=65536,t=3,p=4$...
```

Argon2 hashes are easy to recognize because they start with `$argon2i$`, `$argon2d$`, or `$argon2id$`. For most password storage use cases, Argon2id is the recommended variant.

### PBKDF2

PBKDF2 formats vary by framework. Some include obvious prefixes; others are stored as separate database columns for algorithm, iterations, salt, and derived key.

You might see strings like:

```text
pbkdf2_sha256$600000$salt$hash
```

Django, for example, stores password hashes in a structured format that includes the algorithm and iteration count.

## Why Hash Identification Is Not Exact

A hash identifier can tell you likely algorithms, not guaranteed algorithms.

That limitation matters. Many algorithms can produce the same length. A 64-character hex string strongly suggests SHA-256, but it could also be BLAKE2s, SHA3-256, Keccak-256, a truncated SHA-512 value, or a custom encoding. Length and character set are clues, not cryptographic proof.

The only reliable confirmation is to hash a known original input with the suspected algorithm and compare the output.

For example, if you believe this is SHA-256 of `password`:

```text
5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8
```

Use Toolblip's [Hash Generator](/tools/hash-from-text), enter `password`, choose SHA-256, and compare the result. If it matches exactly, you have confirmed the algorithm for that input.

## Safe Debugging Workflow

Here is a practical workflow when you inherit an unknown hash.

### 1. Paste It Into a Browser-Based Identifier

Start with [Hash Identifier](/tools/hash-identifier). It gives you likely candidates without requiring a CLI install or account.

Avoid pasting sensitive production password hashes into random online tools that process data server-side. Even though a hash is not the original password, it can still be sensitive. Attackers can use leaked hashes for offline cracking attempts.

### 2. Check the Surrounding Context

The column name, file name, and application code often reveal more than the hash itself.

Look for clues like:

```text
password_hash
checksum
signature
etag
sha256
md5sum
content_digest
```

A hash stored beside a `salt` column may be part of a password hashing scheme. A hash stored beside a file path may be a checksum. A hash in an HTTP response might be an ETag or content digest.

### 3. Search the Codebase

If you have the source code, search for hashing calls:

```bash
grep -R "sha256\|sha1\|md5\|bcrypt\|argon2\|pbkdf2" .
```

In JavaScript/Node.js, look for patterns like:

```js
import crypto from "node:crypto";

const digest = crypto
  .createHash("sha256")
  .update(value)
  .digest("hex");
```

In Python, look for:

```py
import hashlib

digest = hashlib.sha256(value.encode()).hexdigest()
```

These code paths usually confirm the algorithm faster than guessing from length alone.

### 4. Test With a Known Value

If you can reproduce the original input, generate hashes using likely candidates and compare. This is especially useful when migrating legacy data or validating old webhook signing code.

Use [Hash Generator](/tools/hash-from-text) to compare MD5, SHA-1, SHA-256, SHA-512, and related outputs quickly.

## Common Developer Mistakes

### Mistake 1: Treating MD5 as Secure Because It Looks Random

MD5 output looks random, but MD5 is broken for collision resistance and too fast for password storage. If you only need a quick non-security checksum, MD5 may appear in legacy workflows. For anything security-sensitive, choose a modern alternative.

### Mistake 2: Using SHA-256 Directly for Passwords

SHA-256 is strong for integrity checks, but it is fast. Attackers can try huge numbers of password guesses per second against leaked raw SHA-256 password hashes.

For passwords, use bcrypt, Argon2id, scrypt, or PBKDF2 with a high iteration count and unique salt.

### Mistake 3: Assuming Base64 Means Encryption

Base64 is encoding, not hashing and not encryption. A string like this:

```text
cGFzc3dvcmQ=
```

is just Base64 for `password`. You can decode it with a [Base64 Encoder/Decoder](/tools/base64-encoder). If the data is reversible without a key, it is not a hash.

### Mistake 4: Ignoring Salts

A salted password hash may not match a simple hash generator output because the salt is part of the input or stored metadata. That is expected. Password hashing libraries combine the password, salt, cost parameters, and algorithm-specific settings.

## Quick Reference Table

| Visible pattern | Common match | Notes |
|---|---|---|
| 32 hex chars | MD5 | Legacy, not secure for passwords |
| 40 hex chars | SHA-1 | Legacy, avoid for new security-sensitive systems |
| 56 hex chars | SHA-224 | Less common SHA-2 variant |
| 64 hex chars | SHA-256 | Common for checksums and signatures |
| 96 hex chars | SHA-384 | Often protocol/compliance related |
| 128 hex chars | SHA-512 | Common SHA-2 variant |
| Starts `$2a$`, `$2b$`, `$2y$` | bcrypt | Password hashing format with cost |
| Starts `$argon2id$` | Argon2id | Modern password hashing choice |
| Starts `pbkdf2_` or similar | PBKDF2 | Framework-specific formats vary |

## Use the Right Tool for the Job

If you have an unknown hash, start with [Hash Identifier](/tools/hash-identifier). If you need to reproduce or verify a digest, use [Hash Generator](/tools/hash-from-text). If you are dealing with tokens rather than hashes, use [JWT Decoder](/tools/jwt-decoder). If the string is reversible encoding, try [Base64 Encoder/Decoder](/tools/base64-encoder) or [URL Encode/Decode](/tools/url-encode).

The key is to separate three ideas that often get mixed together:

- **Encoding** changes representation and is reversible.
- **Hashing** creates a one-way fingerprint.
- **Encryption** protects data with a key and is reversible only with that key.

Once you know which category you are dealing with, debugging becomes much less mysterious.

## Final Takeaway

You can often identify a hash type by length, character set, and prefixes. A 32-character hex string is probably MD5. A 40-character hex string is probably SHA-1. A 64-character hex string is probably SHA-256. Prefixes like `$2b$` and `$argon2id$` are strong clues for password hashing algorithms.

But "probably" is the important word. Hash identification is a best-effort process until you verify against a known input or inspect the code that generated it.

Use Toolblip's browser-based [Hash Identifier](/tools/hash-identifier) for the first pass, then confirm with [Hash Generator](/tools/hash-from-text) when you can. It is fast, free, and keeps your debugging data on your machine.