'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

export default function ImageSquareFitClient() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [size, setSize] = useState('1000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const targetSize = Math.max(1, parseInt(size, 10) || 0);

  const draw = useCallback(() => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas || !targetSize) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = targetSize;
    canvas.height = targetSize;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, targetSize, targetSize);

    const scale = Math.min(targetSize / img.naturalWidth, targetSize / img.naturalHeight);
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    const dx = (targetSize - dw) / 2;
    const dy = (targetSize - dh) / 2;
    ctx.drawImage(img, dx, dy, dw, dh);

    setPreviewUrl(canvas.toDataURL('image/png'));
  }, [targetSize, bgColor]);

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
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(fileName.replace(/\.[^.]+$/, '') || 'square-fit')}-${targetSize}x${targetSize}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
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
          <span style={{ fontSize: 28 }}>⬜</span>
          <span className="tb-v2-dropzone-text">Click or drag an image here</span>
          <span className="tb-v2-dropzone-hint">Fitted into a square entirely in your browser</span>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
        </div>
        {error && <div className="tb-v2-banner tb-v2-banner-err" style={{ marginTop: 12 }}>{error}</div>}

        {imageUrl && (
          <div className="tb-v2-grid-2" style={{ marginTop: 16 }}>
            <div style={{ paddingRight: 12 }}>
              <span className="tb-v2-tool-label">Square Size (px)</span>
              <input
                type="number"
                min={1}
                className="tb-v2-input"
                style={{ marginTop: 8 }}
                value={size}
                onChange={(e) => setSize(e.target.value)}
              />
            </div>
            <div style={{ paddingLeft: 12 }}>
              <span className="tb-v2-tool-label">Background Color</span>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                style={{ display: 'block', marginTop: 8, width: 60, height: 36, borderRadius: 8, border: '1px solid var(--line)', cursor: 'pointer' }}
              />
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
          <p className="tb-v2-empty">Upload an image to preview the square-fit result.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Square fit preview"
              style={{ maxWidth: '100%', maxHeight: 360, border: '1px solid var(--line)', borderRadius: 8 }}
            />
            <div className="tb-v2-stats-grid" style={{ width: '100%', border: 0, background: 'transparent', padding: 0 }}>
              <div className="tb-v2-stat-pill">
                <div style={{ fontSize: 11, color: 'var(--fg-2)' }}>Output Size</div>
                <div style={{ fontFamily: 'var(--f-mono)', fontWeight: 600 }}>{targetSize}×{targetSize}</div>
              </div>
            </div>
            <button type="button" onClick={download} className="tb-v2-btn tb-v2-btn-primary">
              Download PNG
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
