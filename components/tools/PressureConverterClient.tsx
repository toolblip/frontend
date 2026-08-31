'use client';

import { useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

type PressureUnit = 'pa' | 'bar' | 'psi' | 'atm' | 'mmhg';

const unitLabels: Record<PressureUnit, { label: string; short: string }> = {
  pa: { label: 'Pascals (Pa)', short: 'Pa' },
  bar: { label: 'Bar (bar)', short: 'bar' },
  psi: { label: 'PSI (lb/in²)', short: 'PSI' },
  atm: { label: 'Atmospheres (atm)', short: 'atm' },
  mmhg: { label: 'mmHg (Torr)', short: 'mmHg' },
};

const toPascals: Record<PressureUnit, number> = {
  pa: 1,
  bar: 100000,
  psi: 6894.757293168,
  atm: 101325,
  mmhg: 133.322387415,
};

export default function PressureConverterClient() {
  const [inputValue, setInputValue] = useState('');
  const [fromUnit, setFromUnit] = useState<PressureUnit>('atm');
  const [toUnit, setToUnit] = useState<PressureUnit>('pa');
  const [copied, setCopied] = useState(false);

  const convert = (value = parseFloat(inputValue) || 0, from = fromUnit, to = toUnit): number =>
    (value * toPascals[from]) / toPascals[to];

  const formatResult = (value: number): string => {
    if (value !== 0 && (Math.abs(value) < 0.0001 || Math.abs(value) >= 1e9)) {
      return value.toExponential(6);
    }
    return value.toLocaleString(undefined, { maximumFractionDigits: 6 });
  };

  const result = inputValue.trim() === '' || isNaN(parseFloat(inputValue)) ? null : convert();

  const swap = () => {
    const next = result === null ? inputValue : formatResult(result);
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setInputValue(next);
  };

  const copy = () => {
    if (result === null) return;
    navigator.clipboard
      .writeText(
        `${inputValue} ${unitLabels[fromUnit].short} = ${formatResult(result)} ${unitLabels[toUnit].short}`
      )
      .catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head" style={{ borderBottom: '1px solid var(--line)' }}>
        <span className="tb-v2-tool-label">Pressure</span>
        <ToolExampleClearActions
          exampleCount={1}
          onExample={() => {
            setInputValue('1');
            setFromUnit('atm');
            setToUnit('pa');
          }}
          onClear={() => {
            setInputValue('');
            setFromUnit('atm');
            setToUnit('pa');
          }}
          canClear={inputValue.length > 0}
        />
      </div>

      <div style={{ padding: 20 }}>
        <div className="grid grid-cols-[1fr,auto,1fr] gap-3 items-end">
          <div>
            <label className="tb-v2-tool-label">From</label>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="tb-v2-input mb-2"
              placeholder="1"
              aria-label="Pressure value"
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value as PressureUnit)}
              className="tb-v2-input"
              aria-label="From pressure unit"
            >
              {Object.entries(unitLabels).map(([value, info]) => (
                <option key={value} value={value}>
                  {info.label}
                </option>
              ))}
            </select>
          </div>

          <button type="button" onClick={swap} className="tb-v2-mode-tab mb-1" title="Swap units">
            ⇄
          </button>

          <div>
            <label className="tb-v2-tool-label">To</label>
            <div
              className="tb-v2-input mb-2 text-center text-2xl font-bold"
              style={{ minHeight: 44, color: 'var(--red)' }}
            >
              {result === null ? '—' : formatResult(result)}
            </div>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value as PressureUnit)}
              className="tb-v2-input"
              aria-label="To pressure unit"
            >
              {Object.entries(unitLabels).map(([value, info]) => (
                <option key={value} value={value}>
                  {info.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Result</span>
        <button type="button" onClick={copy} disabled={result === null} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body" style={{ textAlign: 'center' }}>
        {result === null ? (
          <p className="tb-v2-empty">Enter a pressure or use Example.</p>
        ) : (
          <span style={{ fontSize: 16 }}>
            <strong>{inputValue}</strong> {unitLabels[fromUnit].short}
            {' = '}
            <strong style={{ color: 'var(--red)' }}>{formatResult(result)}</strong> {unitLabels[toUnit].short}
          </span>
        )}
      </div>
    </div>
  );
}
