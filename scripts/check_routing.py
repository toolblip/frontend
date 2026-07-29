#!/usr/bin/env python3
"""Check which missing slugs are aliases vs truly unrouted"""
import re

with open('data/tools.ts') as f:
    content = f.read()

# Get all unique slugs
all_slugs = set(re.findall(r"slug:\s*'([^']+)'", content))

# Get TOOL_SLUG_ALIASES
aliases_match = re.search(r'const TOOL_SLUG_ALIASES.*?=\s*\{([^}]+)\}', content, re.DOTALL)
aliases = {}
if aliases_match:
    for m in re.finditer(r"'([^']+)':\s*'([^']+)'", aliases_match.group(1)):
        aliases[m.group(1)] = m.group(2)

# Get ToolUI cases
with open('app/tools/[slug]/ToolUI.tsx') as f:
    toolui = f.read()
cases = set(re.findall(r"case\s+'([^']+)':", toolui))

# Analyze missing
missing = all_slugs - cases
alias_missing = [s for s in missing if s in aliases]
truly_missing = [s for s in missing if s not in aliases]

print(f"Total slugs: {len(all_slugs)}")
print(f"Routed: {len(cases)}")
print(f"Missing routing: {len(missing)}")
print(f"  - Are aliases (redirect to routed canonical): {len(alias_missing)}")
print(f"  - Truly missing routing: {len(truly_missing)}")

# Check if alias targets are routed
alias_targets_routed = 0
alias_targets_missing = 0
for s in alias_missing:
    target = aliases[s]
    if target in cases:
        alias_targets_routed += 1
    else:
        alias_targets_missing += 1

print(f"\nAlias target routing:")
print(f"  - Target IS routed: {alias_targets_routed}")
print(f"  - Target NOT routed: {alias_targets_missing}")

if alias_targets_missing > 0:
    print("\nAlias targets missing routing:")
    for s in sorted(alias_missing):
        target = aliases[s]
        if target not in cases:
            print(f"  {s} -> {target} (NOT ROUTED)")

# Show truly missing (first 30)
print(f"\nTruly missing routing ({len(truly_missing)}):")
for s in sorted(truly_missing)[:50]:
    print(f"  {s}")
if len(truly_missing) > 50:
    print(f"  ... and {len(truly_missing) - 50} more")
