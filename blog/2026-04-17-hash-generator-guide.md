---
title: "Hash Generator: MD5, SHA-1, SHA-256, and SHA-512 Explained"
description: "Generate cryptographic hashes in your browser. Understand the difference between MD5, SHA-1, SHA-256, and SHA-512, and learn when to use each one."
publishDate: "2026-04-17"
slug: hash-generator-guide
readingTime: 7 min
tags: ["hash", "cryptography", "security", "md5", "sha256", "developer-tools"]
---

A hash function takes any input — a password, a file, a string — and produces a fixed-length string of characters called a **digest** or **hash**. The same input always produces the same output. But the process is **one-way**: you can't reverse a hash back to the original input.

Hashes are everywhere in software: passwords, file integrity checks, digital signatures, blockchain, git commits. Understanding them makes you a significantly better developer.

## How Hash Functions Work

At a mathematical level, a hash function maps arbitrary-length input to fixed-length output. The best hash functions have three properties:

1. **Deterministic** — same input → same output every time
2. **One-way** — infeasible to reverse the process
3. **Collision-resistant** — extremely unlikely that two different inputs produce the same hash

## The Main Hash Algorithms

### MD5 — Do Not Use for Security

MD5 produces a 128-bit (32-character hex) hash. It was widely used for password storage and file checksums through the 1990s and 2000s.

**MD5 is cryptographically broken for security purposes.** In 2004, researchers demonstrated collision attacks that could produce two different files with the same MD5 hash in seconds. In 2008, researchers showed how to create a fake SSL certificate signed with a compromised MD5 certificate authority.

```bash
# MD5 is still useful for non-cryptographic purposes
echo -n "hello" | md5
# 5d41402abc4b2a76b9719d911017c592

# Never use MD5 for passwords or security
```

**When MD5 is still okay:** Non-cryptographic checksums where collision resistance doesn't matter — like a quick check to verify a file downloaded correctly.

### SHA-1 — Deprecated

SHA-1 produces a 160-bit (40-character hex) hash. It was the backbone of HTTPS certificate signatures for years until it was phased out after collision attacks became practical.

Google demonstrated the first SHA-1 collision in 2017 with the **SHAttered** attack, showing two different PDF files with the same SHA-1 hash.

```bash
echo -n "hello" | shasum -a 1
# aaf4c61ddcc5e8a2dabede0e3e3823a4b7672c85
```

**When SHA-1 is okay:** Git commit hashes (not for security — git uses SHA-1 for content-addressing, not digital signatures). HMAC-SHA1 for some legacy API authentication.

### SHA-256 — The Current Standard

SHA-256 produces a 256-bit (64-character hex) hash. It's part of the SHA-2 family and is currently the recommended hash function for most security applications.

```bash
echo -n "hello" | shasum -a 256
# 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824
```

**SHA-256 is used in:**
- TLS/SSL certificates (replacing SHA-1)
- Bitcoin mining (double SHA-256)
- File integrity (HMAC-SHA-256 for API authentication)
- Password hashing (via bcrypt or Argon2, not plain SHA-256)

### SHA-512 — Higher Security, Longer Hash

SHA-512 produces a 512-bit (128-character hex) hash. It's structurally similar to SHA-256 but with a larger internal state and word size. It's faster on 64-bit processors.

```bash
echo -n "hello" | shasum -a 512
# 9b71d224376dp8d3cc2d81e46f4a2c2c2a4e9e9a7b3b5c8d3e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2
```

## Hashing vs Encryption — The Key Difference

This confuses many developers. **Hashing is not encryption.**

| | Hashing | Encryption |
|--|---------|-----------|
| Purpose | Verify integrity / check password | Keep data confidential |
| Reversible? | No (one-way) | Yes, with the key |
| Key needed? | No | Yes (symmetric or asymmetric) |
| Output used for | Comparing if two things are equal | Decoding the original |

Think of hashing like a **fingerprint**: you can identify a person by their fingerprint, but you can't reconstruct the person from the fingerprint.

## Common Hashing Use Cases

### 1. Password Storage

Never store passwords in plain text. Instead, store the **hash** of the password:

```javascript
// What you store in the database:
// password_hash = "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8"

// What the user types in the login form:
const inputHash = await hashPassword(userInput);
const storedHash = getStoredHashForUser(userId);

if (await bcrypt.compare(inputHash, storedHash)) {
  // Password correct
}
```

**Important:** Don't use plain SHA-256 for passwords — use **bcrypt**, **Argon2**, or **scrypt**. These are specifically designed for passwords and include salting and cost factors that make brute-force attacks much harder.

### 2. File Integrity

Verify a file downloaded correctly by comparing its hash to a known value:

```bash
# Download a file and verify its SHA-256
curl -O https://example.com/software.zip
sha256sum software.zip
# Compare the output to the published hash on the website
```

If the hashes match, the file is intact. If they differ, the file was corrupted in transit or tampered with.

### 3. API Authentication (HMAC)

Many APIs use HMAC (Hash-based Message Authentication Code) to sign requests:

```javascript
const crypto = require('crypto');

function signRequest(secret, method, path, body) {
  const message = `${method}:${path}:${body}`;
  return crypto
    .createHmac('sha256', secret)
    .update(message)
    .digest('hex');
}

const signature = signRequest('secret', 'POST', '/api/orders', '{"qty": 5}');
// Send signature in Authorization header
```

### 4. Git Commits

Git uses SHA-1 to create a content-addressable hash of every commit, blob, tree, and tag. This is why git is hard to tamper with — changing any content changes the hash, breaking all subsequent commit references.

## Why Rainbow Tables Work (And Why You Need Salt)

A **rainbow table** is a precomputed database of common password → hash mappings. Attackers use them to reverse hashes they've stolen from a database.

```
Password    →  MD5 Hash
-----------------------
password   →  5f4dcc3b5aa765d61d8327deb882cf99
123456     →  e10adc3949ba59abbe56e057f20f883e
admin      →  21232f297a57a5a743894a0e4a801fc3
```

If a database stores plain MD5 hashes, an attacker can look up each hash in the rainbow table and immediately find the password.

**Solution: Salt.** A salt is a random value unique to each user, added to the password before hashing:

```javascript
// Without salt — vulnerable to rainbow tables
hash("password") → always the same hash

// With salt — unique per user, rainbow tables useless
hash("password" + "a7f3e2b1") → unique per user
hash("password" + "3c9d4b8f") → different result
```

## Generating Hashes in JavaScript

Modern browsers have a built-in crypto API:

```javascript
// SHA-256
async function sha256(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

await sha256('hello');
// "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824"
```

The Web Crypto API supports `SHA-1`, `SHA-256`, `SHA-384`, and `SHA-512` natively — no library needed.

## Try It Now

The [Hash Generator on Toolblip](/tools/hash-generator) generates MD5, SHA-1, SHA-256, and SHA-512 hashes entirely in your browser. Paste any text or upload a file. Nothing is sent to any server.

---

Hashes are a foundational tool in every developer's security toolkit. Understanding when to use each algorithm, why you should never use MD5 for passwords, and why salts are non-negotiable will save you from some of the most common security mistakes in web development.
