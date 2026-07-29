#!/usr/bin/env python3
"""Proper routing analysis - handle both single-line and multi-line cases"""
import re

with open('data/tools.ts') as f:
    tools_content = f.read()

all_slugs = set(re.findall(r"slug:\s*'([^']+)'", tools_content))

with open('app/tools/[slug]/ToolUI.tsx') as f:
    toolui = f.read()

# Match BOTH patterns:
# Pattern 1: case 'slug': return <Component />;
# Pattern 2: case 'slug':\n    return <Component />;
top_level = set(re.findall(r"case\s+'([^']+)':\s*(?:\n\s*)?return\s*<(\w+)", toolui))

print(f"Total slugs in data/tools.ts: {len(all_slugs)}")
print(f"Top-level routing cases: {len(top_level)}")

missing = sorted(all_slugs - top_level)
print(f"Missing routing: {len(missing)}")

# Check which missing slugs have component files
import os
components_dir = 'components/tools'
component_files = set(f.replace('.tsx', '') for f in os.listdir(components_dir) if f.endswith('.tsx'))

# For each missing slug, check if a component exists
has_component = []
no_component = []
for s in missing:
    parts = s.split('-')
    comp_name = ''.join(p.capitalize() for p in parts) + 'Client'
    if comp_name in component_files:
        has_component.append((s, comp_name))
    else:
        no_component.append(s)

print(f"\nMissing routing but HAS component file: {len(has_component)}")
print(f"Missing routing AND no component file: {len(no_component)}")

# Check if component files are stubs
stubs = []
real = []
for slug, comp_name in has_component:
    fpath = os.path.join(components_dir, f"{comp_name}.tsx")
    with open(fpath) as f:
        fc = f.read()
    lines = fc.split('\n')
    is_stub = (len(lines) < 20 or 
               'Configure and use this tool' in fc or
               'ComingSoon' in fc)
    if is_stub:
        stubs.append(slug)
    else:
        real.append(slug)

print(f"\nOf those with components:")
print(f"  Real implementations: {len(real)}")
print(f"  Stubs/placeholders: {len(stubs)}")

if real:
    print(f"\nREADY TO ROUTE (have real component):")
    for s in sorted(real):
        parts = s.split('-')
        comp_name = ''.join(p.capitalize() for p in parts) + 'Client'
        print(f"  {s} -> {comp_name}")

if stubs:
    print(f"\nHave component but STUB (need rewrite):")
    for s in sorted(stubs)[:20]:
        print(f"  {s}")
    if len(stubs) > 20:
        print(f"  ... and {len(stubs) - 20} more")
