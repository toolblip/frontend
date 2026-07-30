'use client';

import { useState } from 'react';

function getRelativeLuminance(hex: string): number {
  const rgb = parseInt(hex.replace('#', ''), 16);
  const r = ((rgb >> 16) & 255) / 255;
  const g = ((rgb >> 8) & 255) / 255;
  const b = (rgb & 255) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function isValidHex(hex: string): boolean {
  return /^#?[a-f\d]{6}$/i.test(hex);
}

export default function ColorLuminanceCheckerClient() {
  const [colors, setColors] = useState<{ hex: string; name: string }[]>([
    { hex: '#000000', name: 'Black' },
    { hex: '#ffffff', name: 'White' },
    { hex: '#808080', name: 'Gray' },
  ]);
  const [newHex, setNewHex] = useState('');
  const [newName, setNewName] = useState('');
  const [hexError, setHexError] = useState(false);
  const [copied, setCopied] = useState('');

  const addColor = () => {
    if (!newHex) return;
    if (!isValidHex(newHex)) {
      setHexError(true);
      return;
    }
    const hex = newHex.startsWith('#') ? newHex.toLowerCase() : `#${newHex.toLowerCase()}`;
    if (colors.find(c => c.hex === hex)) {
      setHexError(false);
      return;
    }
    setColors([...colors, { hex, name: newName || hex }]);
    setNewHex('');
    setNewName('');
    setHexError(false);
  };

  const removeColor = (hex: string) => setColors(colors.filter(c => c.hex !== hex));

  const loadExample = () => {
    setColors([
      { hex: '#000000', name: 'Black' },
      { hex: '#ffffff', name: 'White' },
      { hex: '#3498db', name: 'Sky Blue' },
      { hex: '#f1c40f', name: 'Sun Yellow' },
    ]);
  };

  const copy = (hex: string) => {
    navigator.clipboard.writeText(hex).catch(() => {});
    setCopied(hex);
    setTimeout(() => setCopied(''), 1500);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Color Luminance Checker</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        <input
          type="color"
          value={isValidHex(newHex) ? (newHex.startsWith('#') ? newHex : `#${newHex}`) : '#000000'}
          onChange={e => { setNewHex(e.target.value); setHexError(false); }}
          className="rounded cursor-pointer"
          style={{ width: 48, height: 40 }}
        />
        <input
          type="text"
          value={newHex}
          onChange={e => { setNewHex(e.target.value); setHexError(false); }}
          className="tb-v2-input flex-1"
          style={{ fontFamily: 'var(--f-mono)', minWidth: 120 }}
          placeholder="#000000"
        />
        <input
          type="text"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          className="tb-v2-input"
          style={{ width: 140 }}
          placeholder="Color name"
        />
        <button type="button" onClick={addColor} className="tb-v2-btn tb-v2-btn-primary">
          Add
        </button>
      </div>
      {hexError && <p style={{ fontSize: 12, color: '#ef4444' }}>Enter a valid 6-digit hex color (e.g., #3366FF).</p>}

      <div className="flex flex-col gap-2">
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
              <button
                type="button"
                onClick={() => copy(hex)}
                className={`tb-v2-copy-btn ${copied === hex ? 'done' : ''}`}
              >
                {copied === hex ? 'Copied' : 'Copy'}
              </button>
              <button type="button" onClick={() => removeColor(hex)} className="text-red-500 hover:text-red-700 text-sm">Remove</button>
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
