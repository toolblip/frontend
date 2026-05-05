'use client';

import React, { useState } from 'react';

function toRgb(hex: string) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r ? {r:parseInt(r[1],16),g:parseInt(r[2],16),b:parseInt(r[3],16)} : null;
}

export default function ColorPickerAdvancedClient() {
  const [color, setColor] = useState('#6366f1');
  const rgb = toRgb(color);

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

  const hsl = rgb ? toHsl(rgb.r,rgb.g,rgb.b) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <input type="color" value={color} onChange={e=>setColor(e.target.value)} className="w-24 h-24 rounded-xl cursor-pointer border-2 border-gray-200" />
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium mb-1">Color</label>
          <input type="text" value={color} onChange={e=>setColor(e.target.value)} className="w-full px-4 py-3 border rounded-xl font-mono text-lg" />
        </div>
      </div>

      {rgb&&hsl&&(
        <div className="space-y-3">
          <div className="h-20 rounded-xl border border-gray-200" style={{backgroundColor:color}}/>
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="bg-gray-50 rounded-lg p-3"><span className="text-gray-500 block mb-1">HEX</span><span className="font-mono">{color.toUpperCase()}</span></div>
            <div className="bg-gray-50 rounded-lg p-3"><span className="text-gray-500 block mb-1">RGB</span><span className="font-mono">{rgb.r},{rgb.g},{rgb.b}</span></div>
            <div className="bg-gray-50 rounded-lg p-3"><span className="text-gray-500 block mb-1">HSL</span><span className="font-mono">{hsl.h},{hsl.s}%,{hsl.l}%</span></div>
          </div>
        </div>
      )}
    </div>
  );
}
