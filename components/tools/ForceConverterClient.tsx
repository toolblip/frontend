"use client";
import { useState, useMemo } from 'react';

const UNITS = ['Newtons', 'Kilonewtons', 'Pound-force', 'Dyne', 'Kilogram-force'];
const FACTORS = [1, 1000, 4.44822, 100000, 9.80665];

export default function ForceConverterClient() {
  const [value, setValue] = useState(100);
  const [from, setFrom] = useState(0);
  const results = useMemo(() => {
    const n = value * FACTORS[from];
    return UNITS.map((u, i) => ({ unit: u, value: n / FACTORS[i] }));
  }, [value, from]);

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Value</span></div>
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <input type="number" value={value} onChange={e => setValue(+e.target.value)}
          className="tb-v2-tool-textarea" style={{ flex: 1 }} />
        <select value={from} onChange={e => setFrom(+e.target.value)}
          className="tb-v2-tool-textarea" style={{ width: '160px' }}>
          {UNITS.map((u, i) => <option key={u} value={i}>{u}</option>)}
        </select>
      </div>
      <div style={{ marginTop: '1rem' }}>
        {results.map(r => (
          <div key={r.unit} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0.75rem',
            borderBottom: '1px solid #e5e7eb' }}>
            <span style={{ fontFamily: 'monospace' }}>{r.value.toPrecision(6)}</span>
            <span style={{ fontWeight: 600 }}>{r.unit}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
