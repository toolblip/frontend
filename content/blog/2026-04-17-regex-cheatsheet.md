---
title: 'Regular Expressions: A Practical Cheatsheet for Developers'
description: >-
  Regex patterns explained with real examples. Learn to write and debug common
  patterns for validation, extraction, and text processing.
slug: regex-cheatsheet
date: '2026-04-17'
category: Developer Tools
tags:
  - regex
  - javascript
  - validation
  - text-processing
  - developer-tools
author: Toolblip Team
readingTime: 6 min
descriptionSEO: >-
  Regular expression cheatsheet with real-world examples. Learn regex patterns
  for email validation, URL matching, and text extraction.
featuredImage: 'https://api.radtx.com/gradient/0ea5e9-8b5cf6/1200/630'
---

Regular expressions (regex) are one of those tools that every developer uses but few feel confident about. This guide cuts through the confusion with practical patterns you can copy, understand, and adapt.

## Basic Concepts

A regex is a pattern that describes text. It matches strings against that pattern. Most regex syntax works the same way across languages - JavaScript, Python, PHP, Go, Ruby all share the same core syntax.

### Literal Characters

Most characters match themselves. `/cat/` matches the string "cat" anywhere in the text.

### Metacharacters (Need Escaping)

These characters have special meaning and must be escaped with `\` to match literally:

```
. ^ $ * + ? { } [ ] \ | ( )
```

To match a literal dot: `\.`  
To match a literal question mark: `\?`

## Character Classes

### Common Shortcuts

| Pattern | Meaning | Example |
|---------|---------|---------|
| `\d` | Any digit | `/\d{3}/` matches "123" |
| `\D` | Any non-digit | `/\D+/` matches "abc" |
| `\w` | Word character (a-z, A-Z, 0-9, _) | `/\w+/` matches "hello_1" |
| `\W` | Non-word character | `/\W+/` matches "!" |
| `\s` | Whitespace (space, tab, newline) | `/\s+/` matches " \t\n" |
| `\S` | Non-whitespace | `/\S+/` matches "hello" |
| `.` | Any character except newline | `/a.c/` matches "abc" |

### Custom Classes

Define your own set: `[aeiou]` matches any vowel. `[^aeiou]` matches any non-vowel (the `^` negates).

```
/[A-Z]/     - any uppercase letter
/[0-9a-f]/  - any hex digit
/[^\s]/     - any non-whitespace character
```

## Quantifiers

How many times does the previous thing repeat?

| Pattern | Meaning | Example |
|---------|---------|---------|
| `*` | 0 or more | `/ab*c/` matches "ac", "abc", "abbc" |
| `+` | 1 or more | `/ab+c/` matches "abc", "abbc" but not "ac" |
| `?` | 0 or 1 | `/colou?r/` matches "color", "colour" |
| `{n}` | Exactly n | `/\d{4}/` matches "2026" |
| `{n,m}` | Between n and m | `/\d{2,4}/` matches "12", "123", "1234" |
| `{n,}` | n or more | `/\d{2,}/` matches "12", "123", "12345" |

Quantifiers are **greedy** by default - they match as much as possible. Add `?` after them to make them **lazy** (match as little as possible).

```javascript
"<h1>Title</h1>".match(/<.+>/)    // matches entire string (greedy)
"<h1>Title</h1>".match(/<.+?>/)   // matches "<h1>" (lazy)
```

## Anchors

Anchors don't match characters - they match positions.

| Pattern | Meaning | Example |
|---------|---------|---------|
| `^` | Start of string (or line in multiline mode) | `/^hello/` matches "hello world" |
| `$` | End of string (or line in multiline mode) | `/world$/` matches "hello world" |
| `\b` | Word boundary | `/\bcat\b/` matches "cat" but not "category" |
| `\B` | Non-word boundary | `/\Bcat/` matches "category" but not "cat" |

## Groups and Capturing

Parentheses `()` create capturing groups - they extract the content inside them.

```javascript
"user@example.com".match(/^(.+)@(.+)$/)
// Result: ["user@example.com", "user", "example.com"]
// Group 1: "user", Group 2: "example.com"
```

### Non-Capturing Groups

Use `(?:...)` when you need grouping but don't want to capture:

```javascript
"hello world".match(/(?:hello|goodbye) world/)
// Captures nothing, just groups for alternation
```

### Named Groups

JavaScript supports named capturing groups:

```javascript
"2026-04-17".match(/(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/)
// result.groups.year === "2026"
// result.groups.month === "04"
// result.groups.day === "17"
```

## Alternation

The pipe `|` means "or":

```javascript
/(cat|dog|cow)/.test("I have a dog")  // true
/(cat|dog|cow)/.test("I have a mouse") // false
```

## Lookahead and Lookbehind

Assert something before or after the current position without including it in the match.

### Lookahead (Match X followed by Y)

```javascript
/\d+(?= USD)/      // matches "100" in "100 USD" (not "USD")
/\d+(?! EUR)/      // matches "100" in "100 USD" but not "100 EUR"
```

### Lookbehind (Match X preceded by Y)

```javascript
/(?<=USD )\d+/     // matches "100" in "USD 100" (not "USD")
/(?<!EUR )\d+/     // matches "100" in "USD 100" but not "EUR 100"
```

## Common Patterns You Can Copy

### Email Address

```regex
/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
```

Caveat: Real email validation is notoriously hard. This catches 99% of typos but won't reject all invalid addresses.

### URL

```regex
/^https?:\/\/[^\s/$.?#].[^\s]*$/
```

For more robust URL matching, look into the WHATWG URL spec parser in JavaScript: `new URL(string)`.

### Phone Number (US format)

```regex
/^\+?1?\s*\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/
```

Matches: `+1 (555) 123-4567`, `555-123-4567`, `5551234567`, `+15551234567`

### Date (YYYY-MM-DD)

```regex
/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/
```

Matches valid dates only. `2026-04-17` ✅, `2026-04-31` ❌.

### UUID v4

```regex
/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
```

Matches: `f47ac10b-58cc-4372-a567-0e02e2d5f6b1`

### Password Strength

At least 8 characters, one uppercase, one lowercase, one digit:

```regex
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
```

## Regex in JavaScript

```javascript
const text = "Contact us at support@toolblip.com or sales@toolblip.com";

// Test if pattern exists
/\d{4}/.test(text)  // true

// Find first match
text.match(/\w+@\w+\.\w+/)  // ["support@toolblip.com", index: 12, ...]

// Replace all occurrences
text.replace(/\w+@\w+\.\w+/g, "[email protected]")

// Split by pattern
"a,b, c,  d".split(/\s*,\s*/)  // ["a", "b", "c", " d"]

// Find all matches with global flag
"abc123def456".match(/\d+/g)  // ["123", "456"]
```

## Useful Tool

Need to test a regex pattern right now? Try our **[Regex Tester](/tools/regex-tester)** - paste your pattern, enter test strings, and see matches highlighted instantly. Everything runs in your browser.

## Debugging Regex: A Practical Tip

When a regex fails, simplify it. Start with the smallest possible pattern that should match, verify it works, then add one piece at a time.

```javascript
// Broken: /^https?:\/\/[^\s/$.?#].[^\s]*$/
// Step 1: /^https?$/  - does this match?
// Step 2: /^https?:\/\/$/  - now this?
// Step 3: /^https?:\/\/\w+$/  - add a hostname
// Keep going until it breaks
```

Most regex errors are from forgetting to escape a metacharacter or using the wrong quantifier (`*` vs `+`).

## When Not to Use Regex

Regex is powerful but not magic. Don't use it to:

- **Parse HTML** - Use a proper HTML parser. HTML is not a regular language.
- **Validate complex structured formats** - Use a schema validator for XML or JSON Schema.
- **Match nested patterns** - Regex can't match balanced parentheses or nested brackets. Use a parser instead.
- **Process multi-line text casually** - Remember `.` doesn't match newlines unless you use the `s` (dotAll) flag.

Regex is the right tool for: input validation, data extraction, find-and-replace, and pattern matching on flat text.

---

No data leaves your browser. Try our [Regex Tester](/tools/regex-tester) to practice with live examples.
