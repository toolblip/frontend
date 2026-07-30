'use client';

import { useState, useEffect } from 'react';

interface ColorBlindnessType {
  name: string;
  description: string;
  matrix: number[][];
}

const colorBlindnessTypes: ColorBlindnessType[] = [
  {
    name: 'Protanopia',
    description: 'Red-blind (no red cones)',
    matrix: [
      [0.567, 0.433, 0],
      [0.558, 0.442, 0],
      [0, 0.242, 0.758],
    ],
  },
  {
    name: 'Deuteranopia',
    description: 'Green-blind (no green cones)',
    matrix: [
      [0.625, 0.375, 0],
      [0.7, 0.3, 0],
      [0, 0.3, 0.7],
    ],
  },
  {
    name: 'Tritanopia',
    description: 'Blue-blind (no blue cones)',
    matrix: [
      [0.95, 0.05, 0],
      [0, 0.433, 0.567],
      [0, 0.475, 0.525],
    ],
  },
];

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = Math.round(Math.max(0, Math.min(255, x))).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('')
  );
}

function applyColorMatrix(
  rgb: { r: number; g: number; b: number },
  matrix: number[][]
): { r: number; g: number; b: number } {
  const newR = rgb.r * matrix[0][0] + rgb.g * matrix[0][1] + rgb.b * matrix[0][2];
  const newG = rgb.r * matrix[1][0] + rgb.g * matrix[1][1] + rgb.b * matrix[1][2];
  const newB = rgb.r * matrix[2][0] + rgb.g * matrix[2][1] + rgb.b * matrix[2][2];
  return { r: newR, g: newG, b: newB };
}

const presetColors = [
  '#e74c3c',
  '#3498db',
  '#2ecc71',
  '#f1c40f',
  '#9b59b6',
  '#1abc9c',
  '#e67e22',
  '#34495e',
];

export default function ColorBlindnessSimulatorClient() {
  const [color, setColor] = useState('#3498db');
  const [hexInput, setHexInput] = useState('#3498db');
  const [hexError, setHexError] = useState(false);
  const [rgb, setRgb] = useState({ r: 52, g: 152, b: 219 });
  const [simulatedColors, setSimulatedColors] = useState<Record<string, string>>({});

  useEffect(() => {
    const parsed = hexToRgb(color);
    if (parsed) {
      setRgb(parsed);
    }
  }, [color]);

  useEffect(() => {
    const simulated: Record<string, string> = {};
    colorBlindnessTypes.forEach((type) => {
      const newRgb = applyColorMatrix(rgb, type.matrix);
      simulated[type.name] = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    });
    setSimulatedColors(simulated);
  }, [rgb]);

  const setColorValue = (value: string) => {
    setColor(value);
    setHexInput(value);
    setHexError(false);
  };

  const handleHexInput = (value: string) => {
    setHexInput(value);
    if (hexToRgb(value)) {
      setColor(value);
      setHexError(false);
    } else {
      setHexError(true);
    }
  };

  const loadExample = () => setColorValue('#e74c3c');

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Color Blindness Simulator</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>
      <p style={{ fontSize: 13, color: 'var(--tb-text-secondary)' }}>
        See how colors appear with different types of color blindness.
      </p>

      <div className="tb-v2-section">
        <h3 className="tb-v2-section-title">Pick a Color</h3>
        <div className="flex gap-3 items-center">
          <input
            type="color"
            value={color}
            onChange={(e) => setColorValue(e.target.value)}
            style={{ height: 48, width: 96, cursor: 'pointer', borderRadius: 6, border: '1px solid var(--tb-border)' }}
          />
          <input
            type="text"
            value={hexInput.toUpperCase()}
            onChange={(e) => handleHexInput(e.target.value)}
            className="tb-v2-input flex-1"
            style={{ textTransform: 'uppercase' }}
            placeholder="#FFFFFF"
          />
        </div>
        {hexError && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 6 }}>Enter a valid 6-digit hex color (e.g., #3366FF).</p>}
        <div className="mt-3">
          <p className="tb-v2-tool-label mb-2">Preset Colors</p>
          <div className="flex gap-2 flex-wrap">
            {presetColors.map((presetColor) => (
              <button
                key={presetColor}
                type="button"
                onClick={() => setColorValue(presetColor)}
                className="w-8 h-8 rounded border-2 transition-transform hover:scale-110"
                style={{ backgroundColor: presetColor, borderColor: color === presetColor ? '#000' : 'transparent' }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="tb-v2-section">
        <h3 className="tb-v2-section-title">Original Color</h3>
        <div className="flex gap-4 items-center">
          <div
            className="w-24 h-24 rounded-lg border-2 shadow-lg"
            style={{ backgroundColor: color }}
          />
          <div className="text-sm">
            <p className="font-mono">HEX: {color.toUpperCase()}</p>
            <p className="font-mono">RGB: {rgb.r}, {rgb.g}, {rgb.b}</p>
          </div>
        </div>
      </div>

      <div className="tb-v2-section">
        <h3 className="tb-v2-section-title">Simulated Views</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {colorBlindnessTypes.map((type) => (
            <div key={type.name} className="tb-v2-section" style={{ borderTop: 'none', border: '1px solid var(--tb-border)', borderRadius: 8 }}>
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-12 h-12 rounded border shadow"
                  style={{ backgroundColor: simulatedColors[type.name] || '#000' }}
                />
                <div>
                  <p className="font-semibold text-sm">{type.name}</p>
                  <p className="text-xs text-gray-500">{type.description}</p>
                </div>
              </div>
              <p className="font-mono text-xs mt-2">
                {simulatedColors[type.name]?.toUpperCase()}
              </p>
              <div
                className="w-full h-8 rounded mt-2"
                style={{ backgroundColor: simulatedColors[type.name] || '#000' }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="tb-v2-section">
        <h3 className="tb-v2-section-title">Side-by-Side Comparison</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">Original</div>
            <div className="w-full h-12 rounded" style={{ backgroundColor: color }} />
          </div>
          {colorBlindnessTypes.map((type) => (
            <div key={type.name} className="text-center">
              <div className="text-xs text-gray-500 mb-1">{type.name.split(' ')[0]}</div>
              <div
                className="w-full h-12 rounded"
                style={{ backgroundColor: simulatedColors[type.name] || '#000' }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="tb-v2-section">
        <h3 className="tb-v2-section-title">Test Gradient</h3>
        <div className="relative h-12 rounded overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to right, #e74c3c, #f1c40f, #2ecc71, #3498db, #9b59b6)`,
            }}
          />
        </div>
        <div className="relative h-12 rounded overflow-hidden mt-2">
          {colorBlindnessTypes.map((type, index) => {
            const simulated = simulatedColors[type.name] || '#000';
            return (
              <div
                key={type.name}
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to right, ${simulated}, ${simulated})`,
                  clipPath: `inset(0 ${100 - ((index + 1) / 3) * 100}% 0 0)`,
                }}
              />
            );
          })}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to right, #e74c3c, #f1c40f, #2ecc71, #3498db, #9b59b6)`,
              opacity: 0.3,
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Original</span>
          <span>Simulated</span>
        </div>
      </div>
    </div>
  );
}
