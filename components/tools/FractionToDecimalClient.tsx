'use client';

import { useState, useCallback } from 'react';

export default function FractionToDecimalClient() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [rounded, setRounded] = useState(4);
  const [error, setError] = useState('');

  const convert = useCallback(() => {
    setError('');
    const trimmed = input.trim();
    if (!trimmed) { setError('Enter a fraction like 3/4 or 1 2/3'); return; }

    let num = 0, den = 1, whole = 0;
    const mixed = trimmed.match(/^(\d+)?\s*(\d+)\/(\d+)$/);
    const simple = trimmed.match(/^(\d+)\/(\d+)$/);
    const decimal = parseFloat(trimmed);

    if (mixed) {
      whole = parseInt(mixed[1] || '0');
      num = parseInt(mixed[2]);
      den = parseInt(mixed[3]);
      const val = whole + num / den;
      setResult(parseFloat(val.toFixed(rounded)).toString());
    } else if (simple) {
      num = parseInt(simple[1]);
      den = parseInt(simple[2]);
      if (den === 0) { setError('Denominator cannot be zero'); return; }
      const val = num / den;
      setResult(parseFloat(val.toFixed(rounded)).toString());
    } else if (!isNaN(decimal)) {
      setResult(parseFloat(decimal.toFixed(rounded)).toString());
    } else {
      setError('Invalid format. Use like 3/4 or 1 2/3');
    }
  }, [input, rounded]);

  const copy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result).catch(() => {});
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Fraction</span>
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && convert()}
        placeholder='e.g. 3/4, 1 2/3, 0.75...'
        className="tb-v2-tool-input"
        aria-label="Fraction input"
      />
      <div style={{ display: 'flex', gap: 8, marginTop: 8, marginBottom: 12, alignItems: 'center' }}>
        <label style={{ fontSize: 13, color: 'var(--tb-text-secondary)', whiteSpace: 'nowrap' }}>Decimal places:</label>
        <input
          type="number"
          value={rounded}
          onChange={(e) => setRounded(parseInt(e.target.value) || 4)}
          min={0}
          max={15}
          className="tb-v2-tool-input"
          style={{ width: 60 }}
        />
        <button type="button" onClick={convert} className="tb-v2-primary-btn" style={{ flex: 1 }}>Convert</button>
      </div>

      {error && <div style={{ color: 'var(--tb-accent)', fontSize: 13, marginBottom: 8 }}>{error}</div>}

      {result && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Decimal</span>
            <button type="button" onClick={copy} className="tb-v2-copy-btn">Copy</button>
          </div>
          <div className="tb-v2-tool-output-body">
            <code style={{ fontFamily: 'var(--f-mono)', fontSize: 24 }}>{result}</code>
          </div>
        </>
      )}
    </div>
  );
}