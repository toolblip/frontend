'use client';

import { useState, useMemo } from 'react';

const UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'] as const;
type Unit = (typeof UNITS)[number];

function toBytes(value: number, unit: Unit, base: number): number {
  const power = UNITS.indexOf(unit);
  return value * Math.pow(base, power);
}

function fromBytes(bytes: number, unit: Unit, base: number): number {
  const power = UNITS.indexOf(unit);
  return bytes / Math.pow(base, power);
}

function roundClean(value: number): string {
  if (!isFinite(value)) return '0';
  const rounded = Math.round(value * 1e6) / 1e6;
  return rounded.toLocaleString('en-US', { maximumFractionDigits: 6 });
}

export default function DataSizeConverterClient() {
  const [value, setValue] = useState('1');
  const [unit, setUnit] = useState<Unit>('GB');
  const [binary, setBinary] = useState(true);
  const [copied, setCopied] = useState<Unit | null>(null);

  const base = binary ? 1024 : 1000;
  const numValue = parseFloat(value) || 0;
  const bytes = useMemo(() => toBytes(numValue, unit, base), [numValue, unit, base]);

  const loadExample = () => {
    setValue('1');
    setUnit('GB');
    setBinary(true);
  };

  const copy = (u: Unit, text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(u);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Value</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">Load Example</button>
      </div>
      <div style={{ padding: 20 }} className="flex flex-col gap-4">
        <div className="flex gap-3">
          <input
            type="number"
            value={value}
            onChange={e => setValue(e.target.value)}
            className="tb-v2-input text-xl font-mono"
            style={{ flex: 1 }}
          />
          <select value={unit} onChange={e => setUnit(e.target.value as Unit)} className="tb-v2-input" style={{ maxWidth: 120 }}>
            {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>

        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2">
            <input type="radio" checked={binary} onChange={() => setBinary(true)} />
            <span className="tb-v2-tool-label" style={{ margin: 0 }}>Binary (1 KB = 1024 B)</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" checked={!binary} onChange={() => setBinary(false)} />
            <span className="tb-v2-tool-label" style={{ margin: 0 }}>Decimal (1 KB = 1000 B)</span>
          </label>
        </div>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">All Units</span>
      </div>
      <div className="tb-v2-tool-output-body">
        <div className="tb-v2-stats-grid" style={{ padding: 0, border: 0, background: 'transparent' }}>
          {UNITS.map(u => {
            const converted = roundClean(fromBytes(bytes, u, base));
            return (
              <div key={u} className="tb-v2-stat-pill" style={{ cursor: 'pointer' }} onClick={() => copy(u, converted)}>
                <div className="tb-v2-stat-pill-val" style={{ fontSize: 16 }}>{copied === u ? 'Copied' : converted}</div>
                <div className="tb-v2-stat-pill-lbl">{u}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
