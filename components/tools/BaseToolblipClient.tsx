'use client';

import { useState } from 'react';

const BASES = [
  { label: 'Binary', value: 2, chars: '01' },
  { label: 'Octal', value: 8, chars: '01234567' },
  { label: 'Decimal', value: 10, chars: '0123456789' },
  { label: 'Hexadecimal', value: 16, chars: '0123456789ABCDEF' },
  { label: 'Base-32', value: 32, chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567' },
] as const;

function convert(value: string, from: number, to: number): string {
  if (!value.trim()) return '';
  try {
    const decimal = parseInt(value.trim(), from);
    if (isNaN(decimal)) return 'Invalid input';
    return decimal.toString(to).toUpperCase();
  } catch {
    return 'Error';
  }
}

export default function BaseToolblipClient() {
  const [input, setInput] = useState('');
  const [from, setFrom] = useState<number>(10);
  const [to, setTo] = useState<number>(2);
  const [result, setResult] = useState('');

  const handleConvert = () => {
    setResult(convert(input, from, to));
  };

  const copy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result).catch(() => {});
  };

  return (
    <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:16,padding:"16px 20px"}}>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Value</span>
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleConvert()}
        placeholder="Enter value..."
        className="tb-v2-tool-input"
        style={{ fontFamily: 'var(--f-mono)' }}
        aria-label="Value input"
      />

      <div className="tb-v2-flex-row" style={{ gap: '0.5rem' }}>
        <div style={{ flex: 1 }}>
          <label className="tb-v2-tool-label" style={{ display: 'block', marginBottom: '0.25rem' }}>From Base</label>
          <select value={from} onChange={(e) => setFrom(Number(e.target.value))} className="tb-v2-select">
            {BASES.map((b) => (
              <option key={b.value} value={b.value}>{b.label}</option>
            ))}
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label className="tb-v2-tool-label" style={{ display: 'block', marginBottom: '0.25rem' }}>To Base</label>
          <select value={to} onChange={(e) => setTo(Number(e.target.value))} className="tb-v2-select">
            {BASES.map((b) => (
              <option key={b.value} value={b.value}>{b.label}</option>
            ))}
          </select>
        </div>
      </div>

      <button type="button" onClick={handleConvert} className="tb-v2-btn w-full">
        Convert
      </button>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Result ({BASES.find((b) => b.value === to)?.label})</span>
        <button type="button" onClick={copy} disabled={!result} className="tb-v2-copy-btn">
          Copy
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        <pre className="tb-v2-tool-pre" style={{ wordBreak: 'break-all' }}>{result || ' - '}</pre>
      </div>
    </div>
  );
}
