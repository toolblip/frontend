'use client';

import React, { useState } from 'react';

export default function ColorPickerProClient() {
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

  const presets = ['#ef4444','#f97316','#eab308','#22c55e','#14b8a6','#3b82f6','#8b5cf6','#ec4899','#64748b','#000000','#ffffff','#f5f5f5'];

  return (
    <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:20,padding:"20px"}}>
      <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-full h-56 rounded-2xl cursor-pointer border-0 shadow-xl" />

      <div className="flex flex-col md:flex-row gap-3">
        {[
          { label: 'HEX', value: color.toUpperCase(), color: 'indigo' },
          { label: 'RGB', value: rgb ? `${rgb.r} ${rgb.g} ${rgb.b}` : '', color: 'red' },
          { label: 'HSL', value: hsl ? `${hsl.h} ${hsl.s}% ${hsl.l}%` : '', color: 'green' },
        ].map(f => (
          <div key={f.label} className={`flex-1 bg-${f.color}-50 rounded-xl p-4`}>
            <div className={`text-xs text-${f.color}-400 mb-1`}>{f.label}</div>
            <div className="font-mono font-bold text-lg">{f.value}</div>
          </div>
        ))}
      </div>

      <div className="tb-v2-mode-tabs">
        {presets.map(p => (
          <button key={p} onClick={() => setColor(p)}
            className="w-8 h-8 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform"
            style={{ backgroundColor: p }} />
        ))}
      </div>

      <div className="rounded-2xl h-24 shadow-lg" style={{ backgroundColor: color }} />
    </div>
  );
}
