'use client';

import { useState } from 'react';

type AreaUnit = 'm2' | 'ft2' | 'ac' | 'ha' | 'km2' | 'mi2';

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

  const convert = (): number => {
    const value = parseFloat(inputValue) || 0;
    const sqMeters = value * unitInfo[fromUnit].toSqMeters;
    return sqMeters / unitInfo[toUnit].toSqMeters;
  };

  const formatResult = (value: number): string => {
    if (Math.abs(value) < 0.0001 && value !== 0) {
      return value.toExponential(6);
    }
    if (Math.abs(value) >= 10000000) {
      return value.toExponential(6);
    }
    return value.toLocaleString(undefined, { maximumFractionDigits: 6 });
  };

  const conversions = [
    { from: '1 m²', to: '10.764 ft²', result: '10.7639' },
    { from: '1 acre', to: '4,047 m²', result: '4046.86' },
    { from: '1 hectare', to: '2.471 acres', result: '2.47105' },
    { from: '1 km²', to: '247.1 acres', result: '247.105' },
    { from: '1 mi²', to: '640 acres', result: '640' },
    { from: '1 ft²', to: '929.03 cm²', result: '929.03' },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
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
            onChange={(e) => setFromUnit(e.target.value as AreaUnit)}
            className="tb-v2-input"
          >
            {Object.entries(unitInfo).map(([value, info]) => (
              <option key={value} value={value}>{info.label}</option>
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
          onChange={(e) => setToUnit(e.target.value as AreaUnit)}
          className="tb-v2-input"
        >
          {Object.entries(unitInfo).map(([value, info]) => (
            <option key={value} value={value}>{info.label}</option>
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
            {unitInfo[toUnit].label}
          </p>
        </div>
      </div>

      <div className="tb-v2-box p-4 text-center">
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          <span className="font-medium">{parseFloat(inputValue) || 0}</span>
          {' '}{unitInfo[fromUnit].label.split(' ')[0]}
          {' = '}
          <span className="font-medium">{formatResult(convert())}</span>
          {' '}{unitInfo[toUnit].label.split(' ')[0]}
        </p>
      </div>

      <div>
        <label className="tb-v2-tool-label">Quick Conversions</label>
        <div className="space-y-2 mt-2">
          {conversions.map((conv, i) => (
            <div key={i} className="tb-v2-box p-3 text-sm flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">{conv.from}</span>
              <span className="text-gray-400 dark:text-gray-600">→</span>
              <span className="text-gray-700 dark:text-gray-300 font-medium">{conv.to}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="tb-v2-box p-4">
        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Common Land Area Reference</h4>
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <li>• American football field: ~5,350 m² (1.32 acres)</li>
          <li>• Typical house lot: ~800-1,000 m² (0.2-0.25 acres)</li>
          <li>• Central Park, NYC: ~3.4 km² (840 acres)</li>
          <li>• Manhattan: ~59 km² (14,500 acres)</li>
        </ul>
      </div>
    </div>
  );
}
