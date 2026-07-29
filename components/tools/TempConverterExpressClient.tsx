'use client';

import { useState, useCallback } from 'react';

export default function TempConverterExpressClient() {
  const [input, setInput] = useState('');
  const [fromUnit, setFromUnit] = useState<'C' | 'F' | 'K'>('F');
  const [results, setResults] = useState<{ unit: string; value: string; symbol: string }[]>([]);
  const [error, setError] = useState('');

  const convert = useCallback(() => {
    setError('');
    setResults([]);
    
    const val = parseFloat(input);
    if (isNaN(val)) {
      setError('Please enter a valid number');
      return;
    }

    let celsius: number;
    
    switch (fromUnit) {
      case 'C':
        celsius = val;
        break;
      case 'F':
        celsius = (val - 32) * 5 / 9;
        break;
      case 'K':
        celsius = val - 273.15;
        break;
    }

    const fahrenheit = celsius * 9 / 5 + 32;
    const kelvin = celsius + 273.15;

    setResults([
      { unit: 'Celsius', value: celsius.toFixed(4), symbol: '°C' },
      { unit: 'Fahrenheit', value: fahrenheit.toFixed(4), symbol: '°F' },
      { unit: 'Kelvin', value: kelvin.toFixed(4), symbol: 'K' },
    ]);
  }, [input, fromUnit]);

  const presets = [
    { label: 'Freezing', value: 32, unit: 'F' as const },
    { label: 'Boiling', value: 212, unit: 'F' as const },
    { label: 'Body', value: 98.6, unit: 'F' as const },
    { label: 'Room', value: 72, unit: 'F' as const },
    { label: 'Absolute Zero', value: -459.67, unit: 'F' as const },
  ];

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Temperature Converter</h1>
      
      <div className="flex gap-2 mb-4">
        {(['C', 'F', 'K'] as const).map(unit => (
          <button
            key={unit}
            onClick={() => setFromUnit(unit)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              fromUnit === unit
                ? 'bg-indigo-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            °{unit}
          </button>
        ))}
      </div>

      <div className="tb-v2-mode-tabs">
        <input
          type="number"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && convert()}
          placeholder="Enter temperature..."
          className="flex-1 p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 font-mono text-lg"
        />
        <button
          onClick={convert}
          className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 font-medium"
        >
          Convert
        </button>
      </div>

      <div className="tb-v2-mode-tabs">
        {presets.map(p => (
          <button
            key={p.label}
            onClick={() => {
              setInput(p.value.toString());
              setFromUnit(p.unit);
            }}
            className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {p.label} ({p.value}°{p.unit})
          </button>
        ))}
      </div>

      {error && (
        <div className="tb-v2-banner tb-v2-banner-err">
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-3">
          <label className="tb-v2-tool-label">Results</label>
          <div className="grid gap-3">
            {results.map(r => (
              <div key={r.unit} className="tb-v2-section" style={{padding:16,background:"var(--surface-2)"}}>
                <span className="text-gray-600 dark:text-gray-400">{r.unit}</span>
                <span className="text-xl font-mono font-semibold">{r.value} <span className="text-sm text-gray-500">{r.symbol}</span></span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}