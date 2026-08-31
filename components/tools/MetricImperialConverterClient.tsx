'use client';

import { useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

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

const lengthShort: Record<LengthUnit, string> = {
  mm: 'mm',
  cm: 'cm',
  m: 'm',
  km: 'km',
  in: 'in',
  ft: 'ft',
  yd: 'yd',
  mi: 'mi',
};

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

const weightShort: Record<WeightUnit, string> = {
  g: 'g',
  kg: 'kg',
  oz: 'oz',
  lb: 'lb',
};

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

const temperatureShort: Record<TemperatureUnit, string> = {
  c: '°C',
  f: '°F',
  k: 'K',
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

const shortByCategory: Record<Category, Record<string, string>> = {
  length: lengthShort,
  weight: weightShort,
  temperature: temperatureShort,
};

const defaultUnits: Record<Category, [string, string]> = {
  length: ['m', 'ft'],
  weight: ['kg', 'lb'],
  temperature: ['c', 'f'],
};

const exampleByCategory: Record<Category, { value: string; from: string; to: string }> = {
  length: { value: '1', from: 'm', to: 'ft' },
  weight: { value: '1', from: 'kg', to: 'lb' },
  temperature: { value: '25', from: 'c', to: 'f' },
};

export default function MetricImperialConverterClient() {
  const [category, setCategory] = useState<Category>('length');
  const [inputValue, setInputValue] = useState('');
  const [fromUnit, setFromUnit] = useState<string>(defaultUnits.length[0]);
  const [toUnit, setToUnit] = useState<string>(defaultUnits.length[1]);
  const [copied, setCopied] = useState(false);

  const changeCategory = (next: Category) => {
    setCategory(next);
    setFromUnit(defaultUnits[next][0]);
    setToUnit(defaultUnits[next][1]);
  };

  const convert = (value = parseFloat(inputValue) || 0, from = fromUnit, to = toUnit): number => {
    if (category === 'temperature') {
      const celsius = toCelsius(value, from as TemperatureUnit);
      return fromCelsius(celsius, to as TemperatureUnit);
    }
    if (category === 'length') {
      const meters = value * lengthToMeters[from as LengthUnit];
      return meters / lengthToMeters[to as LengthUnit];
    }
    const grams = value * weightToGrams[from as WeightUnit];
    return grams / weightToGrams[to as WeightUnit];
  };

  const formatResult = (value: number): string => {
    if (value !== 0 && (Math.abs(value) < 0.0001 || Math.abs(value) >= 1e9)) {
      return value.toExponential(6);
    }
    return value.toLocaleString(undefined, { maximumFractionDigits: 6 });
  };

  const result = inputValue.trim() === '' || isNaN(parseFloat(inputValue)) ? null : convert();

  const swap = () => {
    const next = result === null ? inputValue : formatResult(result);
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setInputValue(next);
  };

  const copy = () => {
    if (result === null) return;
    const shorts = shortByCategory[category];
    navigator.clipboard
      .writeText(`${inputValue} ${shorts[fromUnit]} = ${formatResult(result)} ${shorts[toUnit]}`)
      .catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const labels = labelsByCategory[category];
  const units = unitsByCategory[category];
  const shorts = shortByCategory[category];

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head" style={{ borderBottom: '1px solid var(--line)' }}>
        <span className="tb-v2-tool-label">Metric ↔ Imperial</span>
        <ToolExampleClearActions
          exampleCount={1}
          onExample={() => {
            const ex = exampleByCategory[category];
            setInputValue(ex.value);
            setFromUnit(ex.from);
            setToUnit(ex.to);
          }}
          onClear={() => {
            setInputValue('');
            setFromUnit(defaultUnits[category][0]);
            setToUnit(defaultUnits[category][1]);
          }}
          canClear={inputValue.length > 0}
        />
      </div>

      <div style={{ padding: '16px 20px 0', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {(Object.keys(categoryLabels) as Category[]).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => changeCategory(cat)}
            className={`tb-v2-mode-tab ${cat === category ? 'active' : ''}`}
          >
            {categoryLabels[cat]}
          </button>
        ))}
      </div>

      <div style={{ padding: 20 }}>
        <div className="grid grid-cols-[1fr,auto,1fr] gap-3 items-end">
          <div>
            <label className="tb-v2-tool-label">From</label>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="tb-v2-input mb-2"
              placeholder="1"
              aria-label="Value"
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="tb-v2-input"
              aria-label="From unit"
            >
              {units.map((value) => (
                <option key={value} value={value}>
                  {labels[value]}
                </option>
              ))}
            </select>
          </div>

          <button type="button" onClick={swap} className="tb-v2-mode-tab mb-1" title="Swap units">
            ⇄
          </button>

          <div>
            <label className="tb-v2-tool-label">To</label>
            <div
              className="tb-v2-input mb-2 text-center text-2xl font-bold"
              style={{ minHeight: 44, color: 'var(--red)' }}
            >
              {result === null ? '—' : formatResult(result)}
            </div>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="tb-v2-input"
              aria-label="To unit"
            >
              {units.map((value) => (
                <option key={value} value={value}>
                  {labels[value]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Result</span>
        <button
          type="button"
          onClick={copy}
          disabled={result === null}
          className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body" style={{ textAlign: 'center' }}>
        {result === null ? (
          <p className="tb-v2-empty">Enter a value or use Example.</p>
        ) : (
          <span style={{ fontSize: 16 }}>
            <strong>{inputValue}</strong> {shorts[fromUnit]}
            {' = '}
            <strong style={{ color: 'var(--red)' }}>{formatResult(result)}</strong> {shorts[toUnit]}
          </span>
        )}
      </div>
    </div>
  );
}
