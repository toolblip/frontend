#!/usr/bin/env python3
"""Resubmit remaining tool pages via IndexNow with longer delays."""
import json, hashlib, time, urllib.request

with open('data/tool-content.ts', 'r') as f:
    content = f.read()

import re
slugs = re.findall(r'"([a-z0-9-]+)":\s*\{', content)
print(f"Found {len(slugs)} tools with content")

host = "toolblip.com"
key = "toolblip-indexnow-key-2024"
key_location = f"https://{host}/{key}.txt"

# Skip first 100 (already submitted)
remaining = slugs[100:]
print(f"Submitting remaining {len(remaining)} URLs...")

submitted = 0
batch_size = 20  # Smaller batches

for i in range(0, len(remaining), batch_size):
    batch = remaining[i:i+batch_size]
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
        print(f"  Batch {i//batch_size + 1}: {len(batch)} URLs (total: {submitted})")
    except Exception as e:
        print(f"  Batch {i//batch_size + 1} failed: {e}")
    
    time.sleep(3)  # Longer delay

print(f"\nDone: {submitted} additional URLs submitted")
