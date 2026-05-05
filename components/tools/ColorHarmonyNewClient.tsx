'use client';

import React, { useState } from 'react';

function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  const r = Math.round(hue2rgb(p, q, h / 360 + 1/3) * 255);
  const g = Math.round(hue2rgb(p, q, h / 360) * 255);
  const b = Math.round(hue2rgb(p, q, h / 360 - 1/3) * 255);
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

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

export default function ColorHarmonyNewClient() {
  const [base, setBase] = useState('#3b82f6');
  const [mode, setMode] = useState<'complement' | 'triad' | 'analogous' | 'split' | 'double'>('analogous');

  const hsl = hexToHsl(base);
  const offsets: Record<string, number[]> = {
    complement: [180],
    triad: [120, 240],
    analogous: [-30, 30],
    split: [150, 210],
    double: [180, 90],
  };

  const palette = [base, ...offsets[mode].map(o => hslToHex((hsl.h + o + 360) % 360, hsl.s, hsl.l))];

  const copy = (c: string) => navigator.clipboard.writeText(c);
  const copyAll = () => navigator.clipboard.writeText(palette.join('\n'));

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Color Harmony New</h1>

      <div className="flex gap-4 mb-6">
        <input type="color" value={base} onChange={e => setBase(e.target.value)} className="w-16 h-16 rounded cursor-pointer" />
        <div className="flex-1">
          <input type="text" value={base} onChange={e => setBase(e.target.value)} className="w-full p-2 border rounded font-mono mb-2" />
          <div className="flex gap-1">
            {palette.map((c, i) => (
              <div key={i} className="flex-1 h-8 rounded" style={{ backgroundColor: c }} />
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {Object.keys(offsets).map(m => (
          <button key={m} onClick={() => setMode(m as typeof mode)}
            className={`px-3 py-1 rounded text-sm ${mode === m ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-2 mb-4">
        {palette.map((c, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded">
            <div className="w-10 h-10 rounded border" style={{ backgroundColor: c }} />
            <span className="font-mono text-sm flex-1">{c.toUpperCase()}</span>
            <button onClick={() => copy(c)} className="px-2 py-1 text-xs bg-gray-200 rounded">Copy</button>
          </div>
        ))}
      </div>

      <button onClick={copyAll} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm">
        Copy All ({palette.length} colors)
      </button>
    </div>
  );
}
