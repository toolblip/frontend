'use client';

import React, { useState } from 'react';

export default function ColorPickerV4Client() {
  const [color, setColor] = useState('#6366f1');

  const toRgb = (hex: string) => {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return r ? { r: parseInt(r[1], 16), g: parseInt(r[2], 16), b: parseInt(r[3], 16) } : null;
  };

  const rgb = toRgb(color);

  return (
    <div className="space-y-4">
      <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-full h-40 rounded-xl cursor-pointer border-0" />
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 rounded-xl p-3">
          <div className="text-xs text-gray-500">HEX</div>
          <div className="font-mono font-bold">{color.toUpperCase()}</div>
        </div>
        {rgb && (
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="text-xs text-gray-500">RGB</div>
            <div className="font-mono font-bold">{rgb.r},{rgb.g},{rgb.b}</div>
          </div>
        )}
      </div>
      <div className="rounded-xl h-12" style={{ backgroundColor: color }} />
    </div>
  );
}
