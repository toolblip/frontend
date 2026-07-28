#!/usr/bin/env python3
"""Resubmit tool pages via IndexNow for faster re-indexing."""
import json, hashlib, time, urllib.request

# Read tool slugs from tool-content.ts
with open('data/tool-content.ts', 'r') as f:
    content = f.read()

import re
slugs = re.findall(r'"([a-z0-9-]+)":\s*\{', content)
print(f"Found {len(slugs)} tools with content")

# IndexNow key (from existing setup)
host = "toolblip.com"
key = "toolblip-indexnow-key-2024"
key_location = f"https://{host}/{key}.txt"

submitted = 0
batch_size = 50  # IndexNow recommends max 10,000 URLs per request

for i in range(0, len(slugs), batch_size):
    batch = slugs[i:i+batch_size]
    urls = [f"https://{host}/tools/{slug}" for slug in batch]
    
    payload = json.dumps({
        "host": host,
        "key": key,
        "keyLocation": key_location,
        "urlList": urls
    }).encode()
    
    try:
        req = urllib.request.Request(
            "https://api.indexnow.org/IndexNow",
            data=payload,
            headers={"Content-Type": "application/json; charset=utf-8"},
            method="POST"
        )
        resp = urllib.request.urlopen(req)
        submitted += len(batch)
        print(f"  Submitted batch {i//batch_size + 1}: {len(batch)} URLs (total: {submitted})")
    except Exception as e:
        print(f"  Batch {i//batch_size + 1} failed: {e}")
    
    time.sleep(1)  # Rate limit

print(f"\nDone: {submitted} URLs submitted via IndexNow")
