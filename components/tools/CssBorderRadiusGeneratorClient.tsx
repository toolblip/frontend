'use client';

import { useState, useCallback, useMemo } from 'react';

type Unit = 'px' | '%';

interface Corners {
  topLeft: number;
  topRight: number;
  bottomRight: number;
  bottomLeft: number;
}

interface Preset {
  name: string;
  unit: Unit;
  corners: Corners;
}

const PRESETS: Preset[] = [
  { name: 'Subtle', unit: 'px', corners: { topLeft: 4, topRight: 4, bottomRight: 4, bottomLeft: 4 } },
  { name: 'Rounded', unit: 'px', corners: { topLeft: 16, topRight: 16, bottomRight: 16, bottomLeft: 16 } },
  { name: 'Pill', unit: 'px', corners: { topLeft: 100, topRight: 100, bottomRight: 100, bottomLeft: 100 } },
  { name: 'Circle', unit: '%', corners: { topLeft: 50, topRight: 50, bottomRight: 50, bottomLeft: 50 } },
];

type CornerKey = keyof Corners;

const CORNER_KEYS: CornerKey[] = ['topLeft', 'topRight', 'bottomRight', 'bottomLeft'];

const CORNER_LABELS: Record<CornerKey, string> = {
  topLeft: 'Top Left',
  topRight: 'Top Right',
  bottomRight: 'Bottom Right',
  bottomLeft: 'Bottom Left',
};

function clamp(val: number, max: number): number {
  return Math.min(max, Math.max(0, val));
}

export default function CssBorderRadiusGeneratorClient() {
  const [corners, setCorners] = useState<Corners>({
    topLeft: 16,
    topRight: 16,
    bottomRight: 16,
    bottomLeft: 16,
  });
  const [unit, setUnit] = useState<Unit>('px');
  const [linked, setLinked] = useState(true);
  const [borderWidth, setBorderWidth] = useState(2);
  const [borderColor, setBorderColor] = useState('#22c55e');
  const [copied, setCopied] = useState(false);

  const maxVal = unit === 'px' ? 100 : 50;

  const updateCorner = useCallback(
    (corner: CornerKey, value: number) => {
      if (linked) {
        setCorners({ topLeft: value, topRight: value, bottomRight: value, bottomLeft: value });
      } else {
        setCorners(prev => ({ ...prev, [corner]: value }));
      }
    },
    [linked]
  );

  const borderRadiusStyle = useMemo(() => {
    const r = (v: number) => `${v}${unit}`;
    return `${r(corners.topLeft)} ${r(corners.topRight)} ${r(corners.bottomRight)} ${r(corners.bottomLeft)}`;
  }, [corners, unit]);

  const cssOutput = useMemo(() => {
    const { topLeft, topRight, bottomRight, bottomLeft } = corners;
    const r = (v: number) => `${v}${unit}`;
    const allSame =
      topLeft === topRight && topRight === bottomRight && bottomRight === bottomLeft;
    const radiusValue = allSame
      ? r(topLeft)
      : `${r(topLeft)} ${r(topRight)} ${r(bottomRight)} ${r(bottomLeft)}`;
    return `border-radius: ${radiusValue};\nborder: ${borderWidth}px solid ${borderColor};`;
  }, [corners, unit, borderWidth, borderColor]);

  const copy = () => {
    navigator.clipboard.writeText(cssOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const applyPreset = (preset: Preset) => {
    setUnit(preset.unit);
    setCorners(preset.corners);
    setLinked(true);
  };

  const handleUnitChange = (newUnit: Unit) => {
    const newMax = newUnit === 'px' ? 100 : 50;
    setUnit(newUnit);
    setCorners(prev => ({
      topLeft: clamp(prev.topLeft, newMax),
      topRight: clamp(prev.topRight, newMax),
      bottomRight: clamp(prev.bottomRight, newMax),
      bottomLeft: clamp(prev.bottomLeft, newMax),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Presets */}
      <div>
        <label className="text-xs text-gray-500 uppercase tracking-wide font-medium block mb-2">
          Presets
        </label>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map(preset => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className="px-4 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-sm rounded-full transition-colors border border-gray-700 hover:border-green-600"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Controls column */}
        <div className="space-y-5">
          {/* Unit selector + link toggle */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {(['px', '%'] as Unit[]).map(u => (
                <button
                  key={u}
                  onClick={() => handleUnitChange(u)}
                  className={`text-sm px-3 py-1 rounded-full transition-colors ${
                    unit === u
                      ? 'bg-green-600 text-black font-medium'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
            <button
              onClick={() => setLinked(prev => !prev)}
              title={linked ? 'Unlink corners' : 'Link corners'}
              className={`flex items-center gap-1.5 text-sm px-3 py-1 rounded-full transition-colors ${
                linked
                  ? 'bg-green-600 text-black font-medium'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {linked ? 'Linked' : 'Unlinked'}
            </button>
          </div>

          {/* Corner sliders */}
          <div className="space-y-4">
            {CORNER_KEYS.map(corner => (
              <div key={corner}>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                    {CORNER_LABELS[corner]}
                  </label>
                  <span className="text-xs text-gray-400">
                    {corners[corner]}
                    {unit}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0}
                    max={maxVal}
                    value={corners[corner]}
                    onChange={e => updateCorner(corner, Number(e.target.value))}
                    className="flex-1 accent-green-500"
                  />
                  <input
                    type="number"
                    min={0}
                    max={maxVal}
                    value={corners[corner]}
                    onChange={e =>
                      updateCorner(corner, clamp(Number(e.target.value), maxVal))
                    }
                    className="w-16 bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-sm text-center text-gray-100 focus:outline-none focus:border-green-500"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Border controls */}
          <div className="space-y-3">
            <label className="text-xs text-gray-500 uppercase tracking-wide font-medium block">
              Border
            </label>

            {/* Width */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">Width</span>
                <span className="text-xs text-gray-400">{borderWidth}px</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={16}
                  value={borderWidth}
                  onChange={e => setBorderWidth(Number(e.target.value))}
                  className="flex-1 accent-green-500"
                />
                <input
                  type="number"
                  min={0}
                  max={16}
                  value={borderWidth}
                  onChange={e => setBorderWidth(clamp(Number(e.target.value), 16))}
                  className="w-16 bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-sm text-center text-gray-100 focus:outline-none focus:border-green-500"
                />
              </div>
            </div>

            {/* Color */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">Color</span>
              <input
                type="color"
                value={borderColor}
                onChange={e => setBorderColor(e.target.value)}
                className="w-10 h-8 rounded cursor-pointer border-0 bg-transparent p-0"
                title="Border color"
              />
              <span className="text-sm font-mono text-gray-400">{borderColor}</span>
            </div>
          </div>
        </div>

        {/* Preview + output column */}
        <div className="space-y-4">
          {/* Live preview */}
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide font-medium block mb-2">
              Live Preview
            </label>
            <div className="flex items-center justify-center h-56 bg-gray-800 rounded-xl border border-gray-700">
              <div
                className="w-40 h-40 bg-green-700"
                style={{
                  borderRadius: borderRadiusStyle,
                  border: `${borderWidth}px solid ${borderColor}`,
                }}
                aria-label="Border radius preview"
              />
            </div>
          </div>

          {/* CSS output */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                CSS Output
              </label>
              <button
                onClick={copy}
                className="text-sm text-green-400 hover:text-green-300 transition-colors"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <pre className="text-sm font-mono text-gray-300 whitespace-pre-wrap">
                {cssOutput}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
