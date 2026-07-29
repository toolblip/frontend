'use client';

import { useState } from 'react';

type AngleUnit = 'deg' | 'rad' | 'grad' | 'arcmin';

const unitLabels: Record<AngleUnit, string> = {
  deg: 'Degrees (°)',
  rad: 'Radians (rad)',
  grad: 'Gradians (grad)',
  arcmin: 'Arcminutes (′)',
};

const conversions: Record<AngleUnit, number> = {
  // Convert to degrees first
  deg: 1,
  rad: 180 / Math.PI,
  grad: 0.9,
  arcmin: 1 / 60,
};

export default function AngleUnitConverterClient() {
  const [inputValue, setInputValue] = useState('45');
  const [fromUnit, setFromUnit] = useState<AngleUnit>('deg');
  const [toUnit, setToUnit] = useState<AngleUnit>('rad');

  const convert = (): number => {
    const value = parseFloat(inputValue) || 0;
    // Convert to degrees first
    const degrees = value * conversions[fromUnit];
    // Convert from degrees to target
    return degrees / conversions[toUnit];
  };

  const formatResult = (value: number): string => {
    if (Math.abs(value) < 0.0001 && value !== 0) {
      return value.toExponential(6);
    }
    return value.toLocaleString(undefined, { maximumFractionDigits: 6 });
  };

  const commonConversions = [
    { from: { value: '180', unit: 'deg' as AngleUnit }, to: { value: 'π', unit: 'rad' as AngleUnit } },
    { from: { value: '90', unit: 'deg' as AngleUnit }, to: { value: '100', unit: 'grad' as AngleUnit } },
    { from: { value: '1', unit: 'deg' as AngleUnit }, to: { value: '60', unit: 'arcmin' as AngleUnit } },
    { from: { value: '2π', unit: 'rad' as AngleUnit }, to: { value: '360', unit: 'deg' as AngleUnit } },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-grid-2">
        <div>
          <label className="tb-v2-tool-label">Value</label>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="tb-v2-input"
            placeholder="Enter value"
          />
        </div>

        <div>
          <label className="tb-v2-tool-label">From</label>
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value as AngleUnit)}
            className="tb-v2-input"
          >
            {Object.entries(unitLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="text-4xl text-gray-400 dark:text-gray-600">↓</div>
      </div>

      <div>
        <label className="tb-v2-tool-label">To</label>
        <select
          value={toUnit}
          onChange={(e) => setToUnit(e.target.value as AngleUnit)}
          className="tb-v2-input"
        >
          {Object.entries(unitLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Result</span>
      </div>
      <div className="tb-v2-tool-output-body">
        <div className="text-center py-6">
          <span className="text-4xl font-bold text-gray-700 dark:text-gray-200">
            {formatResult(convert())}
          </span>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {unitLabels[toUnit]}
          </p>
        </div>
      </div>

      <div className="tb-v2-box p-4 text-center">
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          <span className="font-medium">{parseFloat(inputValue) || 0}</span>
          {' '}{unitLabels[fromUnit].split(' ')[0]}
          {' = '}
          <span className="font-medium">{formatResult(convert())}</span>
          {' '}{unitLabels[toUnit].split(' ')[0]}
        </p>
      </div>

      <div>
        <label className="tb-v2-tool-label">Common Conversions</label>
        <div className="space-y-2 mt-2">
          {commonConversions.map((conv, i) => (
            <div key={i} className="tb-v2-box p-3 text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                {conv.from.value} {conv.from.unit} → {conv.to.value} {conv.to.unit}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="tb-v2-box p-4">
        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Conversion Formulas</h4>
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 font-mono">
          <li>1° = π/180 rad ≈ 0.0174533 rad</li>
          <li>1° = 100/90 grad = 1.1111 grad</li>
          <li>1° = 60 arcminutes</li>
          <li>1 rad = 180/π° ≈ 57.2958°</li>
          <li>1 grad = 0.9°</li>
          <li>1 arcminute = 1/60°</li>
        </ul>
      </div>
    </div>
  );
}
