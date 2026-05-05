'use client';

import React, { useState } from 'react';

export default function ColorPickerPrimeClient() {
  const [color, setColor] = useState('#0ea5e9');

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
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-20 h-20 rounded-full cursor-pointer border-4 border-gray-200" />
        <div className="flex-1 w-full space-y-2">
          <input type="text" value={color.toUpperCase()} onChange={e => setColor(e.target.value)} className="w-full px-4 py-3 border rounded-xl font-mono text-xl" />
          {rgb && <div className="text-sm text-gray-500">RGB: {rgb.r}, {rgb.g}, {rgb.b}</div>}
          {hsl && <div className="text-sm text-gray-500">HSL: {hsl.h}°, {hsl.s}%, {hsl.l}%</div>}
        </div>
      </div>
      <div className="rounded-2xl h-24" style={{ backgroundColor: color }} />
    </div>
  );
}
