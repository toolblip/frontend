'use client';

import React, { useState } from 'react';

export default function ColorSaturationAdjusterClient() {
  const [color, setColor] = useState('#6366f1');
  const [saturation, setSaturation] = useState(100);

  const toRgb = (hex: string) => {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return r ? { r: parseInt(r[1], 16), g: parseInt(r[2], 16), b: parseInt(r[3], 16) } : null;
  };

  const rgb = toRgb(color);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-20 h-20 rounded-xl cursor-pointer border-2 border-gray-200" />
        <div className="flex-1 w-full">
          <input type="text" value={color.toUpperCase()} onChange={e => setColor(e.target.value)} className="w-full px-4 py-3 border rounded-xl font-mono text-lg" />
        </div>
      </div>
      <div>
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Saturation</span><span>{saturation}%</span>
        </div>
        <input type="range" min="0" max="200" value={saturation} onChange={e => setSaturation(Number(e.target.value))} className="w-full" />
      </div>
      {rgb && (
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="text-xs text-gray-500 mb-1">RGB</div>
          <div className="font-mono font-medium">{rgb.r}, {rgb.g}, {rgb.b}</div>
        </div>
      )}
      <div className="rounded-xl h-16" style={{ backgroundColor: color }} />
    </div>
  );
}
