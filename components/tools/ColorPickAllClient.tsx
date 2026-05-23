'use client';

import React, { useState } from 'react';

export default function ColorPickAllClient() {
  const [color, setColor] = useState('#6366f1');
  const [format, setFormat] = useState<'hex'|'rgb'|'hsl'>('hex');
  const rgb = (() => {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
    return r ? {r:parseInt(r[1],16),g:parseInt(r[2],16),b:parseInt(r[3],16)} : null;
  })();

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

  const formats = [
    { label:'HEX', value: color.toUpperCase() },
    { label:'RGB', value: rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : ' - ' },
    { label:'HSL', value: rgb ? `hsl(${toHsl(rgb.r,rgb.g,rgb.b).h}, ${toHsl(rgb.r,rgb.g,rgb.b).s}%, ${toHsl(rgb.r,rgb.g,rgb.b).l}%)` : ' - ' },
    { label:'RGB %', value: rgb ? `${Math.round(rgb.r/255*100)}%, ${Math.round(rgb.g/255*100)}%, ${Math.round(rgb.b/255*100)}%` : ' - ' },
    { label:'HEX 6', value: color.replace('#','').toUpperCase() },
    { label:'CSS rgb()', value: rgb ? `rgb(${rgb.r} ${rgb.g} ${rgb.b})` : ' - ' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <input type="color" value={color} onChange={e=>setColor(e.target.value)} className="w-20 h-20 rounded-lg cursor-pointer border-2 border-gray-200" />
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium mb-1">Color</label>
          <input type="text" value={color} onChange={e=>setColor(e.target.value)} className="w-full px-4 py-3 border rounded-lg font-mono text-lg" />
        </div>
        <div className="flex gap-2">
          {(['hex','rgb','hsl'] as const).map(f=>(
            <button key={f} onClick={()=>setFormat(f)} className={`px-4 py-2 rounded-lg text-sm ${format===f?'bg-indigo-600 text-white':'bg-gray-100 hover:bg-gray-200'}`}>{f.toUpperCase()}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {formats.map(f=>(
          <div key={f.label} className="bg-gray-50 rounded-lg p-4">
            <div className="text-xs text-gray-500 mb-1">{f.label}</div>
            <div className="font-mono font-medium text-sm truncate">{f.value}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {['#ef4444','#f97316','#eab308','#22c55e','#3b82f6','#8b5cf6','#ec4899','#000000','#ffffff'].map(c=>(
          <div key={c} onClick={()=>setColor(c)} className="w-10 h-10 rounded-full border-2 border-gray-200 cursor-pointer hover:scale-110 transition-transform" style={{backgroundColor:c}}/>
        ))}
      </div>
    </div>
  );
}
