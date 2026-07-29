#!/usr/bin/env python3
"""
Batch transform tool components to use tb-v2-* design system classes.
Transforms raw Tailwind utility classes to consistent tb-v2-* classes.
"""
import os
import re
import sys
from pathlib import Path

TOOLS_DIR = Path('/Users/ray/Work/toolblip/components/tools')

# ─── Class mapping: raw Tailwind → tb-v2-* ──────────────────────────────
# These are safe global replacements for common patterns

# Button replacements
BUTTON_REPLACEMENTS = [
    # Primary red buttons
    (r'className="[^"]*bg-red-600[^"]*hover:bg-red-700[^"]*text-white[^"]*rounded-xl[^"]*py-3[^"]*font-medium[^"]*transition-colors[^"]*"', 'className="tb-v2-btn tb-v2-btn-primary tb-v2-btn-lg"'),
    (r'className="[^"]*bg-red-600[^"]*hover:bg-red-700[^"]*text-white[^"]*rounded-xl[^"]*font-medium[^"]*transition-colors[^"]*"', 'className="tb-v2-btn tb-v2-btn-primary"'),
    (r'className="[^"]*bg-red-500[^"]*hover:bg-red-600[^"]*text-white[^"]*rounded-xl[^"]*font-medium[^"]*transition-colors[^"]*"', 'className="tb-v2-btn tb-v2-btn-primary"'),
    (r'className="[^"]*bg-red-600[^"]*hover:bg-red-700[^"]*text-white[^"]*rounded-lg[^"]*py-2[^"]*font-medium[^"]*transition-colors[^"]*"', 'className="tb-v2-btn tb-v2-btn-primary"'),
    (r'className="[^"]*bg-red-600[^"]*hover:bg-red-700[^"]*text-white[^"]*rounded-lg[^"]*font-medium[^"]*transition-colors[^"]*"', 'className="tb-v2-btn tb-v2-btn-primary"'),
    # Ghost/link buttons  
    (r'className="[^"]*text-red-600[^"]*dark:text-red-400[^"]*hover:text-red-700[^"]*font-medium[^"]*"', 'className="tb-v2-btn tb-v2-btn-ghost tb-v2-btn-sm" style={{color:"var(--red)"}}'),
    (r'className="[^"]*text-xs[^"]*text-red-600[^"]*dark:text-red-400[^"]*hover:underline[^"]*"', 'className="tb-v2-btn tb-v2-btn-ghost tb-v2-btn-sm" style={{color:"var(--red)",fontSize:12}}'),
    (r'className="[^"]*text-sm[^"]*text-red-600[^"]*dark:text-red-400[^"]*hover:underline[^"]*"', 'className="tb-v2-btn tb-v2-btn-ghost tb-v2-btn-sm" style={{color:"var(--red)"}}'),
    # Default/secondary buttons
    (r'className="[^"]*bg-gray-100[^"]*dark:bg-gray-800[^"]*text-gray-600[^"]*dark:text-gray-300[^"]*hover:bg-gray-200[^"]*dark:hover:bg-gray-700[^"]*rounded-lg[^"]*px-4[^"]*py-2[^"]*text-sm[^"]*font-medium[^"]*transition-colors[^"]*"', 'className="tb-v2-btn"'),
    (r'className="[^"]*bg-gray-100[^"]*dark:bg-gray-800[^"]*text-gray-600[^"]*dark:text-gray-300[^"]*hover:bg-gray-200[^"]*dark:hover:bg-gray-700[^"]*rounded-lg[^"]*text-sm[^"]*font-medium[^"]*transition-colors[^"]*"', 'className="tb-v2-btn"'),
]

