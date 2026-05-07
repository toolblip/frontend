'use client';

import { useState, useCallback } from 'react';

const UNITS = ['cups', 'tablespoons', 'teaspoons', 'milliliters', 'liters', 'fluid_oz', 'pounds', 'grams'];
const FACTORS: Record<string, number> = {
  cups: 1,
  tablespoons: 16,
  teaspoons: 48,
  milliliters: 236.588,
  liters: 0.236588,
  fluid_oz: 8,
  pounds: 0.5,
  grams: 236.588,
};

export default function CookingUnitConverterClient() {
  const [input, setInput] = useState('1');
  const [fromUnit, setFromUnit] = useState('cups');
  const [results, setResults] = useState<{ unit: string; value: string }[]>([]);

  const convert = useCallback(() => {
    const val = parseFloat(input);
    if (isNaN(val)) return;
    const base = val * FACTORS[fromUnit];
    const converted = UNITS.map(u => ({
      unit: u,
      value: (base / FACTORS[u]).toFixed(6).replace(/\.?0+$/, '')
    }));
    setResults(converted);
  }, [input, fromUnit]);

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Input</span>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input
          type="number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="tb-v2-tool-input"
          style={{ width: 120 }}
          aria-label="Cooking value"
        />
        <select
          value={fromUnit}
          onChange={(e) => setFromUnit(e.target.value)}
          className="tb-v2-tool-select"
          style={{ flex: 1 }}
          aria-label="From unit"
        >
          {UNITS.map(u => <option key={u} value={u}>{u.replace('_', ' ')}</option>)}
        </select>
        <button type="button" onClick={convert} className="tb-v2-primary-btn">Convert</button>
      </div>

      {results.length > 0 && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">All Units</span>
          </div>
          <div className="tb-v2-tool-output-body">
            {results.map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 6, fontSize: 13 }}>
                <span style={{ minWidth: 100, color: 'var(--tb-text-secondary)' }}>{r.unit.replace('_', ' ')}</span>
                <code style={{ fontFamily: 'var(--f-mono)' }}>{r.value}</code>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}