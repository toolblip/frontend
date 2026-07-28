#!/usr/bin/env python3
"""Add handcrafted entries back to tool-content.ts - FIXED version."""

# Handcrafted content
HANDCRAFTED = [
    ('json-formatter', {
        'desc': 'Format, validate, and minify JSON data with syntax highlighting. Pretty-print compressed JSON, find syntax errors with line numbers, and minify for production. Runs entirely in your browser - no data leaves your device.',
        'examples': [
            ('Pretty Print', 'Input: {"name":"John","age":30,"active":true}\n\nOutput:\n{\n  "name": "John",\n  "age": 30,\n  "active": true\n}', 'Format compressed JSON with proper indentation.'),
            ('Minify', 'Input: {\n  "name": "John",\n  "age": 30\n}\n\nOutput: {"name":"John","age":30}', 'Remove whitespace for production-ready JSON.')
        ],
        'features': ['Syntax error highlighting', 'Line numbers', 'Copy to clipboard', 'No data leaves browser']
    }),
    ('json-validator', {
        'desc': 'Validate JSON syntax and structure with detailed error reporting. Find syntax errors with exact line and column numbers, making it easy to fix malformed JSON. Supports all JSON data types and nesting levels.',
        'examples': [
            ('Valid JSON', 'Input: {"name": "John", "age": 30}\n\nResult: Valid JSON\nType: Object\nKeys: 2', 'Instantly validate your JSON structure.'),
            ('Syntax Error', 'Input: {"name": "John", "age": 30,}\n\nResult: Invalid JSON\nError: Unexpected token "," at line 1, column 25\nCause: Trailing comma', 'Get exact error location and explanation.')
        ],
        'features': ['Line/column error reporting', 'Real-time validation', 'Supports all JSON types', 'Detailed error messages']
    }),
    ('base64-encoder-decoder', {
        'desc': 'Encode and decode Base64 strings for data transmission and storage. Handle text, images, and binary data. Essential for email attachments, data URLs, and API authentication.',
        'examples': [
            ('Encode Text', 'Input: Hello World!\n\nOutput: SGVsbG8gV29ybGQh', 'Encode any text to Base64 format.'),
            ('Decode Base64', 'Input: SGVsbG8gV29ybGQh\n\nOutput: Hello World!', 'Decode Base64 back to readable text.')
        ],
        'features': ['Text and binary support', 'URL-safe variant', 'Copy to clipboard', 'No server processing']
    }),
    ('color-picker', {
        'desc': 'Pick and convert colors between HEX, RGB, HSL, and CMYK formats. Get WCAG contrast ratio checks for accessibility compliance. Perfect for designers and developers who need to work with color values across different formats.',
        'examples': [
            ('Color Formats', 'HEX: #3498db\nRGB: rgb(52, 152, 219)\nHSL: hsl(204, 70%, 53%)\nCMYK: cmyk(76%, 30%, 0%, 14%)', 'Convert any color between all major formats.'),
            ('Contrast Check', 'Foreground: #ffffff\nBackground: #3498db\n\nContrast ratio: 4.6:1\nWCAG AA: Pass (normal text)\nWCAG AAA: Fail (normal text)\nWCAG AA: Pass (large text)', 'Check if your color combination meets accessibility standards.')
        ],
        'features': ['All color formats', 'WCAG contrast checking', 'Visual picker', 'Copy values']
    }),
    ('password-generator', {
        'desc': 'Generate strong, random passwords with customizable length and character types. Use crypto.getRandomValues for cryptographically secure randomness. Include uppercase, lowercase, numbers, and symbols.',
        'examples': [
            ('Strong Password', 'Length: 20\nUppercase: Yes\nLowercase: Yes\nNumbers: Yes\nSymbols: Yes\n\nResult: k8Lm2nQ9vR5tYw1x', 'Generate a strong 20-character password.'),
            ('PIN Code', 'Length: 6\nNumbers only: Yes\n\nResult: 847291', 'Generate a numeric PIN code.')
        ],
        'features': ['Cryptographically secure', 'Customizable options', 'Strength indicator', 'Copy to clipboard']
    }),
    ('markdown-preview', {
        'desc': 'Preview Markdown text in real-time as you write. See headers, lists, code blocks, links, and formatting rendered instantly. Perfect for writing documentation, READMEs, and blog posts.',
        'examples': [
            ('Basic Markdown', '# Heading\n\n**Bold text** and *italic*\n\n- List item 1\n- List item 2', 'Write markdown with live preview.'),
            ('Tables', '| Name | Age |\n|------|-----|\n| Alice | 25 |\n| Bob   | 30 |', 'Supports GitHub-flavored markdown tables.')
        ],
        'features': ['Live preview', 'GitHub-flavored markdown', 'Code syntax highlighting', 'Export to HTML']
    })
]

# Read current content
with open('data/tool-content.ts', 'r') as f:
    content = f.read()

# Remove any existing handcrafted entries (with {features} bug)
import re
for slug, _ in HANDCRAFTED:
    # Remove entries with {features} bug
    content = re.sub(r'  "' + slug + r'": \{[^}]*\{features\}[^}]*\},', '', content, flags=re.DOTALL)

# Build handcrafted entries
handcrafted_entries = []
for slug, data in HANDCRAFTED:
    desc = data['desc'].replace('`', '\\`').replace('${', '\\${')
    
    examples = []
    for title, code, note in data['examples']:
        code_escaped = code.replace('`', '\\`').replace('${', '\\${')
        note_escaped = note.replace('`', '\\`').replace('${', '\\${')
        examples.append(f'      {{ title: `{title}`, code: `{code_escaped}`\n        ,note: `{note_escaped}` }},')
    
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

print("Added handcrafted entries (fixed version)")
