'use client';

import React, { useState } from 'react';

function toRgb(hex: string) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r ? {r:parseInt(r[1],16),g:parseInt(r[2],16),b:parseInt(r[3],16)} : null;
}

function isValidHex(hex: string): boolean {
  return /^#?[a-f\d]{6}$/i.test(hex);
}

export default function ColorPickerApiClient() {
  const [color, setColor] = useState('#6366f1');
  const [colorInput, setColorInput] = useState('#6366f1');
  const [hexError, setHexError] = useState(false);
  const [copied, setCopied] = useState('');
  const rgb = toRgb(color);

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

  const loadExample = () => setColorValue('#3b82f6');

  const copy = (label: string, val: string) => {
    navigator.clipboard.writeText(val).catch(() => {});
    setCopied(label);
    setTimeout(() => setCopied(''), 1500);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Color Picker API</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>

      <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:20,padding:"20px"}}>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <input type="color" value={color} onChange={e=>setColorValue(e.target.value)} className="w-20 h-20 rounded-xl cursor-pointer border-2 border-gray-200" />
          <div className="flex-1 w-full">
            <label className="tb-v2-tool-label" style={{marginBottom:8,display:'block'}}>Color (HEX)</label>
            <input type="text" value={colorInput} onChange={e=>handleColorInput(e.target.value)} className="tb-v2-input" style={{fontFamily:'var(--f-mono)',fontSize:18}} />
            {hexError && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 6 }}>Enter a valid 6-digit hex color (e.g., #3366FF).</p>}
          </div>
        </div>

        {rgb&&(
          <div className="grid grid-cols-2 gap-4 text-sm">
            <button type="button" onClick={() => copy('hex', color.toUpperCase())} className="bg-gray-50 rounded-lg p-3 text-left">
              <span className="text-gray-500">HEX</span>
              <div className="font-mono font-medium mt-1">{copied === 'hex' ? 'Copied' : color.toUpperCase()}</div>
            </button>
            <button type="button" onClick={() => copy('rgb', `${rgb.r},${rgb.g},${rgb.b}`)} className="bg-gray-50 rounded-lg p-3 text-left">
              <span className="text-gray-500">RGB</span>
              <div className="font-mono font-medium mt-1">{copied === 'rgb' ? 'Copied' : `${rgb.r},${rgb.g},${rgb.b}`}</div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
