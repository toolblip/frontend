'use client';

import { useState } from 'react';

export default function HtmlOptimizerClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const optimize = () => {
    try {
      let html = input;
      // Remove comments
      html = html.replace(/<!--[\s\S]*?-->/g, '');
      // Collapse whitespace
      html = html.replace(/>\s+</g, '><');
      html = html.replace(/\s{2,}/g, ' ');
      // Remove empty attributes
      html = html.replace(/\s+\w+=""/g, '');
      // Shorten boolean attributes
      html = html.replace(/\s+(disabled|checked|readonly|selected)="true"/gi, ' $1');
      setOutput(html.trim());
    } catch {
      setOutput('Error optimizing HTML');
    }
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">HTML Input</span></div>
      <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="<div>...</div>" className="tb-v2-tool-textarea" style={{ fontFamily: 'var(--f-mono)' }} />
      <button onClick={optimize} className="tb-v2-btn-primary" style={{ marginTop: 12 }}>Optimize HTML</button>
      <div className="tb-v2-tool-output-head"><span className="tb-v2-tool-label">Optimized HTML</span></div>
      <div className="tb-v2-tool-output-body">
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'var(--f-mono)', fontSize: 13 }}>{output || '—'}</pre>
      </div>
    </div>
  );
}
