'use client';

import { useState } from 'react';

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
  return '#' + [r, g, b].map((x) => Math.round(x).toString(16).padStart(2, '0')).join('');
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

export default function HexRgbHslColorPickerClient() {
  const [color, setColor] = useState('#3b82f6');
  const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 });
  const [hsl, setHsl] = useState({ h: 217, s: 91, l: 60 });

  const updateFromHex = (hex: string) => {
    setColor(hex);
    const rgbVal = hexToRgb(hex);
    if (rgbVal) {
      setRgb(rgbVal);
      setHsl(rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b));
    }
  };

  const updateFromRgb = (r: number, g: number, b: number) => {
    setRgb({ r, g, b });
    setColor(rgbToHex(r, g, b));
    setHsl(rgbToHsl(r, g, b));
  };

  const updateFromHsl = (h: number, s: number, l: number) => {
    setHsl({ h, s, l });
    const rgbVal = hslToRgb(h, s, l);
    setRgb(rgbVal);
    setColor(rgbToHex(rgbVal.r, rgbVal.g, rgbVal.b));
  };

  return (
    <div className="tb-v2-card">
      <div className="tb-v2-card-header">
        <h2 className="tb-v2-card-title">Color Picker</h2>
        <p className="tb-v2-card-description">Pick colors in Hex, RGB, or HSL format</p>
      </div>

      <div
        className="h-40 rounded-lg mb-6 border"
        style={{ backgroundColor: color }}
      />

      <div className="space-y-4 mb-6">
        <div className="tb-v2-form-group">
          <label className="tb-v2-label">Hex</label>
          <div className="flex gap-3">
            <input
              type="color"
              value={color}
              onChange={(e) => updateFromHex(e.target.value)}
              className="tb-v2-input h-12 w-20 cursor-pointer"
            />
            <input
              type="text"
              value={color.toUpperCase()}
              onChange={(e) => updateFromHex(e.target.value)}
              className="tb-v2-input flex-1 uppercase"
            />
          </div>
        </div>

        <div className="tb-v2-form-group">
          <label className="tb-v2-label">RGB</label>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <span className="text-xs text-gray-500">R</span>
              <input
                type="number"
                value={rgb.r}
                onChange={(e) => updateFromRgb(parseInt(e.target.value) || 0, rgb.g, rgb.b)}
                className="tb-v2-input w-full"
                min="0"
                max="255"
              />
            </div>
            <div>
              <span className="text-xs text-gray-500">G</span>
              <input
                type="number"
                value={rgb.g}
                onChange={(e) => updateFromRgb(rgb.r, parseInt(e.target.value) || 0, rgb.b)}
                className="tb-v2-input w-full"
                min="0"
                max="255"
              />
            </div>
            <div>
              <span className="text-xs text-gray-500">B</span>
              <input
                type="number"
                value={rgb.b}
                onChange={(e) => updateFromRgb(rgb.r, rgb.g, parseInt(e.target.value) || 0)}
                className="tb-v2-input w-full"
                min="0"
                max="255"
              />
            </div>
          </div>
        </div>

        <div className="tb-v2-form-group">
          <label className="tb-v2-label">HSL</label>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <span className="text-xs text-gray-500">H</span>
              <input
                type="number"
                value={hsl.h}
                onChange={(e) => updateFromHsl(parseInt(e.target.value) || 0, hsl.s, hsl.l)}
                className="tb-v2-input w-full"
                min="0"
                max="360"
              />
            </div>
            <div>
              <span className="text-xs text-gray-500">S</span>
              <input
                type="number"
                value={hsl.s}
                onChange={(e) => updateFromHsl(hsl.h, parseInt(e.target.value) || 0, hsl.l)}
                className="tb-v2-input w-full"
                min="0"
                max="100"
              />
            </div>
            <div>
              <span className="text-xs text-gray-500">L</span>
              <input
                type="number"
                value={hsl.l}
                onChange={(e) => updateFromHsl(hsl.h, hsl.s, parseInt(e.target.value) || 0)}
                className="tb-v2-input w-full"
                min="0"
                max="100"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="tb-v2-card p-4 bg-gray-50">
        <div className="text-center font-mono text-lg">
          {color.toUpperCase()} | rgb({rgb.r}, {rgb.g}, {rgb.b}) | hsl({hsl.h}, {hsl.s}%, {hsl.l}%)
        </div>
      </div>
    </div>
  );
}
