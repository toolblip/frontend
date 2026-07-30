'use client';

import { useState } from 'react';

const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
const factors: Record<string, number> = {
  Bytes: 1,
  KB: 1024,
  MB: 1024 * 1024,
  GB: 1024 * 1024 * 1024,
  TB: 1024 * 1024 * 1024 * 1024,
  PB: 1024 * 1024 * 1024 * 1024 * 1024,
};

export default function ByteConverterClient() {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('Bytes');
  const [toUnit, setToUnit] = useState('MB');
  const [results, setResults] = useState<Record<string, string>>({});

  const convert = () => {
    const num = parseFloat(value);
    if (isNaN(num) || num < 0) {
      setResults({});
      return;
    }

    const fromFactor = factors[fromUnit];
    const bytes = num * fromFactor;

    const converted: Record<string, string> = {};
    units.forEach(unit => {
      const result = bytes / factors[unit];
      if (result >= 0.000001 || result === 0) {
        converted[unit] = result.toLocaleString('en-US', {
          maximumFractionDigits: 6,
          minimumFractionDigits: 0,
        });
      }
    });

    setResults(converted);
  };

  const handleValueChange = (val: string) => {
    setValue(val);
    if (val === '') {
      setResults({});
    }
  };

  const loadExample = () => {
    setValue('1048576');
    setFromUnit('Bytes');
    setToUnit('MB');
    setResults({});
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Byte value</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>

      <input
        type="number"
        value={value}
        onChange={(e) => handleValueChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && convert()}
        placeholder="Enter numeric value"
        className="tb-v2-input"
        min="0"
        aria-label="Byte value"
      />

      <div className="tb-v2-grid-2">
        <div>
          <label className="tb-v2-tool-label" style={{ display: 'block', marginBottom: 6 }}>From</label>
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="tb-v2-select"
            aria-label="Source unit"
          >
            {units.map(unit => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="tb-v2-tool-label" style={{ display: 'block', marginBottom: 6 }}>To (highlighted)</label>
          <select
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            className="tb-v2-select"
            aria-label="Target unit"
          >
            {units.map(unit => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="button"
        onClick={convert}
        className="tb-v2-btn tb-v2-btn-primary"
        disabled={!value}
      >
        Convert
      </button>

      {Object.keys(results).length === 0 && (
        <p className="tb-v2-empty">
          Enter a value above to see it converted across every byte unit at once.
        </p>
      )}

      {Object.keys(results).length > 0 && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Conversion Results</span>
          </div>
          <div className="tb-v2-tool-output-body">
            <div className="tb-v2-grid-3">
              {Object.entries(results).map(([unit, result]) => (
                <div
                  key={unit}
                  className={`p-3 rounded-lg text-center ${
                    unit === toUnit
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 ring-1 ring-indigo-400'
                      : 'bg-gray-50 dark:bg-gray-800'
                  }`}
                >
                  <div className="text-xs text-gray-500 dark:text-gray-400">{unit}</div>
                  <div className="text-sm font-semibold text-gray-800 dark:text-gray-200 break-all">{result}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
