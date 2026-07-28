"use client";
import { useState, useMemo } from 'react';

const UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
const FACTORS = [1, 1024, 1024**2, 1024**3, 1024**4, 1024**5];

export default function DataSizeConverterClient() {
  const [value, setValue] = useState(1);
  const [from, setFrom] = useState(2);
  const results = useMemo(() => {
    const bytes = value * FACTORS[from];
    return UNITS.map((u, i) => ({ unit: u, value: bytes / FACTORS[i] }));
  }, [value, from]);

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Value</span></div>
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <input type="number" min={0} step={0.01} value={value} onChange={e => setValue(+e.target.value)}
          className="tb-v2-tool-textarea" style={{ flex: 1 }} />
        <select value={from} onChange={e => setFrom(+e.target.value)}
          className="tb-v2-tool-textarea" style={{ width: '120px' }}>
          {UNITS.map((u, i) => <option key={u} value={i}>{u}</option>)}
        </select>
      </div>
      <div style={{ marginTop: '1rem' }}>
        {results.map(r => (
          <div key={r.unit} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0.75rem',
            borderBottom: '1px solid #e5e7eb', fontFamily: 'monospace' }}>
            <span>{r.value.toFixed(4)}</span><span style={{ fontWeight: 600 }}>{r.unit}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
