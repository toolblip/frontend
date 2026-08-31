'use client';

import { useMemo, useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

type TempUnit = 'C' | 'F' | 'K';

const EXAMPLE_VALUE = '72';
const EXAMPLE_UNIT: TempUnit = 'F';

const PRESETS: { label: string; value: number; unit: TempUnit }[] = [
  { label: 'Freezing', value: 32, unit: 'F' },
  { label: 'Boiling', value: 212, unit: 'F' },
  { label: 'Body', value: 98.6, unit: 'F' },
  { label: 'Room', value: 72, unit: 'F' },
  { label: 'Absolute Zero', value: -459.67, unit: 'F' },
];

function toCelsius(val: number, from: TempUnit): number {
  if (from === 'C') return val;
  if (from === 'F') return ((val - 32) * 5) / 9;
  return val - 273.15;
}

export default function TempConverterExpressClient() {
  const [input, setInput] = useState('');
  const [fromUnit, setFromUnit] = useState<TempUnit>('F');

  const { results, error } = useMemo(() => {
    if (!input.trim()) return { results: [] as { unit: string; value: string; symbol: string }[], error: '' };
    const val = parseFloat(input);
    if (isNaN(val)) return { results: [], error: 'Please enter a valid number' };
    const celsius = toCelsius(val, fromUnit);
    return {
      error: '',
      results: [
        { unit: 'Celsius', value: celsius.toFixed(4), symbol: '°C' },
        { unit: 'Fahrenheit', value: (celsius * (9 / 5) + 32).toFixed(4), symbol: '°F' },
        { unit: 'Kelvin', value: (celsius + 273.15).toFixed(4), symbol: 'K' },
      ],
    };
  }, [input, fromUnit]);

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head" style={{ borderBottom: '1px solid var(--line)' }}>
        <span className="tb-v2-tool-label">Temperature</span>
        <ToolExampleClearActions
          exampleCount={1}
          onExample={() => {
            setInput(EXAMPLE_VALUE);
            setFromUnit(EXAMPLE_UNIT);
          }}
          onClear={() => {
            setInput('');
            setFromUnit('F');
          }}
          canClear={input.length > 0}
        />
      </div>

      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="tb-v2-mode-tabs">
          {(['C', 'F', 'K'] as const).map((unit) => (
            <button
              key={unit}
              type="button"
              onClick={() => setFromUnit(unit)}
              className={`tb-v2-mode-tab ${fromUnit === unit ? 'on' : ''}`}
            >
              °{unit}
            </button>
          ))}
        </div>

        <input
          type="number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter temperature…"
          className="tb-v2-tool-input"
          style={{ width: '100%', fontFamily: 'var(--f-mono)', fontSize: 18 }}
          aria-label="Temperature value"
        />

        <div className="tb-v2-mode-tabs" style={{ flexWrap: 'wrap' }}>
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => {
                setInput(String(p.value));
                setFromUnit(p.unit);
              }}
              className="tb-v2-mode-tab"
            >
              {p.label} ({p.value}°{p.unit})
            </button>
          ))}
        </div>

        {error ? (
          <div className="tb-v2-banner tb-v2-banner-err">{error}</div>
        ) : null}

        {results.length === 0 && !error ? (
          <p className="tb-v2-empty">Enter a temperature, pick a preset, or use Example.</p>
        ) : (
          <div className="grid gap-3">
            {results.map((r) => (
              <div
                key={r.unit}
                className="tb-v2-section"
                style={{
                  padding: 16,
                  background: 'var(--surface-2)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ color: 'var(--tb-text-secondary)' }}>{r.unit}</span>
                <span style={{ fontFamily: 'var(--f-mono)', fontSize: 20, fontWeight: 600 }}>
                  {r.value} <span style={{ fontSize: 13, color: 'var(--tb-text-secondary)' }}>{r.symbol}</span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
