'use client';

import { useState, useEffect } from 'react';

type PaletteType = 'complementary' | 'analogous' | 'triadic' | 'tetradic' | 'split-complementary' | 'monochromatic';

function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;

  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function isValidHex(hex: string): boolean {
  return /^#?[a-f\d]{6}$/i.test(hex);
}

function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0, g = 0, b = 0;

  if (h < 60) { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }

  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function generatePalette(baseColor: string, type: PaletteType): string[] {
  const hsl = hexToHsl(baseColor);
  if (!hsl) return [baseColor];

  const { h, s, l } = hsl;
  const palettes: Record<PaletteType, number[]> = {
    complementary: [h, (h + 180) % 360],
    analogous: [h, (h + 30) % 360, (h - 30 + 360) % 360],
    triadic: [h, (h + 120) % 360, (h + 240) % 360],
    tetradic: [h, (h + 90) % 360, (h + 180) % 360, (h + 270) % 360],
    'split-complementary': [h, (h + 150) % 360, (h + 210) % 360],
    monochromatic: [h, h, h, h, h],
  };

  const hueAngles = palettes[type];

  if (type === 'monochromatic') {
    return [
      hslToHex(h, s, Math.max(10, l - 30)),
      hslToHex(h, s, Math.max(10, l - 15)),
      hslToHex(h, s, l),
      hslToHex(h, s, Math.min(90, l + 15)),
      hslToHex(h, s, Math.min(90, l + 30)),
    ];
  }

  return hueAngles.map((angle) => hslToHex(angle, s, l));
}

const paletteTypes: { value: PaletteType; label: string; description: string }[] = [
  { value: 'complementary', label: 'Complementary', description: '2 colors opposite on color wheel' },
  { value: 'analogous', label: 'Analogous', description: '3-5 colors adjacent on color wheel' },
  { value: 'triadic', label: 'Triadic', description: '3 colors equally spaced (120°)' },
  { value: 'tetradic', label: 'Tetradic', description: '4 colors forming a rectangle' },
  { value: 'split-complementary', label: 'Split Complementary', description: 'Base + 2 colors adjacent to complement' },
  { value: 'monochromatic', label: 'Monochromatic', description: 'Variations of single hue' },
];

const presetBaseColors = [
  '#e74c3c',
  '#3498db',
  '#2ecc71',
  '#f1c40f',
  '#9b59b6',
  '#1abc9c',
  '#e67e22',
  '#34495e',
];

