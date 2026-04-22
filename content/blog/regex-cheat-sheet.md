---
title: "Regex Cheat Sheet: 30+ Patterns for Common Tasks (With Live Tester)"
slug: "regex-cheat-sheet"
date: "2026-04-21"
description: "A practical regex cheat sheet with 30+ copy-paste patterns for emails, URLs, phones, dates, and more — plus a live regex tester to try them instantly."
emoji: "🔍"
category: "Developer Tools"
tags: ["regex", "cheatsheet", "developer-tools", "pattern-matching", "tutorial"]
author: "Toolblip Team"
readingTime: "7 min read"
featuredImage: ""
---

Regex (regular expressions) is one of those skills that pays off every time you use it — but the syntax is cryptic enough that you look it up more often than you'd like. This cheat sheet solves that: 30+ patterns you can copy and paste, plus a live tester so you can verify them before using them.

**[Try the Regex Tester right now →](/tools/regex-tester)**

## The Basics

Before the patterns, a quick rundown of regex syntax:

| Token | Meaning |
|-------|---------|
| `.` | Any single character |
| `\d` | Any digit (0-9) |
| `\w` | Any word character (a-z, A-Z, 0-9, _) |
| `\s` | Whitespace (space, tab, newline) |
| `^` | Start of string |
| `$` | End of string |
| `*` | 0 or more |
| `+` | 1 or more |
| `?` | 0 or 1 |
| `{n}` | Exactly n times |
| `{n,m}` | Between n and m times |
| `[abc]` | Any of a, b, or c |
| `[^abc]` | NOT a, b, or c |
| `(...)` | Capture group |
| `\|` | OR |

---

## Email & Username Patterns

### Email Address
```
^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$
```
Matches: `user@example.com` | Doesn't match: `not-an-email`

### Simple Username (letters, numbers, underscores, 3-16 chars)
```
^[a-zA-Z0-9_]{3,16}$
```

### Email (more permissive, RFC 5322 compliant)
```
^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$
```

---

## URL & Web Patterns

### Full URL (http/https with optional auth)
```
^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$
```

### Domain Name Only
```
^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$
```
Matches: `google.com`, `subdomain.example.co.uk` | Doesn't match: `not a domain`

### File Path (Unix-style)
```
^\/(?:[^\/]+\/)*[^\/]+$
```

### IPv4 Address
```
^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$
```

### IPv6 Address
```
^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$

---

## Phone Numbers

### US Phone Number (various formats)
```
^\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$
```
Matches: `(555) 123-4567`, `+1-555-123-4567`, `555.123.4567`

### International E.164
```
^\+[1-9]\d{1,14}$

---

## Numbers & Quantities

### Integer (positive or negative)
```
^-?\d+$
```

### Decimal Number
```
^-?\d+\.?\d*$
```

### Positive Integer Only
```
^[1-9]\d*$
```

### Currency (USD format, e.g. $19.99)
```
^\$?[0-9]+(\.[0-9][0-9])?$
```

### Percentage (0-100)
```
^(100|[1-9]?[0-9])(\.[0-9]+)?%$
```
Matches: `50%`, `100%`, `99.5%` | Doesn't match: `150%`

### Hex Color Code
```
^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$
```
Matches: `#fff`, `#FF5733`, `ff5733`

---

## Date & Time

### ISO Date (YYYY-MM-DD)
```
^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$
```

### US Date (MM/DD/YYYY)
```
^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$
```

### Time (24-hour, with optional seconds)
```
^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$
```

### ISO DateTime
```
^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?$
```

### Cron Expression (basic validation)
```
^[0-9*,/-]+\s+[0-9*,/-]+\s+[0-9*,/-]+\s+[0-9*,/-]+\s+[0-9*,/-]+$

---

## Text & Content

### Markdown Link
```
\[([^\]]+)\]\(([^\)]+)\)
```
Capture groups: `$1` = link text, `$2` = URL

### HTML Tag
```
<([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>(.*?)<\/\1>
```
Matches `<div>...</div>`, `<span>...</span>`, etc.

### Hashtag
```
#[a-zA-Z0-9_]+
```

### Mention (@username)
```
@[a-zA-Z0-9_]+
```

### Slug (URL-safe identifier)
```
^[a-z0-9]+(?:-[a-z0-9]+)*$
```
Matches: `my-blog-post`, `regex-cheat-sheet` | Doesn't match: `My Blog Post!`

### Word Boundary (whole word search)
```
\b(?:word1|word2|word3)\b
```

### Repeated Word (e.g. "the the")
```
\b(\w+)\s+\1\b
```
Useful for catching duplicate words in text.

---

## Code & Data

### JSON Key
```
"([^."]+)":\s*
```
Matches `"key": ` in JSON

### UUID v4
```
[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}
```

### Base64 String
```
^[A-Za-z0-9+/]*={0,2}$
```

### JWT Token
```
^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$
```

### Credit Card Number (basic, Luhn-aware)
```
^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9][0-9])[0-9]{12})$
```

### MAC Address
```
^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$
```

---

## Password & Security

### Strong Password (min 8 chars, upper, lower, number, special)
```
^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$
```
Requires: `@`, `$`, `!`, `%`, `&`, `*`, `?`, or similar special char.

### Minimum Length Only
```
.{8,}
```

### Hexadecimal String
```
^[0-9a-fA-F]+$
```

---

## File Names & Extensions

### Image File Extension
```
\.(jpg|jpeg|png|gif|webp|svg|avif|bmp|tiff)$
```
Case-insensitive: add `i` flag at the end.

### Filename (no path, no special chars)
```
^[a-zA-Z0-9._-]+$
```

### Semver Version Number
```
^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+((?:[0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*)))?$
```

---

## Try It Live

Don't trust a regex until you've tested it. Use Toolblip's regex tester to throw real sample text at these patterns and see matches highlighted live.

**[Open Regex Tester →](/tools/regex-tester)**

Paste your sample text in the top box, paste a pattern below, and see highlighted matches instantly. You can also save patterns for later.

---

## Common Pitfalls

**Greedy vs lazy quantifiers:** `.+` is greedy — it matches as much as possible. Use `.+?` for lazy matching (as little as possible).

**Escaping special chars:** If you want to match a literal `.`, write `\.`, not just `.`. Same for `*`, `+`, `?`, `[`, `]`, and others.

**Multiline mode:** By default, `^` and `$` match start/end of the whole string. Use the `m` flag to make them match per line.

**Case sensitivity:** Patterns are case-sensitive by default. Use the `i` flag for case-insensitive matching.

---

Bookmark this page. With 30+ patterns covering emails, URLs, phones, dates, code, and more — you'll come back to this one.

**[Try Toolblip's Regex Tester →](/tools/regex-tester)**