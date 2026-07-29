'use client';

import { useState, useRef, useCallback } from 'react';

export default function PixelateClient() {
  const [image, setImage] = useState<string | null>(null);
  const [pixelSize, setPixelSize] = useState(10);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setProcessedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const applyPixelate = useCallback(() => {
    if (!image || !canvasRef.current) return;

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
      const width = canvas.width;
      const height = canvas.height;
      const size = pixelSize;

      for (let y = 0; y < height; y += size) {
        for (let x = 0; x < width; x += size) {
          const idx = (y * width + x) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];

          for (let dy = 0; dy < size && y + dy < height; dy++) {
            for (let dx = 0; dx < size && x + dx < width; dx++) {
              const pixelIdx = ((y + dy) * width + (x + dx)) * 4;
              data[pixelIdx] = r;
              data[pixelIdx + 1] = g;
              data[pixelIdx + 2] = b;
            }
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);
      setProcessedImage(canvas.toDataURL('image/png'));
    };
    img.src = image;
  }, [image, pixelSize]);

  const handleDownload = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.download = 'pixelated-image.png';
    link.href = processedImage;
    link.click();
  };

  return (
    <div className="tb-v2-flex tb-v2-flex-col tb-v2-gap-4 tb-v2-p-4">
      <h2 className="tb-v2-text-2xl tb-v2-font-bold">Pixelate</h2>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="tb-v2-file-input"
      />

      {image && (
        <>
          <div className="tb-v2-flex tb-v2-items-center tb-v2-gap-4">
            <label className="tb-v2-text-sm tb-v2-font-medium">Pixel Size: {pixelSize}px</label>
            <input
              type="range"
              min="2"
              max="50"
              value={pixelSize}
              onChange={(e) => setPixelSize(Number(e.target.value))}
              className="tb-v2-range"
            />
          </div>

          <button onClick={applyPixelate} className="tb-v2-btn tb-v2-btn-primary">
            Apply Pixelate
          </button>
        </>
      )}

      <canvas ref={canvasRef} className="tb-v2-hidden" />

      {image && (
        <div className="tb-v2-grid tb-v2-grid-cols-2 tb-v2-gap-4">
          <div>
            <p className="tb-v2-tool-label" style={{marginBottom:8}}>Original</p>
            <img src={image} alt="Original" className="tb-v2-max-w-full tb-v2-rounded-lg" />
          </div>
          {processedImage && (
            <div>
              <p className="tb-v2-tool-label" style={{marginBottom:8}}>Pixelated</p>
              <img src={processedImage} alt="Pixelated" className="tb-v2-max-w-full tb-v2-rounded-lg" />
              <button onClick={handleDownload} className="tb-v2-btn tb-v2-btn-secondary tb-v2-mt-2">
                Download
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
