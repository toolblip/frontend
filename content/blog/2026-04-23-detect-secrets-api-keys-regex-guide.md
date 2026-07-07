---
title: "How to Detect Secrets and API Keys in Text with Regex (And Why Blind Scanning Is Dangerous)"
description: "Learn which regex patterns actually catch secrets, why naive scanning creates false positives that waste developer time, and how to build a secret detector that doesn't cry wolf."
date: 2026-04-23
category: Developer Tools
tags: ["regex", "security", "api-keys", "secrets", "detection", "developer-tools", "privacy"]
author: "Toolblip Team"
readingTime: 10 min
featuredImage: 'https://toolblip.com/api/og?title=How%20to%20Detect%20Secrets%20and%20API%20Keys%20in%20Text%20with%20Regex%20%28And%20Why%20Blind%20Scanning%20Is%20Dangerous%29&category=Developer%20Tools&date=2026-04-23'
---

Every few months someone commits a Slack bot token to a public GitHub repo, an API key appears in a Stack Overflow post, or a production config leaks in a support ticket screenshot. Automated scanners catch some of these  -  but not all. And the ones that slip through often do so because a regex was too loose, too strict, or tested against the wrong kind of input.

This guide covers what makes secret detection regex actually work: realistic patterns for common credential formats, the false positive problem that makes blind scanning unreliable, and a repeatable process for building detection logic you can trust.

