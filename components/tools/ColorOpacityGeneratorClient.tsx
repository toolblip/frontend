'use client';

import { useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const DEFAULT_COLOR = '#6366f1';
const DEFAULT_OPACITY = 50;
const EXAMPLE_COLOR = '#e74c3c';
const EXAMPLE_OPACITY = 65;

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r ? { r: parseInt(r[1], 16), g: parseInt(r[2], 16), b: parseInt(r[3], 16) } : null;
}

function isValidHex(hex: string): boolean {
  return /^#?[a-f\d]{6}$/i.test(hex);
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((x) => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, '0'))
      .join('')
  );
}

export default function ColorOpacityGeneratorClient() {
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [colorInput, setColorInput] = useState(DEFAULT_COLOR.toUpperCase());
  const [hexError, setHexError] = useState(false);
  const [opacity, setOpacity] = useState(DEFAULT_OPACITY);
  const [copied, setCopied] = useState('');
  const rgb = hexToRgb(color);

  const r = rgb ? rgb.r : 0;
  const g = rgb ? rgb.g : 0;
  const b = rgb ? rgb.b : 0;
  const flattenedOnWhite = rgbToHex(
    255 - ((255 - r) * opacity) / 100,
    255 - ((255 - g) * opacity) / 100,
    255 - ((255 - b) * opacity) / 100
  );

  const hex8 = color.replace('#', '') + Math.round((opacity * 255) / 100).toString(16).padStart(2, '0');
  const rgba = rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${(opacity / 100).toFixed(2)})` : '-';

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

  const loadExample = () => {
    setColorValue(EXAMPLE_COLOR);
    setOpacity(EXAMPLE_OPACITY);
  };

  const clearAll = () => {
    setColorValue(DEFAULT_COLOR);
    setOpacity(DEFAULT_OPACITY);
  };

  const copy = (label: string, value: string) => {
    navigator.clipboard.writeText(value).catch(() => {});
    setCopied(label);
    setTimeout(() => setCopied(''), 1500);
  };

  const canClear =
    color.toLowerCase() !== DEFAULT_COLOR.toLowerCase() || opacity !== DEFAULT_OPACITY;

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head" style={{ borderBottom: '1px solid var(--line)' }}>
        <span className="tb-v2-tool-label">Color Opacity Generator</span>
        <ToolExampleClearActions onExample={loadExample} onClear={clearAll} canClear={canClear} />
      </div>

      <div className="tb-v2-section" style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: 20 }}>
        <div className="tb-v2-grid-2">
          <div>
            <label className="tb-v2-tool-label" style={{ marginBottom: 8, display: 'block' }}>
              Base Color
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={color}
                onChange={(e) => setColorValue(e.target.value)}
                className="rounded cursor-pointer"
                style={{ width: 56, height: 40 }}
              />
              <input
                type="text"
                value={colorInput}
                onChange={(e) => handleColorInput(e.target.value)}
                className="tb-v2-input flex-1"
                style={{ fontFamily: 'var(--f-mono)' }}
              />
            </div>
            {hexError && (
              <p style={{ fontSize: 12, color: '#ef4444', marginTop: 6 }}>Enter a valid 6-digit hex color.</p>
            )}
          </div>
          <div>
            <label className="tb-v2-tool-label" style={{ marginBottom: 8, display: 'block' }}>
              Opacity — {opacity}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="tb-v2-range"
              style={{ width: '100%' }}
            />
          </div>
        </div>

        <div className="tb-v2-grid-3">
          <div className="rounded-lg overflow-hidden border border-gray-200">
            <div className="h-32 checkerboard" style={{ backgroundColor: color }} />
            <div className="bg-gray-50 p-3 text-xs font-medium">Solid {color.toUpperCase()}</div>
          </div>
          <div className="rounded-lg overflow-hidden border border-gray-200">
            <div
              className="h-32 checkerboard"
              style={{ backgroundColor: `rgba(${rgb?.r ?? 0}, ${rgb?.g ?? 0}, ${rgb?.b ?? 0}, ${opacity / 100})` }}
            />
            <div className="bg-gray-50 p-3 text-xs font-medium">Opacity {opacity}%</div>
          </div>
          <div className="rounded-lg overflow-hidden border border-gray-200">
            <div className="h-32" style={{ backgroundColor: flattenedOnWhite }} />
            <div className="bg-gray-50 p-3 text-xs font-medium">Flattened on white</div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm font-mono">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">RGBA:</span>
            <button
              type="button"
              onClick={() => copy('rgba', rgba)}
              className={`tb-v2-copy-btn ${copied === 'rgba' ? 'done' : ''}`}
            >
              {copied === 'rgba' ? 'Copied' : rgba}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">HEX 8-digit:</span>
            <button
              type="button"
              onClick={() => copy('hex8', `#${hex8.toUpperCase()}`)}
              className={`tb-v2-copy-btn ${copied === 'hex8' ? 'done' : ''}`}
            >
              {copied === 'hex8' ? 'Copied' : `#${hex8.toUpperCase()}`}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Flattened HEX:</span>
            <button
              type="button"
              onClick={() => copy('flat', flattenedOnWhite.toUpperCase())}
              className={`tb-v2-copy-btn ${copied === 'flat' ? 'done' : ''}`}
            >
              {copied === 'flat' ? 'Copied' : flattenedOnWhite.toUpperCase()}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">CSS opacity:</span>
            <span>{(opacity / 100).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .checkerboard {
          background-image:
            linear-gradient(45deg, #ccc 25%, transparent 25%),
            linear-gradient(-45deg, #ccc 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #ccc 75%),
            linear-gradient(-45deg, transparent 75%, #ccc 75%);
          background-size: 16px 16px;
          background-position:
            0 0,
            0 8px,
            8px -8px,
            -8px 0px;
        }
      `}</style>
    </div>
  );
}
