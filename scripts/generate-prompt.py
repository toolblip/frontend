#!/usr/bin/env python3
"""Generate SEO content prompt for a topic/keyword combination."""
import sys
import os
import json
import subprocess

if len(sys.argv) < 4:
    print("Usage: generate-prompt.py <topic> <best_kw> <related_kw> <strategy_file> <blog_dir> <output_file>", file=sys.stderr)
    sys.exit(1)

topic = sys.argv[1]
best_kw = sys.argv[2]
related_kw = sys.argv[3]
strategy_file = sys.argv[4]
blog_dir = sys.argv[5]
output_file = sys.argv[6]

# Read strategy
strategy = ""
if os.path.exists(strategy_file):
    with open(strategy_file) as f:
        strategy = f.read()

date_slug = subprocess.run(['date', '+%Y-%m-%d'], capture_output=True, text=True).stdout.strip()
slug = best_kw.lower()
import re
slug = re.sub(r'[^a-z0-9]+', '-', slug)
slug = re.sub(r'^-|-$', '', slug)[:60]

prompt = f"""You are the Toolblip SEO content writer.

Generate ONE long-form blog post targeting this keyword: '{best_kw}'

TOPIC: {topic}
KEYWORD: {best_kw}
RELATED KEYWORDS: {related_kw}

Current SEO strategy (read and follow):
{strategy}

The article must:
1. Address the search intent behind '{best_kw}' directly in the first paragraph
2. Use '{best_kw}' naturally in: title (H1), at least 3 H2 headings, first paragraph, and conclusion
3. Include all related keywords naturally throughout
4. Be 1200-1800 words - substantive, not thin
5. Have 5+ H2 sections with descriptive headings that include the keyword or variation
6. Include at least 2 specific code examples or tool usage examples
7. Include a featured image using: https://api.radtx.com/gradient/6b7280-374151/1200/630
8. End with a clear CTA linking to a relevant tool on toolblip.com (e.g. https://toolblip.com/tools/json-formatter)

Format as markdown with frontmatter:
---
title: "YOUR TITLE (50-60 chars, include keyword)"
description: >-
  150-155 char description with CTA, include target keyword naturally
slug: {date_slug}-{slug}
date: {date_slug}T00:00:00.000Z
category: Developer Tools
tags:
  - {topic[:30].replace(' ', '-')}
  - SEO
  - Developer Tools
author: Toolblip Team
readingTime: X min
featuredImage: https://api.radtx.com/gradient/6b7280-374151/1200/630
---

# Article H1 Title (include keyword)

[Content...]

Save to: {blog_dir}/{date_slug}-{slug}.md

IMPORTANT rules:
- No em dashes (-)
- No hashtags
- No corporate speak, no "game changer", no "excited to announce"
- Short paragraphs, 1-3 sentences each
- Use --model sonnet style: clear, direct, authoritative
- Internal links to at least 2 other toolblip tools: https://toolblip.com/tools/json-formatter, https://toolblip.com/tools/regex-tester, https://toolblip.com/tools/base64

After saving, output ONLY:
FILE: {blog_dir}/{date_slug}-{slug}.md
URL: https://toolblip.com/blog/{date_slug}-{slug}
TITLE: [your title]
SLUG: {date_slug}-{slug}"""

with open(output_file, 'w') as f:
    f.write(prompt)

print(output_file)
