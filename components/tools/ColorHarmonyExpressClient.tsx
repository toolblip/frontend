'use client';

import React, { useState } from 'react';

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
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

function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const r = Math.round(hue2rgb(p, q, h / 360 + 1/3) * 255);
  const g = Math.round(hue2rgb(p, q, h / 360) * 255);
  const b = Math.round(hue2rgb(p, q, h / 360 - 1/3) * 255);
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

type HarmonyType = 'complementary' | 'analogous' | 'triadic' | 'split' | 'tetradic' | 'monochromatic';

export default function ColorHarmonyExpressClient() {
  const [base, setBase] = useState('#6366f1');
  const [harmony, setHarmony] = useState<HarmonyType>('complementary');

  const hsl = hexToHsl(base);

  const getColors = (): string[] => {
    switch (harmony) {
      case 'complementary': return [base, hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l)];
      case 'analogous': return [base, hslToHex((hsl.h + 330) % 360, hsl.s, hsl.l), hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l)];
      case 'triadic': return [base, hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l), hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l)];
      case 'split': return [base, hslToHex((hsl.h + 150) % 360, hsl.s, hsl.l), hslToHex((hsl.h + 210) % 360, hsl.s, hsl.l)];
      case 'tetradic': return [base, hslToHex((hsl.h + 90) % 360, hsl.s, hsl.l), hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l), hslToHex((hsl.h + 270) % 360, hsl.s, hsl.l)];
      case 'monochromatic': return [base, hslToHex(hsl.h, hsl.s, Math.max(hsl.l - 30, 10)), hslToHex(hsl.h, hsl.s, Math.max(hsl.l - 15, 10)), hslToHex(hsl.h, hsl.s, Math.min(hsl.l + 15, 90)), hslToHex(hsl.h, hsl.s, Math.min(hsl.l + 30, 90))];
    }
  };

  const colors = getColors();
  const copyAll = () => navigator.clipboard.writeText(colors.join('\n'));

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Color Harmony Express</h1>

      <div className="flex gap-4 mb-6">
        <input
          type="color"
          value={base}
          onChange={e => setBase(e.target.value)}
          className="w-16 h-16 rounded cursor-pointer"
        />
        <div className="flex-1">
          <div className="text-sm text-gray-500 mb-1">Base: {base.toUpperCase()}</div>
          <input
            type="text"
            value={base}
            onChange={e => setBase(e.target.value)}
            className="w-full p-2 border rounded font-mono"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {(['complementary', 'analogous', 'triadic', 'split', 'tetradic', 'monochromatic'] as HarmonyType[]).map(h => (
          <button
            key={h}
            onClick={() => setHarmony(h)}
            className={`px-3 py-1 rounded text-sm ${harmony === h ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            {h.charAt(0).toUpperCase() + h.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid gap-3 mb-6" style={{ gridTemplateColumns: `repeat(${Math.min(colors.length, 5)}, 1fr)` }}>
        {colors.map((c, i) => (
          <div key={i} className="text-center">
            <div className="w-full aspect-square rounded-lg mb-1 border" style={{ backgroundColor: c }} />
            <span className="text-xs font-mono">{c.toUpperCase()}</span>
          </div>
        ))}
      </div>

      <button onClick={copyAll} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm">
        Copy All Colors
      </button>
    </div>
  );
}
