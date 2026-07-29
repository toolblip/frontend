'use client';

import React, { useState } from 'react';

export default function ColorPickerCompleteClient() {
  const [color, setColor] = useState('#6366f1');
  const [format, setFormat] = useState<'hex' | 'rgb' | 'hsl'>('hex');

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

  const rgb = toRgb(color);
  const hsl = toHsl(color);

  const getValue = () => {
    if (format === 'hex') return color.toUpperCase();
    if (format === 'rgb' && rgb) return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    if (format === 'hsl' && hsl) return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    return '';
  };

  const formats = [
    { key: 'hex', label: 'HEX', value: color.toUpperCase() },
    { key: 'rgb', label: 'RGB', value: rgb ? `${rgb.r}, ${rgb.g}, ${rgb.b}` : '' },
    { key: 'hsl', label: 'HSL', value: hsl ? `${hsl.h}°, ${hsl.s}%, ${hsl.l}%` : '' },
  ];

  return (
    <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:20,padding:"20px"}}>
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-20 h-20 rounded-xl cursor-pointer border-2 border-gray-200" />
        <div className="flex-1 w-full space-y-2">
          <label className="text-xs text-gray-500">HEX Input</label>
          <input type="text" value={color.toUpperCase()} onChange={e => setColor(e.target.value)} className="w-full px-4 py-3 border rounded-xl font-mono text-lg" />
        </div>
      </div>

      <div className="tb-v2-mode-tabs">
        {formats.map(f => (
          <button key={f.key} onClick={() => setFormat(f.key as typeof format)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${format === f.key ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="bg-gray-50 rounded-xl p-4">
        <div className="text-xs text-gray-500 mb-1">{format.toUpperCase()} Value</div>
        <div className="font-mono text-lg break-all">{getValue()}</div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        {formats.map(f => (
          <div key={f.key} className="bg-gray-50 rounded p-3">
            <span className="text-gray-500">{f.label}</span>
            <div className="font-mono font-medium">{f.value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl overflow-hidden h-20" style={{ backgroundColor: color }} />
    </div>
  );
}
