'use client';

import { useState, useRef } from 'react';

type OutputFormat = 'jpeg' | 'png' | 'webp';

export default function ImageCompressorClient() {
  const [image, setImage] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState<OutputFormat>('jpeg');
  const [isCompressing, setIsCompressing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
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
        setCompressedSize(0);
        
        // Get dimensions
        const img = new Image();
        img.onload = () => {
          setOriginalDimensions({ width: img.width, height: img.height });
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const compressImage = () => {
    if (!image || !canvasRef.current) return;

    setIsCompressing(true);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const mimeType = `image/${format}`;
      const compressed = canvas.toDataURL(mimeType, quality / 100);
      
      // Calculate approximate compressed size from base64
      const base64Length = compressed.split(',')[1]?.length || 0;
      const sizeInBytes = Math.ceil(base64Length * 0.75);
      
      setResult(compressed);
      setCompressedSize(sizeInBytes);
      setIsCompressing(false);
    };
    img.src = image;
  };

  const handleDownload = () => {
    if (!result) return;
    const link = document.createElement('a');
    link.download = `compressed.${format}`;
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

  const compressionRatio = originalSize > 0 && compressedSize > 0
    ? Math.round((1 - compressedSize / originalSize) * 100)
    : 0;

  return (
    <div className="tb-v2-flex tb-v2-flex-col tb-v2-gap-4 tb-v2-p-4">
      <h2 className="tb-v2-text-2xl tb-v2-font-bold">Image Compressor</h2>
      <p className="tb-v2-text-sm tb-v2-text-gray-500">Compress images with quality and format options</p>

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
                <p className="tb-v2-text-sm tb-v2-text-gray-500">Compressed</p>
                <img src={result} alt="Compressed" className="tb-v2-max-w-full tb-v2-max-h-[200px] tb-v2-object-contain tb-v2-rounded" />
                <div className="tb-v2-text-sm tb-v2-mt-1">
                  <p>{formatBytes(compressedSize)}</p>
                </div>
              </div>
            )}
          </div>

          <div className="tb-v2-card">
            <h3 className="tb-v2-text-sm tb-v2-font-semibold tb-v2-mb-2">Output Format</h3>
            <div className="tb-v2-flex tb-v2-gap-2">
              <button
                onClick={() => setFormat('jpeg')}
                className={`tb-v2-btn ${format === 'jpeg' ? 'tb-v2-btn-primary' : 'tb-v2-btn-secondary'}`}
              >
                JPEG
              </button>
              <button
                onClick={() => setFormat('png')}
                className={`tb-v2-btn ${format === 'png' ? 'tb-v2-btn-primary' : 'tb-v2-btn-secondary'}`}
              >
                PNG
              </button>
              <button
                onClick={() => setFormat('webp')}
                className={`tb-v2-btn ${format === 'webp' ? 'tb-v2-btn-primary' : 'tb-v2-btn-secondary'}`}
              >
                WebP
              </button>
            </div>
            <p className="tb-v2-text-xs tb-v2-text-gray-500 tb-v2-mt-2">
              {format === 'jpeg' && 'Good for photos. Lossy compression with adjustable quality.'}
              {format === 'png' && 'Good for graphics. Lossless but larger file sizes.'}
              {format === 'webp' && 'Modern format. Best compression with quality control.'}
            </p>
          </div>

          <div className="tb-v2-flex tb-v2-flex-col tb-v2-gap-2">
            <div className="tb-v2-flex tb-v2-justify-between tb-v2-items-center">
              <label className="tb-v2-text-sm tb-v2-font-medium">Quality</label>
              <span className="tb-v2-text-sm tb-v2-font-medium">{quality}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="tb-v2-range"
            />
            <p className="tb-v2-text-xs tb-v2-text-gray-500">
              Lower quality = smaller file size. 80% is usually a good balance.
            </p>
          </div>

          <button
            onClick={compressImage}
            disabled={isCompressing}
            className="tb-v2-btn tb-v2-btn-primary tb-v2-disabled:opacity-50"
          >
            {isCompressing ? 'Compressing...' : 'Compress Image'}
          </button>
        </div>
      )}

      <canvas ref={canvasRef} className="tb-v2-hidden" />

      {result && (
        <div className="tb-v2-flex tb-v2-flex-col tb-v2-gap-2 tb-v2-card tb-v2-bg-green-50">
          <div className="tb-v2-flex tb-v2-justify-between tb-v2-items-center">
            <p className="tb-v2-text-sm tb-v2-font-medium">Compression Result</p>
            <span className={`tb-v2-text-lg tb-v2-font-bold ${compressionRatio > 0 ? 'tb-v2-text-green-600' : 'tb-v2-text-red-600'}`}>
              {compressionRatio > 0 ? `-${compressionRatio}%` : `+${Math.abs(compressionRatio)}%`}
            </span>
          </div>
          <div className="tb-v2-grid tb-v2-grid-cols-2 tb-v2-gap-2 tb-v2-text-sm">
            <div>Original: <span className="tb-v2-font-medium">{formatBytes(originalSize)}</span></div>
            <div>Compressed: <span className="tb-v2-font-medium">{formatBytes(compressedSize)}</span></div>
          </div>
          <button onClick={handleDownload} className="tb-v2-btn tb-v2-btn-secondary">
            Download {format.toUpperCase()}
          </button>
        </div>
      )}
    </div>
  );
}
