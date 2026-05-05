'use client';

import { useState } from 'react';

export default function ListRandomizerClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<string[]>([]);
  const [unique, setUnique] = useState(false);

  const shuffle = <T,>(arr: T[]): T[] => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const randomize = () => {
    const lines = input.split('\n').filter(l => l.trim());
    if (!lines.length) return;
    const items = unique ? [...new Set(lines)] : lines;
    setOutput(shuffle(items));
  };

  const copy = () => {
    if (!output.length) return;
    navigator.clipboard.writeText(output.join('\n')).catch(() => {});
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Input List</span></div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Enter one item per line..."
        className="tb-v2-tool-textarea"
        style={{ minHeight: 120 }}
      />
      <div className="tb-v2-tool-output-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <input type="checkbox" checked={unique} onChange={e => setUnique(e.target.checked)} />
          <span style={{ fontSize: 13 }}>Remove duplicates before shuffling</span>
        </label>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={randomize} className="tb-v2-btn-primary">Shuffle</button>
          <button onClick={() => { setInput(''); setOutput([]); }} className="tb-v2-btn-primary" style={{ background: 'var(--tb-bg-secondary)', color: 'var(--tb-text)' }}>Clear</button>
        </div>
      </div>
      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Randomized</span>
        {output.length > 0 && <button type="button" onClick={copy} className="tb-v2-copy-btn">Copy</button>}
      </div>
      <div className="tb-v2-tool-output-body">
        {output.length > 0 ? (
          <ol style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {output.map((item, i) => (
              <li key={i} style={{ fontSize: 14, color: 'var(--tb-text)' }}>{item}</li>
            ))}
          </ol>
        ) : (
          <div style={{ color: 'var(--tb-text-secondary)', fontSize: 14 }}>Enter items and click Shuffle</div>
        )}
      </div>
    </div>
  );
}
