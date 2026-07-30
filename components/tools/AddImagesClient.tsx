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
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((files: File[]) => {
    const newImages: ImageItem[] = files
      .filter(f => f.type.startsWith('image/'))
      .map((file) => ({
        id: Math.random().toString(36).substring(2, 9),
        file,
        preview: URL.createObjectURL(file),
        x: 0, y: 0, scale: 1, zIndex: images.length,
      }));
    setImages(prev => [...prev, ...newImages]);
  }, [images.length]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(Array.from(e.target.files || []));
    e.target.value = '';
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(Array.from(e.dataTransfer.files));
  };

  const removeImage = (id: string) => {
    setImages(prev => {
      const img = prev.find(i => i.id === id);
      if (img) URL.revokeObjectURL(img.preview);
      return prev.filter(i => i.id !== id);
    });
    if (selectedId === id) setSelectedId(null);
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
            ctx.drawImage(imgEl, x + (imgWidth - drawW) / 2, y + (imgHeight - drawH) / 2, drawW, drawH);
            resolve();
          };
          imgEl.onerror = () => resolve();
        });
      }
    } else {
      let current = spacing;
      for (const img of sortedImages) {
        const imgEl = new Image();
        imgEl.src = img.preview;
        await new Promise<void>((resolve) => {
          imgEl.onload = () => {
            const isHoriz = layout === 'horizontal';
            const maxDim = isHoriz ? canvasSize.height : canvasSize.width;
            const scale = Math.min(1, (maxDim - spacing * 2) / (isHoriz ? imgEl.height : imgEl.width));
            const drawW = imgEl.width * scale * 0.8;
            const drawH = imgEl.height * scale * 0.8;
            if (isHoriz) {
              ctx.drawImage(imgEl, current, (canvasSize.height - drawH) / 2, drawW, drawH);
              current += drawW + spacing;
            } else {
              ctx.drawImage(imgEl, (canvasSize.width - drawW) / 2, current, drawW, drawH);
              current += drawH + spacing;
            }
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
    <div>
      {/* Upload area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => fileRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          isDragging
            ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500'
        }`}
      >
        <div className="text-4xl mb-2">🖼️</div>
        <p className="text-gray-600 dark:text-gray-400">
          {isDragging ? 'Drop images here' : 'Click or drag images to combine'}
        </p>
        <p className="text-xs text-gray-500 mt-1">Select multiple images</p>
      </div>

      <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFileSelect} className="hidden" />

      {/* Settings */}
      {images.length > 0 && (
        <>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="tb-v2-tool-label">Width</label>
              <input type="number" value={canvasSize.width} onChange={(e) => setCanvasSize(s => ({ ...s, width: Number(e.target.value) }))} className="tb-v2-input" />
            </div>
            <div>
              <label className="tb-v2-tool-label">Height</label>
              <input type="number" value={canvasSize.height} onChange={(e) => setCanvasSize(s => ({ ...s, height: Number(e.target.value) }))} className="tb-v2-input" />
            </div>
            <div>
              <label className="tb-v2-tool-label">Spacing</label>
              <input type="number" value={spacing} onChange={(e) => setSpacing(Number(e.target.value))} className="tb-v2-input" min={0} max={100} />
            </div>
          </div>

          {/* Layout selector */}
          <div className="flex gap-2">
            {(['grid', 'horizontal', 'vertical'] as const).map(l => (
              <button
                key={l}
                onClick={() => setLayout(l)}
                className={`flex-1 p-2 rounded-lg text-sm capitalize transition-colors ${
                  layout === l
                    ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700'
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {l === 'grid' ? '⊞' : l === 'horizontal' ? '↔' : '↕'} {l}
              </button>
            ))}
          </div>

          {/* Image list */}
          <div className="flex flex-wrap gap-2">
            {images.map(img => (
              <div
                key={img.id}
                className={`relative group cursor-pointer border-2 rounded-lg overflow-hidden ${
                  selectedId === img.id ? 'border-indigo-500' : 'border-gray-200 dark:border-gray-700'
                }`}
                onClick={() => setSelectedId(img.id)}
              >
                <img src={img.preview} alt="" className="w-16 h-16 object-cover" />
                <button
                  onClick={(e) => { e.stopPropagation(); removeImage(img.id); }}
                  className="absolute top-0 right-0 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >✕</button>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button onClick={renderCanvas} className="tb-v2-btn tb-v2-btn-primary flex-1">
              🔄 Update Preview
            </button>
            <button onClick={downloadComposite} className="tb-v2-btn tb-v2-btn-primary flex-1">
              ⬇️ Download PNG
            </button>
          </div>
        </>
      )}

      {/* Canvas preview */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-auto bg-white" />
      </div>

      {!images.length && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-2">🖼️</div>
          <p>Upload images to combine them</p>
        </div>
      )}
    </div>
  );
}
