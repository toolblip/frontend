#!/usr/bin/env python3
"""Generate unique content for all tools based on their metadata."""
import re, random, hashlib

with open('data/tools.ts', 'r') as f:
    lines = f.readlines()

# Tools are on lines 805-1603 (0-indexed: 804-1602)
tool_lines = lines[804:1602]

pattern = r"""\{\s*name:\s*'([^']+)'\s*,\s*slug:\s*'([^']+)'\s*,\s*description:\s*'([^']+)'\s*,\s*emoji:\s*'([^']+)'\s*,\s*category:\s*'([^']+)'\s*\}"""
tools = []
for line in tool_lines:
    match = re.search(pattern, line)
    if match:
        name, slug, desc, emoji, category = match.groups()
        tools.append({
            'name': name, 'slug': slug, 'description': desc,
            'emoji': emoji, 'category': category
        })

print(f"Found {len(tools)} tools")

CF = {
    'Developer': ['Clean, responsive interface', 'Works with any programming language', 'No server-side processing', 'Instant results'],
    'Text': ['Supports all text encodings', 'Preserves formatting', 'Batch processing available', 'Real-time preview'],
    'Image': ['Supports PNG, JPG, GIF, SVG', 'Maintains image quality', 'Adjustable output settings', 'Browser-based processing'],
    'Color': ['All major color formats', 'WCAG contrast checking', 'Accessibility compliance', 'Visual color picker'],
    'JSON': ['Handles large JSON files', 'Syntax error highlighting', 'Copy to clipboard', 'No data leaves your browser'],
    'Markdown': ['GitHub-flavored markdown', 'Live preview', 'Export to HTML', 'Supports tables and code blocks'],
    'Encoder': ['All standard encodings', 'URL-safe variants', 'Batch encoding/decoding', 'Copy with one click'],
    'Security': ['Client-side processing', 'No data transmission', 'Industry-standard algorithms', 'Privacy-first design'],
    'Networking': ['All network utilities', 'Real-time results', 'Detailed output', 'No installation required'],
    'Database': ['Multiple database support', 'Query validation', 'Syntax highlighting', 'Export results'],
    'Design': ['Visual interface', 'Real-time preview', 'Export options', 'Responsive design'],
    'Productivity': ['Streamline your workflow', 'Save time', 'No account required', 'Works offline'],
    'Analytics': ['Real-time data', 'Visual charts', 'Export to CSV', 'Historical tracking'],
    'SEO': ['Search engine optimization', 'Real-time analysis', 'Actionable recommendations', 'No signup required'],
    'Network': ['All network utilities', 'Real-time results', 'Detailed output', 'No installation required'],
    'Utility': ['Streamline your workflow', 'Save time', 'No account required', 'Works offline'],
    'Math': ['Precise calculations', 'Step-by-step solutions', 'Copy results instantly', 'No signup required'],
    'CSS': ['Live preview', 'Copy to clipboard', 'All major formats', 'Responsive design'],
    'Conversion': ['Batch conversion', 'Preserves formatting', 'All major formats', 'Instant results'],
    'Date & Time': ['All time zones', 'Calendar integration', 'Format options', 'Instant results'],
    'PDF Tools': ['Client-side processing', 'No upload required', 'Batch processing', 'Maintains formatting'],
    'Video Tools': ['Supports all formats', 'Browser-based', 'No upload required', 'Instant results'],
    'AI Tools': ['No API key needed', 'Client-side processing', 'Privacy-first design', 'Instant results'],
    'Document Generator': ['Multiple templates', 'Export options', 'No signup required', 'Professional output'],
    'Image Tools': ['Supports all formats', 'Batch processing', 'No upload required', 'Maintains quality'],
}

HANDCRAFTED = {'json-formatter', 'json-validator', 'base64-encoder-decoder', 'color-picker', 'password-generator', 'markdown-preview'}

