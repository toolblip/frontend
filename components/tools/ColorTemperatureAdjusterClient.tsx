'use client';

import { useEffect, useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const DEFAULT_K = 6500;
const EXAMPLE_K = 2700;

function kelvinToRgb(kelvin: number): { r: number; g: number; b: number } {
  const temp = kelvin / 100;
  let r: number, g: number, b: number;

  if (temp <= 66) {
    r = 255;
    g = 99.4708025861 * Math.log(temp) - 161.1195681661;
    if (temp <= 19) {
      b = 0;
    } else {
      b = 138.5177312231 * Math.log(temp - 10) - 305.0447927307;
    }
  } else {
    r = 329.698727446 * Math.pow(temp - 60, -0.1332047592);
    g = 288.1221695283 * Math.pow(temp - 60, -0.0755148492);
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
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

const presetTemperatures = [
  { kelvin: 1000, name: 'Candlelight' },
  { kelvin: 2000, name: 'Sunrise/Sunset' },
  { kelvin: 2700, name: 'Soft White' },
  { kelvin: 3000, name: 'Warm White' },
  { kelvin: 4000, name: 'Cool White' },
  { kelvin: 5000, name: 'Daylight' },
  { kelvin: 5500, name: 'Direct Sunlight' },
  { kelvin: 6500, name: 'Overcast Sky' },
  { kelvin: 7500, name: 'Shade' },
  { kelvin: 9000, name: 'Heavy Overcast' },
];

export default function ColorTemperatureAdjusterClient() {
  const [temperature, setTemperature] = useState(DEFAULT_K);
  const [rgb, setRgb] = useState({ r: 255, g: 255, b: 255 });
  const [hex, setHex] = useState('#f5f5f5');
  const [hsl, setHsl] = useState({ h: 0, s: 0, l: 100 });
  const [copied, setCopied] = useState('');

  useEffect(() => {
    const newRgb = kelvinToRgb(temperature);
    setRgb(newRgb);
    setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b));
  }, [temperature]);

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

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head" style={{ borderBottom: '1px solid var(--line)' }}>
        <span className="tb-v2-tool-label">Color Temperature Adjuster</span>
        <ToolExampleClearActions
          onExample={() => setTemperature(EXAMPLE_K)}
          onClear={() => setTemperature(DEFAULT_K)}
          canClear={temperature !== DEFAULT_K}
        />
      </div>

      <div className="tb-v2-section" style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: 20 }}>
        <p style={{ fontSize: 13, color: 'var(--tb-text-secondary)', margin: 0 }}>
          Adjust color temperature from warm (orange) to cool (blue) on the Kelvin scale.
        </p>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">Temperature</span>
            <span className="text-2xl font-bold font-mono">{temperature}K</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setTemperature((p) => Math.max(1000, p - 500))}
              className="rounded-xl bg-gray-100 hover:bg-gray-200 text-2xl px-4 py-2"
            >
              −
            </button>
            <input
              type="range"
              min="1000"
              max="20000"
              step="100"
              value={temperature}
              onChange={(e) => setTemperature(parseInt(e.target.value))}
              className="flex-1 h-3 rounded-full appearance-none cursor-pointer"
              style={{ background: 'linear-gradient(to right, #ff6b35, #fff5e6, #e6f0ff, #6b9fff)' }}
            />
            <button
              type="button"
              onClick={() => setTemperature((p) => Math.min(20000, p + 500))}
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
          <div className="flex items-center gap-6 flex-wrap">
            <div
              className="w-32 h-32 rounded-xl shadow-lg border-4"
              style={{ backgroundColor: hex, borderColor: hex }}
            />
            <div className="flex-1 space-y-1 min-w-[200px]">
              <p className="font-semibold mb-2">{getTemperatureCategory(temperature)}</p>
              {(
                [
                  ['kelvin', 'Kelvin', `${temperature}K`],
                  ['hex', 'HEX', hex.toUpperCase()],
                  ['rgb', 'RGB', `${rgb.r}, ${rgb.g}, ${rgb.b}`],
                  ['hsl', 'HSL', `${hsl.h}°, ${hsl.s}%, ${hsl.l}%`],
                ] as const
              ).map(([key, label, value]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => copy(key, value)}
                  className="flex justify-between items-center py-2 border-b w-full text-left"
                >
                  <span className="text-gray-600">{label}</span>
                  <span className="font-mono font-bold">{copied === key ? 'Copied' : value}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="text-xs text-gray-500 mb-2">Preset temperatures</div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {presetTemperatures.map((preset) => {
              const presetRgb = kelvinToRgb(preset.kelvin);
              const presetHex = rgbToHex(presetRgb.r, presetRgb.g, presetRgb.b);
              return (
                <button
                  key={preset.kelvin}
                  type="button"
                  onClick={() => setTemperature(preset.kelvin)}
                  className={`p-2 rounded border text-left ${
                    temperature === preset.kelvin ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="w-full h-6 rounded mb-1" style={{ backgroundColor: presetHex }} />
                  <div className="text-xs font-bold">{preset.kelvin}K</div>
                  <div className="text-xs text-gray-500 truncate">{preset.name}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
