#!/usr/bin/env python3
"""Add handcrafted entries back to tool-content.ts."""

# Handcrafted content
HANDCRAFTED = {
    'json-formatter': {
        'desc': 'Format, validate, and minify JSON data with syntax highlighting. Pretty-print compressed JSON, find syntax errors with line numbers, and minify for production. Runs entirely in your browser - no data leaves your device.',
        'examples': [
            {'title': 'Pretty Print', 'code': 'Input: {"name":"John","age":30,"active":true}\n\nOutput:\n{\n  "name": "John",\n  "age": 30,\n  "active": true\n}', 'note': 'Format compressed JSON with proper indentation.'},
            {'title': 'Minify', 'code': 'Input: {\n  "name": "John",\n  "age": 30\n}\n\nOutput: {"name":"John","age":30}', 'note': 'Remove whitespace for production-ready JSON.'}
        ],
        'features': ['Syntax error highlighting', 'Line numbers', 'Copy to clipboard', 'No data leaves browser']
    },
    'json-validator': {
        'desc': 'Validate JSON syntax and structure with detailed error reporting. Find syntax errors with exact line and column numbers, making it easy to fix malformed JSON. Supports all JSON data types and nesting levels.',
        'examples': [
            {'title': 'Valid JSON', 'code': 'Input: {"name": "John", "age": 30}\n\nResult: Valid JSON\nType: Object\nKeys: 2', 'note': 'Instantly validate your JSON structure.'},
            {'title': 'Syntax Error', 'code': 'Input: {"name": "John", "age": 30,}\n\nResult: Invalid JSON\nError: Unexpected token "," at line 1, column 25\nCause: Trailing comma', 'note': 'Get exact error location and explanation.'}
        ],
        'features': ['Line/column error reporting', 'Real-time validation', 'Supports all JSON types', 'Detailed error messages']
    },
    'base64-encoder-decoder': {
        'desc': 'Encode and decode Base64 strings for data transmission and storage. Handle text, images, and binary data. Essential for email attachments, data URLs, and API authentication.',
        'examples': [
            {'title': 'Encode Text', 'code': 'Input: Hello World!\n\nOutput: SGVsbG8gV29ybGQh', 'note': 'Encode any text to Base64 format.'},
            {'title': 'Decode Base64', 'code': 'Input: SGVsbG8gV29ybGQh\n\nOutput: Hello World!', 'note': 'Decode Base64 back to readable text.'}
        ],
        'features': ['Text and binary support', 'URL-safe variant', 'Copy to clipboard', 'No server processing']
    },
    'color-picker': {
        'desc': 'Pick and convert colors between HEX, RGB, HSL, and CMYK formats. Get WCAG contrast ratio checks for accessibility compliance. Perfect for designers and developers who need to work with color values across different formats.',
        'examples': [
            {'title': 'Color Formats', 'code': 'HEX: #3498db\nRGB: rgb(52, 152, 219)\nHSL: hsl(204, 70%, 53%)\nCMYK: cmyk(76%, 30%, 0%, 14%)', 'note': 'Convert any color between all major formats.'},
            {'title': 'Contrast Check', 'code': 'Foreground: #ffffff\nBackground: #3498db\n\nContrast ratio: 4.6:1\nWCAG AA: Pass (normal text)\nWCAG AAA: Fail (normal text)\nWCAG AA: Pass (large text)', 'note': 'Check if your color combination meets accessibility standards.'}
        ],
        'features': ['All color formats', 'WCAG contrast checking', 'Visual picker', 'Copy values']
    },
    'password-generator': {
        'desc': 'Generate strong, random passwords with customizable length and character types. Use crypto.getRandomValues for cryptographically secure randomness. Include uppercase, lowercase, numbers, and symbols.',
        'examples': [
            {'title': 'Strong Password', 'code': 'Length: 20\nUppercase: Yes\nLowercase: Yes\nNumbers: Yes\nSymbols: Yes\n\nResult: k8Lm2nQ9vR5tYw1x', 'note': 'Generate a strong 20-character password.'},
            {'title': 'PIN Code', 'code': 'Length: 6\nNumbers only: Yes\n\nResult: 847291', 'note': 'Generate a numeric PIN code.'}
        ],
        'features': ['Cryptographically secure', 'Customizable options', 'Strength indicator', 'Copy to clipboard']
    },
    'markdown-preview': {
        'desc': 'Preview Markdown text in real-time as you write. See headers, lists, code blocks, links, and formatting rendered instantly. Perfect for writing documentation, READMEs, and blog posts.',
        'examples': [
            {'title': 'Basic Markdown', 'code': '# Heading\n\n**Bold text** and *italic*\n\n- List item 1\n- List item 2\n\n```js\nconsole.log("Hello!");\n```', 'note': 'Write markdown with live preview.'},
            {'title': 'Tables', 'code': '| Name | Age |\n|------|-----|\n| Alice | 25 |\n| Bob | 30 |', 'note': 'Supports GitHub-flavored markdown tables.'}
        ],
        'features': ['Live preview', 'GitHub-flavored markdown', 'Code syntax highlighting', 'Export to HTML']
    }
}

# Read current content
with open('data/tool-content.ts', 'r') as f:
    content = f.read()

# Add handcrafted entries before the closing brace
handcrafted_entries = []
for slug, data in HANDCRAFTED.items():
    desc = data['desc'].replace('`', '\\`').replace('${', '\\${')
    examples = []
    for ex in data['examples']:
        code = ex['code'].replace('`', '\\`').replace('${', '\\${')
        note = ex.get('note', '').replace('`', '\\`').replace('${', '\\${')
        entry = f'      {{ title: `{ex["title"]}`, code: `{code}`'
        if note:
            entry += f'\n        ,note: `{note}`'
        entry += ' },'
        examples.append(entry)
    
    features = ', '.join(f'"{f}"' for f in data['features'])
    
    entry = f'  "{slug}": {{\n    description: `{desc}`,\n    examples: [\n' + '\n'.join(examples) + '\n    ],\n    features: [{features}]\n  }},'
    handcrafted_entries.append(entry)

# Insert before the closing brace
insert_point = content.rfind('};')
if insert_point != -1:
    content = content[:insert_point] + '\n'.join(handcrafted_entries) + '\n' + content[insert_point:]

# Write updated content
with open('data/tool-content.ts', 'w') as f:
    f.write(content)

print("Added handcrafted entries back to tool-content.ts")
