'use client';

import React, { useState } from 'react';

function isValidHex(hex: string): boolean {
  return /^#?[a-f\d]{6}$/i.test(hex);
}

export default function ColorPickerClassicClient() {
  const [color, setColor] = useState('#4f46e5');
  const [colorInput, setColorInput] = useState('#4f46e5');
  const [hexError, setHexError] = useState(false);
  const [copied, setCopied] = useState('');

  const toRgb = (hex: string) => {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return r ? { r: parseInt(r[1], 16), g: parseInt(r[2], 16), b: parseInt(r[3], 16) } : null;
  };

  const toHsl = (hex: string) => {
    const rgb = toRgb(hex);
    if (!rgb) return null;
    const r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

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

  const loadExample = () => setColorValue('#0ea5e9');

  const copy = (label: string, text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(label);
    setTimeout(() => setCopied(''), 1500);
  };

  const rgb = toRgb(color);
  const hsl = toHsl(color);

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Color Picker Classic</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>

      <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:20,padding:"20px"}}>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <input type="color" value={color} onChange={e => setColorValue(e.target.value)} className="w-16 h-16 rounded-xl cursor-pointer border-2 border-gray-200" />
          <div className="flex-1 w-full">
            <label className="tb-v2-tool-label" style={{marginBottom:8,display:'block'}}>HEX</label>
            <input type="text" value={colorInput} onChange={e => handleColorInput(e.target.value)} className="tb-v2-input" style={{fontFamily:'var(--f-mono)',fontSize:18}} />
            {hexError && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 6 }}>Enter a valid 6-digit hex color (e.g., #3366FF).</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: 'hex', display: color.toUpperCase() },
            { label: 'rgb', display: rgb ? `${rgb.r}, ${rgb.g}, ${rgb.b}` : '-' },
            { label: 'hsl', display: hsl ? `${hsl.h}°, ${hsl.s}%, ${hsl.l}%` : '-' },
          ].map(item => (
            <button key={item.label} type="button" onClick={() => copy(item.label, item.display)} className="bg-gray-50 rounded-xl p-4 text-left">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-500 uppercase">{item.label}</span>
                <span className="text-xs text-indigo-600 font-medium">{copied === item.label ? 'Copied' : 'Copy'}</span>
              </div>
              <div className="font-mono font-medium text-sm">{item.display}</div>
            </button>
          ))}
        </div>

        <div className="rounded-xl overflow-hidden h-24" style={{ backgroundColor: color }} />
      </div>
    </div>
  );
}
