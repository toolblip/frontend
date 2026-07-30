'use client';

import React, { useState, useEffect } from 'react';

function kelvinToRgb(kelvin: number): { r: number; g: number; b: number } {
  const temp = kelvin / 100;
  let r: number, g: number, b: number;

  if (temp <= 66) {
    r = 255;
    g = temp;
    g = 99.4708025861 * Math.log(g) - 161.1195681661;
    if (temp <= 19) {
      b = 0;
    } else {
      b = temp - 10;
      b = 138.5177312231 * Math.log(b) - 305.0447927307;
    }
  } else {
    r = temp - 60;
    r = 329.698727446 * Math.pow(r, -0.1332047592);
    g = temp - 60;
    g = 288.1221695283 * Math.pow(g, -0.0755148492);
    b = 255;
  }

  return {
    r: Math.round(Math.max(0, Math.min(255, r))),
    g: Math.round(Math.max(0, Math.min(255, g))),
    b: Math.round(Math.max(0, Math.min(255, b))),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = Math.round(x).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('')
  );
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

const presetTemperatures = [
  { kelvin: 1000, name: 'Candlelight', description: 'Very warm, orange' },
  { kelvin: 2000, name: 'Sunrise/Sunset', description: 'Warm orange' },
  { kelvin: 2700, name: 'Soft White (Incandescent)', description: 'Warm white' },
  { kelvin: 3000, name: 'Warm White (Halogen)', description: 'Slightly warm' },
  { kelvin: 4000, name: 'Cool White (Fluorescent)', description: 'Neutral cool' },
  { kelvin: 5000, name: 'Daylight', description: 'Pure white' },
  { kelvin: 5500, name: 'Direct Sunlight', description: 'Slightly warm daylight' },
  { kelvin: 6500, name: 'Overcast Sky', description: 'Cool daylight' },
  { kelvin: 7500, name: 'Shade', description: 'Blue cool' },
  { kelvin: 9000, name: 'Heavy Overcast', description: 'Very cool blue' },
];

export default function ColorTemperatureAdjusterClient() {
  const [temperature, setTemperature] = useState(6500);
  const [rgb, setRgb] = useState({ r: 255, g: 255, b: 255 });
  const [hex, setHex] = useState('#f5f5f5');
  const [hsl, setHsl] = useState({ h: 0, s: 0, l: 100 });
  const [copied, setCopied] = useState('');

  useEffect(() => {
    const newRgb = kelvinToRgb(temperature);
    setRgb(newRgb);
    const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    setHex(newHex);
    setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b));
  }, [temperature]);

  const adjustTemperature = (delta: number) => {
    setTemperature((prev) => Math.max(1000, Math.min(20000, prev + delta)));
  };

  const loadExample = () => setTemperature(2700);

  const copy = (label: string, value: string) => {
    navigator.clipboard.writeText(value).catch(() => {});
    setCopied(label);
    setTimeout(() => setCopied(''), 1500);
  };

  const getTemperatureCategory = (kelvin: number): string => {
    if (kelvin < 2000) return 'Warmest';
    if (kelvin < 3500) return 'Warm';
    if (kelvin < 5000) return 'Neutral-Warm';
    if (kelvin < 6500) return 'Neutral';
    return 'Cool';
  };

  const getTemperatureDescription = (kelvin: number): string => {
    if (kelvin < 2000) return 'Deep orange, candle-like';
    if (kelvin < 3500) return 'Soft, cozy, inviting';
    if (kelvin < 5000) return 'Balanced, natural';
    if (kelvin < 6500) return 'Clean, clinical';
    return 'Bright, alert, cool';
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Color Temperature Adjuster</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>
      <p className="text-sm text-gray-500 -mt-2">
        Adjust color temperature from warm (orange) to cool (blue) based on Kelvin scale
      </p>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500">Temperature</span>
          <span className="text-2xl font-bold font-mono">{temperature}K</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => adjustTemperature(-500)}
            className="rounded-xl bg-gray-100 hover:bg-gray-200 text-2xl px-4 py-2"
          >
            -
          </button>
          <input
            type="range"
            min="1000"
            max="20000"
            step="100"
            value={temperature}
            onChange={(e) => setTemperature(parseInt(e.target.value))}
            className="flex-1 h-3 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #ff6b35, #fff5e6, #e6f0ff, #6b9fff)`,
            }}
          />
          <button
            type="button"
            onClick={() => adjustTemperature(500)}
            className="rounded-xl bg-gray-100 hover:bg-gray-200 text-2xl px-4 py-2"
          >
            +
          </button>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>1000K (Warm)</span>
          <span>20000K (Cool)</span>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-center gap-6">
          <div
            className="w-32 h-32 rounded-xl shadow-lg border-4"
            style={{ backgroundColor: hex, borderColor: hex }}
          />
          <div className="flex-1 space-y-1">
            <button type="button" onClick={() => copy('kelvin', `${temperature}K`)} className="flex justify-between items-center py-2 border-b w-full text-left">
              <span className="text-gray-600">Kelvin</span>
              <span className="font-mono font-bold">{copied === 'kelvin' ? 'Copied' : `${temperature}K`}</span>
            </button>
            <button type="button" onClick={() => copy('hex', hex.toUpperCase())} className="flex justify-between items-center py-2 border-b w-full text-left">
              <span className="text-gray-600">HEX</span>
              <span className="font-mono font-bold">{copied === 'hex' ? 'Copied' : hex.toUpperCase()}</span>
            </button>
            <button type="button" onClick={() => copy('rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`)} className="flex justify-between items-center py-2 border-b w-full text-left">
              <span className="text-gray-600">RGB</span>
              <span className="font-mono font-bold">
                {copied === 'rgb' ? 'Copied' : `${rgb.r}, ${rgb.g}, ${rgb.b}`}
              </span>
            </button>
            <button type="button" onClick={() => copy('hsl', `${hsl.h}°, ${hsl.s}%, ${hsl.l}%`)} className="flex justify-between items-center py-2 border-b w-full text-left">
              <span className="text-gray-600">HSL</span>
              <span className="font-mono font-bold">
                {copied === 'hsl' ? 'Copied' : `${hsl.h}°, ${hsl.s}%, ${hsl.l}%`}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-xs text-gray-500">Category</div>
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full"
              style={{
                backgroundColor: hex,
                boxShadow: `0 0 10px ${hex}`,
              }}
            />
            <div>
              <p className="font-semibold">{getTemperatureCategory(temperature)}</p>
              <p className="text-sm text-gray-500">{getTemperatureDescription(temperature)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-xs text-gray-500">Preset Temperatures</div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {presetTemperatures.map((preset) => {
            const presetRgb = kelvinToRgb(preset.kelvin);
            const presetHex = rgbToHex(presetRgb.r, presetRgb.g, presetRgb.b);
            return (
              <button
                key={preset.kelvin}
                type="button"
                onClick={() => setTemperature(preset.kelvin)}
                className={`p-2 rounded border text-left transition-all hover:scale-105 ${
                  temperature === preset.kelvin
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div
                  className="w-full h-6 rounded mb-1"
                  style={{ backgroundColor: presetHex }}
                />
                <div className="text-xs font-bold">{preset.kelvin}K</div>
                <div className="text-xs text-gray-500 truncate">{preset.name}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-xs text-gray-500">Temperature Scale Preview</div>
        <div className="relative h-8 rounded overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to right, 
                ${rgbToHex(kelvinToRgb(1000).r, kelvinToRgb(1000).g, kelvinToRgb(1000).b)},
                ${rgbToHex(kelvinToRgb(3000).r, kelvinToRgb(3000).g, kelvinToRgb(3000).b)},
                ${rgbToHex(kelvinToRgb(5000).r, kelvinToRgb(5000).g, kelvinToRgb(5000).b)},
                ${rgbToHex(kelvinToRgb(6500).r, kelvinToRgb(6500).g, kelvinToRgb(6500).b)},
                ${rgbToHex(kelvinToRgb(9000).r, kelvinToRgb(9000).g, kelvinToRgb(9000).b)},
                ${rgbToHex(kelvinToRgb(20000).r, kelvinToRgb(20000).g, kelvinToRgb(20000).b)}
              )`,
            }}
          />
          <div
            className="absolute top-0 bottom-0 w-2 bg-white rounded-full shadow"
            style={{
              left: `${((temperature - 1000) / (20000 - 1000)) * 100}%`,
              transform: 'translateX(-50%)',
              border: '2px solid #333',
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>1000K</span>
          <span>5000K</span>
          <span>10000K</span>
          <span>20000K</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-xs text-gray-500">Light Quality Preview</div>
        <div
          className="p-6 rounded-lg"
          style={{
            backgroundColor: hex,
            boxShadow: `0 0 30px ${hex}40`,
          }}
        >
          <p className="text-lg font-medium mb-2" style={{ color: '#333' }}>
            The quick brown fox jumps over the lazy dog
          </p>
          <p className="text-sm" style={{ color: '#555' }}>
            This preview shows how text might appear under this lighting condition.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-xs text-gray-500">Common Use Cases</div>
        <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">2700K</span>
            <span>Bedrooms, living rooms - cozy, relaxing atmosphere</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">4000K</span>
            <span>Kitchens, offices - clean, productive environment</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">5000K</span>
            <span>Workspaces, garages - accurate color rendering</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">6500K</span>
            <span>Daylight simulation, photography, art studios</span>
          </div>
        </div>
      </div>
    </div>
  );
}
