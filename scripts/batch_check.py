#!/usr/bin/env python3
"""Batch check all tools for Coming Soon / placeholder status"""
import subprocess, re, json, time, sys

with open('data/tools.ts') as f:
    tools_content = f.read()

slugs = sorted(set(re.findall(r"slug:\s*'([^']+)'", tools_content)))
print(f"Checking {len(slugs)} tools...")

coming_soon = []
placeholder = []
working = []
errors = []

for i, slug in enumerate(slugs):
    try:
        result = subprocess.run(
            ['curl', '-s', '-o', '/dev/null', '-w', '%{http_code}', 
             f'https://toolblip.com/tools/{slug}'],
            capture_output=True, text=True, timeout=10
        )
        http_code = result.stdout.strip()
        
        if http_code != '200':
            errors.append((slug, f'HTTP {http_code}'))
            continue
            
        # Check page content
        result2 = subprocess.run(
            ['curl', '-s', f'https://toolblip.com/tools/{slug}'],
            capture_output=True, text=True, timeout=15
        )
        html = result2.stdout
        
        if 'ComingSoon' in html or 'Coming Soon' in html:
            coming_soon.append(slug)
        elif 'Configure and use this tool' in html:
            placeholder.append(slug)
        else:
            working.append(slug)
            
    except subprocess.TimeoutExpired:
        errors.append((slug, 'timeout'))
    except Exception as e:
        errors.append((slug, str(e)))
    
    if (i + 1) % 50 == 0:
        print(f"  {i+1}/{len(slugs)} | working:{len(working)} coming_soon:{len(coming_soon)} placeholder:{len(placeholder)} errors:{len(errors)}")
        sys.stdout.flush()

print(f"\n=== RESULTS ===")
print(f"Total: {len(slugs)}")
print(f"Working: {len(working)}")
print(f"Coming Soon: {len(coming_soon)}")
print(f"Placeholder: {len(placeholder)}")
print(f"Errors: {len(errors)}")

if coming_soon:
    print(f"\nComing Soon tools ({len(coming_soon)}):")
    for s in coming_soon:
        print(f"  {s}")

if placeholder:
    print(f"\nPlaceholder tools ({len(placeholder)}):")
    for s in placeholder:
        print(f"  {s}")

if errors:
    print(f"\nError tools ({len(errors)}):")
    for s, e in errors:
        print(f"  {s}: {e}")

# Save results
results = {
    'working': working,
    'coming_soon': coming_soon,
    'placeholder': placeholder,
    'errors': errors
}
with open('audit-results.json', 'w') as f:
    json.dump(results, f, indent=2)
print(f"\nResults saved to audit-results.json")
