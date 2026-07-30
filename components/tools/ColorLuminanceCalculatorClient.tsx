'use client';

import { useState, useEffect } from 'react';

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

function isValidHex(hex: string): boolean {
  return /^#?[a-f\d]{6}$/i.test(hex);
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export default function ColorLuminanceCalculatorClient() {
  const [colorInput, setColorInput] = useState('#3498db');
  const [hexInput, setHexInput] = useState('#3498db');
  const [hexError, setHexError] = useState(false);
  const [rgb, setRgb] = useState({ r: 52, g: 152, b: 219 });
  const [hsl, setHsl] = useState({ h: 204, s: 70, l: 53 });
  const [relativeLuminance, setRelativeLuminance] = useState(0);
  const [luminancePercent, setLuminancePercent] = useState(0);
  const [perceivedBrightness, setPerceivedBrightness] = useState('');

  useEffect(() => {
    const parsed = hexToRgb(colorInput);
    if (parsed) {
      setRgb(parsed);
      const lum = getLuminance(parsed.r, parsed.g, parsed.b);
      setRelativeLuminance(lum);
      setLuminancePercent(lum * 100);
      setPerceivedBrightness(
        lum > 0.5
          ? 'Light'
          : lum > 0.25
          ? 'Medium'
          : 'Dark'
      );
    }
  }, [colorInput]);

  useEffect(() => {
    setHsl(rgbToHsl(rgb.r, rgb.g, rgb.b));
  }, [rgb]);

  const setColorValue = (value: string) => {
    setColorInput(value);
    setHexInput(value);
    setHexError(false);
  };

  const handleHexInput = (value: string) => {
    setHexInput(value);
    if (isValidHex(value)) {
      setColorInput(value.startsWith('#') ? value : `#${value}`);
      setHexError(false);
    } else {
      setHexError(true);
    }
  };

  const loadExample = () => setColorValue('#f39c12');

  const presetColors = [
    '#000000',
    '#ffffff',
    '#ff0000',
    '#00ff00',
    '#0000ff',
    '#ffff00',
    '#ff00ff',
    '#00ffff',
    '#808080',
    '#c0c0c0',
  ];

  const lightnessScale = Array.from({ length: 11 }, (_, i) => i * 10);

  const whiteRatio = (1 + 0.05) / (relativeLuminance + 0.05);
  const blackRatio = (relativeLuminance + 0.05) / 0.05;

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Color Luminance Calculator</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>

      <div>
        <label className="tb-v2-tool-label" style={{ marginBottom: 6, display: 'block' }}>Enter Color (HEX)</label>
        <div className="flex gap-3 items-center">
          <input
            type="color"
            value={colorInput}
            onChange={(e) => setColorValue(e.target.value)}
            className="cursor-pointer rounded border"
            style={{ width: 48, height: 40 }}
          />
          <input
            type="text"
            value={hexInput}
            onChange={(e) => handleHexInput(e.target.value)}
            className="tb-v2-input flex-1 uppercase"
            style={{ fontFamily: 'var(--f-mono)' }}
            placeholder="#FFFFFF"
          />
        </div>
        {hexError && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 6 }}>Enter a valid 6-digit hex color (e.g., #3366FF).</p>}
      </div>

      <div>
        <div className="tb-v2-tool-label" style={{ marginBottom: 8 }}>Preset Colors</div>
        <div className="flex gap-2 flex-wrap">
          {presetColors.map((presetColor) => {
            const parsed = hexToRgb(presetColor);
            const lum = parsed ? getLuminance(parsed.r, parsed.g, parsed.b) : 0;
            return (
              <button
                key={presetColor}
                type="button"
                onClick={() => setColorValue(presetColor)}
                className="w-10 h-10 rounded border-2 transition-transform hover:scale-110 relative"
                style={{
                  backgroundColor: presetColor,
                  borderColor: colorInput.toLowerCase() === presetColor ? '#3b82f6' : 'transparent',
                }}
                title={`Luminance: ${(lum * 100).toFixed(1)}%`}
              >
                {lum < 0.5 && (
                  <span className="absolute inset-0 flex items-center justify-center text-white text-xs">A</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="tb-v2-section" style={{ padding: '16px 20px' }}>
        <div className="flex items-center gap-6">
          <div
            className="w-32 h-32 rounded-xl shadow-lg border-4"
            style={{ borderColor: colorInput, backgroundColor: colorInput }}
          />
          <div className="flex-1 space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Relative Luminance</span>
              <span className="font-mono font-bold">{relativeLuminance.toFixed(6)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Luminance %</span>
              <span className="font-mono font-bold">{luminancePercent.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Perceived Brightness</span>
              <span className="font-mono font-bold">{perceivedBrightness}</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="tb-v2-tool-label" style={{ marginBottom: 8 }}>Color Values</div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="tb-v2-section" style={{ padding: 12 }}>
            <div className="text-xs text-gray-500 mb-1">HEX</div>
            <div className="font-mono font-bold">{colorInput.toUpperCase()}</div>
          </div>
          <div className="tb-v2-section" style={{ padding: 12 }}>
            <div className="text-xs text-gray-500 mb-1">RGB</div>
            <div className="font-mono font-bold">
              {rgb.r}, {rgb.g}, {rgb.b}
            </div>
          </div>
          <div className="tb-v2-section" style={{ padding: 12 }}>
            <div className="text-xs text-gray-500 mb-1">HSL</div>
            <div className="font-mono font-bold">
              {hsl.h}°, {hsl.s}%, {hsl.l}%
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="tb-v2-tool-label" style={{ marginBottom: 8 }}>Lightness Scale Preview</div>
        <div className="flex gap-1">
          {lightnessScale.map((lightness) => {
            const simulatedGray = `hsl(0, 0%, ${lightness}%)`;
            return (
              <div key={lightness} className="flex-1 text-center">
                <div
                  className="h-12 rounded-t border-x"
                  style={{ backgroundColor: simulatedGray }}
                />
                <div className="text-xs py-1 bg-gray-50">{lightness}%</div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-2 mt-4">
          <div className="text-sm text-gray-600">Your color:</div>
          <div className="flex-1 h-6 rounded" style={{ backgroundColor: colorInput }} />
          <div className="text-sm font-mono">{luminancePercent.toFixed(1)}%</div>
        </div>
      </div>

      <div>
        <div className="tb-v2-tool-label" style={{ marginBottom: 8 }}>Contrast Helper</div>
        <p className="text-sm text-gray-600 mb-2">
          For text to be readable, use luminance contrast of at least 4.5:1 (AA) or 7:1 (AAA)
        </p>
        <div className="tb-v2-section" style={{ padding: 12 }}>
          <div className="text-sm space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-white border flex items-center justify-center text-xs">T</div>
              <span>White background: </span>
              <span className={whiteRatio < 4.5 ? 'text-red-600 font-bold' : 'font-bold'}>
                {whiteRatio.toFixed(2)}:1
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-black border flex items-center justify-center text-white text-xs">T</div>
              <span>Black background: </span>
              <span className={blackRatio < 4.5 ? 'text-red-600 font-bold' : 'font-bold'}>
                {blackRatio.toFixed(2)}:1
              </span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="tb-v2-tool-label" style={{ marginBottom: 8 }}>Formula Used</div>
        <div className="tb-v2-section text-sm" style={{ padding: 12 }}>
          <p className="font-mono mb-2">
            L = 0.2126 × R<sub>s</sub> + 0.7152 × G<sub>s</sub> + 0.0722 × B<sub>s</sub>
          </p>
          <p className="text-gray-600 text-xs">
            Where R<sub>s</sub>, G<sub>s</sub>, B<sub>s</sub> are the linearized sRGB values:
          </p>
          <p className="font-mono text-xs mt-1">
            if (C ≤ 0.03928) then C<sub>s</sub> = C / 12.92 else C<sub>s</sub> = ((C + 0.055) / 1.055)<sup>2.4</sup>
          </p>
        </div>
      </div>
    </div>
  );
}