export default function ColorPaletteGeneratorClient() {
  const [baseColor, setBaseColor] = useState('#3498db');
  const [baseColorInput, setBaseColorInput] = useState('#3498db');
  const [hexError, setHexError] = useState(false);
  const [paletteType, setPaletteType] = useState<PaletteType>('complementary');
  const [palette, setPalette] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    setPalette(generatePalette(baseColor, paletteType));
  }, [baseColor, paletteType]);

  const setBaseColorValue = (value: string) => {
    setBaseColor(value);
    setBaseColorInput(value);
    setHexError(false);
  };

  const handleBaseColorInput = (value: string) => {
    setBaseColorInput(value);
    if (isValidHex(value)) {
      setBaseColor(value.startsWith('#') ? value : `#${value}`);
      setHexError(false);
    } else {
      setHexError(true);
    }
  };

  const loadExample = () => {
    setBaseColorValue('#9b59b6');
    setPaletteType('triadic');
  };

  const copyToClipboard = async (color: string, index: number) => {
    try {
      await navigator.clipboard.writeText(color);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Color Palette Generator</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>

      <div>
        <label className="tb-v2-tool-label" style={{ marginBottom: 8, display: 'block' }}>Base Color</label>
        <div className="flex gap-3 items-center">
          <input
            type="color"
            value={baseColor}
            onChange={(e) => setBaseColorValue(e.target.value)}
            className="cursor-pointer rounded border"
            style={{ width: 48, height: 40 }}
          />
          <input
            type="text"
            value={baseColorInput}
            onChange={(e) => handleBaseColorInput(e.target.value)}
            className="tb-v2-input flex-1 uppercase"
            style={{ fontFamily: 'var(--f-mono)' }}
            placeholder="#3498DB"
          />
        </div>
        {hexError && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 6 }}>Enter a valid 6-digit hex color (e.g., #3366FF).</p>}
      </div>

      <div>
        <div className="tb-v2-tool-label" style={{ marginBottom: 8 }}>Quick Select</div>
        <div className="flex gap-2 flex-wrap">
          {presetBaseColors.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setBaseColorValue(preset)}
              className="w-8 h-8 rounded border-2 transition-transform hover:scale-110"
              style={{
                backgroundColor: preset,
                borderColor: baseColor === preset ? '#000' : 'transparent',
              }}
            />
          ))}
        </div>
      </div>

      <div>
        <div className="tb-v2-tool-label" style={{ marginBottom: 8 }}>Palette Type</div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {paletteTypes.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => setPaletteType(type.value)}
              className={`p-3 rounded border text-left transition-colors ${
                paletteType === type.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-semibold text-sm">{type.label}</div>
              <div className="text-xs text-gray-500">{type.description}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="tb-v2-tool-label" style={{ marginBottom: 8 }}>Generated Palette</div>
        <div className="flex gap-2">
          {palette.map((color, index) => (
            <div key={index} className="flex-1 text-center">
              <button
                type="button"
                onClick={() => copyToClipboard(color, index)}
                className="w-full h-24 rounded-t-lg shadow-sm transition-transform hover:scale-105 relative"
                style={{ backgroundColor: color }}
              >
                {copiedIndex === index && (
                  <span className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-xs rounded-t-lg">
                    Copied
                  </span>
                )}
              </button>
              <div className="text-xs font-mono mt-1">{color.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="tb-v2-tool-label" style={{ marginBottom: 8 }}>Color Preview</div>
        <div className="rounded-lg p-4" style={{ backgroundColor: palette[0] || baseColor }}>
          <div className="flex gap-2 mb-3">
            {palette.slice(1).map((color, index) => (
              <div
                key={index}
                className="w-12 h-12 rounded shadow"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <p className="text-sm" style={{ color: palette[1] || '#fff' }}>
            Sample text on primary color background
          </p>
          <p className="text-lg font-bold mt-1" style={{ color: palette[2] || '#fff' }}>
            Heading Example
          </p>
        </div>
      </div>

      <div>
        <div className="tb-v2-tool-label" style={{ marginBottom: 8 }}>Full Width Preview</div>
        <div className="flex h-16 rounded-lg overflow-hidden">
          {palette.map((color, index) => (
            <div
              key={index}
              className="flex-1 flex items-center justify-center text-white text-xs font-mono shadow-inner"
              style={{ backgroundColor: color }}
            >
              {color.toUpperCase()}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="tb-v2-tool-label" style={{ marginBottom: 8 }}>Export</div>
        <div className="tb-v2-section" style={{ padding: 16 }}>
          <div className="text-sm font-mono mb-3">
            {palette.map((c) => c.toUpperCase()).join(', ')}
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => copyToClipboard(palette.map((c) => c.toUpperCase()).join(', '), -1)}
              className="tb-v2-btn tb-v2-btn-primary text-sm"
            >
              {copiedIndex === -1 ? 'Copied' : 'Copy All as HEX'}
            </button>
            <button
              type="button"
              onClick={() => {
                const css = palette.map((c, i) => `--color-${i + 1}: ${c.toUpperCase()};`).join('\n');
                copyToClipboard(`:root {\n${css}\n}`, -2);
              }}
              className="tb-v2-btn tb-v2-btn-ghost text-sm"
            >
              {copiedIndex === -2 ? 'Copied' : 'Copy as CSS Variables'}
            </button>
          </div>
        </div>
      </div>

      <div>
        <div className="tb-v2-tool-label" style={{ marginBottom: 8 }}>Color Harmony Theory</div>
        <div className="tb-v2-section text-sm space-y-2" style={{ padding: 16 }}>
          <p><strong>Complementary:</strong> Colors opposite each other create high contrast and visual interest.</p>
          <p><strong>Analogous:</strong> Colors next to each other create harmonious, serene designs.</p>
          <p><strong>Triadic:</strong> Three colors equally spaced create vibrant, balanced compositions.</p>
          <p><strong>Tetradic:</strong> Four colors in rectangular arrangement offer variety with balance.</p>
          <p><strong>Split Complementary:</strong> Base color plus two adjacent to its complement, less tension than complementary.</p>
          <p><strong>Monochromatic:</strong> Single hue with varying saturation and lightness for cohesive look.</p>
        </div>
      </div>
    </div>
  );
}
