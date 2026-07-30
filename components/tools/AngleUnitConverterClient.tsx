'use client';

import { useState } from 'react';

type AngleUnit = 'deg' | 'rad' | 'grad' | 'arcmin';

const UNIT_ICONS: Record<AngleUnit, string> = {
  deg: '📐',
  rad: '🔄',
  grad: '📊',
  arcmin: '🔍',
};

const unitLabels: Record<AngleUnit, string> = {
  deg: 'Degrees (°)',
  rad: 'Radians (rad)',
  grad: 'Gradians (grad)',
  arcmin: 'Arcminutes (′)',
};

const conversions: Record<AngleUnit, number> = {
  deg: 1,
  rad: 180 / Math.PI,
  grad: 0.9,
  arcmin: 1 / 60,
};

export default function AngleUnitConverterClient() {
  const [inputValue, setInputValue] = useState('45');
  const [fromUnit, setFromUnit] = useState<AngleUnit>('deg');
  const [toUnit, setToUnit] = useState<AngleUnit>('rad');
  const [copied, setCopied] = useState(false);

  const convert = (): number => {
    const value = parseFloat(inputValue) || 0;
    return (value * conversions[fromUnit]) / conversions[toUnit];
  };

  const formatResult = (value: number): string => {
    if (Math.abs(value) < 0.0001 && value !== 0) return value.toExponential(6);
    return value.toLocaleString(undefined, { maximumFractionDigits: 6 });
  };

  const swap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setInputValue(formatResult(convert()));
  };

  const copy = () => {
    const result = convert();
    const fromLabel = unitLabels[fromUnit].split(' ')[0];
    const toLabel = unitLabels[toUnit].split(' ')[0];
    navigator.clipboard.writeText(`${inputValue} ${fromLabel} = ${formatResult(result)} ${toLabel}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      {/* Converter */}
      <div className="grid grid-cols-[1fr,auto,1fr] gap-3 items-end">
        <div>
          <label className="tb-v2-tool-label">From</label>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="tb-v2-input mb-2"
          />
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value as AngleUnit)}
            className="tb-v2-input"
          >
            {Object.entries(unitLabels).map(([value, label]) => (
              <option key={value} value={value}>{UNIT_ICONS[value as AngleUnit]} {label}</option>
            ))}
          </select>
        </div>

        <button
          onClick={swap}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 mb-1"
          title="Swap units"
        >
          ⇄
        </button>

        <div>
          <label className="tb-v2-tool-label">To</label>
          <div className="tb-v2-input mb-2 text-center text-2xl font-bold text-indigo-600 dark:text-indigo-400" style={{ minHeight: 44 }}>
            {formatResult(convert())}
          </div>
          <select
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value as AngleUnit)}
            className="tb-v2-input"
          >
            {Object.entries(unitLabels).map(([value, label]) => (
              <option key={value} value={value}>{UNIT_ICONS[value as AngleUnit]} {label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary */}
      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Result</span>
        <button onClick={copy} className="tb-v2-copy-btn">
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-center">
        <span className="text-lg">
          <strong>{inputValue}</strong> {unitLabels[fromUnit].split(' ')[0]}
          {' = '}
          <strong className="text-indigo-600 dark:text-indigo-400">{formatResult(convert())}</strong>
          {' '}{unitLabels[toUnit].split(' ')[0]}
        </span>
      </div>

      {/* Quick reference */}
      <div>
        <label className="tb-v2-tool-label">Quick Reference</label>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">1° = π/180 rad</div>
          <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">1 rad ≈ 57.3°</div>
          <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">1° = 1.111 grad</div>
          <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">1° = 60 arcmin</div>
        </div>
      </div>
    </div>
  );
}
