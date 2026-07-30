'use client';

import React, { useState } from 'react';

function isValidHex(hex: string): boolean {
  return /^#?[a-f\d]{6}$/i.test(hex);
}

export default function ColorPickerEnhancedClient() {
  const [color, setColor] = useState('#7c3aed');
  const [colorInput, setColorInput] = useState('#7c3aed');
  const [hexError, setHexError] = useState(false);
  const [copied, setCopied] = useState('');

  const toRgb = (hex: string) => {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return r ? { r: parseInt(r[1], 16), g: parseInt(r[2], 16), b: parseInt(r[3], 16) } : null;
  };

  const toHsl = (hex: string) => {
    const rgb = toRgb(hex);
    if (!rgb) return null;
    const rn = rgb.r / 255, gn = rgb.g / 255, bn = rgb.b / 255;
    const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break;
        case gn: h = ((bn - rn) / d + 2) / 6; break;
        case bn: h = ((rn - gn) / d + 4) / 6; break;
      }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const rgb = toRgb(color);
  const hsl = toHsl(color);

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

  const copy = (label: string, value: string) => {
    navigator.clipboard.writeText(value).catch(() => {});
    setCopied(label);
    setTimeout(() => setCopied(''), 1500);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Color Picker Enhanced</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>

      <div className="space-y-5">
        <input type="color" value={color} onChange={e => setColorValue(e.target.value)} className="w-full h-56 rounded-2xl cursor-pointer border-0 shadow-lg" />

        <div>
          <input type="text" value={colorInput} onChange={e => handleColorInput(e.target.value)} className="tb-v2-input" style={{fontFamily:'var(--f-mono)',fontSize:18}} />
          {hexError && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 6 }}>Enter a valid 6-digit hex color (e.g., #3366FF).</p>}
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <button type="button" onClick={() => copy('hex', color.toUpperCase())} className="flex-1 bg-gray-50 rounded-xl p-4 text-left">
            <div className="text-xs text-gray-500 mb-1">HEX</div>
            <div className="font-mono font-bold text-2xl">{copied === 'hex' ? 'Copied' : color.toUpperCase()}</div>
          </button>
          {rgb && (
            <button type="button" onClick={() => copy('rgb', `${rgb.r},${rgb.g},${rgb.b}`)} className="flex-1 bg-gray-50 rounded-xl p-4 text-left">
              <div className="text-xs text-gray-500 mb-1">RGB</div>
              <div className="font-mono font-bold text-2xl">{copied === 'rgb' ? 'Copied' : `${rgb.r},${rgb.g},${rgb.b}`}</div>
            </button>
          )}
          {hsl && (
            <button type="button" onClick={() => copy('hsl', `${hsl.h},${hsl.s}%,${hsl.l}%`)} className="flex-1 bg-gray-50 rounded-xl p-4 text-left">
              <div className="text-xs text-gray-500 mb-1">HSL</div>
              <div className="font-mono font-bold text-2xl">{copied === 'hsl' ? 'Copied' : `${hsl.h},${hsl.s}%,${hsl.l}%`}</div>
            </button>
          )}
        </div>

        <div className="rounded-2xl h-24 shadow-lg" style={{ backgroundColor: color }} />
      </div>
    </div>
  );
}
