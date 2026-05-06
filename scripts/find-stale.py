#!/usr/bin/env python3
"""Find and refresh stale blog posts (older than cutoff date)."""
import sys, re
from datetime import datetime

if len(sys.argv) < 3:
    print("Usage: refresh-stale.py <blog_dir> <cutoff_YYYY-MM-DD>")
    sys.exit(1)

blog_dir = sys.argv[1]
cutoff_str = sys.argv[2]

try:
    cutoff_dt = datetime.strptime(cutoff_str, '%Y-%m-%d')
    cutoff_ts = cutoff_dt.timestamp()
except:
    print("Invalid cutoff date format")
    sys.exit(1)

import os
stale = []
for f in os.listdir(blog_dir):
    if not f.endswith('.md'):
        continue
    path = os.path.join(blog_dir, f)
    try:
        with open(path) as fh:
            content = fh.read()
        date_m = re.search(r"^date:\s*([0-9]{4}-[0-9]{2}-[0-9]{2})", content, re.MULTILINE)
        if date_m:
            d = datetime.strptime(date_m.group(1), '%Y-%m-%d').timestamp()
            if d < cutoff_ts:
                stale.append(path)
    except:
        pass

for s in stale:
    print(s)
