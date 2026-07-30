'use client';

import { useState } from 'react';

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
}

function isValidHex(hex: string): boolean {
  return /^#?[a-f\d]{6}$/i.test(hex);
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = Math.max(0, Math.min(255, x)).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

function mixColors(color1: string, color2: string, ratio = 0.5): string {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  if (!rgb1 || !rgb2) return '#000000';
  const r = Math.round(rgb1.r * (1 - ratio) + rgb2.r * ratio);
  const g = Math.round(rgb1.g * (1 - ratio) + rgb2.g * ratio);
  const b = Math.round(rgb1.b * (1 - ratio) + rgb2.b * ratio);
  return rgbToHex(r, g, b);
}

export default function ColorMixerV2Client() {
  const [color1, setColor1] = useState('#6366f1');
  const [color1Input, setColor1Input] = useState('#6366f1');
  const [color1Error, setColor1Error] = useState(false);
  const [color2, setColor2] = useState('#ec4899');
  const [color2Input, setColor2Input] = useState('#ec4899');
  const [color2Error, setColor2Error] = useState(false);
  const [ratio, setRatio] = useState(50);
  const [copied, setCopied] = useState(false);

  const result = mixColors(color1, color2, ratio / 100);

  const setColor1Value = (value: string) => {
    setColor1(value);
    setColor1Input(value);
    setColor1Error(false);
  };

  const handleColor1Input = (value: string) => {
    setColor1Input(value);
    if (isValidHex(value)) {
      setColor1(value.startsWith('#') ? value : `#${value}`);
      setColor1Error(false);
    } else {
      setColor1Error(true);
    }
  };

  const setColor2Value = (value: string) => {
    setColor2(value);
    setColor2Input(value);
    setColor2Error(false);
  };

  const handleColor2Input = (value: string) => {
    setColor2Input(value);
    if (isValidHex(value)) {
      setColor2(value.startsWith('#') ? value : `#${value}`);
      setColor2Error(false);
    } else {
      setColor2Error(true);
    }
  };

  const loadExample = () => {
    setColor1Value('#3498db');
    setColor2Value('#f1c40f');
    setRatio(50);
  };

  const copyResult = () => {
    navigator.clipboard.writeText(result.toUpperCase()).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const resultRgb = hexToRgb(result);

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Color Mixer V2</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="tb-v2-tool-label" style={{ marginBottom: 8, display: 'block' }}>Color 1</label>
          <div className="flex gap-2 items-center">
            <input type="color" value={color1} onChange={e => setColor1Value(e.target.value)} className="rounded cursor-pointer" style={{ width: 48, height: 40 }} />
            <input type="text" value={color1Input} onChange={e => handleColor1Input(e.target.value)} className="tb-v2-input flex-1" style={{ fontFamily: 'var(--f-mono)' }} />
          </div>
          {color1Error && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 6 }}>Invalid hex color.</p>}
        </div>
        <div>
          <label className="tb-v2-tool-label" style={{ marginBottom: 8, display: 'block' }}>Color 2</label>
          <div className="flex gap-2 items-center">
            <input type="color" value={color2} onChange={e => setColor2Value(e.target.value)} className="rounded cursor-pointer" style={{ width: 48, height: 40 }} />
            <input type="text" value={color2Input} onChange={e => handleColor2Input(e.target.value)} className="tb-v2-input flex-1" style={{ fontFamily: 'var(--f-mono)' }} />
          </div>
          {color2Error && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 6 }}>Invalid hex color.</p>}
        </div>
        <div>
          <label className="tb-v2-tool-label" style={{ marginBottom: 8, display: 'block' }}>Ratio - {ratio}%</label>
          <input type="range" min="0" max="100" value={ratio} onChange={e => setRatio(Number(e.target.value))} className="tb-v2-range" style={{ width: '100%' }} />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-lg border-4" style={{ backgroundColor: color1 }} />
        <div className="text-2xl text-gray-400">+</div>
        <div className="w-20 h-20 rounded-lg border-4" style={{ backgroundColor: color2 }} />
        <div className="text-2xl text-gray-400">=</div>
        <div className="w-20 h-20 rounded-lg border-4 border-gray-300" style={{ backgroundColor: result }} />
      </div>

      <div className="tb-v2-section" style={{ padding: '16px 20px' }}>
        <div className="font-medium mb-2">Mixed Result</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
          <div className="font-mono text-sm"><span className="text-gray-500">HEX:</span> {result.toUpperCase()}</div>
          <div className="font-mono text-sm"><span className="text-gray-500">RGB:</span> {resultRgb ? `rgb(${resultRgb.r},${resultRgb.g},${resultRgb.b})` : '-'}</div>
          <button
            type="button"
            onClick={copyResult}
            className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
          >
            {copied ? 'Copied' : 'Copy HEX'}
          </button>
        </div>
      </div>
    </div>
  );
}
