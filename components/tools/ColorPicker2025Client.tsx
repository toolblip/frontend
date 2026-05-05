'use client';

import React, { useState } from 'react';

export default function ColorPicker2025Client() {
  const [color, setColor] = useState('#6366f1');

  const toRgb = (hex: string) => {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return r ? {r:parseInt(r[1],16),g:parseInt(r[2],16),b:parseInt(r[3],16)} : null;
  };

  const toHsl = (r:number,g:number,b:number) => {
    r/=255;g/=255;b/=255;
    const max=Math.max(r,g,b),min=Math.min(r,g,b);
    let h=0,s=0;const l=(max+min)/2;
    if(max!==min){
      const d=max-min;s=l>0.5?d/(2-max-min):d/(max+min);
      switch(max){case r:h=((g-b)/d+(g<b?6:0))/6;break;case g:h=((b-r)/d+2)/6;break;case b:h=((r-g)/d+4)/6;break;}
    }
    return {h:Math.round(h*360),s:Math.round(s*100),l:Math.round(l*100)};
  };

  const rgb = toRgb(color);
  const hsl = rgb ? toHsl(rgb.r,rgb.g,rgb.b) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <input type="color" value={color} onChange={e=>setColor(e.target.value)} className="w-32 h-32 rounded-2xl cursor-pointer border-4 border-gray-100 shadow-lg" />
        <div className="flex-1 space-y-4 w-full">
          <div>
            <label className="text-sm text-gray-500 mb-1 block">Color Preview</label>
            <div className="h-16 rounded-xl border border-gray-200" style={{backgroundColor:color}}/>
          </div>
          <div>
            <label className="text-sm text-gray-500 mb-1 block">Hex Value</label>
            <input type="text" value={color} onChange={e=>setColor(e.target.value)} className="w-full px-4 py-3 border-2 rounded-xl font-mono text-lg" />
          </div>
        </div>
      </div>

      {rgb&&hsl&&(
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="bg-gray-50 rounded-xl p-4"><span className="text-gray-500 block mb-1">HEX</span><span className="font-mono font-medium">{color.toUpperCase()}</span></div>
          <div className="bg-gray-50 rounded-xl p-4"><span className="text-gray-500 block mb-1">RGB</span><span className="font-mono font-medium">{rgb.r}, {rgb.g}, {rgb.b}</span></div>
          <div className="bg-gray-50 rounded-xl p-4"><span className="text-gray-500 block mb-1">HSL</span><span className="font-mono font-medium">{hsl.h}°, {hsl.s}%, {hsl.l}%</span></div>
        </div>
      )}
    </div>
  );
}
