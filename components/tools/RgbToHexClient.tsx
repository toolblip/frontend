'use client';

import { useState, useCallback } from 'react';

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => Math.round(x).toString(16).padStart(2, '0')).join('');
}

export default function RgbToHexClient() {
  const [r, setR] = useState(239);
  const [g, setG] = useState(68);
  const [b, setB] = useState(68);
  const [alpha, setAlpha] = useState(1);
  const [showRgba, setShowRgba] = useState(false);

  const hex = rgbToHex(r, g, b);

  const copy = useCallback((val: string) => {
    navigator.clipboard.writeText(val).catch(() => {});
  }, []);

  const clamp = (val: number, min: number, max: number) =>
    Math.min(max, Math.max(min, val));

  return (
    <div className="space-y-6">
      {/* RGB sliders */}
      <div className="space-y-4">
        {[
          { label: 'Red', value: r, setValue: (v: number) => setR(clamp(v, 0, 255)), color: '#EF4444', gradient: 'linear-gradient(to right, #000 0%, #EF4444 100%)' },
          { label: 'Green', value: g, setValue: (v: number) => setG(clamp(v, 0, 255)), color: '#22C55E', gradient: 'linear-gradient(to right, #000 0%, #22C55E 100%)' },
          { label: 'Blue', value: b, setValue: (v: number) => setB(clamp(v, 0, 255)), color: '#3B82F6', gradient: 'linear-gradient(to right, #000 0%, #3B82F6 100%)' },
        ].map(({ label, value, setValue, gradient }) => (
          <div key={label} className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
              <input
                type="number"
                min={0}
                max={255}
                value={value}
                onChange={(e) => setValue(parseInt(e.target.value) || 0)}
                className="w-16 px-2 py-1 text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white font-mono text-center"
              />
            </div>
            <input
              type="range"
              min={0}
              max={255}
              value={value}
              onChange={(e) => setValue(parseInt(e.target.value))}
              className="w-full h-3 rounded-full appearance-none cursor-pointer"
              style={{ background: gradient }}
            />
          </div>
        ))}
      </div>

      {/* Alpha */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Alpha</label>
          <input
            type="number"
            min={0}
            max={1}
            step={0.1}
            value={alpha}
            onChange={(e) => setAlpha(parseFloat(e.target.value) || 0)}
            className="w-16 px-2 py-1 text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white font-mono text-center"
          />
        </div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.1}
          value={alpha}
          onChange={(e) => setAlpha(parseFloat(e.target.value))}
          className="w-full h-3 rounded-full appearance-none cursor-pointer bg-gray-200 dark:bg-gray-700"
        />
      </div>

      {/* Output */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <button
            onClick={() => setShowRgba(false)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!showRgba ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          >
            HEX
          </button>
          <button
            onClick={() => setShowRgba(true)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${showRgba ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          >
            RGBA
          </button>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
              {showRgba ? 'RGBA' : 'HEX'}
            </span>
            <button
              onClick={() => copy(showRgba ? `rgba(${r}, ${g}, ${b}, ${alpha})` : hex)}
              className="text-xs text-red-600 dark:text-red-400 hover:underline"
            >
              Copy
            </button>
          </div>
          <div className="font-mono text-2xl font-bold text-gray-900 dark:text-white">
            {showRgba ? `rgba(${r}, ${g}, ${b}, ${alpha})` : hex.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Preview</label>
        <div
          className="h-24 rounded-xl shadow-inner"
          style={{ backgroundColor: `rgba(${r}, ${g}, ${b}, ${alpha})` }}
        />
      </div>
    </div>
  );
}
