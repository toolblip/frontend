'use client';

import React, { useState, useEffect } from 'react';

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function wcagCompliance(ratio: number): {
  aaLarge: boolean;
  aaNormal: boolean;
  aaaLarge: boolean;
  aaaNormal: boolean;
} {
  return {
    aaLarge: ratio >= 3,
    aaNormal: ratio >= 4.5,
    aaaLarge: ratio >= 4.5,
    aaaNormal: ratio >= 7,
  };
}

export default function ColorContrastCheckerClient() {
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [fgRgb, setFgRgb] = useState({ r: 0, g: 0, b: 0 });
  const [bgRgb, setBgRgb] = useState({ r: 255, g: 255, b: 255 });
  const [fgLuminance, setFgLuminance] = useState(0);
  const [bgLuminance, setBgLuminance] = useState(1);
  const [contrastRatio, setContrastRatio] = useState(21);
  const [compliance, setCompliance] = useState({
    aaLarge: true,
    aaNormal: true,
    aaaLarge: true,
    aaaNormal: true,
  });

  useEffect(() => {
    const parsedFg = hexToRgb(fgColor);
    const parsedBg = hexToRgb(bgColor);
    if (parsedFg) setFgRgb(parsedFg);
    if (parsedBg) setBgRgb(parsedBg);
  }, [fgColor, bgColor]);

  useEffect(() => {
    const fgLum = getLuminance(fgRgb.r, fgRgb.g, fgRgb.b);
    const bgLum = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b);
    setFgLuminance(fgLum);
    setBgLuminance(bgLum);
    const ratio = getContrastRatio(fgLum, bgLum);
    setContrastRatio(ratio);
    setCompliance(wcagCompliance(ratio));
  }, [fgRgb, bgRgb]);

  const swapColors = () => {
    const tempColor = fgColor;
    setFgColor(bgColor);
    setBgColor(tempColor);
  };

  const presetCombos = [
    { fg: '#000000', bg: '#ffffff', name: 'Black on White' },
    { fg: '#ffffff', bg: '#000000', name: 'White on Black' },
    { fg: '#000000', bg: '#ffff00', name: 'Black on Yellow' },
    { fg: '#ffffff', bg: '#0000ff', name: 'White on Blue' },
    { fg: '#000000', bg: '#00ff00', name: 'Black on Green' },
    { fg: '#ffffff', bg: '#ff0000', name: 'White on Red' },
    { fg: '#333333', bg: '#f5f5f5', name: 'Dark Gray on Light' },
    { fg: '#0066cc', bg: '#ffffff', name: 'Link Blue on White' },
  ];

  return (
    <div className="tb-v2-card">
      <div className="tb-v2-card-header">
        <h2 className="tb-v2-card-title">Color Contrast Checker</h2>
        <p className="tb-v2-card-description">
          Check contrast ratio between two colors for WCAG accessibility compliance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="tb-v2-form-group">
          <label className="tb-v2-label">Foreground Color</label>
          <div className="flex gap-3 items-center">
            <input
              type="color"
              value={fgColor}
              onChange={(e) => setFgColor(e.target.value)}
              className="tb-v2-input h-12 w-24 cursor-pointer rounded border"
            />
            <input
              type="text"
              value={fgColor.toUpperCase()}
              onChange={(e) => setFgColor(e.target.value)}
              className="tb-v2-input flex-1 uppercase"
              placeholder="#000000"
            />
          </div>
          <div className="mt-2 text-xs text-gray-500">
            RGB: {fgRgb.r}, {fgRgb.g}, {fgRgb.b}
          </div>
        </div>

        <div className="tb-v2-form-group">
          <label className="tb-v2-label">Background Color</label>
          <div className="flex gap-3 items-center">
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="tb-v2-input h-12 w-24 cursor-pointer rounded border"
            />
            <input
              type="text"
              value={bgColor.toUpperCase()}
              onChange={(e) => setBgColor(e.target.value)}
              className="tb-v2-input flex-1 uppercase"
              placeholder="#FFFFFF"
            />
          </div>
          <div className="mt-2 text-xs text-gray-500">
            RGB: {bgRgb.r}, {bgRgb.g}, {bgRgb.b}
          </div>
        </div>
      </div>

      <div className="flex justify-center mb-6">
        <button
          onClick={swapColors}
          className="tb-v2-button-secondary"
        >
          ⇄ Swap Colors
        </button>
      </div>

      <div className="tb-v2-card p-6 mb-6">
        <div className="text-center mb-4">
          <div className="text-5xl font-bold mb-2">{contrastRatio.toFixed(2)}:1</div>
          <div className="text-sm text-gray-500">Contrast Ratio</div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`p-3 rounded text-center ${compliance.aaLarge ? 'bg-green-100' : 'bg-red-100'}`}>
            <div className={`text-lg font-bold ${compliance.aaLarge ? 'text-green-700' : 'text-red-700'}`}>
              {compliance.aaLarge ? '✓ PASS' : '✗ FAIL'}
            </div>
            <div className="text-xs text-gray-600">AA Large Text</div>
          </div>
          <div className={`p-3 rounded text-center ${compliance.aaNormal ? 'bg-green-100' : 'bg-red-100'}`}>
            <div className={`text-lg font-bold ${compliance.aaNormal ? 'text-green-700' : 'text-red-700'}`}>
              {compliance.aaNormal ? '✓ PASS' : '✗ FAIL'}
            </div>
            <div className="text-xs text-gray-600">AA Normal Text</div>
          </div>
          <div className={`p-3 rounded text-center ${compliance.aaaLarge ? 'bg-green-100' : 'bg-red-100'}`}>
            <div className={`text-lg font-bold ${compliance.aaaLarge ? 'text-green-700' : 'text-red-700'}`}>
              {compliance.aaaLarge ? '✓ PASS' : '✗ FAIL'}
            </div>
            <div className="text-xs text-gray-600">AAA Large Text</div>
          </div>
          <div className={`p-3 rounded text-center ${compliance.aaaNormal ? 'bg-green-100' : 'bg-red-100'}`}>
            <div className={`text-lg font-bold ${compliance.aaaNormal ? 'text-green-700' : 'text-red-700'}`}>
              {compliance.aaaNormal ? '✓ PASS' : '✗ FAIL'}
            </div>
            <div className="text-xs text-gray-600">AAA Normal Text</div>
          </div>
        </div>
      </div>

      <div className="tb-v2-form-group">
        <div className="tb-v2-label">Preview</div>
        <div
          className="p-6 rounded-lg"
          style={{ backgroundColor: bgColor }}
        >
          <p className="text-lg" style={{ color: fgColor }}>
            Normal Text (16px) - The quick brown fox jumps over the lazy dog
          </p>
          <p className="text-sm mt-2" style={{ color: fgColor }}>
            Small Text (12px) - The quick brown fox jumps over the lazy dog
          </p>
          <p className="text-xl font-bold mt-2" style={{ color: fgColor }}>
            Large Text (20px Bold) - The quick brown fox
          </p>
          <button
            className="mt-4 px-4 py-2 rounded font-medium"
            style={{ backgroundColor: fgColor, color: bgColor }}
          >
            Sample Button
          </button>
        </div>
      </div>

      <div className="tb-v2-form-group">
        <div className="tb-v2-label">Preset Combinations</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {presetCombos.map((combo) => {
            const fgRgbLocal = hexToRgb(combo.fg)!;
            const bgRgbLocal = hexToRgb(combo.bg)!;
            const fgLum = getLuminance(fgRgbLocal.r, fgRgbLocal.g, fgRgbLocal.b);
            const bgLum = getLuminance(bgRgbLocal.r, bgRgbLocal.g, bgRgbLocal.b);
            const ratio = getContrastRatio(fgLum, bgLum);
            const pass = ratio >= 4.5;
            return (
              <button
                key={combo.name}
                onClick={() => {
                  setFgColor(combo.fg);
                  setBgColor(combo.bg);
                }}
                className="p-2 rounded border text-left hover:bg-gray-50"
                style={{
                  backgroundColor: combo.bg,
                  borderColor: pass ? '#22c55e' : '#ef4444',
                }}
              >
                <div
                  className="text-sm font-medium text-xs px-2 py-1 rounded"
                  style={{ backgroundColor: combo.fg, color: combo.bg }}
                >
                  Aa
                </div>
                <div className="text-xs mt-1" style={{ color: combo.fg }}>
                  {combo.name}
                </div>
                <div className="text-xs text-gray-500">{ratio.toFixed(1)}:1</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="tb-v2-form-group">
        <div className="tb-v2-label">WCAG Requirements</div>
        <div className="text-sm space-y-1">
          <p><strong>AA Normal Text:</strong> 4.5:1 minimum</p>
          <p><strong>AA Large Text:</strong> 3:1 minimum (18pt+ or 14pt+ bold)</p>
          <p><strong>AAA Normal Text:</strong> 7:1 minimum</p>
          <p><strong>AAA Large Text:</strong> 4.5:1 minimum</p>
        </div>
      </div>
    </div>
  );
}
