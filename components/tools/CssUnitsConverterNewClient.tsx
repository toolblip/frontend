"use client";
import { useState, useMemo } from 'react';

const UNITS = ['px', 'rem', 'em', 'vw', 'vh', 'vmin', 'vmax', '%'];
const BASE_PX = 16;

function convert(value: number, from: string, to: string): number {
  if (from === to) return value;
  // Convert to px first
  let px = value;
  if (from === 'rem' || from === 'em') px = value * BASE_PX;
  else if (from === 'vw') px = (value / 100) * (typeof window !== 'undefined' ? window.innerWidth : 1200);
  else if (from === 'vh') px = (value / 100) * (typeof window !== 'undefined' ? window.innerHeight : 800);
  else if (from === '%') px = value; // Simplified
  // Convert from px to target
  if (to === 'rem' || to === 'em') return px / BASE_PX;
  if (to === 'vw') return (px / (typeof window !== 'undefined' ? window.innerWidth : 1200)) * 100;
  if (to === 'vh') return (px / (typeof window !== 'undefined' ? window.innerHeight : 800)) * 100;
  if (to === '%') return px;
  return px;
}

export default function CssUnitsConverterNewClient() {
  const [value, setValue] = useState(16);
  const [fromUnit, setFromUnit] = useState('px');
  const [copiedIdx, setCopiedIdx] = useState(-1);

  const results = useMemo(() =>
    UNITS.map(u => ({ unit: u, value: convert(value, fromUnit, u) })),
    [value, fromUnit]
  );

  const copy = (val: string, idx: number) => {
    navigator.clipboard.writeText(val).catch(() => {});
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(-1), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Value</span>
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
        <input type="number" value={value} onChange={e => setValue(+e.target.value)}
          className="tb-v2-tool-textarea" style={{ flex: 1, padding: '0.75rem', fontSize: '1.125rem' }} />
        <select value={fromUnit} onChange={e => setFromUnit(e.target.value)}
          className="tb-v2-tool-textarea" style={{ width: '120px', padding: '0.75rem' }}>
          {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
        </select>
      </div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Converted Values</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
        {results.map((r, i) => (
          <div key={r.unit} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '0.75rem', background: r.unit === fromUnit ? '#f0f9ff' : '#f9fafb',
            borderRadius: '6px', border: r.unit === fromUnit ? '1px solid #93c5fd' : '1px solid #e5e7eb' }}>
            <span style={{ fontFamily: 'monospace' }}>
              <strong>{r.value.toFixed(4)}</strong> {r.unit}
            </span>
            <button type="button" onClick={() => copy(`${r.value.toFixed(4)}${r.unit}`, i)}
              style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#667eea' }}>
              {copiedIdx === i ? 'Copied' : 'Copy'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
