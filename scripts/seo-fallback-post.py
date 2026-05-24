#!/usr/bin/env python3
"""Write a conservative fallback SEO blog post when Claude Code is unavailable."""

from __future__ import annotations

import re
import sys
from datetime import datetime, timezone
from pathlib import Path

ACRONYMS = {
    "api": "API",
    "css": "CSS",
    "csv": "CSV",
    "gsc": "GSC",
    "html": "HTML",
    "http": "HTTP",
    "https": "HTTPS",
    "id": "ID",
    "json": "JSON",
    "jwt": "JWT",
    "seo": "SEO",
    "svg": "SVG",
    "sql": "SQL",
    "ui": "UI",
    "url": "URL",
    "ux": "UX",
    "yaml": "YAML",
    "xml": "XML",
}

TOOL_LINKS = [
    ("yaml", "YAML Validator", "https://toolblip.com/tools/yaml-validator"),
    ("password", "Password Generator", "https://toolblip.com/tools/password-generator"),
    ("url encode", "URL Encode / Decode", "https://toolblip.com/tools/url-encode"),
    ("url decode", "URL Encode / Decode", "https://toolblip.com/tools/url-encode"),
    ("css", "CSS Minifier", "https://toolblip.com/tools/css-minifier"),
    ("json", "JSON Formatter", "https://toolblip.com/tools/json-formatter"),
    ("regex", "Regex Tester", "https://toolblip.com/tools/regex-tester-tool"),
    ("jwt", "JWT Decoder", "https://toolblip.com/tools/jwt-decoder-tool"),
    ("diff", "Code Diff", "https://toolblip.com/tools/code-diff"),
    ("timestamp", "Unix Timestamp Converter", "https://toolblip.com/tools/unix-timestamp-converter"),
    ("html", "HTML Encoder / Decoder", "https://toolblip.com/tools/html-encoder"),
    ("base64", "Base64 Encoder / Decoder", "https://toolblip.com/tools/base64-encoder-decoder"),
]

if len(sys.argv) != 5:
    print(
        "Usage: seo-fallback-post.py <topic> <best_kw> <related_kw> <output_file>",
        file=sys.stderr,
    )
    sys.exit(1)

TOPIC = sys.argv[1].strip()
BEST_KW = sys.argv[2].strip() or TOPIC
RELATED_KW = sys.argv[3].strip()
OUTPUT_FILE = Path(sys.argv[4]).expanduser()


def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")[:80] or "toolblip-seo-post"


def normalize_title(text: str) -> str:
    text = re.sub(r"\s+", " ", text.strip())
    parts = []
    for raw in text.split(" "):
        key = re.sub(r"[^a-z0-9]+", "", raw.lower())
        if key in ACRONYMS:
            parts.append(ACRONYMS[key])
        elif raw:
            parts.append(raw[:1].upper() + raw[1:])
    return " ".join(parts) or "Toolblip SEO Post"


def pick_tool_links(text: str) -> list[tuple[str, str]]:
    haystack = f"{text} {BEST_KW} {RELATED_KW}".lower()
    picked: list[tuple[str, str]] = []
    seen = set()
    for needle, label, url in TOOL_LINKS:
        if needle in haystack and url not in seen:
            seen.add(url)
            picked.append((label, url))
    if not picked:
        picked.append(("Toolblip tools", "https://toolblip.com/tools"))
    return picked[:2]


def build_tags(text: str) -> list[str]:
    haystack = f"{text} {BEST_KW} {RELATED_KW}".lower()
    tags = ["browser-tools", "developer-tools"]
    if any(k in haystack for k in ["yaml", "json", "regex", "jwt", "base64", "html"]):
        tags.insert(0, "developer")
    if "password" in haystack:
        tags[:0] = ["password-generator", "security", "privacy"]
    elif "css" in haystack:
        tags[:0] = ["css-minifier", "frontend-debugging", "css"]
    elif "url" in haystack:
        tags[:0] = ["url-encode", "api-testing", "percent-encoding"]
    elif "yaml" in haystack:
        tags[:0] = ["yaml-validator", "configuration", "devops"]
    elif "jwt" in haystack:
        tags[:0] = ["jwt-decoder", "security", "api"]
    elif "regex" in haystack:
        tags[:0] = ["regex-tester", "text", "developer"]
    elif "diff" in haystack:
        tags[:0] = ["code-diff", "code-review", "developer"]
    return list(dict.fromkeys(tags))[:5]


