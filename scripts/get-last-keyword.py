#!/usr/bin/env python3
"""Get the last keyword from the generated posts file."""
import sys
import json

if len(sys.argv) < 3:
    print("Usage: get-last-keyword.py <generated_file> <fallback_topic>")
    sys.exit(1)

generated_file = sys.argv[1]
fallback_topic = sys.argv[2]

try:
    with open(generated_file) as f:
        content = f.read().strip()
    if not content:
        print(fallback_topic)
    else:
        # Handle both array and object formats
        data = json.loads(content)
        posts = data if isinstance(data, list) else data.get('posts', [])
        keyword_posts = [p for p in posts if 'keyword' in p]
        if keyword_posts:
            print(keyword_posts[-1]['keyword'])
        else:
            print(fallback_topic)
except (json.JSONDecodeError, FileNotFoundError, IndexError):
    print(fallback_topic)
