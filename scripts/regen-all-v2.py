#!/usr/bin/env python3
"""Regenerate tool-content.ts from batch files and handcrafted entries."""
import re, glob, hashlib, random

# Read tools.ts to get all tool slugs
with open('data/tools.ts', 'r') as f:
    lines = f.readlines()

tool_lines = lines[804:1602]
pattern = r"""\{\s*name:\s*'([^']+)'\s*,\s*slug:\s*'([^']+)'\s*,\s*description:\s*'([^']+)'\s*,\s*emoji:\s*'([^']+)'\s*,\s*category:\s*'([^']+)'\s*\}"""
tools = {}
for line in tool_lines:
    match = re.search(pattern, line)
    if match:
        name, slug, desc, emoji, category = match.groups()
        tools[slug] = {'name': name, 'description': desc, 'category': category, 'emoji': emoji}

print(f"Found {len(tools)} tools in tools.ts")

# Extract all entries from batch files
batch_files = sorted(glob.glob('data/fix-batch*.ts'))
print(f"Found {len(batch_files)} batch files")

batch_entries = {}
for bf in batch_files:
    with open(bf, 'r') as f:
        content = f.read()
    
    # Find all entries using the FixBatchEntry format
    # Pattern: 'slug': {\n    description: `...`,\n    examples: [...],\n  },
    entries = re.finditer(r"'([a-z0-9-]+)':\s*\{\s*\n\s*description:\s*`([^`]+)`", content)
    for m in entries:
        slug = m.group(1)
        desc = m.group(2)
        
        # Extract examples
        examples = []
        example_pattern = r"\{\s*title:\s*`([^`]+)`,\s*code:\s*`([^`]+)`(?:\s*,\s*note:\s*`([^`]+)`)?\s*\}"
        for ex in re.finditer(example_pattern, content[m.start():m.start()+2000]):
            title = ex.group(1)
            code = ex.group(2)
            note = ex.group(3) or ''
            examples.append((title, code, note))
        
        batch_entries[slug] = {
            'desc': desc,
            'examples': examples
        }

print(f"Extracted {len(batch_entries)} entries from batch files")

# Handcrafted entries
HANDCRAFTED = {
    'json-formatter': {
        'desc': 'Format, validate, and minify JSON data with syntax highlighting. Pretty-print compressed JSON, find syntax errors with line numbers, and minify for production. Runs entirely in your browser - no data leaves your device.',
        'examples': [
            ('Pretty Print', 'Input: {"name":"John","age":30,"active":true}\n\nOutput:\n{\n  "name": "John",\n  "age": 30,\n  "active": true\n}', 'Format compressed JSON with proper indentation.'),
            ('Minify', 'Input: {\n  "name": "John",\n  "age": 30\n}\n\nOutput: {"name":"John","age":30}', 'Remove whitespace for production-ready JSON.')
        ],
        'features': ['Syntax error highlighting', 'Line numbers', 'Copy to clipboard', 'No data leaves browser']
    },
    'json-validator': {
        'desc': 'Validate JSON syntax and structure with detailed error reporting. Find syntax errors with exact line and column numbers, making it easy to fix malformed JSON. Supports all JSON data types and nesting levels.',
        'examples': [
            ('Valid JSON', 'Input: {"name": "John", "age": 30}\n\nResult: Valid JSON\nType: Object\nKeys: 2', 'Instantly validate your JSON structure.'),
            ('Syntax Error', 'Input: {"name": "John", "age": 30,}\n\nResult: Invalid JSON\nError: Unexpected token "," at line 1, column 25\nCause: Trailing comma', 'Get exact error location and explanation.')
        ],
        'features': ['Line/column error reporting', 'Real-time validation', 'Supports all JSON types', 'Detailed error messages']
    },
    'base64-encoder-decoder': {
        'desc': 'Encode and decode Base64 strings for data transmission and storage. Handle text, images, and binary data. Essential for email attachments, data URLs, and API authentication.',
        'examples': [
            ('Encode Text', 'Input: Hello World!\n\nOutput: SGVsbG8gV29ybGQh', 'Encode any text to Base64 format.'),
            ('Decode Base64', 'Input: SGVsbG8gV29ybGQh\n\nOutput: Hello World!', 'Decode Base64 back to readable text.')
        ],
        'features': ['Text and binary support', 'URL-safe variant', 'Copy to clipboard', 'No server processing']
    },
    'color-picker': {
        'desc': 'Pick and convert colors between HEX, RGB, HSL, and CMYK formats. Get WCAG contrast ratio checks for accessibility compliance. Perfect for designers and developers who need to work with color values across different formats.',
        'examples': [
            ('Color Formats', 'HEX: #3498db\nRGB: rgb(52, 152, 219)\nHSL: hsl(204, 70%, 53%)\nCMYK: cmyk(76%, 30%, 0%, 14%)', 'Convert any color between all major formats.'),
            ('Contrast Check', 'Foreground: #ffffff\nBackground: #3498db\n\nContrast ratio: 4.6:1\nWCAG AA: Pass (normal text)\nWCAG AAA: Fail (normal text)\nWCAG AA: Pass (large text)', 'Check if your color combination meets accessibility standards.')
        ],
        'features': ['All color formats', 'WCAG contrast checking', 'Visual picker', 'Copy values']
    },
    'password-generator': {
        'desc': 'Generate strong, random passwords with customizable length and character types. Use crypto.getRandomValues for cryptographically secure randomness. Include uppercase, lowercase, numbers, and symbols.',
        'examples': [
            ('Strong Password', 'Length: 20\nUppercase: Yes\nLowercase: Yes\nNumbers: Yes\nSymbols: Yes\n\nResult: k8Lm2nQ9vR5tYw1x', 'Generate a strong 20-character password.'),
            ('PIN Code', 'Length: 6\nNumbers only: Yes\n\nResult: 847291', 'Generate a numeric PIN code.')
        ],
        'features': ['Cryptographically secure', 'Customizable options', 'Strength indicator', 'Copy to clipboard']
    },
    'markdown-preview': {
        'desc': 'Preview Markdown text in real-time as you write. See headers, lists, code blocks, links, and formatting rendered instantly. Perfect for writing documentation, READMEs, and blog posts.',
        'examples': [
            ('Basic Markdown', '# Heading\n\n**Bold text** and *italic*\n\n- List item 1\n- List item 2', 'Write markdown with live preview.'),
            ('Tables', '| Name | Age |\n|------|-----|\n| Alice | 25 |\n| Bob   | 30 |', 'Supports GitHub-flavored markdown tables.')
        ],
        'features': ['Live preview', 'GitHub-flavored markdown', 'Code syntax highlighting', 'Export to HTML']
    }
}

