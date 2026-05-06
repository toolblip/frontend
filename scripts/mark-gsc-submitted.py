#!/usr/bin/env python3
"""Mark a URL as submitted in the GSC queue."""
import sys
import json
from datetime import datetime, timezone

GSC_QUEUE_FILE = '/Users/ray/Work/toolblip/gsc-queue.json'

if len(sys.argv) < 2:
    print("Usage: mark-gsc-submitted.py <url>")
    sys.exit(1)

url = sys.argv[1]

with open(GSC_QUEUE_FILE, 'r') as f:
    q = json.load(f)

q['pending'] = [x for x in q.get('pending', []) if x.get('url') != url]
q.setdefault('submitted', [])
q['submitted'].append({
    'url': url,
    'submitted_at': datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
})

with open(GSC_QUEUE_FILE, 'w') as f:
    json.dump(q, f, indent=2)
