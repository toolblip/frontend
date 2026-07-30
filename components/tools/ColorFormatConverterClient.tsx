'use client';

import { useState } from 'react';

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function rgbStringToRgb(value: string): { r: number; g: number; b: number } | null {
  const match = value.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (!match) return null;
  return { r: Number(match[1]), g: Number(match[2]), b: Number(match[3]) };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  s /= 100; l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

function hslStringToRgb(value: string): { r: number; g: number; b: number } | null {
  const match = value.match(/hsla?\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?/i);
  if (!match) return null;
  return hslToRgb(Number(match[1]), Number(match[2]), Number(match[3]));
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
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
}

function parseColor(value: string): { r: number; g: number; b: number } | null {
  const trimmed = value.trim();
  return hexToRgb(trimmed) || rgbStringToRgb(trimmed) || hslStringToRgb(trimmed);
}

export default function ColorFormatConverterClient() {
  const [input, setInput] = useState('#3498db');
  const [format, setFormat] = useState<'hex' | 'rgb' | 'hsl'>('hex');
  const [copied, setCopied] = useState('');

  const rgb = parseColor(input);
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;
  const hex = rgb ? rgbToHex(rgb.r, rgb.g, rgb.b) : null;

  const loadExample = () => {
    setInput('rgb(52, 152, 219)');
    setFormat('hex');
  };

  const copyValue = (label: string, val: string) => {
    navigator.clipboard.writeText(val).catch(() => {});
    setCopied(label);
    setTimeout(() => setCopied(''), 1500);
  };

  const allValues = rgb && hsl && hex ? [
    { key: 'hex', label: 'HEX', value: hex.toUpperCase() },
    { key: 'rgb', label: 'RGB', value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { key: 'hsl', label: 'HSL', value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
    { key: 'hex8', label: 'HEX (8-digit)', value: (hex.replace('#', '') + 'ff').toUpperCase() },
  ] : [];
  const orderedValues = [...allValues].sort((a, b) => (a.key === format ? -1 : b.key === format ? 1 : 0));

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Color Format Converter</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>

      <div>
        <label className="tb-v2-tool-label" style={{ marginBottom: 6, display: 'block' }}>Enter Color (HEX, RGB, or HSL)</label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="tb-v2-input"
          style={{ fontFamily: 'var(--f-mono)' }}
          placeholder="#3498db"
        />
      </div>

      <div className="tb-v2-mode-tabs">
        {(['hex', 'rgb', 'hsl'] as const).map(f => (
          <button
            key={f}
            type="button"
            onClick={() => setFormat(f)}
            className={`tb-v2-mode-tab ${format === f ? 'on' : ''}`}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {rgb && hex ? (
        <div className="tb-v2-section" style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '16px 20px' }}>
          <div className="p-6 rounded-lg flex items-center gap-4" style={{ backgroundColor: hex }}>
            <span className="text-lg font-bold" style={{ color: hsl && hsl.l < 50 ? '#fff' : '#000' }}>
              {hex.toUpperCase()}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {orderedValues.map(({ key, label, value }) => (
              <div key={label} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                <div>
                  <span className="text-sm text-gray-500">{label}</span>
                  <div className="font-mono">{value}</div>
                </div>
                <button
                  type="button"
                  onClick={() => copyValue(label, value)}
                  className={`tb-v2-copy-btn ${copied === label ? 'done' : ''}`}
                >
                  {copied === label ? 'Copied' : 'Copy'}
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="tb-v2-empty">Invalid color format. Enter a valid HEX (#3498db), RGB (rgb(52, 152, 219)), or HSL (hsl(204, 70%, 53%)) color.</p>
      )}
    </div>
  );
}
