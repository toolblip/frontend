'use client';

import { useState, useCallback } from 'react';

export default function PercentageDifferenceClient() {
  const [val1, setVal1] = useState('');
  const [val2, setVal2] = useState('');
  const [result, setResult] = useState<{ pct: string; absolute: string; direction: string } | null>(null);

  const calculate = useCallback(() => {
    const v1 = parseFloat(val1);
    const v2 = parseFloat(val2);
    if (isNaN(v1) || isNaN(v2) || v1 + v2 === 0) return;

    const avg = (v1 + v2) / 2;
    const diff = v2 - v1;
    const pct = avg !== 0 ? (diff / Math.abs(avg)) * 100 : 0;
    const absPct = Math.abs(pct);
    const dir = diff > 0 ? '↑ increase' : diff < 0 ? '↓ decrease' : 'no change';

    setResult({
      pct: `${pct >= 0 ? '+' : ''}${pct.toFixed(2)}%`,
      absolute: `${diff >= 0 ? '+' : ''}${diff.toFixed(4)}`,
      direction: dir,
    });
  }, [val1, val2]);

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Values</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <div>
          <label style={{ fontSize: 12, color: 'var(--tb-text-secondary)', display: 'block', marginBottom: 4 }}>Value 1</label>
          <input type="number" value={val1} onChange={(e) => setVal1(e.target.value)} className="tb-v2-tool-input" aria-label="Value 1" />
        </div>
        <div>
          <label style={{ fontSize: 12, color: 'var(--tb-text-secondary)', display: 'block', marginBottom: 4 }}>Value 2</label>
          <input type="number" value={val2} onChange={(e) => setVal2(e.target.value)} className="tb-v2-tool-input" aria-label="Value 2" />
        </div>
      </div>
      <button type="button" onClick={calculate} className="tb-v2-primary-btn" style={{ width: '100%', marginBottom: 16 }}>
        Calculate
      </button>

      {result && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Result</span>
          </div>
          <div className="tb-v2-tool-output-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14 }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <span style={{ minWidth: 120, color: 'var(--tb-text-secondary)' }}>Difference</span>
                <code style={{ fontFamily: 'var(--f-mono)' }}>{result.absolute}</code>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <span style={{ minWidth: 120, color: 'var(--tb-text-secondary)' }}>Percentage</span>
                <code style={{ fontFamily: 'var(--f-mono)' }}>{result.pct}</code>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <span style={{ minWidth: 120, color: 'var(--tb-text-secondary)' }}>Direction</span>
                <span>{result.direction}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}