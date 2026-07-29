'use client';

import { useState, useRef, useCallback } from 'react';

type LayoutType = 'horizontal' | 'vertical' | 'grid';

export default function CombineImagesClient() {
  const [images, setImages] = useState<string[]>([]);
  const [layout, setLayout] = useState<LayoutType>('horizontal');
  const [spacing, setSpacing] = useState(10);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: string[] = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          newImages.push(event.target?.result as string);
          if (newImages.length === files.length) {
            setImages([...images, ...newImages]);
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
    <div className="tb-v2-flex tb-v2-flex-col tb-v2-gap-4 tb-v2-p-4">
      <h2 className="tb-v2-text-2xl tb-v2-font-bold">Combine Images</h2>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
        className="tb-v2-file-input"
      />

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

          <p className="tb-v2-text-sm tb-v2-text-gray-500">{images.length} images selected</p>

          <div className="tb-v2-flex tb-v2-gap-2">
            <button
              onClick={() => setLayout('horizontal')}
              className={`tb-v2-btn ${layout === 'horizontal' ? 'tb-v2-btn-primary' : 'tb-v2-btn-secondary'}`}
            >
              Horizontal
            </button>
            <button
              onClick={() => setLayout('vertical')}
              className={`tb-v2-btn ${layout === 'vertical' ? 'tb-v2-btn-primary' : 'tb-v2-btn-secondary'}`}
            >
              Vertical
            </button>
            <button
              onClick={() => setLayout('grid')}
              className={`tb-v2-btn ${layout === 'grid' ? 'tb-v2-btn-primary' : 'tb-v2-btn-secondary'}`}
            >
              Grid
            </button>
          </div>

          <div className="tb-v2-flex tb-v2-items-center tb-v2-gap-4">
            <label className="tb-v2-text-sm tb-v2-font-medium">Spacing: {spacing}px</label>
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
            onClick={combineImages}
            disabled={images.length < 2}
            className="tb-v2-btn tb-v2-btn-primary tb-v2-disabled:opacity-50"
          >
            Combine Images
          </button>
        </>
      )}

      <canvas ref={canvasRef} className="tb-v2-hidden" />

      {processedImage && (
        <div>
          <p className="tb-v2-tool-label" style={{marginBottom:8}}>Combined Result</p>
          <img src={processedImage} alt="Combined" className="tb-v2-max-w-full tb-v2-rounded-lg" />
          <button onClick={handleDownload} className="tb-v2-btn tb-v2-btn-secondary tb-v2-mt-2">
            Download
          </button>
        </div>
      )}
    </div>
  );
}
