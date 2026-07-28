"use client";
import { useState, useCallback } from 'react';

export default function SecureRandomGeneratorClient() {
  const [bytes, setBytes] = useState(32);
  const [format, setFormat] = useState<'hex' | 'base64' | 'binary'>('hex');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    const arr = new Uint8Array(bytes);
    crypto.getRandomValues(arr);
    if (format === 'hex') setResult(Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join(''));
    else if (format === 'base64') setResult(btoa(String.fromCharCode(...arr)));
    else setResult(Array.from(arr).map(b => b.toString(2).padStart(8, '0')).join(' '));
  }, [bytes, format]);

  const copy = () => { navigator.clipboard.writeText(result).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Bytes: {bytes}</span></div>
      <input type="range" min={4} max={128} value={bytes} onChange={e => setBytes(+e.target.value)} className="w-full" />
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
        {(['hex', 'base64', 'binary'] as const).map(f => (
          <button key={f} onClick={() => setFormat(f)} className={`tb-v2-mode-tab ${format === f ? 'on' : ''}`}>{f}</button>
        ))}
      </div>
      <button onClick={generate} className="tb-v2-btn" style={{ marginTop: '0.75rem' }}>Generate Random Bytes</button>
      {result && (
        <div style={{ marginTop: '1rem' }}>
          <div className="tb-v2-tool-input-head">
            <span className="tb-v2-tool-label">Output</span>
            <button onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>{copied ? 'Copied' : 'Copy'}</button>
          </div>
          <pre style={{ background: '#1a1a2e', color: '#a5f3fc', padding: '1rem', borderRadius: '8px',
            fontFamily: 'monospace', fontSize: '0.875rem', wordBreak: 'break-all', whiteSpace: 'pre-wrap', margin: 0 }}>{result}</pre>
        </div>
      )}
    </div>
  );
}
