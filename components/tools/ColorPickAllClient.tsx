'use client';

import React, { useState } from 'react';

function isValidHex(hex: string): boolean {
  return /^#?[a-f\d]{6}$/i.test(hex);
}

export default function ColorPickAllClient() {
  const [color, setColor] = useState('#6366f1');
  const [colorInput, setColorInput] = useState('#6366f1');
  const [hexError, setHexError] = useState(false);
  const [copied, setCopied] = useState('');
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
    { label:'RGB', value: rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : '-' },
    { label:'HSL', value: rgb ? `hsl(${toHsl(rgb.r,rgb.g,rgb.b).h}, ${toHsl(rgb.r,rgb.g,rgb.b).s}%, ${toHsl(rgb.r,rgb.g,rgb.b).l}%)` : '-' },
    { label:'RGB %', value: rgb ? `${Math.round(rgb.r/255*100)}%, ${Math.round(rgb.g/255*100)}%, ${Math.round(rgb.b/255*100)}%` : '-' },
    { label:'HEX 6', value: color.replace('#','').toUpperCase() },
    { label:'CSS rgb()', value: rgb ? `rgb(${rgb.r} ${rgb.g} ${rgb.b})` : '-' },
  ];

  const setColorValue = (value: string) => {
    setColor(value);
    setColorInput(value);
    setHexError(false);
  };

  const handleColorInput = (value: string) => {
    setColorInput(value);
    if (isValidHex(value)) {
      setColor(value.startsWith('#') ? value : `#${value}`);
      setHexError(false);
    } else {
      setHexError(true);
    }
  };

  const loadExample = () => setColorValue('#22c55e');

  const copy = (label: string, value: string) => {
    navigator.clipboard.writeText(value).catch(() => {});
    setCopied(label);
    setTimeout(() => setCopied(''), 1500);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Color Picker - All Formats</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>

      <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:20,padding:"20px"}}>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <input type="color" value={color} onChange={e=>setColorValue(e.target.value)} className="w-20 h-20 rounded-lg cursor-pointer border-2 border-gray-200" />
          <div className="flex-1 w-full">
            <label className="tb-v2-tool-label" style={{marginBottom:8,display:'block'}}>Color</label>
            <input type="text" value={colorInput} onChange={e=>handleColorInput(e.target.value)} className="tb-v2-input" style={{fontFamily:'var(--f-mono)',fontSize:18}} />
            {hexError && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 6 }}>Enter a valid 6-digit hex color (e.g., #3366FF).</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {formats.map(f=>(
            <button
              key={f.label}
              type="button"
              onClick={() => copy(f.label, f.value)}
              className="bg-gray-50 rounded-lg p-4 text-left"
            >
              <div className="text-xs text-gray-500 mb-1">{f.label}</div>
              <div className="font-mono font-medium text-sm truncate">{copied === f.label ? 'Copied' : f.value}</div>
            </button>
          ))}
        </div>

        <div>
          <div className="tb-v2-tool-label" style={{marginBottom:8}}>Presets</div>
          <div className="flex gap-2 flex-wrap">
            {['#ef4444','#f97316','#eab308','#22c55e','#3b82f6','#8b5cf6','#ec4899','#000000','#ffffff'].map(c=>(
              <button key={c} type="button" onClick={()=>setColorValue(c)} className="w-10 h-10 rounded-full border-2 border-gray-200 cursor-pointer hover:scale-110 transition-transform" style={{backgroundColor:c}}/>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
