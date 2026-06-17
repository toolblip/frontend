#!/usr/bin/env python3
"""Queue management: pick N topics from pending, move to in_progress.

If the queue is empty, refill it from scripts/seo-topic-seeds.json so the
nightly SEO run produces 1-3 posts instead of silently doing no content work.
"""
import json
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
QUEUE_FILE = Path(os.environ.get('TOOLBLIP_PSEO_QUEUE_FILE', ROOT / 'pseo-queue.json'))
SEEDS_FILE = Path(os.environ.get('TOOLBLIP_SEO_SEEDS_FILE', ROOT / 'scripts' / 'seo-topic-seeds.json'))

try:
    count = int(sys.argv[1]) if len(sys.argv) > 1 else 3
except Exception:
    count = 3

# Harun asked for between one and three pieces per run.
count = max(1, min(count, 3))


def get_topic(item):
    return item if isinstance(item, str) else item.get('topic', '')


def load_queue():
    with QUEUE_FILE.open() as f:
        q = json.load(f)
    q.setdefault('pending', [])
    q.setdefault('in_progress', [])
    q.setdefault('done', [])
    return q


def save_queue(q):
    QUEUE_FILE.write_text(json.dumps(q, indent=2) + '\n')


def refill_if_empty(q):
    if q.get('pending'):
        return False
    if not SEEDS_FILE.exists():
        return False

    seeds = json.loads(SEEDS_FILE.read_text())
    seen = {get_topic(item).lower() for bucket in ('pending', 'in_progress', 'done') for item in q.get(bucket, [])}
    additions = [topic for topic in seeds if topic.lower() not in seen]
    if not additions:
        return False

    q['pending'].extend(additions)
    print(f"Refilled SEO queue with {len(additions)} evergreen topics", file=sys.stderr)
    return True


q = load_queue()
refill_if_empty(q)

pending = q.get('pending', [])
in_progress = q.get('in_progress', [])
picked = []
while len(picked) < count and pending:
    item = pending.pop(0)
    picked.append(get_topic(item))

q['pending'] = pending
q['in_progress'] = in_progress + picked
save_queue(q)

for topic in picked:
    print(topic)
