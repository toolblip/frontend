'use client';

import { useMemo, useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const UNITS = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'] as const;
type Unit = (typeof UNITS)[number];

const FACTORS: Record<Unit, number> = {
  Bytes: 1,
  KB: 1024,
  MB: 1024 ** 2,
  GB: 1024 ** 3,
  TB: 1024 ** 4,
  PB: 1024 ** 5,
};

const EXAMPLE_VALUE = '1048576';
const EXAMPLE_FROM: Unit = 'Bytes';

function formatResult(n: number): string {
  return n.toLocaleString('en-US', {
    maximumFractionDigits: 6,
    minimumFractionDigits: 0,
  });
}

export default function ByteConverterClient() {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState<Unit>('Bytes');
  const [highlight, setHighlight] = useState<Unit>('MB');

  const results = useMemo(() => {
    const num = parseFloat(value);
    if (value.trim() === '' || isNaN(num) || num < 0) return null;
    const bytes = num * FACTORS[fromUnit];
    const converted: Record<Unit, string> = {} as Record<Unit, string>;
    UNITS.forEach((unit) => {
      converted[unit] = formatResult(bytes / FACTORS[unit]);
    });
    return converted;
  }, [value, fromUnit]);

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Byte size</span>
        <ToolExampleClearActions
          exampleCount={1}
          onExample={() => {
            setValue(EXAMPLE_VALUE);
            setFromUnit(EXAMPLE_FROM);
            setHighlight('MB');
          }}
          onClear={() => {
            setValue('');
            setFromUnit('Bytes');
            setHighlight('MB');
          }}
          canClear={value.length > 0}
        />
      </div>

      <div style={{ padding: '0 20px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter numeric value"
          className="tb-v2-input"
          min="0"
          aria-label="Byte value"
        />

        <div className="tb-v2-grid-2">
          <div>
            <label className="tb-v2-tool-label" style={{ display: 'block', marginBottom: 6 }}>
              From
            </label>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value as Unit)}
              className="tb-v2-select"
              aria-label="Source unit"
            >
              {UNITS.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="tb-v2-tool-label" style={{ display: 'block', marginBottom: 6 }}>
              Highlight
            </label>
            <select
              value={highlight}
              onChange={(e) => setHighlight(e.target.value as Unit)}
              className="tb-v2-select"
              aria-label="Highlighted unit"
            >
              {UNITS.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">All units</span>
      </div>
      <div className="tb-v2-tool-output-body">
        {!results ? (
          <p className="tb-v2-empty">Enter a value or use Example.</p>
        ) : (
          <div className="tb-v2-grid-3">
            {UNITS.map((unit) => (
              <div
                key={unit}
                className="p-3 rounded-lg text-center"
                style={
                  unit === highlight
                    ? { background: 'color-mix(in srgb, var(--red) 12%, transparent)', outline: '1px solid var(--red)' }
                    : { background: 'var(--surface-2)' }
                }
              >
                <div className="text-xs" style={{ color: 'var(--tb-text-secondary)' }}>
                  {unit}
                </div>
                <div className="text-sm font-semibold break-all">{results[unit]}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
