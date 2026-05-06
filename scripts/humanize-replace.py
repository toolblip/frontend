#!/usr/bin/env python3
"""Replace article body keeping frontmatter, forseo-pipeline.sh"""
import re, sys

if len(sys.argv) != 3:
    print("Usage: humanize-replace.py <file> <humanized_txt>")
    sys.exit(1)

file_path = sys.argv[1]
humanized_path = sys.argv[2]

with open(humanized_path, 'r') as hf:
    humanized = hf.read()

with open(file_path, 'r') as f:
    content = f.read()

fm_match = re.match(r'(---.*?---\n)', content, re.DOTALL)
if fm_match:
    fm = fm_match.group(1)
    with open(file_path, 'w') as f:
        f.write(fm + '\n' + humanized + '\n')
    print('Humanized')
else:
    print('No frontmatter found')
