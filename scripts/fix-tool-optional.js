const fs = require('fs');
const path = require('path');

const toolsDir = 'components/tools';
const files = fs.readdirSync(toolsDir).filter(f => f.endsWith('Client.tsx'));

let fixed = 0;
let skipped = 0;

files.forEach(fname => {
  const fpath = path.join(toolsDir, fname);
  let content = fs.readFileSync(fpath, 'utf8');

  // Pattern 1: interface Props { tool: { ... } } -> tool?:
  // This handles multiline interface definitions
  if (content.includes('tool: {') || content.includes('tool:{\n')) {
    // Replace 'tool: {' with 'tool?: {' in interface definitions
    const newContent = content.replace(/tool:(\s*)\{/g, 'tool?:$1{');
    if (newContent !== content) {
      fs.writeFileSync(fpath, newContent);
      fixed++;
      // console.log('Fixed:', fname);
    }
  } else {
    skipped++;
  }
});

console.log(`Fixed: ${fixed} files`);
console.log(`Skipped (no tool prop): ${skipped} files`);
