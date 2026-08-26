'use client';

import { useMemo, useRef, useState } from 'react';
import { COMMON_RATIOS, nearestCommonRatio, simplifyRatio } from '@/lib/image-ratio';

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

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Dimensions</span>
        <button type="button" onClick={() => fileInputRef.current?.click()} className="tb-v2-btn-sm">
          Read from Image
        </button>
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

        <div className="tb-v2-grid-2">
          <div style={{ paddingRight: 12 }}>
            <span className="tb-v2-tool-label">Width (px)</span>
            <input
              type="number"
              min={1}
              className="tb-v2-input"
              style={{ marginTop: 8, fontFamily: 'var(--f-mono)' }}
              value={width}
              onChange={(e) => setWidth(e.target.value)}
            />
          </div>
          <div style={{ paddingLeft: 12 }}>
            <span className="tb-v2-tool-label">Height (px)</span>
            <input
              type="number"
              min={1}
              className="tb-v2-input"
              style={{ marginTop: 8, fontFamily: 'var(--f-mono)' }}
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </div>
        </div>

        <div>
          <span className="tb-v2-tool-label">Common presets</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
            {COMMON_RATIOS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                className="tb-v2-btn-sm"
                onClick={() => applyPreset(preset.ratio)}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Aspect ratio</span>
      </div>
      <div className="tb-v2-tool-output-body">
        {!ratio || ratio.w === 0 ? (
          <p className="tb-v2-empty">Enter width and height to calculate the ratio.</p>
        ) : (
          <div className="tb-v2-stats-grid">
            <div className="tb-v2-stat-pill">
              <div style={{ fontSize: 11, color: 'var(--fg-2)' }}>Simplified</div>
              <div style={{ fontFamily: 'var(--f-mono)', fontWeight: 600 }}>{ratio.w}:{ratio.h}</div>
            </div>
            <div className="tb-v2-stat-pill">
              <div style={{ fontSize: 11, color: 'var(--fg-2)' }}>Decimal</div>
              <div style={{ fontFamily: 'var(--f-mono)', fontWeight: 600 }}>{ratio.decimal.toFixed(4)}</div>
            </div>
            <div className="tb-v2-stat-pill">
              <div style={{ fontSize: 11, color: 'var(--fg-2)' }}>Nearest named</div>
              <div style={{ fontFamily: 'var(--f-mono)', fontWeight: 600 }}>{nearest?.label ?? 'Custom'}</div>
            </div>
            <div className="tb-v2-stat-pill">
              <div style={{ fontSize: 11, color: 'var(--fg-2)' }}>Pixels</div>
              <div style={{ fontFamily: 'var(--f-mono)', fontWeight: 600 }}>{w} × {h}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
