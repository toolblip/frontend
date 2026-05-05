'use client';

import { useState } from 'react';

type Category = 'length' | 'weight' | 'temperature' | 'area' | 'volume' | 'speed';

const units: Record<Category, { value: string; label: string; factor: number }[]> = {
  length: [
    { value: 'm', label: 'Meters (m)', factor: 1 },
    { value: 'km', label: 'Kilometers (km)', factor: 1000 },
    { value: 'cm', label: 'Centimeters (cm)', factor: 0.01 },
    { value: 'mm', label: 'Millimeters (mm)', factor: 0.001 },
    { value: 'mi', label: 'Miles (mi)', factor: 1609.344 },
    { value: 'yd', label: 'Yards (yd)', factor: 0.9144 },
    { value: 'ft', label: 'Feet (ft)', factor: 0.3048 },
    { value: 'in', label: 'Inches (in)', factor: 0.0254 },
  ],
  weight: [
    { value: 'kg', label: 'Kilograms (kg)', factor: 1 },
    { value: 'g', label: 'Grams (g)', factor: 0.001 },
    { value: 'mg', label: 'Milligrams (mg)', factor: 0.000001 },
    { value: 'lb', label: 'Pounds (lb)', factor: 0.453592 },
    { value: 'oz', label: 'Ounces (oz)', factor: 0.0283495 },
    { value: 't', label: 'Metric Tons (t)', factor: 1000 },
  ],
  temperature: [
    { value: 'c', label: 'Celsius (°C)', factor: 1 },
    { value: 'f', label: 'Fahrenheit (°F)', factor: 1 },
    { value: 'k', label: 'Kelvin (K)', factor: 1 },
  ],
  area: [
    { value: 'm2', label: 'Square Meters (m²)', factor: 1 },
    { value: 'km2', label: 'Square Kilometers (km²)', factor: 1000000 },
    { value: 'cm2', label: 'Square Centimeters (cm²)', factor: 0.0001 },
    { value: 'ha', label: 'Hectares (ha)', factor: 10000 },
    { value: 'ac', label: 'Acres (ac)', factor: 4046.8564224 },
    { value: 'ft2', label: 'Square Feet (ft²)', factor: 0.092903 },
    { value: 'mi2', label: 'Square Miles (mi²)', factor: 2589988.110336 },
  ],
  volume: [
    { value: 'l', label: 'Liters (L)', factor: 1 },
    { value: 'ml', label: 'Milliliters (mL)', factor: 0.001 },
    { value: 'm3', label: 'Cubic Meters (m³)', factor: 1000 },
    { value: 'gal', label: 'Gallons (US)', factor: 3.78541 },
    { value: 'qt', label: 'Quarts (US)', factor: 0.946353 },
    { value: 'pt', label: 'Pints (US)', factor: 0.473176 },
    { value: 'cup', label: 'Cups (US)', factor: 0.236588 },
    { value: 'floz', label: 'Fluid Ounces (US)', factor: 0.0295735 },
  ],
  speed: [
    { value: 'ms', label: 'Meters/second (m/s)', factor: 1 },
    { value: 'kmh', label: 'Kilometers/hour (km/h)', factor: 0.277778 },
    { value: 'mph', label: 'Miles/hour (mph)', factor: 0.44704 },
    { value: 'kn', label: 'Knots (kn)', factor: 0.514444 },
    { value: 'fts', label: 'Feet/second (ft/s)', factor: 0.3048 },
  ],
};

const convertTemperature = (value: number, from: string, to: string): number => {
  if (from === to) return value;

  // Convert to Celsius first
  let celsius: number;
  if (from === 'c') celsius = value;
  else if (from === 'f') celsius = (value - 32) * 5 / 9;
  else celsius = value - 273.15;

  // Convert from Celsius to target
  if (to === 'c') return celsius;
  if (to === 'f') return celsius * 9 / 5 + 32;
  return celsius + 273.15;
};

export default function AllInOneUnitConverterClient() {
  const [category, setCategory] = useState<Category>('length');
  const [inputValue, setInputValue] = useState('1');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('km');

  const handleCategoryChange = (newCategory: Category) => {
    setCategory(newCategory);
    const categoryUnits = units[newCategory];
    setFromUnit(categoryUnits[0].value);
    setToUnit(categoryUnits[1].value);
  };

  const handleConvert = (): number => {
    const value = parseFloat(inputValue) || 0;

    if (category === 'temperature') {
      return convertTemperature(value, fromUnit, toUnit);
    }

    const fromFactor = units[category].find(u => u.value === fromUnit)?.factor || 1;
    const toFactor = units[category].find(u => u.value === toUnit)?.factor || 1;

    return (value * fromFactor) / toFactor;
  };

  const formatResult = (value: number): string => {
    if (Math.abs(value) < 0.0001 || Math.abs(value) > 9999999) {
      return value.toExponential(6);
    }
    return value.toLocaleString(undefined, { maximumFractionDigits: 6 });
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="tb-v2-tool-label">Category</label>
        <div className="grid grid-cols-3 gap-2">
          {(['length', 'weight', 'temperature', 'area', 'volume', 'speed'] as Category[]).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategoryChange(cat)}
              className={`tb-v2-btn-sm capitalize ${category === cat ? 'on' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="tb-v2-tool-label">From</label>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="tb-v2-input"
          />
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="tb-v2-input mt-2"
          >
            {units[category].map((unit) => (
              <option key={unit.value} value={unit.value}>
                {unit.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="tb-v2-tool-label">To</label>
          <div className="tb-v2-tool-output-body h-[88px] flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-700 dark:text-gray-200">
              {formatResult(handleConvert())}
            </span>
          </div>
          <select
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            className="tb-v2-input mt-2"
          >
            {units[category].map((unit) => (
              <option key={unit.value} value={unit.value}>
                {unit.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Result</span>
      </div>
      <div className="tb-v2-tool-output-body">
        <div className="text-center py-4">
          <span className="text-3xl font-bold text-gray-700 dark:text-gray-200">
            {formatResult(handleConvert())}
          </span>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {units[category].find(u => u.value === toUnit)?.label}
          </p>
        </div>
      </div>

      <div className="tb-v2-box p-4 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          <span className="font-medium">{parseFloat(inputValue) || 0}</span>
          {' '}{units[category].find(u => u.value === fromUnit)?.label.split(' ')[0]}
          {' = '}
          <span className="font-medium">{formatResult(handleConvert())}</span>
          {' '}{units[category].find(u => u.value === toUnit)?.label.split(' ')[0]}
        </p>
      </div>
    </div>
  );
}
