'use client';

import { useState, useRef, useCallback } from 'react';

export default function SharpenClient() {
  const [image, setImage] = useState<string | null>(null);
  const [intensity, setIntensity] = useState(1);
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

  const applySharpen = useCallback(() => {
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
      const factor = intensity;

      const sharpenMatrix = [
        0, -1, 0,
        -1, 5, -1,
        0, -1, 0,
      ];

      const getPixel = (x: number, y: number) => {
        x = Math.max(0, Math.min(width - 1, x));
        y = Math.max(0, Math.min(height - 1, y));
        const idx = (y * width + x) * 4;
        return [data[idx], data[idx + 1], data[idx + 2]];
      };

      const newData = new Uint8ClampedArray(data.length);

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          let r = 0, g = 0, b = 0;

          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const [pr, pg, pb] = getPixel(x + kx, y + ky);
              const weight = sharpenMatrix[(ky + 1) * 3 + (kx + 1)];
              r += pr * weight;
              g += pg * weight;
              b += pb * weight;
            }
          }

          const idx = (y * width + x) * 4;
          newData[idx] = Math.min(255, Math.max(0, r * factor));
          newData[idx + 1] = Math.min(255, Math.max(0, g * factor));
          newData[idx + 2] = Math.min(255, Math.max(0, b * factor));
          newData[idx + 3] = data[idx + 3];
        }
      }

      for (let i = 0; i < data.length; i++) {
        data[i] = newData[i];
      }

      ctx.putImageData(imageData, 0, 0);
      setProcessedImage(canvas.toDataURL('image/png'));
    };
    img.src = image;
  }, [image, intensity]);

  const handleDownload = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.download = 'sharpened-image.png';
    link.href = processedImage;
    link.click();
  };

  return (
    <div className="tb-v2-flex tb-v2-flex-col tb-v2-gap-4 tb-v2-p-4">
      <h2 className="tb-v2-text-2xl tb-v2-font-bold">Sharpen</h2>

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
            <label className="tb-v2-text-sm tb-v2-font-medium">Intensity: {intensity}</label>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="tb-v2-range"
            />
          </div>

          <button onClick={applySharpen} className="tb-v2-btn tb-v2-btn-primary">
            Apply Sharpen
          </button>
        </>
      )}

      <canvas ref={canvasRef} className="hidden" />

      {image && (
        <div className="tb-v2-grid tb-v2-grid-cols-2 tb-v2-gap-4">
          <div>
            <p className="tb-v2-tool-label" style={{marginBottom:8}}>Original</p>
            <img src={image} alt="Original" className="tb-v2-max-w-full tb-v2-rounded-lg" />
          </div>
          {processedImage && (
            <div>
              <p className="tb-v2-tool-label" style={{marginBottom:8}}>Sharpened</p>
              <img src={processedImage} alt="Sharpened" className="tb-v2-max-w-full tb-v2-rounded-lg" />
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
