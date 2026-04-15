---
name: toolblip-doctor
description: Diagnostic review of Toolblip frontend code quality. Use when: (1) asked to check if Toolblip code is "alright", "okay", or "correct", (2) asked to review or audit the frontend code, (3) asked to find issues or bugs, (4) asked to verify a change or refactor is correct. Triggered by phrases like "check Toolblip", "diagnose", "is everything okay", "verify", "audit", "find issues", "Toolblip doctor".
---

# Toolblip Doctor

Diagnostic review of the Toolblip frontend codebase.

## Project Context

- **Repo:** `/Users/ray/Work/toolblip`
- **Stack:** Next.js 16 + Tailwind CSS v4 + TypeScript
- **Build:** `npm run build` must pass with zero errors
- **Pages:** All 66+ static pages in `src/app/`
- **Components:** Client components in `src/components/` and `src/components/tools/`

## Diagnostic Checklist

### Build Integrity
```bash
cd /Users/ray/Work/toolblip && npm run build 2>&1 | grep -E "Error|error|Failed|warning"
```
Must show only `✓` lines, no errors.

### Dark Mode Coverage
```bash
grep -rn "bg-gray-90\|bg-gray-95\|text-white\b\|bg-gray-800 " src/app/ --include="*.tsx" | grep -v "dark:"
```
Any results = dark-only component that won't work in light mode.

### Type Safety
```bash
grep -rn "any\|// @ts-ignore\|// @ts-nocheck" src/app/ --include="*.tsx"
```
Should be minimal or zero.

### Client/Server Boundary
```bash
grep -rn "\"use client\"" src/app/ --include="*.tsx"
```
Client components with "use client" should not import server-only code.

### Link & Navigation
- All `<a href>` tags pointing to internal routes should use `<Link>` from `next/link`
- External links must have `target="_blank" rel="noopener noreferrer"`

### Responsive Classes
```bash
grep -rn "text-\|gap-\|p-\|m-" src/app/ --include="*.tsx" | grep -v "sm:\|md:\|lg:\|xl:"
```
Fixed-size classes without responsive prefixes may break on mobile.

### Reference Files
- `references/diagnostics.md` — detailed diagnostic procedures
- `references/common-issues.md` — known issue patterns and fixes
