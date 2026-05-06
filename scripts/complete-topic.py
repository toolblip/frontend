#!/usr/bin/env python3
"""Mark a topic as done (move from in_progress → done)."""
import sys
import json
from datetime import datetime, timezone

QUEUE_FILE = '/Users/ray/Work/toolblip/pseo-queue.json'

if len(sys.argv) < 2:
    print("Usage: complete-topic.py <topic>")
    sys.exit(1)

topic = sys.argv[1]

with open(QUEUE_FILE, 'r') as f:
    q = json.load(f)

q['in_progress'] = [t for t in q.get('in_progress', []) if t != topic]
q['done'] = q.get('done', [])
q['done'].insert(0, {'topic': topic, 'completed_at': datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')})

with open(QUEUE_FILE, 'w') as f:
    json.dump(q, f, indent=2)
