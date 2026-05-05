'use client';

import { useState } from 'react';

export default function LineNumberRemoverClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const remove = () => {
    const lines = input.split('\n');
    const cleaned = lines.map(line => line.replace(/^\s*\d+[\s.)-]*/, '').replace(/^\s+/, '')).join('\n');
    setOutput(cleaned);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Text with Line Numbers</span></div>
      <textarea value={input} onChange={e => setInput(e.target.value)} placeholder={'1. First line\n2. Second line\n3. Third line'} className="tb-v2-tool-textarea" style={{ fontFamily: 'var(--f-mono)' }} />
      <button onClick={remove} className="tb-v2-btn-primary" style={{ marginTop: 12 }}>Remove Line Numbers</button>
      <div className="tb-v2-tool-output-head"><span className="tb-v2-tool-label">Cleaned Text</span></div>
      <div className="tb-v2-tool-output-body">
        <textarea value={output} readOnly className="tb-v2-tool-textarea" style={{ fontFamily: 'var(--f-mono)' }} placeholder="Output..." />
      </div>
    </div>
  );
}
