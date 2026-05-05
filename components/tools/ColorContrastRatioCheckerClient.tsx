'use client';

import React, { useState, useEffect } from 'react';

function getLuminance(hex: string): number {
  const rgb = parseInt(hex.replace('#', ''), 16);
  const r = ((rgb >> 16) & 255) / 255;
  const g = ((rgb >> 8) & 255) / 255;
  const b = (rgb & 255) / 255;
  const toLinear = (c: number) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function getContrastRatio(hex1: string, hex2: string): number {
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export default function ColorContrastRatioCheckerClient() {
  const [fg, setFg] = useState('#000000');
  const [bg, setBg] = useState('#ffffff');
  const [ratio, setRatio] = useState(21);

  useEffect(() => {
    setRatio(Math.round(getContrastRatio(fg, bg) * 100) / 100);
  }, [fg, bg]);

  const copyRatio = () => navigator.clipboard.writeText(`${ratio}:1`);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Color Contrast Ratio Checker</h1>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Foreground</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={fg}
              onChange={(e) => setFg(e.target.value)}
              className="w-12 h-10 rounded cursor-pointer"
            />
            <input
              type="text"
              value={fg}
              onChange={(e) => setFg(e.target.value)}
              className="flex-1 p-2 border rounded font-mono"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Background</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={bg}
              onChange={(e) => setBg(e.target.value)}
              className="w-12 h-10 rounded cursor-pointer"
            />
            <input
              type="text"
              value={bg}
              onChange={(e) => setBg(e.target.value)}
              className="flex-1 p-2 border rounded font-mono"
            />
          </div>
        </div>
      </div>

      <div className="mb-6 p-8 rounded-lg text-center text-3xl font-bold" style={{ backgroundColor: bg, color: fg }}>
        Sample Text Preview
      </div>

      <div className="text-center mb-6">
        <div className="text-5xl font-bold mb-2">{ratio}:1</div>
        <button onClick={copyRatio} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm">
          Copy ratio
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        {[
          { label: 'AA Normal Text', pass: ratio >= 4.5, req: '4.5:1' },
          { label: 'AA Large Text', pass: ratio >= 3, req: '3:1' },
          { label: 'AAA Normal Text', pass: ratio >= 7, req: '7:1' },
        ].map(({ label, pass, req }) => (
          <div key={label} className={`p-4 rounded border ${pass ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
            <div className="text-xl font-bold">{pass ? '✓ PASS' : '✗ FAIL'}</div>
            <div className="text-sm">{label}</div>
            <div className="text-xs text-gray-500">Min: {req}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
