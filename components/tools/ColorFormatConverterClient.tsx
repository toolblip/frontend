'use client';

import React, { useState } from 'react';

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
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

export default function ColorFormatConverterClient() {
  const [input, setInput] = useState('#3498db');
  const [format, setFormat] = useState<'hex' | 'rgb' | 'hsl'>('hex');

  const rgb = input.startsWith('#') ? hexToRgb(input) : null;
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;

  const copyValue = (val: string) => navigator.clipboard.writeText(val);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Color Format Converter</h1>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Enter Color (HEX, RGB, or HSL)</label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-3 border rounded font-mono"
          placeholder="#3498db"
        />
      </div>

      <div className="flex gap-2 mb-6">
        {(['hex', 'rgb', 'hsl'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFormat(f)}
            className={`px-4 py-2 rounded ${format === f ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {rgb ? (
        <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:16,padding:"16px 20px"}}>
          <div className="p-6 rounded-lg flex items-center gap-4" style={{ backgroundColor: input }}>
            <span className="text-lg font-bold" style={{ color: hsl && hsl.l < 50 ? '#fff' : '#000' }}>
              {input.toUpperCase()}
            </span>
          </div>

          <div className="space-y-2">
            {[
              { label: 'HEX', value: input.toUpperCase() },
              { label: 'RGB', value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
              { label: 'HSL', value: hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : ' - ' },
              { label: 'HEX (8-digit)', value: (input.replace('#', '') + 'ff').toUpperCase() },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                <div>
                  <span className="text-sm text-gray-500">{label}</span>
                  <div className="font-mono">{value}</div>
                </div>
                <button
                  onClick={() => copyValue(value)}
                  className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                >
                  Copy
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-4 bg-red-50 rounded border border-red-200 text-red-700">
          Invalid color format. Enter a valid HEX color (e.g., #3498db)
        </div>
      )}
    </div>
  );
}
