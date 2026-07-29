'use client';

import { useState, useCallback } from 'react';

interface Preset {
  name: string;
  label: string;
  width: number;
  height: number;
}

const PRESETS: Preset[] = [
  { name: 'iphone-se', label: 'iPhone SE', width: 375, height: 667 },
  { name: 'iphone-14', label: 'iPhone 14', width: 390, height: 844 },
  { name: 'iphone-15pm', label: 'iPhone 15 Pro Max', width: 430, height: 932 },
  { name: 'pixel-8', label: 'Pixel 8', width: 412, height: 915 },
  { name: 'samsung-s24', label: 'Galaxy S24', width: 360, height: 780 },
  { name: 'ipad-mini', label: 'iPad Mini', width: 768, height: 1024 },
  { name: 'ipad-pro', label: 'iPad Pro 11"', width: 834, height: 1194 },
  { name: 'laptop-13', label: 'Laptop 13"', width: 1280, height: 800 },
  { name: 'laptop-15', label: 'Laptop 15"', width: 1366, height: 768 },
  { name: 'hd', label: 'HD 720p', width: 1280, height: 720 },
  { name: 'fhd', label: 'Full HD 1080p', width: 1920, height: 1080 },
  { name: 'qhd', label: 'QHD 1440p', width: 2560, height: 1440 },
  { name: '4k', label: '4K UHD', width: 3840, height: 2160 },
];

const SCALE = 0.3;

export default function ScreenResolutionTesterClient() {
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [label, setLabel] = useState('1920 × 1080');

  const selectPreset = useCallback((preset: Preset) => {
    setWidth(preset.width);
    setHeight(preset.height);
    setLabel(`${preset.width} × ${preset.height} - ${preset.label}`);
  }, []);

  const aspectRatio = (width / height).toFixed(3);

  return (
    <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:20,padding:"20px"}}>
      {/* Preset grid */}
      <div>
        <label className="block text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">
          Device Presets
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {PRESETS.map(preset => (
            <button
              key={preset.name}
              onClick={() => selectPreset(preset)}
              className={`text-left px-2.5 py-2 rounded-lg border text-xs transition-colors ${
                width === preset.width && height === preset.height
                  ? 'bg-red-600/20 border-red-600 text-red-400'
                  : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-200'
              }`}
            >
              <div className="font-medium truncate">{preset.label}</div>
              <div className="text-gray-600 mt-0.5">{preset.width}×{preset.height}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom dimensions */}
      <div className="tb-v2-grid-2">
        <div>
          <label className="block text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">
            Width (px)
          </label>
          <input
            type="number"
            min={1}
            max={7680}
            value={width}
            onChange={e => {
              setWidth(Math.max(1, Math.min(7680, Number(e.target.value))));
              setLabel('');
            }}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-gray-100 text-lg focus:outline-none focus:border-red-500"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">
            Height (px)
          </label>
          <input
            type="number"
            min={1}
            max={4320}
            value={height}
            onChange={e => {
              setHeight(Math.max(1, Math.min(4320, Number(e.target.value))));
              setLabel('');
            }}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-gray-100 text-lg focus:outline-none focus:border-red-500"
          />
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
        <div className="flex flex-wrap gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-white">{width} × {height}</div>
            <div className="text-xs text-gray-500 mt-0.5">Resolution</div>
          </div>
          <div className="w-px bg-gray-700 hidden sm:block" />
          <div>
            <div className="text-lg font-bold text-white">{aspectRatio}</div>
            <div className="text-xs text-gray-500 mt-0.5">Aspect Ratio</div>
          </div>
          <div className="w-px bg-gray-700 hidden sm:block" />
          <div>
            <div className="text-lg font-bold text-white">{width * height >= 1_000_000 ? `${((width * height) / 1_000_000).toFixed(2)} MP` : `${(width * height).toLocaleString()} px`}</div>
            <div className="text-xs text-gray-500 mt-0.5">Total Pixels</div>
          </div>
          <div className="w-px bg-gray-700 hidden sm:block" />
          <div>
            <div className="text-lg font-bold text-red-400">{(width * SCALE).toFixed(0)} × {(height * SCALE).toFixed(0)}</div>
            <div className="text-xs text-gray-500 mt-0.5">Scaled @ {SCALE * 100}%</div>
          </div>
        </div>
      </div>

      {/* Scaled preview */}
      <div>
        <label className="block text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">
          Live Preview <span className="text-gray-600">(scaled {SCALE * 100}%)</span>
        </label>
        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
          <div className="flex items-center justify-center p-4 bg-[length:20px_20px] bg-[linear-gradient(45deg,#1a1a1a_25%,transparent_25%,transparent_75%,#1a1a1a_75%,#1a1a1a),linear-gradient(45deg,#1a1a1a_25%,transparent_25%,transparent_75%,#1a1a1a_75%,#1a1a1a)]" style={{ backgroundImage: 'linear-gradient(45deg,#222 25%,transparent 25%,transparent 75%,#222 75%,#222),linear-gradient(45deg,#222 25%,transparent 25%,transparent 75%,#222 75%,#222)', backgroundSize: '20px 20px', backgroundPosition: '0 0,0 0' }}>
            <div
              className="bg-gray-900 border-2 border-red-500 rounded overflow-hidden flex flex-col items-center justify-center text-gray-400 shadow-2xl"
              style={{
                width: `${width * SCALE}px`,
                height: `${height * SCALE}px`,
                minWidth: '60px',
                minHeight: '40px',
              }}
            >
              <span className="text-xs font-mono text-red-400 text-center px-1 leading-tight">
                {label || `${width} × ${height}`}
              </span>
              <span className="text-xs text-gray-600 mt-0.5 font-mono">{aspectRatio}</span>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-2 text-center">
          Scaled preview - actual viewport is {width}×{height}px
        </p>
      </div>

      {/* Open in new tab (triggers actual viewport change) */}
      <a
        href={`javascript:void(window.open('about:blank','_blank','width=${width},height=${height}'))`}
        className="block w-full text-center bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 text-gray-300 font-medium py-2.5 rounded-lg transition-colors text-sm"
      >
        Open {width}×{height} in New Window
      </a>
    </div>
  );
}
