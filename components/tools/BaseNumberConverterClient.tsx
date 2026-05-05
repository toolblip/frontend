'use client';

import { useState } from 'react';

const BASES = [
  { label: 'Binary', value: 2, prefix: '0b' },
  { label: 'Octal', value: 8, prefix: '0o' },
  { label: 'Decimal', value: 10, prefix: '' },
  { label: 'Hexadecimal', value: 16, prefix: '0x' },
  { label: 'Base-32', value: 32, prefix: '' },
] as const;

function convertNumber(value: string, fromBase: number, toBase: number): string {
  if (!value.trim()) return '';
  try {
    const decimal = parseInt(value.trim(), fromBase);
    if (isNaN(decimal)) return 'Invalid input for selected base';
    return decimal.toString(toBase).toUpperCase();
  } catch {
    return 'Conversion error';
  }
}

export default function BaseNumberConverterClient() {
  const [input, setInput] = useState('');
  const [fromBase, setFromBase] = useState<number>(10);
  const [toBase, setToBase] = useState<number>(2);
  const [copied, setCopied] = useState(false);

  const result = convertNumber(input, fromBase, toBase);

  const copy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const swap = () => {
    setFromBase(toBase);
    setToBase(fromBase);
    setInput(result);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Number</span>
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter a number..."
        className="tb-v2-tool-input"
        style={{ fontFamily: 'var(--f-mono)' }}
        aria-label="Number input"
      />

      <div className="tb-v2-flex-row" style={{ gap: '0.75rem', margin: '0.75rem 0' }}>
        <div style={{ flex: 1 }}>
          <label className="tb-v2-tool-label" style={{ marginBottom: '0.25rem', display: 'block' }}>From</label>
          <select
            value={fromBase}
            onChange={(e) => setFromBase(Number(e.target.value))}
            className="tb-v2-select"
            aria-label="Source base"
          >
            {BASES.map((b) => (
              <option key={b.value} value={b.value}>{b.label} ({b.prefix || `${b.value}`})</option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={swap}
          className="tb-v2-btn"
          style={{ alignSelf: 'flex-end', marginBottom: '0', padding: '0.5rem 0.75rem' }}
          aria-label="Swap bases"
        >
          ⇄
        </button>

        <div style={{ flex: 1 }}>
          <label className="tb-v2-tool-label" style={{ marginBottom: '0.25rem', display: 'block' }}>To</label>
          <select
            value={toBase}
            onChange={(e) => setToBase(Number(e.target.value))}
            className="tb-v2-select"
            aria-label="Target base"
          >
            {BASES.map((b) => (
              <option key={b.value} value={b.value}>{b.label} ({b.prefix || `${b.value}`})</option>
            ))}
          </select>
        </div>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">
          {BASES.find((b) => b.value === toBase)?.label || 'Result'}
        </span>
        <button
          type="button"
          onClick={copy}
          disabled={!result}
          className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        <pre className="tb-v2-tool-pre" style={{ wordBreak: 'break-all' }}>{result || '—'}</pre>
      </div>
    </div>
  );
}
