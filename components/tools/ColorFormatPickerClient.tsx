'use client';

import React, { useState, useEffect } from 'react';

export default function ColorFormatPickerClient() {
  const [color, setColor] = useState('#6366f1');
  const [hex, setHex] = useState('#6366f1');
  const [rgb, setRgb] = useState({ r: 99, g: 102, b: 241 });
  const [hsl, setHsl] = useState({ h: 239, s: 84, l: 67 });
  const [copied, setCopied] = useState<string | null>(null);

  const rgbToHex = (r: number, g: number, b: number) =>
    '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const hslToRgb = (h: number, s: number, l: number) => {
    h /= 360; s /= 100; l /= 100;
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1; if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    return {
      r: Math.round(hue2rgb(p, q, h + 1/3) * 255),
      g: Math.round(hue2rgb(p, q, h) * 255),
      b: Math.round(hue2rgb(p, q, h - 1/3) * 255),
    };
  };

  useEffect(() => {
    const newHex = rgbToHex(rgb.r, rgb.g, rgb.b);
    setHex(newHex);
    setColor(newHex);
    setHsl(rgbToHsl(rgb.r, rgb.g, rgb.b));
  }, [rgb]);

  const handleHexChange = (val: string) => {
    setHex(val);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(val);
    if (result) {
      setColor(val.startsWith('#') ? val : '#' + val);
      setRgb({ r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) });
    }
  };

  const handleHslChange = (key: 'h' | 's' | 'l', val: number) => {
    const newHsl = { ...hsl, [key]: val };
    setHsl(newHsl);
    const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    setRgb(newRgb);
  };

  const copy = (val: string, label: string) => {
    navigator.clipboard.writeText(val);
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Color Format Picker</h1>

      <div className="w-full h-32 rounded-lg mb-6 border" style={{ backgroundColor: color }} />

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">HEX</label>
          <div className="flex gap-2">
            <input type="color" value={color} onChange={e => handleHexChange(e.target.value)} className="w-10 h-10 rounded cursor-pointer" />
            <input type="text" value={hex} onChange={e => handleHexChange(e.target.value)} className="flex-1 p-2 border rounded font-mono" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">RGB ({rgb.r}, {rgb.g}, {rgb.b})</label>
          <div className="flex gap-2">
            {(['r', 'g', 'b'] as const).map(ch => (
              <div key={ch} className="flex-1">
                <input
                  type="range"
                  min="0" max="255"
                  value={rgb[ch]}
                  onChange={e => setRgb({ ...rgb, [ch]: +e.target.value })}
                  className="w-full"
                />
                <div className="text-center text-sm">{rgb[ch]}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">HSL ({hsl.h}°, {hsl.s}%, {hsl.l}%)</label>
          <div className="flex gap-2">
            {(['h', 's', 'l'] as const).map(ch => (
              <div key={ch} className="flex-1">
                <input
                  type="range"
                  min={ch === 'h' ? 0 : 0}
                  max={ch === 'h' ? 360 : 100}
                  value={hsl[ch]}
                  onChange={e => handleHslChange(ch, +e.target.value)}
                  className="w-full"
                />
                <div className="text-center text-sm">{ch === 'h' ? hsl.h + '°' : hsl[ch] + '%'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'HEX', value: hex.toUpperCase() },
          { label: 'RGB', value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
          { label: 'HSL', value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
        ].map(({ label, value }) => (
          <button
            key={label}
            onClick={() => copy(value, label)}
            className="p-2 bg-gray-100 rounded border text-sm font-mono hover:bg-gray-200"
          >
            {copied === label ? '✓ Copied' : label}
          </button>
        ))}
      </div>
    </div>
  );
}
