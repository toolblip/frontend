'use client';

import { useState } from 'react';

function isValidHex(hex: string): boolean {
  return /^#?[a-f\d]{6}$/i.test(hex);
}

function hexToRgb(hex: string) {
  const h = hex.replace('#', '');
  return { r: parseInt(h.substring(0, 2), 16), g: parseInt(h.substring(2, 4), 16), b: parseInt(h.substring(4, 6), 16) };
}

function relativeLuminance(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const channel = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrastRatio(hex1: string, hex2: string) {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function level(ratio: number) {
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'AA Large';
  return 'Fail';
}

export default function ContrastChecker2025Client() {
  const [fg, setFg] = useState('#000000');
  const [fgInput, setFgInput] = useState('#000000');
  const [bg, setBg] = useState('#ffffff');
  const [bgInput, setBgInput] = useState('#ffffff');
  const [fgError, setFgError] = useState(false);
  const [bgError, setBgError] = useState(false);

  const handleFgInput = (value: string) => {
    setFgInput(value);
    if (isValidHex(value)) { setFg(value.startsWith('#') ? value : `#${value}`); setFgError(false); }
    else setFgError(true);
  };

  const handleBgInput = (value: string) => {
    setBgInput(value);
    if (isValidHex(value)) { setBg(value.startsWith('#') ? value : `#${value}`); setBgError(false); }
    else setBgError(true);
  };

  const loadExample = () => {
    setFg('#000000'); setFgInput('#000000'); setFgError(false);
    setBg('#ffffff'); setBgInput('#ffffff'); setBgError(false);
  };

  const ratio = contrastRatio(fg, bg);

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Contrast Checker 2025</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>

      <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:16,padding:"16px 20px"}}>
        <div>
          <label className="tb-v2-tool-label" style={{marginBottom:8}}>Foreground</label>
          <div className="flex gap-2 items-center">
            <input type="color" value={fg} onChange={e => { setFg(e.target.value); setFgInput(e.target.value.toUpperCase()); setFgError(false); }} className="w-12 h-10 rounded cursor-pointer border-0" />
            <input className="tb-v2-input" value={fgInput} onChange={e => handleFgInput(e.target.value)} />
          </div>
          {fgError && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 6 }}>Enter a valid 6-digit hex color.</p>}
        </div>
        <div>
          <label className="tb-v2-tool-label" style={{marginBottom:8}}>Background</label>
          <div className="flex gap-2 items-center">
            <input type="color" value={bg} onChange={e => { setBg(e.target.value); setBgInput(e.target.value.toUpperCase()); setBgError(false); }} className="w-12 h-10 rounded cursor-pointer border-0" />
            <input className="tb-v2-input" value={bgInput} onChange={e => handleBgInput(e.target.value)} />
          </div>
          {bgError && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 6 }}>Enter a valid 6-digit hex color.</p>}
        </div>
        <div style={{ backgroundColor: bg, color: fg, padding: '1.5rem', borderRadius: '12px', fontSize: '1.2rem', fontWeight: 600 }}>
          2025 Preview
        </div>
        <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-1">
          <p className="text-sm"><strong>Ratio:</strong> {ratio.toFixed(2)}:1</p>
          <p className="text-sm"><strong>Level:</strong> {level(ratio)}</p>
        </div>
      </div>
    </div>
  );
}
