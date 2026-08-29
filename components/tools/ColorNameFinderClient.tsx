'use client';

import { useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const DEFAULT_COLOR = '#6366f1';
const EXAMPLE_COLOR = '#2ecc71';

// A small built-in database of ~80 named CSS colors
const COLOR_NAMES: Record<string, string> = {
  '#f0f8ff': 'AliceBlue',
  '#faebd7': 'AntiqueWhite',
  '#00ffff': 'Aqua',
  '#7fffd4': 'Aquamarine',
  '#f0ffff': 'Azure',
  '#f5f5dc': 'Beige',
  '#ffe4c4': 'Bisque',
  '#000000': 'Black',
  '#ffebcd': 'BlanchedAlmond',
  '#0000ff': 'Blue',
  '#8a2be2': 'BlueViolet',
  '#a52a2a': 'Brown',
  '#f08080': 'LightCoral',
  '#dc143c': 'Crimson',
  '#00008b': 'DarkBlue',
  '#008b8b': 'DarkCyan',
  '#b8860b': 'DarkGoldenRod',
  '#a9a9a9': 'DarkGray',
  '#006400': 'DarkGreen',
  '#bdb76b': 'DarkKhaki',
  '#8b008b': 'DarkMagenta',
  '#556b2f': 'DarkOliveGreen',
  '#ff8c00': 'DarkOrange',
  '#9932cc': 'DarkOrchid',
  '#8b0000': 'DarkRed',
  '#e9967a': 'DarkSalmon',
  '#8fbc8f': 'DarkSeaGreen',
  '#483d8b': 'DarkSlateBlue',
  '#2f4f4f': 'DarkSlateGray',
  '#00ced1': 'DarkTurquoise',
  '#9400d3': 'DarkViolet',
  '#ff1493': 'DeepPink',
  '#00bfff': 'DeepSkyBlue',
  '#696969': 'DimGray',
  '#1e90ff': 'DodgerBlue',
  '#b22222': 'FireBrick',
  '#ffd700': 'Gold',
  '#dadada': 'Gainsboro',
  '#800080': 'Purple',
  '#008000': 'Green',
  '#adff2f': 'GreenYellow',
  '#f0fff0': 'Honeydew',
  '#ff69b4': 'HotPink',
  '#cd5c5c': 'IndianRed',
  '#4b0082': 'Indigo',
  '#fffff0': 'Ivory',
  '#f0e68c': 'Khaki',
  '#e6e6fa': 'Lavender',
  '#fff0f5': 'LavenderBlush',
  '#7cfc00': 'LawnGreen',
  '#fffacd': 'LemonChiffon',
  '#add8e6': 'LightBlue',
  '#e0ffff': 'LightCyan',
  '#ffb6c1': 'LightPink',
  '#fafad2': 'LightGoldenRodYellow',
  '#90ee90': 'LightGreen',
  '#d3d3d3': 'LightGray',
  '#0000cd': 'MediumBlue',
  '#fa8072': 'Salmon',
  '#f4a460': 'SandyBrown',
  '#6b8e23': 'OliveDrab',
  '#ffa500': 'Orange',
  '#ff4500': 'OrangeRed',
  '#da70d6': 'Orchid',
  '#008080': 'Teal',
  '#dda0dd': 'Plum',
  '#ff0000': 'Red',
  '#bc8f8f': 'RosyBrown',
  '#4169e1': 'RoyalBlue',
  '#8b4513': 'SaddleBrown',
  '#2e8b57': 'SeaGreen',
  '#fff5ee': 'SeaShell',
  '#f5deb3': 'Wheat',
  '#ffffff': 'White',
  '#f5f5f5': 'WhiteSmoke',
  '#ffff00': 'Yellow',
  '#9acd32': 'YellowGreen',
  '#00fa9a': 'MediumSpringGreen',
  '#000080': 'Navy',
  '#ffc0cb': 'Pink',
  '#db7093': 'PaleVioletRed',
  '#afeeee': 'PaleTurquoise',
  '#eee8aa': 'PaleGoldenRod',
};

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
}

function isValidHex(hex: string): boolean {
  return /^#?[a-f\d]{6}$/i.test(hex);
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0;
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

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * ((2 / 3 - t) * 6);
    return p;
  };
  const r = Math.round(hue2rgb(p, q, h / 360 + 1 / 3) * 255);
  const g = Math.round(hue2rgb(p, q, h / 360) * 255);
  const b = Math.round(hue2rgb(p, q, h / 360 - 1 / 3) * 255);
  return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
}

function colorDistance(
  c1: { r: number; g: number; b: number },
  c2: { r: number; g: number; b: number }
): number {
  return Math.sqrt((c1.r - c2.r) ** 2 + (c1.g - c2.g) ** 2 + (c1.b - c2.b) ** 2);
}

function findClosestName(hex: string): { name: string; distance: number } {
  const rgb = hexToRgb(hex);
  if (!rgb) return { name: 'Unknown', distance: Infinity };

  let best = { name: 'Unknown', distance: Infinity };
  for (const [colorHex, name] of Object.entries(COLOR_NAMES)) {
    const crgb = hexToRgb(colorHex);
    if (!crgb) continue;
    const dist = colorDistance(rgb, crgb);
    if (dist < best.distance) best = { name, distance: dist };
  }
  return best;
}

