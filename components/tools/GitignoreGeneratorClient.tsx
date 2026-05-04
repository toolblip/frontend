'use client';

import { useState } from 'react';

const TEMPLATES: Record<string, string[]> = {
  'Node.js': ['node_modules/', 'npm-debug.log*', '.env', '.env.local', 'dist/', 'build/', 'coverage/', '*.log'],
  'Python': ['__pycache__/', '*.py[cod]', '$py.class', 'venv/', '.env', '*.egg-info/', 'dist/', 'build/'],
  'React': ['node_modules/', 'dist/', 'build/', '.env', '*.log', 'coverage/', '.env.local'],
  'Next.js': ['node_modules/', '.next/', 'out/', 'dist/', '.env', '*.log', 'coverage/'],
  'VS Code': ['.vscode/', '*.code-workspace', '!.code-workspace'],
  'macOS': ['.DS_Store', '._*', '.Spotlight-V100/', 'Trashes'],
  'Windows': ['Thumbs.db', 'ehthumbs.db', 'Desktop.ini', '$RECYCLE.BIN/'],
  'Git': ['.git/', '.gitignore', '.gitattributes'],
  'Archives': ['*.zip', '*.rar', '*.tar', '*.gz', '*.7z'],
};

export default function GitignoreGeneratorClient() {
  const [selected, setSelected] = useState<string[]>(['Node.js']);

  const toggle = (name: string) => {
    setSelected(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);
  };

  const output = [...new Set(selected.flatMap(s => TEMPLATES[s] || []))].sort();

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Select Templates</span></div>
      <div className="tb-v2-tool-output-body" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {Object.keys(TEMPLATES).map(name => (
          <button
            key={name}
            onClick={() => toggle(name)}
            className={`tb-v2-mode-tab ${selected.includes(name) ? 'on' : ''}`}
            style={{ fontSize: 12, padding: '4px 10px' }}
          >
            {name}
          </button>
        ))}
      </div>
      <div className="tb-v2-tool-output-head"><span className="tb-v2-tool-label">.gitignore</span></div>
      <div className="tb-v2-tool-output-body">
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'var(--f-mono)', fontSize: 13 }}>{output.join('\n')}</pre>
      </div>
    </div>
  );
}
