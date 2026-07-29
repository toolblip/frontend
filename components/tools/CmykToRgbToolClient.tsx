'use client';

import React, { useState, useEffect } from 'react';

interface CmykColor {
  c: number;
  m: number;
  y: number;
  k: number;
}

interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export default function CmykToRgbToolClient() {
  const [cmyk, setCmyk] = useState<CmykColor>({ c: 0, m: 0, y: 0, k: 0 });
  const [rgb, setRgb] = useState<RgbColor>({ r: 0, g: 0, b: 0 });
  const [hex, setHex] = useState('#000000');
  const [mode, setMode] = useState<'cmyk-to-rgb' | 'rgb-to-cmyk'>('cmyk-to-rgb');
  const [history, setHistory] = useState<CmykColor[]>([]);

  const cmykToRgb = (c: number, m: number, y: number, k: number): RgbColor => {
    const r = Math.round(255 * (1 - c / 100) * (1 - k / 100));
    const g = Math.round(255 * (1 - m / 100) * (1 - k / 100));
    const b = Math.round(255 * (1 - y / 100) * (1 - k / 100));
    return { r, g, b };
  };

  const rgbToCmyk = (r: number, g: number, b: number): CmykColor => {
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;

    const k = 1 - Math.max(rNorm, gNorm, bNorm);
    if (k === 1) {
      return { c: 0, m: 0, y: 0, k: 100 };
    }

    const c = ((1 - rNorm - k) / (1 - k)) * 100;
    const m = ((1 - gNorm - k) / (1 - k)) * 100;
    const y = ((1 - bNorm - k) / (1 - k)) * 100;

    return {
      c: Math.round(c),
      m: Math.round(m),
      y: Math.round(y),
      k: Math.round(k * 100),
    };
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
  };

  const hexToRgb = (hex: string): RgbColor | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  useEffect(() => {
    if (mode === 'cmyk-to-rgb') {
      const result = cmykToRgb(cmyk.c, cmyk.m, cmyk.y, cmyk.k);
      setRgb(result);
      setHex(rgbToHex(result.r, result.g, result.b));
    } else {
      const result = rgbToCmyk(rgb.r, rgb.g, rgb.b);
      setCmyk(result);
      setHex(rgbToHex(rgb.r, rgb.g, rgb.b));
    }
  }, [cmyk, rgb, mode]);

  const handleModeSwitch = () => {
    setMode(mode === 'cmyk-to-rgb' ? 'rgb-to-cmyk' : 'cmyk-to-rgb');
  };

  const handleSwapValues = () => {
    const tempCmyk = { ...cmyk };
    const tempRgb = { ...rgb };

    const newCmyk = rgbToCmyk(tempRgb.r, tempRgb.g, tempRgb.b);
    const newRgb = cmykToRgb(tempCmyk.c, tempCmyk.m, tempCmyk.y, tempCmyk.k);

    setCmyk(newCmyk);
    setRgb(newRgb);
  };

  const saveToHistory = () => {
    setHistory((prev) => [...prev.slice(-9), { ...cmyk }]);
  };

  const loadFromHistory = (item: CmykColor) => {
    setCmyk(item);
    setMode('cmyk-to-rgb');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">CMYK to RGB Color Tool</h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setMode('cmyk-to-rgb')}
          className={`px-4 py-2 rounded ${
            mode === 'cmyk-to-rgb'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          CMYK → RGB
        </button>
        <button
          onClick={() => setMode('rgb-to-cmyk')}
          className={`px-4 py-2 rounded ${
            mode === 'rgb-to-cmyk'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          RGB → CMYK
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-4 border rounded space-y-4">
          <h3 className="font-medium">CMYK Values</h3>

          <div>
            <label className="block text-sm mb-1">
              C: {cmyk.c}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={cmyk.c}
              onChange={(e) => setCmyk({ ...cmyk, c: Number(e.target.value) })}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">
              M: {cmyk.m}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={cmyk.m}
              onChange={(e) => setCmyk({ ...cmyk, m: Number(e.target.value) })}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">
              Y: {cmyk.y}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={cmyk.y}
              onChange={(e) => setCmyk({ ...cmyk, y: Number(e.target.value) })}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">
              K: {cmyk.k}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={cmyk.k}
              onChange={(e) => setCmyk({ ...cmyk, k: Number(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>

        <div className="p-4 border rounded space-y-4">
          <h3 className="font-medium">RGB Values</h3>

          <div>
            <label className="block text-sm mb-1">R: {rgb.r}</label>
            <input
              type="range"
              min="0"
              max="255"
              value={rgb.r}
              onChange={(e) => setRgb({ ...rgb, r: Number(e.target.value) })}
              className="w-full"
              style={{ accentColor: '#ff0000' }}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">G: {rgb.g}</label>
            <input
              type="range"
              min="0"
              max="255"
              value={rgb.g}
              onChange={(e) => setRgb({ ...rgb, g: Number(e.target.value) })}
              className="w-full"
              style={{ accentColor: '#00ff00' }}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">B: {rgb.b}</label>
            <input
              type="range"
              min="0"
              max="255"
              value={rgb.b}
              onChange={(e) => setRgb({ ...rgb, b: Number(e.target.value) })}
              className="w-full"
              style={{ accentColor: '#0000ff' }}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 border rounded">
        <div className="flex items-center gap-6">
          <div
            className="w-32 h-32 rounded border"
            style={{ backgroundColor: hex }}
          />

          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <code className="flex-1 p-2 bg-gray-100 rounded">
                RGB({rgb.r}, {rgb.g}, {rgb.b})
              </code>
              <button
                onClick={() =>
                  copyToClipboard(`RGB(${rgb.r}, ${rgb.g}, ${rgb.b})`)
                }
                className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
              >
                Copy
              </button>
            </div>

            <div className="flex items-center gap-2">
              <code className="flex-1 p-2 bg-gray-100 rounded">
                CMYK({cmyk.c}, {cmyk.m}, {cmyk.y}, {cmyk.k})
              </code>
              <button
                onClick={() =>
                  copyToClipboard(
                    `CMYK(${cmyk.c}, ${cmyk.m}, ${cmyk.y}, ${cmyk.k})`
                  )
                }
                className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
              >
                Copy
              </button>
            </div>

            <div className="flex items-center gap-2">
              <code className="flex-1 p-2 bg-gray-100 rounded">{hex}</code>
              <button
                onClick={() => copyToClipboard(hex)}
                className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
              >
                Copy
              </button>
            </div>
          </div>

          <button
            onClick={handleSwapValues}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Swap
          </button>
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <button
          onClick={saveToHistory}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Save to History
        </button>
      </div>

      {history.length > 0 && (
        <div className="mt-6">
          <h3 className="font-medium mb-2">History</h3>
          <div className="tb-v2-mode-tabs">
            {history.map((item, index) => {
              const result = cmykToRgb(item.c, item.m, item.y, item.k);
              const itemHex = rgbToHex(result.r, result.g, result.b);
              return (
                <button
                  key={index}
                  onClick={() => loadFromHistory(item)}
                  className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
                >
                  <div
                    className="w-4 h-4 rounded border"
                    style={{ backgroundColor: itemHex }}
                  />
                  <span className="text-sm">
                    C{item.c} M{item.m} Y{item.y} K{item.k}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
