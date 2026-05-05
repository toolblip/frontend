'use client';

import { useState, useRef, useCallback } from 'react';

type LayoutType = '2x1' | '1x2' | '2x2' | '3x1' | '1x3' | '3x2' | '2x3' | '3x3';

const layoutConfigs: Record<LayoutType, { cols: number; rows: number }> = {
  '2x1': { cols: 2, rows: 1 },
  '1x2': { cols: 1, rows: 2 },
  '2x2': { cols: 2, rows: 2 },
  '3x1': { cols: 3, rows: 1 },
  '1x3': { cols: 1, rows: 3 },
  '3x2': { cols: 3, rows: 2 },
  '2x3': { cols: 2, rows: 3 },
  '3x3': { cols: 3, rows: 3 },
};

export default function CollageMakerClient() {
  const [images, setImages] = useState<string[]>([]);
  const [layout, setLayout] = useState<LayoutType>('2x2');
  const [spacing, setSpacing] = useState(10);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const maxSlots = layoutConfigs[layout].cols * layoutConfigs[layout].rows;
      const newImages: string[] = [];
      let filesToLoad = Array.from(files);
      
      if (filesToLoad.length > maxSlots) {
        filesToLoad = filesToLoad.slice(0, maxSlots);
      }
      
      let loadedCount = 0;
      filesToLoad.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          newImages.push(event.target?.result as string);
          loadedCount++;
          if (loadedCount === filesToLoad.length) {
            setImages(newImages);
            setProcessedImage(null);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setProcessedImage(null);
  };

  const createCollage = useCallback(() => {
    if (images.length === 0 || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { cols, rows } = layoutConfigs[layout];
    const gap = spacing;
    const cellWidth = 300;
    const cellHeight = 300;
    const canvasWidth = cols * cellWidth + (cols - 1) * gap;
    const canvasHeight = rows * cellHeight + (rows - 1) * gap;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    images.forEach((src, idx) => {
      const img = new Image();
      img.onload = () => {
        loadedImages[idx] = img;
        loadedCount++;

        if (loadedCount === images.length) {
          for (let i = 0; i < loadedImages.length; i++) {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = col * (cellWidth + gap);
            const y = row * (cellHeight + gap);
            
            const scale = Math.min(cellWidth / loadedImages[i].width, cellHeight / loadedImages[i].height);
            const scaledWidth = loadedImages[i].width * scale;
            const scaledHeight = loadedImages[i].height * scale;
            const offsetX = x + (cellWidth - scaledWidth) / 2;
            const offsetY = y + (cellHeight - scaledHeight) / 2;
            
            ctx.drawImage(loadedImages[i], offsetX, offsetY, scaledWidth, scaledHeight);
          }
          setProcessedImage(canvas.toDataURL('image/png'));
        }
      };
      img.src = src;
    });
  }, [images, layout, spacing, bgColor]);

  const handleLayoutChange = (newLayout: LayoutType) => {
    setLayout(newLayout);
    setImages([]);
    setProcessedImage(null);
  };

  const handleDownload = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.download = 'collage.png';
    link.href = processedImage;
    link.click();
  };

  return (
    <div className="tb-v2-flex tb-v2-flex-col tb-v2-gap-4 tb-v2-p-4">
      <h2 className="tb-v2-text-2xl tb-v2-font-bold">Collage Maker</h2>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
        className="tb-v2-file-input"
      />

      <div className="tb-v2-flex tb-v2-gap-2 tb-v2-flex-wrap">
        {(Object.keys(layoutConfigs) as LayoutType[]).map((l) => (
          <button
            key={l}
            onClick={() => handleLayoutChange(l)}
            className={`tb-v2-btn ${layout === l ? 'tb-v2-btn-primary' : 'tb-v2-btn-secondary'}`}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="tb-v2-flex tb-v2-items-center tb-v2-gap-4">
        <label className="tb-v2-text-sm tb-v2-font-medium">Spacing: {spacing}px</label>
        <input
          type="range"
          min="0"
          max="30"
          value={spacing}
          onChange={(e) => setSpacing(Number(e.target.value))}
          className="tb-v2-range"
        />
      </div>

      <div className="tb-v2-flex tb-v2-items-center tb-v2-gap-4">
        <label className="tb-v2-text-sm tb-v2-font-medium">Background:</label>
        <input
          type="color"
          value={bgColor}
          onChange={(e) => setBgColor(e.target.value)}
          className="tb-v2-w-10 tb-v2-h-10 tb-v2-rounded"
        />
      </div>

      {images.length > 0 && (
        <>
          <div className="tb-v2-flex tb-v2-gap-2 tb-v2-flex-wrap">
            {images.map((img, idx) => (
              <div key={idx} className="tb-v2-relative">
                <img src={img} alt={`Image ${idx + 1}`} className="tb-v2-w-20 tb-v2-h-20 tb-v2-object-cover tb-v2-rounded" />
                <button
                  onClick={() => removeImage(idx)}
                  className="tb-v2-absolute tb-v2-top-0 tb-v2-right-0 tb-v2-bg-red-500 tb-v2-text-white tb-v2-rounded-full tb-v2-w-5 tb-v2-h-5 tb-v2-flex tb-v2-items-center tb-v2-justify-center tb-v2-text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <p className="tb-v2-text-sm tb-v2-text-gray-500">
            {images.length} of {layoutConfigs[layout].cols * layoutConfigs[layout].rows} slots filled
          </p>

          <button
            onClick={createCollage}
            disabled={images.length === 0}
            className="tb-v2-btn tb-v2-btn-primary tb-v2-disabled:opacity-50"
          >
            Create Collage
          </button>
        </>
      )}

      <canvas ref={canvasRef} className="tb-v2-hidden" />

      {processedImage && (
        <div>
          <p className="tb-v2-text-sm tb-v2-font-medium tb-v2-mb-2">Collage Result</p>
          <img src={processedImage} alt="Collage" className="tb-v2-max-w-full tb-v2-rounded-lg" />
          <button onClick={handleDownload} className="tb-v2-btn tb-v2-btn-secondary tb-v2-mt-2">
            Download
          </button>
        </div>
      )}
    </div>
  );
}