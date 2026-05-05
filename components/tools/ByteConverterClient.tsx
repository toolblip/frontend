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

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Enter a byte value</span>
      </div>

      <div className="tb-v2-form-group">
        <label className="tb-v2-label">Value</label>
        <input
          type="number"
          value={value}
          onChange={(e) => handleValueChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && convert()}
          placeholder="Enter numeric value"
          className="tb-v2-tool-input"
          min="0"
          aria-label="Byte value"
        />
      </div>

      <div className="tb-v2-grid-2">
        <div className="tb-v2-form-group">
          <label className="tb-v2-label">From</label>
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="tb-v2-tool-select"
            aria-label="Source unit"
          >
            {units.map(unit => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
        </div>

        <div className="tb-v2-form-group">
          <label className="tb-v2-label">To</label>
          <select
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            className="tb-v2-tool-select"
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
        className="tb-v2-btn"
        disabled={!value}
      >
        Convert
      </button>

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
                  className={`tb-v2-card ${unit === toUnit ? 'tb-v2-card-active' : ''}`}
                >
                  <span className="tb-v2-card-label">{unit}</span>
                  <span className="tb-v2-card-value">{result}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
