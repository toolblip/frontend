#!/usr/bin/env python3
"""Fix tools with thin content by generating unique descriptions."""
import re, random, hashlib

# Read tools.ts to get tool descriptions
with open('data/tools.ts', 'r') as f:
    tool_lines = f.readlines()

tool_lines = tool_lines[804:1602]
pattern = r"""\{\s*name:\s*'([^']+)'\s*,\s*slug:\s*'([^']+)'\s*,\s*description:\s*'([^']+)'\s*,\s*emoji:\s*'([^']+)'\s*,\s*category:\s*'([^']+)'\s*\}"""
tools = {}
for line in tool_lines:
    match = re.search(pattern, line)
    if match:
        name, slug, desc, emoji, category = match.groups()
        tools[slug] = {'name': name, 'description': desc, 'category': category}

# Read current content
with open('data/tool-content.ts', 'r') as f:
    content = f.read()

# Find all entries
entries = re.findall(r'"([a-z0-9-]+)":\s*\{\s*description:\s*`([^`]+)`', content)

# Get tools with thin content
thin_slugs = [slug for slug, desc in entries if len(desc) < 100]

print(f"Fixing {len(thin_slugs)} tools with thin content...")

# Generate unique descriptions for each thin tool
def gen_unique_desc(slug, tool_info):
    name = tool_info['name']
    desc = tool_info['description']
    category = tool_info['category']
    
    seed = int(hashlib.md5(slug.encode()).hexdigest()[:8], 16)
    random.seed(seed)
    
    # Build description based on tool name keywords
    name_lower = name.lower()
    desc_lower = desc.lower()
    
    # Specific openings based on tool type
    if 'converter' in name_lower:
        openings = [
            f"Transform {desc_lower.rstrip('.')} between different formats instantly.",
            f"Switch between formats quickly with {desc_lower.rstrip('.')}.",
            f"Convert {desc_lower.rstrip('.')} with accurate results every time.",
        ]
    elif 'generator' in name_lower:
        openings = [
            f"Create {desc_lower.rstrip('.')} with this free online tool.",
            f"Generate {desc_lower.rstrip('.')} instantly in your browser.",
            f"Build {desc_lower.rstrip('.')} with customizable options.",
        ]
    elif 'counter' in name_lower:
        openings = [
            f"Count and analyze {desc_lower.rstrip('.')} with precision.",
            f"Get accurate counts for {desc_lower.rstrip('.')} in real-time.",
            f"Track {desc_lower.rstrip('.')} with instant results.",
        ]
    elif 'checker' in name_lower:
        openings = [
            f"Check and validate {desc_lower.rstrip('.')} with detailed reports.",
            f"Verify {desc_lower.rstrip('.')} against standards and best practices.",
            f"Analyze {desc_lower.rstrip('.')} for issues and improvements.",
        ]
    elif 'validator' in name_lower:
        openings = [
            f"Validate {desc_lower.rstrip('.')} with detailed error reporting.",
            f"Check {desc_lower.rstrip('.')} for correctness and completeness.",
            f"Ensure {desc_lower.rstrip('.')} meets all requirements.",
        ]
    elif 'editor' in name_lower:
        openings = [
            f"Edit and modify {desc_lower.rstrip('.')} with ease.",
            f"Make changes to {desc_lower.rstrip('.')} in real-time.",
            f"Customize {desc_lower.rstrip('.')} with intuitive controls.",
        ]
    elif 'viewer' in name_lower:
        openings = [
            f"View and inspect {desc_lower.rstrip('.')} with clarity.",
            f"See {desc_lower.rstrip('.')} in detail with zoom controls.",
            f"Examine {desc_lower.rstrip('.')} from every angle.",
        ]
    elif 'calculator' in name_lower:
        openings = [
            f"Calculate {desc_lower.rstrip('.')} with precision.",
            f"Get accurate results for {desc_lower.rstrip('.')} calculations.",
            f"Perform {desc_lower.rstrip('.')} computations instantly.",
        ]
    elif 'finder' in name_lower:
        openings = [
            f"Find {desc_lower.rstrip('.')} quickly and easily.",
            f"Search for {desc_lower.rstrip('.')} with instant results.",
            f"Locate {desc_lower.rstrip('.')} in seconds.",
        ]
    elif 'fixer' in name_lower:
        openings = [
            f"Fix issues with {desc_lower.rstrip('.')} automatically.",
            f"Repair {desc_lower.rstrip('.')} with one click.",
            f"Correct {desc_lower.rstrip('.')} for optimal results.",
        ]
    elif 'maker' in name_lower:
        openings = [
            f"Create {desc_lower.rstrip('.')} with this free tool.",
            f"Build {desc_lower.rstrip('.')} in seconds.",
            f"Design {desc_lower.rstrip('.')} with custom options.",
        ]
    elif 'builder' in name_lower:
        openings = [
            f"Build {desc_lower.rstrip('.')} with ease.",
            f"Construct {desc_lower.rstrip('.')} step by step.",
            f"Create {desc_lower.rstrip('.')} from scratch.",
        ]
    elif 'extractor' in name_lower:
        openings = [
            f"Extract {desc_lower.rstrip('.')} from any source.",
            f"Pull out {desc_lower.rstrip('.')} with one click.",
            f"Get {desc_lower.rstrip('.')} from documents and files.",
        ]
    elif ' remover' in name_lower:
        openings = [
            f"Remove {desc_lower.rstrip('.')} quickly and easily.",
            f"Eliminate {desc_lower.rstrip('.')} with precision.",
            f"Delete {desc_lower.rstrip('.')} permanently.",
        ]
    elif 'split' in name_lower:
        openings = [
            f"Split {desc_lower.rstrip('.')} into parts.",
            f"Divide {desc_lower.rstrip('.')} as needed.",
            f"Separate {desc_lower.rstrip('.')} into sections.",
        ]
    elif 'merge' in name_lower:
        openings = [
            f"Merge {desc_lower.rstrip('.')} together.",
            f"Combine {desc_lower.rstrip('.')} seamlessly.",
            f"Join {desc_lower.rstrip('.')} into one.",
        ]
    elif 'sort' in name_lower:
        openings = [
            f"Sort {desc_lower.rstrip('.')} in any order.",
            f"Arrange {desc_lower.rstrip('.')} alphabetically or numerically.",
            f"Organize {desc_lower.rstrip('.')} with one click.",
        ]
    elif 'compare' in name_lower:
        openings = [
            f"Compare {desc_lower.rstrip('.')} side by side.",
            f"See differences in {desc_lower.rstrip('.')} instantly.",
            f"Analyze {desc_lower.rstrip('.')} for similarities and differences.",
        ]
    elif 'test' in name_lower:
        openings = [
            f"Test {desc_lower.rstrip('.')} with this free tool.",
            f"Verify {desc_lower.rstrip('.')} works correctly.",
            f"Check {desc_lower.rstrip('.')} against expected results.",
        ]
    elif 'preview' in name_lower:
        openings = [
            f"Preview {desc_lower.rstrip('.')} in real-time.",
            f"See how {desc_lower.rstrip('.')} will look before applying.",
            f"Get instant preview of {desc_lower.rstrip('.')}.",
        ]
    elif 'search' in name_lower:
        openings = [
            f"Search for {desc_lower.rstrip('.')} quickly.",
            f"Find {desc_lower.rstrip('.')} with ease.",
            f"Locate {desc_lower.rstrip('.')} in seconds.",
        ]
    elif 'replace' in name_lower:
        openings = [
            f"Replace {desc_lower.rstrip('.')} instantly.",
            f"Swap {desc_lower.rstrip('.')} with precision.",
            f"Substitute {desc_lower.rstrip('.')} automatically.",
        ]
    elif 'format' in name_lower:
        openings = [
            f"Format {desc_lower.rstrip('.')} for better readability.",
            f"Clean up {desc_lower.rstrip('.')} automatically.",
            f"Beautify {desc_lower.rstrip('.')} with proper styling.",
        ]
    elif 'minify' in name_lower:
        openings = [
            f"Minify {desc_lower.rstrip('.')} for production.",
            f"Compress {desc_lower.rstrip('.')} to save space.",
            f"Reduce {desc_lower.rstrip('.')} file size.",
        ]
    elif 'beautify' in name_lower or 'pretty' in name_lower:
        openings = [
            f"Beautify {desc_lower.rstrip('.')} for better readability.",
            f"Make {desc_lower.rstrip('.')} look professional.",
            f"Format {desc_lower.rstrip('.')} with proper indentation.",
        ]
    elif 'encode' in name_lower:
        openings = [
            f"Encode {desc_lower.rstrip('.')} for safe transmission.",
            f"Transform {desc_lower.rstrip('.')} into encoded format.",
            f"Convert {desc_lower.rstrip('.')} to standard encoding.",
        ]
    elif 'decode' in name_lower:
        openings = [
            f"Decode {desc_lower.rstrip('.')} back to readable format.",
            f"Transform encoded {desc_lower.rstrip('.')} into plain text.",
            f"Convert {desc_lower.rstrip('.')} from encoded format.",
        ]
    elif 'encrypt' in name_lower:
        openings = [
            f"Encrypt {desc_lower.rstrip('.')} for security.",
            f"Protect {desc_lower.rstrip('.')} with encryption.",
            f"Secure {desc_lower.rstrip('.')} from unauthorized access.",
        ]
    elif 'decrypt' in name_lower:
        openings = [
            f"Decrypt {desc_lower.rstrip('.')} back to plain text.",
            f"Unlock {desc_lower.rstrip('.')} with decryption.",
            f"Reveal {desc_lower.rstrip('.')} from encrypted format.",
        ]
    elif 'compress' in name_lower:
        openings = [
            f"Compress {desc_lower.rstrip('.')} to save space.",
            f"Reduce {desc_lower.rstrip('.')} file size.",
            f"Make {desc_lower.rstrip('.')} smaller without quality loss.",
        ]
    elif 'download' in name_lower:
        openings = [
            f"Download {desc_lower.rstrip('.')} instantly.",
            f"Save {desc_lower.rstrip('.')} with one click.",
            f"Get {desc_lower.rstrip('.')} as a file.",
        ]
    elif 'upload' in name_lower:
        openings = [
            f"Upload {desc_lower.rstrip('.')} easily.",
            f"Transfer {desc_lower.rstrip('.')} to the cloud.",
            f"Send {desc_lower.rstrip('.')} to any device.",
        ]
    elif 'share' in name_lower:
        openings = [
            f"Share {desc_lower.rstrip('.')} with others.",
            f"Distribute {desc_lower.rstrip('.')} easily.",
            f"Send {desc_lower.rstrip('.')} to friends and colleagues.",
        ]
    elif 'save' in name_lower:
        openings = [
            f"Save {desc_lower.rstrip('.')} for later use.",
            f"Keep {desc_lower.rstrip('.')} safe and accessible.",
            f"Store {desc_lower.rstrip('.')} in the cloud.",
        ]
    elif 'load' in name_lower:
        openings = [
            f"Load {desc_lower.rstrip('.')} quickly.",
            f"Access {desc_lower.rstrip('.')} instantly.",
            f"Retrieve {desc_lower.rstrip('.')} from storage.",
        ]
    elif 'export' in name_lower:
        openings = [
            f"Export {desc_lower.rstrip('.')} in various formats.",
            f"Download {desc_lower.rstrip('.')} as a file.",
            f"Save {desc_lower.rstrip('.')} for external use.",
        ]
    elif 'import' in name_lower:
        openings = [
            f"Import {desc_lower.rstrip('.')} from external sources.",
            f"Bring in {desc_lower.rstrip('.')} from other tools.",
            f"Load {desc_lower.rstrip('.')} from files.",
        ]
    elif 'create' in name_lower:
        openings = [
            f"Create {desc_lower.rstrip('.')} from scratch.",
            f"Build {desc_lower.rstrip('.')} with ease.",
            f"Generate {desc_lower.rstrip('.')} with custom options.",
        ]
    elif 'delete' in name_lower:
        openings = [
            f"Delete {desc_lower.rstrip('.')} permanently.",
            f"Remove {desc_lower.rstrip('.')} completely.",
            f"Erase {desc_lower.rstrip('.')} with one click.",
        ]
    elif 'copy' in name_lower:
        openings = [
            f"Copy {desc_lower.rstrip('.')} with one click.",
            f"Duplicate {desc_lower.rstrip('.')} easily.",
            f"Clone {desc_lower.rstrip('.')} instantly.",
        ]
    elif 'paste' in name_lower:
        openings = [
            f"Paste {desc_lower.rstrip('.')} from clipboard.",
            f"Import {desc_lower.rstrip('.')} from your clipboard.",
            f"Load {desc_lower.rstrip('.')} from copied text.",
        ]
    elif 'undo' in name_lower:
        openings = [
            f"Undo changes to {desc_lower.rstrip('.')} instantly.",
            f"Revert {desc_lower.rstrip('.')} to previous state.",
            f"Reverse {desc_lower.rstrip('.')} modifications.",
        ]
    elif 'redo' in name_lower:
        openings = [
            f"Redo changes to {desc_lower.rstrip('.')} easily.",
            f"Reapply {desc_lower.rstrip('.')} modifications.",
            f"Restore {desc_lower.rstrip('.')} changes.",
        ]
    elif 'zoom' in name_lower:
        openings = [
            f"Zoom in and out of {desc_lower.rstrip('.')} smoothly.",
            f"Scale {desc_lower.rstrip('.')} to any size.",
            f"Adjust the view of {desc_lower.rstrip('.')}.",
        ]
    elif 'rotate' in name_lower:
        openings = [
            f"Rotate {desc_lower.rstrip('.')} to any angle.",
            f"Turn {desc_lower.rstrip('.')} as needed.",
            f"Spin {desc_lower.rstrip('.')} with precision.",
        ]
    elif 'flip' in name_lower:
        openings = [
            f"Flip {desc_lower.rstrip('.')} horizontally or vertically.",
            f"Mirror {desc_lower.rstrip('.')} easily.",
            f"Reverse {desc_lower.rstrip('.')} direction.",
        ]
    elif 'crop' in name_lower:
        openings = [
            f"Crop {desc_lower.rstrip('.')} to desired size.",
            f"Trim {desc_lower.rstrip('.')} to exact dimensions.",
            f"Cut {desc_lower.rstrip('.')} with precision.",
        ]
    elif 'resize' in name_lower:
        openings = [
            f"Resize {desc_lower.rstrip('.')} to any dimensions.",
            f"Scale {desc_lower.rstrip('.')} proportionally.",
            f"Adjust the size of {desc_lower.rstrip('.')}.",
        ]
    elif 'scale' in name_lower:
        openings = [
            f"Scale {desc_lower.rstrip('.')} proportionally.",
            f"Resize {desc_lower.rstrip('.')} while maintaining aspect ratio.",
            f"Adjust the size of {desc_lower.rstrip('.')}.",
        ]
    elif 'align' in name_lower:
        openings = [
            f"Align {desc_lower.rstrip('.')} to grid or edges.",
            f"Position {desc_lower.rstrip('.')} with precision.",
            f"Arrange {desc_lower.rstrip('.')} perfectly.",
        ]
    elif 'distribute' in name_lower:
        openings = [
            f"Distribute {desc_lower.rstrip('.')} evenly.",
            f"Space {desc_lower.rstrip('.')} with equal gaps.",
            f"Arrange {desc_lower.rstrip('.')} with consistent spacing.",
        ]
    elif 'group' in name_lower:
        openings = [
            f"Group {desc_lower.rstrip('.')} together.",
            f"Combine {desc_lower.rstrip('.')} into logical sets.",
            f"Organize {desc_lower.rstrip('.')} into groups.",
        ]
    elif 'ungroup' in name_lower:
        openings = [
            f"Ungroup {desc_lower.rstrip('.')} into individual elements.",
            f"Separate {desc_lower.rstrip('.')} into components.",
            f"Break apart {desc_lower.rstrip('.')}.",
        ]
    elif 'lock' in name_lower:
        openings = [
            f"Lock {desc_lower.rstrip('.')} to prevent changes.",
            f"Protect {desc_lower.rstrip('.')} from accidental edits.",
            f"Secure {desc_lower.rstrip('.')} with a lock.",
        ]
    elif 'unlock' in name_lower:
        openings = [
            f"Unlock {desc_lower.rstrip('.')} for editing.",
            f"Release {desc_lower.rstrip('.')} from lock.",
            f"Allow modifications to {desc_lower.rstrip('.')}.",
        ]
    elif 'hide' in name_lower:
        openings = [
            f"Hide {desc_lower.rstrip('.')} from view.",
            f"Conceal {desc_lower.rstrip('.')} with one click.",
            f"Make {desc_lower.rstrip('.')} invisible.",
        ]
    elif 'show' in name_lower:
        openings = [
            f"Show {desc_lower.rstrip('.')} in the interface.",
            f"Reveal {desc_lower.rstrip('.')} instantly.",
            f"Make {desc_lower.rstrip('.')} visible.",
        ]
    elif 'enable' in name_lower:
        openings = [
            f"Enable {desc_lower.rstrip('.')} functionality.",
            f"Activate {desc_lower.rstrip('.')} with one click.",
            f"Turn on {desc_lower.rstrip('.')}.",
        ]
    elif 'disable' in name_lower:
        openings = [
            f"Disable {desc_lower.rstrip('.')} functionality.",
            f"Deactivate {desc_lower.rstrip('.')} with one click.",
            f"Turn off {desc_lower.rstrip('.')}.",
        ]
    elif 'start' in name_lower:
        openings = [
            f"Start {desc_lower.rstrip('.')} process.",
            f"Begin {desc_lower.rstrip('.')} instantly.",
            f"Initiate {desc_lower.rstrip('.')}.",
        ]
    elif 'stop' in name_lower:
        openings = [
            f"Stop {desc_lower.rstrip('.')} process.",
            f"Halt {desc_lower.rstrip('.')} immediately.",
            f"End {desc_lower.rstrip('.')}.",
        ]
    elif 'pause' in name_lower:
        openings = [
            f"Pause {desc_lower.rstrip('.')} temporarily.",
            f"Suspend {desc_lower.rstrip('.')} for later.",
            f"Hold {desc_lower.rstrip('.')}.",
        ]
    elif 'resume' in name_lower:
        openings = [
            f"Resume {desc_lower.rstrip('.')} from where it left off.",
            f"Continue {desc_lower.rstrip('.')} process.",
            f"Restart {desc_lower.rstrip('.')}.",
        ]
    elif 'reset' in name_lower:
        openings = [
            f"Reset {desc_lower.rstrip('.')} to default state.",
            f"Restore {desc_lower.rstrip('.')} to original settings.",
            f"Return {desc_lower.rstrip('.')}.",
        ]
    elif 'clear' in name_lower:
        openings = [
            f"Clear {desc_lower.rstrip('.')} completely.",
            f"Empty {desc_lower.rstrip('.')} of all content.",
            f"Remove all {desc_lower.rstrip('.')}.",
        ]
    elif 'fill' in name_lower:
        openings = [
            f"Fill {desc_lower.rstrip('.')} with data.",
            f"Populate {desc_lower.rstrip('.')} automatically.",
            f"Add content to {desc_lower.rstrip('.')}.",
        ]
    elif 'empty' in name_lower:
        openings = [
            f"Empty {desc_lower.rstrip('.')} of all content.",
            f"Clear {desc_lower.rstrip('.')} completely.",
            f"Remove everything from {desc_lower.rstrip('.')}.",
        ]
    elif 'select' in name_lower:
        openings = [
            f"Select {desc_lower.rstrip('.')} from options.",
            f"Choose {desc_lower.rstrip('.')} with ease.",
            f"Pick {desc_lower.rstrip('.')}.",
        ]
    elif 'deselect' in name_lower:
        openings = [
            f"Deselect {desc_lower.rstrip('.')} to remove selection.",
            f"Uncheck {desc_lower.rstrip('.')} easily.",
            f"Clear the selection of {desc_lower.rstrip('.')}.",
        ]
    elif 'toggle' in name_lower:
        openings = [
            f"Toggle {desc_lower.rstrip('.')} on and off.",
            f"Switch between states of {desc_lower.rstrip('.')}.",
            f"Change {desc_lower.rstrip('.')} state.",
        ]
    elif 'switch' in name_lower:
        openings = [
            f"Switch {desc_lower.rstrip('.')} to another mode.",
            f"Change {desc_lower.rstrip('.')} settings.",
            f"Alternate between {desc_lower.rstrip('.')}.",
        ]
    elif 'change' in name_lower:
        openings = [
            f"Change {desc_lower.rstrip('.')} as needed.",
            f"Modify {desc_lower.rstrip('.')} settings.",
            f"Update {desc_lower.rstrip('.')}.",
        ]
    elif 'update' in name_lower:
        openings = [
            f"Update {desc_lower.rstrip('.')} to latest version.",
            f"Refresh {desc_lower.rstrip('.')} with new data.",
            f"Keep {desc_lower.rstrip('.')} current.",
        ]
    elif 'refresh' in name_lower:
        openings = [
            f"Refresh {desc_lower.rstrip('.')} with new data.",
            f"Reload {desc_lower.rstrip('.')} instantly.",
            f"Get fresh {desc_lower.rstrip('.')}.",
        ]
    elif 'reload' in name_lower:
        openings = [
            f"Reload {desc_lower.rstrip('.')} from source.",
            f"Fetch {desc_lower.rstrip('.')} again.",
            f"Get the latest {desc_lower.rstrip('.')}.",
        ]
    elif 'fetch' in name_lower:
        openings = [
            f"Fetch {desc_lower.rstrip('.')} from external source.",
            f"Retrieve {desc_lower.rstrip('.')} remotely.",
            f"Get {desc_lower.rstrip('.')} from any URL.",
        ]
    elif 'pull' in name_lower:
        openings = [
            f"Pull {desc_lower.rstrip('.')} from remote.",
            f"Download {desc_lower.rstrip('.')} from server.",
            f"Get {desc_lower.rstrip('.')} from the cloud.",
        ]
    elif 'push' in name_lower:
        openings = [
            f"Push {desc_lower.rstrip('.')} to remote.",
            f"Upload {desc_lower.rstrip('.')} to server.",
            f"Send {desc_lower.rstrip('.')} to the cloud.",
        ]
    elif 'sync' in name_lower:
        openings = [
            f"Sync {desc_lower.rstrip('.')} across devices.",
            f"Keep {desc_lower.rstrip('.')} updated everywhere.",
            f"Synchronize {desc_lower.rstrip('.')}.",
        ]
    elif 'backup' in name_lower:
        openings = [
            f"Backup {desc_lower.rstrip('.')} for safekeeping.",
            f"Save a copy of {desc_lower.rstrip('.')}.",
            f"Create a backup of {desc_lower.rstrip('.')}.",
        ]
    elif 'restore' in name_lower:
        openings = [
            f"Restore {desc_lower.rstrip('.')} from backup.",
            f"Recover {desc_lower.rstrip('.')} previously saved.",
            f"Get back {desc_lower.rstrip('.')}.",
        ]
    elif 'recover' in name_lower:
        openings = [
            f"Recover {desc_lower.rstrip('.')} that was lost.",
            f"Retrieve {desc_lower.rstrip('.')} accidentally deleted.",
            f"Get back {desc_lower.rstrip('.')}.",
        ]
    elif 'retrieve' in name_lower:
        openings = [
            f"Retrieve {desc_lower.rstrip('.')} from storage.",
            f"Fetch {desc_lower.rstrip('.')} from archive.",
            f"Get {desc_lower.rstrip('.')}.",
        ]
    elif 'store' in name_lower:
        openings = [
            f"Store {desc_lower.rstrip('.')} for later use.",
            f"Keep {desc_lower.rstrip('.')} in memory.",
            f"Save {desc_lower.rstrip('.')}.",
        ]
    elif 'cache' in name_lower:
        openings = [
            f"Cache {desc_lower.rstrip('.')} for faster access.",
            f"Store {desc_lower.rstrip('.')} temporarily.",
            f"Speed up {desc_lower.rstrip('.')} with caching.",
        ]
    elif 'queue' in name_lower:
        openings = [
            f"Queue {desc_lower.rstrip('.')} for processing.",
            f"Line up {desc_lower.rstrip('.')} in order.",
            f"Process {desc_lower.rstrip('.')} sequentially.",
        ]
    elif 'stack' in name_lower:
        openings = [
            f"Stack {desc_lower.rstrip('.')} vertically.",
            f"Layer {desc_lower.rstrip('.')} on top of each other.",
            f"Arrange {desc_lower.rstrip('.')} in a stack.",
        ]
    else:
        # Fallback - use the original description but make it longer
        openings = [
            f"{desc.rstrip('.')}. Try it now - completely free with no limitations.",
            f"{desc.rstrip('.')}. Works instantly in your browser with no signup required.",
            f"{desc.rstrip('.')}. Get started in seconds with a simple interface.",
        ]
    
    return random.choice(openings)

# Fix thin content
fixed = 0
for slug in thin_slugs:
    if slug not in tools:
        continue
    
    tool_info = tools[slug]
    new_desc = gen_unique_desc(slug, tool_info)
    
    # Replace the old description
    old_pattern = f'"{slug}":\\s*{{[^}}]*?description:\\s*`[^`]+`'
    new_desc_escaped = new_desc.replace('`', '\\`').replace('${', '\\${')
    
    content = re.sub(
        old_pattern,
        lambda m: m.group(0).replace(
            re.search(r'description:\s*`([^`]+)`', m.group(0)).group(1),
            new_desc_escaped
        ),
        content
    )
    fixed += 1

# Write updated content
with open('data/tool-content.ts', 'w') as f:
    f.write(content)

print(f"Fixed {fixed} tools with thin content")
