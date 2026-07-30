'use client';

import React, { useState } from 'react';

export default function ColorPickerProClient() {
  const [color, setColor] = useState('#6366f1');
  const [copied, setCopied] = useState('');

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

  const loadExample = () => setColor('#ec4899');

  const copy = (label: string, value: string) => {
    navigator.clipboard.writeText(value).catch(() => {});
    setCopied(label);
    setTimeout(() => setCopied(''), 1500);
  };

  const items = [
    { key: 'hex', label: 'HEX', value: color.toUpperCase(), bg: 'bg-indigo-50', text: 'text-indigo-400' },
    { key: 'rgb', label: 'RGB', value: rgb ? `${rgb.r} ${rgb.g} ${rgb.b}` : '-', bg: 'bg-red-50', text: 'text-red-400' },
    { key: 'hsl', label: 'HSL', value: hsl ? `${hsl.h} ${hsl.s}% ${hsl.l}%` : '-', bg: 'bg-green-50', text: 'text-green-400' },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Color Picker Pro</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>

      <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:20,padding:"20px"}}>
        <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-full h-56 rounded-2xl cursor-pointer border-0 shadow-xl" />

        <div className="flex flex-col md:flex-row gap-3">
          {items.map(f => (
            <button key={f.key} type="button" onClick={() => copy(f.key, f.value)} className={`flex-1 ${f.bg} rounded-xl p-4 text-left`}>
              <div className={`text-xs ${f.text} mb-1`}>{f.label}</div>
              <div className="font-mono font-bold text-lg">{copied === f.key ? 'Copied' : f.value}</div>
            </button>
          ))}
        </div>

        <div>
          <div className="text-xs text-gray-500 mb-2">Presets</div>
          <div className="flex flex-wrap gap-2">
            {presets.map(p => (
              <button key={p} type="button" onClick={() => setColor(p)}
                className="w-8 h-8 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform"
                style={{ backgroundColor: p }} />
            ))}
          </div>
        </div>

        <div className="rounded-2xl h-24 shadow-lg" style={{ backgroundColor: color }} />
      </div>
    </div>
  );
}
