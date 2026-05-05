'use client';

import React, { useState } from 'react';

export default function CmykToRgbClient() {
  const [cyan, setCyan] = useState('');
  const [magenta, setMagenta] = useState('');
  const [yellow, setYellow] = useState('');
  const [key, setKey] = useState('');
  const [rgbResult, setRgbResult] = useState<{ r: number; g: number; b: number } | null>(null);
  const [hexResult, setHexResult] = useState<string | null>(null);

  const convertToRgb = () => {
    const c = parseFloat(cyan) / 100;
    const m = parseFloat(magenta) / 100;
    const y = parseFloat(yellow) / 100;
    const k = parseFloat(key) / 100;

    if (isNaN(c) || isNaN(m) || isNaN(y) || isNaN(k)) {
      return;
    }

    const r = Math.round(255 * (1 - c) * (1 - k));
    const g = Math.round(255 * (1 - m) * (1 - k));
    const b = Math.round(255 * (1 - y) * (1 - k));

    setRgbResult({ r, g, b });
    setHexResult(`#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase());
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">CMYK to RGB Converter</h1>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Cyan (C) <span className="text-gray-500">0-100%</span>
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={cyan}
              onChange={(e) => setCyan(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Magenta (M) <span className="text-gray-500">0-100%</span>
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={magenta}
              onChange={(e) => setMagenta(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Yellow (Y) <span className="text-gray-500">0-100%</span>
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={yellow}
              onChange={(e) => setYellow(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Key/Black (K) <span className="text-gray-500">0-100%</span>
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="0"
            />
          </div>
        </div>

        <button
          onClick={convertToRgb}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Convert to RGB
        </button>

        {rgbResult && (
          <div className="mt-6 p-4 bg-gray-100 rounded space-y-4">
            <h3 className="font-medium">Conversion Result:</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">RGB Values</label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 p-2 bg-white rounded border">
                    rgb({rgbResult.r}, {rgbResult.g}, {rgbResult.b})
                  </code>
                  <button
                    onClick={() =>
                      copyToClipboard(`rgb(${rgbResult.r}, ${rgbResult.g}, ${rgbResult.b})`)
                    }
                    className="px-2 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">HEX Value</label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 p-2 bg-white rounded border">
                    {hexResult}
                  </code>
                  <button
                    onClick={() => copyToClipboard(hexResult || '')}
                    className="px-2 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="block text-sm text-gray-600">Preview:</label>
              <div
                className="w-16 h-16 rounded border"
                style={{ backgroundColor: hexResult || undefined }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
