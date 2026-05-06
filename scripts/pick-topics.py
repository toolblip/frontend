#!/usr/bin/env python3
"""Queue management: pick N topics from pending, move to in_progress."""
import sys
import json

QUEUE_FILE = '/Users/ray/Work/toolblip/pseo-queue.json'

if len(sys.argv) < 2:
    count = 3
else:
    try:
        count = int(sys.argv[1])
    except:
        count = 3

with open(QUEUE_FILE, 'r') as f:
    q = json.load(f)

pending = q.get('pending', [])
in_progress = q.get('in_progress', [])

# done items are objects {'topic': ...}, pending/in_progress are strings
def get_topic(item):
    return item if isinstance(item, str) else item.get('topic', '')

picked = []
while len(picked) < count and pending:
    item = pending.pop(0)
    picked.append(get_topic(item))

q['pending'] = pending
q['in_progress'] = in_progress + picked

with open(QUEUE_FILE, 'w') as f:
    json.dump(q, f, indent=2)

for topic in picked:
    print(topic)
