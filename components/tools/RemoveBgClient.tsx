'use client';

import { useState, useRef } from 'react';
import { convertHeicIfNeeded } from '@/lib/heic';
import { useSubscription } from '@/hooks/useSubscription';
import { FileSizeError, UpgradeNotice } from '@/components/FileSizeGuard';

export default function RemoveBgClient() {
  const [image, setImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConvertingHeic, setIsConvertingHeic] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { tier } = useSubscription();
  const maxSizeMB = tier === 'free' ? 5 : tier === 'starter' ? 10 : tier === 'ultra' ? 100 : tier === 'max' ? 500 : 5;
  const isOversized = selectedFile != null && selectedFile.size / (1024 * 1024) > maxSizeMB;

  const loadImage = async (file: File) => {
    setSelectedFile(file);
    setIsConvertingHeic(true);
    const decodable = await convertHeicIfNeeded(file);
    setIsConvertingHeic(false);

    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
      setProcessedImage(null);
    };
    reader.readAsDataURL(decodable);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) loadImage(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    // HEIC/HEIF files often report an empty or non-"image/" MIME type
    // (OS-dependent), so fall back to checking the extension too.
    if (file && (file.type.startsWith('image/') || /\.(heic|heif)$/i.test(file.name))) {
      loadImage(file);
    }
  };

  const removeBackground = () => {
    if (!image || !canvasRef.current) return;

    setIsProcessing(true);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Simple background removal based on edge detection and color similarity
      // This is a simplified approach - for production, use a proper ML model
      const getColorDistance = (r1: number, g1: number, b1: number, r2: number, g2: number, b2: number) => {
        return Math.sqrt(Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2));
      };

      // Sample corners to detect background color
      const corners = [
        { i: 0 }, // top-left
        { i: canvas.width * 4 - 4 }, // top-right
        { i: (canvas.height - 1) * canvas.width * 4 }, // bottom-left
        { i: (canvas.height * canvas.width - 1) * 4 } // bottom-right
      ];

      let bgR = 0, bgG = 0, bgB = 0;
      corners.forEach(({ i }) => {
        bgR += data[i];
        bgG += data[i + 1];
        bgB += data[i + 2];
      });
      bgR = Math.round(bgR / 4);
      bgG = Math.round(bgG / 4);
      bgB = Math.round(bgB / 4);

      const threshold = 60;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        const distance = getColorDistance(r, g, b, bgR, bgG, bgB);
        
        if (distance < threshold) {
          data[i + 3] = 0; // Set alpha to 0 (transparent)
        }
      }

      ctx.putImageData(imageData, 0, 0);
      setProcessedImage(canvas.toDataURL('image/png'));
      setIsProcessing(false);
    };
    img.src = image;
  };

  const handleDownload = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.download = 'removed-background.png';
    link.href = processedImage;
    link.click();
  };

  return (
    <div className="tb-v2-flex tb-v2-flex-col tb-v2-gap-4 tb-v2-p-4">
      <h2 className="tb-v2-text-2xl tb-v2-font-bold">Remove Background</h2>
      <p className="tb-v2-text-sm tb-v2-text-gray-500">Remove background from images</p>

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
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={isConvertingHeic}
            className="hidden"
            aria-label="Upload image"
          />
          <UpgradeNotice tier={tier} />
          <FileSizeError file={selectedFile} maxSizeMB={maxSizeMB} />
        </div>
      ) : (
        <div className="tb-v2-flex tb-v2-flex-col tb-v2-gap-4">
          <div>
            <p className="tb-v2-tool-label" style={{marginBottom:8}}>Original Image</p>
            <img src={image} alt="Original" className="tb-v2-max-w-full tb-v2-max-h-[300px] tb-v2-object-contain tb-v2-rounded" />
          </div>

          <div className="tb-v2-flex tb-v2-gap-2">
            <button
              onClick={removeBackground}
              disabled={isProcessing || isOversized}
              className="tb-v2-btn tb-v2-btn-primary tb-v2-disabled:opacity-50"
              title={isOversized ? 'File size exceeds your plan limit' : ''}
            >
              {isProcessing ? 'Processing...' : isOversized ? 'File Too Large' : 'Remove Background'}
            </button>
            <button
              onClick={() => { setImage(null); setSelectedFile(null); setProcessedImage(null); }}
              className="tb-v2-btn tb-v2-btn-secondary"
            >
              Choose New Image
            </button>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />

      {processedImage && (
        <div className="tb-v2-flex tb-v2-flex-col tb-v2-gap-2">
          <p className="tb-v2-text-sm tb-v2-font-medium">Result (Transparent Background)</p>
          <div className="tb-v2-border tb-v2-border-gray-200 tb-v2-rounded tb-v2-p-2 tb-v2-bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAGElEQVQYlWNgYGCQwoKxgqGgcJA5h3yFAXcADqUH/3O7yz4AAAAASUVORK5CYII=')]">
            <img src={processedImage} alt="Processed" className="tb-v2-max-w-full tb-v2-max-h-[300px] tb-v2-object-contain" />
          </div>
          <button onClick={handleDownload} className="tb-v2-btn tb-v2-btn-secondary">
            Download PNG
          </button>
        </div>
      )}
    </div>
  );
}
