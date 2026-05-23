'use client';

import React, { useState } from 'react';

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
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
  const [color2, setColor2] = useState('#ec4899');
  const [ratio, setRatio] = useState(50);

  const result = mixColors(color1, color2, ratio / 100);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Color 1</label>
          <div className="flex gap-2">
            <input type="color" value={color1} onChange={e => setColor1(e.target.value)} className="w-12 h-10 rounded cursor-pointer" />
            <input type="text" value={color1} onChange={e => setColor1(e.target.value)} className="flex-1 px-3 py-2 border rounded font-mono text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Color 2</label>
          <div className="flex gap-2">
            <input type="color" value={color2} onChange={e => setColor2(e.target.value)} className="w-12 h-10 rounded cursor-pointer" />
            <input type="text" value={color2} onChange={e => setColor2(e.target.value)} className="flex-1 px-3 py-2 border rounded font-mono text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Ratio  -  {ratio}%</label>
          <input type="range" min="0" max="100" value={ratio} onChange={e => setRatio(Number(e.target.value))} className="w-full" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-lg border-4" style={{ backgroundColor: color1 }} />
        <div className="text-2xl text-gray-400">+</div>
        <div className="w-20 h-20 rounded-lg border-4" style={{ backgroundColor: color2 }} />
        <div className="text-2xl text-gray-400">=</div>
        <div className="w-20 h-20 rounded-lg border-4 border-gray-300" style={{ backgroundColor: result }} />
      </div>

      <div className="bg-gray-50 rounded p-4 font-mono text-sm">
        <div className="font-medium mb-2">Mixed Result</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div><span className="text-gray-500">HEX:</span> {result.toUpperCase()}</div>
          <div><span className="text-gray-500">RGB:</span> {(() => { const c = hexToRgb(result); return c ? `rgb(${c.r},${c.g},${c.b})` : ' - '; })()}</div>
        </div>
      </div>
    </div>
  );
}
