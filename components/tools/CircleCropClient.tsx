'use client';

import { useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { FileSizeError, UpgradeNotice } from '@/components/FileSizeGuard';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

type OutputBg = 'transparent' | 'white' | 'blur';
export type CropPosition = { x: number; y: number };

export function clampCropPosition(imageWidth: number, imageHeight: number, cropSize: number, position: CropPosition): CropPosition {
  return {
    x: Math.min(Math.max(position.x, 0), Math.max(0, imageWidth - cropSize)),
    y: Math.min(Math.max(position.y, 0), Math.max(0, imageHeight - cropSize)),
  };
}

function centerCropPosition(imageWidth: number, imageHeight: number, cropSize: number): CropPosition {
  return clampCropPosition(imageWidth, imageHeight, cropSize, { x: (imageWidth - cropSize) / 2, y: (imageHeight - cropSize) / 2 });
}

function renderCrop(canvas: HTMLCanvasElement, img: HTMLImageElement, bgType: OutputBg, outputSize: number, cropPosition: CropPosition): string {
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  const cropSize = Math.min(img.width, img.height);
  canvas.width = outputSize;
  canvas.height = outputSize;
  ctx.clearRect(0, 0, outputSize, outputSize);
  if (bgType === 'white') {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, outputSize, outputSize);
  } else if (bgType === 'blur') {
    const blurCanvas = document.createElement('canvas');
    const blurCtx = blurCanvas.getContext('2d');
    if (blurCtx) {
      blurCanvas.width = outputSize;
      blurCanvas.height = outputSize;
      blurCtx.filter = 'blur(20px)';
      blurCtx.drawImage(img, cropPosition.x, cropPosition.y, cropSize, cropSize, 0, 0, outputSize, outputSize);
      ctx.drawImage(blurCanvas, 0, 0);
    }
  }
  ctx.save();
  ctx.beginPath();
  ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2 - 1, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(img, cropPosition.x, cropPosition.y, cropSize, cropSize, 0, 0, outputSize, outputSize);
  ctx.restore();
  return canvas.toDataURL('image/png');
}

