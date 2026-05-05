const fs = require('fs');
const path = require('path');

const toolsDir = 'components/tools';
const files = fs.readdirSync(toolsDir).filter(f => f.endsWith('Client.tsx'));

let fixed = 0;
let skipped = 0;

files.forEach(file => {
  const fp = path.join(toolsDir, file);
  let c = fs.readFileSync(fp, 'utf8');
  
  if (!c.includes('interface Props')) { skipped++; return; }
  
  // Parse Props interface
  const start = c.indexOf('interface Props');
  const braceStart = c.indexOf('{', start);
  let depth = 0, end = braceStart;
  for (let i = braceStart; i < c.length; i++) {
    if (c[i] === '{') depth++;
    else if (c[i] === '}') { depth--; if (depth === 0) { end = i; break; } }
  }
  const propsBlock = c.slice(start, end + 1);
  
  // Find required fields
  const required = [...propsBlock.matchAll(/(?:^|\n)  (name|slug|description)(?!\?):/g)].map(m => m[1]);
  const hasName = required.includes('name');
  const hasSlug = required.includes('slug');
  const hasDesc = required.includes('description');
  
  // Check if default is already correct
  const defaultMatch = c.match(/tool = (\{[^}]+\}) \}?: Props/);
  if (!defaultMatch) { skipped++; return; }
  
  const currentDefault = defaultMatch[1];
  let neededDefault;
  const parts = [];
  if (hasName) parts.push('name: ""');
  if (hasSlug) parts.push('slug: ""');
  if (hasDesc) parts.push('description: ""');
  neededDefault = '{ ' + parts.join(', ') + ' }';
  
  if (currentDefault === neededDefault) { skipped++; return; }
  
  c = c.replace(defaultMatch[0], 'tool = ' + neededDefault + ' }: Props');
  fs.writeFileSync(fp, c);
  fixed++;
});

console.log('Fixed:', fixed);
console.log('Skipped (already correct or no Props):', skipped);
