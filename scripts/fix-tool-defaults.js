const fs = require('fs');
const path = require('path');

const toolsDir = 'components/tools';
const files = fs.readdirSync(toolsDir).filter(f => f.endsWith('Client.tsx'));

let fixed = 0;
let skipped = 0;

files.forEach(file => {
  const fp = path.join(toolsDir, file);
  let c = fs.readFileSync(fp, 'utf8');
  
  if (!c.includes('{ tool = {} }') && !c.includes('{ tool = { name: ""')) return;
  
  // Extract Props interface
  const propsMatch = c.match(/interface Props \{[^}]+\}/s);
  if (!propsMatch) return;
  
  const propsBlock = propsMatch[0];
  // Find which fields are in Props
  const fieldMatches = [...propsBlock.matchAll(/(name|slug|description)\??: string;/g)];
  const fields = fieldMatches.map(m => m[1]);
  
  if (fields.length === 0) return;
  
  // Build default object with empty strings
  const defaultObj = '{ ' + fields.map(f => f + ': ""').join(', ') + ' }';
  
  // Replace existing default values
  const newC = c.replace(/\{ tool = [^}]+ \}: ?Props/g, '{ tool = ' + defaultObj + ' }: Props');
  
  if (newC !== c) {
    fs.writeFileSync(fp, newC);
    fixed++;
  } else {
    skipped++;
  }
});

console.log('Fixed:', fixed);
console.log('Skipped:', skipped);
