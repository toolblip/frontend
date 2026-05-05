'use client';

import { useState } from 'react';

export default function RandomStringGeneratorToolClient() {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({ upper: true, lower: true, number: true, symbol: true });
  const [output, setOutput] = useState('');

  const generate = () => {
    let chars = '';
    if (options.upper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (options.lower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (options.number) chars += '0123456789';
    if (options.symbol) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    if (!chars) { setOutput('Select at least one option'); return; }
    let result = '';
    for (let i = 0; i < length; i++) result += chars[Math.floor(Math.random() * chars.length)];
    setOutput(result);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Options</span></div>
      <div className="tb-v2-tool-output-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13 }}>Length</span>
          <input type="number" value={length} onChange={e => setLength(Math.max(1, parseInt(e.target.value) || 1))} className="tb-v2-tool-textarea" style={{ width: 80, minHeight: 32, resize: 'none', textAlign: 'center' }} min={1} max={256} />
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {Object.entries({ upper: 'A-Z', lower: 'a-z', number: '0-9', symbol: '!@#...' }).map(([k, v]) => (
            <label key={k} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <input type="checkbox" checked={options[k as keyof typeof options]} onChange={e => setOptions({ ...options, [k]: e.target.checked })} />
              <span style={{ fontSize: 13 }}>{v}</span>
            </label>
          ))}
        </div>
      </div>
      <button onClick={generate} className="tb-v2-btn-primary" style={{ marginTop: 12 }}>Generate</button>
      <div className="tb-v2-tool-output-head"><span className="tb-v2-tool-label">Random String</span></div>
      <div className="tb-v2-tool-output-body">
        <div style={{ fontFamily: 'var(--f-mono)', fontSize: 16, wordBreak: 'break-all', background: 'var(--tb-bg-secondary)', padding: 12, borderRadius: 8 }}>{output || '—'}</div>
      </div>
    </div>
  );
}
