const fs = require('fs');
const path = require('path');

const toolsDir = 'components/tools';
const files = fs.readdirSync(toolsDir).filter(f => f.endsWith('Client.tsx'));

let fixed = 0;
files.forEach(file => {
  const fp = path.join(toolsDir, file);
  let c = fs.readFileSync(fp, 'utf8');
  
  // Check if Props has tool? (optional) but function has { tool } without default
  const hasOptionalTool = c.includes('tool?: {') || c.includes('tool?: Tool');
  if (!hasOptionalTool) return;
  
  // Fix: Change { tool } to { tool = {} } in function destructuring
  // Pattern: function X({ tool }: Props) or ({ tool }: { tool?: Tool })
  if (c.match(/\{ ?tool ?\}: ?Props/)) {
    c = c.replace(/\{ ?tool ?\}: ?Props/g, '{ tool = {} }: Props');
    fixed++;
  } else if (c.match(/\{ ?tool ?\}: ?\{ ?tool\?/)) {
    c = c.replace(/\{ ?tool ?\}: ?\{ ?tool\?/, '{ tool = {} }: { tool?');
    fixed++;
  }
  
  fs.writeFileSync(fp, c);
});

console.log('Fixed destructuring:', fixed);