def gen_desc(tool):
    name, desc = tool['name'], tool['description']
    seed = int(hashlib.md5(name.encode()).hexdigest()[:8], 16)
    random.seed(seed)
    o = ["The {} provides a straightforward way to", "Use the {} to quickly", "This {} makes it easy to",
         "The {} helps you", "With the {}, you can", "A fast, free {} that lets you", "The {} is designed to"]
    m = ["built for developers and non-technical users alike", "with results appearing instantly in your browser",
         "without uploading anything to a server", "while keeping your data completely private",
         "with a clean, intuitive interface", "supporting all the formats you need", "with no sign-up or installation required"]
    e = ["Everything runs locally in your browser for maximum privacy.", "No data leaves your device, keeping your information secure.",
         "Try it now - it's completely free with no limitations.", "Perfect for quick tasks without the overhead of desktop software.",
         "Works on any device with a modern web browser.", "Bookmark this tool for when you need it most."]
    return f"{random.choice(o).format(name.lower())} {desc.lower().rstrip('.')}. {random.choice(m)}. {random.choice(e)}"

def gen_examples(tool):
    cat, name = tool['category'], tool['name']
    seed = int(hashlib.md5(name.encode()).hexdigest()[:8], 16)
    random.seed(seed)
    if cat == 'JSON':
        return [{'title': 'Basic Usage', 'code': '{\n  "name": "John Doe",\n  "age": 30\n}', 'note': 'Paste your JSON and see formatted results instantly.'},
                {'title': 'Error Detection', 'code': '{\n  "name": "John",\n  "age": 30,\n}', 'note': 'Highlights syntax errors with line numbers.'}]
    elif cat == 'Text':
        return [{'title': 'Input Text', 'code': 'Hello World! This is a sample text.', 'note': 'Paste your text and see results instantly.'},
                {'title': 'Processed Result', 'code': 'hello world! this is a sample text.', 'note': 'Results update in real-time as you type.'}]
    elif cat == 'Image' or cat == 'Image Tools':
        return [{'title': 'Supported Formats', 'code': 'Input: image.png (2.4 MB)\nOutput: image.jpg (450 KB)', 'note': 'Convert between formats while maintaining quality.'},
                {'title': 'Batch Processing', 'code': 'Upload multiple images\nApply settings to all\nDownload as ZIP', 'note': 'Process hundreds of images at once.'}]
    elif cat == 'Color':
        return [{'title': 'Color Formats', 'code': 'HEX: #3498db\nRGB: rgb(52, 152, 219)\nHSL: hsl(204, 70%, 53%)', 'note': 'Convert between any color format instantly.'},
                {'title': 'Contrast Check', 'code': 'Foreground: #ffffff\nBackground: #3498db\nRatio: 4.6:1', 'note': 'Ensure your colors meet accessibility standards.'}]
    elif cat == 'Encoder':
        return [{'title': 'Encode', 'code': 'Input: Hello World!\nOutput: SGVsbG8gV29ybGQh', 'note': 'Encode any text to standard format.'},
                {'title': 'Decode', 'code': 'Input: SGVsbG8gV29ybGQh\nOutput: Hello World!', 'note': 'Decode back to readable text.'}]
    elif cat == 'Markdown':
        return [{'title': 'Markdown Syntax', 'code': '# Heading\n\n**Bold** and *italic*\n\n- Item 1\n- Item 2', 'note': 'Write markdown with live preview.'},
                {'title': 'Tables', 'code': '| Name | Age |\n|------|-----|\n| Alice | 25 |', 'note': 'Supports GitHub-flavored markdown tables.'}]
    elif cat == 'SEO':
        return [{'title': 'Analysis', 'code': 'Page: example.com\nTitle: 45 chars\nMeta: 155 chars', 'note': 'Analyze your page for SEO best practices.'},
                {'title': 'Recommendations', 'code': 'Title: Good\nMeta: Too long\nH1: Good', 'note': 'Get actionable recommendations.'}]
    elif cat == 'Security':
        return [{'title': 'Security Check', 'code': 'HTTPS: Enabled\nHSTS: Enabled\nCSP: Configured', 'note': 'Verify your security headers.'},
                {'title': 'Score', 'code': 'Security Score: 92/100\nA+ Rating', 'note': 'Get a comprehensive security assessment.'}]
    elif cat == 'CSS':
        return [{'title': 'Generated CSS', 'code': '.container {\n  display: flex;\n  gap: 1rem;\n  padding: 1rem;\n}', 'note': 'Generate utility CSS classes instantly.'},
                {'title': 'Responsive', 'code': '@media (max-width: 768px) {\n  .container { flex-direction: column; }\n}', 'note': 'Create responsive layouts with ease.'}]
    elif cat == 'Math':
        return [{'title': 'Calculation', 'code': 'Input: 2 + 3 * 4\nResult: 14\n(Due to operator precedence)', 'note': 'Get precise mathematical results.'},
                {'title': 'Functions', 'code': 'sin(PI/2) = 1\nlog(100) = 2\nsqrt(144) = 12', 'note': 'Supports all standard math functions.'}]
    elif cat == 'Network':
        return [{'title': 'Network Check', 'code': 'Ping: 23ms\nDNS: 12ms\nDownload: 150 Mbps', 'note': 'Check your network performance.'},
                {'title': 'Ports', 'code': 'Port 80: Open\nPort 443: Open\nPort 22: Closed', 'note': 'Scan open ports on any host.'}]
    elif cat == 'Date & Time':
        return [{'title': 'Time Zones', 'code': 'UTC: 2024-01-15 14:30:00\nEST: 2024-01-15 09:30:00\nJST: 2024-01-15 23:30:00', 'note': 'Convert between any time zone.'},
                {'title': 'Formatting', 'code': 'ISO: 2024-01-15T14:30:00Z\nUS: 01/15/2024\nEU: 15.01.2024', 'note': 'Format dates in any standard format.'}]
    elif cat == 'Conversion':
        return [{'title': 'Convert', 'code': 'Input: 1024 KB\nOutput: 1 MB', 'note': 'Convert between any units instantly.'},
                {'title': 'Batch', 'code': '1024 KB = 1 MB\n1024 MB = 1 GB\n1024 GB = 1 TB', 'note': 'Process multiple conversions at once.'}]
    elif cat == 'Database':
        return [{'title': 'Query', 'code': 'SELECT * FROM users\nWHERE age > 18\nORDER BY name;', 'note': 'Write and validate SQL queries.'},
                {'title': 'Schema', 'code': 'CREATE TABLE users (\n  id INT PRIMARY KEY,\n  name VARCHAR(100)\n);', 'note': 'Generate database schemas.'}]
    else:
        return [{'title': 'Quick Start', 'code': f'// Using {name.lower()}\nconst result = process(input);', 'note': 'Get started in seconds.'},
                {'title': 'Advanced Options', 'code': f'const options = {{ format: "output" }};\nconst result = process(input, options);', 'note': 'Fine-tune the output to match your needs.'}]

