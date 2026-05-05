'use client';

import React, { useState } from 'react';

export default function ColorShadeGeneratorClient() {
  const [color, setColor] = useState('#6366f1');

  const toRgb = (hex: string) => {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return r ? { r: parseInt(r[1], 16), g: parseInt(r[2], 16), b: parseInt(r[3], 16) } : null;
  };

  const rgb = toRgb(color);
  const toHex = (v: number) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0');

  const shades = rgb
    ? [1, 0.8, 0.6, 0.4, 0.2].map(f => {
        const r = Math.round(rgb.r * f);
        const g = Math.round(rgb.g * f);
        const b = Math.round(rgb.b * f);
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
      })
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-20 h-20 rounded-xl cursor-pointer border-2 border-gray-200" />
        <div className="flex-1 w-full">
          <input type="text" value={color.toUpperCase()} onChange={e => setColor(e.target.value)} className="w-full px-4 py-3 border rounded-xl font-mono text-lg" />
        </div>
      </div>
      <div>
        <div className="text-xs text-gray-500 mb-2">Shades</div>
        <div className="flex gap-2">
          {shades.map((s, i) => (
            <div key={i} className="flex-1 h-16 rounded-lg flex items-end justify-center pb-1" style={{ backgroundColor: s }}>
              <span className="text-xs font-mono" style={{ color: i > 1 ? '#fff' : '#000' }}>{s}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
