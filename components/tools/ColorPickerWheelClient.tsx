'use client';

import { useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const DEFAULT_COLOR = '#6366f1';
const EXAMPLE_COLOR = '#22c55e';

function toRgb(hex: string) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r ? { r: parseInt(r[1], 16), g: parseInt(r[2], 16), b: parseInt(r[3], 16) } : null;
}

function toHsl(r: number, g: number, b: number) {
  const rn = r / 255,
    gn = g / 255,
    bn = b / 255;
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
      default:
        h = ((rn - gn) / d + 4) / 6;
        break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export default function ColorPickerWheelClient() {
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [copied, setCopied] = useState('');

  const rgb = toRgb(color);
  const hsl = rgb ? toHsl(rgb.r, rgb.g, rgb.b) : null;

  const copy = (label: string, value: string) => {
    navigator.clipboard.writeText(value).catch(() => {});
    setCopied(label);
    setTimeout(() => setCopied(''), 1500);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head" style={{ borderBottom: '1px solid var(--line)' }}>
        <span className="tb-v2-tool-label">Color Picker Wheel</span>
        <ToolExampleClearActions
          onExample={() => setColor(EXAMPLE_COLOR)}
          onClear={() => setColor(DEFAULT_COLOR)}
          canClear={color.toLowerCase() !== DEFAULT_COLOR}
        />
      </div>

      <div className="tb-v2-section" style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '16px 20px' }}>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-full h-40 rounded-full cursor-pointer border-0"
          aria-label="Color wheel"
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button type="button" onClick={() => copy('hex', color.toUpperCase())} className="bg-gray-50 rounded-xl p-3 text-left">
            <div className="text-xs text-gray-500">HEX</div>
            <div className="font-mono font-bold">{copied === 'hex' ? 'Copied' : color.toUpperCase()}</div>
          </button>
          {rgb && (
            <button
              type="button"
              onClick={() => copy('rgb', `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}
              className="bg-gray-50 rounded-xl p-3 text-left"
            >
              <div className="text-xs text-gray-500">RGB</div>
              <div className="font-mono font-bold">
                {copied === 'rgb' ? 'Copied' : `${rgb.r}, ${rgb.g}, ${rgb.b}`}
              </div>
            </button>
          )}
          {hsl && (
            <button
              type="button"
              onClick={() => copy('hsl', `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)}
              className="bg-gray-50 rounded-xl p-3 text-left"
            >
              <div className="text-xs text-gray-500">HSL</div>
              <div className="font-mono font-bold">
                {copied === 'hsl' ? 'Copied' : `${hsl.h}°, ${hsl.s}%, ${hsl.l}%`}
              </div>
            </button>
          )}
        </div>
        <div className="rounded-full h-24 w-24 mx-auto border" style={{ backgroundColor: color }} />
      </div>
    </div>
  );
}
