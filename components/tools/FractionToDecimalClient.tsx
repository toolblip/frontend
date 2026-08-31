'use client';

import { useCallback, useMemo, useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const EXAMPLE = '3/4';

function fractionToDecimal(input: string, rounded: number): { result: string; error: string } {
  const trimmed = input.trim();
  if (!trimmed) return { result: '', error: '' };

  const mixed = trimmed.match(/^(\d+)?\s*(\d+)\/(\d+)$/);
  const simple = trimmed.match(/^(\d+)\/(\d+)$/);
  const decimal = parseFloat(trimmed);

  if (mixed) {
    const whole = parseInt(mixed[1] || '0', 10);
    const num = parseInt(mixed[2], 10);
    const den = parseInt(mixed[3], 10);
    if (den === 0) return { result: '', error: 'Denominator cannot be zero' };
    const val = whole + num / den;
    return { result: parseFloat(val.toFixed(rounded)).toString(), error: '' };
  }
  if (simple) {
    const num = parseInt(simple[1], 10);
    const den = parseInt(simple[2], 10);
    if (den === 0) return { result: '', error: 'Denominator cannot be zero' };
    const val = num / den;
    return { result: parseFloat(val.toFixed(rounded)).toString(), error: '' };
  }
  if (!isNaN(decimal)) {
    return { result: parseFloat(decimal.toFixed(rounded)).toString(), error: '' };
  }
  return { result: '', error: 'Invalid format. Use like 3/4 or 1 2/3' };
}

export default function FractionToDecimalClient() {
  const [input, setInput] = useState('');
  const [rounded, setRounded] = useState(4);
  const [copied, setCopied] = useState(false);

  const { result, error } = useMemo(
    () => fractionToDecimal(input, rounded),
    [input, rounded]
  );

  const copy = useCallback(() => {
    if (!result) return;
    navigator.clipboard.writeText(result).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [result]);

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Fraction to Decimal</span>
        <ToolExampleClearActions
          exampleCount={1}
          onExample={() => setInput(EXAMPLE)}
          onClear={() => setInput('')}
          canClear={input.length > 0}
        />
      </div>

      <div style={{ padding: '0 20px 12px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. 3/4, 1 2/3, 0.75…"
          className="tb-v2-tool-input"
          style={{ width: '100%' }}
          aria-label="Fraction input"
        />
        <div style={{ display: 'flex', gap: 8, marginTop: 12, alignItems: 'center' }}>
          <label style={{ fontSize: 13, color: 'var(--tb-text-secondary)', whiteSpace: 'nowrap' }}>
            Decimal places
          </label>
          <input
            type="number"
            value={rounded}
            onChange={(e) => setRounded(Math.min(15, Math.max(0, parseInt(e.target.value) || 0)))}
            min={0}
            max={15}
            className="tb-v2-tool-input"
            style={{ width: 72 }}
            aria-label="Decimal places"
          />
        </div>
        {error ? (
          <p className="tb-v2-error" role="alert" style={{ marginTop: 8 }}>
            {error}
          </p>
        ) : null}
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Decimal</span>
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
        {result ? (
          <code style={{ fontFamily: 'var(--f-mono)', fontSize: 24 }}>{result}</code>
        ) : (
          <p className="tb-v2-empty">Enter a fraction or use Example.</p>
        )}
      </div>
    </div>
  );
}
