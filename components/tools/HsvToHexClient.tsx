'use client';

import React, { useState, useEffect } from 'react';

function hsvToHex(h: number, s: number, v: number): string {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  v = Math.max(0, Math.min(100, v)) / 100;

  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;

  let r = 0, g = 0, b = 0;
  
  if (h < 60) { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }

  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function hexToHsv(hex: string): { h: number; s: number; v: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;
  
  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;

  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;

  if (max !== min) {
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
        break;
      case g:
        h = ((b - r) / d + 2) * 60;
        break;
      case b:
        h = ((r - g) / d + 4) * 60;
        break;
    }
  }

  return { h: Math.round(h), s: Math.round(s * 100), v: Math.round(v * 100) };
}

export default function HsvToHexClient() {
  const [hue, setHue] = useState(210);
  const [saturation, setSaturation] = useState(75);
  const [value, setValue] = useState(85);
  const [hexValue, setHexValue] = useState('#4D7FDB');
  const [copied, setCopied] = useState(false);
  const [inputMode, setInputMode] = useState<'hsv' | 'hex'>('hsv');
  const [hexInput, setHexInput] = useState('#4D7FDB');

  useEffect(() => {
    if (inputMode === 'hsv') {
      const hex = hsvToHex(hue, saturation, value);
      setHexValue(hex);
      setHexInput(hex);
    }
  }, [hue, saturation, value, inputMode]);

  useEffect(() => {
    if (inputMode === 'hex') {
      const hex = hexInput.startsWith('#') ? hexInput : `#${hexInput}`;
      const hsv = hexToHsv(hex);
      if (hsv) {
        setHue(hsv.h);
        setSaturation(hsv.s);
        setValue(hsv.v);
        setHexValue(hex.toUpperCase());
      }
    }
  }, [hexInput, inputMode]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(hexValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const presetColors = [
    { h: 0, s: 100, v: 100, name: 'Red' },
    { h: 30, s: 100, v: 100, name: 'Orange' },
    { h: 60, s: 100, v: 100, name: 'Yellow' },
    { h: 120, s: 100, v: 100, name: 'Green' },
    { h: 180, s: 100, v: 100, name: 'Cyan' },
    { h: 210, s: 75, v: 85, name: 'Blue' },
    { h: 270, s: 100, v: 100, name: 'Purple' },
    { h: 300, s: 100, v: 100, name: 'Magenta' },
    { h: 330, s: 100, v: 100, name: 'Pink' },
    { h: 0, s: 0, v: 0, name: 'Black' },
    { h: 0, s: 0, v: 50, name: 'Gray' },
    { h: 0, s: 0, v: 100, name: 'White' },
  ];

  return (
    <div className="tb-v2-card">
      <div className="tb-v2-card-header">
        <h2 className="tb-v2-card-title">HSV to HEX Converter</h2>
        <p className="tb-v2-card-description">
          Convert HSV (Hue, Saturation, Value) color values to HEX format
        </p>
      </div>

      <div className="tb-v2-form-group">
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setInputMode('hsv')}
            className={`px-4 py-2 rounded border transition-colors ${
              inputMode === 'hsv'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            HSV Sliders
          </button>
          <button
            onClick={() => setInputMode('hex')}
            className={`px-4 py-2 rounded border transition-colors ${
              inputMode === 'hex'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            HEX Input
          </button>
        </div>
      </div>

      <div className="tb-v2-form-group">
        <label className="tb-v2-label">Color Preview</label>
        <div 
          className="w-full h-32 rounded-lg shadow-inner transition-colors"
          style={{ backgroundColor: hexValue }}
        />
      </div>

      {inputMode === 'hsv' ? (
        <div className="space-y-4">
          <div className="tb-v2-form-group">
            <label className="tb-v2-label">
              Hue: {hue}°
              <span className="text-gray-500 ml-2 text-sm">(0-360)</span>
            </label>
            <input
              type="range"
              min="0"
              max="360"
              value={hue}
              onChange={(e) => setHue(parseInt(e.target.value))}
              className="w-full h-3 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, 
                  hsl(0, 100%, 50%),
                  hsl(60, 100%, 50%),
                  hsl(120, 100%, 50%),
                  hsl(180, 100%, 50%),
                  hsl(240, 100%, 50%),
                  hsl(300, 100%, 50%),
                  hsl(360, 100%, 50%)
                )`
              }}
            />
          </div>

          <div className="tb-v2-form-group">
            <label className="tb-v2-label">
              Saturation: {saturation}%
              <span className="text-gray-500 ml-2 text-sm">(0-100)</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={saturation}
              onChange={(e) => setSaturation(parseInt(e.target.value))}
              className="w-full h-3 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, 
                  hsl(${hue}, 0%, ${value}%),
                  hsl(${hue}, 100%, ${value}%)
                )`
              }}
            />
          </div>

          <div className="tb-v2-form-group">
            <label className="tb-v2-label">
              Value: {value}%
              <span className="text-gray-500 ml-2 text-sm">(0-100)</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={value}
              onChange={(e) => setValue(parseInt(e.target.value))}
              className="w-full h-3 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, 
                  #000000,
                  hsl(${hue}, ${saturation}%, 50%)
                )`
              }}
            />
          </div>
        </div>
      ) : (
        <div className="tb-v2-form-group">
          <label className="tb-v2-label">HEX Color</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={hexInput}
              onChange={(e) => setHexInput(e.target.value.toUpperCase())}
              className="tb-v2-input flex-1 font-mono uppercase"
              placeholder="#FFFFFF"
              maxLength={7}
            />
            <input
              type="color"
              value={hexValue}
              onChange={(e) => setHexInput(e.target.value.toUpperCase())}
              className="w-12 h-10 cursor-pointer rounded border"
            />
          </div>
        </div>
      )}

      <div className="tb-v2-form-group">
        <div className="flex justify-between items-center">
          <label className="tb-v2-label">HEX Result</label>
          <button
            onClick={copyToClipboard}
            className="tb-v2-button tb-v2-button-primary text-sm"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="tb-v2-card p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-4">
            <div 
              className="w-16 h-16 rounded-lg shadow"
              style={{ backgroundColor: hexValue }}
            />
            <div className="flex-1">
              <div className="font-mono text-2xl font-bold">{hexValue}</div>
              <div className="text-sm text-gray-500 mt-1">
                HSV({hue}, {saturation}%, {value}%)
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="tb-v2-form-group">
        <label className="tb-v2-label">Quick Select Presets</label>
        <div className="grid grid-cols-6 gap-2">
          {presetColors.map((preset) => {
            const hex = hsvToHex(preset.h, preset.s, preset.v);
            return (
              <button
                key={preset.name}
                onClick={() => {
                  setHue(preset.h);
                  setSaturation(preset.s);
                  setValue(preset.v);
                }}
                className="w-full aspect-square rounded-lg border-2 border-gray-200 hover:border-gray-400 transition-all hover:scale-105"
                style={{ backgroundColor: hex }}
                title={`${preset.name}\n${hex}`}
              />
            );
          })}
        </div>
      </div>

      <div className="tb-v2-form-group">
        <label className="tb-v2-label">CSS Code</label>
        <div className="tb-v2-card p-4 bg-gray-50 rounded-lg">
          <div className="font-mono text-sm mb-2">background-color: {hexValue};</div>
          <div className="font-mono text-sm">color: hsl(${Math.round(hue)}, ${saturation}%, ${Math.round(value / 2)}%);</div>
        </div>
      </div>

      <div className="tb-v2-form-group">
        <div className="tb-v2-label">HSV vs HSL</div>
        <div className="tb-v2-card p-4 text-sm space-y-2">
          <p>
            <strong>HSV</strong> (Hue, Saturation, Value) is also known as HSB (Hue, Saturation, Brightness). 
            It's commonly used in image editing software and color pickers.
          </p>
          <p>
            <strong>HSL</strong> (Hue, Saturation, Lightness) is more intuitive for human understanding, 
            where lightness represents the amount of white or black mixed with the pure color.
          </p>
          <p className="text-gray-600">
            <strong>Hue:</strong> The color type (0-360° on the color wheel)<br/>
            <strong>Saturation:</strong> The intensity/purity of the color (0% = gray, 100% = pure color)<br/>
            <strong>Value/Brightness:</strong> The brightness of the color (0% = black, 100% = brightest)
          </p>
          <p className="text-gray-600">
            <strong>Note:</strong> HSV is particularly useful when you need to adjust brightness 
            independently from color intensity, making it popular in design tools.
          </p>
        </div>
      </div>
    </div>
  );
}
