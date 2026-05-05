'use client';

import { useState, useRef } from 'react';

type OutputFormat = 'jpeg' | 'png' | 'webp';

interface OptimizationSettings {
  quality: number;
  maxWidth: number;
  maxHeight: number;
  maintainAspectRatio: boolean;
  format: OutputFormat;
}

export default function ImageOptimizerClient() {
  const [image, setImage] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [optimizedSize, setOptimizedSize] = useState<number>(0);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  const [outputDimensions, setOutputDimensions] = useState({ width: 0, height: 0 });
  const [settings, setSettings] = useState<OptimizationSettings>({
    quality: 80,
    maxWidth: 1920,
    maxHeight: 1080,
    maintainAspectRatio: true,
    format: 'jpeg'
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOriginalSize(file.size);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setResult(null);
        setOptimizedSize(0);
        
        const img = new Image();
        img.onload = () => {
          setOriginalDimensions({ width: img.width, height: img.height });
          setOutputDimensions({ width: img.width, height: img.height });
          setSettings(prev => ({
            ...prev,
            maxWidth: img.width,
            maxHeight: img.height
          }));
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const optimizeImage = () => {
    if (!image || !canvasRef.current) return;

    setIsOptimizing(true);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      let { width, height } = { width: img.width, height: img.height };

      // Calculate new dimensions
      if (settings.maintainAspectRatio) {
        const widthRatio = settings.maxWidth / width;
        const heightRatio = settings.maxHeight / height;
        const ratio = Math.min(widthRatio, heightRatio);
        
        if (ratio < 1) {
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
      } else {
        width = settings.maxWidth;
        height = settings.maxHeight;
      }

      canvas.width = width;
      canvas.height = height;
      
      // Use high-quality image scaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      const mimeType = `image/${settings.format}`;
      const optimized = canvas.toDataURL(mimeType, settings.quality / 100);
      
      const base64Length = optimized.split(',')[1]?.length || 0;
      const sizeInBytes = Math.ceil(base64Length * 0.75);
      
      setResult(optimized);
      setOptimizedSize(sizeInBytes);
      setOutputDimensions({ width, height });
      setIsOptimizing(false);
    };
    img.src = image;
  };

  const handleDownload = () => {
    if (!result) return;
    const link = document.createElement('a');
    link.download = `optimized.${settings.format}`;
    link.href = result;
    link.click();
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const reductionPercent = originalSize > 0 && optimizedSize > 0
    ? Math.round((1 - optimizedSize / originalSize) * 100)
    : 0;

  return (
    <div className="tb-v2-flex tb-v2-flex-col tb-v2-gap-4 tb-v2-p-4">
      <h2 className="tb-v2-text-2xl tb-v2-font-bold">Image Optimizer</h2>
      <p className="tb-v2-text-sm tb-v2-text-gray-500">Resize, compress, and convert images all in one</p>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="tb-v2-file-input"
      />

      {image && (
        <div className="tb-v2-flex tb-v2-flex-col tb-v2-gap-4">
          <div className="tb-v2-grid tb-v2-grid-cols-2 tb-v2-gap-4">
            <div>
              <p className="tb-v2-text-sm tb-v2-text-gray-500">Original</p>
              <img src={image} alt="Original" className="tb-v2-max-w-full tb-v2-max-h-[200px] tb-v2-object-contain tb-v2-rounded" />
              <div className="tb-v2-text-sm tb-v2-mt-1">
                <p>{formatBytes(originalSize)}</p>
                <p className="tb-v2-text-gray-400">{originalDimensions.width} × {originalDimensions.height}</p>
              </div>
            </div>
            {result && (
              <div>
                <p className="tb-v2-text-sm tb-v2-text-gray-500">Optimized</p>
                <img src={result} alt="Optimized" className="tb-v2-max-w-full tb-v2-max-h-[200px] tb-v2-object-contain tb-v2-rounded" />
                <div className="tb-v2-text-sm tb-v2-mt-1">
                  <p>{formatBytes(optimizedSize)}</p>
                  <p className="tb-v2-text-gray-400">{outputDimensions.width} × {outputDimensions.height}</p>
                </div>
              </div>
            )}
          </div>

          <div className="tb-v2-card">
            <h3 className="tb-v2-text-sm tb-v2-font-semibold tb-v2-mb-3">Dimensions</h3>
            <div className="tb-v2-grid tb-v2-grid-cols-2 tb-v2-gap-4">
              <div>
                <label className="tb-v2-text-xs tb-v2-text-gray-500">Max Width</label>
                <input
                  type="number"
                  value={settings.maxWidth}
                  onChange={(e) => setSettings(prev => ({ ...prev, maxWidth: Number(e.target.value) }))}
                  className="tb-v2-input tb-v2-w-full"
                  min="1"
                />
              </div>
              <div>
                <label className="tb-v2-text-xs tb-v2-text-gray-500">Max Height</label>
                <input
                  type="number"
                  value={settings.maxHeight}
                  onChange={(e) => setSettings(prev => ({ ...prev, maxHeight: Number(e.target.value) }))}
                  className="tb-v2-input tb-v2-w-full"
                  min="1"
                />
              </div>
            </div>
            <label className="tb-v2-flex tb-v2-items-center tb-v2-gap-2 tb-v2-mt-2 tb-v2-text-sm">
              <input
                type="checkbox"
                checked={settings.maintainAspectRatio}
                onChange={(e) => setSettings(prev => ({ ...prev, maintainAspectRatio: e.target.checked }))}
                className="tb-v2-checkbox"
              />
              Maintain aspect ratio
            </label>
          </div>

          <div className="tb-v2-card">
            <h3 className="tb-v2-text-sm tb-v2-font-semibold tb-v2-mb-3">Output Format</h3>
            <div className="tb-v2-flex tb-v2-gap-2">
              <button
                onClick={() => setSettings(prev => ({ ...prev, format: 'jpeg' }))}
                className={`tb-v2-btn ${settings.format === 'jpeg' ? 'tb-v2-btn-primary' : 'tb-v2-btn-secondary'}`}
              >
                JPEG
              </button>
              <button
                onClick={() => setSettings(prev => ({ ...prev, format: 'png' }))}
                className={`tb-v2-btn ${settings.format === 'png' ? 'tb-v2-btn-primary' : 'tb-v2-btn-secondary'}`}
              >
                PNG
              </button>
              <button
                onClick={() => setSettings(prev => ({ ...prev, format: 'webp' }))}
                className={`tb-v2-btn ${settings.format === 'webp' ? 'tb-v2-btn-primary' : 'tb-v2-btn-secondary'}`}
              >
                WebP
              </button>
            </div>
          </div>

          <div className="tb-v2-card">
            <h3 className="tb-v2-text-sm tb-v2-font-semibold tb-v2-mb-3">Quality</h3>
            <div className="tb-v2-flex tb-v2-justify-between tb-v2-items-center">
              <label className="tb-v2-text-sm">Compression Level</label>
              <span className="tb-v2-text-sm tb-v2-font-medium">{settings.quality}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={settings.quality}
              onChange={(e) => setSettings(prev => ({ ...prev, quality: Number(e.target.value) }))}
              className="tb-v2-range"
            />
            <div className="tb-v2-flex tb-v2-justify-between tb-v2-text-xs tb-v2-text-gray-500 tb-v2-mt-1">
              <span>Smaller File</span>
              <span>Higher Quality</span>
            </div>
          </div>

          <button
            onClick={optimizeImage}
            disabled={isOptimizing}
            className="tb-v2-btn tb-v2-btn-primary tb-v2-disabled:opacity-50"
          >
            {isOptimizing ? 'Optimizing...' : 'Optimize Image'}
          </button>
        </div>
      )}

      <canvas ref={canvasRef} className="tb-v2-hidden" />

      {result && (
        <div className="tb-v2-flex tb-v2-flex-col tb-v2-gap-3 tb-v2-card tb-v2-bg-green-50">
          <div className="tb-v2-flex tb-v2-justify-between tb-v2-items-center">
            <p className="tb-v2-text-sm tb-v2-font-medium">Optimization Complete</p>
            <span className={`tb-v2-text-lg tb-v2-font-bold ${reductionPercent > 0 ? 'tb-v2-text-green-600' : 'tb-v2-text-red-600'}`}>
              {reductionPercent > 0 ? `-${reductionPercent}%` : `+${Math.abs(reductionPercent)}%`}
            </span>
          </div>
          <div className="tb-v2-grid tb-v2-grid-cols-2 tb-v2-gap-2 tb-v2-text-sm">
            <div>Original: <span className="tb-v2-font-medium">{formatBytes(originalSize)}</span></div>
            <div>Optimized: <span className="tb-v2-font-medium">{formatBytes(optimizedSize)}</span></div>
            <div>Dimensions: <span className="tb-v2-font-medium">{originalDimensions.width}×{originalDimensions.height}</span></div>
            <div>→ <span className="tb-v2-font-medium">{outputDimensions.width}×{outputDimensions.height}</span></div>
          </div>
          <button onClick={handleDownload} className="tb-v2-btn tb-v2-btn-secondary">
            Download Optimized Image
          </button>
        </div>
      )}
    </div>
  );
}