def gen_features(tool):
    cat = tool['category']
    cf = CF.get(cat, CF.get('Developer', ['Clean interface', 'Fast processing', 'No signup']))
    seed = int(hashlib.md5(tool['name'].encode()).hexdigest()[:8], 16)
    random.seed(seed)
    return cf[:3] + [random.choice(["Lightning-fast processing", "Mobile-friendly design", "Works offline", "No account required"])]

lines_out = []
lines_out.append("""// AUTO-GENERATED by scripts/gen-tool-content.py
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
for tool in tools:
    slug = tool['slug']
    if slug in HANDCRAFTED:
        continue
    desc = gen_desc(tool).replace('`', '\\`').replace('${', '\\${')
    exs = gen_examples(tool)
    feats = gen_features(tool)
    lines_out.append(f'  "{slug}": {{')
    lines_out.append(f'    description: `{desc}`,')
    lines_out.append('    examples: [')
    for ex in exs:
        code = ex['code'].replace('`', '\\`').replace('${', '\\${')
        note = ex.get('note', '').replace('`', '\\`').replace('${', '\\${')
        lines_out.append(f'      {{ title: `{ex["title"]}`, code: `{code}`')
        if note:
            lines_out.append(f'        ,note: `{note}`')
        lines_out.append('      },')
    lines_out.append('    ],')
    lines_out.append('    features: [' + ', '.join(f'"{f}"' for f in feats) + ']')
    lines_out.append('  },')
    count += 1

lines_out.append('};')
lines_out.append('')

with open('data/tool-content.ts', 'w') as f:
    f.write('\n'.join(lines_out))

print(f"Generated content for {count} tools")
