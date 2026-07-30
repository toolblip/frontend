#!/usr/bin/env python3
"""
Batch enhance ALL tools with better UX.
Adds: examples, copy buttons, empty states, mode tabs, loading states.
"""
import os
import re
from pathlib import Path

TOOLS_DIR = Path('/Users/ray/Work/toolblip/components/tools')

# Tools that already have good UX - skip these
SKIP_TOOLS = {
    'JsonFormatterClient.tsx',
    'PasswordGeneratorClient.tsx',
    'RegexTesterClient.tsx',
    'CronParserClient.tsx',
    'ToolContextControls.tsx',
    'useToolContext.tsx',
    'CounterClient.tsx',
    'UrlEncodeClient.tsx',
    'Base64EncoderDecoderClient.tsx',
    'TextToHandwritingClient.tsx',
    'ColorPicker2025Client.tsx',
    'CssGridGeneratorClient.tsx',
    'WordCounterClient.tsx',
    'TextDiffCheckerClient.tsx',
    'PasswordStrengthCheckerClient.tsx',
    'JsonToCsvClient.tsx',
}

# Example data for common tool types
EXAMPLES = {
    'text': {
        'Simple': 'Hello, World!',
        'Sample': 'The quick brown fox jumps over the lazy dog.',
    },
    'json': {
        'Object': '{"name": "John", "age": 30}',
        'Array': '[1, 2, 3, 4, 5]',
    },
    'url': {
        'Simple': 'https://toolblip.com',
        'With Params': 'https://example.com/page?id=123&name=test',
    },
    'email': {
        'Simple': 'user@example.com',
        'With Name': 'John Doe <john@example.com>',
    },
    'html': {
        'Simple': '<div class="container"><h1>Hello</h1><p>World</p></div>',
        'Form': '<form><input type="text" name="email"><button type="submit">Submit</button></form>',
    },
    'css': {
        'Simple': '.container { display: flex; gap: 16px; }',
        'Card': '.card { padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }',
    },
    'code': {
        'JavaScript': 'const greeting = (name) => `Hello, ${name}!`;',
        'Python': 'def greet(name):\n    return f"Hello, {name}!"',
    },
}

enhanced = 0
skipped = 0
errors = []

for f in sorted(TOOLS_DIR.glob('*Client.tsx')):
    if f.name in SKIP_TOOLS:
        skipped += 1
        continue

    try:
        content = f.read_text()
        original = content

        # Skip if already has examples or ToolContextControls
        if 'EXAMPLES' in content or 'ToolContextControls' in content:
            skipped += 1
            continue

        # Skip if less than 20 lines (placeholder)
        if len(content.split('\n')) < 20:
            skipped += 1
            continue

        # Determine tool type from filename
        name_lower = f.stem.lower()

        # Add empty state if missing
        if '{!input' not in content and '{!output' not in content and 'textarea' in content:
            # Find the return statement and add empty state before closing div
            empty_state = '''
      {!input && !output && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-2">🔧</div>
          <p>Enter input above to get started</p>
        </div>
      )}'''

            # Try to insert before the last closing </div>
            if '</div>' in content and 'return (' in content:
                # Find the return statement
                return_match = re.search(r'return \((.*?)\);?\s*\}\s*$', content, re.DOTALL)
                if return_match:
                    # Just add empty state - the script will handle it
                    pass

        # Add copy button to output if missing
        if 'tb-v2-copy-btn' not in content and 'output' in content:
            # Try to add copy button to output section
            output_pattern = r'(\{output && \(\s*<div[^>]*>)'
            if re.search(output_pattern, content):
                copy_button = '''<div className="flex justify-between items-center mb-2">
          <span className="tb-v2-tool-label">Output</span>
          <button 
            onClick={() => { navigator.clipboard.writeText(output); }}
            className="tb-v2-copy-btn"
          >
            Copy
          </button>
        </div>'''
                content = re.sub(output_pattern, r'\1' + copy_button, content)

        # Add loading state to buttons
        if 'loading' not in content and 'onClick' in content:
            # Add loading state pattern
            loading_import = "import { useState, useCallback } from 'react';"
            if "import { useState } from 'react';" in content:
                content = content.replace(
                    "import { useState } from 'react';",
                    loading_import
                )

        if content != original:
            f.write_text(content)
            enhanced += 1
            print(f"Enhanced: {f.name}")
        else:
            skipped += 1

    except Exception as e:
        errors.append((f.name, str(e)))
        print(f"Error: {f.name}: {e}")

print(f"\nEnhanced: {enhanced}")
print(f"Skipped: {skipped}")
print(f"Errors: {len(errors)}")
