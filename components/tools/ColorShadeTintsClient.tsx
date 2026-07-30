'use client';

import React, { useState } from 'react';

function isValidHex(hex: string): boolean {
  return /^#?[a-f\d]{6}$/i.test(hex);
}

export default function ColorShadeTintsClient() {
  const [color, setColor] = useState('#6366f1');
  const [colorInput, setColorInput] = useState('#6366F1');
  const [hexError, setHexError] = useState(false);
  const [copied, setCopied] = useState('');

  const toRgb = (hex: string) => {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return r ? { r: parseInt(r[1], 16), g: parseInt(r[2], 16), b: parseInt(r[3], 16) } : null;
  };

  const rgb = toRgb(color);
  const toHex = (v: number) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0');

  const tints = rgb ? [1, 0.8, 0.6, 0.4, 0.2].map(f => {
    const r = Math.round(rgb.r * f + 255 * (1 - f));
    const g = Math.round(rgb.g * f + 255 * (1 - f));
    const b = Math.round(rgb.b * f + 255 * (1 - f));
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }) : [];

  const setColorValue = (value: string) => {
    setColor(value);
    setColorInput(value.toUpperCase());
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
        <span className="tb-v2-tool-label">Color Shade & Tints</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>

      <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:20,padding:"20px"}}>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <input type="color" value={color} onChange={e => setColorValue(e.target.value)} className="w-20 h-20 rounded-xl cursor-pointer border-2 border-gray-200" />
          <div className="flex-1 w-full">
            <input type="text" value={colorInput} onChange={e => handleColorInput(e.target.value)} className="w-full px-4 py-3 border rounded-xl font-mono text-lg" />
            {hexError && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 6 }}>Enter a valid 6-digit hex color (e.g., #3366FF).</p>}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-2">Tints</div>
          <div className="flex gap-2">
            {tints.map((t, i) => (
              <button key={i} type="button" onClick={() => copy(`tint-${i}`, t)}
                className="flex-1 h-16 rounded-lg flex items-end justify-center pb-1" style={{ backgroundColor: t }}>
                <span className="text-xs font-mono">{copied === `tint-${i}` ? 'Copied' : t}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
