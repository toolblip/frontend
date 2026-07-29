'use client';

import React, { useState, useEffect } from 'react';

type Unit = 'celsius' | 'fahrenheit' | 'kelvin';

interface TemperatureValue {
  celsius: number;
  fahrenheit: number;
  kelvin: number;
}

function celsiusToFahrenheit(c: number): number {
  return (c * 9) / 5 + 32;
}

function celsiusToKelvin(c: number): number {
  return c + 273.15;
}

function fahrenheitToCelsius(f: number): number {
  return ((f - 32) * 5) / 9;
}

function fahrenheitToKelvin(f: number): number {
  return celsiusToKelvin(fahrenheitToCelsius(f));
}

function kelvinToCelsius(k: number): number {
  return k - 273.15;
}

function kelvinToFahrenheit(k: number): number {
  return celsiusToFahrenheit(kelvinToCelsius(k));
}

function convertToAll(units: TemperatureValue): TemperatureValue {
  return units;
}

const presets = [
  { name: 'Absolute Zero', celsius: -273.15, fahrenheit: -459.67, kelvin: 0 },
  { name: 'Freezing Point', celsius: 0, fahrenheit: 32, kelvin: 273.15 },
  { name: 'Body Temperature', celsius: 37, fahrenheit: 98.6, kelvin: 310.15 },
  { name: 'Boiling Point', celsius: 100, fahrenheit: 212, kelvin: 373.15 },
  { name: 'Room Temperature', celsius: 20, fahrenheit: 68, kelvin: 293.15 },
  { name: 'Oven (Low)', celsius: 150, fahrenheit: 300, kelvin: 423.15 },
  { name: 'Oven (High)', celsius: 220, fahrenheit: 425, kelvin: 493.15 },
  { name: 'Sun Surface', celsius: 5500, fahrenheit: 9932, kelvin: 5773 },
];