export function drawEditor(canvas: HTMLCanvasElement, img: HTMLImageElement, cropPosition: CropPosition): void {
  const scale = Math.min(1, 720 / Math.max(img.width, img.height));
  canvas.width = Math.max(1, Math.round(img.width * scale));
  canvas.height = Math.max(1, Math.round(img.height * scale));
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const cropSize = Math.min(img.width, img.height) * scale;
  const cropX = cropPosition.x * scale;
  const cropY = cropPosition.y * scale;
  const centerX = cropX + cropSize / 2;
  const centerY = cropY + cropSize / 2;
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, .5)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(centerX, centerY, cropSize / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, cropSize / 2, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  ctx.restore();
  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, Math.max(1, cropSize / 2 - 1), 0, Math.PI * 2);
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 5;
  ctx.stroke();
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2;
  ctx.stroke();
  const markerRadius = Math.max(4, Math.min(8, cropSize * .018));
  ctx.fillStyle = '#ef4444';
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  for (const [x, y] of [[centerX, cropY], [cropX + cropSize, centerY], [centerX, cropY + cropSize], [cropX, centerY]]) {
    ctx.beginPath();
    ctx.arc(x, y, markerRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
}

export default function CircleCropClient() {
  const [image, setImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [bgType, setBgType] = useState<OutputBg>('transparent');
  const [outputSize, setOutputSize] = useState(512);
  const [cropPosition, setCropPosition] = useState<CropPosition>({ x: 0, y: 0 });
  const [previewCanvas, setPreviewCanvas] = useState<string | null>(null);
  const [sampleError, setSampleError] = useState(false);
  const editorCanvasRef = useRef<HTMLCanvasElement>(null);
  const outputCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const dragRef = useRef<{ pointerId: number; startX: number; startY: number; crop: CropPosition } | null>(null);
  const { tier } = useSubscription();
  const maxSizeMB = tier === 'free' ? 5 : tier === 'starter' ? 10 : tier === 'ultra' ? 100 : tier === 'max' ? 500 : 5;
  const isOversized = selectedFile != null && selectedFile.size / (1024 * 1024) > maxSizeMB;

  useEffect(() => {
    if (image && imgRef.current && editorCanvasRef.current) drawEditor(editorCanvasRef.current, imgRef.current, cropPosition);
  }, [image, cropPosition]);

  useEffect(() => {
    if (image && imgRef.current && outputCanvasRef.current) setPreviewCanvas(renderCrop(outputCanvasRef.current, imgRef.current, bgType, outputSize, cropPosition));
  }, [image, cropPosition, bgType, outputSize]);

  const applyLoadedImage = (img: HTMLImageElement, src: string) => {
    imgRef.current = img;
    setCropPosition(centerCropPosition(img.width, img.height, Math.min(img.width, img.height)));
    setPreviewCanvas(null);
    setSampleError(false);
    setImage(src);
  };
  const loadImage = (file: File) => {
    setSelectedFile(file);
    setSampleError(false);
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      const img = new Image();
      img.onload = () => applyLoadedImage(img, src);
      img.onerror = () => setSampleError(true);
      img.src = src;
    };
    reader.onerror = () => setSampleError(true);
    reader.readAsDataURL(file);
  };
  const loadSample = () => {
    setSelectedFile(null);
    const img = new Image();
    img.onload = () => applyLoadedImage(img, '/samples/tool-sample.png');
    img.onerror = () => setSampleError(true);
    img.src = '/samples/tool-sample.png';
  };
  const handleEditorPointerDown = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const img = imgRef.current;
    const canvas = editorCanvasRef.current;
    if (!img || !canvas) return;
    const rect = canvas.getBoundingClientRect();
    const displayScale = canvas.width / rect.width;
    const x = (event.clientX - rect.left) * displayScale;
    const y = (event.clientY - rect.top) * displayScale;
    const imageScale = canvas.width / img.width;
    const cropSize = Math.min(img.width, img.height) * imageScale;
    const cropX = cropPosition.x * imageScale;
    const cropY = cropPosition.y * imageScale;
    const dx = x - cropX - cropSize / 2;
    const dy = y - cropY - cropSize / 2;
    if (dx * dx + dy * dy > (cropSize / 2) ** 2) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, crop: cropPosition };
  };
  const handleEditorPointerMove = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const img = imgRef.current;
    const canvas = editorCanvasRef.current;
    const drag = dragRef.current;
    if (!img || !canvas || !drag || drag.pointerId !== event.pointerId) return;
    const rect = canvas.getBoundingClientRect();
    const sourceScale = img.width / rect.width;
    const cropSize = Math.min(img.width, img.height);
    setCropPosition(clampCropPosition(img.width, img.height, cropSize, { x: drag.crop.x + (event.clientX - drag.startX) * sourceScale, y: drag.crop.y + (event.clientY - drag.startY) * sourceScale }));
  };
  const finishEditorDrag = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    dragRef.current = null;
  };
  const downloadCrop = () => {
    const img = imgRef.current;
    if (!img || !previewCanvas) return;
    const canvas = document.createElement('canvas');
    const dataUrl = renderCrop(canvas, img, bgType, outputSize, cropPosition);
    const link = document.createElement('a');
    link.download = `circle-crop-${outputSize}.png`;
    link.href = dataUrl;
    link.click();
  };
  const reset = () => {
    setImage(null);
    setSelectedFile(null);
    setBgType('transparent');
    setOutputSize(512);
    setCropPosition({ x: 0, y: 0 });
    setPreviewCanvas(null);
    setSampleError(false);
    imgRef.current = null;
    dragRef.current = null;
    if (editorCanvasRef.current) editorCanvasRef.current.width = 0;
    if (outputCanvasRef.current) outputCanvasRef.current.width = 0;
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head" style={{ borderBottom: '1px solid var(--line)' }}>
        <span className="tb-v2-tool-label">Circle Crop</span>
        <ToolExampleClearActions onExample={loadSample} onClear={reset} canClear={Boolean(image || selectedFile || previewCanvas || sampleError)} />
      </div>
      <div className="tb-v2-section" style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '20px' }}>
        {!image ? (
          <div className="border-2 border-dashed border-gray-700 hover:border-red-600 rounded-xl p-12 text-center transition-colors cursor-pointer" onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); const file = e.dataTransfer.files[0]; if (file?.type.startsWith('image/')) loadImage(file); }} onClick={() => document.getElementById('circle-crop-input')?.click()}>
            <span className="text-3xl mb-3 block">⭕</span>
            <p className="text-gray-400 text-sm">Drag &amp; drop an image, or click to browse</p>
            <p className="text-gray-600 text-xs mt-1">PNG, JPG, WebP, GIF • Max {maxSizeMB}MB</p>
            {sampleError && <p className="text-xs text-amber-500 mt-2">Couldn&apos;t load the sample image, try again.</p>}
            <input id="circle-crop-input" type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) loadImage(file); }} className="hidden" aria-label="Upload image" />
            <UpgradeNotice tier={tier} />
            <FileSizeError file={selectedFile} maxSizeMB={maxSizeMB} />
          </div>
        ) : (
          <>
            <div>
              <p className="tb-v2-tool-label" style={{ marginBottom: 8 }}>Crop area</p>
              <div className="rounded-xl overflow-hidden" style={{ background: '#111827' }}>
                <canvas ref={editorCanvasRef} className="block w-full h-auto" style={{ maxHeight: 480, objectFit: 'contain', touchAction: 'none', cursor: 'grab' }} onPointerDown={handleEditorPointerDown} onPointerMove={handleEditorPointerMove} onPointerUp={finishEditorDrag} onPointerCancel={finishEditorDrag} aria-label="Circular crop editor. Drag the circle to reposition the crop." />
              </div>
              <p className="text-xs text-gray-500" style={{ margin: '8px 0 0' }}>Drag the circle to reposition the crop.</p>
            </div>
            <div>
              <p className="tb-v2-tool-label" style={{ marginBottom: 8 }}>Output preview</p>
              <div className="flex justify-center rounded-xl p-3" style={{ backgroundImage: 'repeating-conic-gradient(#e5e7eb 0% 25%, #f9fafb 0% 50%)', backgroundSize: '16px 16px' }}>
                <canvas ref={outputCanvasRef} className="hidden" aria-hidden="true" />
                {previewCanvas && <img src={previewCanvas} alt="Circular crop output preview" className="max-w-full max-h-64 rounded-lg object-contain" style={{ aspectRatio: `${outputSize}/${outputSize}` }} />}
              </div>
            </div>
            <div>
              <p className="tb-v2-tool-label" style={{ marginBottom: 8 }}>Background</p>
              <div className="tb-v2-mode-tabs" role="group" aria-label="Background">
                {(['transparent', 'white', 'blur'] as OutputBg[]).map((bg) => <button key={bg} type="button" onClick={() => setBgType(bg)} className={`tb-v2-mode-tab ${bgType === bg ? 'on' : ''}`} aria-pressed={bgType === bg}>{bg === 'transparent' ? 'Transparent' : bg[0].toUpperCase() + bg.slice(1)}</button>)}
              </div>
            </div>
            {bgType === 'blur' && <p className="text-xs text-gray-500" style={{ margin: 0 }}>Blurred version of your image as background.</p>}
            <label className="flex items-center gap-3"><span className="tb-v2-tool-label">Output size</span><input type="range" min={64} max={2048} step={64} value={outputSize} onChange={(e) => setOutputSize(Number(e.target.value))} className="tb-v2-range flex-1" /><output className="text-sm font-semibold tabular-nums">{outputSize}px</output></label>
            <div className="flex justify-end"><button type="button" onClick={downloadCrop} disabled={!previewCanvas || isOversized} className="tb-v2-btn tb-v2-btn-primary tb-v2-btn-lg disabled:opacity-50">{isOversized ? 'File Too Large' : `Download ${outputSize}×${outputSize} PNG`}</button></div>
          </>
        )}
      </div>
    </div>
  );
}
