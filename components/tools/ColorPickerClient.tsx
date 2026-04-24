'use client';

import { useState, useEffect } from 'react';

function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : null;
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
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

export default function ColorPickerClient() {
  const [color, setColor] = useState('#EF4444');
  const [hex, setHex] = useState('#EF4444');
  const [rgb, setRgb] = useState({ r: 34, g: 197, b: 94 });
  const [hsl, setHsl] = useState({ h: 142, s: 70, l: 45 });

  useEffect(() => {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
    if (m) {
      const r = parseInt(m[1], 16), g = parseInt(m[2], 16), b = parseInt(m[3], 16);
      setRgb({ r, g, b });
      setHsl(rgbToHsl(r, g, b));
      setHex(color.startsWith('#') ? color.toUpperCase() : '#' + color.toUpperCase());
    }
  }, [color]);

  const copy = (val: string) => navigator.clipboard.writeText(val);

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <input
          type="color"
          value={color}
          onChange={e => setColor(e.target.value)}
          className="w-16 h-12 rounded-lg cursor-pointer border-0"
        />
        <input
          value={color}
          onChange={e => setColor(e.target.value)}
          placeholder="#EF4444"
          className="flex-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 font-mono text-sm focus:outline-none focus:border-red-500"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'HEX', value: hex },
          { label: 'RGB', value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
          { label: 'HSL', value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1.5 font-medium">{label}</div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm text-gray-800 dark:text-gray-200">{value}</span>
              <button onClick={() => copy(value)} className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 font-medium">Copy</button>
            </div>
          </div>
        ))}
      </div>
      <div
        className="w-full h-20 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center text-white font-bold text-lg"
        style={{ backgroundColor: color }}
      >
        Preview - {hex}
      </div>
    </div>
  );
}
