#!/usr/bin/env python3
"""Parse keyword research output from Claude into best + related keywords."""
import sys
import re

if len(sys.argv) < 2:
    print("Usage: parse-keywords.py <input_file>", file=sys.stderr)
    sys.exit(1)

input_file = sys.argv[1]

try:
    with open(input_file) as f:
        content = f.read()
except:
    print("")
    sys.exit(0)

best_match = re.search(r'^BEST:\s*(.+)$', content, re.MULTILINE)
related_match = re.search(r'^RELATED:\s*(.+)$', content, re.MULTILINE)

best = best_match.group(1).strip() if best_match else ""
related = related_match.group(1).strip() if related_match else ""

print(f"BEST:|{best}")
print(f"RELATED:|{related}")
