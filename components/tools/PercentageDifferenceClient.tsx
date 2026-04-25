'use client';

import { useState } from 'react';

export default function PercentageDifferenceClient() {
  const [a, setA] = useState('');
  const [b, setB] = useState('');

  const numA = parseFloat(a);
  const numB = parseFloat(b);

  const calc = (): string => {
    if (isNaN(numA) || isNaN(numB) || numA === 0) return '';
    return (((numB - numA) / Math.abs(numA)) * 100).toFixed(2);
  };

  const pct = calc();

  const displayResult = () => {
    if (!pct) return null;
    const val = parseFloat(pct);
    const sign = val >= 0 ? '+' : '';
    return (
      <div style={{
        padding: '16px 20px', background: val >= 0 ? '#f0fdf4' : '#fef2f2',
        borderRadius: 12, textAlign: 'center', border: '1px solid', borderColor: val >= 0 ? '#22c55e44' : 'var(--red)' + '44',
      }}>
        <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: -0.03, color: val >= 0 ? '#166534' : 'var(--red)', fontFamily: 'var(--f-display)' }}>
          {sign}{pct}%
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--fg-2)', marginTop: 6 }}>
          {val >= 0 ? '↑ Increase' : '↓ Decrease'} from {a} to {b}
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 12, alignItems: 'center' }}>
        <div>
          <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--fg-1)', display: 'block', marginBottom: 6 }}>Original Value</label>
          <input
            type="number"
            value={a}
            onChange={(e) => setA(e.target.value)}
            placeholder="e.g. 100"
            style={{
              width: '100%', padding: '10px 14px', fontSize: 14,
              border: '1.5px solid var(--line)', borderRadius: 9, background: 'var(--surface)',
              color: 'var(--fg-0)', outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>
        <div style={{ fontSize: 20, color: 'var(--fg-3)', marginTop: 20 }}>→</div>
        <div>
          <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--fg-1)', display: 'block', marginBottom: 6 }}>New Value</label>
          <input
            type="number"
            value={b}
            onChange={(e) => setB(e.target.value)}
            placeholder="e.g. 120"
            style={{
              width: '100%', padding: '10px 14px', fontSize: 14,
              border: '1.5px solid var(--line)', borderRadius: 9, background: 'var(--surface)',
              color: 'var(--fg-0)', outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {displayResult()}

      {pct && (
        <div style={{ padding: '12px 14px', background: 'var(--surface-2)', borderRadius: 8, fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--fg-0)' }}>Formula:</strong> ((New - Original) / |Original|) × 100 = Percentage change
        </div>
      )}
    </div>
  );
}
