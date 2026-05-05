'use client';

import React, { useState } from 'react';

export default function ColorPickerClassicClient() {
  const [color, setColor] = useState('#4f46e5');
  const [copied, setCopied] = useState('');

  const toRgb = (hex: string) => {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return r ? { r: parseInt(r[1], 16), g: parseInt(r[2], 16), b: parseInt(r[3], 16) } : null;
  };

  const toHsl = (hex: string) => {
    const rgb = toRgb(hex);
    if (!rgb) return null;
    const r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255;
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
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(''), 1500);
  };

  const rgb = toRgb(color);
  const hsl = toHsl(color);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-16 h-16 rounded-xl cursor-pointer border-2 border-gray-200" />
        <div className="flex-1 w-full">
          <label className="text-xs text-gray-500 mb-1 block">HEX</label>
          <input type="text" value={color.toUpperCase()} onChange={e => setColor(e.target.value)} className="w-full px-4 py-3 border rounded-xl font-mono text-lg" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: 'HEX', value: color.toUpperCase(), display: color.toUpperCase() },
          { label: 'RGB', value: rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : '', display: rgb ? `${rgb.r}, ${rgb.g}, ${rgb.b}` : '' },
          { label: 'HSL', value: hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : '', display: hsl ? `${hsl.h}°, ${hsl.s}%, ${hsl.l}%` : '' },
        ].map(item => (
          <div key={item.label} className="bg-gray-50 rounded-xl p-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-500">{item.label}</span>
              <button onClick={() => copy(item.value)} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                {copied === item.value ? '✓' : 'Copy'}
              </button>
            </div>
            <div className="font-mono font-medium text-sm">{item.display}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl overflow-hidden h-24" style={{ backgroundColor: color }} />
    </div>
  );
}
