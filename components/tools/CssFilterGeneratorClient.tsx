'use client';

import { useState, useMemo } from 'react';

interface FilterState {
  blur: number;
  brightness: number;
  contrast: number;
  saturate: number;
  grayscale: number;
  sepia: number;
  hueRotate: number;
  invert: number;
  opacity: number;
}

const DEFAULTS: FilterState = {
  blur: 0,
  brightness: 100,
  contrast: 100,
  saturate: 100,
  grayscale: 0,
  sepia: 0,
  hueRotate: 0,
  invert: 0,
  opacity: 100,
};

const SLIDERS: { key: keyof FilterState; label: string; min: number; max: number; unit: string }[] = [
  { key: 'blur', label: 'Blur', min: 0, max: 20, unit: 'px' },
  { key: 'brightness', label: 'Brightness', min: 0, max: 200, unit: '%' },
  { key: 'contrast', label: 'Contrast', min: 0, max: 200, unit: '%' },
  { key: 'saturate', label: 'Saturate', min: 0, max: 200, unit: '%' },
  { key: 'grayscale', label: 'Grayscale', min: 0, max: 100, unit: '%' },
  { key: 'sepia', label: 'Sepia', min: 0, max: 100, unit: '%' },
  { key: 'hueRotate', label: 'Hue Rotate', min: 0, max: 360, unit: 'deg' },
  { key: 'invert', label: 'Invert', min: 0, max: 100, unit: '%' },
  { key: 'opacity', label: 'Opacity', min: 0, max: 100, unit: '%' },
];

function buildFilterValue(f: FilterState): string {
  const parts: string[] = [];
  if (f.blur !== 0) parts.push(`blur(${f.blur}px)`);
  if (f.brightness !== 100) parts.push(`brightness(${f.brightness}%)`);
  if (f.contrast !== 100) parts.push(`contrast(${f.contrast}%)`);
  if (f.saturate !== 100) parts.push(`saturate(${f.saturate}%)`);
  if (f.grayscale !== 0) parts.push(`grayscale(${f.grayscale}%)`);
  if (f.sepia !== 0) parts.push(`sepia(${f.sepia}%)`);
  if (f.hueRotate !== 0) parts.push(`hue-rotate(${f.hueRotate}deg)`);
  if (f.invert !== 0) parts.push(`invert(${f.invert}%)`);
  if (f.opacity !== 100) parts.push(`opacity(${f.opacity}%)`);
  return parts.length > 0 ? parts.join(' ') : 'none';
}

export default function CssFilterGeneratorClient() {
  const [filter, setFilter] = useState<FilterState>(DEFAULTS);
  const [copied, setCopied] = useState(false);

  const filterValue = useMemo(() => buildFilterValue(filter), [filter]);
  const css = `filter: ${filterValue};`;

  const update = (key: keyof FilterState, value: number) => {
    setFilter(prev => ({ ...prev, [key]: value }));
  };

  const reset = () => setFilter(DEFAULTS);

  const copy = () => {
    navigator.clipboard.writeText(css).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Filter Controls</span>
        <button type="button" onClick={reset} className="tb-v2-btn-sm">Reset</button>
      </div>

      <div className="flex flex-col gap-3">
        {SLIDERS.map(s => (
          <div key={s.key} className="tb-v2-range-row">
            <label className="tb-v2-tool-label">{s.label}</label>
            <input
              type="range"
              min={s.min}
              max={s.max}
              value={filter[s.key]}
              onChange={e => update(s.key, Number(e.target.value))}
              className="tb-v2-range"
            />
            <span className="tb-v2-range-val">{filter[s.key]}{s.unit}</span>
          </div>
        ))}
      </div>

      <div>
        <div className="tb-v2-tool-label" style={{ marginBottom: 8 }}>Live Preview</div>
        <div
          className="rounded-xl"
          style={{
            height: 200,
            background: 'linear-gradient(135deg, #7c3aed, #06b6d4, #f59e0b)',
            filter: filterValue,
          }}
        />
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">CSS Output</span>
        <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'var(--f-mono)', fontSize: 13 }}>{css}</pre>
      </div>
    </div>
  );
}
