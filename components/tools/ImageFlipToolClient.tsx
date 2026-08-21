'use client';

import { useState, useRef, useCallback } from 'react';

type FlipDirection = 'horizontal' | 'vertical' | 'both';

export default function ImageFlipToolClient() {
  const [image, setImage] = useState<string | null>(null);
  const [flipDirection, setFlipDirection] = useState<FlipDirection>('horizontal');
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

  const applyFlip = useCallback(() => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      if (flipDirection === 'both') {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.translate(img.width, img.height);
        ctx.scale(-1, -1);
      } else if (flipDirection === 'horizontal') {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.translate(img.width, 0);
        ctx.scale(-1, 1);
      } else {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.translate(0, img.height);
        ctx.scale(1, -1);
      }
      ctx.drawImage(img, 0, 0);
      setProcessedImage(canvas.toDataURL('image/png'));
    };
    img.src = image;
  }, [image, flipDirection]);

  const handleDownload = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.download = 'flipped-image.png';
    link.href = processedImage;
    link.click();
  };

  return (
    <div className="tb-v2-flex tb-v2-flex-col tb-v2-gap-4 tb-v2-p-4">
      <h2 className="tb-v2-text-2xl tb-v2-font-bold">Flip Image</h2>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="tb-v2-file-input"
      />

      {image && (
        <>
          <div className="tb-v2-flex tb-v2-gap-2">
            <button
              onClick={() => setFlipDirection('horizontal')}
              className={`tb-v2-btn ${flipDirection === 'horizontal' ? 'tb-v2-btn-primary' : 'tb-v2-btn-secondary'}`}
            >
              Horizontal
            </button>
            <button
              onClick={() => setFlipDirection('vertical')}
              className={`tb-v2-btn ${flipDirection === 'vertical' ? 'tb-v2-btn-primary' : 'tb-v2-btn-secondary'}`}
            >
              Vertical
            </button>
            <button
              onClick={() => setFlipDirection('both')}
              className={`tb-v2-btn ${flipDirection === 'both' ? 'tb-v2-btn-primary' : 'tb-v2-btn-secondary'}`}
            >
              Both
            </button>
          </div>

          <button onClick={applyFlip} className="tb-v2-btn tb-v2-btn-primary">
            Flip Image
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
              <p className="tb-v2-tool-label" style={{marginBottom:8}}>Flipped</p>
              <img src={processedImage} alt="Flipped" className="tb-v2-max-w-full tb-v2-rounded-lg" />
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
