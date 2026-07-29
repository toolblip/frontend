#!/usr/bin/env python3
"""
Simple tool UI enhancer - wraps tool content in consistent tb-v2 container.
"""
import os
import re
from pathlib import Path

TOOLS_DIR = Path('/Users/ray/Work/toolblip/components/tools')

# Files to skip (already well-styled or special)
SKIP_FILES = {
    'JsonFormatterClient.tsx',
    'PasswordGeneratorClient.tsx', 
    'ColorPickerClient.tsx',
    'RegexTesterClient.tsx',
    'CronParserClient.tsx',
    'ToolContextControls.tsx',
    'useToolContext.tsx',
}

enhanced = 0
skipped = 0

for f in sorted(TOOLS_DIR.glob('*Client.tsx')):
    if f.name in SKIP_FILES:
        skipped += 1
        continue
    
    content = f.read_text()
    
    # Skip if already has tb-v2-tool-card
    if 'tb-v2-tool-card' in content:
        skipped += 1
        continue
    
    # Skip if less than 20 lines (placeholder)
    if len(content.split('\n')) < 20:
        skipped += 1
        continue
    
    # Find the return statement and wrap content
    # Pattern: return (\n <div className="...">
    # We want to add tb-v2 classes to the outer div
    
    # Simple approach: replace common outer div patterns
    replacements = [
        # Replace max-w-2xl containers
        (r'<div className="max-w-2xl mx-auto p-6 space-y-6">', '<div className="tb-v2-tool-card">'),
        (r'<div className="max-w-2xl mx-auto p-6">', '<div className="tb-v2-tool-card">'),
        (r'<div className="max-w-4xl mx-auto p-6 space-y-6">', '<div className="tb-v2-tool-card">'),
        (r'<div className="max-w-4xl mx-auto p-6">', '<div className="tb-v2-tool-card">'),
        
        # Replace textareas with tb-v2 classes
        (r'className="w-full h-32 p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700"', 'className="tb-v2-tool-textarea"'),
        (r'className="w-full h-48 p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 font-mono text-sm"', 'className="tb-v2-tool-textarea"'),
        (r'className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700"', 'className="tb-v2-input"'),
        
        # Replace buttons
        (r'className="w-full py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"', 'className="tb-v2-btn tb-v2-btn-primary tb-v2-btn-lg"'),
        (r'className="w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"', 'className="tb-v2-btn tb-v2-btn-primary tb-v2-btn-lg"'),
        
        # Replace output containers
        (r'className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg whitespace-pre-wrap"', 'className="tb-v2-tool-output-body"'),
        (r'className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg font-mono text-sm"', 'className="tb-v2-tool-output-body"'),
    ]
    
    new_content = content
    for old, new in replacements:
        new_content = re.sub(old, new, new_content)
    
    if new_content != content:
        f.write_text(new_content)
        enhanced += 1
        print(f"Enhanced: {f.name}")
    else:
        skipped += 1

print(f"\nEnhanced: {enhanced}")
print(f"Skipped: {skipped}")
