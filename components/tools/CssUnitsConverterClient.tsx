'use client';

import { useState, useMemo } from 'react';

const UNITS = ['px', 'rem', 'em', 'pt', 'pc', 'in', 'cm', 'mm'] as const;
type Unit = typeof UNITS[number];

function toPx(value: number, unit: Unit, base: number): number {
  switch (unit) {
    case 'px': return value;
    case 'rem': return value * base;
    case 'em': return value * base;
    case 'pt': return value * (96 / 72);
    case 'pc': return value * 16;
    case 'in': return value * 96;
    case 'cm': return value * (96 / 2.54);
    case 'mm': return value * (96 / 25.4);
  }
}

function fromPx(px: number, unit: Unit, base: number): number {
  switch (unit) {
    case 'px': return px;
    case 'rem': return px / base;
    case 'em': return px / base;
    case 'pt': return px * (72 / 96);
    case 'pc': return px / 16;
    case 'in': return px / 96;
    case 'cm': return px * (2.54 / 96);
    case 'mm': return px * (25.4 / 96);
  }
}

function roundClean(n: number): string {
  return (Math.round(n * 10000) / 10000).toString();
}

export default function CssUnitsConverterClient() {
  const [value, setValue] = useState('16');
  const [fromUnit, setFromUnit] = useState<Unit>('px');
  const [baseFontSize, setBaseFontSize] = useState('16');

  const numValue = parseFloat(value) || 0;
  const base = parseFloat(baseFontSize) || 16;

  const results = useMemo(() => {
    const px = toPx(numValue, fromUnit, base);
    return UNITS.map(u => ({ unit: u, value: roundClean(fromPx(px, u, base)) }));
  }, [numValue, fromUnit, base]);

  return (
    <div className="flex flex-col gap-5">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Value to Convert</span>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1">
          <label className="tb-v2-tool-label">Value</label>
          <input
            type="number"
            value={value}
            onChange={e => setValue(e.target.value)}
            className="tb-v2-input"
            style={{ width: 120 }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="tb-v2-tool-label">Unit</label>
          <select value={fromUnit} onChange={e => setFromUnit(e.target.value as Unit)} className="tb-v2-input">
            {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="tb-v2-tool-label">Base Font Size (for em/rem)</label>
          <input
            type="number"
            value={baseFontSize}
            onChange={e => setBaseFontSize(e.target.value)}
            className="tb-v2-input"
            style={{ width: 120 }}
          />
        </div>
      </div>

      <div>
        <div className="tb-v2-tool-label" style={{ marginBottom: 8 }}>Conversions</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {results.map(r => (
            <div key={r.unit} className="bg-gray-100 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-500 uppercase">{r.unit}</div>
              <div className="text-lg font-medium" style={{ fontFamily: 'var(--f-mono)' }}>{r.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
