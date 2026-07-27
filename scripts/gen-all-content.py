#!/usr/bin/env python3
"""Generate all tool content in one clean pass."""
import re, hashlib, random

# Read tools.ts
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

print(f"Found {len(tools)} tools")

# Handcrafted content
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

def gen_desc(name, original_desc, category):
    slug = name.lower().replace(' ', '-')
    seed = int(hashlib.md5(slug.encode()).hexdigest()[:8], 16)
    random.seed(seed)
    clean_desc = original_desc.rstrip('.')
    name_lower = name.lower()
    
    if 'converter' in name_lower:
        return f"Convert {clean_desc} with accurate results. Supports multiple input and output formats with instant processing. No signup required, works entirely in your browser."
    elif 'generator' in name_lower:
        return f"Generate {clean_desc} with customizable options. Create unique outputs every time with different settings and configurations. Free to use with no limitations."
    elif 'counter' in name_lower:
        return f"Count and analyze {clean_desc} with precision. Get real-time statistics including totals, averages, and detailed breakdowns. Export results in various formats."
    elif 'checker' in name_lower:
        return f"Check and validate {clean_desc} against standards and best practices. Get detailed reports with specific issues and recommendations for improvement."
    elif 'validator' in name_lower:
        return f"Validate {clean_desc} with detailed error reporting. Find issues with exact line and column numbers for easy debugging and correction."
    elif 'editor' in name_lower:
        return f"Edit and modify {clean_desc} with intuitive controls. Make changes in real-time with instant preview and undo support for all modifications."
    elif 'viewer' in name_lower:
        return f"View and inspect {clean_desc} with clarity. Zoom, pan, and examine details with multiple viewing modes and export options."
    elif 'calculator' in name_lower:
        return f"Calculate {clean_desc} with precision. Get accurate results with step-by-step explanations and the ability to save or export your calculations."
    elif 'finder' in name_lower:
        return f"Find {clean_desc} quickly and easily. Search with multiple filters and sorting options to locate exactly what you need in seconds."
    elif 'fixer' in name_lower:
        return f"Fix issues with {clean_desc} automatically. Detect and correct common problems with one-click solutions and detailed fix reports."
    elif 'maker' in name_lower:
        return f"Create {clean_desc} with this free tool. Build custom designs with templates, fonts, and export options for any use case."
    elif 'builder' in name_lower:
        return f"Build {clean_desc} with ease. Construct custom configurations with drag-and-drop interface and export to multiple formats."
    elif 'extractor' in name_lower:
        return f"Extract {clean_desc} from any source. Pull data from documents, images, or URLs with high accuracy and batch processing support."
    elif ' remover' in name_lower:
        return f"Remove {clean_desc} quickly and easily. Delete unwanted elements with precision while preserving the rest of your content."
    elif 'split' in name_lower:
        return f"Split {clean_desc} into parts. Divide by size, count, or custom patterns with preview before splitting and download options."
    elif 'merge' in name_lower:
        return f"Merge {clean_desc} together. Combine multiple files or data sources with options for ordering and formatting the output."
    elif 'sort' in name_lower:
        return f"Sort {clean_desc} in any order. Arrange alphabetically, numerically, or by custom criteria with ascending and descending options."
    elif 'compare' in name_lower:
        return f"Compare {clean_desc} side by side. Highlight differences, similarities, and changes with visual indicators and exportable reports."
    elif 'test' in name_lower:
        return f"Test {clean_desc} with this free tool. Verify functionality, performance, and correctness with comprehensive test suites."
    elif 'preview' in name_lower:
        return f"Preview {clean_desc} in real-time. See changes instantly as you make them with multiple viewing modes and responsive design."
    elif 'search' in name_lower:
        return f"Search for {clean_desc} quickly. Find results with advanced filtering, sorting, and highlighting of matches."
    elif 'replace' in name_lower:
        return f"Replace {clean_desc} instantly. Swap text, patterns, or elements with regex support and preview before applying changes."
    elif 'format' in name_lower:
        return f"Format {clean_desc} for better readability. Apply consistent styling with customizable rules and export options."
    elif 'minify' in name_lower:
        return f"Minify {clean_desc} for production. Reduce file size while preserving functionality with configurable compression levels."
    elif 'beautify' in name_lower or 'pretty' in name_lower:
        return f"Beautify {clean_desc} for better readability. Apply proper indentation, spacing, and formatting with multiple style options."
    elif 'encode' in name_lower:
        return f"Encode {clean_desc} for safe transmission. Convert to standard formats with support for multiple encoding types."
    elif 'decode' in name_lower:
        return f"Decode {clean_desc} back to readable format. Transform encoded data with automatic format detection and error handling."
    elif 'encrypt' in name_lower:
        return f"Encrypt {clean_desc} for security. Protect your data with strong encryption algorithms and customizable key options."
    elif 'decrypt' in name_lower:
        return f"Decrypt {clean_desc} back to plain text. Unlock encrypted data with support for multiple encryption standards."
    elif 'compress' in name_lower:
        return f"Compress {clean_desc} to save space. Reduce file size with configurable compression levels while maintaining quality."
    elif 'download' in name_lower:
        return f"Download {clean_desc} instantly. Save to your device with one click and multiple format options available."
    elif 'upload' in name_lower:
        return f"Upload {clean_desc} easily. Transfer files to the cloud with drag-and-drop support and progress tracking."
    elif 'share' in name_lower:
        return f"Share {clean_desc} with others. Distribute via link, email, or social media with privacy controls and tracking."
    elif 'save' in name_lower:
        return f"Save {clean_desc} for later use. Store in the cloud with automatic syncing across devices and version history."
    elif 'load' in name_lower:
        return f"Load {clean_desc} quickly. Access from cloud storage, local files, or URLs with fast loading and caching."
    elif 'export' in name_lower:
        return f"Export {clean_desc} in various formats. Download as PDF, CSV, JSON, or other formats with customizable options."
    elif 'import' in name_lower:
        return f"Import {clean_desc} from external sources. Load from files, URLs, or APIs with automatic format detection."
    elif 'create' in name_lower:
        return f"Create {clean_desc} from scratch. Build custom solutions with templates, fonts, and export options for any use case."
    elif 'delete' in name_lower:
        return f"Delete {clean_desc} permanently. Remove with confirmation and undo support to prevent accidental data loss."
    elif 'copy' in name_lower:
        return f"Copy {clean_desc} with one click. Duplicate to clipboard with formatting options and paste-ready output."
    elif 'paste' in name_lower:
        return f"Paste {clean_desc} from clipboard. Import with automatic format detection and validation before processing."
    elif 'undo' in name_lower:
        return f"Undo changes to {clean_desc} instantly. Revert to previous state with multiple undo levels and history."
    elif 'redo' in name_lower:
        return f"Redo changes to {clean_desc} easily. Reapply modifications with multiple redo levels and history tracking."
    elif 'zoom' in name_lower:
        return f"Zoom in and out of {clean_desc} smoothly. Scale to any size with smooth animations and fit-to-screen options."
    elif 'rotate' in name_lower:
        return f"Rotate {clean_desc} to any angle. Turn with precision using degree input or preset angles for common rotations."
    elif 'flip' in name_lower:
        return f"Flip {clean_desc} horizontally or vertically. Mirror with one click and preview before applying changes."
    elif 'crop' in name_lower:
        return f"Crop {clean_desc} to desired size. Trim with custom dimensions, aspect ratios, or freeform selection."
    elif 'resize' in name_lower:
        return f"Resize {clean_desc} to any dimensions. Scale proportionally or custom with preview and quality options."
    elif 'scale' in name_lower:
        return f"Scale {clean_desc} proportionally. Resize while maintaining aspect ratio with percentage or pixel input."
    elif 'align' in name_lower:
        return f"Align {clean_desc} to grid or edges. Position with snap-to-grid, center, or distribute options."
    elif 'distribute' in name_lower:
        return f"Distribute {clean_desc} evenly. Space with equal gaps between items or align to edges."
    elif 'group' in name_lower:
        return f"Group {clean_desc} together. Combine into logical sets for easier management and bulk operations."
    elif 'ungroup' in name_lower:
        return f"Ungroup {clean_desc} into individual elements. Separate for individual editing while preserving structure."
    elif 'lock' in name_lower:
        return f"Lock {clean_desc} to prevent changes. Protect from accidental edits with password or pattern lock."
    elif 'unlock' in name_lower:
        return f"Unlock {clean_desc} for editing. Release from protection with authentication or pattern input."
    elif 'hide' in name_lower:
        return f"Hide {clean_desc} from view. Conceal with one click while keeping data intact for later use."
    elif 'show' in name_lower:
        return f"Show {clean_desc} in the interface. Reveal hidden content with toggle or search functionality."
    elif 'enable' in name_lower:
        return f"Enable {clean_desc} functionality. Activate features with one click and configure settings as needed."
    elif 'disable' in name_lower:
        return f"Disable {clean_desc} functionality. Deactivate features to save resources or prevent conflicts."
    elif 'start' in name_lower:
        return f"Start {clean_desc} process. Begin with one click and monitor progress with status indicators."
    elif 'stop' in name_lower:
        return f"Stop {clean_desc} process. Halt immediately with confirmation and save partial progress if needed."
    elif 'pause' in name_lower:
        return f"Pause {clean_desc} temporarily. Suspend with one click and resume later from where you left off."
    elif 'resume' in name_lower:
        return f"Resume {clean_desc} from where it left off. Continue process with saved state and progress."
    elif 'reset' in name_lower:
        return f"Reset {clean_desc} to default state. Restore original settings with confirmation and undo support."
    elif 'clear' in name_lower:
        return f"Clear {clean_desc} completely. Empty with confirmation to prevent accidental data loss."
    elif 'fill' in name_lower:
        return f"Fill {clean_desc} with data. Populate automatically from templates, databases, or user input."
    elif 'empty' in name_lower:
        return f"Empty {clean_desc} of all content. Remove everything with confirmation and undo support."
    elif 'select' in name_lower:
        return f"Select {clean_desc} from options. Choose with search, filters, or manual input for precise selection."
    elif 'deselect' in name_lower:
        return f"Deselect {clean_desc} to remove selection. Uncheck individual items or clear all selections."
    elif 'toggle' in name_lower:
        return f"Toggle {clean_desc} on and off. Switch between states with visual feedback and keyboard shortcuts."
    elif 'switch' in name_lower:
        return f"Switch {clean_desc} to another mode. Change settings with preview and save options."
    elif 'change' in name_lower:
        return f"Change {clean_desc} as needed. Modify with real-time preview and undo support for all changes."
    elif 'update' in name_lower:
        return f"Update {clean_desc} to latest version. Refresh with new features and improvements."
    elif 'refresh' in name_lower:
        return f"Refresh {clean_desc} with new data. Reload with cache clearing and fresh content options."
    elif 'reload' in name_lower:
        return f"Reload {clean_desc} from source. Fetch latest version with progress tracking."
    elif 'fetch' in name_lower:
        return f"Fetch {clean_desc} from external source. Retrieve with error handling and retry options."
    elif 'pull' in name_lower:
        return f"Pull {clean_desc} from remote. Download with progress tracking and resume support."
    elif 'push' in name_lower:
        return f"Push {clean_desc} to remote. Upload with progress tracking and error handling."
    elif 'sync' in name_lower:
        return f"Sync {clean_desc} across devices. Keep updated with automatic or manual synchronization."
    elif 'backup' in name_lower:
        return f"Backup {clean_desc} for safekeeping. Save with versioning and automatic scheduling options."
    elif 'restore' in name_lower:
        return f"Restore {clean_desc} from backup. Recover with preview and selective restore options."
    elif 'recover' in name_lower:
        return f"Recover {clean_desc} that was lost. Retrieve deleted or corrupted data with scanning options."
    elif 'retrieve' in name_lower:
        return f"Retrieve {clean_desc} from storage. Fetch with search and filter options for quick access."
    elif 'store' in name_lower:
        return f"Store {clean_desc} for later use. Save with encryption and automatic organization."
    elif 'cache' in name_lower:
        return f"Cache {clean_desc} for faster access. Store temporarily with automatic expiration and clearing."
    elif 'queue' in name_lower:
        return f"Queue {clean_desc} for processing. Line up with priority and order management options."
    elif 'stack' in name_lower:
        return f"Stack {clean_desc} vertically. Layer with z-index control and grouping options."
    else:
        return f"{clean_desc}. Free to use with no signup required. Works instantly in your browser with real-time results."

