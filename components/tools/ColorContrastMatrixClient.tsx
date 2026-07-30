'use client';

import { useState } from 'react';

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

function getRatioClass(ratio: number): string {
  if (ratio >= 7) return 'bg-green-500 text-white';
  if (ratio >= 4.5) return 'bg-green-300 text-black';
  if (ratio >= 3) return 'bg-yellow-300 text-black';
  return 'bg-red-400 text-white';
}

function isValidHex(hex: string): boolean {
  return /^#?[a-f\d]{6}$/i.test(hex);
}

const DEFAULT_COLORS = ['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

export default function ColorContrastMatrixClient() {
  const [colors, setColors] = useState<string[]>(DEFAULT_COLORS);
  const [newColor, setNewColor] = useState('');
  const [colorError, setColorError] = useState(false);
  const [copiedCell, setCopiedCell] = useState('');

  const addColor = () => {
    if (!newColor) return;
    const hex = newColor.startsWith('#') ? newColor : `#${newColor}`;
    if (!isValidHex(hex)) {
      setColorError(true);
      return;
    }
    if (!colors.includes(hex.toLowerCase())) {
      setColors([...colors, hex.toLowerCase()]);
    }
    setNewColor('');
    setColorError(false);
  };

  const removeColor = (c: string) => {
    if (colors.length > 2) setColors(colors.filter(x => x !== c));
  };

  const loadExample = () => {
    setColors(DEFAULT_COLORS);
    setNewColor('');
    setColorError(false);
  };

  const copyCell = (fg: string, bg: string) => {
    const key = `${fg}|${bg}`;
    navigator.clipboard.writeText(`${fg} on ${bg}: ${getContrastRatio(fg, bg).toFixed(2)}:1`).catch(() => {});
    setCopiedCell(key);
    setTimeout(() => setCopiedCell(''), 1000);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Color Contrast Matrix</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>

      <div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newColor}
            onChange={(e) => { setNewColor(e.target.value); setColorError(false); }}
            onKeyDown={(e) => e.key === 'Enter' && addColor()}
            className="tb-v2-input flex-1"
            style={{ fontFamily: 'var(--f-mono)' }}
            placeholder="#ff0000"
          />
          <button type="button" onClick={addColor} className="tb-v2-btn tb-v2-btn-primary">
            Add Color
          </button>
        </div>
        {colorError && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 6 }}>Enter a valid 6-digit hex color (e.g., #3366FF).</p>}
      </div>

      <p style={{ fontSize: 12, color: 'var(--tb-text-secondary)' }}>Click a cell to copy its contrast ratio. Right-click a header swatch to remove it below.</p>

      <div className="overflow-x-auto">
        <table className="border-collapse text-sm">
          <thead>
            <tr>
              <th className="p-2 border bg-gray-100"></th>
              {colors.map(c => (
                <th key={c} className="p-2 border">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 rounded border" style={{ backgroundColor: c }} />
                    <span className="font-mono text-xs">{c}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {colors.map(fg => (
              <tr key={fg}>
                <td className="p-2 border bg-gray-100">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 rounded border" style={{ backgroundColor: fg }} />
                    <span className="font-mono text-xs">{fg}</span>
                  </div>
                </td>
                {colors.map(bg => (
                  <td key={bg} className="p-1 border">
                    {fg === bg ? (
                      <div className="w-12 h-12 flex items-center justify-center text-gray-400"> - </div>
                    ) : (
                      <div
                        className={`w-12 h-12 flex items-center justify-center rounded font-bold text-xs cursor-pointer ${getRatioClass(getContrastRatio(fg, bg))}`}
                        title={`${fg} on ${bg} - click to copy`}
                        onClick={() => copyCell(fg, bg)}
                      >
                        {copiedCell === `${fg}|${bg}` ? 'Copied' : getContrastRatio(fg, bg).toFixed(1)}
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {colors.length > 2 && (
        <div>
          <p className="tb-v2-tool-label" style={{ marginBottom: 8 }}>Remove Colors</p>
          <div className="flex gap-2 flex-wrap">
            {colors.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => removeColor(c)}
                className="flex items-center gap-1 px-2 py-1 rounded border text-xs font-mono"
              >
                <span className="w-3 h-3 rounded" style={{ backgroundColor: c }} />
                {c}
                <span aria-hidden>x</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-4 text-sm flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-green-500"></div>
          <span>AAA (7:1+)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-green-300"></div>
          <span>AA (4.5:1+)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-yellow-300"></div>
          <span>AA Large (3:1+)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-red-400"></div>
          <span>Fail (&lt;3:1)</span>
        </div>
      </div>
    </div>
  );
}
