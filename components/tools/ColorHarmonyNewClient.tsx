'use client';

import { useState } from 'react';

function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  const r = Math.round(hue2rgb(p, q, h / 360 + 1/3) * 255);
  const g = Math.round(hue2rgb(p, q, h / 360) * 255);
  const b = Math.round(hue2rgb(p, q, h / 360 - 1/3) * 255);
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
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
}

function isValidHex(hex: string): boolean {
  return /^#?[a-f\d]{6}$/i.test(hex);
}

type Mode = 'complement' | 'triad' | 'analogous' | 'split' | 'double';

const offsets: Record<Mode, number[]> = {
  complement: [180],
  triad: [120, 240],
  analogous: [-30, 30],
  split: [150, 210],
  double: [180, 90],
};

export default function ColorHarmonyNewClient() {
  const [base, setBase] = useState('#3b82f6');
  const [baseInput, setBaseInput] = useState('#3b82f6');
  const [hexError, setHexError] = useState(false);
  const [mode, setMode] = useState<Mode>('analogous');
  const [copied, setCopied] = useState('');
  const [copiedAll, setCopiedAll] = useState(false);

  const hsl = hexToHsl(base);
  const palette = [base, ...offsets[mode].map(o => hslToHex((hsl.h + o + 360) % 360, hsl.s, hsl.l))];

  const setBaseValue = (value: string) => {
    setBase(value);
    setBaseInput(value);
    setHexError(false);
  };

  const handleBaseInput = (value: string) => {
    setBaseInput(value);
    if (isValidHex(value)) {
      setBase(value.startsWith('#') ? value : `#${value}`);
      setHexError(false);
    } else {
      setHexError(true);
    }
  };

  const loadExample = () => {
    setBaseValue('#e74c3c');
    setMode('triad');
  };

  const copy = (c: string) => {
    navigator.clipboard.writeText(c).catch(() => {});
    setCopied(c);
    setTimeout(() => setCopied(''), 1500);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(palette.join('\n')).catch(() => {});
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1500);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Color Harmony New</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>

      <div className="flex gap-4">
        <input
          type="color"
          value={base}
          onChange={e => setBaseValue(e.target.value)}
          className="rounded cursor-pointer"
          style={{ width: 64, height: 64 }}
        />
        <div className="flex-1">
          <input
            type="text"
            value={baseInput}
            onChange={e => handleBaseInput(e.target.value)}
            className="tb-v2-input"
            style={{ fontFamily: 'var(--f-mono)' }}
          />
          {hexError && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 6 }}>Enter a valid 6-digit hex color (e.g., #3366FF).</p>}
        </div>
      </div>

      <div className="tb-v2-mode-tabs" style={{ flexWrap: 'wrap' }}>
        {(Object.keys(offsets) as Mode[]).map(m => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`tb-v2-mode-tab ${mode === m ? 'on' : ''}`}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex gap-1">
        {palette.map((c, i) => (
          <div key={i} className="flex-1 h-10 rounded" style={{ backgroundColor: c }} />
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {palette.map((c, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded border">
            <div className="w-10 h-10 rounded border" style={{ backgroundColor: c }} />
            <span className="font-mono text-sm flex-1">{c.toUpperCase()}</span>
            <button
              type="button"
              onClick={() => copy(c)}
              className={`tb-v2-copy-btn ${copied === c ? 'done' : ''}`}
            >
              {copied === c ? 'Copied' : 'Copy'}
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={copyAll}
        className={`tb-v2-copy-btn ${copiedAll ? 'done' : ''}`}
        style={{ alignSelf: 'flex-start' }}
      >
        {copiedAll ? 'Copied' : `Copy All (${palette.length} colors)`}
      </button>
    </div>
  );
}
