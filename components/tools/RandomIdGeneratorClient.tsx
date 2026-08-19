'use client';

import { useState } from 'react';
import { randomFromAlphabet } from '@/lib/secureRandom';

const CHARSETS = {
  alphanumeric: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  letters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
} as const;

type CharsetKey = keyof typeof CHARSETS;

const MAX_PREFIX_LENGTH = 16;

export default function RandomIdGeneratorClient() {
  const [charsetKey, setCharsetKey] = useState<CharsetKey>('alphanumeric');
  const [length, setLength] = useState(8);
  const [prefix, setPrefix] = useState('');
  const [count, setCount] = useState(5);
  const [ids, setIds] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const n = Math.max(1, Math.min(100, count));
    const len = Math.max(1, Math.min(64, length));
    const charset = CHARSETS[charsetKey];
    const cleanPrefix = prefix.trim().slice(0, MAX_PREFIX_LENGTH);
    setIds(Array.from({ length: n }, () => `${cleanPrefix}${randomFromAlphabet(charset, len)}`));
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
          Prefix (optional, max {MAX_PREFIX_LENGTH} chars)
          <input
            className="tb-v2-input"
            value={prefix}
            maxLength={MAX_PREFIX_LENGTH}
            onChange={(e) => setPrefix(e.target.value.slice(0, MAX_PREFIX_LENGTH))}
            placeholder="e.g. ID-"
          />
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