export default function TemperatureUnitConverterClient() {
  const [inputValue, setInputValue] = useState<string>('0');
  const [inputUnit, setInputUnit] = useState<Unit>('celsius');
  const [temps, setTemps] = useState<TemperatureValue>({
    celsius: 0,
    fahrenheit: 32,
    kelvin: 273.15,
  });

  useEffect(() => {
    const value = parseFloat(inputValue) || 0;
    let celsius: number;

    switch (inputUnit) {
      case 'celsius':
        celsius = value;
        break;
      case 'fahrenheit':
        celsius = fahrenheitToCelsius(value);
        break;
      case 'kelvin':
        celsius = kelvinToCelsius(value);
        break;
    }

    setTemps({
      celsius: celsius,
      fahrenheit: celsiusToFahrenheit(celsius),
      kelvin: celsiusToKelvin(celsius),
    });
  }, [inputValue, inputUnit]);

  const formatTemperature = (value: number, unit: Unit): string => {
    if (unit === 'kelvin' && value < 0) {
      return 'N/A';
    }
    return `${value.toFixed(2)}°`;
  };

  const loadPreset = (preset: typeof presets[0]) => {
    setInputValue(preset[inputUnit].toString());
  };

  const setFromUnit = (unit: Unit, value: number) => {
    setInputUnit(unit);
    setInputValue(value.toString());
  };

  const getTemperatureCategory = (celsius: number): { label: string; color: string } => {
    if (celsius < -100) return { label: 'Extremely Cold', color: 'bg-blue-900' };
    if (celsius < 0) return { label: 'Freezing', color: 'bg-blue-600' };
    if (celsius < 10) return { label: 'Cold', color: 'bg-blue-400' };
    if (celsius < 20) return { label: 'Cool', color: 'bg-cyan-400' };
    if (celsius < 25) return { label: 'Room Temperature', color: 'bg-green-400' };
    if (celsius < 30) return { label: 'Warm', color: 'bg-yellow-400' };
    if (celsius < 40) return { label: 'Hot', color: 'bg-orange-500' };
    return { label: 'Extremely Hot', color: 'bg-red-600' };
  };

  const category = getTemperatureCategory(temps.celsius);

  return (
    <div className="tb-v2-card">
      <div className="tb-v2-card-header">
        <h2 className="tb-v2-card-title">Temperature Unit Converter</h2>
        <p className="tb-v2-card-description">
          Convert between Celsius, Fahrenheit, and Kelvin temperature scales
        </p>
      </div>

      <div className="tb-v2-form-group">
        <label className="tb-v2-label">Enter Temperature</label>
        <div className="tb-v2-mode-tabs">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="tb-v2-input flex-1 text-xl font-mono"
            placeholder="Enter value"
          />
          <select
            value={inputUnit}
            onChange={(e) => setInputUnit(e.target.value as Unit)}
            className="tb-v2-input w-36"
          >
            <option value="celsius">Celsius (°C)</option>
            <option value="fahrenheit">Fahrenheit (°F)</option>
            <option value="kelvin">Kelvin (K)</option>
          </select>
        </div>
      </div>

      <div className="tb-v2-form-group">
        <div className="tb-v2-label">Quick Select Unit</div>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setFromUnit('celsius', temps.celsius)}
            className={`tb-v2-button ${
              inputUnit === 'celsius' ? 'tb-v2-button-primary' : 'tb-v2-button-secondary'
            }`}
          >
            Celsius
          </button>
          <button
            onClick={() => setFromUnit('fahrenheit', temps.fahrenheit)}
            className={`tb-v2-button ${
              inputUnit === 'fahrenheit' ? 'tb-v2-button-primary' : 'tb-v2-button-secondary'
            }`}
          >
            Fahrenheit
          </button>
          <button
            onClick={() => setFromUnit('kelvin', temps.kelvin)}
            className={`tb-v2-button ${
              inputUnit === 'kelvin' ? 'tb-v2-button-primary' : 'tb-v2-button-secondary'
            }`}
          >
            Kelvin
          </button>
        </div>
      </div>

      <div className="tb-v2-card p-6 mb-6">
        <div className="flex items-center justify-center mb-4">
          <div className={`px-4 py-2 rounded-full ${category.color} text-white font-semibold`}>
            {category.label}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="tb-v2-card p-4 bg-blue-50 border-blue-200">
            <div className="text-xs text-gray-500 mb-1">Celsius</div>
            <div className="text-2xl font-bold text-blue-600">
              {temps.celsius.toFixed(2)}°C
            </div>
          </div>
          <div className="tb-v2-card p-4 bg-red-50 border-red-200">
            <div className="text-xs text-gray-500 mb-1">Fahrenheit</div>
            <div className="text-2xl font-bold text-red-600">
              {temps.fahrenheit.toFixed(2)}°F
            </div>
          </div>
          <div className="tb-v2-card p-4 bg-purple-50 border-purple-200">
            <div className="text-xs text-gray-500 mb-1">Kelvin</div>
            <div className="text-2xl font-bold text-purple-600">
              {temps.kelvin < 0 ? 'N/A' : `${temps.kelvin.toFixed(2)}K`}
            </div>
          </div>
        </div>
      </div>

      <div className="tb-v2-form-group">
        <div className="tb-v2-label">Temperature Scale Comparison</div>
        <div className="relative h-8 bg-gradient-to-r from-blue-900 via-green-400 to-red-600 rounded-full">
          <div
            className="absolute top-0 bottom-0 w-3 bg-white rounded-full shadow-lg border-2"
            style={{
              left: `${Math.max(0, Math.min(100, ((temps.celsius + 50) / 150) * 100))}%`,
              transform: 'translateX(-50%)',
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>-50°C</span>
          <span>0°C</span>
          <span>50°C</span>
          <span>100°C</span>
        </div>
      </div>

      <div className="tb-v2-form-group">
        <div className="tb-v2-label">Common Presets</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {presets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => loadPreset(preset)}
              className="tb-v2-button tb-v2-button-secondary text-sm py-2"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div className="tb-v2-form-group">
        <div className="tb-v2-label">Conversion Formulas</div>
        <div className="tb-v2-card p-4 text-sm space-y-2">
          <p>
            <strong>Celsius to Fahrenheit:</strong> °F = (°C × 9/5) + 32
          </p>
          <p>
            <strong>Celsius to Kelvin:</strong> K = °C + 273.15
          </p>
          <p>
            <strong>Fahrenheit to Celsius:</strong> °C = (°F - 32) × 5/9
          </p>
          <p>
            <strong>Fahrenheit to Kelvin:</strong> K = (°F - 32) × 5/9 + 273.15
          </p>
          <p>
            <strong>Kelvin to Celsius:</strong> °C = K - 273.15
          </p>
          <p>
            <strong>Kelvin to Fahrenheit:</strong> °F = (K - 273.15) × 9/5 + 32
          </p>
        </div>
      </div>

      <div className="tb-v2-form-group">
        <div className="tb-v2-label">Temperature Reference</div>
        <div className="tb-v2-card p-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Kelvin Scale</span>
              <span className="text-gray-500">Starts at absolute zero (0 K)</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Celsius Scale</span>
              <span className="text-gray-500">Water freezes at 0°C, boils at 100°C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Fahrenheit Scale</span>
              <span className="text-gray-500">Water freezes at 32°F, boils at 212°F</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
