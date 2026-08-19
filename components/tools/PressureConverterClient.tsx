'use client';

import { useState } from 'react';

type PressureUnit = 'pa' | 'bar' | 'psi' | 'atm' | 'mmhg';

const unitLabels: Record<PressureUnit, string> = {
  pa: 'Pascals (Pa)',
  bar: 'Bar (bar)',
  psi: 'PSI (lb/in²)',
  atm: 'Atmospheres (atm)',
  mmhg: 'mmHg (Torr)',
};

// Value of 1 unit expressed in pascals (base unit)
const toPascals: Record<PressureUnit, number> = {
  pa: 1,
  bar: 100000,
  psi: 6894.757293168,
  atm: 101325,
  mmhg: 133.322387415,
};

export default function PressureConverterClient() {
  const [inputValue, setInputValue] = useState('1');
  const [fromUnit, setFromUnit] = useState<PressureUnit>('atm');
  const [toUnit, setToUnit] = useState<PressureUnit>('pa');
  const [copied, setCopied] = useState(false);

  const convert = (): number => {
    const value = parseFloat(inputValue) || 0;
    const pascals = value * toPascals[fromUnit];
    return pascals / toPascals[toUnit];
  };

  const formatResult = (value: number): string => {
    if (value !== 0 && (Math.abs(value) < 0.0001 || Math.abs(value) >= 1e9)) {
      return value.toExponential(6);
    }
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
            onChange={(e) => setFromUnit(e.target.value as PressureUnit)}
            className="tb-v2-input"
          >
            {Object.entries(unitLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
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
            onChange={(e) => setToUnit(e.target.value as PressureUnit)}
            className="tb-v2-input"
          >
            {Object.entries(unitLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
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
          <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">1 atm = 101,325 Pa</div>
          <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">1 atm = 1.01325 bar</div>
          <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">1 atm = 14.6959 PSI</div>
          <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">1 atm = 760 mmHg</div>
        </div>
      </div>
    </div>
  );
}
