'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

type Shape = 'circle' | 'square';

const PREVIEW_BOX = 320;

function renderToCanvas(
  canvas: HTMLCanvasElement,
  boxSize: number,
  img: HTMLImageElement,
  zoom: number,
  panX: number,
  panY: number,
  shape: Shape,
  brightness: number,
  contrast: number,
  saturation: number
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  canvas.width = boxSize;
  canvas.height = boxSize;
  ctx.clearRect(0, 0, boxSize, boxSize);

  ctx.save();
  if (shape === 'circle') {
    ctx.beginPath();
    ctx.arc(boxSize / 2, boxSize / 2, boxSize / 2, 0, Math.PI * 2);
    ctx.clip();
  }

  ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;

  const baseScale = Math.max(boxSize / img.naturalWidth, boxSize / img.naturalHeight);
  const scale = baseScale * zoom;
  const factor = boxSize / PREVIEW_BOX;
  const dw = img.naturalWidth * scale;
  const dh = img.naturalHeight * scale;
  const dx = (boxSize - dw) / 2 + panX * factor;
  const dy = (boxSize - dh) / 2 + panY * factor;
  ctx.drawImage(img, dx, dy, dw, dh);
  ctx.restore();
}

export default function ProfilePhotoEditorClient() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [shape, setShape] = useState<Shape>('circle');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [outputSize, setOutputSize] = useState(512);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isPanningRef = useRef(false);
  const panStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  const redraw = useCallback(() => {
    const img = imgRef.current;
    const canvas = previewCanvasRef.current;
    if (!img || !canvas) return;
    renderToCanvas(canvas, PREVIEW_BOX, img, zoom, pan.x, pan.y, shape, brightness, contrast, saturation);
  }, [zoom, pan, shape, brightness, contrast, saturation]);

  useEffect(() => {
    if (imgRef.current) redraw();
  }, [redraw, imageUrl]);

  const loadFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }
    setError('');
    setFileName(file.name);
    setZoom(1);
    setPan({ x: 0, y: 0 });
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

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!imgRef.current) return;
    isPanningRef.current = true;
    panStartRef.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isPanningRef.current) return;
    const dx = e.clientX - panStartRef.current.x;
    const dy = e.clientY - panStartRef.current.y;
    setPan({ x: panStartRef.current.panX + dx, y: panStartRef.current.panY + dy });
  };
  const handlePointerUp = () => {
    isPanningRef.current = false;
  };

  const resetAdjustments = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
  };

  const download = () => {
    const img = imgRef.current;
    if (!img) return;
    const canvas = document.createElement('canvas');
    renderToCanvas(canvas, outputSize, img, zoom, pan.x, pan.y, shape, brightness, contrast, saturation);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(fileName.replace(/\.[^.]+$/, '') || 'profile-photo')}-${outputSize}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Upload Photo</span>
      </div>
      <div style={{ padding: 20 }}>
        {!imageUrl ? (
          <div
            className={`tb-v2-dropzone ${isDragging ? 'dragging' : ''}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <span style={{ fontSize: 28 }}>🙂</span>
            <span className="tb-v2-dropzone-text">Click or drag a photo here</span>
            <span className="tb-v2-dropzone-hint">Edited entirely in your browser, never uploaded</span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <canvas
                ref={previewCanvasRef}
                width={PREVIEW_BOX}
                height={PREVIEW_BOX}
                style={{ width: PREVIEW_BOX, height: PREVIEW_BOX, border: '1px solid var(--line)', borderRadius: 8, cursor: 'grab', touchAction: 'none', background: 'repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 50% / 16px 16px' }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
              />
            </div>
            <p className="tb-v2-dropzone-hint" style={{ textAlign: 'center' }}>Drag the photo to pan, use the sliders below to zoom &amp; adjust.</p>

            <div>
              <span className="tb-v2-tool-label">Crop Shape</span>
              <div className="tb-v2-mode-tabs" style={{ marginTop: 8 }}>
                <button type="button" className={`tb-v2-mode-tab ${shape === 'circle' ? 'on' : ''}`} onClick={() => setShape('circle')}>Circle</button>
                <button type="button" className={`tb-v2-mode-tab ${shape === 'square' ? 'on' : ''}`} onClick={() => setShape('square')}>Square</button>
              </div>
            </div>

            <div className="tb-v2-range-row">
              <span className="tb-v2-tool-label" style={{ minWidth: 90 }}>Zoom</span>
              <input type="range" min={1} max={4} step={0.05} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="tb-v2-range" />
              <span className="tb-v2-range-val">{zoom.toFixed(2)}x</span>
            </div>
            <div className="tb-v2-range-row">
              <span className="tb-v2-tool-label" style={{ minWidth: 90 }}>Brightness</span>
              <input type="range" min={50} max={150} value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} className="tb-v2-range" />
              <span className="tb-v2-range-val">{brightness}%</span>
            </div>
            <div className="tb-v2-range-row">
              <span className="tb-v2-tool-label" style={{ minWidth: 90 }}>Contrast</span>
              <input type="range" min={50} max={150} value={contrast} onChange={(e) => setContrast(Number(e.target.value))} className="tb-v2-range" />
              <span className="tb-v2-range-val">{contrast}%</span>
            </div>
            <div className="tb-v2-range-row">
              <span className="tb-v2-tool-label" style={{ minWidth: 90 }}>Saturation</span>
              <input type="range" min={0} max={200} value={saturation} onChange={(e) => setSaturation(Number(e.target.value))} className="tb-v2-range" />
              <span className="tb-v2-range-val">{saturation}%</span>
            </div>
            <div className="tb-v2-range-row">
              <span className="tb-v2-tool-label" style={{ minWidth: 90 }}>Output Size</span>
              <input type="range" min={128} max={1024} step={64} value={outputSize} onChange={(e) => setOutputSize(Number(e.target.value))} className="tb-v2-range" />
              <span className="tb-v2-range-val">{outputSize}px</span>
            </div>

            <div className="tb-v2-mode-tabs">
              <button type="button" onClick={download} className="tb-v2-btn tb-v2-btn-primary">
                Download PNG
              </button>
              <button type="button" onClick={resetAdjustments} className="tb-v2-btn">
                Reset Adjustments
              </button>
              <button
                type="button"
                onClick={() => { setImageUrl(null); imgRef.current = null; setFileName(''); }}
                className="tb-v2-btn"
              >
                Choose New Photo
              </button>
            </div>
          </div>
        )}
        {error && <div className="tb-v2-banner tb-v2-banner-err" style={{ marginTop: 12 }}>{error}</div>}
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
      </div>
    </div>
  );
}
