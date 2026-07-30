'use client';

import React, { useState } from 'react';

function isValidHex(hex: string): boolean {
  return /^#?[a-f\d]{6}$/i.test(hex);
}

export default function ColorPickerCompleteClient() {
  const [color, setColor] = useState('#6366f1');
  const [colorInput, setColorInput] = useState('#6366f1');
  const [hexError, setHexError] = useState(false);
  const [format, setFormat] = useState<'hex' | 'rgb' | 'hsl'>('hex');
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

  const rgb = toRgb(color);
  const hsl = toHsl(color);

  const getValue = () => {
    if (format === 'hex') return color.toUpperCase();
    if (format === 'rgb' && rgb) return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    if (format === 'hsl' && hsl) return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    return '';
  };

  const formats = [
    { key: 'hex', label: 'HEX', value: color.toUpperCase() },
    { key: 'rgb', label: 'RGB', value: rgb ? `${rgb.r}, ${rgb.g}, ${rgb.b}` : '-' },
    { key: 'hsl', label: 'HSL', value: hsl ? `${hsl.h}°, ${hsl.s}%, ${hsl.l}%` : '-' },
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

  const loadExample = () => setColorValue('#8b5cf6');

  const copy = (label: string, value: string) => {
    navigator.clipboard.writeText(value).catch(() => {});
    setCopied(label);
    setTimeout(() => setCopied(''), 1500);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Color Picker Complete</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>

      <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:20,padding:"20px"}}>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <input type="color" value={color} onChange={e => setColorValue(e.target.value)} className="w-20 h-20 rounded-xl cursor-pointer border-2 border-gray-200" />
          <div className="flex-1 w-full space-y-2">
            <label className="tb-v2-tool-label" style={{display:'block'}}>HEX Input</label>
            <input type="text" value={colorInput} onChange={e => handleColorInput(e.target.value)} className="tb-v2-input" style={{fontFamily:'var(--f-mono)',fontSize:18}} />
            {hexError && <p style={{ fontSize: 12, color: '#ef4444' }}>Enter a valid 6-digit hex color (e.g., #3366FF).</p>}
          </div>
        </div>

        <div className="tb-v2-mode-tabs">
          {formats.map(f => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFormat(f.key as typeof format)}
              className={`tb-v2-mode-tab ${format === f.key ? 'on' : ''}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <button type="button" onClick={() => copy(format, getValue())} className="bg-gray-50 rounded-xl p-4 text-left">
          <div className="text-xs text-gray-500 mb-1">{format.toUpperCase()} Value</div>
          <div className="font-mono text-lg break-all">{copied === format ? 'Copied' : getValue()}</div>
        </button>

        <div className="grid grid-cols-2 gap-3 text-sm">
          {formats.map(f => (
            <button key={f.key} type="button" onClick={() => copy(f.key, f.value)} className="bg-gray-50 rounded p-3 text-left">
              <span className="text-gray-500">{f.label}</span>
              <div className="font-mono font-medium">{copied === f.key ? 'Copied' : f.value}</div>
            </button>
          ))}
        </div>

        <div className="rounded-xl overflow-hidden h-20" style={{ backgroundColor: color }} />
      </div>
    </div>
  );
}
