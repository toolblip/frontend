---
title: 'How to Pretty-Print (and Minify) JSON in Any Language'
description: >-
  A practical cheatsheet for formatting and minifying JSON from the command line,
  Python, Node.js, PHP, and the browser — plus the fastest no-install option for
  when you just need it done now.
date: '2026-04-23'
category: Developer Tools
tags:
  - json
  - developer-tools
  - command-line
  - python
  - nodejs
  - bash
  - cheatsheet
  - productivity
author: Toolblip Team
readingTime: 7 min
featuredImage: 'https://api.radtx.com/gradient/14b8a6-f59e0b/1200/630'
---

JSON is everywhere. Most of the time you get it formatted. Then you get a single-line blob from a log file, an API response, or a colleague's config, and suddenly you can't read anything.

This is a cheatsheet for the most common ways to pretty-print and minify JSON — from the shell, from Python, from Node.js, from PHP, and from the browser. Bookmark it.

## Pretty-Print JSON in the Browser (No Install)

When you're not in a terminal and just need to paste something and read it:

**[Toolblip JSON Formatter →](/tools/json-formatter)**

Paste your JSON, get formatted output with syntax highlighting, line numbers, and exact error positions if something's wrong. No install. No signup. Works offline.

Supports: format, minify, validate, and JSONPath queries.

---

## Pretty-Print in Bash

### Using `jq`

`jq` is the standard JSON processor for shell scripts. If it's not installed:

```bash
# macOS
brew install jq

# Ubuntu/Debian
sudo apt install jq

# Alpine
apk add jq
```

Pretty-print (2-space indent is default):
```bash
echo '{"user":{"name":"Ada","id":42,"roles":["admin","editor"]}}' | jq
```

Output:
```json
{
  "user": {
    "name": "Ada",
    "id": 42,
    "roles": [
      "admin",
      "editor"
    ]
  }
}
```

Custom indent with `--indent`:
```bash
cat file.json | jq --indent 4
```

Compact (minify):
```bash
cat file.json | jq -c
```

Read from a file:
```bash
jq . config.json
```

### Using `python3` (no install needed)

Python has built-in JSON support. Works on any system with Python 3:

```bash
# Pretty-print with 2-space indent
python3 -c "import json; print(json.dumps(json.load(open('config.json')), indent=2))"

# One-liner alias for your shell profile
alias jsonpp='python3 -c "import json,sys; print(json.dumps(json.load(sys.stdin), indent=2))"'
cat file.json | jsonpp
```

Minify with Python:
```bash
python3 -c "import json,sys; print(json.dumps(json.load(open('config.json'))))"
```

### Using `node` (if Node.js is installed)

Node.js has `JSON.stringify` built in, no packages needed:

```bash
# Pretty-print
node -e "console.log(JSON.stringify(JSON.parse(require('fs').readFileSync(0,'utf8')), null, 2))" < file.json

# Minify
node -e "console.log(JSON.stringify(JSON.parse(require('fs').readFileSync(0,'utf8'))))" < file.json
```

---

## Pretty-Print in Python

You probably already know this, but it's worth having in every Python project's utility module:

```python
import json

# Load and pretty-print
with open('data.json', 'r') as f:
    data = json.load(f)

print(json.dumps(data, indent=2, sort_keys=True))
```

**Options for `json.dumps`:**

| Parameter | What it does |
|---|---|
| `indent=2` | 2-space indentation |
| `indent='\t'` | Tab indentation |
| `sort_keys=True` | Sort object keys alphabetically |
| `ensure_ascii=False` | Preserve Unicode characters |
| `separators=(',', ': ')` | Compact single-line items |

Minify in Python:
```python
compact = json.dumps(data, separators=(',', ':'))
# No spaces after colons or commas — smallest possible output
```

Read from a string (e.g., from an API response):
```python
raw_json = '{"id":1,"name":"Server","status":"running"}'
pretty = json.dumps(json.loads(raw_json), indent=2)
print(pretty)
```

### Pretty-Print in Python: Real-World Shell Script Pattern

Common pattern for checking JSON config in CI/CD:

```bash
#!/bin/bash
# validate-json.sh — exits 0 if valid JSON, 1 otherwise
python3 -c "import json; json.load(open('$1'))" && echo "Valid JSON" || echo "Invalid JSON"
```

---

## Pretty-Print in Node.js

Node's standard library handles JSON formatting:

```javascript
const fs = require('fs');

// Read and pretty-print
const data = JSON.parse(fs.readFileSync('package.json', 'utf8'));
console.log(JSON.stringify(data, null, 2));

// Minify
const compact = JSON.stringify(data);
console.log(compact);
```

### Pretty-Print in Node.js with `util.inspect`

For debugging objects in Node's REPL or scripts:

