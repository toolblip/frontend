'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { FileSizeError, UpgradeNotice } from '@/components/FileSizeGuard';
import { convertHeicIfNeeded } from '@/lib/heic';

interface RGB {
  r: number;
  g: number;
  b: number;
}

function rgbToHex({ r, g, b }: RGB): string {
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

function colorDistance(a: RGB, b: RGB): number {
  return Math.sqrt((a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2);
}

export default function EraseColorClient() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [workingUrl, setWorkingUrl] = useState<string | null>(null);
  const [pickedColor, setPickedColor] = useState<RGB | null>(null);
  const [tolerance, setTolerance] = useState(32);
  const [erasedCount, setErasedCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConvertingHeic, setIsConvertingHeic] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { tier } = useSubscription();
  const maxSizeMB = tier === 'free' ? 5 : tier === 'starter' ? 10 : tier === 'ultra' ? 100 : tier === 'max' ? 500 : 5;
  const isOversized = selectedFile != null && selectedFile.size / (1024 * 1024) > maxSizeMB;

  const drawToCanvas = (src: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      setWorkingUrl(canvas.toDataURL('image/png'));
    };
    img.src = src;
  };

  const loadImage = async (file: File) => {
    setIsConvertingHeic(true);
    const decodable = await convertHeicIfNeeded(file);
    setIsConvertingHeic(false);

    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      setOriginalImage(src);
      setPickedColor(null);
      setErasedCount(0);
    };
    reader.readAsDataURL(decodable);
  };

  // Runs after `originalImage` triggers the canvas to mount (a call made
  // synchronously from loadImage's reader.onload would race React's commit -
  // canvasRef.current is still null since the <canvas> only renders once
  // this component re-renders past the `!originalImage` upload-zone branch).
  useEffect(() => {
    if (originalImage) drawToCanvas(originalImage);
  }, [originalImage]);

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

  const pickColorAt = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);
    const [r, g, b] = ctx.getImageData(x, y, 1, 1).data;
    setPickedColor({ r, g, b });
  };

  const eraseColor = useCallback(() => {
    if (!pickedColor) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsProcessing(true);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let count = 0;
    for (let i = 0; i < data.length; i += 4) {
      const pixel = { r: data[i], g: data[i + 1], b: data[i + 2] };
      if (data[i + 3] > 0 && colorDistance(pixel, pickedColor) <= tolerance) {
        data[i + 3] = 0;
        count++;
      }
    }
    ctx.putImageData(imageData, 0, 0);
    setWorkingUrl(canvas.toDataURL('image/png'));
    setErasedCount((prev) => prev + count);
    setPickedColor(null);
    setIsProcessing(false);
  }, [pickedColor, tolerance]);

  const downloadResult = () => {
    if (!workingUrl) return;
    const link = document.createElement('a');
    link.download = 'color-erased-image.png';
    link.href = workingUrl;
    link.click();
  };

  const reset = () => {
    if (!originalImage) return;
    setPickedColor(null);
    setErasedCount(0);
    drawToCanvas(originalImage);
  };

  const clearAll = () => {
    setOriginalImage(null);
    setSelectedFile(null);
    setWorkingUrl(null);
    setPickedColor(null);
    setErasedCount(0);
  };

  return (
    <div className="tb-v2-section" style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '16px 20px' }}>
      {!originalImage ? (
        <div
          className="border-2 border-dashed border-gray-700 hover:border-red-600 rounded-xl p-12 text-center transition-colors cursor-pointer"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => document.getElementById('erase-color-input')?.click()}
        >
          <span className="text-3xl mb-3 block">🎨</span>
          {isConvertingHeic ? (
            <p className="text-gray-400 text-sm">Converting HEIC photo...</p>
          ) : (
            <>
              <p className="text-gray-400 text-sm">Drag & drop an image, or click to browse</p>
              <p className="text-gray-600 text-xs mt-1">PNG, JPG, WebP, GIF, HEIC</p>
            </>
          )}
          <input
            id="erase-color-input"
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
          <p className="text-sm text-gray-500">
            Click anywhere on the image to pick a color with the eyedropper, then erase every matching pixel.
            Repeat with a new color as many times as you need, each pass builds on the last.
          </p>

          <div>
            <p className="tb-v2-tool-label" style={{ marginBottom: 8 }}>Click to pick a color</p>
            <canvas
              ref={canvasRef}
              className="w-full h-auto max-h-[60vh] object-contain rounded-lg cursor-crosshair"
              style={{
                backgroundImage:
                  'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAdgAAAHYBTnsmCAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAABUSURBVDiNY/z//z8DJYCJgUIwaAzFMEoYRMVA4Y5LQNNLUMNA4TYowg1QLIMaB4rXIFYN0PQC1HhQ4oBEukE1LpT4IOqB2BgBAE0cFfVvYI0lAAAAAElFTkSuQmCC")',
                backgroundRepeat: 'repeat',
              }}
              onClick={pickColorAt}
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Tolerance: {tolerance}</label>
            <input
              type="range"
              min="1"
              max="128"
              value={tolerance}
              onChange={(e) => setTolerance(Number(e.target.value))}
              className="tb-v2-range"
            />
          </div>

          <div className="flex items-center gap-3" style={{ minHeight: 32 }}>
            <span
              className="rounded"
              style={{
                display: 'inline-block',
                width: 32,
                height: 32,
                border: '1px solid var(--line-2)',
                backgroundColor: pickedColor ? rgbToHex(pickedColor) : 'transparent',
              }}
            />
            <span className="text-sm text-gray-500">
              {pickedColor ? `${rgbToHex(pickedColor)} picked - click Erase to remove it` : 'No color picked yet'}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={eraseColor}
              disabled={!pickedColor || isProcessing || isOversized}
              className="tb-v2-btn tb-v2-btn-primary tb-v2-btn-lg flex-1 disabled:opacity-50"
              title={isOversized ? 'File size exceeds your plan limit' : ''}
            >
              {isProcessing ? 'Erasing...' : isOversized ? 'File Too Large' : 'Erase Picked Color'}
            </button>
            <button onClick={reset} className="tb-v2-btn tb-v2-btn-ghost tb-v2-btn-lg">
              Undo All Erasing
            </button>
            <button onClick={clearAll} className="tb-v2-btn tb-v2-btn-ghost tb-v2-btn-lg">
              Choose New Image
            </button>
            {workingUrl && (
              <button onClick={downloadResult} className="tb-v2-btn tb-v2-btn-ghost tb-v2-btn-lg">
                Download PNG
              </button>
            )}
          </div>

          {erasedCount > 0 && (
            <p className="text-sm text-gray-500">{erasedCount.toLocaleString()} pixels erased so far.</p>
          )}
        </div>
      )}
    </div>
  );
}
