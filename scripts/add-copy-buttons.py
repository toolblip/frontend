#!/usr/bin/env python3
"""
Batch add copy buttons to tools that don't have them.
Simpler approach that avoids complex regex.
"""
import os
import re
from pathlib import Path

TOOLS_DIR = Path('/Users/ray/Work/toolblip/components/tools')

# Tools to skip
SKIP_TOOLS = {
    'ToolContextControls.tsx',
    'useToolContext.tsx',
    'ToolWrapper.tsx',
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
        
        # Skip if already has copy button
        if 'tb-v2-copy-btn' in content or 'navigator.clipboard' in content:
            skipped += 1
            continue

        # Skip if less than 20 lines
        if len(content.split('\n')) < 20:
            skipped += 1
            continue

        # Check if tool has output section
        if 'output' not in content.lower():
            skipped += 1
            continue

        # Add simple copy button to output
        if '{output && (' in content:
            # Add copy button before output section
            copy_button = '''
      {output && (
        <div className="tb-v2-tool-output-head">
          <span className="tb-v2-tool-label">Output</span>
          <button 
            onClick={() => { navigator.clipboard.writeText(output); }}
            className="tb-v2-copy-btn"
          >
            Copy
          </button>
        </div>'''
            
            # Replace the output section
            content = re.sub(
                r'\{output && \(',
                copy_button,
                content,
                count=1
            )

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