# Textarea replacements
TEXTAREA_REPLACEMENTS = [
    # Standard monospace textarea
    (r'className="[^"]*w-full[^"]*h-\d+[^"]*px-4[^"]*py-3[^"]*bg-white[^"]*dark:bg-gray-900[^"]*border[^"]*border-gray-300[^"]*dark:border-gray-700[^"]*rounded-xl[^"]*text-gray-900[^"]*dark:text-white[^"]*font-mono[^"]*text-sm[^"]*placeholder-gray-400[^"]*focus:outline-none[^"]*focus:border-red-500[^"]*resize-y[^"]*"', 'className="tb-v2-tool-textarea"'),
    (r'className="[^"]*w-full[^"]*px-4[^"]*py-3[^"]*bg-white[^"]*dark:bg-gray-900[^"]*border[^"]*border-gray-300[^"]*dark:border-gray-700[^"]*rounded-xl[^"]*text-gray-900[^"]*dark:text-white[^"]*font-mono[^"]*text-sm[^"]*placeholder-gray-400[^"]*focus:outline-none[^"]*focus:border-red-500[^"]*resize-y[^"]*"', 'className="tb-v2-tool-textarea"'),
    # Sans textarea
    (r'className="[^"]*w-full[^"]*h-\d+[^"]*px-4[^"]*py-3[^"]*bg-white[^"]*dark:bg-gray-900[^"]*border[^"]*border-gray-300[^"]*dark:border-gray-700[^"]*rounded-xl[^"]*text-gray-900[^"]*dark:text-white[^"]*text-sm[^"]*placeholder-gray-400[^"]*focus:outline-none[^"]*focus:border-red-500[^"]*resize-y[^"]*"', 'className="tb-v2-tool-textarea"'),
    # Simpler patterns
    (r'className="[^"]*w-full[^"]*bg-white[^"]*dark:bg-gray-900[^"]*border[^"]*border-gray-300[^"]*dark:border-gray-700[^"]*text-gray-900[^"]*dark:text-white[^"]*rounded-lg[^"]*px-4[^"]*py-3[^"]*font-mono[^"]*text-sm[^"]*focus:outline-none[^"]*focus:border-red-500[^"]*resize-none[^"]*"', 'className="tb-v2-tool-textarea"'),
    (r'className="[^"]*w-full[^"]*bg-white[^"]*dark:bg-gray-900[^"]*border[^"]*border-gray-300[^"]*dark:border-gray-700[^"]*text-gray-900[^"]*dark:text-white[^"]*rounded-lg[^"]*px-4[^"]*py-3[^"]*font-mono[^"]*text-sm[^"]*focus:outline-none[^"]*focus:border-red-500[^"]*resize-y[^"]*"', 'className="tb-v2-tool-textarea"'),
]

# Input replacements
INPUT_REPLACEMENTS = [
    # Standard text input
    (r'className="[^"]*w-full[^"]*p-3[^"]*border[^"]*rounded-lg[^"]*dark:bg-gray-800[^"]*dark:border-gray-700[^"]*"', 'className="tb-v2-input"'),
    (r'className="[^"]*w-full[^"]*p-3[^"]*border[^"]*rounded-lg[^"]*bg-white[^"]*dark:bg-gray-800[^"]*border-gray-300[^"]*dark:border-gray-700[^"]*"', 'className="tb-v2-input"'),
    (r'className="[^"]*w-full[^"]*p-2[^"]*border[^"]*rounded-lg[^"]*dark:bg-gray-800[^"]*dark:border-gray-700[^"]*"', 'className="tb-v2-input"'),
    (r'className="[^"]*w-full[^"]*p-2[^"]*border[^"]*rounded-lg[^"]*bg-white[^"]*dark:bg-gray-800[^"]*border-gray-300[^"]*dark:border-gray-700[^"]*"', 'className="tb-v2-input"'),
    # Number inputs
    (r'className="[^"]*w-full[^"]*p-2[^"]*border[^"]*rounded-lg[^"]*dark:bg-gray-800[^"]*dark:border-gray-700[^"]*min-\d+[^"]*"', 'className="tb-v2-input"'),
    # Select
    (r'className="[^"]*bg-white[^"]*dark:bg-gray-900[^"]*border[^"]*border-gray-300[^"]*dark:border-gray-700[^"]*text-gray-900[^"]*dark:text-white[^"]*rounded-lg[^"]*px-3[^"]*py-1\.5[^"]*text-sm[^"]*focus:outline-none[^"]*focus:border-red-500[^"]*"', 'className="tb-v2-select"'),
    (r'className="[^"]*bg-white[^"]*dark:bg-gray-900[^"]*border[^"]*border-gray-300[^"]*dark:border-gray-700[^"]*text-gray-900[^"]*dark:text-white[^"]*rounded-lg[^"]*px-3[^"]*py-2[^"]*text-sm[^"]*focus:outline-none[^"]*focus:border-red-500[^"]*"', 'className="tb-v2-select"'),
]

