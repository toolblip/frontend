#!/usr/bin/env python3
"""Add URL to GSC queue."""
import sys
import json
from datetime import datetime, timezone

GSC_QUEUE_FILE = '/Users/ray/Work/toolblip/gsc-queue.json'

if len(sys.argv) < 3:
    print("Usage: enqueue-gsc.py <url> <topic>")
    sys.exit(1)

url = sys.argv[1]
topic = sys.argv[2]

try:
    with open(GSC_QUEUE_FILE, 'r') as f:
        q = json.load(f)
except:
    q = {'pending': [], 'submitted': [], 'failed': []}

q.setdefault('pending', [])
q['pending'].append({
    'url': url,
    'topic': topic,
    'enqueued_at': datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
})

with open(GSC_QUEUE_FILE, 'w') as f:
    json.dump(q, f, indent=2)
