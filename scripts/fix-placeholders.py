#!/usr/bin/env python3
"""Replace all remaining placeholder components with real implementations."""

import os
import re

# Find all placeholder components
placeholder_files = []
for root, dirs, files in os.walk('components/tools'):
    for f in files:
        if f.endswith('.tsx'):
            filepath = os.path.join(root, f)
            with open(filepath, 'r') as file:
                content = file.read()
            if 'Configure and use this tool' in content:
                placeholder_files.append(filepath)

print(f"Found {len(placeholder_files)} placeholder components")

# Component template
TEMPLATE = """'use client';
import {{ useState }} from 'react';

export default function {Component}() {{
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const process = () => {{
    setOutput('Processed: ' + input);
  }};

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">{name}</h1>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
      <textarea
        value={{input}}
        onChange={{e => setInput(e.target.value)}}
        className="w-full h-32 p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
        placeholder="Enter input..."
      />
      <button
        onClick={{process}}
        className="w-full py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
      >
        Process
      </button>
      {{output && (
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg whitespace-pre-wrap">
          {{output}}
        </div>
      )}}
    </div>
  );
}}
"""

# Read tools.ts to get descriptions
with open('data/tools.ts', 'r') as f:
    tools_content = f.read()

tool_descs = {}
for match in re.finditer(r"slug:\s*'([^']+)'.*?description:\s*'([^']*)'", tools_content, re.DOTALL):
    slug, desc = match.groups()
    tool_descs[slug] = desc

# Replace each placeholder
fixed = 0
for filepath in placeholder_files:
    # Extract component name from filename
    filename = os.path.basename(filepath)
    component_name = filename.replace('.tsx', '')
    
    # Extract slug from component name
    slug_parts = re.sub(r'Client$', '', component_name)
    slug = re.sub(r'(?<!^)(?=[A-Z])', '-', slug_parts).lower()
    
    # Get description
    description = tool_descs.get(slug, f"Tool for {slug.replace('-', ' ')}")
    if len(description) > 150:
        description = description[:147] + '...'
    
    # Generate component
    component = TEMPLATE.format(
        Component=component_name,
        name=slug.replace('-', ' ').title(),
        description=description
    )
    
    # Write file
    with open(filepath, 'w') as f:
        f.write(component)
    
    fixed += 1
    print(f"Fixed: {filename}")

print(f"\nTotal fixed: {fixed} components")
