'use client';

import { useState } from 'react';

export default function NpmDependencyCheckerClient() {
  const [input, setInput] = useState('');
  const [deps, setDeps] = useState<{ name: string; version: string; valid: boolean }[]>([]);

  const check = () => {
    const lines = input.split('\n').filter(l => l.trim());
    const results = lines.map(line => {
      const match = line.match(/^["']?(@?[^@"':\s]+)[@:]\s*["']?(\^?|~?|>=?[\d.]+)?/);
      if (match) return { name: match[1], version: match[2] || 'latest', valid: true };
      return { name: line.trim(), version: 'unknown', valid: false };
    });
    setDeps(results);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">package.json Dependencies</span></div>
      <textarea value={input} onChange={e => setInput(e.target.value)} placeholder={'"express": "^4.18.0"\n"react": ">=18.0.0"'} className="tb-v2-tool-textarea" style={{ fontFamily: 'var(--f-mono)' }} />
      <button onClick={check} className="tb-v2-btn-primary" style={{ marginTop: 12 }}>Check Dependencies</button>
      <div className="tb-v2-tool-output-head"><span className="tb-v2-tool-label">Results</span></div>
      <div className="tb-v2-tool-output-body" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {deps.map((d, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', borderBottom: '1px solid var(--tb-border)' }}>
            <span style={{ fontFamily: 'var(--f-mono)', fontSize: 13 }}>{d.name}</span>
            <span style={{ color: d.valid ? '#22c55e' : '#ef4444', fontSize: 12 }}>{d.version}</span>
          </div>
        ))}
        {!deps.length && <span style={{ color: 'var(--tb-text-muted)' }}>Enter dependencies above</span>}
      </div>
    </div>
  );
}