def featured_image(text: str) -> str:
    palette = "0f172a-7c3aed"
    haystack = text.lower()
    if "password" in haystack:
        palette = "0f172a-14532d"
    elif "css" in haystack:
        palette = "111827-2563eb"
    elif "yaml" in haystack:
        palette = "0f172a-0ea5e9"
    elif "url" in haystack:
        palette = "0f172a-7c3aed"
    elif "regex" in haystack:
        palette = "111827-db2777"
    return f"https://api.radtx.com/gradient/{palette}/1200/630"


def paragraph(title: str, topic: str, best_kw: str, related_kw: str, links: list[tuple[str, str]]) -> str:
    link_bits = []
    for label, url in links:
        link_bits.append(f"[{label}]({url})")
    link_text = ", ".join(link_bits)
    related_line = f"Related keyword: `{related_kw}`." if related_kw else ""
    return f"""---
title: \"{title}\"
description: >-
  A conservative SEO article about {title} that explains what to check first, which settings matter, and how to verify the result before you share it.
slug: {datetime.now(timezone.utc).strftime('%Y-%m-%d')}-{slugify(best_kw)}
date: \"{datetime.now(timezone.utc).strftime('%Y-%m-%dT00:00:00.000Z')}\"
category: Developer Tools
tags:
{chr(10).join(f'  - {tag}' for tag in build_tags(topic))}
author: Toolblip Team
readingTime: 6 min
featuredImage: {featured_image(topic)}
---

{title} is one of those searches that looks simple until a bad boundary, a bad setting, or a hidden server hop turns the result into something you cannot trust. The point is not to make the output prettier. The point is to make the result obvious enough that you can ship it with confidence.

## What to check first

Start with the boring checks. Make sure the input is the one you meant to use, the defaults match the target system, and the output still makes sense after copy and paste. If the tool works in the browser, verify the result before you push it into a ticket, deploy pipeline, or shared doc.

## A safe workflow

1. Paste a small, harmless sample.
2. Verify the output once before touching real data.
3. Check for the settings that change behavior, not just the obvious button labels.
4. Use the result in the next system only after you know the transformation is correct.

Toolblip's {link_text} is useful for that quick pass because you can check the browser output without leaving the page.

## Why this matters

A tool can look correct and still fail in subtle ways. A query can be encoded one layer too many. A password can be generated with the wrong character set. A YAML file can validate in one editor and fail in another because indentation changed. A diff can hide the one line that actually broke the deploy.

{related_line}

## Quick checklist

- Verify the input before you trust the output.
- Compare the result against a simple known-good sample.
- Keep the workflow local or browser-based when the content is sensitive.
- Re-run the check after any setting change.
- Save the result only after you know it matches the intended format.

## Related tools

{chr(10).join(f'- [{label}]({url})' for label, url in links)}
"""


body = paragraph(normalize_title(TOPIC), TOPIC, BEST_KW, RELATED_KW, pick_tool_links(TOPIC))

# Add a couple of targeted closing sentences to keep the article from feeling generic.
closing = []
haystack = f"{TOPIC} {BEST_KW} {RELATED_KW}".lower()
if "yaml" in haystack:
    closing.append("If you are checking a config file before deployment, validate one sample first, then compare the same snippet in your editor or CI.")
if "url" in haystack:
    closing.append("If the value can contain spaces, `&`, `?`, or `#`, encode the value first and decode it again before you blame the API.")
if "password" in haystack:
    closing.append("For secrets, generate locally and hand the value to a password manager or secret store right away.")
if "css" in haystack:
    closing.append("For CSS debugging, beautify while you are still thinking, then minify only when you need a compact reproduction.")
if not closing:
    closing.append("The fastest path is usually the safest one: keep the check small, verify the output, and only then move to the live system.")

body += "\n\n".join(closing) + "\n"

OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
OUTPUT_FILE.write_text(body)
print(str(OUTPUT_FILE))
