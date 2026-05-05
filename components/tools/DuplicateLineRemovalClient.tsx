'use client';

import { useState } from 'react';

export default function DuplicateLineRemovalClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [keepOrder, setKeepOrder] = useState(true);

  const remove = () => {
    const lines = input.split('\n').filter(l => l.trim());
    if (keepOrder) {
      const seen = new Set<string>();
      const unique = lines.filter(l => { if (seen.has(l)) return false; seen.add(l); return true; });
      setOutput(unique.join('\n'));
    } else {
      setOutput([...new Set(lines)].join('\n'));
    }
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Text with Duplicates</span></div>
      <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Enter lines...\nline one\nduplicate\nline one\nanother line" className="tb-v2-tool-textarea" style={{ fontFamily: 'var(--f-mono)' }} />
      <div className="tb-v2-tool-output-body" style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        <button onClick={() => setKeepOrder(true)} className={`tb-v2-mode-tab ${keepOrder ? 'on' : ''}`}>Keep Order</button>
        <button onClick={() => setKeepOrder(false)} className={`tb-v2-mode-tab ${!keepOrder ? 'on' : ''}`}>Sort</button>
      </div>
      <button onClick={remove} className="tb-v2-btn-primary" style={{ marginTop: 10 }}>Remove Duplicates</button>
      <div className="tb-v2-tool-output-head"><span className="tb-v2-tool-label">Unique Lines</span></div>
      <div className="tb-v2-tool-output-body">
        <textarea value={output} readOnly className="tb-v2-tool-textarea" style={{ fontFamily: 'var(--f-mono)' }} placeholder="Output..." />
      </div>
    </div>
  );
}