```javascript
const util = require('util');
const obj = { name: 'Server', cores: 16, memory: { ram: '64GB', swap: '8GB' } };

// Deep inspection with custom depth and colors
console.log(util.inspect(obj, { depth: null, colors: true }));
```

### Pretty-Print JSON in Node.js: One-Liner

Drop this into any Node script or REPL:

```javascript
const pp = obj => console.log(JSON.stringify(obj, null, 2));
pp({ id: 1, name: 'API', version: '3.1.0' });
```

---

## Pretty-Print in PHP

### Using `json_encode` with flags

```php
<?php
$json = file_get_contents('config.json');
$data = json_decode($json, true);

// Pretty-print (JSON_PRETTY_PRINT available PHP 5.4+)
echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
```

**Common `json_encode` flags:**

| Flag | Effect |
|---|---|
| `JSON_PRETTY_PRINT` | Adds whitespace to format output |
| `JSON_UNESCAPED_SLASHES` | Don't escape forward slashes |
| `JSON_UNESCAPED_UNICODE` | Preserve Unicode characters |
| `JSON_INVALID_UTF8_IGNORE` | Ignore invalid UTF-8 bytes |

Minify in PHP:
```php
// Remove all unnecessary whitespace
$minified = json_encode($data, JSON_UNESCAPED_SLASHES);
```

### Validate JSON in PHP

```php
function isValidJson(string $input): bool {
    json_decode($input);
    return json_last_error() === JSON_ERROR_NONE;
}

if (!isValidJson($raw)) {
    echo "JSON error: " . json_last_error_msg();
}
```

---

## Pretty-Print in Go

Using Go's `encoding/json` with `MarshalIndent`:

```go
package main

import (
    "encoding/json"
    "fmt"
    "os"
)

func main() {
    data := map[string]interface{}{}
    json.Unmarshal([]byte(os.Args[1]), &data)

    out, _ := json.MarshalIndent(data, "", "  ")
    fmt.Println(string(out))
}
```

Minify in Go:
```go
out, _ := json.Marshal(data) // no indentation
```

---

## Real-World Shell One-Liners

Save these as shell aliases or paste them directly:

```bash
# Pretty-print any JSON file
alias jsonpp='python3 -c "import json,sys; print(json.dumps(json.load(sys.stdin), indent=2))"'

# Pretty-print and page through output
cat file.json | jsonpp | less -R

# Check if JSON is valid (exit code 0 = valid)
python3 -c "import json,sys; json.load(sys.stdin)" < file.json && echo "✓ Valid" || echo "✗ Invalid"

# Minify JSON
cat file.json | python3 -c "import json,sys; print(json.dumps(json.load(sys.stdin)))" > file.min.json

# Pretty-print from curl response
curl -s https://api.example.com/data | jq

# jq: extract specific field and pretty-print
curl -s https://api.example.com/data | jq '.user.name'

# jq: filter and format
curl -s https://api.example.com/data | jq '[.items[] | select(.status == "active")]'
```

---

## The Browser Fallback

If you're on a system without Python or jq, and you don't have Node installed:

**Open [Toolblip JSON Formatter](/tools/json-formatter)** — it's a browser tab, works on any OS, and handles JSON of any size.

Paste a malformed JSON blob and it shows you:
- The formatted output with syntax highlighting
- The exact character position of the first parse error
- A minified version you can copy directly

---

## Quick Reference Table

| Environment | Pretty-Print | Minify | Notes |
|---|---|---|---|
| Bash / jq | `jq . file.json` | `jq -c . file.json` | Install: `brew/apt install jq` |
| Python | `json.dumps(data, indent=2)` | `json.dumps(data)` | Built-in, no install |
| Node.js | `JSON.stringify(data, null, 2)` | `JSON.stringify(data)` | Built-in |
| PHP | `json_encode($d, JSON_PRETTY_PRINT)` | `json_encode($d)` | PHP 5.4+ |
| Go | `json.MarshalIndent(d, "", "  ")` | `json.Marshal(d)` | stdlib `encoding/json` |
| Browser | [Toolblip JSON Formatter](/tools/json-formatter) | Toolblip JSON Formatter → Minify | No install, instant |

---

## When to Use Which

- **Terminal + `jq`** — best for piping, scripting, filtering JSON in pipelines
- **Python `json` module** — when you're already in a Python script or need `sort_keys`
- **Node `JSON.stringify`** — quick Node REPL debugging, no dependencies
- **PHP `json_encode`** — format API responses before returning them during development
- **Browser tool** — when you get handed a blob and just need to read it right now

For everything else, there's the [Toolblip JSON Formatter](/tools/json-formatter) — open it, paste, understand your JSON in 3 seconds.

---

_This post is part of Toolblip's developer tools series. Related reading: [JSON Formatter Guide](/blog/json-formatter-guide) and [JSON vs XML: When to Use Each](/blog/json-vs-xml-guide)._
