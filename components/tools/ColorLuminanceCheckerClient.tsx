'use client';

import React, { useState } from 'react';

function getLuminance(hex: string): number {
  const rgb = parseInt(hex.replace('#', ''), 16);
  const r = ((rgb >> 16) & 255) / 255;
  const g = ((rgb >> 8) & 255) / 255;
  const b = (rgb & 255) / 255;
  const toLinear = (c: number) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function getRelativeLuminance(hex: string): number {
  const rgb = parseInt(hex.replace('#', ''), 16);
  const r = ((rgb >> 16) & 255) / 255;
  const g = ((rgb >> 8) & 255) / 255;
  const b = (rgb & 255) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export default function ColorLuminanceCheckerClient() {
  const [colors, setColors] = useState<{ hex: string; name: string }[]>([
    { hex: '#000000', name: 'Black' },
    { hex: '#ffffff', name: 'White' },
    { hex: '#808080', name: 'Gray' },
  ]);
  const [newHex, setNewHex] = useState('');
  const [newName, setNewName] = useState('');

  const addColor = () => {
    if (newHex && !colors.find(c => c.hex === newHex)) {
      setColors([...colors, { hex: newHex, name: newName || newHex }]);
      setNewHex('');
      setNewName('');
    }
  };

  const removeColor = (hex: string) => setColors(colors.filter(c => c.hex !== hex));

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Color Luminance Checker</h1>

      <div className="mb-6 space-y-3">
        <div className="tb-v2-mode-tabs">
          <input
            type="color"
            value={newHex.startsWith('#') ? newHex : '#000000'}
            onChange={e => setNewHex(e.target.value)}
            className="w-12 h-10 rounded cursor-pointer"
          />
          <input
            type="text"
            value={newHex}
            onChange={e => setNewHex(e.target.value)}
            className="flex-1 p-2 border rounded font-mono"
            placeholder="#000000"
          />
          <input
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            className="w-32 p-2 border rounded"
            placeholder="Color name"
          />
          <button onClick={addColor} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Add
          </button>
        </div>
      </div>

      <div className="space-y-2 mb-6">
        {colors.map(({ hex, name }) => {
          const lum = getRelativeLuminance(hex);
          const wcag = lum > 0.179 ? 'light' : 'dark';
          return (
            <div key={hex} className="flex items-center gap-4 p-3 rounded border">
              <div
                className="w-12 h-12 rounded border flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: hex, color: wcag === 'light' ? '#000' : '#fff' }}
              >
                Aa
              </div>
              <div className="flex-1">
                <div className="font-medium">{name}</div>
                <div className="text-sm text-gray-500 font-mono">{hex.toUpperCase()}</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">{(lum * 100).toFixed(1)}%</div>
                <div className="text-xs text-gray-500">Relative Luminance</div>
              </div>
              <div className={`px-2 py-1 rounded text-xs font-medium ${wcag === 'light' ? 'bg-green-100 text-green-800' : 'bg-gray-800 text-white'}`}>
                {wcag === 'light' ? 'Dark Text' : 'Light Text'}
              </div>
              <button onClick={() => removeColor(hex)} className="text-red-500 hover:text-red-700 text-sm">✗</button>
            </div>
          );
        })}
      </div>

      <div className="p-4 bg-blue-50 rounded border border-blue-200 text-sm">
        <strong>Relative luminance</strong> determines whether light or dark text should be used on a background color for WCAG compliance. Values above 17.9% are considered light backgrounds.
      </div>
    </div>
  );
}
