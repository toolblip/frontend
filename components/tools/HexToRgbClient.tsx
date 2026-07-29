'use client';

import { useState, useCallback } from 'react';

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace('#', '');
  const full = clean.length === 3
    ? clean.split('').map(c => c + c).join('')
    : clean;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

export default function HexToRgbClient() {
  const [hexInput, setHexInput] = useState('#EF4444');
  const [rgba, setRgba] = useState(false);
  const [alpha, setAlpha] = useState(1);

  const rgb = hexToRgb(hexInput);
  const rgbString = rgb
    ? rgba
      ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`
      : `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
    : null;

  const copy = useCallback((val: string) => {
    navigator.clipboard.writeText(val).catch(() => {});
  }, []);

  return (
    <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:20,padding:"20px"}}>
      {/* Input */}
      <div className="space-y-2">
        <label className="tb-v2-tool-label">HEX Color</label>
        <div className="flex gap-3 items-center">
          <div className="relative">
            <input
              type="color"
              value={rgb ? `#${hexInput.replace('#', '')}` : '#EF4444'}
              onChange={(e) => {
                const val = e.target.value;
                setHexInput(val);
              }}
              className="w-14 h-12 rounded-lg cursor-pointer border-0"
            />
          </div>
          <input
            type="text"
            value={hexInput}
            onChange={(e) => {
              let val = e.target.value.trim();
              if (!val.startsWith('#')) val = '#' + val;
              setHexInput(val);
            }}
            placeholder="#EF4444"
            maxLength={7}
            className="flex-1 px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white font-mono text-sm placeholder-gray-400 focus:outline-none focus:border-red-500"
          />
        </div>
      </div>

      {/* RGB output */}
      {rgb && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="tb-v2-tool-label">Output Format</label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">RGB</span>
                <button
                  onClick={() => copy(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}
                  className="tb-v2-btn tb-v2-btn-ghost tb-v2-btn-sm" style={{color:"var(--red)",fontSize:12}}
                >
                  Copy
                </button>
              </div>
              <div className="font-mono text-sm text-gray-900 dark:text-white">
                rgb({rgb.r}, {rgb.g}, {rgb.b})
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">RGBA</span>
                <button
                  onClick={() => copy(`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`)}
                  className="tb-v2-btn tb-v2-btn-ghost tb-v2-btn-sm" style={{color:"var(--red)",fontSize:12}}
                >
                  Copy
                </button>
              </div>
              <div className="space-y-2">
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={alpha}
                  onChange={(e) => setAlpha(parseFloat(e.target.value))}
                  className="w-full accent-red-600"
                />
                <div className="font-mono text-sm text-gray-900 dark:text-white">
                  rgba({rgb.r}, {rgb.g}, {rgb.b}, {alpha})
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Components */}
      {rgb && (
        <div className="space-y-2">
          <label className="tb-v2-tool-label">Individual Components</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Red', value: rgb.r },
              { label: 'Green', value: rgb.g },
              { label: 'Blue', value: rgb.b },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
                <div className="text-lg font-bold text-gray-900 dark:text-white">{value}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Color preview */}
      {rgb && (
        <div className="space-y-2">
          <label className="tb-v2-tool-label">Preview</label>
          <div
            className="h-24 rounded-xl shadow-inner"
            style={{ backgroundColor: hexInput }}
          />
        </div>
      )}

      {/* Error */}
      {!rgb && hexInput.length > 0 && (
        <p className="text-sm text-red-600 dark:text-red-400">
          Invalid HEX color. Use format: #RRGGBB (e.g., #EF4444)
        </p>
      )}
    </div>
  );
}
