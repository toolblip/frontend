'use client';

import { useState, useRef, useCallback } from 'react';

type LayoutType = 'horizontal' | 'vertical' | 'grid';

export default function CombineImagesClient() {
  const [images, setImages] = useState<string[]>([]);
  const [layout, setLayout] = useState<LayoutType>('horizontal');
  const [spacing, setSpacing] = useState(10);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadFiles = (files: File[]) => {
    if (files.length === 0) return;
    const readers = files.map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => resolve(event.target?.result as string);
          reader.readAsDataURL(file);
        })
    );
    Promise.all(readers).then((newImages) => {
      setImages((prev) => [...prev, ...newImages]);
      setProcessedImage(null);
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) loadFiles(Array.from(e.target.files));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files) {
      loadFiles(Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/')));
    }
  };

  const loadExample = () => {
    const makeSwatch = (color: string) => {
      const canvas = document.createElement('canvas');
      canvas.width = 200;
      canvas.height = 200;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 200, 200);
      return canvas.toDataURL('image/png');
    };
    setImages([makeSwatch('#6366f1'), makeSwatch('#ec4899'), makeSwatch('#22c55e')]);
    setProcessedImage(null);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setProcessedImage(null);
  };

  const combineImages = useCallback(() => {
    if (images.length < 2 || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    images.forEach((src, idx) => {
      const img = new Image();
      img.onload = () => {
        loadedImages[idx] = img;
        loadedCount++;

        if (loadedCount === images.length) {
          let width = 0;
          let height = 0;
          const gap = spacing;

          if (layout === 'horizontal') {
            width = loadedImages.reduce((sum, img) => sum + img.width, 0) + gap * (loadedImages.length - 1);
            height = Math.max(...loadedImages.map((img) => img.height));
          } else if (layout === 'vertical') {
            width = Math.max(...loadedImages.map((img) => img.width));
            height = loadedImages.reduce((sum, img) => sum + img.height, 0) + gap * (loadedImages.length - 1);
          } else {
            const cols = Math.ceil(Math.sqrt(loadedImages.length));
            const rows = Math.ceil(loadedImages.length / cols);
            const maxWidths: number[] = [];
            const maxHeights: number[] = [];
            for (let r = 0; r < rows; r++) {
              const rowImages = loadedImages.slice(r * cols, r * cols + cols);
              maxWidths.push(Math.max(...rowImages.map((img) => img.width)));
              maxHeights.push(Math.max(...rowImages.map((img) => img.height)));
            }
            width = maxWidths.reduce((sum, w) => sum + w, 0) + gap * (cols - 1);
            height = maxHeights.reduce((sum, h) => sum + h, 0) + gap * (rows - 1);
          }

          canvas.width = width;
          canvas.height = height;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, width, height);

          let offsetX = 0;
          let offsetY = 0;

          if (layout === 'grid') {
            const cols = Math.ceil(Math.sqrt(loadedImages.length));
            const maxWidths: number[] = [];
            const maxHeights: number[] = [];

            for (let r = 0; r < Math.ceil(loadedImages.length / cols); r++) {
              const rowImages = loadedImages.slice(r * cols, r * cols + cols);
              maxWidths.push(Math.max(...rowImages.map((img) => img.width)));
              maxHeights.push(Math.max(...rowImages.map((img) => img.height)));
            }

            let row = 0;
            let col = 0;
            loadedImages.forEach((img, i) => {
              const maxWidthInRow = maxWidths[row];
              const x = col * (maxWidthInRow + gap);
              ctx.drawImage(img, x, offsetY);
              col++;
              if (col >= cols) {
                col = 0;
                offsetY += maxHeights[row] + gap;
                row++;
              }
            });
          } else if (layout === 'horizontal') {
            loadedImages.forEach((img) => {
              ctx.drawImage(img, offsetX, (height - img.height) / 2);
              offsetX += img.width + gap;
            });
          } else {
            loadedImages.forEach((img) => {
              ctx.drawImage(img, (width - img.width) / 2, offsetY);
              offsetY += img.height + gap;
            });
          }

          setProcessedImage(canvas.toDataURL('image/png'));
        }
      };
      img.src = src;
    });
  }, [images, layout, spacing]);

  const handleDownload = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.download = 'combined-image.png';
    link.href = processedImage;
    link.click();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Combine Images</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>

      <div className="tb-v2-section" style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '20px' }}>
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${dragActive ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200'}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
            id="combine-images-upload"
          />
          <label htmlFor="combine-images-upload" className="cursor-pointer">
            <div className="text-gray-500 mb-2">Drop images here, or click to upload</div>
            <div className="text-xs text-gray-400">PNG, JPG, WEBP - select multiple files</div>
          </label>
        </div>

        {images.length > 0 ? (
          <>
            <div className="flex gap-2 flex-wrap">
              {images.map((img, idx) => (
                <div key={idx} className="relative">
                  <img src={img} alt={`Image ${idx + 1}`} className="w-20 h-20 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >
                    x
                  </button>
                </div>
              ))}
            </div>

            <p className="text-sm text-gray-500">{images.length} images selected</p>

            <div className="tb-v2-mode-tabs">
              <button type="button" onClick={() => setLayout('horizontal')} className={`tb-v2-mode-tab ${layout === 'horizontal' ? 'on' : ''}`}>
                Horizontal
              </button>
              <button type="button" onClick={() => setLayout('vertical')} className={`tb-v2-mode-tab ${layout === 'vertical' ? 'on' : ''}`}>
                Vertical
              </button>
              <button type="button" onClick={() => setLayout('grid')} className={`tb-v2-mode-tab ${layout === 'grid' ? 'on' : ''}`}>
                Grid
              </button>
            </div>

            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-500">Spacing: {spacing}px</label>
              <input
                type="range"
                min="0"
                max="50"
                value={spacing}
                onChange={(e) => setSpacing(Number(e.target.value))}
                className="tb-v2-range"
              />
            </div>

            <button
              type="button"
              onClick={combineImages}
              disabled={images.length < 2}
              className="tb-v2-btn tb-v2-btn-primary disabled:opacity-50"
            >
              Combine Images
            </button>
          </>
        ) : (
          <div className="tb-v2-empty">Upload two or more images to combine them</div>
        )}

        <canvas ref={canvasRef} className="hidden" />

        {processedImage && (
          <div>
            <p className="tb-v2-tool-label" style={{ marginBottom: 8 }}>Combined Result</p>
            <img src={processedImage} alt="Combined" className="max-w-full rounded-xl" />
            <button type="button" onClick={handleDownload} className="tb-v2-btn mt-2">
              Download
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
