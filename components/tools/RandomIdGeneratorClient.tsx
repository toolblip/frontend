'use client';

import { useState } from 'react';

const CHARSETS = {
  alphanumeric: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  letters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
} as const;

type CharsetKey = keyof typeof CHARSETS;

// Rejection sampling to avoid modulo bias - see SecureRandomGeneratorClient.
function randomIndex(charsetSize: number): number {
  const limit = Math.floor(256 / charsetSize) * charsetSize;
  let x: number;
  do {
    x = crypto.getRandomValues(new Uint8Array(1))[0];
  } while (x >= limit);
  return x % charsetSize;
}

function generateId(length: number, charset: string, prefix: string): string {
  const body = Array.from({ length }, () => charset[randomIndex(charset.length)]).join('');
  return prefix ? `${prefix}${body}` : body;
}

export default function RandomIdGeneratorClient() {
  const [charsetKey, setCharsetKey] = useState<CharsetKey>('alphanumeric');
  const [length, setLength] = useState(8);
  const [prefix, setPrefix] = useState('');
  const [count, setCount] = useState(5);
  const [ids, setIds] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const n = Math.max(1, Math.min(100, count));
    const charset = CHARSETS[charsetKey];
    setIds(Array.from({ length: n }, () => generateId(Math.max(1, Math.min(64, length)), charset, prefix.trim())));
    setCopied(false);
  };

  const copy = () => {
    navigator.clipboard.writeText(ids.join('\n'));
    setCopied(true);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-mode-tabs">
        {(Object.keys(CHARSETS) as CharsetKey[]).map((k) => (
          <button key={k} className={charsetKey === k ? 'tb-v2-mode-tab-active' : 'tb-v2-mode-tab'} onClick={() => setCharsetKey(k)}>
            {k === 'alphanumeric' ? 'Alphanumeric' : k === 'uppercase' ? 'Uppercase' : 'Letters only'}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 16 }}>
        <label className="tb-v2-tool-label">
          Length
          <input
            type="number"
            className="tb-v2-input"
            value={length}
            min={1}
            max={64}
            onChange={(e) => setLength(Math.max(1, Math.min(64, Number(e.target.value) || 1)))}
          />
        </label>
        <label className="tb-v2-tool-label">
          Prefix (optional)
          <input className="tb-v2-input" value={prefix} onChange={(e) => setPrefix(e.target.value)} placeholder="e.g. ID-" />
        </label>
        <label className="tb-v2-tool-label">
          How many
          <input
            type="number"
            className="tb-v2-input"
            value={count}
            min={1}
            max={100}
            onChange={(e) => setCount(Math.max(1, Math.min(100, Number(e.target.value) || 1)))}
          />
        </label>
      </div>

      <button onClick={generate} className="tb-v2-btn tb-v2-btn-primary tb-v2-btn-lg" style={{ marginTop: 12 }}>
        Generate
      </button>

      {ids.length > 0 && (
        <div className="tb-v2-tool-output-body" style={{ marginTop: 16 }}>
          <div className="flex justify-between items-center mb-2">
            <span className="tb-v2-tool-label">IDs ({ids.length})</span>
            <button onClick={copy} className="tb-v2-copy-btn">
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: 13 }}>{ids.join('\n')}</pre>
        </div>
      )}
    </div>
  );
}
