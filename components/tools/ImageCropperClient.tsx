'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { FileSizeError, UpgradeNotice } from '@/components/FileSizeGuard';
import { convertHeicIfNeeded } from '@/lib/heic';
import { fitAspectCrop, isCommittedDrag, type CropRect } from '@/lib/image-crop';

const PRESETS = [
  { label: '1:1 Square', ratio: 1 },
  { label: '16:9', ratio: 16 / 9 },
  { label: '4:3', ratio: 4 / 3 },
  { label: '3:2', ratio: 3 / 2 },
  { label: '2:3 Portrait', ratio: 2 / 3 },
  { label: 'Passport (35mm)', ratio: 35 / 45 },
];

const EMPTY_CROP: CropRect = { x: 0, y: 0, w: 0, h: 0 };

export default function ImageCropperClient() {
  const [image, setImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preset, setPreset] = useState(PRESETS[0]);
  const [cropRect, setCropRect] = useState<CropRect>(EMPTY_CROP);
  const [isConvertingHeic, setIsConvertingHeic] = useState(false);
  const [sampleError, setSampleError] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const presetRef = useRef(preset);
  const cropRectRef = useRef(cropRect);
  const isDraggingRef = useRef(false);
  const dragCommittedRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const dragOriginClientRef = useRef({ x: 0, y: 0 });
  const cropBeforeDragRef = useRef<CropRect>(EMPTY_CROP);
  // Which direction each axis currently extends from dragStart. Only flips once a
  // real (past-deadzone) movement happens on that axis - otherwise near-zero mouse
  // jitter on the non-dominant axis would make the box teleport to the other side.
  const dragDirRef = useRef({ x: 1, y: 1 });
  const { tier } = useSubscription();
  const maxSizeMB = tier === 'free' ? 5 : tier === 'starter' ? 10 : tier === 'ultra' ? 100 : tier === 'max' ? 500 : 5;

  presetRef.current = preset;
  cropRectRef.current = cropRect;

  const isOversized = selectedFile != null && selectedFile.size / (1024 * 1024) > maxSizeMB;

  const drawCanvas = useCallback((img: HTMLImageElement, rect: CropRect) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    const { x, y, w, h } = rect;
    if (w > 0 && h > 0) {
      ctx.fillStyle = 'rgba(0,0,0,0.55)';
      ctx.fillRect(0, 0, canvas.width, y);
      ctx.fillRect(0, y + h, canvas.width, canvas.height - y - h);
      ctx.fillRect(0, y, x, h);
      ctx.fillRect(x + w, y, canvas.width - x - w, h);
      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = Math.max(2, Math.round(Math.min(img.width, img.height) / 280));
      ctx.strokeRect(x + 1, y + 1, Math.max(0, w - 2), Math.max(0, h - 2));

      const corner = Math.max(12, Math.round(Math.min(w, h) / 12));
      ctx.lineWidth = Math.max(3, Math.round(Math.min(img.width, img.height) / 200));
      ctx.beginPath();
      ctx.moveTo(x, y + corner); ctx.lineTo(x, y); ctx.lineTo(x + corner, y);
      ctx.moveTo(x + w - corner, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + corner);
      ctx.moveTo(x, y + h - corner); ctx.lineTo(x, y + h); ctx.lineTo(x + corner, y + h);
      ctx.moveTo(x + w - corner, y + h); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w, y + h - corner);
      ctx.stroke();
    }
  }, []);

  // Draw after the canvas mounts. Calling drawCanvas from FileReader/Image onload
  // races React's commit — the <canvas> only exists once `image` is set.
  useEffect(() => {
    if (!image || !imgRef.current) return;
    drawCanvas(imgRef.current, cropRect);
  }, [image, cropRect, drawCanvas]);

  const applyLoadedImage = (img: HTMLImageElement, src: string) => {
    imgRef.current = img;
    setCropRect(fitAspectCrop(img.width, img.height, presetRef.current.ratio));
    setSampleError(false);
    setImage(src);
  };

  const loadImage = async (file: File) => {
    setIsConvertingHeic(true);
    const decodable = await convertHeicIfNeeded(file);
    setIsConvertingHeic(false);

    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      const img = new Image();
      img.onload = () => applyLoadedImage(img, src);
      img.src = src;
    };
    reader.readAsDataURL(decodable);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      loadImage(file);
    }
    e.target.value = '';
  };

  const loadSample = (e: React.MouseEvent) => {
    e.stopPropagation();
    const src = '/samples/tool-sample.png';
    setSelectedFile(null);
    const img = new Image();
    img.onload = () => applyLoadedImage(img, src);
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

  const pointerToImage = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return null;
    const bounds = canvas.getBoundingClientRect();
    if (bounds.width === 0 || bounds.height === 0) return null;
    const scaleX = img.width / bounds.width;
    const scaleY = img.height / bounds.height;
    return {
      x: (e.clientX - bounds.left) * scaleX,
      y: (e.clientY - bounds.top) * scaleY,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!imgRef.current || !canvasRef.current) return;
    const pos = pointerToImage(e);
    if (!pos) return;
    e.currentTarget.setPointerCapture(e.pointerId);

    dragDirRef.current = {
      x: pos.x < imgRef.current.width / 2 ? 1 : -1,
      y: pos.y < imgRef.current.height / 2 ? 1 : -1,
    };
    isDraggingRef.current = true;
    dragCommittedRef.current = false;
    dragStartRef.current = pos;
    dragOriginClientRef.current = { x: e.clientX, y: e.clientY };
    cropBeforeDragRef.current = cropRectRef.current;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current || !imgRef.current) return;
    if (!dragCommittedRef.current) {
      if (!isCommittedDrag(e.clientX - dragOriginClientRef.current.x, e.clientY - dragOriginClientRef.current.y)) {
        return;
      }
      dragCommittedRef.current = true;
    }
    const pos = pointerToImage(e);
    if (!pos) return;

    const dx = pos.x - dragStartRef.current.x;
    const dy = pos.y - dragStartRef.current.y;
    const rawW = Math.abs(dx);
    const rawH = Math.abs(dy);

    // Only commit a new direction once the drag has moved a real amount on that
    // axis - a few px of hand tremor near zero shouldn't flip which side grows.
    const DIR_DEADZONE = 3;
    if (rawW > DIR_DEADZONE) dragDirRef.current.x = dx >= 0 ? 1 : -1;
    if (rawH > DIR_DEADZONE) dragDirRef.current.y = dy >= 0 ? 1 : -1;
    const dirX = dragDirRef.current.x;
    const dirY = dragDirRef.current.y;

    // Constrain the drag to the selected aspect ratio, tracking whichever axis
    // the user is dragging further along (ratio-adjusted), like most cropping UIs.
    let w: number;
    let h: number;
    if (rawW / presetRef.current.ratio > rawH) {
      w = rawW;
      h = w / presetRef.current.ratio;
    } else {
      h = rawH;
      w = h * presetRef.current.ratio;
    }

    // Clamp to the available space in the drag direction, scaling both dimensions
    // by the same factor so the ratio stays exact even past the image edge.
    const maxW = dirX >= 0 ? imgRef.current.width - dragStartRef.current.x : dragStartRef.current.x;
    const maxH = dirY >= 0 ? imgRef.current.height - dragStartRef.current.y : dragStartRef.current.y;
    const scale = Math.min(1, maxW / w, maxH / h);
    w *= scale;
    h *= scale;

    const newX = dirX >= 0 ? dragStartRef.current.x : dragStartRef.current.x - w;
    const newY = dirY >= 0 ? dragStartRef.current.y : dragStartRef.current.y - h;

    const newRect = { x: Math.round(newX), y: Math.round(newY), w: Math.round(w), h: Math.round(h) };
    setCropRect(newRect);
    drawCanvas(imgRef.current, newRect);
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    if (dragCommittedRef.current) return;
    dragCommittedRef.current = false;
    if (cropBeforeDragRef.current.w > 0) {
      setCropRect(cropBeforeDragRef.current);
      return;
    }
    if (imgRef.current) {
      setCropRect(fitAspectCrop(imgRef.current.width, imgRef.current.height, presetRef.current.ratio));
    }
  };

  const selectPreset = (label: string, ratio: number) => {
    setPreset({ label, ratio });
    if (!imgRef.current) return;
    setCropRect(fitAspectCrop(imgRef.current.width, imgRef.current.height, ratio));
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

  const resetImage = () => {
    setImage(null);
    setSelectedFile(null);
    setCropRect(EMPTY_CROP);
    setSampleError(false);
    imgRef.current = null;
    if (fileInputRef.current) fileInputRef.current.value = '';
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
                onChange={() => selectPreset(label, ratio)}
                className="w-4 h-4 accent-red-600"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <input
        ref={fileInputRef}
        id="image-input"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        aria-label="Upload image"
      />

      {!image ? (
        <div
          className="border-2 border-dashed border-gray-700 hover:border-red-600 rounded-xl p-12 text-center transition-colors cursor-pointer"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
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
          <UpgradeNotice tier={tier} />
          <FileSizeError file={selectedFile} maxSizeMB={maxSizeMB} />
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-gray-500">
            {preset.label} crop is ready — drag on the image to choose a different area
          </p>
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
              onClick={resetImage}
              className="tb-v2-btn tb-v2-btn-ghost tb-v2-btn-lg"
            >
              Choose New Image
            </button>
          </div>
          <canvas
            ref={canvasRef}
            className="max-w-full max-h-[50vh] w-auto h-auto mx-auto block rounded-lg cursor-crosshair touch-none"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          />
          {cropRect.w > 0 && (
            <p className="text-xs text-gray-500">
              Crop area: {Math.round(cropRect.w)} × {Math.round(cropRect.h)}px
            </p>
          )}
        </div>
      )}
    </div>
  );
}
