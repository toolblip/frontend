"use client";
import { useState } from 'react';

async function sha1(message: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(message));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function Sha1HashGeneratorClient() {
  const [input, setInput] = useState('Hello, World!');
  const [hash, setHash] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = async () => { setHash(await sha1(input)); };
  const copy = () => {
    navigator.clipboard.writeText(hash).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Input Text</span></div>
      <textarea value={input} onChange={e => setInput(e.target.value)}
        className="tb-v2-tool-textarea" style={{ minHeight: '100px', fontFamily: 'monospace' }} />
      <button onClick={generate} className="tb-v2-btn" style={{ marginTop: '0.75rem' }}>Generate SHA-1</button>
      {hash && (
        <div style={{ marginTop: '1rem' }}>
          <div className="tb-v2-tool-input-head">
            <span className="tb-v2-tool-label">SHA-1 Hash (160-bit)</span>
            <button onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre style={{ background: '#1a1a2e', color: '#a5f3fc', padding: '1rem', borderRadius: '8px',
            fontFamily: 'monospace', fontSize: '0.875rem', wordBreak: 'break-all', margin: 0 }}>{hash}</pre>
        </div>
      )}
    </div>
  );
}