export default function ColorNameFinderClient() {
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [colorInput, setColorInput] = useState(DEFAULT_COLOR.toUpperCase());
  const [hexError, setHexError] = useState(false);
  const [copied, setCopied] = useState('');

  const rgb = hexToRgb(color);
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;
  const match = rgb ? findClosestName(color) : null;

  const variations =
    rgb && hsl
      ? [
          { name: 'Lighten 20%', hex: hslToHex(hsl.h, hsl.s, Math.min(100, hsl.l + 20)) },
          { name: 'Darken 20%', hex: hslToHex(hsl.h, hsl.s, Math.max(0, hsl.l - 20)) },
          { name: 'Saturate +20%', hex: hslToHex(hsl.h, Math.min(100, hsl.s + 20), hsl.l) },
          { name: 'Desaturate 20%', hex: hslToHex(hsl.h, Math.max(0, hsl.s - 20), hsl.l) },
        ]
      : [];

  const setColorValue = (value: string) => {
    setColor(value);
    setColorInput(value.toUpperCase());
    setHexError(false);
  };

  const handleColorInput = (value: string) => {
    setColorInput(value);
    if (isValidHex(value)) {
      setColor(value.startsWith('#') ? value : `#${value}`);
      setHexError(false);
    } else {
      setHexError(true);
    }
  };

  const copy = (label: string, value: string) => {
    navigator.clipboard.writeText(value).catch(() => {});
    setCopied(label);
    setTimeout(() => setCopied(''), 1500);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head" style={{ borderBottom: '1px solid var(--line)' }}>
        <span className="tb-v2-tool-label">Color Name Finder</span>
        <ToolExampleClearActions
          onExample={() => setColorValue(EXAMPLE_COLOR)}
          onClear={() => setColorValue(DEFAULT_COLOR)}
          canClear={color.toLowerCase() !== DEFAULT_COLOR.toLowerCase()}
        />
      </div>

      <div className="tb-v2-section" style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: 20 }}>
        <div className="flex gap-4 items-end">
          <div>
            <label className="tb-v2-tool-label" style={{ marginBottom: 8, display: 'block' }}>
              Pick a Color
            </label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColorValue(e.target.value)}
              className="rounded-lg cursor-pointer border-2 border-gray-200"
              style={{ width: 96, height: 96 }}
            />
          </div>
          <div className="flex-1">
            <label className="tb-v2-tool-label" style={{ marginBottom: 8, display: 'block' }}>
              Hex
            </label>
            <input
              type="text"
              value={colorInput}
              onChange={(e) => handleColorInput(e.target.value)}
              className="tb-v2-input"
              style={{ fontFamily: 'var(--f-mono)', fontSize: 18 }}
            />
            {hexError && (
              <p style={{ fontSize: 12, color: '#ef4444', marginTop: 6 }}>
                Enter a valid 6-digit hex color (e.g., #3366FF).
              </p>
            )}
          </div>
        </div>

        {match && (
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6 text-center">
            <div className="text-2xl font-bold mb-1" style={{ color }}>
              {match.name}
            </div>
            <div className="text-sm text-gray-500">
              Closest CSS named color, distance {Math.round(match.distance)}
            </div>
          </div>
        )}

        {rgb && hsl && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <button type="button" onClick={() => copy('hex', color.toUpperCase())} className="bg-gray-50 rounded p-3 text-left">
              <span className="text-gray-500">HEX</span>
              <div className="font-mono font-medium">{copied === 'hex' ? 'Copied' : color.toUpperCase()}</div>
            </button>
            <button
              type="button"
              onClick={() => copy('rgb', `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}
              className="bg-gray-50 rounded p-3 text-left"
            >
              <span className="text-gray-500">RGB</span>
              <div className="font-mono font-medium">
                {copied === 'rgb' ? 'Copied' : `${rgb.r}, ${rgb.g}, ${rgb.b}`}
              </div>
            </button>
            <button
              type="button"
              onClick={() => copy('hsl', `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)}
              className="bg-gray-50 rounded p-3 text-left"
            >
              <span className="text-gray-500">HSL</span>
              <div className="font-mono font-medium">
                {copied === 'hsl' ? 'Copied' : `${hsl.h}°, ${hsl.s}%, ${hsl.l}%`}
              </div>
            </button>
            <div className="bg-gray-50 rounded p-3">
              <span className="text-gray-500">Name</span>
              <div className="font-medium">{match?.name}</div>
            </div>
          </div>
        )}

        {variations.length > 0 && (
          <div>
            <div className="tb-v2-tool-label" style={{ marginBottom: 8 }}>
              Variations
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {variations.map((v) => (
                <button key={v.name} type="button" onClick={() => copy(v.name, v.hex.toUpperCase())} className="text-center">
                  <div className="h-16 rounded-lg border mb-1" style={{ backgroundColor: v.hex }} />
                  <div className="text-xs">{v.name}</div>
                  <div className="text-xs font-mono text-gray-500">
                    {copied === v.name ? 'Copied' : v.hex.toUpperCase()}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
