#!/usr/bin/env python3
"""Audit toolblip tools - count and categorize"""
import re, os, json

with open('data/tools.ts') as f:
    content = f.read()

# Extract all unique slugs
slugs = set(re.findall(r"slug:\s*'([^']+)'", content))
print(f'Total unique slugs in data/tools.ts: {len(slugs)}')

# Count tool entries (name+slug pairs)
entries = re.findall(r"name:\s*'([^']+)',\s*slug:\s*'([^']+)'", content)
print(f'Tool entries (name-slug pairs): {len(entries)}')

# Check TOOL_SLUG_ALIASES
aliases_match = re.search(r'const TOOL_SLUG_ALIASES.*?=\s*\{([^}]+)\}', content, re.DOTALL)
if aliases_match:
    alias_entries = re.findall(r"'([^']+)':\s*'([^']+)'", aliases_match.group(1))
    print(f'Aliases defined: {len(alias_entries)}')
    # Unique target slugs from aliases
    alias_targets = set(v for _, v in alias_entries)
    print(f'Unique alias targets: {len(alias_targets)}')

# Check ToolUI.tsx routing
with open('app/tools/[slug]/ToolUI.tsx') as f:
    toolui = f.read()

case_pattern = re.compile(r"case\s+'([^']+)':\s*\n\s*return\s*<(\w+)")
cases = {m.group(1): m.group(2) for m in case_pattern.finditer(toolui)}
print(f'\nToolUI.tsx switch cases: {len(cases)}')

# Check which slugs are missing routing
missing = slugs - set(cases.keys())
print(f'Slugs missing routing in ToolUI.tsx: {len(missing)}')

# Check component files
components_dir = 'components/tools'
component_files = set()
for f in os.listdir(components_dir):
    if f.endswith('.tsx'):
        component_files.add(f.replace('.tsx', ''))
print(f'\nComponent files: {len(component_files)}')

# Check which routed components actually exist as files
routed_to_files = 0
routed_to_missing = 0
missing_files = []
for slug, comp in cases.items():
    if comp in component_files:
        routed_to_files += 1
    else:
        routed_to_missing += 1
        missing_files.append((slug, comp))

print(f'Routed to existing files: {routed_to_files}')
print(f'Routed to MISSING files: {routed_to_missing}')
if missing_files:
    print('Sample missing:')
    for slug, comp in missing_files[:10]:
        print(f'  {slug} -> {comp}.tsx')

# Check for stub/placeholder components
stubs = []
real = []
for fname in os.listdir(components_dir):
    if not fname.endswith('.tsx'):
        continue
    fpath = os.path.join(components_dir, fname)
    with open(fpath) as f:
        fc = f.read()
    lines = fc.split('\n')
    is_stub = (len(lines) < 20 or 
               'Configure and use this tool' in fc or
               'ComingSoon' in fc)
    if is_stub:
        stubs.append(fname)
    else:
        real.append(fname)

print(f'\nComponent quality:')
print(f'  Real implementations: {len(real)}')
print(f'  Stubs/placeholders: {len(stubs)}')
if stubs:
    print('  Sample stubs:')
    for s in stubs[:10]:
        print(f'    {s}')
