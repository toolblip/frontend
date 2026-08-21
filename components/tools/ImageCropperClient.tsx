'use client';

import { useState, useRef, useCallback } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { FileSizeError, UpgradeNotice } from '@/components/FileSizeGuard';
import { convertHeicIfNeeded } from '@/lib/heic';

const PRESETS = [
  { label: '1:1 Square', ratio: 1 },
  { label: '16:9', ratio: 16 / 9 },
  { label: '4:3', ratio: 4 / 3 },
  { label: '3:2', ratio: 3 / 2 },
  { label: '2:3 Portrait', ratio: 2 / 3 },
  { label: 'Passport (35mm)', ratio: 35 / 45 },
];

export default function ImageCropperClient() {
  const [image, setImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preset, setPreset] = useState(PRESETS[0]);
  const [cropRect, setCropRect] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isConvertingHeic, setIsConvertingHeic] = useState(false);
  const [sampleError, setSampleError] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const { tier } = useSubscription();
  const maxSizeMB = tier === 'free' ? 5 : tier === 'starter' ? 10 : tier === 'ultra' ? 100 : tier === 'max' ? 500 : 5;

  const isOversized = selectedFile != null && selectedFile.size / (1024 * 1024) > maxSizeMB;

  const loadImage = async (file: File) => {
    setIsConvertingHeic(true);
    const decodable = await convertHeicIfNeeded(file);
    setIsConvertingHeic(false);

    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      setImage(src);
      const img = new Image();
      img.onload = () => {
        imgRef.current = img;
        drawCanvas(img, 0, 0, img.width, img.height);
      };
      img.src = src;
    };
    reader.readAsDataURL(decodable);
  };

  const drawCanvas = useCallback(
    (img: HTMLImageElement, x: number, y: number, w: number, h: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      // Draw crop overlay
      if (w > 0 && h > 0) {
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, canvas.width, y);
        ctx.fillRect(0, y + h, canvas.width, canvas.height - y - h);
        ctx.fillRect(0, y, x, h);
        ctx.fillRect(x + w, y, canvas.width - x - w, h);
        ctx.strokeStyle = '#EF4444';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, w, h);
      }
    },
    []
  );



  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setSelectedFile(file); loadImage(file); }
  };

  const loadSample = (e: React.MouseEvent) => {
    e.stopPropagation();
    const src = '/samples/tool-sample.png';
    setSelectedFile(null);
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      setSampleError(false);
      setImage(src);
      // Wait a frame so the canvas (only mounted once `image` is truthy) exists
      // by the time we draw into it - setImage's re-render hasn't landed yet here.
      requestAnimationFrame(() => drawCanvas(img, 0, 0, img.width, img.height));
    };
    img.onerror = () => setSampleError(true);
    img.src = src;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    // HEIC/HEIF files often report an empty or non-"image/" MIME type
    // (OS-dependent), so fall back to checking the extension too.
    if (file && (file.type.startsWith('image/') || /\.(heic|heif)$/i.test(file.name))) {
      setSelectedFile(file);
      loadImage(file);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!imgRef.current || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = imgRef.current.width / rect.width;
    const scaleY = imgRef.current.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    setIsDragging(true);
    setDragStart({ x, y });
    setCropRect({ x, y, w: 0, h: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !imgRef.current) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const scaleX = imgRef.current.width / rect.width;
    const scaleY = imgRef.current.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const dx = x - dragStart.x;
    const dy = y - dragStart.y;
    const rawW = Math.abs(dx);
    const rawH = Math.abs(dy);

    // Constrain the drag to the selected aspect ratio, tracking whichever axis
    // the user is dragging further along (ratio-adjusted), like most cropping UIs.
    let w: number;
    let h: number;
    if (rawW / preset.ratio > rawH) {
      w = rawW;
      h = w / preset.ratio;
    } else {
      h = rawH;
      w = h * preset.ratio;
    }

    // Clamp to the available space in the drag direction, scaling both dimensions
    // together so the ratio stays exact even when the drag would exceed the image.
    const maxW = dx >= 0 ? imgRef.current.width - dragStart.x : dragStart.x;
    const maxH = dy >= 0 ? imgRef.current.height - dragStart.y : dragStart.y;
    if (w > maxW) { h *= maxW / w; w = maxW; }
    if (h > maxH) { w *= maxH / h; h = maxH; }

    const newX = dx >= 0 ? dragStart.x : dragStart.x - w;
    const newY = dy >= 0 ? dragStart.y : dragStart.y - h;

    const newRect = { x: newX, y: newY, w, h };
    setCropRect(newRect);
    drawCanvas(imgRef.current, newRect.x, newRect.y, newRect.w, newRect.h);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const downloadCrop = () => {
    if (!imgRef.current || cropRect.w === 0) return;
    const canvas = document.createElement('canvas');
    canvas.width = cropRect.w;
    canvas.height = cropRect.h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(
      imgRef.current,
      cropRect.x, cropRect.y, cropRect.w, cropRect.h,
      0, 0, cropRect.w, cropRect.h
    );
    const link = document.createElement('a');
    link.download = 'cropped-image.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:16,padding:"16px 20px"}}>
      <div>
        <p className="tb-v2-tool-label" style={{ marginBottom: 8 }}>Aspect Ratio</p>
        <div className="flex flex-wrap gap-4">
          {PRESETS.map(({ label, ratio }) => (
            <label key={label} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="crop-preset"
                checked={preset.label === label}
                onChange={() => setPreset({ label, ratio })}
                className="w-4 h-4 accent-red-600"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {/* Upload zone */}
      {!image ? (
        <div
          className="border-2 border-dashed border-gray-700 hover:border-red-600 rounded-xl p-12 text-center transition-colors cursor-pointer"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => document.getElementById('image-input')?.click()}
        >
          <span className="text-3xl mb-3 block">🖼️</span>
          {isConvertingHeic ? (
            <p className="text-gray-400 text-sm">Converting HEIC photo...</p>
          ) : (
            <>
              <p className="text-gray-400 text-sm">Drag & drop an image, or click to browse</p>
              <p className="text-gray-600 text-xs mt-1">PNG, JPG, WebP, GIF, HEIC</p>
              <button
                onClick={loadSample}
                className="text-xs text-red-700 dark:text-red-400 underline hover:no-underline mt-3"
              >
                Or try a sample image
              </button>
              {sampleError && (
                <p className="text-xs text-amber-500 mt-2">Couldn&apos;t load the sample image, try again.</p>
              )}
            </>
          )}
          <input
            id="image-input"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            aria-label="Upload image"
          />
          <UpgradeNotice tier={tier} />
          <FileSizeError file={selectedFile} maxSizeMB={maxSizeMB} />
        </div>
      ) : (
        <div className="space-y-3">
          <canvas
            ref={canvasRef}
            className="w-full h-auto max-h-[70vh] object-contain rounded-lg cursor-crosshair"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
          <div className="flex gap-2">
            <button
              onClick={downloadCrop}
              className="tb-v2-btn tb-v2-btn-primary tb-v2-btn-lg flex-1 disabled:opacity-50"
              disabled={cropRect.w === 0 || isOversized}
              title={isOversized ? 'File size exceeds your plan limit' : ''}
            >
              {isOversized ? 'File Too Large' : 'Download Crop'}
            </button>
            <button
              onClick={() => { setImage(null); setCropRect({ x: 0, y: 0, w: 0, h: 0 }); setSampleError(false); }}
              className="tb-v2-btn tb-v2-btn-ghost tb-v2-btn-lg"
            >
              Choose New Image
            </button>
          </div>
          {cropRect.w > 0 && (
            <p className="text-xs text-gray-500">
              Crop area: {Math.round(cropRect.w)} × {Math.round(cropRect.h)}px - drag on the image to adjust
            </p>
          )}
        </div>
      )}
    </div>
  );
}
