'use client';

import React, { useState } from 'react';

export default function ColorPickToolblipClient() {
  const [color, setColor] = useState('#6366f1');

  const toRgb = (hex: string) => {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return r ? {r:parseInt(r[1],16),g:parseInt(r[2],16),b:parseInt(r[3],16)} : null;
  };

  const rgb = toRgb(color);

  const presets = ['#ef4444','#f97316','#eab308','#22c55e','#3b82f6','#8b5cf6','#ec4899','#000000','#ffffff','#6b7280'];

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-end">
        <input type="color" value={color} onChange={e=>setColor(e.target.value)} className="w-20 h-20 rounded-2xl cursor-pointer border-2 border-gray-200" />
        <div className="flex-1">
          <input type="text" value={color} onChange={e=>setColor(e.target.value)} className="w-full px-4 py-3 border rounded-xl font-mono text-lg" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-gray-50 rounded-xl p-4"><span className="text-gray-500 block mb-1">HEX</span><span className="font-mono font-medium">{color.toUpperCase()}</span></div>
        <div className="bg-gray-50 rounded-xl p-4"><span className="text-gray-500 block mb-1">RGB</span><span className="font-mono font-medium">{rgb?`${rgb.r}, ${rgb.g}, ${rgb.b}`:' - '}</span></div>
      </div>

      <div className="flex flex-wrap gap-2">
        {presets.map(c=>(
          <button key={c} onClick={()=>setColor(c)} className="w-10 h-10 rounded-full border-2 border-gray-200 hover:scale-110 transition-transform" style={{backgroundColor:c}}/>
        ))}
      </div>
    </div>
  );
}
