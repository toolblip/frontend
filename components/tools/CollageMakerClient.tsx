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
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadFiles = (fileList: FileList | File[]) => {
    const maxSlots = layoutConfigs[layout].cols * layoutConfigs[layout].rows;
    const filesToLoad = Array.from(fileList).filter(f => f.type.startsWith('image/')).slice(0, maxSlots);
    if (filesToLoad.length === 0) return;

    const newImages: string[] = new Array(filesToLoad.length);
    let loadedCount = 0;
    filesToLoad.forEach((file, idx) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        newImages[idx] = event.target?.result as string;
        loadedCount++;
        if (loadedCount === filesToLoad.length) {
          setImages(newImages);
          setProcessedImage(null);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) loadFiles(e.target.files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) loadFiles(e.dataTransfer.files);
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
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Collage Maker</span>
      </div>

      <div className="tb-v2-mode-tabs" style={{ flexWrap: 'wrap' }}>
        {(Object.keys(layoutConfigs) as LayoutType[]).map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => handleLayoutChange(l)}
            className={`tb-v2-mode-tab ${layout === l ? 'on' : ''}`}
          >
            {l}
          </button>
        ))}
      </div>

      <div
        className={`tb-v2-dropzone ${isDragging ? 'dragging' : ''}`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <span style={{ fontSize: 28 }}>🖼️</span>
        <span className="tb-v2-dropzone-text">Click or drag images here</span>
        <span className="tb-v2-dropzone-hint">
          Up to {layoutConfigs[layout].cols * layoutConfigs[layout].rows} images for the {layout} layout
        </span>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />
      </div>

      <div className="tb-v2-range-row">
        <label className="tb-v2-tool-label">Spacing</label>
        <input
          type="range"
          min="0"
          max="30"
          value={spacing}
          onChange={(e) => setSpacing(Number(e.target.value))}
          className="tb-v2-range"
        />
        <span className="tb-v2-range-val">{spacing}px</span>
      </div>

      <div className="flex items-center gap-4">
        <label className="tb-v2-tool-label">Background</label>
        <input
          type="color"
          value={bgColor}
          onChange={(e) => setBgColor(e.target.value)}
          style={{ width: 40, height: 40, borderRadius: 6, border: '1px solid var(--line)' }}
        />
      </div>

      {images.length === 0 ? (
        <p className="tb-v2-empty">Upload images above to start building your collage.</p>
      ) : (
        <>
          <div className="flex gap-2 flex-wrap">
            {images.map((img, idx) => (
              <div key={idx} className="relative">
                <img src={img} alt={`Image ${idx + 1}`} className="w-20 h-20 object-cover rounded" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                  x
                </button>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 13, color: 'var(--tb-text-secondary)' }}>
            {images.length} of {layoutConfigs[layout].cols * layoutConfigs[layout].rows} slots filled
          </p>

          <button
            type="button"
            onClick={createCollage}
            disabled={images.length === 0}
            className="tb-v2-btn tb-v2-btn-primary"
            style={{ alignSelf: 'flex-start' }}
          >
            Create Collage
          </button>
        </>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {processedImage && (
        <div>
          <p className="tb-v2-tool-label" style={{ marginBottom: 8 }}>Collage Result</p>
          <img src={processedImage} alt="Collage" className="max-w-full rounded-lg" />
          <button type="button" onClick={handleDownload} className="tb-v2-btn" style={{ marginTop: 8 }}>
            Download
          </button>
        </div>
      )}
    </div>
  );
}
