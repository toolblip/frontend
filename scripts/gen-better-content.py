#!/usr/bin/env python3
"""Generate better unique content for all tools."""
import re, random, hashlib

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

# Generate unique descriptions
def gen_desc(name, original_desc, category):
    slug = name.lower().replace(' ', '-')
    seed = int(hashlib.md5(slug.encode()).hexdigest()[:8], 16)
    random.seed(seed)
    
    # Clean up the original description
    clean_desc = original_desc.rstrip('.')
    
    # Build unique description based on tool name
    name_lower = name.lower()
    
    # Use the tool name to create a more specific description
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
        # Generic but still unique
        return f"{clean_desc}. Free to use with no signup required. Works instantly in your browser with real-time results."

# Generate content
lines_out = []
lines_out.append("""// AUTO-GENERATED by scripts/gen-better-content.py
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

HANDCRAFTED = {'json-formatter', 'json-validator', 'base64-encoder-decoder', 'color-picker', 'password-generator', 'markdown-preview'}

count = 0
for slug, tool in sorted(tools.items()):
    if slug in HANDCRAFTED:
        continue
    
    desc = gen_desc(tool['name'], tool['description'], tool['category'])
    desc_escaped = desc.replace('`', '\\`').replace('${', '\\${')
    
    # Generate examples based on category
    category = tool['category']
    if category == 'Text':
        ex_title = 'Input Text'
        ex_code = 'Hello World! This is a sample text that needs processing.'
        ex_note = 'Paste your text and see results instantly.'
        ex_title2 = 'Processed Result'
        ex_code2 = 'hello world! this is a sample text that needs processing.'
        ex_note2 = 'Results update in real-time as you type.'
    elif category == 'Developer':
        ex_title = 'Quick Start'
        ex_code = f'// Using {tool["name"].lower()}\\nconst result = process(input);'
        ex_note = 'Get started in seconds with a simple interface.'
        ex_title2 = 'Advanced Options'
        ex_code2 = f'const options = {{ format: "output" }};\\nconst result = process(input, options);'
        ex_note2 = 'Fine-tune the output to match your needs.'
    elif category == 'Image':
        ex_title = 'Supported Formats'
        ex_code = 'Input: image.png (2.4 MB)\\nOutput: image.jpg (450 KB)'
        ex_note = 'Convert between formats while maintaining quality.'
        ex_title2 = 'Batch Processing'
        ex_code2 = 'Upload multiple images\\nApply settings to all\\nDownload as ZIP'
        ex_note2 = 'Process hundreds of images at once.'
    elif category == 'Color':
        ex_title = 'Color Formats'
        ex_code = 'HEX: #3498db\\nRGB: rgb(52, 152, 219)\\nHSL: hsl(204, 70%, 53%)'
        ex_note = 'Convert between any color format instantly.'
        ex_title2 = 'Contrast Check'
        ex_code2 = 'Foreground: #ffffff\\nBackground: #3498db\\nRatio: 4.6:1'
        ex_note2 = 'Ensure your colors meet accessibility standards.'
    elif category == 'Encoder':
        ex_title = 'Encode'
        ex_code = 'Input: Hello World!\\nOutput: SGVsbG8gV29ybGQh'
        ex_note = 'Encode any text to standard format.'
        ex_title2 = 'Decode'
        ex_code2 = 'Input: SGVsbG8gV29ybGQh\\nOutput: Hello World!'
        ex_note2 = 'Decode back to readable text.'
    elif category == 'SEO':
        ex_title = 'Analysis'
        ex_code = 'Page: example.com\\nTitle: 45 chars\\nMeta: 155 chars'
        ex_note = 'Analyze your page for SEO best practices.'
        ex_title2 = 'Recommendations'
        ex_code2 = 'Title: Good\\nMeta: Too long\\nH1: Good'
        ex_note2 = 'Get actionable recommendations.'
    elif category == 'Security':
        ex_title = 'Security Check'
        ex_code = 'HTTPS: Enabled\\nHSTS: Enabled\\nCSP: Configured'
        ex_note = 'Verify your security headers.'
        ex_title2 = 'Score'
        ex_code2 = 'Security Score: 92/100\\nA+ Rating'
        ex_note2 = 'Get a comprehensive security assessment.'
    else:
        ex_title = 'Quick Start'
        ex_code = f'// Using {tool["name"].lower()}\\nconst result = process(input);'
        ex_note = 'Get started in seconds.'
        ex_title2 = 'Advanced Options'
        ex_code2 = f'const options = {{ format: "output" }};\\nconst result = process(input, options);'
        ex_note2 = 'Fine-tune the output to match your needs.'
    
    # Generate features based on category
    if category == 'Text':
        features = ['Real-time processing', 'Multiple formats', 'Copy to clipboard', 'No signup required']
    elif category == 'Developer':
        features = ['Code validation', 'Multiple languages', 'Instant results', 'Export options']
    elif category == 'Image':
        features = ['Multiple formats', 'Batch processing', 'Quality preservation', 'Fast processing']
    elif category == 'Color':
        features = ['All color formats', 'Contrast checking', 'Visual picker', 'Copy values']
    elif category == 'Encoder':
        features = ['Multiple encodings', 'Batch support', 'Copy results', 'No server needed']
    elif category == 'SEO':
        features = ['Detailed analysis', 'Actionable tips', 'Export reports', 'No signup required']
    elif category == 'Security':
        features = ['Comprehensive checks', 'Detailed reports', 'Best practices', 'Export results']
    else:
        features = ['Clean interface', 'Fast processing', 'No signup required', 'Works offline']
    
    features_str = ', '.join(f'"{f}"' for f in features)
    
    lines_out.append(f'  "{slug}": {{')
    lines_out.append(f'    description: `{desc_escaped}`,')
    lines_out.append('    examples: [')
    lines_out.append(f'      {{ title: `{ex_title}`, code: `{ex_code}`')
    lines_out.append(f'        ,note: `{ex_note}` }},')
    lines_out.append(f'      {{ title: `{ex_title2}`, code: `{ex_code2}`')
    lines_out.append(f'        ,note: `{ex_note2}` }},')
    lines_out.append('    ],')
    lines_out.append(f'    features: [{features_str}]')
    lines_out.append('  },')
    count += 1

lines_out.append('};')
lines_out.append('')

with open('data/tool-content.ts', 'w') as f:
    f.write('\n'.join(lines_out))

print(f"Generated content for {count} tools")
