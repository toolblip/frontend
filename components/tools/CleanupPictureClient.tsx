'use client';

import { useState, useRef } from 'react';

interface CleanupOptions {
  removeBackground: boolean;
  enhanceColors: boolean;
  adjustBrightness: number;
  adjustContrast: number;
  removeNoise: boolean;
}

export default function CleanupPictureClient() {
  const [image, setImage] = useState<string | null>(null);
  const [options, setOptions] = useState<CleanupOptions>({
    removeBackground: false,
    enhanceColors: false,
    adjustBrightness: 100,
    adjustContrast: 100,
    removeNoise: false,
  });
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
      setProcessedImage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) loadFile(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) loadFile(file);
  };

  const processImage = () => {
    if (!image) return;

    setIsProcessing(true);

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;

      let filterString = '';
      if (options.adjustBrightness !== 100) {
        filterString += `brightness(${options.adjustBrightness}%) `;
      }
      if (options.adjustContrast !== 100) {
        filterString += `contrast(${options.adjustContrast}%) `;
      }
      if (options.enhanceColors) {
        filterString += 'saturate(1.2) ';
      }

      ctx.filter = filterString || 'none';
      ctx.drawImage(img, 0, 0);

      if (options.removeBackground || options.removeNoise) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        if (options.removeNoise) {
          for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = data[i] * 0.8 + avg * 0.2;
            data[i + 1] = data[i + 1] * 0.8 + avg * 0.2;
            data[i + 2] = data[i + 2] * 0.8 + avg * 0.2;
          }
        }

        if (options.removeBackground) {
          const { width, height } = canvas;
          const cornerIdx = [
            0,
            (width - 1) * 4,
            (height - 1) * width * 4,
            ((height - 1) * width + (width - 1)) * 4,
          ];
          let bgR = 0, bgG = 0, bgB = 0;
          cornerIdx.forEach((idx) => {
            bgR += data[idx];
            bgG += data[idx + 1];
            bgB += data[idx + 2];
          });
          bgR /= cornerIdx.length;
          bgG /= cornerIdx.length;
          bgB /= cornerIdx.length;

          const threshold = 40;
          for (let i = 0; i < data.length; i += 4) {
            const dr = data[i] - bgR;
            const dg = data[i + 1] - bgG;
            const db = data[i + 2] - bgB;
            const dist = Math.sqrt(dr * dr + dg * dg + db * db);
            if (dist < threshold) data[i + 3] = 0;
          }
        }

        ctx.putImageData(imageData, 0, 0);
      }

      setProcessedImage(canvas.toDataURL('image/png'));
      setIsProcessing(false);
    };
    img.src = image;
  };

  const downloadImage = () => {
    if (!processedImage) return;

    const link = document.createElement('a');
    link.download = 'cleaned-image.png';
    link.href = processedImage;
    link.click();
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="tb-v2-section" style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '16px 20px' }}>
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${isDragging ? 'var(--tb-accent, #4f46e5)' : 'var(--tb-border)'}`,
            borderRadius: 8,
            padding: '28px 16px',
            textAlign: 'center',
            cursor: 'pointer',
          }}
        >
          <div style={{ fontSize: 28 }}>🖼️</div>
          <p className="tb-v2-tool-label" style={{ marginTop: 8 }}>
            Drop an image here or click to upload
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        <div className="p-4 border rounded space-y-4">
          <h3 className="font-medium">Cleanup Options</h3>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={options.removeBackground}
              onChange={(e) =>
                setOptions({ ...options, removeBackground: e.target.checked })
              }
            />
            <span>Remove Background (near-uniform edges)</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={options.enhanceColors}
              onChange={(e) =>
                setOptions({ ...options, enhanceColors: e.target.checked })
              }
            />
            <span>Enhance Colors</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={options.removeNoise}
              onChange={(e) =>
                setOptions({ ...options, removeNoise: e.target.checked })
              }
            />
            <span>Remove Noise</span>
          </label>

          <div className="tb-v2-range-row">
            <label className="tb-v2-tool-label">Brightness</label>
            <span className="tb-v2-range-val">{options.adjustBrightness}%</span>
          </div>
          <input
            type="range"
            min="50"
            max="150"
            value={options.adjustBrightness}
            onChange={(e) =>
              setOptions({ ...options, adjustBrightness: Number(e.target.value) })
            }
            className="tb-v2-range"
          />

          <div className="tb-v2-range-row">
            <label className="tb-v2-tool-label">Contrast</label>
            <span className="tb-v2-range-val">{options.adjustContrast}%</span>
          </div>
          <input
            type="range"
            min="50"
            max="150"
            value={options.adjustContrast}
            onChange={(e) =>
              setOptions({ ...options, adjustContrast: Number(e.target.value) })
            }
            className="tb-v2-range"
          />
        </div>

        <button
          type="button"
          onClick={processImage}
          disabled={!image || isProcessing}
          className="tb-v2-btn tb-v2-btn-primary"
        >
          {isProcessing ? 'Processing...' : 'Clean Up Image'}
        </button>
      </div>

      <div className="tb-v2-section" style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '16px 20px' }}>
        {!image && (
          <p className="tb-v2-empty">Upload an image to preview it here and clean it up.</p>
        )}

        {image && (
          <div>
            <h3 className="font-medium mb-2">Original Image</h3>
            <img
              src={image}
              alt="Original"
              className="max-w-full rounded border"
            />
          </div>
        )}

        {processedImage && (
          <div>
            <h3 className="font-medium mb-2">Processed Image</h3>
            <img
              src={processedImage}
              alt="Processed"
              className="max-w-full rounded border"
            />
            <button
              type="button"
              onClick={downloadImage}
              className="tb-v2-btn tb-v2-btn-primary"
              style={{ marginTop: 8 }}
            >
              Download Image
            </button>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
