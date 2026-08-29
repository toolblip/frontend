'use client';

import { useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const EXAMPLE_COLOR = '#e11d48';

function randomHex(): string {
  const n = Math.floor(Math.random() * 0xffffff);
  return `#${n.toString(16).padStart(6, '0')}`;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : null;
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
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

export default function RandomColorGeneratorClient() {
  const [color, setColor] = useState(() => randomHex());
  const [copied, setCopied] = useState('');

  const rgb = hexToRgb(color);
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;

  const copy = (label: string, value: string) => {
    navigator.clipboard.writeText(value).catch(() => {});
    setCopied(label);
    setTimeout(() => setCopied(''), 1500);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head" style={{ borderBottom: '1px solid var(--line)' }}>
        <span className="tb-v2-tool-label">Random Color Generator</span>
        <ToolExampleClearActions
          onExample={() => setColor(EXAMPLE_COLOR)}
          onClear={() => setColor(randomHex())}
          canClear
        />
      </div>

      <div className="tb-v2-section" style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: 20 }}>
        <div
          className="rounded-xl border"
          style={{ height: 140, backgroundColor: color, borderColor: 'var(--line)' }}
        />

        <button type="button" className="tb-v2-btn tb-v2-btn-primary" onClick={() => setColor(randomHex())}>
          Generate new color
        </button>

        {rgb && hsl && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <button type="button" onClick={() => copy('hex', color.toUpperCase())} className="bg-gray-50 rounded p-3 text-left">
              <span className="text-gray-500">HEX</span>
              <div className="font-mono font-medium">{copied === 'hex' ? 'Copied' : color.toUpperCase()}</div>
            </button>
            <button
              type="button"
              onClick={() => copy('rgb', `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}
              className="bg-gray-50 rounded p-3 text-left"
            >
              <span className="text-gray-500">RGB</span>
              <div className="font-mono font-medium">
                {copied === 'rgb' ? 'Copied' : `${rgb.r}, ${rgb.g}, ${rgb.b}`}
              </div>
            </button>
            <button
              type="button"
              onClick={() => copy('hsl', `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)}
              className="bg-gray-50 rounded p-3 text-left"
            >
              <span className="text-gray-500">HSL</span>
              <div className="font-mono font-medium">
                {copied === 'hsl' ? 'Copied' : `${hsl.h}°, ${hsl.s}%, ${hsl.l}%`}
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
