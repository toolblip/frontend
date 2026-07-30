'use client';

import React, { useState } from 'react';

function isValidHex(hex: string): boolean {
  return /^#?[a-f\d]{6}$/i.test(hex);
}

export default function ColorPickToolblipClient() {
  const [color, setColor] = useState('#6366f1');
  const [colorInput, setColorInput] = useState('#6366f1');
  const [hexError, setHexError] = useState(false);
  const [copied, setCopied] = useState('');

  const toRgb = (hex: string) => {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return r ? {r:parseInt(r[1],16),g:parseInt(r[2],16),b:parseInt(r[3],16)} : null;
  };

  const rgb = toRgb(color);
  const rgbStr = rgb ? `${rgb.r}, ${rgb.g}, ${rgb.b}` : '-';

  const presets = ['#ef4444','#f97316','#eab308','#22c55e','#3b82f6','#8b5cf6','#ec4899','#000000','#ffffff','#6b7280'];

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

  const loadExample = () => setColorValue('#8b5cf6');

  const copy = (label: string, value: string) => {
    navigator.clipboard.writeText(value).catch(() => {});
    setCopied(label);
    setTimeout(() => setCopied(''), 1500);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Color Pick Toolblip</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>

      <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:20,padding:"20px"}}>
        <div className="flex gap-4 items-end">
          <input type="color" value={color} onChange={e=>setColorValue(e.target.value)} className="w-20 h-20 rounded-2xl cursor-pointer border-2 border-gray-200" />
          <div className="flex-1">
            <label className="tb-v2-tool-label" style={{marginBottom:8,display:'block'}}>Hex</label>
            <input type="text" value={colorInput} onChange={e=>handleColorInput(e.target.value)} className="tb-v2-input" style={{fontFamily:'var(--f-mono)',fontSize:18}} />
            {hexError && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 6 }}>Enter a valid 6-digit hex color (e.g., #3366FF).</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <button type="button" onClick={() => copy('hex', color.toUpperCase())} className="bg-gray-50 rounded-xl p-4 text-left">
            <span className="text-gray-500 block mb-1">HEX</span>
            <span className="font-mono font-medium">{copied === 'hex' ? 'Copied' : color.toUpperCase()}</span>
          </button>
          <button type="button" onClick={() => copy('rgb', rgbStr)} className="bg-gray-50 rounded-xl p-4 text-left">
            <span className="text-gray-500 block mb-1">RGB</span>
            <span className="font-mono font-medium">{copied === 'rgb' ? 'Copied' : rgbStr}</span>
          </button>
        </div>

        <div>
          <div className="tb-v2-tool-label" style={{marginBottom:8}}>Presets</div>
          <div className="flex gap-2 flex-wrap">
            {presets.map(c=>(
              <button key={c} type="button" onClick={()=>setColorValue(c)} className="w-10 h-10 rounded-full border-2 border-gray-200 hover:scale-110 transition-transform" style={{backgroundColor:c}}/>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