If you want to test patterns as you read, open [Toolblip's Regex Tester](/tools/regex-tester) and paste your candidate patterns. For breaking down a complex pattern into plain English, use the [Regex Explainer](/tools/regex-explainer).

## Why Simple Regex Fails for Secret Detection

Most developers start with something like this:

```regex
[A-Za-z0-9]{20,}
```

The intent: find a long alphanumeric string that looks like an API key. The result: matches email addresses, UUIDs, base64 strings, version numbers, and commit hashes  -  none of which are secrets.

A secret detection pattern needs to match the **format** of a credential, not just any long string. That means understanding what each credential type actually looks like.

## Common Secret Formats and Their Patterns

### GitHub Personal Access Token

```
ghp_[a-zA-Z0-9]{36}
```

GitHub PATs start with `ghp_` followed by 36 alphanumeric characters. This prefix makes them relatively easy to detect without excessive false positives.

```javascript
const pattern = /ghp_[a-zA-Z0-9]{36}/g;

const test = "Generated token: ghp_1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p";
console.log(pattern.test(test)); // true
```

### AWS Access Key ID

```
AKIA[0-9A-Z]{16}
```

AWS key IDs always begin with `AKIA` followed by 16 uppercase letters or digits. Note that this detects the ID only  -  the secret key itself is a 40-character string without a reliable prefix for detection.

```javascript
const awsPattern = /AKIA[0-9A-Z]{16}/g;

const configLine = "AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE";
console.log(awsPattern.test(configLine)); // true
```

### Generic API Key (common vendor patterns)

Many API keys follow a pattern of a prefix + long alphanumeric string. Some common formats:

```javascript
// Stripe keys (sk_live_...)
const stripePattern = /sk_live_[a-zA-Z0-9]{24,}/g;

// OpenAI API keys (sk-...)
const openaiPattern = /sk-[a-zA-Z0-9]{48}/g;

// SendGrid keys (SG....)
const sendgridPattern = /SG\.[a-zA-Z0-9_-]{22}\.[a-zA-Z0-9_-]{43}/g;
```

### JWT Tokens

JWTs are Base64-encoded but distinguishable by structure: three dot-separated Base64URL segments.

```javascript
const jwtPattern = /eyJ[a-zA-Z0-9_-]+\.eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g;
```

This is useful for detecting accidentally-exposed tokens in logs, configuration files, or paste sites. Note: matching the structure does not mean you can decode and read the payload without the signature  -  but detecting the presence of a JWT is still valuable for security audits.

### Generic Bearer Tokens in Headers

```
Bearer [a-zA-Z0-9_-]{20,}
```

Authorization headers often contain long bearer tokens. Detecting `Bearer ` followed by a substantial token string catches many API key leaks without matching short session IDs.

```javascript
const bearerPattern = /Bearer\s+[a-zA-Z0-9_-]{20,}/gi;

const logLine = "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
console.log(bearerPattern.test(logLine)); // true
```

### Private Key Files

SSH and private key headers are distinctive:

```javascript
// SSH private key
const sshKeyPattern = /-----BEGIN (RSA |DSA |EC |OPENSSH |PGP )?PRIVATE KEY-----/g;

// GCP service account JSON
const gcpSaPattern = /"type":\s*"service_account"/g;
```

### Database Connection Strings

Connection strings with embedded credentials are a common leak:

```javascript
// PostgreSQL
const pgConnPattern = /postgres(?:ql)?:\/\/[^:]+:[^@]+@/g;

// MySQL
const mysqlConnPattern = /mysql:\/\/[^:]+:[^@]+@/g;

// MongoDB
const mongoConnPattern = /mongodb(?:\+srv)?:\/\/[^:]+:[^@]+@/g;
```

These patterns match connection strings containing a username and password before the `@` symbol. They are useful for scanning configuration files, backup scripts, and deployment manifests.

## The False Positive Problem

A detection pattern that fires on everything fires on nothing useful.

Consider a security scanner that flags every 20+ character alphanumeric string as a potential secret. Running it against a codebase produces thousands of false positives: code comments, error messages, version strings, and git commit hashes. The team starts ignoring the scanner. Real leaks stop surfacing.

The key is specificity:

| Pattern | Matches | Does Not Match |
|---------|---------|----------------|
| `AKIA[0-9A-Z]{16}` | AWS key IDs | Email addresses, generic strings |
| `ghp_[a-zA-Z0-9]{36}` | GitHub PATs | Short tokens, UUIDs |
| `sk-[a-zA-Z0-9]{48}` | OpenAI keys | Generic 40-char strings |

Test your patterns against realistic non-secret text. A good detection pattern should have high precision (few false positives) and reasonable recall (catches the target format).

## Context-Aware Detection: When Format Is Not Enough

Some credential formats are ambiguous on their own. A UUID looks like many other things. A 32-character hex string could be an MD5 hash, a database ID, or a password reset token.

For these cases, context matters. A few heuristics:

**Surrounding keywords**  -  Words like `password`, `secret`, `token`, `key`, `api`, `auth`, `bearer`, `credential` in the surrounding text raise the probability that a matched string is actually a secret.

```javascript
// Look for secrets near keyword context
const contextAwarePattern = /(?:api[_-]?key|secret|password|token|auth|bearer)\s*[:=]\s*['"]?([a-zA-Z0-9_-]{20,})/gi;
```

**File path or variable name**  -  In code, secrets often appear in variables named `API_KEY`, `SECRET_TOKEN`, `AWS_SECRET`, or `PRIVATE_KEY`. Scanning variable assignments alongside the values can reduce false positives significantly.

**Entropy analysis**  -  High randomness (long alphanumeric strings with no repeated patterns) is more characteristic of cryptographic keys than of IDs or version numbers. This is a more advanced technique, but worth noting for targeted scanning tools.

## Scanning Binary and Text Files

Real secret leaks happen in more places than `.env` files:

- **Log files**  -  Request logs, application logs, and debug output often contain authorization headers with bearer tokens
- **Configuration dumps**  -  CI/CD pipeline configs, Terraform files, Kubernetes manifests
- **Database backups**  -  SQL dumps with connection strings
- **Chat transcripts**  -  Slack messages, support tickets, Stack Overflow posts with code samples

For scanning a text file in a browser, copy the content and use [Toolblip's Regex Tester](/tools/regex-tester) to run your patterns and see highlighted matches. For longer multi-file scanning, a CLI tool or CI integration is more practical.

For parsing nested JSON strings (like a log line containing a stringified JSON payload with an embedded token), use [Toolblip's JSON Path Tester](/tools/json-path-tester) to extract and inspect the relevant fields.

## What Regex Cannot Do

A regex pattern can tell you a string **looks like** a secret. It cannot tell you whether that string is:

- Actually active or already revoked
- A production key or a test key
- Present in a private repository or a public one
- Being used maliciously or just sitting dormant

Detection is the first step. Response and remediation are separate workflows. Consider combining regex detection with:

- A secret scanning service (GitHub Secret Scanning, GitLab Secret Detection, TruffleHog)
- Rate limiting and key rotation policies
- Immediate revocation and re-issuance procedures

Regex is fast and useful for initial detection. It is not a substitute for a full secrets management strategy.

## A Practical Detection Checklist

Before shipping any secret detection logic, verify:

- [ ] Pattern matches the target format (tested against known samples)
- [ ] Pattern does not fire on common non-secret strings in your codebase
- [ ] Detection works in relevant file types: source code, configs, logs, JSON/YAML payloads
- [ ] Matched strings are confirmed as secrets by a human before triggering alerts
- [ ] The detection does not accidentally log or exfiltrate the detected secrets (ironic but common)
- [ ] Revocation and rotation procedures are documented for each secret type you detect

## Regex Patterns for Common Secret Types

Quick reference for the patterns discussed in this guide:

```javascript
const patterns = {
  githubPat: /ghp_[a-zA-Z0-9]{36}/g,
  awsAccessKey: /AKIA[0-9A-Z]{16}/g,
  stripeKey: /sk_live_[a-zA-Z0-9]{24,}/g,
  openaiKey: /sk-[a-zA-Z0-9]{48}/g,
  jwt: /eyJ[a-zA-Z0-9_-]+\.eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g,
  bearerToken: /Bearer\s+[a-zA-Z0-9_-]{20,}/gi,
  sshPrivateKey: /-----BEGIN (RSA |DSA |EC |OPENSSH |PGP )?PRIVATE KEY-----/g,
  genericApiKey: /(?:api[_-]?key|secret|password|token|auth|bearer)\s*[:=]\s*['"]?([a-zA-Z0-9_-]{20,})/gi
};
```

Test these against your actual codebase before relying on them. Adjust length thresholds based on the credential formats used by your vendors and infrastructure.

## Browser-Based Secret Scanning

For quick ad-hoc scans  -  a pasted log file, a config snippet, a code fragment  -  browser-based tools are practical because nothing leaves your machine. [Toolblip's Regex Tester](/tools/regex-tester) runs entirely client-side, so sensitive content you paste for scanning never hits a server.

This is especially relevant for:

- Scanning production log excerpts you cannot share externally
- Checking a configuration file before sharing it in a support ticket
- Verifying that a code snippet in a Stack Overflow question does not contain live credentials

For teams processing large codebases, integrating secret detection into a CI pipeline with proper secret management is the sustainable approach. For one-off checks and emergency situations, a browser tool closes the gap.

## Related Tools

- [Regex Tester](/tools/regex-tester)  -  Test detection patterns against sample text
- [Regex Explainer](/tools/regex-explainer)  -  Break down complex patterns into readable English
- [JWT Decoder](/tools/jwt-decoder)  -  Inspect decoded JWT payloads without sending the token anywhere
- [Hash Generator](/tools/hash-generator)  -  Generate or identify hash types for verification
- [Base64 Encoder/Decoder](/tools/base64-encoder-decoder)  -  Decode embedded credentials in Base64 strings

## Further Reading

- [JWT Security Checklist](/blog/jwt-security-checklist)  -  Validating and securing JWT-based authentication
- [Identify Hash Types: MD5, SHA1, SHA256](/blog/identify-hash-md5-sha1-sha256)  -  Matching hash formats to detection patterns
- [Why URL Encoding Breaks APIs](/blog/url-encoding-api-bugs)  -  Related encoding issues that often accompany secret leaks in URLs