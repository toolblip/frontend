#!/usr/bin/env python3
"""Fix tools with short or generic descriptions."""
import re

# Read current content
with open('data/tool-content.ts', 'r') as f:
    content = f.read()

# Find all tool slugs and their descriptions
slugs = re.findall(r'\"([a-z0-9-]+)\":\s*\{\s*description:\s*\`([^\`]+)\`', content)

# Tools that need better descriptions
FIXES = {
    'image-aspect-ratio-calculator': {
        'desc': 'Calculate aspect ratios and find standard dimensions for any image size. Get the perfect ratio for social media, print, and web formats. Enter width and height to instantly see the reduced ratio and common equivalents.',
        'features': ['Instant calculation', 'Standard ratios', 'Social media presets', 'Copy results']
    },
    'unit-converter': {
        'desc': 'Convert between measurement units including length, weight, temperature, volume, and more. Get accurate results for engineering, cooking, and everyday calculations. Supports metric and imperial systems.',
        'features': ['Multiple unit types', 'Accurate results', 'Metric and imperial', 'Copy results']
    },
    'number-base-converter': {
        'desc': 'Convert numbers between binary, octal, decimal, hexadecimal, and other bases. Useful for programmers working with different number systems. See the conversion in all bases simultaneously.',
        'features': ['All common bases', 'Instant conversion', 'Copy results', 'No signup required']
    },
    'sql-prettifier': {
        'desc': 'Format and beautify SQL queries with proper indentation and syntax highlighting. Make complex queries readable with one click. Supports SELECT, INSERT, UPDATE, DELETE, and DDL statements.',
        'features': ['Syntax highlighting', 'Auto-indentation', 'Copy to clipboard', 'No signup required']
    },
    'js-minifier': {
        'desc': 'Minify JavaScript code by removing whitespace, comments, and shortening variable names. Reduce file size for faster page loads. Preserve functionality while optimizing for production.',
        'features': ['Reduces file size', 'Preserves functionality', 'Copy result', 'No signup required']
    },
    'css-preview': {
        'desc': 'Preview CSS code in real-time as you write. See how styles affect HTML elements instantly. Perfect for testing selectors, properties, and values before applying to your project.',
        'features': ['Live preview', 'Syntax highlighting', 'Copy code', 'No signup required']
    },
    'color-mixer': {
        'desc': 'Mix two or more colors to create new shades. Preview the result before mixing. Useful for designers creating color palettes and finding harmonious combinations.',
        'features': ['Multiple color support', 'Live preview', 'Copy result', 'No signup required']
    },
    'xml-formatter': {
        'desc': 'Format and beautify XML documents with proper indentation and syntax highlighting. Make complex XML readable with one click. Validate XML structure and fix formatting issues.',
        'features': ['Auto-indentation', 'Syntax highlighting', 'Validation', 'Copy to clipboard']
    },
    'cors-header-generator': {
        'desc': 'Generate CORS (Cross-Origin Resource Sharing) headers for your API. Configure allowed origins, methods, and headers. Get copy-paste ready configurations for Node.js, Apache, and Nginx.',
        'features': ['Multiple server configs', 'Copy-paste ready', 'Security best practices', 'No signup required']
    },
    'contrast-checker': {
        'desc': 'Check color contrast ratios for WCAG accessibility compliance. Test foreground and background color combinations against AA and AAA standards. Essential for inclusive design.',
        'features': ['WCAG AA/AAA', 'Real-time checking', 'Color picker', 'Copy results']
    },
}

# Replace short descriptions with better ones
for slug, fix in FIXES.items():
    old_pattern = f'"{slug}":\\s*{{[^}}]*?description:\\s*`[^`]+`'
    new_desc = fix['desc'].replace('`', '\\`').replace('${', '\\${')
    new_features = ', '.join(f'"{f}"' for f in fix['features'])
    
    # Find and replace the entire tool entry
    old_entry_pattern = f'"{slug}":\\s*{{[^}}]*?description:\\s*`[^`]+`[^}}]*?features:\\s*\\[[^\\]]*\\]'
    new_entry = f'"{slug}": {{\n    description: `{new_desc}`,\n    examples: [\n      {{ title: `Quick Start`, code: `// Using {slug.replace("-", " ")}\\nconst result = process(input);`\n        ,note: `Get started in seconds.`\n      }},\n    ],\n    features: [{new_features}]\n  }}'
    
    content = re.sub(old_entry_pattern, new_entry, content, flags=re.DOTALL)

# Write updated content
with open('data/tool-content.ts', 'w') as f:
    f.write(content)

print("Fixed short descriptions for tools")
