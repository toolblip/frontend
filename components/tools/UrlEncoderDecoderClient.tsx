"use client";
import { useState } from 'react';

export default function UrlEncoderDecoderClient() {
  const [input, setInput] = useState('https://example.com/path?q=hello world&lang=en');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);
  const result = mode === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input);

  const copy = () => { navigator.clipboard.writeText(result).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  return (
    <div>
      <div className="tb-v2-mode-tabs" role="tablist">
        <button role="tab" aria-selected={mode === 'encode'} onClick={() => setMode('encode')} className={`tb-v2-mode-tab ${mode === 'encode' ? 'on' : ''}`}>Encode</button>
        <button role="tab" aria-selected={mode === 'decode'} onClick={() => setMode('decode')} className={`tb-v2-mode-tab ${mode === 'decode' ? 'on' : ''}`}>Decode</button>
      </div>
      <div className="tb-v2-tool-input-head" style={{ marginTop: '0.75rem' }}><span className="tb-v2-tool-label">Input</span></div>
      <textarea value={input} onChange={e => setInput(e.target.value)} className="tb-v2-tool-textarea" style={{ minHeight: '100px', fontFamily: 'monospace' }} />
      <div className="tb-v2-tool-input-head" style={{ marginTop: '1rem' }}>
        <span className="tb-v2-tool-label">Output</span>
        <button onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>{copied ? 'Copied' : 'Copy'}</button>
      </div>
      <pre style={{ background: '#1a1a2e', color: '#a5f3fc', padding: '1rem', borderRadius: '8px',
        fontFamily: 'monospace', fontSize: '0.875rem', whiteSpace: 'pre-wrap', wordBreak: 'break-all', margin: 0 }}>{result}</pre>
    </div>
  );
}
