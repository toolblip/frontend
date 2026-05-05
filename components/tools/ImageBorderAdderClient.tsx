'use client';

import { useState, useRef, useCallback } from 'react';

interface BorderConfig {
  width: number;
  color: string;
}

export default function ImageBorderAdderClient() {
  const [image, setImage] = useState<string | null>(null);
  const [border, setBorder] = useState<BorderConfig>({ width: 10, color: '#000000' });
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

  const applyBorder = useCallback(() => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      const borderWidth = border.width * 2;
      canvas.width = img.width + borderWidth;
      canvas.height = img.height + borderWidth;

      ctx.fillStyle = border.color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, border.width, border.width);

      setProcessedImage(canvas.toDataURL('image/png'));
    };
    img.src = image;
  }, [image, border]);

  const handleDownload = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.download = 'bordered-image.png';
    link.href = processedImage;
    link.click();
  };

  return (
    <div className="tb-v2-flex tb-v2-flex-col tb-v2-gap-4 tb-v2-p-4">
      <h2 className="tb-v2-text-2xl tb-v2-font-bold">Add Border</h2>

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
            <label className="tb-v2-text-sm tb-v2-font-medium">Border Width: {border.width}px</label>
            <input
              type="range"
              min="1"
              max="100"
              value={border.width}
              onChange={(e) => setBorder({ ...border, width: Number(e.target.value) })}
              className="tb-v2-range"
            />
          </div>

          <div className="tb-v2-flex tb-v2-items-center tb-v2-gap-4">
            <label className="tb-v2-text-sm tb-v2-font-medium">Border Color:</label>
            <input
              type="color"
              value={border.color}
              onChange={(e) => setBorder({ ...border, color: e.target.value })}
              className="tb-v2-color-input"
            />
          </div>

          <button onClick={applyBorder} className="tb-v2-btn tb-v2-btn-primary">
            Add Border
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
              <p className="tb-v2-text-sm tb-v2-font-medium tb-v2-mb-2">With Border</p>
              <img src={processedImage} alt="Bordered" className="tb-v2-max-w-full tb-v2-rounded-lg" />
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
