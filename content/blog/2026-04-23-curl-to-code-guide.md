---
title: 'cURL to Code: Convert Any cURL Command to Python, JavaScript, or Go'
description: >-
  Paste a cURL command and get clean, working Python, JavaScript, or Go code.
  This guide shows you the fastest way to convert cURL to code  -  plus how the
  conversion works so you understand what is happening under the hood.
publishDate: '2026-04-23'
slug: curl-to-code-guide
readingTime: 7 min
author: Harun R Rayhan
tags:
  - curl
  - python
  - javascript
  - go
  - http
  - api
  - developer-tools
category: Developer Tools
featuredImage: 'https://api.radtx.com/gradient/06b6d4-8b5cf6/1200/630'
---

You have been there. You figure out an API call in the terminal with cURL  -  headers, body, auth, all working perfectly. Then you need that same call in your Python script or JavaScript application. So you manually translate every flag: `-H` becomes a headers object, `-X POST` becomes `.post()`, the body becomes a JSON payload. It works, but it is tedious and error-prone.

There is a better way. This guide shows you how to convert cURL to code instantly, what is actually happening in the conversion, and which tools do it best.

## What Is Happening When You Convert cURL to Code

Before getting into tools, it helps to understand what a cURL command is actually expressing. cURL is a command-line transfer tool with its own flag-based syntax. When you run:

```bash
curl -X POST https://api.example.com/users \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..." \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice", "email": "alice@example.com"}'
```

You are expressing four things that any HTTP client library needs to replicate:

1. **Method**  -  `POST`
2. **URL**  -  `https://api.example.com/users`
3. **Headers**  -  Authorization and Content-Type
4. **Body**  -  the JSON payload

The conversion from cURL to code is essentially a translation exercise. Each flag maps predictably to a library construct. The challenge is that different languages have different conventions, and certain cURL flags (like `-u` for basic auth, `-k` for insecure SSL, `-o` for output files) do not map to every library equally.

## Three Ways to Convert cURL to Code

### 1. Online Converters (Fastest)

The quickest path: paste your cURL command into an online converter and copy the output. No install, no config.

**Toolblip's cURL to Code converter** handles Python (`requests` and `http.client`), JavaScript (`fetch` and `axios`), and Go (`net/http`). It preserves headers, body parsing, and auth tokens, outputting code that is ready to paste into a real project.

The workflow:

```
Paste cURL → Select language → Copy code
```

For the cURL example above, the Python output from a good converter looks like:

```python
import requests

url = "https://api.example.com/users"
headers = {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9...",
    "Content-Type": "application/json"
}
data = {
    "name": "Alice",
    "email": "alice@example.com"
}

response = requests.post(url, headers=headers, json=data)
print(response.status_code)
print(response.json())
```

JavaScript `fetch` output:

```javascript
const response = await fetch('https://api.example.com/users', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9...',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    'name': 'Alice',
    'email': 'alice@example.com'
  })
});
const data = await response.json();
console.log(data);
```

Go output:

```go
package main

import (
    "bytes"
    "encoding/json"
    "net/http"
)

func main() {
    url := "https://api.example.com/users"
    data := map[string]string{
        "name":  "Alice",
        "email": "alice@example.com",
    }
    jsonData, _ := json.Marshal(data)

    req, _ := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
    req.Header.Set("Authorization", "Bearer eyJhbGciOiJIUzI1NiJ9...")
    req.Header.Set("Content-Type", "application/json")

    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()
}
```

The key advantage of using a browser-based converter over a CLI is that you see all three language outputs side by side and can pick the one that matches your project  -  no switching between tabs or re-running commands.

### 2. Your Browser DevTools Network Tab

Before reaching for an external tool, open Chrome or Firefox DevTools (F12 → Network tab), right-click any request, and choose **"Copy as cURL"**. That gives you a clean cURL command that you can then feed into a converter.

This is useful when you are reverse-engineering a request from a web app  -  you get the exact headers, body, and query parameters the browser sent without having to sniff traffic separately.

From there, the conversion to code is one copy-paste away.

### 3. CLI Converters

If you prefer staying in the terminal, a few CLI tools can help:

**Using `curlconverter` (Python):**

```bash
pip install curlconverter
curlconverter curl https://api.example.com/users \
  --request POST \
  --header "Authorization: Bearer token" \
  --header "Content-Type: application/json" \
  --data '{"name":"Alice"}' \
  --language python
```

**Using `curly` (Node.js):**

```bash
npx curly "https://api.example.com/users" \
  -X POST \
  -H "Authorization: Bearer token" \
  -d '{"name":"Alice"}' \
  --lang js
```

These are fine for occasional use, but they require you to be at a terminal and rebuild the cURL command from scratch  -  which defeats the purpose if you already have a working cURL string you want to translate.

## Common cURL Flags and What They Map To

If you are writing the conversion manually or debugging an auto-generated one, this table covers the most common flags:

