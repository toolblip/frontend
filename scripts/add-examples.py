#!/usr/bin/env python3
"""
Add examples to tools based on their category.
This script enhances tools with appropriate example data.
"""
import os
import re
from pathlib import Path

TOOLS_DIR = Path('/Users/ray/Work/toolblip/components/tools')

# Example data by category
CATEGORY_EXAMPLES = {
    'text': {
        'Simple Text': 'Hello, World! This is a sample text.',
        'Sample Paragraph': 'The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.',
    },
    'json': {
        'Simple Object': '{"name": "John", "age": 30}',
        'Array': '[1, 2, 3, 4, 5]',
    },
    'url': {
        'Simple URL': 'https://toolblip.com',
        'With Parameters': 'https://example.com/page?id=123&name=test',
    },
    'email': {
        'Simple Email': 'user@example.com',
        'With Name': 'John Doe <john@example.com>',
    },
    'html': {
        'Simple HTML': '<div class="container"><h1>Hello</h1><p>World</p></div>',
        'Form': '<form><input type="text" name="email"><button type="submit">Submit</button></form>',
    },
    'css': {
        'Simple CSS': '.container { display: flex; gap: 16px; }',
        'Card': '.card { padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }',
    },
    'code': {
        'JavaScript': 'const greeting = (name) => `Hello, ${name}!`;',
        'Python': 'def greet(name):\n    return f"Hello, {name}!"',
    },
}

# Tools to skip (already have examples or are special)
SKIP_TOOLS = {
    'JsonFormatterClient.tsx',
    'Base64EncoderDecoderClient.tsx',
    'JsonToCsvClient.tsx',
    'ToolWrapper.tsx',
}

enhanced = 0
skipped = 0

for f in sorted(TOOLS_DIR.glob('*Client.tsx')):
    if f.name in SKIP_TOOLS:
        skipped += 1
        continue

    try:
        content = f.read_text()
        
        # Skip if already has examples
        if 'EXAMPLES' in content or 'Load an example' in content:
            skipped += 1
            continue

        # Skip if less than 20 lines
        if len(content.split('\n')) < 20:
            skipped += 1
            continue

        # Determine tool category from filename
        name_lower = f.stem.lower()
        
        # Find appropriate examples
        examples = None
        if any(x in name_lower for x in ['json', 'csv', 'xml', 'yaml', 'toml']):
            examples = CATEGORY_EXAMPLES['json']
        elif any(x in name_lower for x in ['url', 'encode', 'decode', 'base64']):
            examples = CATEGORY_EXAMPLES['url']
        elif any(x in name_lower for x in ['email', 'mail']):
            examples = CATEGORY_EXAMPLES['email']
        elif any(x in name_lower for x in ['html', 'markup']):
            examples = CATEGORY_EXAMPLES['html']
        elif any(x in name_lower for x in ['css', 'style']):
            examples = CATEGORY_EXAMPLES['css']
        elif any(x in name_lower for x in ['code', 'js', 'py', 'java']):
            examples = CATEGORY_EXAMPLES['code']
        elif any(x in name_lower for x in ['text', 'word', 'string', 'counter']):
            examples = CATEGORY_EXAMPLES['text']

        if not examples:
            skipped += 1
            continue

        # Check if tool has textarea or input
        if 'textarea' not in content and 'input' not in content:
            skipped += 1
            continue

        # Add examples state and handler
        if 'const [showExamples, setShowExamples]' not in content:
            # Add state for examples
            content = content.replace(
                "const [input, setInput] = useState('');",
                "const [input, setInput] = useState('');\n  const [showExamples, setShowExamples] = useState(false);"
            )
            
            # Add examples data
            examples_js = str(examples).replace("'", "\\'")
            content = content.replace(
                "return (",
                f"const EXAMPLES = {examples_js};\n\n  const loadExample = (data: string) => {{\n    setInput(data);\n    setShowExamples(false);\n  }};\n\n  return ("
            )
            
            # Add examples button to input head
            content = re.sub(
                r'<div className="tb-v2-tool-input-head">',
                '''<div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Input</span>
        <button
          type="button"
          onClick={() => setShowExamples(!showExamples)}
          className="tb-v2-btn tb-v2-btn-ghost tb-v2-btn-sm"
        >
          📋 Examples
        </button>''',
                content
            )
            
            # Add examples dropdown before textarea
            content = re.sub(
                r'<textarea',
                '''{showExamples && (
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mb-3 border border-gray-200 dark:border-gray-700">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Load an example:</div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(EXAMPLES).map(([label, data]) => (
              <button
                key={label}
                type="button"
                onClick={() => loadExample(data as string)}
                className="px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
      <textarea''',
                content
            )

            f.write_text(content)
            enhanced += 1
            print(f"Enhanced: {f.name}")
        else:
            skipped += 1

    except Exception as e:
        print(f"Error: {f.name}: {e}")

print(f"\nEnhanced: {enhanced}")
print(f"Skipped: {skipped}")
