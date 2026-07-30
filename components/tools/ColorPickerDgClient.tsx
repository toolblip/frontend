'use client';

import React, { useState } from 'react';

function isValidHex(hex: string): boolean {
  return /^#?[a-f\d]{6}$/i.test(hex);
}

export default function ColorPickerDgClient() {
  const [color, setColor] = useState('#8b5cf6');
  const [colorInput, setColorInput] = useState('#8b5cf6');
  const [hexError, setHexError] = useState(false);
  const [copied, setCopied] = useState('');

  const toRgb = (hex: string) => {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return r ? { r: parseInt(r[1], 16), g: parseInt(r[2], 16), b: parseInt(r[3], 16) } : null;
  };

  const rgb = toRgb(color);
  const isLight = rgb ? (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000 > 150 : false;

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
        <span className="tb-v2-tool-label">Color Picker DG</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>

      <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:20,padding:"20px"}}>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <input type="color" value={color} onChange={e => setColorValue(e.target.value)} className="w-20 h-20 rounded-2xl cursor-pointer border-4 border-gray-100 shadow-sm" />
          <div className="flex-1 w-full">
            <input type="text" value={colorInput} onChange={e => handleColorInput(e.target.value)} className="tb-v2-input" style={{fontFamily:'var(--f-mono)',fontSize:20}} />
            {hexError && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 6 }}>Enter a valid 6-digit hex color (e.g., #3366FF).</p>}
          </div>
        </div>

        {rgb && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button type="button" onClick={() => copy('rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`)} className="bg-gray-50 rounded-xl p-4 text-left">
              <div className="text-xs text-gray-500 mb-1">RGB</div>
              <div className="font-mono font-medium">{copied === 'rgb' ? 'Copied' : `${rgb.r}, ${rgb.g}, ${rgb.b}`}</div>
            </button>
            <button type="button" onClick={() => copy('hex', color.toUpperCase())} className="bg-gray-50 rounded-xl p-4 text-left">
              <div className="text-xs text-gray-500 mb-1">HEX</div>
              <div className="font-mono font-medium">{copied === 'hex' ? 'Copied' : color.toUpperCase()}</div>
            </button>
          </div>
        )}

        <div className="rounded-2xl overflow-hidden h-32 flex items-end relative" style={{ background: `linear-gradient(to right, #000, ${color})` }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-xl px-4 py-2 text-sm font-mono font-bold shadow-lg" style={{ backgroundColor: color, color: isLight ? '#000' : '#fff' }}>
              {color.toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
