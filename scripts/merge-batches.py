#!/usr/bin/env python3
"""Merge all fix-batch*.ts files into tool-content.ts"""
import re, glob, os

# Read current tool-content.ts
with open('data/tool-content.ts', 'r') as f:
    content = f.read()

# Extract all entries from batch files
batch_files = sorted(glob.glob('data/fix-batch*.ts'))
print(f"Found {len(batch_files)} batch files")

new_entries = {}
for bf in batch_files:
    with open(bf, 'r') as f:
        batch_content = f.read()
    
    # Find all entries: 'slug': { ... },
    # Pattern: 'slug': {\n    description: `...`,\n    examples: [...],\n    features: [...]\n  }
    entries = re.findall(r"'([a-z0-9-]+)':\s*\{([^}]+(?:\{[^}]*\}[^}]*)*)\}", batch_content)
    
    for slug, entry_body in entries:
        new_entries[slug] = entry_body

print(f"Extracted {len(new_entries)} unique entries from batches")

# Replace entries in tool-content.ts
replaced = 0
for slug, entry_body in new_entries.items():
    # Find and replace the entry
    old_pattern = f'  "{slug}": \\{{[^}}]*\\}},'
    new_entry = f'  "{slug}": {{{entry_body}}},'
    
    if re.search(old_pattern, content):
        content = re.sub(old_pattern, new_entry, content)
        replaced += 1

print(f"Replaced {replaced} entries in tool-content.ts")

# Write updated content
with open('data/tool-content.ts', 'w') as f:
    f.write(content)

print("Done!")
