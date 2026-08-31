'use client';

import { useMemo, useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const UNITS = ['kilograms', 'grams', 'milligrams', 'pounds', 'ounces', 'stone'];
const FACTORS: Record<string, number> = {
  kilograms: 1,
  grams: 0.001,
  milligrams: 0.000001,
  pounds: 0.453592,
  ounces: 0.0283495,
  stone: 6.35029,
};

const EXAMPLE_VALUE = '70';
const EXAMPLE_UNIT = 'kilograms';

function formatValue(n: number): string {
  return n.toFixed(6).replace(/\.?0+$/, '');
}

export default function WeightConverterClient() {
  const [input, setInput] = useState('');
  const [fromUnit, setFromUnit] = useState('kilograms');

  const results = useMemo(() => {
    const val = parseFloat(input);
    if (input.trim() === '' || isNaN(val)) return [];
    const base = val * FACTORS[fromUnit];
    return UNITS.map((u) => ({
      unit: u,
      value: formatValue(base / FACTORS[u]),
    }));
  }, [input, fromUnit]);

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Weight</span>
        <ToolExampleClearActions
          exampleCount={1}
          onExample={() => {
            setInput(EXAMPLE_VALUE);
            setFromUnit(EXAMPLE_UNIT);
          }}
          onClear={() => {
            setInput('');
            setFromUnit('kilograms');
          }}
          canClear={input.length > 0}
        />
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, padding: '0 20px' }}>
        <input
          type="number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="tb-v2-tool-input"
          style={{ width: 120 }}
          placeholder={EXAMPLE_VALUE}
          aria-label="Weight value"
        />
        <select
          value={fromUnit}
          onChange={(e) => setFromUnit(e.target.value)}
          className="tb-v2-tool-select"
          style={{ flex: 1 }}
          aria-label="From unit"
        >
          {UNITS.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">All units</span>
      </div>
      <div className="tb-v2-tool-output-body">
        {results.length === 0 ? (
          <p className="tb-v2-empty">Enter a weight or use Example.</p>
        ) : (
          results.map((r) => (
            <div key={r.unit} style={{ display: 'flex', gap: 12, marginBottom: 6, fontSize: 13 }}>
              <span style={{ minWidth: 100, color: 'var(--tb-text-secondary)' }}>{r.unit}</span>
              <code style={{ fontFamily: 'var(--f-mono)' }}>{r.value}</code>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
