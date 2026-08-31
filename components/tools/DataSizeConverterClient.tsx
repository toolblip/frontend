'use client';

import { useState, useMemo } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

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
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState<Unit>('GB');
  const [binary, setBinary] = useState(true);
  const [copied, setCopied] = useState<Unit | null>(null);

  const base = binary ? 1024 : 1000;
  const numValue = parseFloat(value);
  const bytes = useMemo(() => {
    if (value.trim() === '' || isNaN(numValue)) return null;
    return toBytes(numValue, unit, base);
  }, [numValue, unit, base, value]);

  const copy = (u: Unit, text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(u);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Data size</span>
        <ToolExampleClearActions
          exampleCount={1}
          onExample={() => {
            setValue('1');
            setUnit('GB');
            setBinary(true);
          }}
          onClear={() => {
            setValue('');
            setUnit('GB');
            setBinary(true);
          }}
          canClear={value.length > 0}
        />
      </div>
      <div style={{ padding: 20 }} className="flex flex-col gap-4">
        <div className="flex gap-3">
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="tb-v2-input text-xl font-mono"
            style={{ flex: 1 }}
            placeholder="1"
            aria-label="Data size value"
          />
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as Unit)}
            className="tb-v2-input"
            style={{ maxWidth: 120 }}
            aria-label="Data size unit"
          >
            {UNITS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>

        <div className="tb-v2-mode-tabs">
          <button
            type="button"
            onClick={() => setBinary(true)}
            className={`tb-v2-mode-tab ${binary ? 'on' : ''}`}
          >
            Binary (1024)
          </button>
          <button
            type="button"
            onClick={() => setBinary(false)}
            className={`tb-v2-mode-tab ${!binary ? 'on' : ''}`}
          >
            Decimal (1000)
          </button>
        </div>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">All units</span>
      </div>
      <div className="tb-v2-tool-output-body">
        {bytes === null ? (
          <p className="tb-v2-empty">Enter a size or use Example.</p>
        ) : (
          <div className="tb-v2-stats-grid" style={{ padding: 0, border: 0, background: 'transparent' }}>
            {UNITS.map((u) => {
              const converted = roundClean(fromBytes(bytes, u, base));
              return (
                <button
                  key={u}
                  type="button"
                  className="tb-v2-stat-pill"
                  style={{ cursor: 'pointer' }}
                  onClick={() => copy(u, converted)}
                >
                  <div className="tb-v2-stat-pill-val" style={{ fontSize: 16 }}>
                    {copied === u ? 'Copied' : converted}
                  </div>
                  <div className="tb-v2-stat-pill-lbl">{u}</div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
