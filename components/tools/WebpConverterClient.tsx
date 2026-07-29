'use client';

import { useState, useRef, useCallback } from 'react';

type QualityLevel = 'low' | 'medium' | 'high' | 'maximum';

export default function WebpConverterClient() {
  const [image, setImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [quality, setQuality] = useState<QualityLevel>('high');
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [convertedSize, setConvertedSize] = useState<number>(0);
  const [isConverting, setIsConverting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const qualityValues: Record<QualityLevel, number> = {
    low: 0.3,
    medium: 0.5,
    high: 0.8,
    maximum: 1.0,
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOriginalSize(file.size);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setProcessedImage(null);
        setConvertedSize(0);
      };
      reader.readAsDataURL(file);
    }
  };

  const convertToWebp = useCallback(() => {
    if (!image || !canvasRef.current) return;

    setIsConverting(true);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      const qualityValue = qualityValues[quality];
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const reader = new FileReader();
            reader.onload = (event) => {
              setProcessedImage(event.target?.result as string);
              setConvertedSize(blob.size);
              setIsConverting(false);
            };
            reader.readAsDataURL(blob);
          } else {
            setIsConverting(false);
            alert('Failed to convert image to WebP. Your browser may not support this format.');
          }
        },
        'image/webp',
        qualityValue
      );
    };
    img.src = image;
  }, [image, quality, qualityValues]);

  const handleDownload = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.download = 'converted.webp';
    link.href = processedImage;
    link.click();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const calculateSavings = (): string => {
    if (originalSize === 0 || convertedSize === 0) return '';
    const savings = ((originalSize - convertedSize) / originalSize) * 100;
    if (savings > 0) {
      return `${savings.toFixed(1)}% smaller`;
    }
    return `${Math.abs(savings).toFixed(1)}% larger`;
  };

  return (
    <div className="tb-v2-flex tb-v2-flex-col tb-v2-gap-4 tb-v2-p-4">
      <h2 className="tb-v2-text-2xl tb-v2-font-bold">WebP Converter</h2>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="tb-v2-file-input"
      />

      {image && (
        <>
          <div className="tb-v2-flex tb-v2-flex-col tb-v2-gap-2">
            <label className="tb-v2-text-sm tb-v2-font-medium">Quality</label>
            <div className="tb-v2-flex tb-v2-gap-2">
              {(['low', 'medium', 'high', 'maximum'] as QualityLevel[]).map((q) => (
                <button
                  key={q}
                  onClick={() => setQuality(q)}
                  className={`tb-v2-btn ${quality === q ? 'tb-v2-btn-primary' : 'tb-v2-btn-secondary'}`}
                >
                  {q.charAt(0).toUpperCase() + q.slice(1)}
                </button>
              ))}
            </div>
            <p className="tb-v2-text-xs tb-v2-text-gray-500">
              {quality === 'low' && 'Smallest file, lower quality (30%)'}
              {quality === 'medium' && 'Balanced quality and size (50%)'}
              {quality === 'high' && 'High quality, good compression (80%)'}
              {quality === 'maximum' && 'Best quality, larger file (100%)'}
            </p>
          </div>

          <button
            onClick={convertToWebp}
            disabled={isConverting}
            className="tb-v2-btn tb-v2-btn-primary tb-v2-disabled:opacity-50"
          >
            {isConverting ? 'Converting...' : 'Convert to WebP'}
          </button>
        </>
      )}

      <canvas ref={canvasRef} className="tb-v2-hidden" />

      {image && (
        <div className="tb-v2-mt-4">
          <p className="tb-v2-tool-label" style={{marginBottom:8}}>Original</p>
          <img src={image} alt="Original" className="tb-v2-max-w-full tb-v2-rounded-lg" />
          <p className="tb-v2-text-xs tb-v2-text-gray-500 tb-v2-mt-1">
            {formatFileSize(originalSize)}
          </p>
        </div>
      )}

      {processedImage && (
        <div className="tb-v2-mt-4">
          <p className="tb-v2-tool-label" style={{marginBottom:8}}>WebP Result</p>
          <img src={processedImage} alt="WebP" className="tb-v2-max-w-full tb-v2-rounded-lg" />
          <div className="tb-v2-flex tb-v2-items-center tb-v2-gap-4 tb-v2-mt-1">
            <p className="tb-v2-text-xs tb-v2-text-gray-500">
              {formatFileSize(convertedSize)}
            </p>
            {calculateSavings() && (
              <span className={`tb-v2-text-xs tb-v2-font-medium ${convertedSize < originalSize ? 'tb-v2-text-green-600' : 'tb-v2-text-red-600'}`}>
                {calculateSavings()}
              </span>
            )}
          </div>
          <button onClick={handleDownload} className="tb-v2-btn tb-v2-btn-secondary tb-v2-mt-2">
            Download WebP
          </button>
        </div>
      )}

      <div className="tb-v2-text-sm tb-v2-text-gray-500 tb-v2-mt-4">
        <p className="tb-v2-font-medium">About WebP:</p>
        <p>WebP is a modern image format developed by Google that provides superior compression for images on the web. It supports both lossy and lossless compression and is widely supported in modern browsers.</p>
      </div>
    </div>
  );
}