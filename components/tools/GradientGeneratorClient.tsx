'use client';

import { useState, useCallback } from 'react';

interface ColorStop {
  id: number;
  color: string;
  position: number;
}

let nextId = 3;

function buildGradientCss(
  type: 'linear' | 'radial',
  angle: number,
  stops: ColorStop[]
): string {
  const sorted = [...stops].sort((a, b) => a.position - b.position);
  const stopsCss = sorted.map((s) => `${s.color} ${s.position}%`).join(', ');
  if (type === 'linear') {
    return `linear-gradient(${angle}deg, ${stopsCss})`;
  }
  return `radial-gradient(circle, ${stopsCss})`;
}

export default function GradientGeneratorClient() {
  const [type, setType] = useState<'linear' | 'radial'>('linear');
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState<ColorStop[]>([
    { id: 1, color: '#58D65D', position: 0 },
    { id: 2, color: '#0EA5E9', position: 100 },
  ]);
  const [copied, setCopied] = useState(false);

  const css = buildGradientCss(type, angle, stops);
  const cssValue = `background: ${css};`;

  const copy = useCallback(() => {
    navigator.clipboard.writeText(css).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [css]);

  const loadExample = () => {
    setType('linear');
    setAngle(45);
    setStops([
      { id: nextId++, color: '#F97316', position: 0 },
      { id: nextId++, color: '#DB2777', position: 50 },
      { id: nextId++, color: '#7C3AED', position: 100 },
    ]);
  };

  const updateStop = (id: number, patch: Partial<ColorStop>) => {
    setStops((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const addStop = () => {
    setStops((prev) => {
      const last = prev[prev.length - 1];
      const position = last ? Math.min(100, last.position + 10) : 100;
      return [...prev, { id: nextId++, color: '#FFFFFF', position }];
    });
  };

  const removeStop = (id: number) => {
    setStops((prev) => (prev.length <= 2 ? prev : prev.filter((s) => s.id !== id)));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Gradient Generator</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {/* Type toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setType('linear')}
            className="tb-v2-btn-sm"
            style={{
              background: type === 'linear' ? 'var(--red)' : undefined,
              color: type === 'linear' ? '#fff' : undefined,
            }}
          >
            Linear
          </button>
          <button
            type="button"
            onClick={() => setType('radial')}
            className="tb-v2-btn-sm"
            style={{
              background: type === 'radial' ? 'var(--red)' : undefined,
              color: type === 'radial' ? '#fff' : undefined,
            }}
          >
            Radial
          </button>
        </div>

        {/* Angle control (linear only) */}
        {type === 'linear' && (
          <div className="flex flex-col gap-1">
            <span className="tb-v2-tool-label">Angle: {angle}deg</span>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={360}
                value={angle}
                onChange={(e) => setAngle(Number(e.target.value))}
                style={{ flex: 1 }}
                aria-label="Gradient angle"
              />
              <input
                type="number"
                min={0}
                max={360}
                value={angle}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  if (!Number.isNaN(v)) setAngle(Math.max(0, Math.min(360, v)));
                }}
                className="tb-v2-input"
                style={{ width: 80 }}
                aria-label="Gradient angle value"
              />
            </div>
          </div>
        )}

        {/* Color stops */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="tb-v2-tool-label">Color Stops</span>
            <button type="button" onClick={addStop} className="tb-v2-btn-sm">
              + Add Stop
            </button>
          </div>
          {stops
            .slice()
            .sort((a, b) => a.position - b.position)
            .map((stop) => (
              <div key={stop.id} className="flex items-center gap-3">
                <input
                  type="color"
                  value={stop.color}
                  onChange={(e) => updateStop(stop.id, { color: e.target.value })}
                  aria-label="Stop color"
                  style={{
                    width: 40,
                    height: 32,
                    padding: 0,
                    border: '1px solid var(--line-1)',
                    borderRadius: 6,
                    background: 'none',
                    cursor: 'pointer',
                  }}
                />
                <input
                  type="text"
                  value={stop.color}
                  onChange={(e) => updateStop(stop.id, { color: e.target.value })}
                  className="tb-v2-input"
                  style={{ width: 100 }}
                  spellCheck={false}
                  aria-label="Stop color hex"
                />
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={stop.position}
                  onChange={(e) => updateStop(stop.id, { position: Number(e.target.value) })}
                  style={{ flex: 1 }}
                  aria-label="Stop position"
                />
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={stop.position}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    if (!Number.isNaN(v)) updateStop(stop.id, { position: Math.max(0, Math.min(100, v)) });
                  }}
                  className="tb-v2-input"
                  style={{ width: 70 }}
                  aria-label="Stop position value"
                />
                <span style={{ fontSize: 12, color: 'var(--fg-3)', width: 16 }}>%</span>
                <button
                  type="button"
                  onClick={() => removeStop(stop.id)}
                  disabled={stops.length <= 2}
                  className="tb-v2-btn-sm"
                  aria-label="Remove stop"
                  style={{ opacity: stops.length <= 2 ? 0.4 : 1 }}
                >
                  Remove
                </button>
              </div>
            ))}
        </div>

        {/* Live preview */}
        <div className="flex flex-col gap-1">
          <span className="tb-v2-tool-label">Preview</span>
          <div
            style={{
              background: css,
              width: '100%',
              height: 160,
              borderRadius: 10,
              border: '1px solid var(--line-1)',
            }}
            aria-label="Gradient preview"
          />
        </div>

        {/* Output */}
        <div>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">CSS Output</span>
            <button type="button" onClick={copy} className="tb-v2-copy-btn">
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="tb-v2-tool-output-body">
            <div>{css}</div>
            <div style={{ marginTop: 4, color: 'var(--fg-3)' }}>{cssValue}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
