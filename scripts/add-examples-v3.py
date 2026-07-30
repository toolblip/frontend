#!/usr/bin/env python3
"""
Batch enhance ALL tools with examples and copy buttons.
Fixed version with proper escaping using JSON format.
"""
import os
import re
import json
from pathlib import Path

TOOLS_DIR = Path('/Users/ray/Work/toolblip/components/tools')

# Example data by tool type
EXAMPLES = {
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

# Tools to skip
SKIP_TOOLS = {
    'ToolContextControls.tsx',
    'useToolContext.tsx',
    'ToolWrapper.tsx',
    'JsonFormatterClient.tsx',
    'Base64EncoderDecoderClient.tsx',
    'JsonToCsvClient.tsx',
    'CounterClient.tsx',
    'UrlEncodeClient.tsx',
    'TextToHandwritingClient.tsx',
    'ColorPicker2025Client.tsx',
    'CssGridGeneratorClient.tsx',
    'WordCounterClient.tsx',
    'TextDiffCheckerClient.tsx',
    'PasswordStrengthCheckerClient.tsx',
    'PasswordGeneratorClient.tsx',
    'RegexTesterClient.tsx',
    'CronParserClient.tsx',
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
            examples = EXAMPLES['json']
        elif any(x in name_lower for x in ['url', 'encode', 'decode', 'base64']):
            examples = EXAMPLES['url']
        elif any(x in name_lower for x in ['email', 'mail']):
            examples = EXAMPLES['email']
        elif any(x in name_lower for x in ['html', 'markup']):
            examples = EXAMPLES['html']
        elif any(x in name_lower for x in ['css', 'style']):
            examples = EXAMPLES['css']
        elif any(x in name_lower for x in ['code', 'js', 'py', 'java']):
            examples = EXAMPLES['code']
        elif any(x in name_lower for x in ['text', 'word', 'string', 'counter']):
            examples = EXAMPLES['text']

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
            
            # Add examples data - use JSON format for proper escaping
            examples_json = json.dumps(examples, indent=2)
            content = content.replace(
                "return (",
                f"const EXAMPLES = {examples_json};\n\n  const loadExample = (data: string) => {{\n    setInput(data);\n    setShowExamples(false);\n  }};\n\n  return ("
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
        errors.append((f.name, str(e)))
        print(f"Error: {f.name}: {e}")

print(f"\nEnhanced: {enhanced}")
print(f"Skipped: {skipped}")
print(f"Errors: {len(errors)}")
