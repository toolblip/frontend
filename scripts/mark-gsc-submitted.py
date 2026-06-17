#!/usr/bin/env python3
"""Mark a URL as submitted in the GSC queue."""
import sys
import json
from datetime import datetime, timezone

import os, pathlib
GSC_QUEUE_FILE = str(pathlib.Path(__file__).resolve().parent.parent / 'gsc-queue.json')

if len(sys.argv) < 2:
    print("Usage: mark-gsc-submitted.py <url>")
    sys.exit(1)

url = sys.argv[1]

with open(GSC_QUEUE_FILE, 'r') as f:
    q = json.load(f)

pending = []
for item in q.get('pending', []):
    item_url = item.get('url') if isinstance(item, dict) else item
    if item_url != url:
        pending.append(item)
q['pending'] = pending

q.setdefault('submitted', [])
if not any((item.get('url') if isinstance(item, dict) else item) == url for item in q['submitted']):
    q['submitted'].append({
        'url': url,
        'submitted_at': datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
    })

with open(GSC_QUEUE_FILE, 'w') as f:
    json.dump(q, f, indent=2)
