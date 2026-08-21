'use client';

import { useState, useRef, useCallback } from 'react';

interface ShadowConfig {
  offsetX: number;
  offsetY: number;
  blur: number;
  color: string;
  opacity: number;
}

export default function ImageShadowGeneratorClient() {
  const [image, setImage] = useState<string | null>(null);
  const [shadow, setShadow] = useState<ShadowConfig>({
    offsetX: 10,
    offsetY: 10,
    blur: 20,
    color: '#000000',
    opacity: 0.5,
  });
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

  const applyShadow = useCallback(() => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      const padding = shadow.blur + Math.max(Math.abs(shadow.offsetX), Math.abs(shadow.offsetY));
      canvas.width = img.width + padding * 2;
      canvas.height = img.height + padding * 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.shadowColor = shadow.color;
      ctx.shadowOffsetX = shadow.offsetX;
      ctx.shadowOffsetY = shadow.offsetY;
      ctx.shadowBlur = shadow.blur;
      ctx.globalAlpha = shadow.opacity;

      ctx.drawImage(img, padding, padding);
      ctx.restore();

      ctx.drawImage(img, padding, padding);

      setProcessedImage(canvas.toDataURL('image/png'));
    };
    img.src = image;
  }, [image, shadow]);

  const handleDownload = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.download = 'shadow-image.png';
    link.href = processedImage;
    link.click();
  };

  return (
    <div className="tb-v2-flex tb-v2-flex-col tb-v2-gap-4 tb-v2-p-4">
      <h2 className="tb-v2-text-2xl tb-v2-font-bold">Drop Shadow</h2>

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
            <label className="tb-v2-text-sm tb-v2-font-medium">Offset X: {shadow.offsetX}px</label>
            <input
              type="range"
              min="-50"
              max="50"
              value={shadow.offsetX}
              onChange={(e) => setShadow({ ...shadow, offsetX: Number(e.target.value) })}
              className="tb-v2-range"
            />
          </div>

          <div className="tb-v2-flex tb-v2-items-center tb-v2-gap-4">
            <label className="tb-v2-text-sm tb-v2-font-medium">Offset Y: {shadow.offsetY}px</label>
            <input
              type="range"
              min="-50"
              max="50"
              value={shadow.offsetY}
              onChange={(e) => setShadow({ ...shadow, offsetY: Number(e.target.value) })}
              className="tb-v2-range"
            />
          </div>

          <div className="tb-v2-flex tb-v2-items-center tb-v2-gap-4">
            <label className="tb-v2-text-sm tb-v2-font-medium">Blur: {shadow.blur}px</label>
            <input
              type="range"
              min="0"
              max="100"
              value={shadow.blur}
              onChange={(e) => setShadow({ ...shadow, blur: Number(e.target.value) })}
              className="tb-v2-range"
            />
          </div>

          <div className="tb-v2-flex tb-v2-items-center tb-v2-gap-4">
            <label className="tb-v2-text-sm tb-v2-font-medium">Opacity: {Math.round(shadow.opacity * 100)}%</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={shadow.opacity}
              onChange={(e) => setShadow({ ...shadow, opacity: Number(e.target.value) })}
              className="tb-v2-range"
            />
          </div>

          <div className="tb-v2-flex tb-v2-items-center tb-v2-gap-4">
            <label className="tb-v2-text-sm tb-v2-font-medium">Color:</label>
            <input
              type="color"
              value={shadow.color}
              onChange={(e) => setShadow({ ...shadow, color: e.target.value })}
              className="tb-v2-color-input"
            />
          </div>

          <button onClick={applyShadow} className="tb-v2-btn tb-v2-btn-primary">
            Apply Shadow
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
              <p className="tb-v2-tool-label" style={{marginBottom:8}}>With Shadow</p>
              <img src={processedImage} alt="Shadow" className="tb-v2-max-w-full tb-v2-rounded-lg" />
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
