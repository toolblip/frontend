'use client';

import { useState } from 'react';

type Decoding = 'base64' | 'url' | 'hex' | 'html';

export default function DecodeToolClient() {
  const [input, setInput] = useState('');
  const [dec, setDec] = useState<Decoding>('base64');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const decode = () => {
    setError('');
    try {
      switch (dec) {
        case 'base64': setOutput(decodeURIComponent(escape(atob(input)))); break;
        case 'url': setOutput(decodeURIComponent(input)); break;
        case 'hex': {
          const hex = input.replace(/\s/g, '');
          let str = '';
          for (let i = 0; i < hex.length; i += 2) str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
          setOutput(str);
          break;
        }
        case 'html': setOutput(input.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')); break;
      }
    } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Decoding error'); }
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Input</span></div>
      <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Text to decode..." className="tb-v2-tool-textarea" style={{ fontFamily: 'var(--f-mono)' }} />
      <div className="tb-v2-tool-output-body" style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
        {(['base64', 'url', 'hex', 'html'] as Decoding[]).map(d => (
          <button key={d} onClick={() => setDec(d)} className={`tb-v2-mode-tab ${dec === d ? 'on' : ''}`} style={{ fontSize: 12, padding: '4px 10px' }}>{d.toUpperCase()}</button>
        ))}
      </div>
      <button onClick={decode} className="tb-v2-btn tb-v2-btn-primary" style={{ marginTop: 10 }}>Decode</button>
      {error && <span style={{ color: '#ef4444', fontSize: 13, marginTop: 8, display: 'block' }}>{error}</span>}
      <div className="tb-v2-tool-output-head"><span className="tb-v2-tool-label">Decoded Output</span></div>
      <div className="tb-v2-tool-output-body">
        <textarea value={output} readOnly className="tb-v2-tool-textarea" style={{ fontFamily: 'var(--f-mono)' }} placeholder="Decoded output..." />
      </div>
    </div>
  );
}
