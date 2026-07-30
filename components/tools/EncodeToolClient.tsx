'use client';

import { useState } from 'react';

type Encoding = 'base64' | 'url' | 'hex' | 'html';

const EXAMPLE = 'Hello, World! <3';

export default function EncodeToolClient() {
  const [input, setInput] = useState('');
  const [enc, setEnc] = useState<Encoding>('base64');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const encode = () => {
    try {
      switch (enc) {
        case 'base64': setOutput(btoa(unescape(encodeURIComponent(input)))); break;
        case 'url': setOutput(encodeURIComponent(input)); break;
        case 'hex': setOutput([...input].map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('')); break;
        case 'html': setOutput(input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')); break;
      }
    } catch { setOutput('Encoding error'); }
  };

  const loadExample = () => {
    setInput(EXAMPLE);
    setOutput('');
  };

  const copy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Input</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">Load Example</button>
      </div>
      <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Text to encode..." className="tb-v2-tool-textarea" style={{ fontFamily: 'var(--f-mono)' }} />
      <div className="tb-v2-tool-output-body" style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
        {(['base64', 'url', 'hex', 'html'] as Encoding[]).map(e => (
          <button key={e} onClick={() => setEnc(e)} className={`tb-v2-mode-tab ${enc === e ? 'on' : ''}`} style={{ fontSize: 12, padding: '4px 10px' }}>{e.toUpperCase()}</button>
        ))}
      </div>
      <button onClick={encode} className="tb-v2-btn tb-v2-btn-primary" style={{ marginTop: 10 }}>Encode</button>
      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Encoded Output</span>
        <button type="button" onClick={copy} disabled={!output} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        <textarea value={output} readOnly className="tb-v2-tool-textarea" style={{ fontFamily: 'var(--f-mono)' }} placeholder="Encoded output..." />
      </div>
    </div>
  );
}
