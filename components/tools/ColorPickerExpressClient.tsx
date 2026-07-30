'use client';

import React, { useState } from 'react';

function isValidHex(hex: string): boolean {
  return /^#?[a-f\d]{6}$/i.test(hex);
}

export default function ColorPickerExpressClient() {
  const [color, setColor] = useState('#f59e0b');
  const [copied, setCopied] = useState('');

  const toRgb = (hex: string) => {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return r ? { r: parseInt(r[1], 16), g: parseInt(r[2], 16), b: parseInt(r[3], 16) } : null;
  };

  const rgb = toRgb(color);

  const loadExample = () => setColor('#8b5cf6');

  const copy = (label: string, value: string) => {
    navigator.clipboard.writeText(value).catch(() => {});
    setCopied(label);
    setTimeout(() => setCopied(''), 1500);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Color Picker Express</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>

      <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:16,padding:"16px 20px"}}>
        <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-full h-40 rounded-xl cursor-pointer border-0" />
        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={() => copy('hex', color.toUpperCase())} className="bg-gray-50 rounded-xl p-3 text-left">
            <div className="text-xs text-gray-500">HEX</div>
            <div className="font-mono font-bold text-lg">{copied === 'hex' ? 'Copied' : color.toUpperCase()}</div>
          </button>
          {rgb && (
            <button type="button" onClick={() => copy('rgb', `${rgb.r},${rgb.g},${rgb.b}`)} className="bg-gray-50 rounded-xl p-3 text-left">
              <div className="text-xs text-gray-500">RGB</div>
              <div className="font-mono font-bold text-lg">{copied === 'rgb' ? 'Copied' : `${rgb.r},${rgb.g},${rgb.b}`}</div>
            </button>
          )}
        </div>
        <div className="rounded-xl h-12" style={{ backgroundColor: color }} />
      </div>
    </div>
  );
}
