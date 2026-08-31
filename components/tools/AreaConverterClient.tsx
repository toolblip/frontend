'use client';

import { useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

type AreaUnit = 'm2' | 'ft2' | 'ac' | 'ha' | 'km2' | 'mi2';

const unitInfo: Record<AreaUnit, { label: string; short: string; toSqMeters: number }> = {
  m2: { label: 'Square Meters (m²)', short: 'm²', toSqMeters: 1 },
  ft2: { label: 'Square Feet (ft²)', short: 'ft²', toSqMeters: 0.092903 },
  ac: { label: 'Acres (ac)', short: 'ac', toSqMeters: 4046.8564224 },
  ha: { label: 'Hectares (ha)', short: 'ha', toSqMeters: 10000 },
  km2: { label: 'Square Kilometers (km²)', short: 'km²', toSqMeters: 1000000 },
  mi2: { label: 'Square Miles (mi²)', short: 'mi²', toSqMeters: 2589988.110336 },
};

export default function AreaConverterClient() {
  const [inputValue, setInputValue] = useState('');
  const [fromUnit, setFromUnit] = useState<AreaUnit>('m2');
  const [toUnit, setToUnit] = useState<AreaUnit>('ft2');
  const [copied, setCopied] = useState(false);

  const convert = (value = parseFloat(inputValue) || 0, from = fromUnit, to = toUnit): number =>
    (value * unitInfo[from].toSqMeters) / unitInfo[to].toSqMeters;

  const formatResult = (value: number): string => {
    if (Math.abs(value) < 0.0001 && value !== 0) return value.toExponential(6);
    if (Math.abs(value) >= 10000000) return value.toExponential(6);
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
      .writeText(`${inputValue} ${unitInfo[fromUnit].short} = ${formatResult(result)} ${unitInfo[toUnit].short}`)
      .catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head" style={{ borderBottom: '1px solid var(--line)' }}>
        <span className="tb-v2-tool-label">Area</span>
        <ToolExampleClearActions
          exampleCount={1}
          onExample={() => {
            setInputValue('1');
            setFromUnit('m2');
            setToUnit('ft2');
          }}
          onClear={() => {
            setInputValue('');
            setFromUnit('m2');
            setToUnit('ft2');
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
              aria-label="Area value"
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value as AreaUnit)}
              className="tb-v2-input"
              aria-label="From area unit"
            >
              {Object.entries(unitInfo).map(([value, info]) => (
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
              onChange={(e) => setToUnit(e.target.value as AreaUnit)}
              className="tb-v2-input"
              aria-label="To area unit"
            >
              {Object.entries(unitInfo).map(([value, info]) => (
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
          <p className="tb-v2-empty">Enter an area or use Example.</p>
        ) : (
          <span style={{ fontSize: 16 }}>
            <strong>{inputValue}</strong> {unitInfo[fromUnit].short}
            {' = '}
            <strong style={{ color: 'var(--red)' }}>{formatResult(result)}</strong> {unitInfo[toUnit].short}
          </span>
        )}
      </div>
    </div>
  );
}
