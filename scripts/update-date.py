#!/usr/bin/env python3
"""Update the date frontmatter of a blog post to today's date."""
import re
import sys

if len(sys.argv) < 3:
    print("Usage: update-date.py <today> <file>", file=sys.stderr)
    sys.exit(1)

today = sys.argv[1]
filepath = sys.argv[2]

with open(filepath, 'r') as fh:
    content = fh.read()

content = re.sub(
    r'^date: .*$',
    f'date: {today}T00:00:00.000Z',
    content,
    flags=re.MULTILINE
)

with open(filepath, 'w') as fh:
    fh.write(content)

print(f"Updated date to {today} in {filepath}")