# Label replacements
LABEL_REPLACEMENTS = [
    (r'className="[^"]*text-sm[^"]*font-medium[^"]*text-gray-600[^"]*dark:text-gray-400[^"]*mb-1\.5[^"]*"', 'className="tb-v2-tool-label" style={{marginBottom:6}}'),
    (r'className="[^"]*text-sm[^"]*font-medium[^"]*text-gray-600[^"]*dark:text-gray-400[^"]*mb-2[^"]*"', 'className="tb-v2-tool-label" style={{marginBottom:8}}'),
    (r'className="[^"]*text-sm[^"]*font-medium[^"]*mb-2[^"]*"', 'className="tb-v2-tool-label" style={{marginBottom:8}}'),
]

# Layout replacements
LAYOUT_REPLACEMENTS = [
    # Standard layout div
    (r'className="space-y-6"', 'className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:20,padding:"20px"}}'),
    (r'className="space-y-4"', 'className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:16,padding:"16px 20px"}}'),
    (r'className="max-w-2xl mx-auto p-6"', 'className="" style={{padding:"20px"}}'),
    (r'className="max-w-2xl mx-auto"', 'className=""'),
    (r'className="max-w-4xl mx-auto p-6"', 'className="" style={{padding:"20px"}}'),
]

# Stat/result replacements
STAT_REPLACEMENTS = [
    # Info boxes
    (r'className="[^"]*bg-blue-50[^"]*dark:bg-blue-900/30[^"]*rounded-lg[^"]*"', 'className="tb-v2-banner tb-v2-banner-info"'),
    (r'className="[^"]*bg-yellow-50[^"]*dark:bg-yellow-900/30[^"]*rounded-lg[^"]*"', 'className="tb-v2-banner tb-v2-banner-warn"'),
    (r'className="[^"]*bg-green-50[^"]*dark:bg-green-900/30[^"]*rounded-lg[^"]*"', 'className="tb-v2-banner tb-v2-banner-ok"'),
    (r'className="[^"]*bg-red-50[^"]*dark:bg-red-900/30[^"]*rounded-lg[^"]*"', 'className="tb-v2-banner tb-v2-banner-err"'),
    # Gray info boxes
    (r'className="[^"]*bg-gray-50[^"]*dark:bg-gray-800[^"]*rounded-lg[^"]*p-4[^"]*"', 'className="tb-v2-section" style={{padding:16,background:"var(--surface-2)"}}'),
    (r'className="[^"]*bg-gray-50[^"]*dark:bg-gray-800[^"]*rounded-lg[^"]*"', 'className="tb-v2-section" style={{padding:16,background:"var(--surface-2)"}}'),
]

# Result/output replacements  
RESULT_REPLACEMENTS = [
    # Output display area
    (r'className="[^"]*bg-gray-50[^"]*dark:bg-gray-800[^"]*rounded-xl[^"]*p-4[^"]*font-mono[^"]*text-sm[^"]*text-gray-900[^"]*dark:text-white[^"]*break-all[^"]*"', 'className="tb-v2-tool-pre"'),
    (r'className="[^"]*bg-gray-50[^"]*dark:bg-gray-800[^"]*rounded-xl[^"]*p-4[^"]*font-mono[^"]*text-sm[^"]*text-gray-900[^"]*dark:text-white[^"]*"', 'className="tb-v2-tool-pre"'),
    (r'className="[^"]*bg-gray-50[^"]*dark:bg-gray-800[^"]*rounded-lg[^"]*p-4[^"]*font-mono[^"]*text-sm[^"]*text-gray-900[^"]*dark:text-white[^"]*break-all[^"]*"', 'className="tb-v2-tool-pre"'),
    (r'className="[^"]*bg-gray-50[^"]*dark:bg-gray-800[^"]*rounded-lg[^"]*p-4[^"]*font-mono[^"]*text-sm[^"]*text-gray-900[^"]*dark:text-white[^"]*"', 'className="tb-v2-tool-pre"'),
]

