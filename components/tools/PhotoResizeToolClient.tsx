'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

type FitMode = 'cover' | 'stretch' | 'contain';
type Format = 'image/png' | 'image/jpeg';

interface Preset {
  label: string;
  width: number;
  height: number;
}

const PRESETS: Preset[] = [
  { label: 'Instagram Post (1080×1080)', width: 1080, height: 1080 },
  { label: 'Instagram Story (1080×1920)', width: 1080, height: 1920 },
  { label: 'Facebook Cover (820×312)', width: 820, height: 312 },
  { label: 'Twitter/X Post (1200×675)', width: 1200, height: 675 },
  { label: 'LinkedIn Banner (1584×396)', width: 1584, height: 396 },
  { label: 'YouTube Thumbnail (1280×720)', width: 1280, height: 720 },
];

export default function PhotoResizeToolClient() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [presetIndex, setPresetIndex] = useState(0);
  const [isCustom, setIsCustom] = useState(false);
  const [customWidth, setCustomWidth] = useState('1200');
  const [customHeight, setCustomHeight] = useState('800');
  const [fitMode, setFitMode] = useState<FitMode>('cover');
  const [padColor, setPadColor] = useState('#ffffff');
  const [format, setFormat] = useState<Format>('image/png');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const targetWidth = isCustom ? Math.max(1, parseInt(customWidth, 10) || 0) : PRESETS[presetIndex].width;
  const targetHeight = isCustom ? Math.max(1, parseInt(customHeight, 10) || 0) : PRESETS[presetIndex].height;

  const draw = useCallback(() => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas || !targetWidth || !targetHeight) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = targetWidth;
    canvas.height = targetHeight;
    ctx.clearRect(0, 0, targetWidth, targetHeight);

    if (fitMode === 'stretch') {
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
    } else if (fitMode === 'cover') {
      const scale = Math.max(targetWidth / img.naturalWidth, targetHeight / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      const dx = (targetWidth - dw) / 2;
      const dy = (targetHeight - dh) / 2;
      ctx.drawImage(img, dx, dy, dw, dh);
    } else {
      // contain / letterbox
      ctx.fillStyle = padColor;
      ctx.fillRect(0, 0, targetWidth, targetHeight);
      const scale = Math.min(targetWidth / img.naturalWidth, targetHeight / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      const dx = (targetWidth - dw) / 2;
      const dy = (targetHeight - dh) / 2;
      ctx.drawImage(img, dx, dy, dw, dh);
    }

    const quality = format === 'image/jpeg' ? 0.92 : undefined;
    setPreviewUrl(canvas.toDataURL(format, quality));
  }, [targetWidth, targetHeight, fitMode, padColor, format]);

  useEffect(() => {
    if (imgRef.current) draw();
  }, [draw, imageUrl]);

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
      imgRef.current = img;
      setImageUrl(url);
    };
    img.onerror = () => setError('Could not load this image.');
    img.src = url;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => loadFile(e.target.files?.[0]);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    loadFile(e.dataTransfer.files?.[0]);
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ext = format === 'image/jpeg' ? 'jpg' : 'png';
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(fileName.replace(/\.[^.]+$/, '') || 'resized')}-${targetWidth}x${targetHeight}.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
    }, format, format === 'image/jpeg' ? 0.92 : undefined);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Upload Image</span>
      </div>
      <div style={{ padding: 20 }}>
        <div
          className={`tb-v2-dropzone ${isDragging ? 'dragging' : ''}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <span style={{ fontSize: 28 }}>🖼️</span>
          <span className="tb-v2-dropzone-text">Click or drag an image here</span>
          <span className="tb-v2-dropzone-hint">Resized entirely in your browser, never uploaded</span>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
        </div>
        {error && <div className="tb-v2-banner tb-v2-banner-err" style={{ marginTop: 12 }}>{error}</div>}

        {imageUrl && (
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <span className="tb-v2-tool-label">Target Size</span>
              <select
                className="tb-v2-select"
                style={{ width: '100%', marginTop: 8 }}
                value={isCustom ? 'custom' : String(presetIndex)}
                onChange={(e) => {
                  if (e.target.value === 'custom') { setIsCustom(true); }
                  else { setIsCustom(false); setPresetIndex(Number(e.target.value)); }
                }}
              >
                {PRESETS.map((p, i) => (
                  <option key={p.label} value={i}>{p.label}</option>
                ))}
                <option value="custom">Custom</option>
              </select>
            </div>

            {isCustom && (
              <div className="tb-v2-grid-2">
                <div>
                  <span className="tb-v2-tool-label">Width (px)</span>
                  <input
                    type="number"
                    min={1}
                    className="tb-v2-input"
                    style={{ marginTop: 8 }}
                    value={customWidth}
                    onChange={(e) => setCustomWidth(e.target.value)}
                  />
                </div>
                <div>
                  <span className="tb-v2-tool-label">Height (px)</span>
                  <input
                    type="number"
                    min={1}
                    className="tb-v2-input"
                    style={{ marginTop: 8 }}
                    value={customHeight}
                    onChange={(e) => setCustomHeight(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div>
              <span className="tb-v2-tool-label">Fit Mode</span>
              <div className="tb-v2-mode-tabs" style={{ marginTop: 8 }}>
                <button type="button" className={`tb-v2-mode-tab ${fitMode === 'cover' ? 'on' : ''}`} onClick={() => setFitMode('cover')}>Crop to Fit</button>
                <button type="button" className={`tb-v2-mode-tab ${fitMode === 'stretch' ? 'on' : ''}`} onClick={() => setFitMode('stretch')}>Stretch</button>
                <button type="button" className={`tb-v2-mode-tab ${fitMode === 'contain' ? 'on' : ''}`} onClick={() => setFitMode('contain')}>Letterbox / Pad</button>
              </div>
            </div>

            {fitMode === 'contain' && (
              <div>
                <span className="tb-v2-tool-label">Background Color</span>
                <input
                  type="color"
                  value={padColor}
                  onChange={(e) => setPadColor(e.target.value)}
                  style={{ display: 'block', marginTop: 8, width: 60, height: 36, borderRadius: 8, border: '1px solid var(--line)', cursor: 'pointer' }}
                />
              </div>
            )}

            <div>
              <span className="tb-v2-tool-label">Output Format</span>
              <div className="tb-v2-mode-tabs" style={{ marginTop: 8 }}>
                <button type="button" className={`tb-v2-mode-tab ${format === 'image/png' ? 'on' : ''}`} onClick={() => setFormat('image/png')}>PNG</button>
                <button type="button" className={`tb-v2-mode-tab ${format === 'image/jpeg' ? 'on' : ''}`} onClick={() => setFormat('image/jpeg')}>JPEG</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Preview</span>
      </div>
      <div className="tb-v2-tool-output-body">
        {!previewUrl ? (
          <p className="tb-v2-empty">Upload an image to preview the resized result.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Resized preview"
              style={{ maxWidth: '100%', maxHeight: 360, border: '1px solid var(--line)', borderRadius: 8, background: 'repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 50% / 16px 16px' }}
            />
            <div className="tb-v2-stats-grid" style={{ width: '100%', border: 0, background: 'transparent', padding: 0 }}>
              <div className="tb-v2-stat-pill">
                <div style={{ fontSize: 11, color: 'var(--fg-2)' }}>Output Size</div>
                <div style={{ fontFamily: 'var(--f-mono)', fontWeight: 600 }}>{targetWidth}×{targetHeight}</div>
              </div>
            </div>
            <button type="button" onClick={download} className="tb-v2-btn tb-v2-btn-primary">
              Download {format === 'image/png' ? 'PNG' : 'JPEG'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
