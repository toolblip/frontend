'use client';

import { useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const DEFAULT_COLOR = '#6366f1';
const DEFAULT_SAT = 100;
const EXAMPLE_COLOR = '#3b82f6';
const EXAMPLE_SAT = 60;

function isValidHex(hex: string): boolean {
  return /^#?[a-f\d]{6}$/i.test(hex);
}

export default function ColorSaturationAdjusterClient() {
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [colorInput, setColorInput] = useState(DEFAULT_COLOR.toUpperCase());
  const [hexError, setHexError] = useState(false);
  const [saturation, setSaturation] = useState(DEFAULT_SAT);
  const [copied, setCopied] = useState('');

  const toRgb = (hex: string) => {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return r ? { r: parseInt(r[1], 16), g: parseInt(r[2], 16), b: parseInt(r[3], 16) } : null;
  };

  const toHsl = (hex: string) => {
    const rgb = toRgb(hex);
    if (!rgb) return null;
    const rn = rgb.r / 255,
      gn = rgb.g / 255,
      bn = rgb.b / 255;
    const max = Math.max(rn, gn, bn),
      min = Math.min(rn, gn, bn);
    let h = 0,
      s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case rn:
          h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
          break;
        case gn:
          h = ((bn - rn) / d + 2) / 6;
          break;
        case bn:
          h = ((rn - gn) / d + 4) / 6;
          break;
      }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const hslToHex = (h: number, s: number, l: number) => {
    const sn = s / 100,
      ln = l / 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = sn * Math.min(ln, 1 - ln);
    const f = (n: number) => ln - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    const toHex = (v: number) => Math.round(v * 255).toString(16).padStart(2, '0');
    return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
  };

  const hsl = toHsl(color);
  const adjustedHex = hsl ? hslToHex(hsl.h, Math.min(100, hsl.s * (saturation / 100)), hsl.l) : color;
  const rgb = toRgb(adjustedHex);

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

  const canClear = color.toLowerCase() !== DEFAULT_COLOR || saturation !== DEFAULT_SAT;

  const copy = (label: string, value: string) => {
    navigator.clipboard.writeText(value).catch(() => {});
    setCopied(label);
    setTimeout(() => setCopied(''), 1500);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head" style={{ borderBottom: '1px solid var(--line)' }}>
        <span className="tb-v2-tool-label">Color Saturation Adjuster</span>
        <ToolExampleClearActions
          onExample={() => {
            setColorValue(EXAMPLE_COLOR);
            setSaturation(EXAMPLE_SAT);
          }}
          onClear={() => {
            setColorValue(DEFAULT_COLOR);
            setSaturation(DEFAULT_SAT);
          }}
          canClear={canClear}
        />
      </div>

      <div className="tb-v2-section" style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: 20 }}>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <input
            type="color"
            value={color}
            onChange={(e) => setColorValue(e.target.value)}
            className="w-20 h-20 rounded-xl cursor-pointer border-2 border-gray-200"
          />
          <div className="flex-1 w-full">
            <input
              type="text"
              value={colorInput}
              onChange={(e) => handleColorInput(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl font-mono text-lg"
            />
            {hexError && (
              <p style={{ fontSize: 12, color: '#ef4444', marginTop: 6 }}>
                Enter a valid 6-digit hex color (e.g., #3366FF).
              </p>
            )}
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Saturation</span>
            <span>{saturation}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="200"
            value={saturation}
            onChange={(e) => setSaturation(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => copy('hex', adjustedHex.toUpperCase())}
            className="bg-gray-50 rounded-xl p-4 text-left"
          >
            <div className="text-xs text-gray-500 mb-1">HEX</div>
            <div className="font-mono font-medium">{copied === 'hex' ? 'Copied' : adjustedHex.toUpperCase()}</div>
          </button>
          {rgb && (
            <button
              type="button"
              onClick={() => copy('rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`)}
              className="bg-gray-50 rounded-xl p-4 text-left"
            >
              <div className="text-xs text-gray-500 mb-1">RGB</div>
              <div className="font-mono font-medium">
                {copied === 'rgb' ? 'Copied' : `${rgb.r}, ${rgb.g}, ${rgb.b}`}
              </div>
            </button>
          )}
        </div>
        <div className="rounded-xl h-16" style={{ backgroundColor: adjustedHex }} />
      </div>
    </div>
  );
}
