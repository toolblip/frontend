'use client';

import React, { useState } from 'react';

export default function ColorPickToolClient() {
  const [color, setColor] = useState('#6366f1');

  const hexToRgb = (hex: string) => {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return r ? {r:parseInt(r[1],16),g:parseInt(r[2],16),b:parseInt(r[3],16)} : null;
  };

  const rgb = hexToRgb(color);
  const rgbStr = rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : '—';

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <input type="color" value={color} onChange={e=>setColor(e.target.value)} className="w-24 h-24 rounded-xl cursor-pointer border-4 border-gray-100 shadow-lg" />
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Hex</label>
          <input type="text" value={color} onChange={e=>setColor(e.target.value)} className="w-full px-4 py-3 border-2 rounded-xl font-mono text-xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl p-4 text-center" style={{backgroundColor:color+'22'}}>
          <div className="text-xs text-gray-500 mb-1">Lighten</div>
          <div className="h-12 rounded-lg" style={{backgroundColor:color+'88'}}/>
        </div>
        <div className="rounded-xl p-4 text-center border-2 border-gray-200">
          <div className="text-xs text-gray-500 mb-1">Current</div>
          <div className="h-12 rounded-lg" style={{backgroundColor:color}}/>
        </div>
        <div className="rounded-xl p-4 text-center" style={{backgroundColor:color+'22'}}>
          <div className="text-xs text-gray-500 mb-1">Darken</div>
          <div className="h-12 rounded-lg" style={{backgroundColor:color+'44'}}/>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4">
        <div className="font-mono text-sm space-y-1">
          <div className="flex justify-between"><span className="text-gray-500">HEX:</span><span>{color.toUpperCase()}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">RGB:</span><span>{rgbStr}</span></div>
        </div>
      </div>
    </div>
  );
}
