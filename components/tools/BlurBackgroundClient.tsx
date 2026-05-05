'use client';

import { useState, useRef, useCallback } from 'react';

export default function BlurBackgroundClient() {
  const [image, setImage] = useState<string | null>(null);
  const [blurRadius, setBlurRadius] = useState(10);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setImage(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const applyBlur = useCallback(() => {
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
      const radius = blurRadius;

      const getPixel = (x: number, y: number) => {
        x = Math.max(0, Math.min(width - 1, x));
        y = Math.max(0, Math.min(height - 1, y));
        const idx = (y * width + x) * 4;
        return [data[idx], data[idx + 1], data[idx + 2], data[idx + 3]];
      };

      const blurredData = ctx.createImageData(width, height);
      const blurredPixels = blurredData.data;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          let r = 0, g = 0, b = 0, a = 0, count = 0;

          for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
              const [pr, pg, pb, pa] = getPixel(x + dx, y + dy);
              r += pr;
              g += pg;
              b += pb;
              a += pa;
              count++;
            }
          }

          const idx = (y * width + x) * 4;
          blurredPixels[idx] = r / count;
          blurredPixels[idx + 1] = g / count;
          blurredPixels[idx + 2] = b / count;
          blurredPixels[idx + 3] = a / count;
        }
      }

      ctx.putImageData(blurredData, 0, 0);
      setProcessedImage(canvas.toDataURL('image/png'));
    };
    img.src = image;
  }, [image, blurRadius]);

  const handleDownload = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.download = 'blurred-image.png';
    link.href = processedImage;
    link.click();
  };

  return (
    <div className="tb-v2-flex tb-v2-flex-col tb-v2-gap-4 tb-v2-p-4">
      <h2 className="tb-v2-text-2xl tb-v2-font-bold">Blur Background</h2>
      
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
            <label className="tb-v2-text-sm tb-v2-font-medium">Blur Radius: {blurRadius}px</label>
            <input
              type="range"
              min="1"
              max="50"
              value={blurRadius}
              onChange={(e) => setBlurRadius(Number(e.target.value))}
              className="tb-v2-range"
            />
          </div>

          <button onClick={applyBlur} className="tb-v2-btn tb-v2-btn-primary">
            Apply Blur
          </button>
        </>
      )}

      <canvas ref={canvasRef} className="tb-v2-hidden" />

      {image && (
        <div className="tb-v2-grid tb-v2-grid-cols-2 tb-v2-gap-4">
          <div>
            <p className="tb-v2-text-sm tb-v2-font-medium tb-v2-mb-2">Original</p>
            <img src={image} alt="Original" className="tb-v2-max-w-full tb-v2-rounded-lg" />
          </div>
          {processedImage && (
            <div>
              <p className="tb-v2-text-sm tb-v2-font-medium tb-v2-mb-2">Blurred</p>
              <img src={processedImage} alt="Blurred" className="tb-v2-max-w-full tb-v2-rounded-lg" />
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
