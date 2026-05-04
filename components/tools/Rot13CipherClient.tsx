'use client';

import { useState } from 'react';

function rot13Char(c: string): string {
  const code = c.charCodeAt(0);
  if (code >= 65 && code <= 90) return String.fromCharCode(((code - 65 + 13) % 26) + 65);
  if (code >= 97 && code <= 122) return String.fromCharCode(((code - 97 + 13) % 26) + 97);
  return c;
}

export default function Rot13CipherClient() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const output = input.split('').map(c => {
    const encoded = rot13Char(c);
    return mode === 'decode' ? rot13Char(encoded) : encoded;
  }).join('');

  const copy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).catch(() => {});
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Input</span>
        <div className="tb-v2-mode-tabs" role="group">
          <button type="button" onClick={() => setMode('encode')} className={`tb-v2-mode-tab ${mode === 'encode' ? 'on' : ''}`}>Encode</button>
          <button type="button" onClick={() => setMode('decode')} className={`tb-v2-mode-tab ${mode === 'decode' ? 'on' : ''}`}>Decode</button>
        </div>
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Type or paste text to ROT13..."
        className="tb-v2-tool-textarea"
        style={{ minHeight: 100 }}
      />
      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Output</span>
        {output && <button type="button" onClick={copy} className="tb-v2-copy-btn">Copy</button>}
      </div>
      <div className="tb-v2-tool-output-body">
        <div style={{ fontFamily: 'var(--f-mono)', fontSize: 16, color: 'var(--tb-accent)', wordBreak: 'break-all' }}>
          {output || '—'}
        </div>
        <div style={{ marginTop: 8, fontSize: 12, color: 'var(--tb-text-secondary)' }}>
          ROT13 replaces each letter with the 13th letter after it. Since the alphabet has 26 letters, encoding and decoding produce the same result.
        </div>
      </div>
    </div>
  );
}
