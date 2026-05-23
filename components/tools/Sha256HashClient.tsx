'use client';

import { useEffect, useState } from 'react';

async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const buffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export default function Sha256HashClient() {
  const [input, setInput] = useState('');
  const [hash, setHash] = useState('');
  const [uppercase, setUppercase] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let alive = true;
    if (!input) {
      setHash('');
      return;
    }
    sha256(input).then(h => {
      if (!alive) return;
      setHash(h);
    });
    return () => { alive = false; };
  }, [input]);

  const fmt = (h: string) => (uppercase ? h.toUpperCase() : h);

  const copy = () => {
    if (!hash) return;
    navigator.clipboard.writeText(fmt(hash)).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const byteLen = input ? new TextEncoder().encode(input).length : 0;

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Input</span>
        <button
          type="button"
          onClick={() => setUppercase((v) => !v)}
          className={`tb-v2-mode-tab ${uppercase ? 'on' : ''}`}
          aria-pressed={uppercase}
        >
          UPPERCASE
        </button>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type or paste text to hash..."
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)' }}
        aria-label="Hash input"
      />

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">SHA-256 Hash</span>
        {input && (
          <span className="tb-v2-hash-stats">
            {input.length} char{input.length !== 1 ? 's' : ''} · {byteLen} byte{byteLen !== 1 ? 's' : ''}
          </span>
        )}
      </div>
      <div className="tb-v2-tool-output-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="tb-v2-hash-row">
          <span className="tb-v2-hash-algo">SHA-256</span>
          <code className="tb-v2-hash-val">{fmt(hash) || ' - '}</code>
          <button
            type="button"
            onClick={copy}
            disabled={!hash}
            className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
            aria-label="Copy SHA-256"
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
}
