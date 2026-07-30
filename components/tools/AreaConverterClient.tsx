'use client';

import { useState } from 'react';

type AreaUnit = 'm2' | 'ft2' | 'ac' | 'ha' | 'km2' | 'mi2';

const UNIT_ICONS: Record<AreaUnit, string> = {
  m2: '📐',
  ft2: '📏',
  ac: '🌾',
  ha: '🏡',
  km2: '🗺️',
  mi2: '🌍',
};

const unitInfo: Record<AreaUnit, { label: string; toSqMeters: number }> = {
  m2: { label: 'Square Meters (m²)', toSqMeters: 1 },
  ft2: { label: 'Square Feet (ft²)', toSqMeters: 0.092903 },
  ac: { label: 'Acres (ac)', toSqMeters: 4046.8564224 },
  ha: { label: 'Hectares (ha)', toSqMeters: 10000 },
  km2: { label: 'Square Kilometers (km²)', toSqMeters: 1000000 },
  mi2: { label: 'Square Miles (mi²)', toSqMeters: 2589988.110336 },
};

export default function AreaConverterClient() {
  const [inputValue, setInputValue] = useState('1');
  const [fromUnit, setFromUnit] = useState<AreaUnit>('m2');
  const [toUnit, setToUnit] = useState<AreaUnit>('ft2');
  const [copied, setCopied] = useState(false);

  const convert = (): number => {
    const value = parseFloat(inputValue) || 0;
    return (value * unitInfo[fromUnit].toSqMeters) / unitInfo[toUnit].toSqMeters;
  };

  const formatResult = (value: number): string => {
    if (Math.abs(value) < 0.0001 && value !== 0) return value.toExponential(6);
    if (Math.abs(value) >= 10000000) return value.toExponential(6);
    return value.toLocaleString(undefined, { maximumFractionDigits: 6 });
  };

  const swap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setInputValue(formatResult(convert()));
  };

  const copy = () => {
    const result = convert();
    const fromLabel = unitInfo[fromUnit].label.split(' ')[0];
    const toLabel = unitInfo[toUnit].label.split(' ')[0];
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
            onChange={(e) => setFromUnit(e.target.value as AreaUnit)}
            className="tb-v2-input"
          >
            {Object.entries(unitInfo).map(([value, info]) => (
              <option key={value} value={value}>{UNIT_ICONS[value as AreaUnit]} {info.label}</option>
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
            onChange={(e) => setToUnit(e.target.value as AreaUnit)}
            className="tb-v2-input"
          >
            {Object.entries(unitInfo).map(([value, info]) => (
              <option key={value} value={value}>{UNIT_ICONS[value as AreaUnit]} {info.label}</option>
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
          <strong>{inputValue}</strong> {unitInfo[fromUnit].label.split(' ')[0]}
          {' = '}
          <strong className="text-indigo-600 dark:text-indigo-400">{formatResult(convert())}</strong>
          {' '}{unitInfo[toUnit].label.split(' ')[0]}
        </span>
      </div>

      {/* Quick reference */}
      <div>
        <label className="tb-v2-tool-label">Quick Reference</label>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">1 m² = 10.764 ft²</div>
          <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">1 acre = 4,047 m²</div>
          <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">1 hectare = 2.471 acres</div>
          <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">1 km² = 247.1 acres</div>
        </div>
      </div>
    </div>
  );
}
