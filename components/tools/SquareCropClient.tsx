'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { FileSizeError, UpgradeNotice } from '@/components/FileSizeGuard';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const SQUARE_PRESETS = [
  { label: 'Instagram Post', size: 1080, description: '1080×1080' },
  { label: 'Instagram Profile', size: 320, description: '320×320' },
  { label: 'Facebook Post', size: 1200, description: '1200×1200' },
  { label: 'Twitter/X Post', size: 1024, description: '1024×1024' },
  { label: 'LinkedIn Post', size: 1200, description: '1200×1200' },
  { label: 'Pinterest Pin', size: 1000, description: '1000×1000' },
  { label: 'Custom', size: 0, description: 'Any size' },
];

export default function SquareCropClient() {
  const [image, setImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preset, setPreset] = useState(SQUARE_PRESETS[0]);
  const [customSize, setCustomSize] = useState(1024);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [cropPos, setCropPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const [imgLoaded, setImgLoaded] = useState(false);
  const [sampleError, setSampleError] = useState(false);
  const { tier } = useSubscription();
  const maxSizeMB = tier === 'free' ? 5 : tier === 'starter' ? 10 : tier === 'ultra' ? 100 : tier === 'max' ? 500 : 5;

  const isOversized = selectedFile != null && selectedFile.size / (1024 * 1024) > maxSizeMB;
  const outputSize = preset.size || Math.min(4000, Math.max(50, Number.isFinite(customSize) ? customSize : 50));

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    const cropSide = Math.min(img.width, img.height);
    const cropX = Math.max(0, Math.min(cropPos.x, img.width - cropSide));
    const cropY = Math.max(0, Math.min(cropPos.y, img.height - cropSide));

    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, 0, canvas.width, cropY);
    ctx.fillRect(0, cropY + cropSide, canvas.width, canvas.height - cropY - cropSide);
    ctx.fillRect(0, cropY, cropX, cropSide);
    ctx.fillRect(cropX + cropSide, cropY, canvas.width - cropX - cropSide, cropSide);

    // Crop border
    ctx.strokeStyle = '#DC2626';
    ctx.lineWidth = 2;
    ctx.strokeRect(cropX, cropY, cropSide, cropSide);

    // Corner markers
    const cornerSize = 8;
    ctx.strokeStyle = '#DC2626';
    ctx.lineWidth = 3;
    // Top-left
    ctx.beginPath();
    ctx.moveTo(cropX, cropY + cornerSize); ctx.lineTo(cropX, cropY); ctx.lineTo(cropX + cornerSize, cropY);
    ctx.stroke();
    // Top-right
    ctx.beginPath();
    ctx.moveTo(cropX + cropSide - cornerSize, cropY); ctx.lineTo(cropX + cropSide, cropY); ctx.lineTo(cropX + cropSide, cropY + cornerSize);
    ctx.stroke();
    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(cropX, cropY + cropSide - cornerSize); ctx.lineTo(cropX, cropY + cropSide); ctx.lineTo(cropX + cornerSize, cropY + cropSide);
    ctx.stroke();
    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(cropX + cropSide - cornerSize, cropY + cropSide); ctx.lineTo(cropX + cropSide, cropY + cropSide); ctx.lineTo(cropX + cropSide, cropY + cropSide - cornerSize);
    ctx.stroke();
  }, [cropPos]);

  const drawOutputPreview = useCallback(() => {
    const canvas = previewRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cropSide = Math.min(img.width, img.height);
    canvas.width = outputSize;
    canvas.height = outputSize;
    ctx.clearRect(0, 0, outputSize, outputSize);
    ctx.drawImage(img, cropPos.x, cropPos.y, cropSide, cropSide, 0, 0, outputSize, outputSize);
  }, [cropPos, outputSize]);

  useEffect(() => {
    if (image && imgRef.current) {
      drawCanvas();
      drawOutputPreview();
    }
  }, [drawCanvas, drawOutputPreview, image]);

  const applyLoadedImage = (img: HTMLImageElement, src: string) => {
    imgRef.current = img;
    setCropPos({
      x: Math.max(0, (img.width - Math.min(img.width, img.height)) / 2),
      y: Math.max(0, (img.height - Math.min(img.width, img.height)) / 2),
    });
    setImgLoaded(true);
    setSampleError(false);
    setImage(src);
  };

  const loadImage = (file: File) => {
    setSelectedFile(file);
    setImgLoaded(false);
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      const img = new Image();
      img.onload = () => applyLoadedImage(img, src);
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const loadSample = () => {
    setSelectedFile(null);
    setImgLoaded(false);
    const img = new Image();
    img.onload = () => applyLoadedImage(img, '/samples/tool-sample.png');
    img.onerror = () => setSampleError(true);
    img.src = '/samples/tool-sample.png';
  };

  const handlePresetChange = (p: typeof SQUARE_PRESETS[0]) => {
    setPreset(p);
  };

  const pointerToImage = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return null;
    const bounds = canvas.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return null;
    return {
      x: (e.clientX - bounds.left) * (img.width / bounds.width),
      y: (e.clientY - bounds.top) * (img.height / bounds.height),
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const pos = pointerToImage(e);
    if (!pos || !imgRef.current) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragOffsetRef.current = { x: pos.x - cropPos.x, y: pos.y - cropPos.y };
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDragging || !imgRef.current) return;
    const pos = pointerToImage(e);
    if (!pos) return;
    const cropSide = Math.min(imgRef.current.width, imgRef.current.height);
    const newX = Math.max(0, Math.min(pos.x - dragOffsetRef.current.x, imgRef.current.width - cropSide));
    const newY = Math.max(0, Math.min(pos.y - dragOffsetRef.current.y, imgRef.current.height - cropSide));
    setCropPos({ x: newX, y: newY });
  };

  const handlePointerUp = () => setIsDragging(false);

  const downloadCrop = () => {
    if (!imgRef.current || !imgLoaded) return;
    const img = imgRef.current;
    const cropSide = Math.min(img.width, img.height);
    const canvas = document.createElement('canvas');
    canvas.width = outputSize;
    canvas.height = outputSize;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(img, cropPos.x, cropPos.y, cropSide, cropSide, 0, 0, outputSize, outputSize);

    const link = document.createElement('a');
    link.download = `square-crop-${outputSize}x${outputSize}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const reset = () => {
    setImage(null);
    setSelectedFile(null);
    setPreset(SQUARE_PRESETS[0]);
    setCustomSize(1024);
    setCropPos({ x: 0, y: 0 });
    setImgLoaded(false);
    setSampleError(false);
    imgRef.current = null;
    if (canvasRef.current) canvasRef.current.width = 0;
    if (previewRef.current) previewRef.current.width = 0;
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head" style={{ borderBottom: '1px solid var(--line)' }}>
        <span className="tb-v2-tool-label">Square Crop</span>
        <ToolExampleClearActions
          onExample={loadSample}
          onClear={reset}
          canClear={Boolean(image || selectedFile || sampleError)}
        />
      </div>

      <div className="tb-v2-section" style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '20px' }}>
      {/* Presets */}
      <div>
        <p className="tb-v2-tool-label" style={{ marginBottom: 8 }}>Output size</p>
        <div className="tb-v2-mode-tabs" role="group" aria-label="Output size">
        {SQUARE_PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => handlePresetChange(p)}
            className={`tb-v2-mode-tab ${preset.label === p.label ? 'on' : ''}`}
            aria-pressed={preset.label === p.label}
          >
            {p.label}
          </button>
        ))}
        </div>
      </div>

      {preset.label === 'Custom' && (
        <label className="flex items-center gap-3 text-sm">
          <span className="tb-v2-tool-label">Size (px)</span>
          <input
            type="number"
            min={50}
            max={4000}
            value={customSize}
            onChange={(e) => setCustomSize(Number(e.target.value))}
            className="tb-v2-input w-28"
          />
          <span className="text-xs text-gray-500">{outputSize} × {outputSize}px</span>
        </label>
      )}

      <p className="text-xs text-gray-500" style={{ margin: 0 }}>
        Export: <span className="text-[#DC2626] font-medium">{outputSize} × {outputSize}px</span> - drag the source crop to reposition it
      </p>

      {/* Upload zone */}
      {!image ? (
        <div
          className="border-2 border-dashed border-gray-700 hover:border-[#DC2626] rounded-xl p-12 text-center transition-colors cursor-pointer"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type.startsWith('image/')) loadImage(f); }}
          onClick={() => document.getElementById('square-crop-input')?.click()}
        >
          <span className="text-3xl mb-3 block">✂️</span>
          <p className="text-gray-400 text-sm">Drag & drop an image, or click to browse</p>
          <p className="text-gray-600 text-xs mt-1">PNG, JPG, WebP, GIF • Max {maxSizeMB}MB</p>
          {sampleError && <p className="text-xs text-amber-500 mt-2">Couldn&apos;t load the sample image, try again.</p>}
          <input
            id="square-crop-input"
            type="file"
            accept="image/*"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) loadImage(f); }}
            className="hidden"
            aria-label="Upload image"
          />
          <UpgradeNotice tier={tier} />
          <FileSizeError file={selectedFile} maxSizeMB={maxSizeMB} />
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="tb-v2-tool-label" style={{ marginBottom: 8 }}>Crop area</p>
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-[50vh] w-auto h-auto mx-auto block rounded-lg cursor-grab active:cursor-grabbing touch-none"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
              />
            </div>
            <div>
              <p className="tb-v2-tool-label" style={{ marginBottom: 8 }}>Export preview</p>
              <canvas
                ref={previewRef}
                aria-label={`Export preview at ${outputSize} by ${outputSize} pixels`}
                className="max-w-full max-h-[50vh] w-auto h-auto mx-auto block rounded-lg"
              />
              <p className="mt-2 text-center text-xs text-gray-500">{outputSize} × {outputSize}px PNG</p>
            </div>
          </div>
          <div className="tb-v2-mode-tabs">
            <button
              type="button"
              onClick={downloadCrop}
              disabled={!imgLoaded || isOversized}
              className="bg-[#DC2626] hover:bg-[#B91C1C] text-black font-semibold px-5 py-2 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isOversized ? 'File Too Large' : `Download ${outputSize}×${outputSize} PNG`}
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
