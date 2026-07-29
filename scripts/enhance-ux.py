#!/usr/bin/env python3
"""
Comprehensive tool UI/UX enhancer.
Fixes: duplicate titles, generic buttons, missing copy, basic output.
"""
import os
import re
from pathlib import Path

TOOLS_DIR = Path('/Users/ray/Work/toolblip/components/tools')

# Tool-specific enhancements
TOOL_ENHANCEMENTS = {
    'counter': {
        'remove_title': True,
        'remove_desc': True,
        'button_text': 'Count',
        'placeholder': 'Enter text to count characters, words, and lines...',
        'has_stats': True,
    },
    'word-counter': {
        'remove_title': True,
        'remove_desc': True,
        'button_text': 'Count Words',
        'placeholder': 'Paste your text here to count words, characters, and lines...',
        'has_stats': True,
    },
    'character-counter': {
        'remove_title': True,
        'remove_desc': True,
        'button_text': 'Count Characters',
        'placeholder': 'Enter text to count characters...',
        'has_stats': True,
    },
    'json-formatter': {
        'remove_title': True,
        'remove_desc': True,
        'has_modes': True,
        'has_copy': True,
    },
    'url-encoder': {
        'remove_title': True,
        'remove_desc': True,
        'has_modes': True,
        'has_copy': True,
        'placeholder': 'Enter URL or text to encode/decode...',
    },
    'base64-encoder-decoder': {
        'remove_title': True,
        'remove_desc': True,
        'has_modes': True,
        'has_copy': True,
        'placeholder': 'Enter text to encode/decode...',
    },
    'md5-hash-generator': {
        'remove_title': True,
        'remove_desc': True,
        'has_copy': True,
        'placeholder': 'Enter text to generate hash...',
    },
    'password-generator': {
        'remove_title': True,
        'remove_desc': True,
        'has_copy': True,
        'has_options': True,
    },
    'color-picker': {
        'remove_title': True,
        'remove_desc': True,
        'has_copy': True,
    },
    'gradient-generator': {
        'remove_title': True,
        'remove_desc': True,
        'has_copy': True,
        'has_preview': True,
    },
}

# Common patterns to fix
PATTERNS_TO_FIX = [
    # Remove duplicate h1 titles (page already shows them)
    (r'<h1 className="text-2xl font-bold">[^<]+</h1>\s*', ''),
    # Remove duplicate descriptions
    (r'<p className="text-gray-600 dark:text-gray-400">[^<]+</p>\s*', ''),
    # Fix generic "Process" buttons to be more specific
    (r'>Process<', '>Run<'),
    # Add copy button to output
    (r'(\{output && \(\s*<div className="tb-v2-tool-output-body">)', r'''\1
        <div className="flex justify-between items-center mb-2">
          <span className="tb-v2-tool-label">Output</span>
          <button 
            onClick={() => { navigator.clipboard.writeText(output); }}
            className="tb-v2-copy-btn"
          >
            Copy
          </button>
        </div>'''),
]

enhanced = 0
errors = []

for f in sorted(TOOLS_DIR.glob('*Client.tsx')):
    try:
        content = f.read_text()
        original = content
        
        # Apply common fixes
        for pattern, replacement in PATTERNS_TO_FIX:
            content = re.sub(pattern, replacement, content)
        
        # Apply tool-specific enhancements if available
        slug = f.stem.replace('Client', '')
        slug = re.sub(r'(?<!^)(?=[A-Z])', '-', slug).lower()
        
        if slug in TOOL_ENHANCEMENTS:
            enh = TOOL_ENHANCEMENTS[slug]
            
            if enh.get('remove_title'):
                # Remove the duplicate h1
                content = re.sub(r'<h1 className="text-2xl font-bold">[^<]+</h1>\s*', '', content)
            
            if enh.get('remove_desc'):
                # Remove the duplicate description
                content = re.sub(r'<p className="text-gray-600 dark:text-gray-400">[^<]+</p>\s*', '', content)
            
            if enh.get('button_text'):
                # Replace generic button text
                content = re.sub(r'>Process<', f'>{enh["button_text"]}<', content)
                content = re.sub(r'>Run<', f'>{enh["button_text"]}<', content)
            
            if enh.get('placeholder'):
                # Update placeholder
                content = re.sub(
                    r'placeholder="[^"]*"',
                    f'placeholder="{enh["placeholder"]}"',
                    content
                )
        
        if content != original:
            f.write_text(content)
            enhanced += 1
            print(f"Enhanced: {f.name}")
    
    except Exception as e:
        errors.append((f.name, str(e)))
        print(f"Error: {f.name}: {e}")

print(f"\nEnhanced: {enhanced}")
print(f"Errors: {len(errors)}")
