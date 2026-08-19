'use client';

import { useState, useRef } from 'react';

function round(n: number): number {
  return Math.round(n * 100) / 100;
}

export default function ImageScaleCalculatorClient() {
  const [origWidth, setOrigWidth] = useState('1920');
  const [origHeight, setOrigHeight] = useState('1080');
  const [scalePercent, setScalePercent] = useState('50');
  const [targetWidth, setTargetWidth] = useState('960');
  const [targetHeight, setTargetHeight] = useState('540');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const num = (v: string) => {
    const n = parseFloat(v);
    return isNaN(n) || n <= 0 ? null : n;
  };

  const recomputeFromScale = (scaleVal: string, ow: string, oh: string) => {
    const o = num(ow);
    const h = num(oh);
    const s = num(scaleVal);
    setScalePercent(scaleVal);
    if (o !== null && h !== null && s !== null) {
      setTargetWidth(String(round(o * (s / 100))));
      setTargetHeight(String(round(h * (s / 100))));
    }
  };

  const handleScaleChange = (v: string) => {
    recomputeFromScale(v, origWidth, origHeight);
  };

  const handleTargetWidthChange = (v: string) => {
    setTargetWidth(v);
    const o = num(origWidth);
    const h = num(origHeight);
    const tw = num(v);
    if (o !== null && h !== null && tw !== null) {
      const ratio = tw / o;
      setTargetHeight(String(round(h * ratio)));
      setScalePercent(String(round(ratio * 100)));
    }
  };

  const handleTargetHeightChange = (v: string) => {
    setTargetHeight(v);
    const o = num(origWidth);
    const h = num(origHeight);
    const th = num(v);
    if (o !== null && h !== null && th !== null) {
      const ratio = th / h;
      setTargetWidth(String(round(o * ratio)));
      setScalePercent(String(round(ratio * 100)));
    }
  };

  const handleOrigWidthChange = (v: string) => {
    setOrigWidth(v);
    recomputeFromScale(scalePercent, v, origHeight);
  };

  const handleOrigHeightChange = (v: string) => {
    setOrigHeight(v);
    recomputeFromScale(scalePercent, origWidth, v);
  };

  const loadFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }
    setError('');
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const ow = String(img.naturalWidth);
      const oh = String(img.naturalHeight);
      setOrigWidth(ow);
      setOrigHeight(oh);
      recomputeFromScale(scalePercent, ow, oh);
      URL.revokeObjectURL(url);
    };
    img.onerror = () => setError('Could not load this image.');
    img.src = url;
  };

  const o = num(origWidth);
  const h = num(origHeight);
  const tw = num(targetWidth);
  const th = num(targetHeight);
  const valid = o !== null && h !== null && tw !== null && th !== null;

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Original Dimensions</span>
        <button type="button" onClick={() => fileInputRef.current?.click()} className="tb-v2-btn-sm">
          Auto-fill from Image
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

        <div className="tb-v2-grid-2">
          <div style={{ paddingRight: 12 }}>
            <span className="tb-v2-tool-label">Original Width (px)</span>
            <input
              type="number"
              min={1}
              className="tb-v2-input"
              style={{ marginTop: 8, fontFamily: 'var(--f-mono)' }}
              value={origWidth}
              onChange={(e) => handleOrigWidthChange(e.target.value)}
            />
          </div>
          <div style={{ paddingLeft: 12 }}>
            <span className="tb-v2-tool-label">Original Height (px)</span>
            <input
              type="number"
              min={1}
              className="tb-v2-input"
              style={{ marginTop: 8, fontFamily: 'var(--f-mono)' }}
              value={origHeight}
              onChange={(e) => handleOrigHeightChange(e.target.value)}
            />
          </div>
        </div>

        <div>
          <span className="tb-v2-tool-label">Scale (%)</span>
          <input
            type="number"
            min={0}
            step="1"
            className="tb-v2-input"
            style={{ marginTop: 8, fontFamily: 'var(--f-mono)' }}
            value={scalePercent}
            onChange={(e) => handleScaleChange(e.target.value)}
          />
        </div>

        <div className="tb-v2-grid-2">
          <div style={{ paddingRight: 12 }}>
            <span className="tb-v2-tool-label">Target Width (px)</span>
            <input
              type="number"
              min={0}
              className="tb-v2-input"
              style={{ marginTop: 8, fontFamily: 'var(--f-mono)' }}
              value={targetWidth}
              onChange={(e) => handleTargetWidthChange(e.target.value)}
            />
          </div>
          <div style={{ paddingLeft: 12 }}>
            <span className="tb-v2-tool-label">Target Height (px)</span>
            <input
              type="number"
              min={0}
              className="tb-v2-input"
              style={{ marginTop: 8, fontFamily: 'var(--f-mono)' }}
              value={targetHeight}
              onChange={(e) => handleTargetHeightChange(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Result</span>
      </div>
      <div className="tb-v2-tool-output-body">
        {!valid ? (
          <p className="tb-v2-empty">Enter original and target dimensions to calculate scale.</p>
        ) : (
          <div className="tb-v2-stats-grid">
            <div className="tb-v2-stat-pill">
              <div style={{ fontSize: 11, color: 'var(--fg-2)' }}>New Width</div>
              <div style={{ fontFamily: 'var(--f-mono)', fontWeight: 600 }}>{tw}px</div>
            </div>
            <div className="tb-v2-stat-pill">
              <div style={{ fontSize: 11, color: 'var(--fg-2)' }}>New Height</div>
              <div style={{ fontFamily: 'var(--f-mono)', fontWeight: 600 }}>{th}px</div>
            </div>
            <div className="tb-v2-stat-pill">
              <div style={{ fontSize: 11, color: 'var(--fg-2)' }}>Scale</div>
              <div style={{ fontFamily: 'var(--f-mono)', fontWeight: 600 }}>{round((tw / (o as number)) * 100)}%</div>
            </div>
            <div className="tb-v2-stat-pill">
              <div style={{ fontSize: 11, color: 'var(--fg-2)' }}>Megapixels</div>
              <div style={{ fontFamily: 'var(--f-mono)', fontWeight: 600 }}>{round((tw * th) / 1_000_000)} MP</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
