'use client';

import React, { useState } from 'react';

export default function ColorPickerWebClient() {
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
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 bg-gray-50 rounded-xl p-4">
          <div className="text-xs text-gray-500">HEX</div>
          <div className="font-mono font-bold text-lg">{color.toUpperCase()}</div>
        </div>
        {rgb && (
          <div className="flex-1 bg-gray-50 rounded-xl p-4">
            <div className="text-xs text-gray-500">RGB</div>
            <div className="font-mono font-bold text-lg">{rgb.r},{rgb.g},{rgb.b}</div>
          </div>
        )}
        {hsl && (
          <div className="flex-1 bg-gray-50 rounded-xl p-4">
            <div className="text-xs text-gray-500">HSL</div>
            <div className="font-mono font-bold text-lg">{hsl.h}° {hsl.s}% {hsl.l}%</div>
          </div>
        )}
      </div>
      <div className="rounded-xl h-16" style={{ backgroundColor: color }} />
    </div>
  );
}
