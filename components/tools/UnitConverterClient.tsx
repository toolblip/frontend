'use client';

import { useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

type Category = 'length' | 'weight' | 'temperature';

const conversions: Record<Category, { from: string; to: string; factor: number }[]> = {
  length: [
    { from: 'Meters', to: 'Feet', factor: 3.28084 },
    { from: 'Kilometers', to: 'Miles', factor: 0.621371 },
    { from: 'Centimeters', to: 'Inches', factor: 0.393701 },
    { from: 'Meters', to: 'Yards', factor: 1.09361 },
    { from: 'Feet', to: 'Meters', factor: 0.3048 },
  ],
  weight: [
    { from: 'Kilograms', to: 'Pounds', factor: 2.20462 },
    { from: 'Pounds', to: 'Kilograms', factor: 0.453592 },
    { from: 'Grams', to: 'Ounces', factor: 0.035274 },
    { from: 'Kilograms', to: 'Stone', factor: 0.157473 },
  ],
  temperature: [
    { from: 'Celsius', to: 'Fahrenheit', factor: NaN },
    { from: 'Fahrenheit', to: 'Celsius', factor: NaN },
    { from: 'Celsius', to: 'Kelvin', factor: NaN },
  ],
};

function convert(value: number, conv: { from: string; to: string; factor: number }): number {
  if (conv.from === 'Celsius' && conv.to === 'Fahrenheit') return value * 9 / 5 + 32;
  if (conv.from === 'Fahrenheit' && conv.to === 'Celsius') return (value - 32) * 5 / 9;
  if (conv.from === 'Celsius' && conv.to === 'Kelvin') return value + 273.15;
  return value * conv.factor;
}

export default function UnitConverterClient() {
  const [category, setCategory] = useState<Category>('length');
  const [value, setValue] = useState('1');
  const [selected, setSelected] = useState(0);

  const convList = conversions[category];
  const current = convList[selected];
  const result = convert(parseFloat(value) || 0, current);

  const loadExample = () => {
    setCategory('length');
    setSelected(0);
    setValue('100');
  };

  const clearAll = () => {
    setCategory('length');
    setSelected(0);
    setValue('');
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head" style={{ borderBottom: '1px solid var(--line)' }}>
        <span className="tb-v2-tool-label">Unit Converter</span>
        <ToolExampleClearActions
          exampleCount={1}
          onExample={loadExample}
          onClear={clearAll}
          canClear={value.length > 0}
        />
      </div>
      <div className="tb-v2-section" style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '16px 20px' }}>
        <div className="tb-v2-mode-tabs">
          {(['length', 'weight', 'temperature'] as Category[]).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setCategory(cat);
                setSelected(0);
              }}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                category === cat
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
        <div className="tb-v2-mode-tabs">
          {convList.map((conv, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelected(i)}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                selected === i
                  ? 'bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {conv.from} → {conv.to}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div>
            <label className="tb-v2-tool-label" style={{ marginBottom: 6 }}>
              {current.from}
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="tb-v2-input w-full text-lg"
              placeholder="Enter a value"
            />
          </div>
          <div>
            <label className="tb-v2-tool-label" style={{ marginBottom: 6 }}>
              {current.to}
            </label>
            <div className="tb-v2-input w-full text-lg font-medium" style={{ background: 'var(--bg-2)' }}>
              {value.trim()
                ? isNaN(result)
                  ? result.toFixed(4)
                  : result.toFixed(6).replace(/\.?0+$/, '')
                : '—'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
