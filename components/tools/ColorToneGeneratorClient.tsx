'use client';

import React, { useState } from 'react';

export default function ColorToneGeneratorClient() {
  const [color, setColor] = useState('#6366f1');

  const toRgb = (hex: string) => {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return r ? { r: parseInt(r[1], 16), g: parseInt(r[2], 16), b: parseInt(r[3], 16) } : null;
  };

  const rgb = toRgb(color);
  const toHex = (v: number) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0');

  const tones = rgb ? [1, 0.85, 0.7, 0.55, 0.4, 0.25].map(f => {
    const gray = Math.round(0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b);
    const r = Math.round(rgb.r * f + gray * (1 - f));
    const g = Math.round(rgb.g * f + gray * (1 - f));
    const b = Math.round(rgb.b * f + gray * (1 - f));
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }) : [];

  return (
    <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:20,padding:"20px"}}>
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-20 h-20 rounded-xl cursor-pointer border-2 border-gray-200" />
        <div className="flex-1 w-full">
          <input type="text" value={color.toUpperCase()} onChange={e => setColor(e.target.value)} className="w-full px-4 py-3 border rounded-xl font-mono text-lg" />
        </div>
      </div>
      <div>
        <div className="text-xs text-gray-500 mb-2">Tones</div>
        <div className="tb-v2-mode-tabs">
          {tones.map((t, i) => <div key={i} className="flex-1 h-16 rounded-lg" style={{ backgroundColor: t }} title={t} />)}
        </div>
      </div>
    </div>
  );
}
