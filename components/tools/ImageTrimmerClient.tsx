'use client';

import { useState, useRef, useCallback } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { FileSizeError, UpgradeNotice } from '@/components/FileSizeGuard';
import { convertHeicIfNeeded } from '@/lib/heic';

interface TrimBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

function colorDistance(
  data: Uint8ClampedArray,
  i: number,
  bg: { r: number; g: number; b: number; a: number }
): number {
  const dr = data[i] - bg.r;
  const dg = data[i + 1] - bg.g;
  const db = data[i + 2] - bg.b;
  const da = data[i + 3] - bg.a;
  return Math.sqrt(dr * dr + dg * dg + db * db + da * da);
}

function computeTrimBox(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  tolerance: number
): TrimBox | null {
  const { data } = ctx.getImageData(0, 0, width, height);
  const bg = { r: data[0], g: data[1], b: data[2], a: data[3] };
  const rowIsBackground = (y: number) => {
    for (let x = 0; x < width; x++) {
      if (colorDistance(data, (y * width + x) * 4, bg) > tolerance) return false;
    }
    return true;
  };
  const colIsBackground = (x: number) => {
    for (let y = 0; y < height; y++) {
      if (colorDistance(data, (y * width + x) * 4, bg) > tolerance) return false;
    }
    return true;
  };

  let top = 0;
  while (top < height && rowIsBackground(top)) top++;
  if (top === height) return null; // whole image matches the background

  let bottom = height - 1;
  while (bottom > top && rowIsBackground(bottom)) bottom--;

  let left = 0;
  while (left < width && colIsBackground(left)) left++;

  let right = width - 1;
  while (right > left && colIsBackground(right)) right--;

  const w = right - left + 1;
  const h = bottom - top + 1;
  if (w === width && h === height) return null; // nothing to trim

  return { x: left, y: top, w, h };
}

export default function ImageTrimmerClient() {
  const [image, setImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [tolerance, setTolerance] = useState(24);
  const [trimBox, setTrimBox] = useState<TrimBox | null>(null);
  const [trimmedUrl, setTrimmedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'nothing-to-trim'>('idle');
  const [isConvertingHeic, setIsConvertingHeic] = useState(false);
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
      setTrimmedUrl(null);
      setTrimBox(null);
      setStatus('idle');
      const img = new Image();
      img.onload = () => {
        imgRef.current = img;
      };
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

  const trimImage = useCallback(() => {
    const img = imgRef.current;
    if (!img) return;
    setIsProcessing(true);

    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsProcessing(false);
      return;
    }
    ctx.drawImage(img, 0, 0);

    const box = computeTrimBox(ctx, canvas.width, canvas.height, tolerance);
    if (!box) {
      setTrimBox(null);
      setTrimmedUrl(null);
      setStatus('nothing-to-trim');
      setIsProcessing(false);
      return;
    }

    const out = document.createElement('canvas');
    out.width = box.w;
    out.height = box.h;
    const outCtx = out.getContext('2d');
    if (!outCtx) {
      setIsProcessing(false);
      return;
    }
    outCtx.drawImage(img, box.x, box.y, box.w, box.h, 0, 0, box.w, box.h);

    setTrimBox(box);
    setTrimmedUrl(out.toDataURL('image/png'));
    setStatus('idle');
    setIsProcessing(false);
  }, [tolerance]);

  const downloadTrim = () => {
    if (!trimmedUrl) return;
    const link = document.createElement('a');
    link.download = 'trimmed-image.png';
    link.href = trimmedUrl;
    link.click();
  };

  const reset = () => {
    setImage(null);
    setSelectedFile(null);
    setTrimmedUrl(null);
    setTrimBox(null);
    setStatus('idle');
    imgRef.current = null;
  };

  return (
    <div className="tb-v2-section" style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '16px 20px' }}>
      {!image ? (
        <div
          className="border-2 border-dashed border-gray-700 hover:border-red-600 rounded-xl p-12 text-center transition-colors cursor-pointer"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => document.getElementById('trim-image-input')?.click()}
        >
          <span className="text-3xl mb-3 block">✂️</span>
          {isConvertingHeic ? (
            <p className="text-gray-400 text-sm">Converting HEIC photo...</p>
          ) : (
            <>
              <p className="text-gray-400 text-sm">Drag & drop an image, or click to browse</p>
              <p className="text-gray-600 text-xs mt-1">PNG, JPG, WebP, GIF, HEIC</p>
            </>
          )}
          <input
            id="trim-image-input"
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
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Tolerance: {tolerance}</label>
            <input
              type="range"
              min="0"
              max="128"
              value={tolerance}
              onChange={(e) => setTolerance(Number(e.target.value))}
              className="tb-v2-range"
            />
          </div>
          <p className="text-xs text-gray-500">
            Trim samples the top-left pixel as the border color, then removes any solid rows/columns of that
            color from the edges. Raise the tolerance for borders with slight noise or compression artifacts.
          </p>

          <div>
            <p className="tb-v2-tool-label" style={{ marginBottom: 8 }}>Original</p>
            <img src={image} alt="Original" className="max-w-full rounded-lg" />
          </div>

          <div className="tb-v2-mode-tabs">
            <button
              onClick={trimImage}
              disabled={isProcessing || isOversized}
              className="bg-red-600 hover:bg-red-500 text-black font-medium px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
              title={isOversized ? 'File size exceeds your plan limit' : ''}
            >
              {isProcessing ? 'Trimming...' : isOversized ? 'File Too Large' : 'Trim Image'}
            </button>
            <button
              onClick={reset}
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Choose New Image
            </button>
          </div>

          {status === 'nothing-to-trim' && (
            <p className="text-xs text-amber-500">
              No uniform border found at this tolerance, try raising it, or the image may already be trimmed.
            </p>
          )}

          {trimmedUrl && trimBox && (
            <div className="mt-4">
              <p className="tb-v2-tool-label" style={{ marginBottom: 8 }}>
                Trimmed ({trimBox.w} × {trimBox.h}px)
              </p>
              <img src={trimmedUrl} alt="Trimmed" className="max-w-full rounded-lg" />
              <button
                onClick={downloadTrim}
                className="bg-red-600 hover:bg-red-500 text-black font-medium px-4 py-2 rounded-lg text-sm transition-colors mt-2"
              >
                Download PNG
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