| cURL Flag | What It Does | Python (`requests`) | JavaScript (`fetch`) | Go (`net/http`) |
|---|---|---|---|---|
| `-X POST` | HTTP method | `requests.post()` | `method: 'POST'` | `http.NewRequest("POST", ...)` |
| `-H "Key: Value"` | Header | `headers={'Key': 'Value'}` | `headers: { 'Key': 'Value' }` | `req.Header.Set("Key", "Value")` |
| `-d '{"a":1}'` | Request body | `json={"a": 1}` or `data=` | `body: JSON.stringify({a: 1})` | `bytes.NewBuffer(jsonData)` |
| `-u user:pass` | Basic auth | `auth=('user', 'pass')` | `Authorization: Basic base64` | `req.SetBasicAuth()` |
| `-k` | Skip SSL verification | `verify=False` | `rejectUnauthorized: false` | `tls.Config{InsecureSkipVerify: true}` |
| `-o file` | Output to file | `stream=True` + write | `response.arrayBuffer()` + write | `io.Copy()` |
| `--data-urlencode` | URL-encode body | `data={'key': value}` | URLSearchParams | `url.Values.Encode()` |

## Real-World Example: Converting a GitHub API Call

Here is a practical scenario: you are fetching a user's repositories from the GitHub API.

**Original cURL command:**

```bash
curl -H "Accept: application/vnd.github+json" \
     -H "Authorization: Bearer ghp_yourtokenhere" \
     -H "X-GitHub-Api-Version: 2022-11-28" \
     https://api.github.com/user/repos?per_page=5&sort=updated
```

**Python output:**

```python
import requests

url = "https://api.github.com/user/repos"
headers = {
    "Accept": "application/vnd.github+json",
    "Authorization": "Bearer ghp_yourtokenhere",
    "X-GitHub-Api-Version": "2022-11-28"
}
params = {
    "per_page": 5,
    "sort": "updated"
}

response = requests.get(url, headers=headers, params=params)
repos = response.json()
for repo in repos:
    print(repo['full_name'], repo['updated_at'])
```

Notice how query parameters (`per_page`, `sort`) are correctly extracted into a `params` dict rather than being left in the URL. Quality converters handle this automatically.

## Handling Edge Cases

### Multiline cURL commands

If your cURL command spans multiple lines (common with `\` line continuations in shell scripts), collapse it to a single line before pasting into a converter:

```bash
# Multiline
curl -X POST https://api.example.com \
  -H "Authorization: Bearer token" \
  -d '{"key":"value"}'

# Collapsed (what converters expect)
curl -X POST https://api.example.com -H "Authorization: Bearer token" -d '{"key":"value"}'
```

### cURL commands with single quotes inside the body

If your JSON body contains single quotes, cURL's `-d` flag with single quotes can cause issues. Use double quotes and escape inner double quotes, or use `--data-raw`:

```bash
# This breaks because of nested quotes
curl -d '{"message":"It's working"}' https://api.example.com

# Fix with --data-raw and double quotes
curl --data-raw '{"message":"It'"'"'s working"}' https://api.example.com
```

### Binary file uploads via cURL

When converting cURL commands that upload files (`-F` flag), the conversion output will differ more significantly between languages. Python's `requests` handles multipart form data cleanly:

```python
# cURL: curl -F "file=@document.pdf" https://api.example.com/upload
import requests

url = "https://api.example.com/upload"
files = {'file': open('document.pdf', 'rb')}

response = requests.post(url, files=files)
```

JavaScript's `fetch` requires the `FormData` API, which works in browsers but needs a polyfill in Node.js environments.

## Quick Reference: cURL to Code Checklist

- [ ] Copy cURL from DevTools Network tab (right-click → Copy as cURL) for accurate reproduction of real requests
- [ ] Collapse multiline commands to a single line before converting
- [ ] Verify auth headers (Bearer tokens, Basic auth) are correctly included in the output
- [ ] Check that query parameters are moved to `params`/`query` objects, not left in the URL string
- [ ] For Go code, remember to handle `resp.Body.Close()` and error checking
- [ ] For Python, `requests.post(url, json=data)` auto-sets `Content-Type: application/json`  -  no need to set the header manually
- [ ] Test the generated code with a real request before committing it to your codebase

## Try It Now

Convert any cURL command to Python, JavaScript, or Go in your browser  -  no install, no signup, nothing leaves your machine.

**→ [cURL to Code Converter](/tools/curl-to-code)**

Related tools for working with HTTP requests and API testing:

- [JSON Formatter](/tools/json-formatter)  -  prettify and validate JSON responses
- [JWT Decoder](/tools/jwt-decoder)  -  inspect tokens from API responses
- [Base64 Encoder](/tools/base64)  -  encode credentials and payloads
- [HTTP Status Codes](/tools/http-status-codes)  -  quick reference for response codes
