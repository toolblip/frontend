'use client';

import React, { useState } from 'react';

function isValidHex(hex: string): boolean {
  return /^#?[a-f\d]{6}$/i.test(hex);
}

export default function ColorPickerExpanderClient() {
  const [color, setColor] = useState('#ec4899');
  const [colorInput, setColorInput] = useState('#ec4899');
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

  const tints: string[] = [];
  const shades: string[] = [];
  for (let i = 1; i <= 4; i++) {
    const tf = Math.round((255 - (255 - (rgb?.r ?? 128))) * i / 5 + (rgb?.r ?? 128) * (5 - i) / 5);
    const tg = Math.round((255 - (255 - (rgb?.g ?? 128))) * i / 5 + (rgb?.g ?? 128) * (5 - i) / 5);
    const tb = Math.round((255 - (255 - (rgb?.b ?? 128))) * i / 5 + (rgb?.b ?? 128) * (5 - i) / 5);
    tints.push(`#${tf.toString(16).padStart(2,'0')}${tg.toString(16).padStart(2,'0')}${tb.toString(16).padStart(2,'0')}`);
    const sd = Math.round((rgb?.r ?? 128) * (5 - i) / 5);
    const sg = Math.round((rgb?.g ?? 128) * (5 - i) / 5);
    const sb = Math.round((rgb?.b ?? 128) * (5 - i) / 5);
    shades.push(`#${sd.toString(16).padStart(2,'0')}${sg.toString(16).padStart(2,'0')}${sb.toString(16).padStart(2,'0')}`);
  }

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

  const copy = (label: string, value: string) => {
    navigator.clipboard.writeText(value).catch(() => {});
    setCopied(label);
    setTimeout(() => setCopied(''), 1500);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Color Picker Expander</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>

      <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:20,padding:"20px"}}>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <input type="color" value={color} onChange={e => setColorValue(e.target.value)} className="w-20 h-20 rounded-xl cursor-pointer border-2 border-gray-200" />
          <div className="flex-1 w-full">
            <input type="text" value={colorInput} onChange={e => handleColorInput(e.target.value)} className="tb-v2-input" style={{fontFamily:'var(--f-mono)',fontSize:18}} />
            {hexError && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 6 }}>Enter a valid 6-digit hex color (e.g., #3366FF).</p>}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-sm">
          {rgb && (
            <button type="button" onClick={() => copy('rgb', `${rgb.r},${rgb.g},${rgb.b}`)} className="bg-gray-50 rounded p-3 text-left">
              <span className="text-gray-500">RGB</span>
              <div className="font-mono font-medium">{copied === 'rgb' ? 'Copied' : `${rgb.r},${rgb.g},${rgb.b}`}</div>
            </button>
          )}
          {hsl && (
            <button type="button" onClick={() => copy('hsl', `${hsl.h}°, ${hsl.s}%, ${hsl.l}%`)} className="bg-gray-50 rounded p-3 text-left">
              <span className="text-gray-500">HSL</span>
              <div className="font-mono font-medium">{copied === 'hsl' ? 'Copied' : `${hsl.h}°, ${hsl.s}%, ${hsl.l}%`}</div>
            </button>
          )}
          <button type="button" onClick={() => copy('hex', color.toUpperCase())} className="bg-gray-50 rounded p-3 text-left">
            <span className="text-gray-500">HEX</span>
            <div className="font-mono font-medium">{copied === 'hex' ? 'Copied' : color.toUpperCase()}</div>
          </button>
        </div>

        {rgb && (
          <>
            <div>
              <div className="text-xs text-gray-500 mb-2">Tints</div>
              <div className="flex gap-2">
                {tints.map((t, i) => (
                  <button key={i} type="button" onClick={() => copy(`tint${i}`, t.toUpperCase())} className="flex-1 h-12 rounded-lg relative" style={{ backgroundColor: t }} title={t}>
                    {copied === `tint${i}` && <span className="absolute inset-0 flex items-center justify-center text-xs font-medium bg-black bg-opacity-40 text-white rounded-lg">Copied</span>}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-2">Shades</div>
              <div className="flex gap-2">
                {shades.map((s, i) => (
                  <button key={i} type="button" onClick={() => copy(`shade${i}`, s.toUpperCase())} className="flex-1 h-12 rounded-lg relative" style={{ backgroundColor: s }} title={s}>
                    {copied === `shade${i}` && <span className="absolute inset-0 flex items-center justify-center text-xs font-medium bg-black bg-opacity-40 text-white rounded-lg">Copied</span>}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="rounded-xl h-20" style={{ backgroundColor: color }} />
      </div>
    </div>
  );
}
