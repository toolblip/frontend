'use client';

import { useState } from 'react';

export default function TextReverserClient() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState<'chars' | 'words' | 'lines'>('chars');

  const reversed = (() => {
    if (!text) return '';
    if (mode === 'chars') return text.split('').reverse().join('');
    if (mode === 'words') return text.split(/\s+/).filter(Boolean).reverse().join(' ');
    return text.split('\n').filter(Boolean).reverse().join('\n');
  })();

  const copy = () => {
    if (!reversed) return;
    navigator.clipboard.writeText(reversed).catch(() => {});
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Input</span>
        <div className="tb-v2-mode-tabs" role="group">
          {(['chars', 'words', 'lines'] as const).map(m => (
            <button key={m} type="button" onClick={() => setMode(m)} className={`tb-v2-mode-tab ${mode === m ? 'on' : ''}`}>{m}</button>
          ))}
        </div>
      </div>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type or paste text to reverse..."
        className="tb-v2-tool-textarea"
        style={{ minHeight: 100 }}
      />
      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Reversed</span>
        {reversed && <button type="button" onClick={copy} className="tb-v2-copy-btn">Copy</button>}
      </div>
      <div className="tb-v2-tool-output-body">
        <div style={{ fontFamily: 'var(--f-mono)', fontSize: 14, whiteSpace: 'pre-wrap', color: 'var(--tb-text-secondary)' }}>
          {reversed || '—'}
        </div>
      </div>
    </div>
  );
}
