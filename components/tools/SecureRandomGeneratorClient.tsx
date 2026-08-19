'use client';

import { useState } from 'react';
import { randomFromAlphabet, randomHexBytes, randomInt, randomUuid, supportsRandomUuid } from '@/lib/secureRandom';

type Kind = 'string' | 'number' | 'uuid' | 'bytes';

const ALPHANUMERIC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export default function SecureRandomGeneratorClient() {
  const [kind, setKind] = useState<Kind>('string');
  const [length, setLength] = useState(16);
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(1);
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    setError('');
    const n = Math.max(1, Math.min(50, count));

    if (kind === 'number') {
      const lo = Math.min(min, max);
      const hi = Math.max(min, max);
      if (hi - lo + 1 > 0x100000000) {
        setError('Range is too large (max 2^32 values at once).');
        setResults([]);
        return;
      }
      setResults(Array.from({ length: n }, () => String(randomInt(lo, hi))));
      setCopied(false);
      return;
    }

    if (kind === 'uuid' && !supportsRandomUuid()) {
      setError('crypto.randomUUID() is not available in this browser context (requires HTTPS or localhost).');
      setResults([]);
      return;
    }

    const out: string[] = [];
    for (let i = 0; i < n; i++) {
      if (kind === 'string') out.push(randomFromAlphabet(ALPHANUMERIC, length));
      else if (kind === 'uuid') out.push(randomUuid());
      else out.push(randomHexBytes(length));
    }
    setResults(out);
    setCopied(false);
  };

  const copy = () => {
    navigator.clipboard.writeText(results.join('\n'));
    setCopied(true);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-mode-tabs">
        {(['string', 'number', 'uuid', 'bytes'] as const).map((k) => (
          <button
            key={k}
            className={kind === k ? 'tb-v2-mode-tab-active' : 'tb-v2-mode-tab'}
            onClick={() => setKind(k)}
          >
            {k === 'string' ? 'String' : k === 'number' ? 'Number' : k === 'uuid' ? 'UUID' : 'Bytes (hex)'}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 16 }}>
        {(kind === 'string' || kind === 'bytes') && (
          <label className="tb-v2-tool-label">
            Length
            <input
              type="number"
              className="tb-v2-input"
              value={length}
              min={1}
              max={256}
              onChange={(e) => setLength(Math.max(1, Math.min(256, Number(e.target.value) || 1)))}
            />
          </label>
        )}
        {kind === 'number' && (
          <>
            <label className="tb-v2-tool-label">
              Min
              <input type="number" className="tb-v2-input" value={min} onChange={(e) => setMin(Number(e.target.value) || 0)} />
            </label>
            <label className="tb-v2-tool-label">
              Max
              <input type="number" className="tb-v2-input" value={max} onChange={(e) => setMax(Number(e.target.value) || 0)} />
            </label>
          </>
        )}
        <label className="tb-v2-tool-label">
          How many
          <input
            type="number"
            className="tb-v2-input"
            value={count}
            min={1}
            max={50}
            onChange={(e) => setCount(Math.max(1, Math.min(50, Number(e.target.value) || 1)))}
          />
        </label>
      </div>

      <button onClick={generate} className="tb-v2-btn tb-v2-btn-primary tb-v2-btn-lg" style={{ marginTop: 12 }}>
        Generate
      </button>

      {error && (
        <div className="tb-v2-tool-output-body" style={{ marginTop: 16, background: 'var(--red-tint)', color: 'var(--red)' }}>
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="tb-v2-tool-output-body" style={{ marginTop: 16 }}>
          <div className="flex justify-between items-center mb-2">
            <span className="tb-v2-tool-label">
              Output ({results.length}) — generated with crypto.getRandomValues, not Math.random
            </span>
            <button onClick={copy} className="tb-v2-copy-btn">
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontFamily: 'monospace', fontSize: 13 }}>
            {results.join('\n')}
          </pre>
        </div>
      )}
    </div>
  );
}
