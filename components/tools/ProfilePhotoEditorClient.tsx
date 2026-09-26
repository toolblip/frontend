'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

import ToolExampleClearActions from './ToolExampleClearActions';
import {readImage,exampleFile,imageBounds} from '@/lib/images-qa';

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

  const request=useRef(0);
  useEffect(()=>()=>{request.current++;},[]);
  useEffect(()=>()=>{if(imageUrl)URL.revokeObjectURL(imageUrl);},[imageUrl]);
  const clear=()=>{request.current++;setImageUrl(null);imgRef.current=null;setError('');setFileName('');setZoom(1);setPan({x:0,y:0});setBrightness(100);setContrast(100);setSaturation(100);if(fileInputRef.current)fileInputRef.current.value='';};
  const loadFile=async(file:File|undefined)=>{if(!file)return;clear();const id=request.current;
    try{const {img,mime,bytes}=await readImage(file);if(id!==request.current)return;imgRef.current=img;setFileName(file.name);setImageUrl(URL.createObjectURL(new Blob([bytes],{type:mime})));}catch(e){if(id===request.current)setError((e as Error).message);}
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
    const factor = PREVIEW_BOX / e.currentTarget.getBoundingClientRect().width;
    const dx = (e.clientX - panStartRef.current.x) * factor;
    const dy = (e.clientY - panStartRef.current.y) * factor;
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
    try {imageBounds(outputSize,outputSize);} catch(e){setError((e as Error).message);return;}
    const id=request.current;
    const canvas = document.createElement('canvas');
    renderToCanvas(canvas, outputSize, img, zoom, pan.x, pan.y, shape, brightness, contrast, saturation);
    canvas.toBlob((blob) => {
      if (!blob || id!==request.current) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(fileName.replace(/\.[^.]+$/, '') || 'profile-photo')}-${outputSize}.png`;
      a.click();
      setTimeout(()=>URL.revokeObjectURL(url),1000);
    }, 'image/png');
  };

  return (
    <div className="tb-v2-tool-card"><style jsx>{`input,textarea,select {max-width:100%;min-width:0} .tb-v2-tool-card {min-width:0;max-width:100%;overflow-wrap:anywhere} .tb-v2-tool-input-head {flex-wrap:wrap;gap:8px} .tb-v2-range-row {flex-wrap:wrap} .tb-v2-range {min-width:0;flex:1}`}</style>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Upload Photo</span><ToolExampleClearActions onExample={()=>loadFile(exampleFile())} onClear={clear}/>
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
                style={{ width: PREVIEW_BOX, maxWidth: '100%', height: 'auto', aspectRatio:'1', border: '1px solid var(--line)', borderRadius: 8, cursor: 'grab', touchAction: 'none', background: 'repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 50% / 16px 16px' }}
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
              <input type="range" min={1} max={4} step={0.05} aria-label="zoom" value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="tb-v2-range" />
              <span className="tb-v2-range-val">{zoom.toFixed(2)}x</span>
            </div>
            <div className="tb-v2-range-row">
              <span className="tb-v2-tool-label" style={{ minWidth: 90 }}>Brightness</span>
              <input type="range" min={50} max={150} aria-label="brightness" value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} className="tb-v2-range" />
              <span className="tb-v2-range-val">{brightness}%</span>
            </div>
            <div className="tb-v2-range-row">
              <span className="tb-v2-tool-label" style={{ minWidth: 90 }}>Contrast</span>
              <input type="range" min={50} max={150} aria-label="contrast" value={contrast} onChange={(e) => setContrast(Number(e.target.value))} className="tb-v2-range" />
              <span className="tb-v2-range-val">{contrast}%</span>
            </div>
            <div className="tb-v2-range-row">
              <span className="tb-v2-tool-label" style={{ minWidth: 90 }}>Saturation</span>
              <input type="range" min={0} max={200} aria-label="saturation" value={saturation} onChange={(e) => setSaturation(Number(e.target.value))} className="tb-v2-range" />
              <span className="tb-v2-range-val">{saturation}%</span>
            </div>
            <div className="tb-v2-range-row">
              <span className="tb-v2-tool-label" style={{ minWidth: 90 }}>Output Size</span>
              <input type="range" min={128} max={1024} step={64} aria-label="outputSize" value={outputSize} onChange={(e) => setOutputSize(Number(e.target.value))} className="tb-v2-range" />
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
                onClick={clear}
                className="tb-v2-btn"
              >
                Choose New Photo
              </button>
            </div>
          </div>
        )}
        {error && <div className="tb-v2-banner tb-v2-banner-err" style={{ marginTop: 12 }}>{error}</div>}
        <input aria-label="Upload image" ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
      </div>
    </div>
  );
}
