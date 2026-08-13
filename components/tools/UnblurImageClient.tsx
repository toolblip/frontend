'use client';

import { useState, useRef, useCallback } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { FileSizeError, UpgradeNotice } from '@/components/FileSizeGuard';

// Unsharp mask: blur a copy of the image, then push original pixels away from
// the blurred version, scaled by `amount`. This boosts edge contrast on
// mildly soft photos — it cannot invent detail that isn't in the source.
function applyUnsharpMask(imageData: ImageData, amount: number): ImageData {
  const { width, height, data } = imageData;
  const src = data;

  // 3x3 box blur (single pass) as the "unsharp" low-frequency reference.
  const blurred = new Uint8ClampedArray(src.length);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0, a = 0, count = 0;
      for (let dy = -1; dy <= 1; dy++) {
        const ny = y + dy;
        if (ny < 0 || ny >= height) continue;
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx;
          if (nx < 0 || nx >= width) continue;
          const i = (ny * width + nx) * 4;
          r += src[i]; g += src[i + 1]; b += src[i + 2]; a += src[i + 3];
          count++;
        }
      }
      const oi = (y * width + x) * 4;
      blurred[oi] = r / count;
      blurred[oi + 1] = g / count;
      blurred[oi + 2] = b / count;
      blurred[oi + 3] = a / count;
    }
  }

  const out = new Uint8ClampedArray(src.length);
  for (let i = 0; i < src.length; i += 4) {
    out[i] = src[i] + amount * (src[i] - blurred[i]);
    out[i + 1] = src[i + 1] + amount * (src[i + 1] - blurred[i + 1]);
    out[i + 2] = src[i + 2] + amount * (src[i + 2] - blurred[i + 2]);
    out[i + 3] = src[i + 3];
  }

  return new ImageData(out, width, height);
}

export default function UnblurImageClient() {
  const [image, setImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [strength, setStrength] = useState(50);
  const [previewCanvas, setPreviewCanvas] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const { tier } = useSubscription();
  const maxSizeMB = tier === 'free' ? 5 : tier === 'starter' ? 10 : tier === 'ultra' ? 100 : tier === 'max' ? 500 : 5;

  const isOversized = selectedFile != null && selectedFile.size / (1024 * 1024) > maxSizeMB;

  const render = useCallback((img: HTMLImageElement, strengthValue: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    setIsProcessing(true);
    const original = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const amount = strengthValue / 100; // 0 - 1
    const sharpened = applyUnsharpMask(original, amount);
    ctx.putImageData(sharpened, 0, 0);
    setPreviewCanvas(canvas.toDataURL('image/png'));
    setIsProcessing(false);
  }, []);

  const loadImage = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      setImage(src);
      const img = new Image();
      img.onload = () => {
        imgRef.current = img;
        render(img, strength);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const handleStrengthChange = (value: number) => {
    setStrength(value);
    if (imgRef.current) render(imgRef.current, value);
  };

  const downloadImage = () => {
    if (!previewCanvas) return;
    const link = document.createElement('a');
    link.download = 'unblurred.png';
    link.href = previewCanvas;
    link.click();
  };

  const reset = () => {
    setImage(null);
    setSelectedFile(null);
    setPreviewCanvas(null);
    imgRef.current = null;
    setStrength(50);
  };

  return (
    <div className="tb-v2-section" style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '16px 20px' }}>
      {!image ? (
        <div
          className="border-2 border-dashed border-gray-700 hover:border-[#58D65D] rounded-xl p-12 text-center transition-colors cursor-pointer"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type.startsWith('image/')) loadImage(f); }}
          onClick={() => document.getElementById('unblur-input')?.click()}
        >
          <span className="text-3xl mb-3 block">🖼️</span>
          <p className="text-gray-400 text-sm">Drag & drop an image, or click to browse</p>
          <p className="text-gray-600 text-xs mt-1">PNG, JPG, WebP, GIF • Max {maxSizeMB}MB</p>
          <input
            id="unblur-input"
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
        <div className="tb-v2-section" style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '16px 20px' }}>
          <div className="flex justify-center">
            {previewCanvas && (
              <img
                src={previewCanvas}
                alt="Sharpened preview"
                className="max-w-full max-h-96 rounded-lg object-contain"
              />
            )}
          </div>
          <canvas ref={canvasRef} className="hidden" />

          <div className="flex items-center gap-3">
            <p className="text-xs text-gray-500 font-medium">Sharpening Strength:</p>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={strength}
              onChange={(e) => handleStrengthChange(Number(e.target.value))}
              className="flex-1 accent-[#58D65D]"
            />
            <span className="text-xs text-[#58D65D] font-medium w-10 text-right">{strength}%</span>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 italic">
            This sharpens edges and boosts contrast on mildly soft photos — it can&apos;t reconstruct detail
            lost from severe blur or very low resolution.
          </p>

          <div className="tb-v2-mode-tabs">
            <button
              onClick={downloadImage}
              disabled={!previewCanvas || isOversized || isProcessing}
              className="bg-[#58D65D] hover:bg-[#48b84d] text-black font-semibold px-5 py-2 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isOversized ? 'File Too Large' : isProcessing ? 'Processing…' : 'Download PNG'}
            </button>
            <button
              onClick={reset}
              className="bg-[#1a1a2e] hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm border border-gray-700 transition-colors"
            >
              Choose New Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
