'use client';

import { useState, useEffect } from 'react';

function parseColor(input: string): { r: number; g: number; b: number } | null {
  input = input.trim().toLowerCase();

  // HEX
  const hexMatch = input.match(/^#?([a-f0-9]{6}|[a-f0-9]{3})$/);
  if (hexMatch) {
    let hex = hexMatch[1];
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
    };
  }

  // RGB
  const rgbMatch = input.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
  if (rgbMatch) {
    return { r: +rgbMatch[1], g: +rgbMatch[2], b: +rgbMatch[3] };
  }

  // HSL
  const hslMatch = input.match(/hsl\s*\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?\s*\)/);
  if (hslMatch) {
    const h = +hslMatch[1] / 360, s = +hslMatch[2] / 100, l = +hslMatch[3] / 100;
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1; if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    const r = Math.round(hue2rgb(p, q, h + 1/3) * 255);
    const g = Math.round(hue2rgb(p, q, h) * 255);
    const b = Math.round(hue2rgb(p, q, h - 1/3) * 255);
    return { r, g, b };
  }

  return null;
}

function toHex(c: { r: number; g: number; b: number }): string {
  return '#' + [c.r, c.g, c.b].map(v => v.toString(16).padStart(2, '0')).join('');
}

function toHsl(c: { r: number; g: number; b: number }): string {
  const r = c.r / 255, g = c.g / 255, b = c.b / 255;
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
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

function toRgb(c: { r: number; g: number; b: number }): string {
  return `rgb(${c.r}, ${c.g}, ${c.b})`;
}

function toCmyk(c: { r: number; g: number; b: number }): string {
  const r = c.r / 255, g = c.g / 255, b = c.b / 255;
  const k = 1 - Math.max(r, g, b);
  if (k === 1) return `cmyk(0%, 0%, 0%, 100%)`;
  const c2 = (1 - r - k) / (1 - k);
  const m = (1 - g - k) / (1 - k);
  const y = (1 - b - k) / (1 - k);
  return `cmyk(${Math.round(c2 * 100)}%, ${Math.round(m * 100)}%, ${Math.round(y * 100)}%, ${Math.round(k * 100)}%)`;
}

export default function ColorFormatConverterV2Client() {
  const [input, setInput] = useState('#e74c3c');
  const [parsed, setParsed] = useState<{ r: number; g: number; b: number } | null>(null);
  const [copied, setCopied] = useState('');

  useEffect(() => {
    setParsed(parseColor(input));
  }, [input]);

  const loadExample = () => setInput('hsl(204, 70%, 53%)');

  const copy = (label: string, v: string) => {
    navigator.clipboard.writeText(v).catch(() => {});
    setCopied(label);
    setTimeout(() => setCopied(''), 1500);
  };

  const formats = parsed ? [
    { label: 'HEX', value: toHex(parsed) },
    { label: 'RGB', value: toRgb(parsed) },
    { label: 'HSL', value: toHsl(parsed) },
    { label: 'CMYK', value: toCmyk(parsed) },
    { label: 'HEX8', value: toHex(parsed) + 'ff' },
  ] : [];

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Color Format Converter V2</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>
      <p style={{ fontSize: 13, color: 'var(--tb-text-secondary)' }}>Supports HEX, RGB, and HSL input formats.</p>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="tb-v2-input"
        style={{ fontFamily: 'var(--f-mono)' }}
        placeholder="#e74c3c"
      />

      {parsed ? (
        <>
          <div className="w-full h-24 rounded-lg border flex items-center justify-center text-xl font-bold" style={{ backgroundColor: toHex(parsed), color: parsed.r * 0.299 + parsed.g * 0.587 + parsed.b * 0.114 > 150 ? '#000' : '#fff' }}>
            {toHex(parsed).toUpperCase()}
          </div>

          <div className="flex flex-col gap-2">
            {formats.map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                <div>
                  <span className="text-xs text-gray-400">{label}</span>
                  <div className="font-mono">{value}</div>
                </div>
                <button
                  type="button"
                  onClick={() => copy(label, value)}
                  className={`tb-v2-copy-btn ${copied === label ? 'done' : ''}`}
                >
                  {copied === label ? 'Copied' : 'Copy'}
                </button>
              </div>
            ))}
          </div>
        </>
      ) : input ? (
        <p className="tb-v2-empty">Could not parse color. Try: #ff0000, rgb(255,0,0), hsl(0,100%,50%)</p>
      ) : (
        <p className="tb-v2-empty">Enter a color above to convert it to HEX, RGB, HSL, and CMYK.</p>
      )}
    </div>
  );
}
