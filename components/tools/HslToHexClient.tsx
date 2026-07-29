'use client';

import React, { useState, useEffect } from 'react';

function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

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

function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;
  
  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

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

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export default function HslToHexClient() {
  const [hue, setHue] = useState(210);
  const [saturation, setSaturation] = useState(80);
  const [lightness, setLightness] = useState(55);
  const [hexValue, setHexValue] = useState('#4D7FD9');
  const [copied, setCopied] = useState(false);
  const [inputMode, setInputMode] = useState<'hsl' | 'hex'>('hsl');
  const [hexInput, setHexInput] = useState('#4D7FD9');

  useEffect(() => {
    if (inputMode === 'hsl') {
      const hex = hslToHex(hue, saturation, lightness);
      setHexValue(hex);
      setHexInput(hex);
    }
  }, [hue, saturation, lightness, inputMode]);

  useEffect(() => {
    if (inputMode === 'hex') {
      const hex = hexInput.startsWith('#') ? hexInput : `#${hexInput}`;
      const hsl = hexToHsl(hex);
      if (hsl) {
        setHue(hsl.h);
        setSaturation(hsl.s);
        setLightness(hsl.l);
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
    { h: 0, s: 100, l: 50, name: 'Red' },
    { h: 30, s: 100, l: 50, name: 'Orange' },
    { h: 60, s: 100, l: 50, name: 'Yellow' },
    { h: 120, s: 100, l: 40, name: 'Green' },
    { h: 180, s: 100, l: 50, name: 'Cyan' },
    { h: 210, s: 80, l: 55, name: 'Blue' },
    { h: 270, s: 100, l: 50, name: 'Purple' },
    { h: 300, s: 100, l: 50, name: 'Magenta' },
    { h: 330, s: 100, l: 50, name: 'Pink' },
    { h: 0, s: 0, l: 0, name: 'Black' },
    { h: 0, s: 0, l: 50, name: 'Gray' },
    { h: 0, s: 0, l: 100, name: 'White' },
  ];

  return (
    <div className="tb-v2-card">
      <div className="tb-v2-card-header">
        <h2 className="tb-v2-card-title">HSL to HEX Converter</h2>
        <p className="tb-v2-card-description">
          Convert HSL (Hue, Saturation, Lightness) color values to HEX format
        </p>
      </div>

      <div className="tb-v2-form-group">
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setInputMode('hsl')}
            className={`px-4 py-2 rounded border transition-colors ${
              inputMode === 'hsl'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            HSL Sliders
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

      {inputMode === 'hsl' ? (
        <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:16,padding:"16px 20px"}}>
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
                  hsl(0, ${saturation}%, ${lightness}%),
                  hsl(60, ${saturation}%, ${lightness}%),
                  hsl(120, ${saturation}%, ${lightness}%),
                  hsl(180, ${saturation}%, ${lightness}%),
                  hsl(240, ${saturation}%, ${lightness}%),
                  hsl(300, ${saturation}%, ${lightness}%),
                  hsl(360, ${saturation}%, ${lightness}%)
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
                  hsl(${hue}, 0%, ${lightness}%),
                  hsl(${hue}, 100%, ${lightness}%)
                )`
              }}
            />
          </div>

          <div className="tb-v2-form-group">
            <label className="tb-v2-label">
              Lightness: {lightness}%
              <span className="text-gray-500 ml-2 text-sm">(0-100)</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={lightness}
              onChange={(e) => setLightness(parseInt(e.target.value))}
              className="w-full h-3 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, 
                  hsl(${hue}, ${saturation}%, 0%),
                  hsl(${hue}, ${saturation}%, 50%),
                  hsl(${hue}, ${saturation}%, 100%)
                )`
              }}
            />
          </div>
        </div>
      ) : (
        <div className="tb-v2-form-group">
          <label className="tb-v2-label">HEX Color</label>
          <div className="tb-v2-mode-tabs">
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
                HSL({hue}, {saturation}%, {lightness}%)
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="tb-v2-form-group">
        <label className="tb-v2-label">Quick Select Presets</label>
        <div className="grid grid-cols-6 gap-2">
          {presetColors.map((preset) => {
            const hex = hslToHex(preset.h, preset.s, preset.l);
            return (
              <button
                key={preset.name}
                onClick={() => {
                  setHue(preset.h);
                  setSaturation(preset.s);
                  setLightness(preset.l);
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
          <div className="font-mono text-sm">color: hsl({hue}, {saturation}%, {lightness}%);</div>
        </div>
      </div>

      <div className="tb-v2-form-group">
        <div className="tb-v2-label">Color Conversion Info</div>
        <div className="tb-v2-card p-4 text-sm space-y-2">
          <p>
            <strong>HSL</strong> (Hue, Saturation, Lightness) is a cylindrical color model 
            that's intuitive for humans to understand and adjust colors.
          </p>
          <p>
            <strong>HEX</strong> is a hexadecimal representation used in web design (#RRGGBB). 
            It's the most common format for specifying colors in CSS.
          </p>
          <p className="text-gray-600">
            <strong>Hue:</strong> The color type (0-360° on the color wheel, where 0° is red, 
            120° is green, and 240° is blue)<br/>
            <strong>Saturation:</strong> The intensity of the color (0% = gray, 100% = pure color)<br/>
            <strong>Lightness:</strong> The brightness of the color (0% = black, 100% = white)
          </p>
        </div>
      </div>
    </div>
  );
}