# Generate fallback content for tools not in batch files
def gen_fallback(name, desc, category):
    seed = int(hashlib.md5(name.encode()).hexdigest()[:8], 16)
    random.seed(seed)
    clean_desc = desc.rstrip('.')
    return f"{clean_desc}. Free to use with no signup required. Works instantly in your browser with real-time results."

# Build output
out = []
out.append("""// AUTO-GENERATED by scripts/regen-all-v2.py
// Handcrafted entries preserved. Do not edit manually.

export interface ToolContentExample {
  title: string;
  code: string;
  note?: string;
}

export interface ToolContent {
  description: string;
  examples: ToolContentExample[];
  features: string[];
}

export function getToolContent(slug: string): ToolContent | undefined {
  return TOOL_CONTENT[slug];
}

const TOOL_CONTENT: Record<string, ToolContent> = {""")

count = 0
for slug in sorted(tools.keys()):
    tool = tools[slug]
    
    if slug in HANDCRAFTED:
        data = HANDCRAFTED[slug]
        desc = data['desc'].replace('`', '\\`').replace('${', '\\${')
        features = ', '.join(f'"{f}"' for f in data['features'])
        examples_lines = []
        for title, code, note in data['examples']:
            code_e = code.replace('`', '\\`').replace('${', '\\${')
            note_e = note.replace('`', '\\`').replace('${', '\\${')
            examples_lines.append(f'      {{ title: `{title}`, code: `{code_e}`\n        ,note: `{note_e}` }}')
    elif slug in batch_entries:
        data = batch_entries[slug]
        desc = data['desc'].replace('`', '\\`').replace('${', '\\${')
        features = '"Clean interface", "Fast processing", "No signup required", "Works offline"'
        examples_lines = []
        for title, code, note in data['examples']:
            code_e = code.replace('`', '\\`').replace('${', '\\${')
            note_e = note.replace('`', '\\`').replace('${', '\\${')
            examples_lines.append(f'      {{ title: `{title}`, code: `{code_e}`\n        ,note: `{note_e}` }}')
    else:
        # Fallback
        desc = gen_fallback(tool['name'], tool['description'], tool['category']).replace('`', '\\`').replace('${', '\\${')
        features = '"Clean interface", "Fast processing", "No signup required", "Works offline"'
        examples_lines = [
            '      { title: `Quick Start`, code: `// Using this tool\nconst result = process(input);`\n        ,note: `Get started in seconds.` }',
            '      { title: `Advanced Options`, code: `const options = { format: "output" };\nconst result = process(input, options);`\n        ,note: `Fine-tune the output to match your needs.` }'
        ]
    
    out.append(f'  "{slug}": {{')
    out.append(f'    description: `{desc}`,')
    out.append('    examples: [')
    out.append(',\n'.join(examples_lines))
    out.append('    ],')
    out.append(f'    features: [{features}]')
    out.append('  },')
    count += 1

out.append('};')
out.append('')

with open('data/tool-content.ts', 'w') as f:
    f.write('\n'.join(out))

print(f"Generated content for {count} tools")
print(f"From batch files: {len(batch_entries)}")
print(f"Handcrafted: {len(HANDCRAFTED)}")
print(f"Fallback: {count - len(batch_entries) - len(HANDCRAFTED)}")
