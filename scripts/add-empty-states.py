#!/usr/bin/env python3
"""
Simple batch enhancement: add empty states and better placeholders.
"""
import os
import re
from pathlib import Path

TOOLS_DIR = Path('/Users/ray/Work/toolblip/components/tools')

enhanced = 0
skipped = 0

for f in sorted(TOOLS_DIR.glob('*Client.tsx')):
    try:
        content = f.read_text()
        
        # Skip if already has empty state
        if 'Enter input above' in content or 'Paste or type' in content:
            skipped += 1
            continue

        # Skip if less than 20 lines
        if len(content.split('\n')) < 20:
            skipped += 1
            continue

        # Check if tool has textarea or input
        if 'textarea' not in content and 'input' not in content:
            skipped += 1
            continue

        # Add empty state before closing div
        empty_state = '''
      {!input && !output && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-2">🔧</div>
          <p>Enter input above to get started</p>
        </div>
      )}'''

        # Try to add empty state
        if '</div>' in content and 'return (' in content:
            # Find the last closing div before return
            content = content.rstrip()
            if content.endswith('}'):
                content = content[:-1] + empty_state + '\n}'

                f.write_text(content)
                enhanced += 1
                print(f"Enhanced: {f.name}")
            else:
                skipped += 1
        else:
            skipped += 1

    except Exception as e:
        print(f"Error: {f.name}: {e}")

print(f"\nEnhanced: {enhanced}")
print(f"Skipped: {skipped}")
