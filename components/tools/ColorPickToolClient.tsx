'use client';

import React, { useState } from 'react';

function isValidHex(hex: string): boolean {
  return /^#?[a-f\d]{6}$/i.test(hex);
}

export default function ColorPickToolClient() {
  const [color, setColor] = useState('#6366f1');
  const [colorInput, setColorInput] = useState('#6366f1');
  const [hexError, setHexError] = useState(false);
  const [copied, setCopied] = useState('');

  const hexToRgb = (hex: string) => {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return r ? {r:parseInt(r[1],16),g:parseInt(r[2],16),b:parseInt(r[3],16)} : null;
  };

  const rgb = hexToRgb(color);
  const rgbStr = rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : '-';

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

  const loadExample = () => setColorValue('#f97316');

  const copy = (label: string, value: string) => {
    navigator.clipboard.writeText(value).catch(() => {});
    setCopied(label);
    setTimeout(() => setCopied(''), 1500);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Color Pick Tool</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>

      <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:20,padding:"20px"}}>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <input type="color" value={color} onChange={e=>setColorValue(e.target.value)} className="w-24 h-24 rounded-xl cursor-pointer border-4 border-gray-100 shadow-lg" />
          <div className="flex-1">
            <label className="tb-v2-tool-label" style={{marginBottom:8,display:'block'}}>Hex</label>
            <input type="text" value={colorInput} onChange={e=>handleColorInput(e.target.value)} className="tb-v2-input" style={{fontFamily:'var(--f-mono)',fontSize:20}} />
            {hexError && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 6 }}>Enter a valid 6-digit hex color (e.g., #3366FF).</p>}
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
            <div className="flex justify-between items-center">
              <span className="text-gray-500">HEX:</span>
              <button type="button" onClick={() => copy('hex', color.toUpperCase())} className={`tb-v2-copy-btn ${copied === 'hex' ? 'done' : ''}`}>
                {copied === 'hex' ? 'Copied' : color.toUpperCase()}
              </button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">RGB:</span>
              <button type="button" onClick={() => copy('rgb', rgbStr)} className={`tb-v2-copy-btn ${copied === 'rgb' ? 'done' : ''}`}>
                {copied === 'rgb' ? 'Copied' : rgbStr}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
