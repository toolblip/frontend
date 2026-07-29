#!/usr/bin/env python3
"""Check which missing slugs are aliases vs need new routing"""
import re

with open('data/tools.ts') as f:
    content = f.read()

all_slugs = set(re.findall(r"slug:\s*'([^']+)'", content))

# Get TOOL_SLUG_ALIASES
aliases_section = re.search(r'const TOOL_SLUG_ALIASES.*?=\s*\{(.*?)\}', content, re.DOTALL)
aliases = {}
if aliases_section:
    for m in re.finditer(r"'([^']+)':\s*'([^']+)'", aliases_section.group(1)):
        aliases[m.group(1)] = m.group(2)

with open('app/tools/[slug]/ToolUI.tsx') as f:
    toolui = f.read()

top_level = set(s for s, _ in re.findall(r"case\s+'([^']+)':\s*\n\s*return\s*<(\w+)", toolui))

missing = all_slugs - top_level

# Check: are the missing slugs in the aliases? If so, they redirect to canonical slugs
# that should be routed. But wait - TOOL_SLUG_ALIASES maps alias -> canonical
# and the canonical slug should be in tools.ts AND routed.
# However, the missing slugs ARE in tools.ts (they're unique tool definitions).
# TOOL_SLUG_ALIASES is used at the data layer to resolve slug -> canonical slug.
# But if a slug is in tools.ts, it's a real tool entry, not just an alias.

# Let's check: which of the 309 missing slugs also appear as alias KEYS?
missing_as_alias_keys = [s for s in missing if s in aliases]
missing_not_alias_keys = [s for s in missing if s not in aliases]

print(f"Missing slugs: {len(missing)}")
print(f"  Also appear as alias keys in TOOL_SLUG_ALIASES: {len(missing_as_alias_keys)}")
print(f"  NOT alias keys (truly need routing): {len(missing_not_alias_keys)}")

# For the alias keys, check where they redirect
alias_redirects = {}
for s in missing_as_alias_keys:
    target = aliases[s]
    in_tools = target in all_slugs
    in_routing = target in top_level
    alias_redirects[s] = (target, in_tools, in_routing)

routed_targets = sum(1 for _, (_, _, r) in alias_redirects.items() if r)
unrouted_targets = sum(1 for _, (_, _, r) in alias_redirects.items() if not r)

print(f"\nAlias key redirects:")
print(f"  Target IS routed: {routed_targets}")
print(f"  Target NOT routed: {unrouted_targets}")

if unrouted_targets > 0:
    print("\nAlias targets not routed:")
    for s, (target, in_tools, in_routing) in sorted(alias_redirects.items()):
        if not in_routing:
            print(f"  {s} -> {target} (in_tools={in_tools}, routed={in_routing})")

print(f"\nTruly need routing ({len(missing_not_alias_keys)}):")
for s in sorted(missing_not_alias_keys):
    # Check if this slug has a component file
    # Convert slug to PascalCase component name
    parts = s.split('-')
    comp_name = ''.join(p.capitalize() for p in parts) + 'Client'
    print(f"  {s} (expected: {comp_name})")
