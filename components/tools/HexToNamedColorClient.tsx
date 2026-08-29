'use client';

import { useMemo, useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const DEFAULT_HEX = '#3498db';
const EXAMPLE_HEX = '#dc143c';

const namedColors: Record<string, string> = {
  '#FF0000': 'Red',
  '#00FF00': 'Lime',
  '#0000FF': 'Blue',
  '#FFFFFF': 'White',
  '#000000': 'Black',
  '#FFFF00': 'Yellow',
  '#00FFFF': 'Cyan',
  '#FF00FF': 'Magenta',
  '#C0C0C0': 'Silver',
  '#808080': 'Gray',
  '#800000': 'Maroon',
  '#808000': 'Olive',
  '#008000': 'Green',
  '#800080': 'Purple',
  '#008080': 'Teal',
  '#000080': 'Navy',
  '#FFA500': 'Orange',
  '#FFC0CB': 'Pink',
  '#A52A2A': 'Brown',
  '#F0F8FF': 'AliceBlue',
  '#FFE4C4': 'Bisque',
  '#DEB887': 'BurlyWood',
  '#DC143C': 'Crimson',
  '#00008B': 'DarkBlue',
  '#008B8B': 'DarkCyan',
  '#B8860B': 'DarkGoldenRod',
  '#A9A9A9': 'DarkGray',
  '#006400': 'DarkGreen',
  '#4B0082': 'Indigo',
  '#FF8C00': 'DarkOrange',
  '#9932CC': 'DarkOrchid',
  '#E9967A': 'DarkSalmon',
  '#8B0000': 'DarkRed',
  '#2F4F4F': 'DarkSlateGray',
  '#D2691E': 'Chocolate',
  '#FF7F50': 'Coral',
  '#6495ED': 'CornflowerBlue',
  '#DAA520': 'GoldenRod',
  '#FFD700': 'Gold',
  '#ADFF2F': 'GreenYellow',
  '#F0FFF0': 'HoneyDew',
  '#FF69B4': 'HotPink',
  '#CD853F': 'Peru',
  '#FF4500': 'OrangeRed',
  '#DA70D6': 'Orchid',
  '#EEEEEE': 'Gainsboro',
};

function isValidHex(hex: string): boolean {
  return /^#?[a-f\d]{6}$/i.test(hex);
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : null;
}

function findNearestNamedColor(hex: string): { name: string; distance: number } | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;

  const exact = namedColors[hex.toUpperCase()];
  if (exact) return { name: exact, distance: 0 };

  let nearestName = 'Custom Color';
  let nearestDistance = Infinity;

  for (const [colorHex, name] of Object.entries(namedColors)) {
    const colorRgb = hexToRgb(colorHex);
    if (!colorRgb) continue;
    const distance = Math.sqrt(
      (rgb.r - colorRgb.r) ** 2 + (rgb.g - colorRgb.g) ** 2 + (rgb.b - colorRgb.b) ** 2
    );
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestName = name;
    }
  }
  return { name: nearestName, distance: nearestDistance };
}

export default function HexToNamedColorClient() {
  const [hex, setHex] = useState(DEFAULT_HEX);
  const [hexInput, setHexInput] = useState(DEFAULT_HEX.toUpperCase());
  const [hexError, setHexError] = useState(false);
  const [copied, setCopied] = useState('');

  const result = useMemo(() => findNearestNamedColor(hex), [hex]);

  const setColorValue = (value: string) => {
    setHex(value);
    setHexInput(value.toUpperCase());
    setHexError(false);
  };

  const handleHexInput = (value: string) => {
    setHexInput(value);
    if (isValidHex(value)) {
      setHex(value.startsWith('#') ? value : `#${value}`);
      setHexError(false);
    } else {
      setHexError(true);
    }
  };

  const copy = (value: string) => {
    navigator.clipboard.writeText(value).catch(() => {});
    setCopied(value);
    setTimeout(() => setCopied(''), 1500);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head" style={{ borderBottom: '1px solid var(--line)' }}>
        <span className="tb-v2-tool-label">HEX to Named Color</span>
        <ToolExampleClearActions
          onExample={() => setColorValue(EXAMPLE_HEX)}
          onClear={() => setColorValue(DEFAULT_HEX)}
          canClear={hex.toLowerCase() !== DEFAULT_HEX.toLowerCase()}
        />
      </div>

      <div className="tb-v2-section" style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: 20 }}>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <input
            type="color"
            value={hex}
            onChange={(e) => setColorValue(e.target.value)}
            className="w-20 h-20 rounded-xl cursor-pointer border-2 border-gray-200"
          />
          <div className="flex-1 w-full">
            <label className="tb-v2-tool-label" style={{ marginBottom: 8, display: 'block' }}>
              Hex
            </label>
            <input
              type="text"
              value={hexInput}
              onChange={(e) => handleHexInput(e.target.value)}
              className="tb-v2-input"
              style={{ fontFamily: 'var(--f-mono)', fontSize: 18 }}
              placeholder="#3498DB"
            />
            {hexError && (
              <p style={{ fontSize: 12, color: '#ef4444', marginTop: 6 }}>
                Enter a valid 6-digit hex color (e.g. #DC143C).
              </p>
            )}
          </div>
        </div>

        {result && (
          <div className="rounded-lg p-6 text-center" style={{ background: 'var(--surface-2, #f5f5f5)' }}>
            <div
              className="mx-auto mb-3 rounded-xl border"
              style={{ width: 72, height: 72, backgroundColor: hex, borderColor: 'var(--line)' }}
            />
            <div className="text-2xl font-bold mb-1">{result.name}</div>
            <div className="text-sm text-gray-500 mb-3">
              {result.distance === 0
                ? 'Exact CSS named color'
                : `Nearest CSS named color · distance ${Math.round(result.distance)}`}
            </div>
            <button
              type="button"
              className="tb-v2-copy-btn"
              onClick={() => copy(result.name)}
            >
              {copied === result.name ? 'Copied' : 'Copy name'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
