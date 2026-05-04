'use client';

import { useState, useCallback } from 'react';

export default function RandomFractionGeneratorClient() {
  const [count, setCount] = useState('5');
  const [results, setResults] = useState<{ fraction: string; decimal: string }[]>([]);
  const [copied, setCopied] = useState(false);

  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);

  const generate = useCallback(() => {
    const cnt = Math.min(parseInt(count) || 5, 100);
    const output: { fraction: string; decimal: string }[] = [];

    for (let i = 0; i < cnt; i++) {
      const numerator = Math.floor(Math.random() * 99) + 1;
      const denominator = Math.floor(Math.random() * 99) + 1;
      const divisor = gcd(numerator, denominator);
      const n = numerator / divisor;
      const d = denominator / divisor;
      const decimal = (numerator / denominator).toFixed(6).replace(/\.?0+$/, '');
      output.push({ fraction: `${n}/${d}`, decimal });
    }

    setResults(output);
  }, [count]);

  const copy = () => {
    const text = results.map(r => `${r.fraction} = ${r.decimal}`).join('\n');
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Options</span>
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 12, color: 'var(--tb-text-secondary)', display: 'block', marginBottom: 4 }}>How many fractions?</label>
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            min="1"
            max="100"
            className="tb-v2-tool-input"
            aria-label="Number of fractions"
          />
        </div>
        <button type="button" onClick={generate} className="tb-v2-primary-btn">
          Generate
        </button>
      </div>

      {results.length > 0 && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Fractions</span>
            <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="tb-v2-tool-output-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {results.map((r, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, fontSize: 14, fontFamily: 'var(--f-mono)' }}>
                  <span style={{ minWidth: 60 }}>{r.fraction}</span>
                  <span style={{ color: 'var(--tb-text-secondary)' }}>=</span>
                  <span>{r.decimal}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
