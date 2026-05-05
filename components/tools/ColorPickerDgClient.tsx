'use client';

import React, { useState } from 'react';

export default function ColorPickerDgClient() {
  const [color, setColor] = useState('#8b5cf6');

  const toRgb = (hex: string) => {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return r ? { r: parseInt(r[1], 16), g: parseInt(r[2], 16), b: parseInt(r[3], 16) } : null;
  };

  const toHex = (v: number) => v.toString(16).padStart(2, '0');

  const rgb = toRgb(color);
  const isLight = rgb ? (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000 > 150 : false;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-20 h-20 rounded-2xl cursor-pointer border-4 border-gray-100 shadow-sm" />
        <div className="flex-1 w-full">
          <input type="text" value={color.toUpperCase()} onChange={e => setColor(e.target.value)} className="w-full px-4 py-4 border-2 rounded-2xl font-mono text-xl" />
        </div>
      </div>

      {rgb && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="text-xs text-gray-500 mb-1">RGB</div>
            <div className="font-mono font-medium">{rgb.r}, {rgb.g}, {rgb.b}</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="text-xs text-gray-500 mb-1">HEX</div>
            <div className="font-mono font-medium">{color.toUpperCase()}</div>
          </div>
        </div>
      )}

      <div className="rounded-2xl overflow-hidden h-32 flex items-end relative" style={{ background: `linear-gradient(to right, #000, ${color})` }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-xl px-4 py-2 text-sm font-mono font-bold shadow-lg" style={{ backgroundColor: color, color: isLight ? '#000' : '#fff' }}>
            {color.toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
}
