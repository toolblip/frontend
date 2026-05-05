'use client';

import React, { useState } from 'react';

export default function ColorPickerV2Client() {
  const [color, setColor] = useState('#6366f1');

  const toRgb = (hex: string) => {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return r ? { r: parseInt(r[1], 16), g: parseInt(r[2], 16), b: parseInt(r[3], 16) } : null;
  };

  const toHsl = (hex: string) => {
    const rgb = toRgb(hex);
    if (!rgb) return null;
    const rn = rgb.r / 255, gn = rgb.g / 255, bn = rgb.b / 255;
    const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break;
        case gn: h = ((bn - rn) / d + 2) / 6; break;
        case bn: h = ((rn - gn) / d + 4) / 6; break;
      }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const rgb = toRgb(color);
  const hsl = toHsl(color);

  return (
    <div className="space-y-6">
      <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-full h-48 rounded-2xl cursor-pointer border-0" />
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'HEX', value: color.toUpperCase() },
          { label: 'RGB', value: rgb ? `${rgb.r},${rgb.g},${rgb.b}` : '' },
          { label: 'HSL', value: hsl ? `${hsl.h}°,${hsl.s}%,${hsl.l}%` : '' },
        ].map(item => (
          <div key={item.label} className="bg-gray-50 rounded-xl p-4 text-center">
            <div className="text-xs text-gray-500 mb-1">{item.label}</div>
            <div className="font-mono font-bold">{item.value}</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl h-16" style={{ backgroundColor: color }} />
    </div>
  );
}
