'use client';

import { useState, useEffect } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

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

function isValidHex(hex: string): boolean {
  return /^#?[a-f\d]{6}$/i.test(hex);
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
      totalR += rgb.r * rgb.r * weight;
      totalG += rgb.g * rgb.g * weight;
      totalB += rgb.b * rgb.b * weight;
      totalWeight += weight * 255;
    }
  });

  if (totalWeight === 0) return '#000000';

  return rgbToHex(
    Math.round(Math.sqrt(totalR / totalWeight) * 255),
    Math.round(Math.sqrt(totalG / totalWeight) * 255),
    Math.round(Math.sqrt(totalB / totalWeight) * 255)
  );
}

const presetSchemes = [
  { name: 'RYB Primary', colors: ['#ff0000', '#ffff00', '#0000ff'] },
  { name: 'RGB Primary', colors: ['#ff0000', '#00ff00', '#0000ff'] },
  { name: 'Warm Sunset', colors: ['#ff6b6b', '#feca57', '#ff9ff3'] },
  { name: 'Cool Ocean', colors: ['#00b894', '#0984e3', '#a29bfe'] },
  { name: 'Earth Tones', colors: ['#d35400', '#f39c12', '#27ae60'] },
  { name: 'Pastels', colors: ['#fab1a0', '#81ecec', '#a29bfe'] },
];

