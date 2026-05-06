#!/usr/bin/env python3
"""Add a topic to the pending queue if not already present."""
import sys
import json

QUEUE_FILE = '/Users/ray/Work/toolblip/pseo-queue.json'

if len(sys.argv) < 2:
    print("Usage: enqueue-topic.py <topic>")
    sys.exit(1)

topic = sys.argv[1]

with open(QUEUE_FILE, 'r') as f:
    q = json.load(f)

pending = q.get('pending', [])
if topic not in pending and topic not in q.get('in_progress', []):
    pending.append(topic)
    q['pending'] = pending
    with open(QUEUE_FILE, 'w') as f:
        json.dump(q, f, indent=2)
    print(f"Queued: {topic}")
else:
    print(f"Already queued: {topic}")
