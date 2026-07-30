'use client';

import React, { useState } from 'react';

function toRgb(hex: string) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r ? {r:parseInt(r[1],16),g:parseInt(r[2],16),b:parseInt(r[3],16)} : null;
}

function isValidHex(hex: string): boolean {
  return /^#?[a-f\d]{6}$/i.test(hex);
}

export default function ColorPickerAdvancedClient() {
  const [color, setColor] = useState('#6366f1');
  const [colorInput, setColorInput] = useState('#6366f1');
  const [hexError, setHexError] = useState(false);
  const [copied, setCopied] = useState('');
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

  const copy = (label: string, val: string) => {
    navigator.clipboard.writeText(val).catch(() => {});
    setCopied(label);
    setTimeout(() => setCopied(''), 1500);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Color Picker Advanced</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>

      <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:20,padding:"20px"}}>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <input type="color" value={color} onChange={e=>setColorValue(e.target.value)} className="w-24 h-24 rounded-xl cursor-pointer border-2 border-gray-200" />
          <div className="flex-1 w-full">
            <label className="tb-v2-tool-label" style={{marginBottom:8,display:'block'}}>Color</label>
            <input type="text" value={colorInput} onChange={e=>handleColorInput(e.target.value)} className="tb-v2-input" style={{fontFamily:'var(--f-mono)',fontSize:18}} />
            {hexError && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 6 }}>Enter a valid 6-digit hex color (e.g., #3366FF).</p>}
          </div>
        </div>

        {rgb&&hsl&&(
          <div className="space-y-3">
            <div className="h-20 rounded-xl border border-gray-200" style={{backgroundColor:color}}/>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <button type="button" onClick={() => copy('hex', color.toUpperCase())} className="bg-gray-50 rounded-lg p-3 text-left">
                <span className="text-gray-500 block mb-1">HEX</span>
                <span className="font-mono">{copied === 'hex' ? 'Copied' : color.toUpperCase()}</span>
              </button>
              <button type="button" onClick={() => copy('rgb', `${rgb.r},${rgb.g},${rgb.b}`)} className="bg-gray-50 rounded-lg p-3 text-left">
                <span className="text-gray-500 block mb-1">RGB</span>
                <span className="font-mono">{copied === 'rgb' ? 'Copied' : `${rgb.r},${rgb.g},${rgb.b}`}</span>
              </button>
              <button type="button" onClick={() => copy('hsl', `${hsl.h},${hsl.s}%,${hsl.l}%`)} className="bg-gray-50 rounded-lg p-3 text-left">
                <span className="text-gray-500 block mb-1">HSL</span>
                <span className="font-mono">{copied === 'hsl' ? 'Copied' : `${hsl.h},${hsl.s}%,${hsl.l}%`}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
