'use client';

import { useState, useCallback } from 'react';

type GradientType = 'linear' | 'radial' | 'conic';

interface ColorStop {
  id: string;
  color: string;
  position: number;
}

interface PresetDef {
  name: string;
  type: GradientType;
  angle: number;
  stops: { color: string; position: number }[];
}

const PRESETS: PresetDef[] = [
  { name: 'Sunset', type: 'linear', angle: 135, stops: [{ color: '#ff6b6b', position: 0 }, { color: '#feca57', position: 100 }] },
  { name: 'Ocean', type: 'linear', angle: 180, stops: [{ color: '#0078ff', position: 0 }, { color: '#00ecbc', position: 100 }] },
  { name: 'Forest', type: 'linear', angle: 135, stops: [{ color: '#11998e', position: 0 }, { color: '#38ef7d', position: 100 }] },
  { name: 'Midnight', type: 'linear', angle: 135, stops: [{ color: '#0f0c29', position: 0 }, { color: '#302b63', position: 50 }, { color: '#24243e', position: 100 }] },
  { name: 'Purple Rain', type: 'linear', angle: 135, stops: [{ color: '#7c3aed', position: 0 }, { color: '#db2777', position: 100 }] },
  { name: 'Gold', type: 'linear', angle: 135, stops: [{ color: '#f7971e', position: 0 }, { color: '#ffd200', position: 100 }] },
  { name: 'Neon', type: 'linear', angle: 90, stops: [{ color: '#f953c6', position: 0 }, { color: '#b91d73', position: 100 }] },
  { name: 'Twitter', type: 'linear', angle: 90, stops: [{ color: '#1da1f2', position: 0 }, { color: '#0d8ecf', position: 100 }] },
  { name: 'Instagram', type: 'linear', angle: 45, stops: [{ color: '#f09433', position: 0 }, { color: '#e6683c', position: 25 }, { color: '#dc2743', position: 50 }, { color: '#cc2366', position: 75 }, { color: '#bc1888', position: 100 }] },
  { name: 'Facebook', type: 'linear', angle: 135, stops: [{ color: '#3b5998', position: 0 }, { color: '#1565c0', position: 100 }] },
  { name: 'Deep Sea', type: 'radial', angle: 0, stops: [{ color: '#0052d4', position: 0 }, { color: '#4364f7', position: 50 }, { color: '#6fb1fc', position: 100 }] },
  { name: 'Radial Glow', type: 'radial', angle: 0, stops: [{ color: '#00ecbc', position: 0 }, { color: '#0078ff', position: 100 }] },
  { name: 'Rainbow', type: 'conic', angle: 0, stops: [{ color: '#ff0000', position: 0 }, { color: '#ff8800', position: 17 }, { color: '#ffff00', position: 33 }, { color: '#00ff00', position: 50 }, { color: '#0000ff', position: 67 }, { color: '#8b00ff', position: 83 }, { color: '#ff0000', position: 100 }] },
  { name: 'Conic Dawn', type: 'conic', angle: 45, stops: [{ color: '#ff6b6b', position: 0 }, { color: '#feca57', position: 50 }, { color: '#48dbfb', position: 100 }] },
];

const GRADIENT_TYPES: GradientType[] = ['linear', 'radial', 'conic'];

let _nextId = 0;
const mkId = () => `stop-${++_nextId}`;

function makeStops(defs: { color: string; position: number }[]): ColorStop[] {
  return defs.map(s => ({ ...s, id: mkId() }));
}

function buildGradient(type: GradientType, angle: number, stops: ColorStop[]): string {
  const stopStr = stops.map(s => `${s.color} ${s.position}%`).join(', ');
  if (type === 'linear') return `linear-gradient(${angle}deg, ${stopStr})`;
  if (type === 'radial') return `radial-gradient(circle, ${stopStr})`;
  return `conic-gradient(from ${angle}deg, ${stopStr})`;
}

function presetGradient(preset: PresetDef): string {
  const stopStr = preset.stops.map(s => `${s.color} ${s.position}%`).join(', ');
  if (preset.type === 'linear') return `linear-gradient(${preset.angle}deg, ${stopStr})`;
  if (preset.type === 'radial') return `radial-gradient(circle, ${stopStr})`;
  return `conic-gradient(from ${preset.angle}deg, ${stopStr})`;
}

