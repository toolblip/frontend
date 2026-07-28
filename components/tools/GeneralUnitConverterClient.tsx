"use client";
import { useState, useMemo } from 'react';

const CATEGORIES = {
  Length: { units: ['mm','cm','m','km','in','ft','yd','mi'], factors: [0.001,0.01,1,1000,0.0254,0.3048,0.9144,1609.344] },
  Weight: { units: ['mg','g','kg','oz','lb','ton'], factors: [0.001,1,1000,0.02835,0.4536,907.185] },
  Temperature: { units: ['°C','°F','K'], factors: [1,1,1] },
  Speed: { units: ['m/s','km/h','mph','knots','ft/s'], factors: [1,0.2778,0.447,0.5144,0.3048] },
  Volume: { units: ['mL','L','gal','qt','pt','cup','fl oz'], factors: [0.001,1,3.785,0.9464,0.4732,0.2366,0.02957] },
  Area: { units: ['mm²','cm²','m²','ha','km²','in²','ft²','ac'], factors: [1e-6,1e-4,1,1e4,1e6,6.452e-4,0.0929,4047] },
} as const;

type Cat = keyof typeof CATEGORIES;

function convertTemp(val: number, from: string, to: string): number {
  let c = from === '°C' ? val : from === '°F' ? (val - 32) * 5/9 : val - 273.15;
  return to === '°C' ? c : to === '°F' ? c * 9/5 + 32 : c + 273.15;
}

export default function GeneralUnitConverterClient() {
  const [cat, setCat] = useState<Cat>('Length');
  const [value, setValue] = useState(1);
  const [from, setFrom] = useState(0);
  const cfg = CATEGORIES[cat];

  const results = useMemo(() =>
    cfg.units.map((u, i) => ({
      unit: u,
      value: cat === 'Temperature' ? convertTemp(value, cfg.units[from], u) :
        (value * cfg.factors[from]) / cfg.factors[i],
    })), [cat, value, from, cfg]);

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
        {(Object.keys(CATEGORIES) as Cat[]).map(c => (
          <button key={c} onClick={() => { setCat(c); setFrom(0); }}
            className={`tb-v2-mode-tab ${cat === c ? 'on' : ''}`}>{c}</button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <input type="number" value={value} onChange={e => setValue(+e.target.value)}
          className="tb-v2-tool-textarea" style={{ flex: 1, fontSize: '1.125rem' }} />
        <select value={from} onChange={e => setFrom(+e.target.value)}
          className="tb-v2-tool-textarea" style={{ width: '100px' }}>
          {cfg.units.map((u, i) => <option key={u} value={i}>{u}</option>)}
        </select>
      </div>
      <div style={{ marginTop: '1rem' }}>
        {results.map(r => (
          <div key={r.unit} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0.75rem',
            borderBottom: '1px solid #e5e7eb' }}>
            <span style={{ fontFamily: 'monospace' }}>{typeof r.value === 'number' ? r.value.toPrecision(6) : r.value}</span>
            <span style={{ fontWeight: 600 }}>{r.unit}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
