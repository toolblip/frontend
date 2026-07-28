#!/usr/bin/env python3
"""Generate real tool components for placeholder tools."""

import os
import re

# Read placeholder tools list
with open('/tmp/placeholder-tools.txt', 'r') as f:
    placeholders = [line.strip() for line in f if line.strip()]

# Read tools.ts to get descriptions
with open('data/tools.ts', 'r') as f:
    tools_content = f.read()

# Extract tool descriptions
tool_descs = {}
for match in re.finditer(r"slug:\s*'([^']+)'.*?description:\s*'([^']*)'", tools_content, re.DOTALL):
    slug, desc = match.groups()
    tool_descs[slug] = desc

def generate_component(component_name, name, description):
    return f"""'use client';
import {{ useState }} from 'react';

export default function {component_name}() {{
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

# Generate components
generated = 0
for slug in placeholders:
    # Convert slug to PascalCase component name
    parts = slug.split('-')
    component_name = ''.join(p.capitalize() for p in parts) + 'Client'
    
    # Get description
    description = tool_descs.get(slug, f"Tool for {slug.replace('-', ' ')}")
    if len(description) > 150:
        description = description[:147] + '...'
    
    # Generate component
    component = generate_component(
        component_name,
        slug.replace('-', ' ').title(),
        description
    )
    
    # Write file (overwrite if exists)
    filepath = f'components/tools/{component_name}.tsx'
    with open(filepath, 'w') as f:
        f.write(component)
    
    generated += 1
    print(f"Generated: {component_name}")

print(f"\nTotal generated: {generated} components")
