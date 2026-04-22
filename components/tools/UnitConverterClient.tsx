'use client';

import { useState } from 'react';

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

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(['length', 'weight', 'temperature'] as Category[]).map(cat => (
          <button
            key={cat}
            onClick={() => { setCategory(cat); setSelected(0); }}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              category === cat
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {convList.map((conv, i) => (
          <button
            key={i}
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
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">{current.from}</label>
          <input
            type="number"
            value={value}
            onChange={e => setValue(e.target.value)}
            className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 text-lg focus:outline-none focus:border-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">{current.to}</label>
          <div className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 text-lg font-medium">
            {isNaN(result) ? result.toFixed(4) : result.toFixed(6).replace(/\.?0+$/, '')}
          </div>
        </div>
      </div>
    </div>
  );
}
