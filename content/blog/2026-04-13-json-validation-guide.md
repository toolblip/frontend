---
title: 'JSON Validation: How to Find and Fix Broken JSON Fast'
description: >-
  Every developer has pasted JSON into a validator and gotten a cryptic error.
  Here's how to read JSON error messages, understand common mistakes, and
  validate JSON programmatically.
slug: json-validation-guide
date: 2026-04-13T00:00:00.000Z
category: Guide
tags:
  - JSON
  - Validation
  - API
  - Debugging
  - Developer Tools
author: Toolblip Team
readingTime: 5 min
featuredImage: 'https://toolblip.com/api/og?title=JSON%20Validation%3A%20How%20to%20Find%20and%20Fix%20Broken%20JSON%20Fast&category=Guide&date=2026-04-13'
---

# JSON Validation: How to Find and Fix Broken JSON Fast

You've been here. You paste JSON into a tool, an API, or a config file - and get back something like `Unexpected token at position 47`. Or worse: `Invalid JSON` with no further information.

JSON validation errors are fixable once you understand what the parser is actually complaining about. Here's how to read them and fix them fast.

## Why JSON Parsing Fails

JSON has strict rules. The parser is not being pedantic - it's following the spec. Common failure points:

### 1. Trailing Commas

```json
{
  "name": "Toolblip",
  "version": "1.0",   ← trailing comma = error
}
```

JSON parsers expect no comma after the last item in an object or array. Remove the comma.

### 2. Single Quotes

```json
{
  'name': 'Toolblip'   ← single quotes are not valid JSON
}
```

JSON requires double quotes for both keys and string values. Always use `"` not `'`.

### 3. Comments

```json
{
  // This is not valid JSON
  "name": "Toolblip"
}
```

JSON has no concept of comments. If you need comments, move them outside the JSON structure or use a different format.

### 4. Unquoted Keys

```json
{
  name: "Toolblip"   ← unquoted key = error
}
```

JSON requires all keys to be double-quoted strings. `"name"` is valid; `name` is not.

### 5. Trailing Characters After the Closing Bracket

If you get an error at the very end of your JSON, you probably have extra text after the closing `}` or `]`. Check for a stray character, a BOM (byte order mark), or text that got appended accidentally.

### 6. Newlines in Strings

```json
{
  "bio": "Line one
  Line two"   ← raw newline in string = error
}
```

Strings in JSON cannot contain raw newlines. Use `\n` instead:

```json
{
  "bio": "Line one\nLine two"
}
```

## How to Read the Error Position

Many JSON validators report `position X` in the error message. This is the character offset from the start of the string. Here's how to use it:

1. Copy your JSON into a text editor with a character count display
2. Go to character position X
3. Look at the character at that position and the few characters before it

Most errors are at or very near the actual problem - the parser often can't detect the error until it tries to parse what comes next.

## Validating JSON Programmatically

### JavaScript

```javascript
try {
  const parsed = JSON.parse(jsonString);
  console.log('Valid JSON', parsed);
} catch (e) {
  console.error('Invalid JSON:', e.message);
}
```

### Python

```python
import json

try:
    parsed = json.loads(json_string)
    print("Valid JSON", parsed)
except json.JSONDecodeError as e:
    print(f"Invalid JSON at position {e.pos}: {e.msg}")
```

### PHP

```php
$result = json_decode($json_string);
if (json_last_error() !== JSON_ERROR_NONE) {
    echo "Invalid JSON: " . json_last_error_msg();
}
```

## Pro Tips

### 1. Format Before Debugging

Minified JSON is nearly impossible to read. Always format it first - one misplaced comma is easy to miss in a wall of text.

**[Format your JSON →](/tools/json-formatter)**

### 2. Validate in Your Editor

Most code editors have JSON validation built in:
- **VS Code** - errors shown in the Problems panel, red underlines
- **Sublime Text** - JSON syntax checking via `sublime-json`
- **IntelliJ/WebStorm** - real-time validation with line-level error markers

### 3. Use jq for Command-Line JSON

`jq` is a command-line JSON processor. Great for validating, querying, and transforming JSON in scripts:

```bash
# Validate JSON
echo '{"name":"Toolblip"}' | jq empty   # succeeds, no output
echo '{"name"}' | jq empty              # error: parse error

# Pretty print
cat data.json | jq .
```

### 4. Check for BOM Issues

If your JSON validates in a browser tool but fails in code, you might have a UTF-8 BOM (byte order mark). This invisible character `EF BB BF` at the start of a file confuses many JSON parsers. Save your file as "UTF-8 without BOM" in your editor.

## JSON vs JSONC

If you're working in VS Code, your `settings.json` or `tsconfig.json` might be JSONC - JSON with Comments. VS Code uses JSONC to allow `//` and `/* */` comments in config files. These are **not valid JSON** and will fail if parsed with a standard JSON parser.

## TL;DR Error Guide

| Error | Cause |
|-------|-------|
| `Unexpected token` | Bad character, usually a quote or comma issue |
| `Unexpected end of JSON` | Missing closing bracket or brace |
| `Unexpected number` | Missing quotes around a string value |
| `Unexpected string` | Unquoted key or wrong quote type |
| `Missing : after property` | Key without its colon separator |
| `Missing , after property` | Missing comma between fields |
| `Position X` | Count X characters from start to find the problem |

**[Validate and format your JSON →](/tools/json-formatter)**

Paste any JSON - formatted, minified, or broken - and get back a clean error message with the exact line and character position of the problem.
