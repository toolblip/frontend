'use client';

import { useState, useRef } from 'react';

export default function RemoveBgClient() {
  const [image, setImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
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

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="tb-v2-file-input"
      />

      {image && (
        <div className="tb-v2-flex tb-v2-flex-col tb-v2-gap-4">
          <div>
            <p className="tb-v2-text-sm tb-v2-font-medium tb-v2-mb-2">Original Image</p>
            <img src={image} alt="Original" className="tb-v2-max-w-full tb-v2-max-h-[300px] tb-v2-object-contain tb-v2-rounded" />
          </div>

          <button
            onClick={removeBackground}
            disabled={isProcessing}
            className="tb-v2-btn tb-v2-btn-primary tb-v2-disabled:opacity-50"
          >
            {isProcessing ? 'Processing...' : 'Remove Background'}
          </button>
        </div>
      )}

      <canvas ref={canvasRef} className="tb-v2-hidden" />

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
