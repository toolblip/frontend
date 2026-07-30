'use client';

import { useState } from 'react';

const PRESETS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
  '#64748b', '#1e293b', '#ffffff', '#000000',
];

function isValidHex(hex: string): boolean {
  return /^#?[a-f\d]{6}$/i.test(hex);
}

export default function ColorPicker2025Client() {
  const [color, setColor] = useState('#6366f1');
  const [colorInput, setColorInput] = useState('#6366f1');
  const [hexError, setHexError] = useState(false);
  const [copied, setCopied] = useState('');

  const toRgb = (hex: string) => {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return r ? { r: parseInt(r[1], 16), g: parseInt(r[2], 16), b: parseInt(r[3], 16) } : null;
  };

  const toHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
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
  const hsl = rgb ? toHsl(rgb.r, rgb.g, rgb.b) : null;

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

  const loadExample = () => setColorValue('#06b6d4');

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(label);
    setTimeout(() => setCopied(''), 1500);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Color Picker 2025</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        <input
          type="color"
          value={color}
          onChange={e => setColorValue(e.target.value)}
          className="w-32 h-32 rounded-2xl cursor-pointer border-4 border-gray-100 dark:border-gray-700 shadow-lg"
        />
        <div className="flex-1 space-y-4 w-full">
          <div>
            <label className="tb-v2-tool-label" style={{marginBottom:8,display:'block'}}>Color Preview</label>
            <div
              className="h-20 rounded-xl border border-gray-200 dark:border-gray-700 shadow-inner"
              style={{ backgroundColor: color }}
            />
          </div>
          <div>
            <label className="tb-v2-tool-label" style={{marginBottom:8,display:'block'}}>Hex Value</label>
            <input
              type="text"
              value={colorInput}
              onChange={e => handleColorInput(e.target.value)}
              className="tb-v2-input font-mono text-lg"
            />
            {hexError && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 6 }}>Enter a valid 6-digit hex color (e.g., #3366FF).</p>}
          </div>
        </div>
      </div>

      <div>
        <label className="tb-v2-tool-label" style={{marginBottom:8,display:'block'}}>Quick Colors</label>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColorValue(c)}
              className={`w-10 h-10 rounded-lg border-2 transition-transform hover:scale-110 ${
                color === c ? 'border-gray-400 dark:border-gray-300 scale-110' : 'border-gray-200 dark:border-gray-700'
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      {rgb && hsl && (
        <div>
          <label className="tb-v2-tool-label" style={{marginBottom:8,display:'block'}}>Color Values</label>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => copy(color.toUpperCase(), 'HEX')}
              className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="text-xs text-gray-500 block mb-1">HEX</span>
              <span className="font-mono font-medium text-sm">{copied === 'HEX' ? 'Copied' : color.toUpperCase()}</span>
            </button>
            <button
              type="button"
              onClick={() => copy(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, 'RGB')}
              className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="text-xs text-gray-500 block mb-1">RGB</span>
              <span className="font-mono font-medium text-sm">{copied === 'RGB' ? 'Copied' : `${rgb.r}, ${rgb.g}, ${rgb.b}`}</span>
            </button>
            <button
              type="button"
              onClick={() => copy(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, 'HSL')}
              className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="text-xs text-gray-500 block mb-1">HSL</span>
              <span className="font-mono font-medium text-sm">{copied === 'HSL' ? 'Copied' : `${hsl.h}°, ${hsl.s}%, ${hsl.l}%`}</span>
            </button>
          </div>
        </div>
      )}

      <div>
        <div className="tb-v2-tool-output-head">
          <span className="tb-v2-tool-label">CSS</span>
          <button
            type="button"
            onClick={() => copy(`color: ${color};`, 'CSS')}
            className="tb-v2-copy-btn"
          >
            {copied === 'CSS' ? 'Copied' : 'Copy'}
          </button>
        </div>
        <div className="tb-v2-tool-output-body">
          <pre className="tb-v2-tool-pre">color: {color};</pre>
        </div>
      </div>
    </div>
  );
}
