'use client';

import React, { useState } from 'react';

export default function ColorPickerNewClient() {
  const [color, setColor] = useState('#8b5cf6');

  const toRgb = (hex: string) => {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return r ? { r: parseInt(r[1], 16), g: parseInt(r[2], 16), b: parseInt(r[3], 16) } : null;
  };

  const rgb = toRgb(color);

  return (
    <div className="space-y-4">
      <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-full h-48 rounded-2xl cursor-pointer border-0" />
      <div className="flex gap-3">
        <div className="flex-1 bg-gray-50 rounded-xl p-4">
          <div className="text-xs text-gray-500">HEX</div>
          <div className="font-mono font-bold text-xl">{color.toUpperCase()}</div>
        </div>
        {rgb && (
          <div className="flex-1 bg-gray-50 rounded-xl p-4">
            <div className="text-xs text-gray-500">RGB</div>
            <div className="font-mono font-bold text-xl">{rgb.r},{rgb.g},{rgb.b}</div>
          </div>
        )}
      </div>
      <div className="rounded-xl h-16" style={{ backgroundColor: color }} />
    </div>
  );
}
