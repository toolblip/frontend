'use client';

import { useMemo, useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

function parseBinary(raw: string): number | null {
  const cleaned = raw.replace(/\s+/g, '');
  if (!cleaned) return null;
  if (!/^[01]+$/.test(cleaned)) return null;
  const n = parseInt(cleaned, 2);
  return Number.isNaN(n) ? null : n;
}

export default function BinaryToDecimalClient() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const results = useMemo(() => {
    const trimmed = input.trim();
    if (!trimmed) return { value: null as number | null, error: '' };
    const value = parseBinary(trimmed);
    if (value === null) return { value: null, error: 'Use only 0 and 1.' };
    return { value, error: '' };
  }, [input]);

  const copy = (key: string, text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  const rows =
    results.value === null
      ? []
      : [
          { key: 'decimal', label: 'Decimal', value: String(results.value) },
          { key: 'hex', label: 'Hexadecimal', value: results.value.toString(16).toUpperCase() },
          { key: 'octal', label: 'Octal', value: results.value.toString(8) },
        ];

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Binary</span>
        <ToolExampleClearActions
          exampleCount={1}
          onExample={() => setInput('101010')}
          onClear={() => setInput('')}
          canClear={input.length > 0}
        />
      </div>
      <div style={{ padding: '0 20px 12px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="101010"
          className="tb-v2-input"
          style={{ fontFamily: 'var(--f-mono)' }}
          aria-label="Binary number"
          spellCheck={false}
        />
        {results.error ? (
          <p className="tb-v2-empty" style={{ marginTop: 8, color: 'var(--red)' }}>
            {results.error}
          </p>
        ) : null}
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Converted</span>
      </div>
      <div className="tb-v2-tool-output-body">
        {rows.length === 0 ? (
          <p className="tb-v2-empty">Enter binary or use Example.</p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: 10,
            }}
          >
            {rows.map((r) => (
              <div
                key={r.key}
                className="tb-v2-stat-pill"
                style={{ alignItems: 'flex-start', textAlign: 'left', overflow: 'hidden' }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                    gap: 8,
                    marginBottom: 6,
                  }}
                >
                  <span style={{ fontSize: 11, color: 'var(--fg-2)' }}>{r.label}</span>
                  <button
                    type="button"
                    onClick={() => copy(r.key, r.value)}
                    className={`tb-v2-copy-btn ${copied === r.key ? 'done' : ''}`}
                  >
                    {copied === r.key ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div style={{ fontFamily: 'var(--f-mono)', fontWeight: 600, wordBreak: 'break-all' }}>
                  {r.value}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
