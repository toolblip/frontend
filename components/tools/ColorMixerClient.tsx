'use client';

import React, { useState, useEffect } from 'react';

interface ColorInput {
  hex: string;
  weight: number;
}

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

function mixAdditive(colors: ColorInput[]): string {
  let totalR = 0;
  let totalG = 0;
  let totalB = 0;
  let totalWeight = 0;

  colors.forEach(({ hex, weight }) => {
    const rgb = hexToRgb(hex);
    if (rgb) {
      totalR += rgb.r * weight;
      totalG += rgb.g * weight;
      totalB += rgb.b * weight;
      totalWeight += weight;
    }
  });

  if (totalWeight === 0) return '#000000';

  return rgbToHex(
    Math.round(totalR / totalWeight),
    Math.round(totalG / totalWeight),
    Math.round(totalB / totalWeight)
  );
}

function mixSubtractive(colors: ColorInput[]): string {
  // Convert to CMY first (subtractive model)
  const cmyColors = colors.map(({ hex }) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return { c: 0, m: 0, y: 0 };
    return {
      c: 1 - rgb.r / 255,
      m: 1 - rgb.g / 255,
      y: 1 - rgb.b / 255,
    };
  });

  let totalC = 0;
  let totalM = 0;
  let totalY = 0;
  let totalWeight = 0;

  colors.forEach(({ weight }, i) => {
    totalC += cmyColors[i].c * weight;
    totalM += cmyColors[i].m * weight;
    totalY += cmyColors[i].y * weight;
    totalWeight += weight;
  });

  if (totalWeight === 0) return '#ffffff';

  const avgC = totalC / totalWeight;
  const avgM = totalM / totalWeight;
  const avgY = totalY / totalWeight;

  // Convert back to RGB
  const r = Math.round((1 - avgC) * 255);
  const g = Math.round((1 - avgM) * 255);
  const b = Math.round((1 - avgY) * 255);

  return rgbToHex(r, g, b);
}

function mixAverage(colors: ColorInput[]): string {
  let totalR = 0;
  let totalG = 0;
  let totalB = 0;
  let totalWeight = 0;

  colors.forEach(({ hex, weight }) => {
    const rgb = hexToRgb(hex);
    if (rgb) {
      totalR += rgb.r * rgb.r * weight; // Quadratic for more natural mixing
      totalG += rgb.g * rgb.g * weight;
      totalB += rgb.b * rgb.b * weight;
      totalWeight += weight * 255; // Normalize for the squared values
    }
  });

  if (totalWeight === 0) return '#000000';

  return rgbToHex(
    Math.round(Math.sqrt(totalR / totalWeight) * 255),
    Math.round(Math.sqrt(totalG / totalWeight) * 255),
    Math.round(Math.sqrt(totalB / totalWeight) * 255)
  );
}

