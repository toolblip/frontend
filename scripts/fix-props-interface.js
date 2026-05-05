const fs = require('fs');
const path = require('path');

const toolsDir = 'components/tools';
const files = fs.readdirSync(toolsDir).filter(f => f.endsWith('Client.tsx'));

let fixed = 0;

files.forEach(file => {
  const fp = path.join(toolsDir, file);
  let c = fs.readFileSync(fp, 'utf8');
  
  if (!c.includes('{ tool = {} }')) return;
  
  // Check if Props has optional tool but inner fields are required
  const hasRequiredInner = c.match(/tool\?: \{\s*\n?\s*name: string;?\s*\n?\s*slug: string;?\s*\n?\s*description: string;/);
  if (!hasRequiredInner) return;
  
  // Replace inner required fields with optional ones
  c = c.replace(
    /tool\?: \{\s*\n?\s*name: string;?\s*\n?\s*slug: string;?\s*\n?\s*description: string;?\s*\n?\}/,
    'tool?: { name?: string; slug?: string; description?: string }'
  );
  
  fixed++;
  fs.writeFileSync(fp, c);
});

console.log('Fixed Props interfaces with required inner fields:', fixed);
