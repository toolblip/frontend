'use client';

import { useMemo, useRef, useState } from 'react';
import { COMMON_RATIOS, nearestCommonRatio, simplifyRatio } from '@/lib/image-ratio';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

function num(v: string): number | null {
  const n = parseFloat(v);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export default function ImageAspectRatioCalculatorClient() {
  const [width, setWidth] = useState('1920');
  const [height, setHeight] = useState('1080');
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const w = num(width);
  const h = num(height);
  const ratio = useMemo(() => (w && h ? simplifyRatio(w, h) : null), [w, h]);
  const nearest = ratio && ratio.decimal > 0 ? nearestCommonRatio(ratio.decimal) : null;
  const activePreset = ratio
    ? COMMON_RATIOS.find((preset) => Math.abs(preset.ratio - ratio.decimal) < 0.0001)?.label
    : undefined;

  const loadFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }
    setError('');
    setFileName(file.name);
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setWidth(String(img.naturalWidth));
      setHeight(String(img.naturalHeight));
      URL.revokeObjectURL(url);
    };
    img.onerror = () => setError('Could not load this image.');
    img.src = url;
  };

  const applyPreset = (presetRatio: number) => {
    if (!w) {
      setWidth('1920');
      setHeight(String(Math.round(1920 / presetRatio)));
      return;
    }
    setHeight(String(Math.round(w / presetRatio)));
  };

  const loadExample = () => {
    setWidth('1920');
    setHeight('1080');
    setFileName('');
    setError('');
  };

  const clearAll = () => {
    setWidth('');
    setHeight('');
    setFileName('');
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head" style={{ borderBottom: '1px solid var(--line)' }}>
        <span className="tb-v2-tool-label">Dimensions</span>
        <ToolExampleClearActions
          onExample={loadExample}
          onClear={clearAll}
          canClear={Boolean(width || height || fileName || error)}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => loadFile(e.target.files?.[0])}
          style={{ display: 'none' }}
        />
      </div>
      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {error && <div className="tb-v2-banner tb-v2-banner-err">{error}</div>}
        {fileName && (
          <p style={{ margin: 0, fontSize: 13, color: 'var(--fg-2)' }}>Using {fileName}</p>
        )}

        <div className="tb-v2-grid-2" style={{ gap: 12 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span className="tb-v2-tool-label">Width (px)</span>
            <input
              type="number"
              min={1}
              className="tb-v2-input"
              style={{ fontFamily: 'var(--f-mono)' }}
              value={width}
              onChange={(e) => setWidth(e.target.value)}
            />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span className="tb-v2-tool-label">Height (px)</span>
            <input
              type="number"
              min={1}
              className="tb-v2-input"
              style={{ fontFamily: 'var(--f-mono)' }}
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </label>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
            <span className="tb-v2-tool-label">Common presets</span>
            <button type="button" onClick={() => fileInputRef.current?.click()} className="tb-v2-btn-sm">
              Read from image
            </button>
          </div>
          <div className="tb-v2-mode-tabs" role="group" aria-label="Common presets">
            {COMMON_RATIOS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                className={`tb-v2-mode-tab ${activePreset === preset.label ? 'on' : ''}`}
                aria-pressed={activePreset === preset.label}
                onClick={() => applyPreset(preset.ratio)}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Result</span>
      </div>
      <div className="tb-v2-tool-output-body">
        {!ratio || ratio.w === 0 ? (
          <p className="tb-v2-empty">Enter width and height to calculate the ratio.</p>
        ) : (
          <div className="grid grid-cols-1 items-center gap-5 sm:grid-cols-[minmax(0,1fr)_auto]">
            <div>
              <div style={{ fontSize: 11, color: 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Simplified ratio
              </div>
              <div style={{ marginTop: 4, fontFamily: 'var(--f-mono)', fontSize: 32, fontWeight: 700, lineHeight: 1.1 }}>
                {ratio.w}:{ratio.h}
              </div>
              <p style={{ margin: '8px 0 0', fontSize: 13, color: 'var(--fg-2)' }}>
                {nearest?.label ?? 'Custom'} · {ratio.decimal.toFixed(4)} decimal
              </p>
            </div>
            <div className="tb-v2-stat-pill" style={{ minWidth: 150 }}>
              <div style={{ fontSize: 11, color: 'var(--fg-2)' }}>Pixels</div>
              <div style={{ marginTop: 4, fontFamily: 'var(--f-mono)', fontWeight: 600 }}>{w} × {h}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