export default function ColorMixerClient() {
  const [colors, setColors] = useState<ColorInput[]>([
    { hex: '#ff0000', weight: 1 },
    { hex: '#0000ff', weight: 1 },
  ]);
  const [blendMode, setBlendMode] = useState<'additive' | 'subtractive' | 'average'>('additive');
  const [resultColor, setResultColor] = useState('#800080');

  useEffect(() => {
    if (colors.length === 0) {
      setResultColor('#000000');
      return;
    }
    const validColors = colors.filter((c) => hexToRgb(c.hex) !== null);
    if (validColors.length === 0) {
      setResultColor('#000000');
      return;
    }

    switch (blendMode) {
      case 'additive':
        setResultColor(mixAdditive(validColors));
        break;
      case 'subtractive':
        setResultColor(mixSubtractive(validColors));
        break;
      case 'average':
        setResultColor(mixAverage(validColors));
        break;
    }
  }, [colors, blendMode]);

  const addColor = () => {
    const presetColors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9', '#a29bfe', '#fd79a8'];
    const randomColor = presetColors[Math.floor(Math.random() * presetColors.length)];
    setColors([...colors, { hex: randomColor, weight: 1 }]);
  };

  const removeColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const updateColor = (index: number, field: 'hex' | 'weight', value: string | number) => {
    const newColors = [...colors];
    if (field === 'hex') {
      newColors[index].hex = value as string;
    } else {
      newColors[index].weight = Math.max(0.1, Math.min(10, value as number));
    }
    setColors(newColors);
  };

  const presetSchemes = [
    {
      name: 'RYB Primary',
      colors: ['#ff0000', '#ffff00', '#0000ff'],
    },
    {
      name: 'RGB Primary',
      colors: ['#ff0000', '#00ff00', '#0000ff'],
    },
    {
      name: 'Warm Sunset',
      colors: ['#ff6b6b', '#feca57', '#ff9ff3'],
    },
    {
      name: 'Cool Ocean',
      colors: ['#00b894', '#0984e3', '#a29bfe'],
    },
    {
      name: 'Earth Tones',
      colors: ['#d35400', '#f39c12', '#27ae60'],
    },
    {
      name: 'Pastels',
      colors: ['#fab1a0', '#81ecec', '#a29bfe'],
    },
  ];

  const loadPreset = (scheme: typeof presetSchemes[0]) => {
    setColors(scheme.colors.map((hex) => ({ hex, weight: 1 })));
  };

  return (
    <div className="tb-v2-card">
      <div className="tb-v2-card-header">
        <h2 className="tb-v2-card-title">Color Mixer</h2>
        <p className="tb-v2-card-description">
          Mix two or more colors using additive, subtractive, or averaging blending
        </p>
      </div>

      <div className="tb-v2-form-group">
        <div className="tb-v2-label">Blend Mode</div>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setBlendMode('additive')}
            className={`tb-v2-button ${blendMode === 'additive' ? 'tb-v2-button-primary' : 'tb-v2-button-secondary'}`}
          >
            Additive
          </button>
          <button
            onClick={() => setBlendMode('subtractive')}
            className={`tb-v2-button ${blendMode === 'subtractive' ? 'tb-v2-button-primary' : 'tb-v2-button-secondary'}`}
          >
            Subtractive
          </button>
          <button
            onClick={() => setBlendMode('average')}
            className={`tb-v2-button ${blendMode === 'average' ? 'tb-v2-button-primary' : 'tb-v2-button-secondary'}`}
          >
            Average
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {blendMode === 'additive' && 'Light mixing (like light beams) - RGB model'}
          {blendMode === 'subtractive' && 'Pigment mixing (like paints) - CMY model'}
          {blendMode === 'average' && 'Standard averaging of RGB values'}
        </p>
      </div>

      <div className="tb-v2-form-group">
        <div className="flex justify-between items-center mb-2">
          <div className="tb-v2-label mb-0">Colors to Mix</div>
          <button onClick={addColor} className="tb-v2-button tb-v2-button-secondary text-sm py-1 px-3">
            + Add Color
          </button>
        </div>
        <div className="space-y-2">
          {colors.map((color, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="color"
                value={color.hex}
                onChange={(e) => updateColor(index, 'hex', e.target.value)}
                className="tb-v2-input h-10 w-20 cursor-pointer rounded border"
              />
              <input
                type="text"
                value={color.hex.toUpperCase()}
                onChange={(e) => updateColor(index, 'hex', e.target.value)}
                className="tb-v2-input w-28 uppercase"
              />
              <input
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                value={color.weight}
                onChange={(e) => updateColor(index, 'weight', parseFloat(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm w-12 text-right font-mono">{color.weight.toFixed(1)}</span>
              <button
                onClick={() => removeColor(index)}
                className="tb-v2-button tb-v2-button-secondary text-red-600 px-2 py-1"
                disabled={colors.length <= 1}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="tb-v2-form-group">
        <div className="tb-v2-label">Quick Presets</div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {presetSchemes.map((scheme) => (
            <button
              key={scheme.name}
              onClick={() => loadPreset(scheme)}
              className="tb-v2-button tb-v2-button-secondary text-sm py-2"
            >
              {scheme.name}
            </button>
          ))}
        </div>
      </div>

      <div className="tb-v2-card p-6 mb-6">
        <div className="text-center">
          <div className="tb-v2-label mb-3">Result</div>
          <div className="flex justify-center items-center gap-6">
            <div
              className="w-32 h-32 rounded-xl shadow-lg border-4"
              style={{ backgroundColor: resultColor, borderColor: resultColor }}
            />
            <div className="text-left">
              <div className="text-3xl font-bold font-mono">{resultColor.toUpperCase()}</div>
              <div className="text-sm text-gray-500 mt-1">Click to copy</div>
            </div>
          </div>
        </div>
      </div>

      <div className="tb-v2-form-group">
        <div className="tb-v2-label">Color Sources</div>
        <div className="flex gap-2 flex-wrap">
          {colors.map((color, index) => (
            <div key={index} className="flex items-center gap-1 p-2 rounded" style={{ backgroundColor: color.hex + '20' }}>
              <div className="w-4 h-4 rounded" style={{ backgroundColor: color.hex }} />
              <span className="text-xs font-mono">{color.hex.toUpperCase()}</span>
              <span className="text-xs text-gray-500">({color.weight})</span>
            </div>
          ))}
        </div>
      </div>

      <div className="tb-v2-form-group">
        <div className="tb-v2-label">Preview Strip</div>
        <div className="flex h-8 rounded overflow-hidden">
          {colors.map((color, index) => (
            <div
              key={index}
              className="h-full"
              style={{
                backgroundColor: color.hex,
                flex: color.weight,
              }}
            />
          ))}
        </div>
        <div className="flex h-8 rounded overflow-hidden mt-2 border">
          <div className="h-full flex-1" style={{ backgroundColor: resultColor }} />
        </div>
      </div>

      <div className="tb-v2-form-group">
        <div className="tb-v2-label">How It Works</div>
        <div className="tb-v2-card p-4 text-sm space-y-2">
          <p>
            <strong>Additive mixing</strong> combines light wavelengths (RGB). Red + Green = Yellow, Green + Blue = Cyan, Red + Blue = Magenta.
          </p>
          <p>
            <strong>Subtractive mixing</strong> simulates pigment behavior (CMY). Cyan + Yellow = Green, Yellow + Magenta = Red, Cyan + Magenta = Blue.
          </p>
          <p>
            <strong>Average mixing</strong> blends colors naturally by averaging their RGB values, giving more weight to colors with higher weights.
          </p>
        </div>
      </div>
    </div>
  );
}
