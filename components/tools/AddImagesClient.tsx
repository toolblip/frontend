'use client';

import { useState, useRef, useCallback } from 'react';

interface ImageItem {
  id: string;
  file: File;
  preview: string;
  x: number;
  y: number;
  scale: number;
  zIndex: number;
}

export default function AddImagesClient() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [layout, setLayout] = useState<'grid' | 'horizontal' | 'vertical'>('grid');
  const [spacing, setSpacing] = useState(10);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages: ImageItem[] = files.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      preview: URL.createObjectURL(file),
      x: 0,
      y: 0,
      scale: 1,
      zIndex: images.length,
    }));
    setImages((prev) => [...prev, ...newImages]);
    e.target.value = '';
  }, [images.length]);

  const removeImage = (id: string) => {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img) URL.revokeObjectURL(img.preview);
      return prev.filter((i) => i.id !== id);
    });
    if (selectedId === id) setSelectedId(null);
  };

  const updatePosition = (id: string, field: 'x' | 'y', value: number) => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, [field]: value } : img))
    );
  };

  const updateScale = (id: string, scale: number) => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, scale } : img))
    );
  };

  const bringToFront = (id: string) => {
    const maxZ = Math.max(...images.map((i) => i.zIndex));
    updatePosition;
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, zIndex: maxZ + 1 } : img))
    );
  };

  const renderCanvas = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas || images.length === 0) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const sortedImages = [...images].sort((a, b) => a.zIndex - b.zIndex);

    if (layout === 'grid') {
      const cols = Math.ceil(Math.sqrt(sortedImages.length));
      const imgWidth = (canvasSize.width - spacing * (cols + 1)) / cols;
      const imgHeight = (canvasSize.height - spacing * (Math.ceil(sortedImages.length / cols) + 1)) / Math.ceil(sortedImages.length / cols);
      
      for (let i = 0; i < sortedImages.length; i++) {
        const img = sortedImages[i];
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = spacing + col * (imgWidth + spacing);
        const y = spacing + row * (imgHeight + spacing);
        
        const imgEl = new Image();
        imgEl.src = img.preview;
        await new Promise<void>((resolve) => {
          imgEl.onload = () => {
            const scale = Math.min(imgWidth / imgEl.width, imgHeight / imgEl.height);
            const drawW = imgEl.width * scale;
            const drawH = imgEl.height * scale;
            const drawX = x + (imgWidth - drawW) / 2;
            const drawY = y + (imgHeight - drawH) / 2;
            ctx.drawImage(imgEl, drawX, drawY, drawW, drawH);
            resolve();
          };
          imgEl.onerror = () => resolve();
        });
      }
    } else if (layout === 'horizontal') {
      const totalW = sortedImages.reduce((sum, _, i) => {
        const img = sortedImages[i];
        const imgEl = new Image();
        imgEl.src = img.preview;
        return sum + (i > 0 ? spacing : 0);
      }, 0);
      let currentX = (canvasSize.width - Math.min(totalW, canvasSize.width)) / 2;
      
      for (const img of sortedImages) {
        const imgEl = new Image();
        imgEl.src = img.preview;
        await new Promise<void>((resolve) => {
          imgEl.onload = () => {
            const scale = Math.min(1, canvasSize.height / imgEl.height);
            const drawW = imgEl.width * scale * 0.8;
            const drawH = imgEl.height * scale * 0.8;
            const drawY = (canvasSize.height - drawH) / 2;
            ctx.drawImage(imgEl, currentX, drawY, drawW, drawH);
            currentX += drawW + spacing;
            resolve();
          };
          imgEl.onerror = () => resolve();
        });
      }
    } else if (layout === 'vertical') {
      let currentY = spacing;
      for (const img of sortedImages) {
        const imgEl = new Image();
        imgEl.src = img.preview;
        await new Promise<void>((resolve) => {
          imgEl.onload = () => {
            const scale = Math.min(1, canvasSize.width / imgEl.width);
            const drawW = imgEl.width * scale * 0.8;
            const drawH = imgEl.height * scale * 0.8;
            const drawX = (canvasSize.width - drawW) / 2;
            ctx.drawImage(imgEl, drawX, currentY, drawW, drawH);
            currentY += drawH + spacing;
            resolve();
          };
          imgEl.onerror = () => resolve();
        });
      }
    }
  }, [images, canvasSize, layout, spacing]);

  const downloadComposite = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = 'composite-image.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-3">
        <div>
          <label className="tb-v2-tool-label">Select Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="tb-v2-input"
          />
        </div>

        {images.length > 0 && (
          <>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="tb-v2-tool-label">Width</label>
                <input
                  type="number"
                  value={canvasSize.width}
                  onChange={(e) => setCanvasSize((s) => ({ ...s, width: Number(e.target.value) }))}
                  className="tb-v2-input"
                  min={100}
                  max={4000}
                />
              </div>
              <div>
                <label className="tb-v2-tool-label">Height</label>
                <input
                  type="number"
                  value={canvasSize.height}
                  onChange={(e) => setCanvasSize((s) => ({ ...s, height: Number(e.target.value) }))}
                  className="tb-v2-input"
                  min={100}
                  max={4000}
                />
              </div>
              <div>
                <label className="tb-v2-tool-label">Spacing</label>
                <input
                  type="number"
                  value={spacing}
                  onChange={(e) => setSpacing(Number(e.target.value))}
                  className="tb-v2-input"
                  min={0}
                  max={100}
                />
              </div>
            </div>

            <div>
              <label className="tb-v2-tool-label">Layout</label>
              <select
                value={layout}
                onChange={(e) => setLayout(e.target.value as 'grid' | 'horizontal' | 'vertical')}
                className="tb-v2-input"
              >
                <option value="grid">Grid</option>
                <option value="horizontal">Horizontal</option>
                <option value="vertical">Vertical</option>
              </select>
            </div>

            <div>
              <label className="tb-v2-tool-label">Images ({images.length})</label>
              <div className="flex flex-wrap gap-2">
                {images.map((img) => (
                  <div
                    key={img.id}
                    className={`relative group cursor-pointer border-2 rounded-lg overflow-hidden ${
                      selectedId === img.id ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                    }`}
                    onClick={() => setSelectedId(img.id)}
                  >
                    <img src={img.preview} alt="" className="w-16 h-16 object-cover" />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeImage(img.id); }}
                      className="absolute top-0 right-0 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden" ref={containerRef}>
        <canvas ref={canvasRef} className="w-full h-auto bg-white" />
      </div>

      <div className="flex gap-2">
        <button type="button" onClick={renderCanvas} className="tb-v2-btn flex-1" disabled={images.length === 0}>
          Update Preview
        </button>
        <button type="button" onClick={downloadComposite} className="tb-v2-btn flex-1" disabled={images.length === 0}>
          Download PNG
        </button>
      </div>

      <p className="text-xs text-amber-600 dark:text-amber-400 text-center">
        ⚠️ Preview only. Final output quality may vary.
      </p>
    </div>
  );
}
