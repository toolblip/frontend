'use client';

import React, { useState } from 'react';

function toRgb(hex: string) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r ? {r:parseInt(r[1],16),g:parseInt(r[2],16),b:parseInt(r[3],16)} : null;
}

export default function ColorPickerApiClient() {
  const [color, setColor] = useState('#6366f1');
  const rgb = toRgb(color);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <input type="color" value={color} onChange={e=>setColor(e.target.value)} className="w-20 h-20 rounded-xl cursor-pointer border-2 border-gray-200" />
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium mb-1">Color (HEX)</label>
          <input type="text" value={color} onChange={e=>setColor(e.target.value)} className="w-full px-4 py-3 border rounded-xl font-mono text-lg" />
        </div>
      </div>

      {rgb&&(
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 rounded-lg p-3"><span className="text-gray-500">HEX</span><div className="font-mono font-medium mt-1">{color.toUpperCase()}</div></div>
          <div className="bg-gray-50 rounded-lg p-3"><span className="text-gray-500">RGB</span><div className="font-mono font-medium mt-1">{rgb.r},{rgb.g},{rgb.b}</div></div>
        </div>
      )}
    </div>
  );
}