# Text color replacements (in output contexts)
TEXT_COLOR_REPLACEMENTS = [
    (r'className="[^"]*text-sm[^"]*font-medium[^"]*text-gray-700[^"]*dark:text-gray-300[^"]*"', 'className="tb-v2-tool-label"'),
]

# Copy button replacements
COPY_REPLACEMENTS = [
    (r'className="[^"]*text-xs[^"]*text-red-600[^"]*dark:text-red-400[^"]*hover:underline[^"]*"', 'className="tb-v2-btn tb-v2-btn-ghost tb-v2-btn-sm" style={{color:"var(--red)"}}'),
    (r'className="[^"]*text-sm[^"]*text-red-600[^"]*dark:text-red-400[^"]*hover:underline[^"]*"', 'className="tb-v2-btn tb-v2-btn-ghost tb-v2-btn-sm" style={{color:"var(--red)"}}'),
]

# Tab/mode button replacements - skip these for now (backtick escaping is complex)
TAB_REPLACEMENTS = []

# Grid replacement
GRID_REPLACEMENTS = [
    (r'className="grid grid-cols-1 md:grid-cols-2 gap-4"', 'className="tb-v2-grid-2"'),
    (r'className="grid grid-cols-2 gap-4"', 'className="tb-v2-grid-2"'),
    (r'className="grid grid-cols-3 gap-4"', 'className="tb-v2-grid-3"'),
]

# Flex row replacements
FLEX_REPLACEMENTS = [
    (r'className="flex gap-2"', 'className="tb-v2-mode-tabs"'),
    (r'className="flex gap-3"', 'className="tb-v2-mode-tabs"'),
    (r'className="flex flex-wrap gap-2"', 'className="tb-v2-mode-tabs"'),
    (r'className="flex flex-wrap gap-4"', 'className="tb-v2-option-group"'),
]

ALL_REPLACEMENTS = (
    LAYOUT_REPLACEMENTS +
    TEXTAREA_REPLACEMENTS +
    INPUT_REPLACEMENTS +
    LABEL_REPLACEMENTS +
    BUTTON_REPLACEMENTS +
    STAT_REPLACEMENTS +
    RESULT_REPLACEMENTS +
    TEXT_COLOR_REPLACEMENTS +
    COPY_REPLACEMENTS +
    TAB_REPLACEMENTS +
    GRID_REPLACEMENTS +
    FLEX_REPLACEMENTS
)

def transform_file(filepath: Path) -> dict:
    """Transform a single component file. Returns stats."""
    content = filepath.read_text()
    original = content
    stats = {'file': filepath.name, 'changes': 0, 'skipped': False}
    
    # Skip if already fully v2
    if 'tb-v2-tool-card' in content or ('tb-v2-tool-input-head' in content and 'tb-v2-tool-textarea' in content):
        stats['skipped'] = True
        return stats
    
    # Skip ComingSoonUI and very short files
    if len(content) < 200 or 'ComingSoon' in content or 'Configure and use this tool' in content:
        stats['skipped'] = True
        return stats
    
    # Apply replacements (order matters - layouts first, then specific elements)
    for pattern, replacement in ALL_REPLACEMENTS:
        new_content = re.sub(pattern, replacement, content)
        if new_content != content:
            changes = len(re.findall(pattern, content))
            stats['changes'] += changes
            content = new_content
    
    if content != original:
        filepath.write_text(content)
    
    return stats


def main():
    """Transform all tool components."""
    files = sorted(TOOLS_DIR.glob('*Client.tsx'))
    print(f"Found {len(files)} component files")
    
    total_changes = 0
    transformed = 0
    skipped = 0
    
    for f in files:
        stats = transform_file(f)
        if stats['skipped']:
            skipped += 1
        elif stats['changes'] > 0:
            transformed += 1
            total_changes += stats['changes']
            if transformed % 100 == 0:
                print(f"  ... transformed {transformed} files so far")
    
    print(f"\nDone!")
    print(f"  Transformed: {transformed} files ({total_changes} class replacements)")
    print(f"  Skipped (already v2 or special): {skipped}")
    print(f"  Unchanged: {len(files) - transformed - skipped}")


if __name__ == '__main__':
    main()
