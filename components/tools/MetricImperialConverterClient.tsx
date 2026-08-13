'use client';

import { useState } from 'react';

type Category = 'length' | 'weight' | 'temperature';

type LengthUnit = 'mm' | 'cm' | 'm' | 'km' | 'in' | 'ft' | 'yd' | 'mi';
type WeightUnit = 'g' | 'kg' | 'oz' | 'lb';
type TemperatureUnit = 'c' | 'f' | 'k';

const categoryLabels: Record<Category, string> = {
  length: 'Length',
  weight: 'Weight',
  temperature: 'Temperature',
};

const lengthLabels: Record<LengthUnit, string> = {
  mm: 'Millimeters (mm)',
  cm: 'Centimeters (cm)',
  m: 'Meters (m)',
  km: 'Kilometers (km)',
  in: 'Inches (in)',
  ft: 'Feet (ft)',
  yd: 'Yards (yd)',
  mi: 'Miles (mi)',
};

// Value of 1 unit expressed in meters (base unit)
const lengthToMeters: Record<LengthUnit, number> = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  km: 1000,
  in: 0.0254,
  ft: 0.3048,
  yd: 0.9144,
  mi: 1609.344,
};

const weightLabels: Record<WeightUnit, string> = {
  g: 'Grams (g)',
  kg: 'Kilograms (kg)',
  oz: 'Ounces (oz)',
  lb: 'Pounds (lb)',
};

// Value of 1 unit expressed in grams (base unit)
const weightToGrams: Record<WeightUnit, number> = {
  g: 1,
  kg: 1000,
  oz: 28.349523125,
  lb: 453.59237,
};

const temperatureLabels: Record<TemperatureUnit, string> = {
  c: 'Celsius (°C)',
  f: 'Fahrenheit (°F)',
  k: 'Kelvin (K)',
};

const toCelsius = (value: number, unit: TemperatureUnit): number => {
  if (unit === 'c') return value;
  if (unit === 'f') return (value - 32) * (5 / 9);
  return value - 273.15;
};

const fromCelsius = (celsius: number, unit: TemperatureUnit): number => {
  if (unit === 'c') return celsius;
  if (unit === 'f') return celsius * (9 / 5) + 32;
  return celsius + 273.15;
};

const unitsByCategory: Record<Category, string[]> = {
  length: Object.keys(lengthLabels),
  weight: Object.keys(weightLabels),
  temperature: Object.keys(temperatureLabels),
};

const labelsByCategory: Record<Category, Record<string, string>> = {
  length: lengthLabels,
  weight: weightLabels,
  temperature: temperatureLabels,
};

const defaultUnits: Record<Category, [string, string]> = {
  length: ['m', 'ft'],
  weight: ['kg', 'lb'],
  temperature: ['c', 'f'],
};

export default function MetricImperialConverterClient() {
  const [category, setCategory] = useState<Category>('length');
  const [inputValue, setInputValue] = useState('1');
  const [fromUnit, setFromUnit] = useState<string>(defaultUnits.length[0]);
  const [toUnit, setToUnit] = useState<string>(defaultUnits.length[1]);
  const [copied, setCopied] = useState(false);

  const changeCategory = (next: Category) => {
    setCategory(next);
    setFromUnit(defaultUnits[next][0]);
    setToUnit(defaultUnits[next][1]);
  };

  const convert = (): number => {
    const value = parseFloat(inputValue) || 0;
    if (category === 'temperature') {
      const celsius = toCelsius(value, fromUnit as TemperatureUnit);
      return fromCelsius(celsius, toUnit as TemperatureUnit);
    }
    if (category === 'length') {
      const meters = value * lengthToMeters[fromUnit as LengthUnit];
      return meters / lengthToMeters[toUnit as LengthUnit];
    }
    const grams = value * weightToGrams[fromUnit as WeightUnit];
    return grams / weightToGrams[toUnit as WeightUnit];
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
    const fromLabel = labelsByCategory[category][fromUnit].split(' ')[0];
    const toLabel = labelsByCategory[category][toUnit].split(' ')[0];
    navigator.clipboard.writeText(`${inputValue} ${fromLabel} = ${formatResult(result)} ${toLabel}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const labels = labelsByCategory[category];
  const units = unitsByCategory[category];

  return (
    <div>
      {/* Category tabs */}
      <div className="flex gap-2 mb-4">
        {(Object.keys(categoryLabels) as Category[]).map((cat) => (
          <button
            key={cat}
            onClick={() => changeCategory(cat)}
            className={
              cat === category
                ? 'px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium'
                : 'px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700'
            }
          >
            {categoryLabels[cat]}
          </button>
        ))}
      </div>

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
            onChange={(e) => setFromUnit(e.target.value)}
            className="tb-v2-input"
          >
            {units.map((value) => (
              <option key={value} value={value}>{labels[value]}</option>
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
            onChange={(e) => setToUnit(e.target.value)}
            className="tb-v2-input"
          >
            {units.map((value) => (
              <option key={value} value={value}>{labels[value]}</option>
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
          <strong>{inputValue}</strong> {labels[fromUnit].split(' ')[0]}
          {' = '}
          <strong className="text-indigo-600 dark:text-indigo-400">{formatResult(convert())}</strong>
          {' '}{labels[toUnit].split(' ')[0]}
        </span>
      </div>

      {/* Quick reference */}
      <div>
        <label className="tb-v2-tool-label">Quick Reference</label>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {category === 'length' && (
            <>
              <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">1 m = 3.2808 ft</div>
              <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">1 in = 2.54 cm</div>
              <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">1 mi = 1.60934 km</div>
              <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">1 yd = 0.9144 m</div>
            </>
          )}
          {category === 'weight' && (
            <>
              <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">1 kg = 2.20462 lb</div>
              <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">1 lb = 0.453592 kg</div>
              <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">1 oz = 28.3495 g</div>
              <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">1 kg = 1000 g</div>
            </>
          )}
          {category === 'temperature' && (
            <>
              <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">°F = °C × 9/5 + 32</div>
              <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">°C = (°F − 32) × 5/9</div>
              <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">K = °C + 273.15</div>
              <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">0°C = 32°F = 273.15K</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
