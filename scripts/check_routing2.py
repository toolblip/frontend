#!/usr/bin/env python3
"""Proper routing analysis - distinguish top-level tool cases from nested"""
import re

with open('data/tools.ts') as f:
    tools_content = f.read()

all_slugs = set(re.findall(r"slug:\s*'([^']+)'", tools_content))

with open('app/tools/[slug]/ToolUI.tsx') as f:
    toolui = f.read()

# Find top-level case statements - those that return a component
# Pattern: case 'slug': return <Component />;
top_level = re.findall(r"case\s+'([^']+)':\s*\n\s*return\s*<(\w+)", toolui)
top_level_slugs = set(s for s, _ in top_level)

# Also find case statements that don't immediately return a component
# (might be inline components or complex logic)
all_cases = re.findall(r"case\s+'([^']+)':", toolui)
all_case_set = set(all_cases)

# Cases that are NOT top-level return (could be nested or complex)
non_return_cases = all_case_set - top_level_slugs

print(f"Total slugs in data/tools.ts: {len(all_slugs)}")
print(f"Top-level routing cases (return <Component/>): {len(top_level_slugs)}")
print(f"All case statements: {len(all_case_set)}")
print(f"Non-return cases: {len(non_return_cases)}")
print(f"\nMissing from top-level routing: {len(all_slugs - top_level_slugs)}")
print(f"Extra routed (not in tools.ts): {len(top_level_slugs - all_slugs)}")

missing = sorted(all_slugs - top_level_slugs)
if missing:
    print(f"\nMissing slugs ({len(missing)}):")
    for s in missing[:30]:
        print(f"  {s}")
    if len(missing) > 30:
        print(f"  ... and {len(missing) - 30} more")