export default function ColorMixerClient() {
  const [colors, setColors] = useState<ColorInput[]>([
    { hex: '#ff0000', weight: 1 },
    { hex: '#0000ff', weight: 1 },
  ]);
  const [hexDrafts, setHexDrafts] = useState<string[]>(['#ff0000', '#0000ff']);
  const [blendMode, setBlendMode] = useState<'additive' | 'subtractive' | 'average'>('additive');
  const [resultColor, setResultColor] = useState('#800080');
  const [copied, setCopied] = useState(false);

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
    setHexDrafts([...hexDrafts, randomColor]);
  };

  const removeColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
    setHexDrafts(hexDrafts.filter((_, i) => i !== index));
  };

  const updateWeight = (index: number, weight: number) => {
    const newColors = [...colors];
    newColors[index] = { ...newColors[index], weight: Math.max(0.1, Math.min(10, weight)) };
    setColors(newColors);
  };

  const handleColorPicker = (index: number, value: string) => {
    const newColors = [...colors];
    newColors[index] = { ...newColors[index], hex: value };
    setColors(newColors);
    const newDrafts = [...hexDrafts];
    newDrafts[index] = value;
    setHexDrafts(newDrafts);
  };

  const handleHexDraft = (index: number, value: string) => {
    const newDrafts = [...hexDrafts];
    newDrafts[index] = value;
    setHexDrafts(newDrafts);
    if (isValidHex(value)) {
      const newColors = [...colors];
      newColors[index] = { ...newColors[index], hex: value.startsWith('#') ? value : `#${value}` };
      setColors(newColors);
    }
  };

  const loadPreset = (scheme: typeof presetSchemes[0]) => {
    const newColors = scheme.colors.map((hex) => ({ hex, weight: 1 }));
    setColors(newColors);
    setHexDrafts(scheme.colors);
  };

  const DEFAULT_COLORS: ColorInput[] = [
    { hex: '#ff0000', weight: 1 },
    { hex: '#0000ff', weight: 1 },
  ];

  const canClear =
    colors.length !== 2 ||
    colors[0]?.hex.toLowerCase() !== '#ff0000' ||
    colors[1]?.hex.toLowerCase() !== '#0000ff' ||
    blendMode !== 'additive';

  const copyResult = () => {
    navigator.clipboard.writeText(resultColor.toUpperCase()).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head" style={{ borderBottom: '1px solid var(--line)' }}>
        <span className="tb-v2-tool-label">Color Mixer</span>
        <ToolExampleClearActions
          onExample={() => loadPreset(presetSchemes[3])}
          onClear={() => {
            setColors(DEFAULT_COLORS);
            setHexDrafts(['#ff0000', '#0000ff']);
            setBlendMode('additive');
          }}
          canClear={canClear}
        />
      </div>

      <div className="tb-v2-section" style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '16px 20px' }}>
      <div>
        <div className="tb-v2-tool-label" style={{ marginBottom: 8 }}>Blend Mode</div>
        <div className="tb-v2-mode-tabs">
          {(['additive', 'subtractive', 'average'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setBlendMode(mode)}
              className={`tb-v2-mode-tab ${blendMode === mode ? 'on' : ''}`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {blendMode === 'additive' && 'Light mixing (like light beams) - RGB model'}
          {blendMode === 'subtractive' && 'Pigment mixing (like paints) - CMY model'}
          {blendMode === 'average' && 'Standard averaging of RGB values'}
        </p>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <div className="tb-v2-tool-label">Colors to Mix</div>
          <button type="button" onClick={addColor} className="tb-v2-btn-sm">
            + Add Color
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {colors.map((color, index) => (
            <div key={index}>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={color.hex}
                  onChange={(e) => handleColorPicker(index, e.target.value)}
                  className="cursor-pointer rounded border"
                  style={{ width: 48, height: 40 }}
                />
                <input
                  type="text"
                  value={hexDrafts[index] ?? color.hex}
                  onChange={(e) => handleHexDraft(index, e.target.value)}
                  className="tb-v2-input uppercase"
                  style={{ width: 110, fontFamily: 'var(--f-mono)' }}
                />
                <input
                  type="range"
                  min="0.1"
                  max="10"
                  step="0.1"
                  value={color.weight}
                  onChange={(e) => updateWeight(index, parseFloat(e.target.value))}
                  className="tb-v2-range flex-1"
                />
                <span className="text-sm w-12 text-right font-mono">{color.weight.toFixed(1)}</span>
                <button
                  type="button"
                  onClick={() => removeColor(index)}
                  className="tb-v2-btn tb-v2-btn-ghost tb-v2-btn-sm text-red-600"
                  disabled={colors.length <= 1}
                >
                  Remove
                </button>
              </div>
              {!isValidHex(hexDrafts[index] ?? '') && (
                <p style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>Enter a valid 6-digit hex color.</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="tb-v2-tool-label" style={{ marginBottom: 8 }}>Quick Presets</div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {presetSchemes.map((scheme) => (
            <button
              key={scheme.name}
              type="button"
              onClick={() => loadPreset(scheme)}
              className="tb-v2-btn tb-v2-btn-ghost tb-v2-btn-sm"
            >
              {scheme.name}
            </button>
          ))}
        </div>
      </div>

      <div className="tb-v2-section" style={{ padding: '16px 20px' }}>
        <div className="text-center">
          <div className="tb-v2-tool-label" style={{ marginBottom: 12 }}>Result</div>
          <div className="flex justify-center items-center gap-6">
            <div
              className="w-32 h-32 rounded-xl shadow-lg border-4"
              style={{ backgroundColor: resultColor, borderColor: resultColor }}
            />
            <div className="text-left">
              <button
                type="button"
                onClick={copyResult}
                className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
                style={{ fontSize: 24, fontFamily: 'var(--f-mono)' }}
              >
                {copied ? 'Copied' : resultColor.toUpperCase()}
              </button>
              <div className="text-sm text-gray-500 mt-1">Click to copy</div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="tb-v2-tool-label" style={{ marginBottom: 8 }}>Color Sources</div>
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

      <div>
        <div className="tb-v2-tool-label" style={{ marginBottom: 8 }}>Preview Strip</div>
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

      <div>
        <div className="tb-v2-tool-label" style={{ marginBottom: 8 }}>How It Works</div>
        <div className="tb-v2-section text-sm space-y-2" style={{ padding: 12 }}>
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
    </div>
  );
}