export default function CssGradientGeneratorClient() {
  const [type, setType] = useState<GradientType>('linear');
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState<ColorStop[]>(() =>
    makeStops([
      { color: '#7c3aed', position: 0 },
      { color: '#06b6d4', position: 100 },
    ])
  );
  const [copied, setCopied] = useState(false);

  const gradient = buildGradient(type, angle, stops);
  const cssLine = `background: ${gradient};`;

  const updateStopColor = useCallback((id: string, color: string) => {
    setStops(prev => prev.map(s => (s.id === id ? { ...s, color } : s)));
  }, []);

  const updateStopPosition = useCallback((id: string, position: number) => {
    setStops(prev => prev.map(s => (s.id === id ? { ...s, position } : s)));
  }, []);

  const addStop = useCallback(() => {
    setStops(prev => {
      const sorted = [...prev].sort((a, b) => a.position - b.position);
      const mid = Math.round((sorted[0].position + sorted[sorted.length - 1].position) / 2);
      const newStop: ColorStop = { id: mkId(), color: '#ffffff', position: mid };
      return [...prev, newStop].sort((a, b) => a.position - b.position);
    });
  }, []);

  const removeStop = useCallback((id: string) => {
    setStops(prev => (prev.length > 2 ? prev.filter(s => s.id !== id) : prev));
  }, []);

  const applyPreset = useCallback((preset: PresetDef) => {
    setType(preset.type);
    setAngle(preset.angle);
    setStops(makeStops(preset.stops));
  }, []);

  const copy = () => {
    navigator.clipboard.writeText(cssLine);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clampAngle = (val: number) => Math.min(360, Math.max(0, val));

  return (
    <div className="space-y-6">
      {/* Gradient type selector */}
      <div className="flex gap-2">
        {GRADIENT_TYPES.map(t => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`text-sm px-4 py-1.5 rounded-full capitalize transition-colors ${
              type === t
                ? 'bg-red-600 text-black font-medium'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Controls column */}
        <div className="space-y-5">
          {/* Angle - linear & conic only */}
          {(type === 'linear' || type === 'conic') && (
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wide font-medium block mb-2">
                Angle
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={360}
                  value={angle}
                  onChange={e => setAngle(Number(e.target.value))}
                  className="flex-1 accent-red-500"
                />
                <input
                  type="number"
                  min={0}
                  max={360}
                  value={angle}
                  onChange={e => setAngle(clampAngle(Number(e.target.value)))}
                  className="w-16 bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-sm text-center text-gray-100 focus:outline-none focus:border-red-500"
                />
                <span className="text-sm text-gray-500">°</span>
              </div>
            </div>
          )}

          {/* Color stops */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                Color Stops
              </label>
              <button
                onClick={addStop}
                className="text-sm text-red-400 hover:text-red-300 transition-colors"
              >
                + Add Stop
              </button>
            </div>
            <div className="space-y-2">
              {stops.map(stop => (
                <div
                  key={stop.id}
                  className="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2"
                >
                  <input
                    type="color"
                    value={stop.color}
                    onChange={e => updateStopColor(stop.id, e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent p-0 shrink-0"
                    title="Pick color"
                  />
                  <span className="text-sm text-gray-300 font-mono w-20 shrink-0">
                    {stop.color}
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={stop.position}
                    onChange={e => updateStopPosition(stop.id, Number(e.target.value))}
                    className="flex-1 accent-red-500"
                  />
                  <span className="text-xs text-gray-400 w-8 text-right shrink-0">
                    {stop.position}%
                  </span>
                  <button
                    onClick={() => removeStop(stop.id)}
                    disabled={stops.length <= 2}
                    className="text-gray-600 hover:text-red-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-xl leading-none shrink-0"
                    title="Remove stop"
                    aria-label="Remove stop"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Preview + output column */}
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide font-medium block mb-2">
              Live Preview
            </label>
            <div
              className="w-full h-48 rounded-xl border border-gray-700 transition-all duration-200"
              style={{ background: gradient }}
              aria-label="Gradient preview"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                CSS Output
              </label>
              <button
                onClick={copy}
                className="text-sm text-red-400 hover:text-red-300 transition-colors"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <pre className="text-sm font-mono text-gray-300 whitespace-pre-wrap break-all">
                {cssLine}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Preset gradients */}
      <div>
        <label className="text-xs text-gray-500 uppercase tracking-wide font-medium block mb-3">
          Preset Gradients
        </label>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {PRESETS.map(preset => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className="group flex flex-col items-center gap-1"
              title={preset.name}
            >
              <div
                className="w-full h-10 rounded-lg border border-gray-700 group-hover:border-red-500 transition-colors"
                style={{ background: presetGradient(preset) }}
              />
              <span className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors truncate w-full text-center">
                {preset.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