def gen_features(category):
    if category == 'Text':
        return ['Real-time processing', 'Multiple formats', 'Copy to clipboard', 'No signup required']
    elif category == 'Developer':
        return ['Code validation', 'Multiple languages', 'Instant results', 'Export options']
    elif category == 'Image':
        return ['Multiple formats', 'Batch processing', 'Quality preservation', 'Fast processing']
    elif category == 'Color':
        return ['All color formats', 'Contrast checking', 'Visual picker', 'Copy values']
    elif category == 'Encoder':
        return ['Multiple encodings', 'Batch support', 'Copy results', 'No server needed']
    elif category == 'SEO':
        return ['Detailed analysis', 'Actionable tips', 'Export reports', 'No signup required']
    elif category == 'Security':
        return ['Comprehensive checks', 'Detailed reports', 'Best practices', 'Export results']
    else:
        return ['Clean interface', 'Fast processing', 'No signup required', 'Works offline']

def gen_examples(name, category):
    if category == 'Text':
        return [('Input Text', 'Hello World! This is a sample text that needs processing.', 'Paste your text and see results instantly.'), ('Processed Result', 'hello world! this is a sample text that needs processing.', 'Results update in real-time as you type.')]
    elif category == 'Developer':
        return [('Quick Start', f'// Using {name.lower()}\nconst result = process(input);', 'Get started in seconds with a simple interface.'), ('Advanced Options', f'const options = {{ format: "output" }};\nconst result = process(input, options);', 'Fine-tune the output to match your needs.')]
    elif category == 'Image':
        return [('Supported Formats', 'Input: image.png (2.4 MB)\nOutput: image.jpg (450 KB)', 'Convert between formats while maintaining quality.'), ('Batch Processing', 'Upload multiple images\nApply settings to all\nDownload as ZIP', 'Process hundreds of images at once.')]
    elif category == 'Color':
        return [('Color Formats', 'HEX: #3498db\nRGB: rgb(52, 152, 219)\nHSL: hsl(204, 70%, 53%)', 'Convert between any color format instantly.'), ('Contrast Check', 'Foreground: #ffffff\nBackground: #3498db\nRatio: 4.6:1', 'Ensure your colors meet accessibility standards.')]
    elif category == 'Encoder':
        return [('Encode', 'Input: Hello World!\nOutput: SGVsbG8gV29ybGQh', 'Encode any text to standard format.'), ('Decode', 'Input: SGVsbG8gV29ybGQh\nOutput: Hello World!', 'Decode back to readable text.')]
    elif category == 'SEO':
        return [('Analysis', 'Page: example.com\nTitle: 45 chars\nMeta: 155 chars', 'Analyze your page for SEO best practices.'), ('Recommendations', 'Title: Good\nMeta: Too long\nH1: Good', 'Get actionable recommendations.')]
    elif category == 'Security':
        return [('Security Check', 'HTTPS: Enabled\nHSTS: Enabled\nCSP: Configured', 'Verify your security headers.'), ('Score', 'Security Score: 92/100\nA+ Rating', 'Get a comprehensive security assessment.')]
    else:
        return [('Quick Start', f'// Using {name.lower()}\nconst result = process(input);', 'Get started in seconds.'), ('Advanced Options', f'const options = {{ format: "output" }};\nconst result = process(input, options);', 'Fine-tune the output to match your needs.')]

# Build output
out = []
out.append("""// AUTO-GENERATED by scripts/gen-all-content.py
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
    else:
        desc = gen_desc(tool['name'], tool['description'], tool['category']).replace('`', '\\`').replace('${', '\\${')
        features = ', '.join(f'"{f}"' for f in gen_features(tool['category']))
        exs = gen_examples(tool['name'], tool['category'])
        examples_lines = []
        for title, code, note in exs:
            code_e = code.replace('`', '\\`').replace('${', '\\${')
            note_e = note.replace('`', '\\`').replace('${', '\\${')
            examples_lines.append(f'      {{ title: `{title}`, code: `{code_e}`\n        ,note: `{note_e}` }}')
    
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
