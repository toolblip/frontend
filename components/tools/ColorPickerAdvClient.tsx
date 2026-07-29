'use client';

import React, { useState } from 'react';

function toRgb(hex: string) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r ? {r:parseInt(r[1],16),g:parseInt(r[2],16),b:parseInt(r[3],16)} : null;
}

export default function ColorPickerAdvClient() {
  const [color, setColor] = useState('#6366f1');
  const [copied, setCopied] = useState('');
  const rgb = toRgb(color);

  const copy = (val: string) => {
    navigator.clipboard.writeText(val);
    setCopied(val);
    setTimeout(() => setCopied(''), 1500);
  };

  return (
    <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:20,padding:"20px"}}>
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <input type="color" value={color} onChange={e=>setColor(e.target.value)} className="w-24 h-24 rounded-2xl cursor-pointer border-2 border-gray-200 shadow-md" />
        <div className="flex-1 w-full">
          <input type="text" value={color} onChange={e=>setColor(e.target.value)} className="w-full px-4 py-3 border-2 rounded-xl font-mono text-xl tracking-wider" />
        </div>
      </div>

      {rgb&&(
        <div className="space-y-3">
          {[
            {label:'HEX', val:color.toUpperCase()},
            {label:'RGB', val:`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`},
            {label:'RGB %', val:`${Math.round(rgb.r/255*100)}%, ${Math.round(rgb.g/255*100)}%, ${Math.round(rgb.b/255*100)}%`},
            {label:'HEX 3', val:color.replace('#','')},
          ].map(f=>(
            <div key={f.label} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
              <span className="text-sm text-gray-500">{f.label}</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-medium">{f.val}</span>
                <button onClick={()=>copy(f.val)} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">{copied===f.val?'✓':'Copy'}</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
