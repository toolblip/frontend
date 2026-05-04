'use client';

import { useState, useCallback } from 'react';

export default function TemperatureConverterClient() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<{ unit: string; value: string }[]>([]);

  const convert = useCallback(() => {
    const val = parseFloat(input);
    if (isNaN(val)) return;

    const celsius = (val - 32) * 5 / 9;
    const fahrenheit = val;
    const kelvin = celsius + 273.15;

    setResults([
      { unit: 'Celsius (°C)', value: celsius.toFixed(4) },
      { unit: 'Fahrenheit (°F)', value: fahrenheit.toFixed(4) },
      { unit: 'Kelvin (K)', value: kelvin.toFixed(4) },
    ]);
  }, [input]);

  const setPreset = (val: number) => {
    setInput(val.toString());
    convert();
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Temperature</span>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <input
          type="number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && convert()}
          placeholder="Enter temperature..."
          className="tb-v2-tool-input"
          style={{ flex: 1 }}
          aria-label="Temperature input"
        />
        <button type="button" onClick={convert} className="tb-v2-primary-btn">Convert</button>
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
        {[[0, 'Freezing'], [20, 'Room'], [37, 'Body'], [100, 'Boiling'], [-40, 'Extreme']].map(([v, label]) => (
          <button key={v} type="button" onClick={() => setPreset(v as number)} className="tb-v2-mode-tab" style={{ fontSize: 12 }}>
            {label} ({v}°F)
          </button>
        ))}
      </div>

      {results.length > 0 && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Results</span>
          </div>
          <div className="tb-v2-tool-output-body">
            {results.map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 8, fontSize: 14 }}>
                <span style={{ minWidth: 140, color: 'var(--tb-text-secondary)' }}>{r.unit}</span>
                <code style={{ fontFamily: 'var(--f-mono)' }}>{r.value}</code>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}