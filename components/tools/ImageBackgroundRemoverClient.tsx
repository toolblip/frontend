'use client';

import { useState, useRef, useCallback } from 'react';

type RemovalMethod = 'floodfill' | 'chroma';

export default function ImageBackgroundRemoverClient() {
  const [image, setImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [method, setMethod] = useState<RemovalMethod>('floodfill');
  const [tolerance, setTolerance] = useState(32);
  const [chromaKeyColor, setChromaKeyColor] = useState('#00ff00');
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setProcessedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  };

  const colorDistance = (c1: { r: number; g: number; b: number }, c2: { r: number; g: number; b: number }): number => {
    return Math.sqrt(
      Math.pow(c1.r - c2.r, 2) +
      Math.pow(c1.g - c2.g, 2) +
      Math.pow(c1.b - c2.b, 2)
    );
  };

  const removeBackground = useCallback(() => {
    if (!image || !canvasRef.current) return;

    setIsProcessing(true);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      if (method === 'floodfill') {
        // Flood fill from corners to detect background
        removeBackgroundFloodFill(data, canvas.width, canvas.height);
      } else {
        // Chroma key removal
        const keyColor = hexToRgb(chromaKeyColor);
        removeChromaKey(data, canvas.width, canvas.height, keyColor);
      }

      ctx.putImageData(imageData, 0, 0);
      setProcessedImage(canvas.toDataURL('image/png'));
      setIsProcessing(false);
    };
    img.src = image;
  }, [image, method, tolerance, chromaKeyColor]);

  const removeBackgroundFloodFill = (data: Uint8ClampedArray, width: number, height: number) => {
    // One flag per pixel (not a Set<string> of index strings) - avoids
    // allocating/hashing a string per pixel, which otherwise dominates
    // runtime on any real photo.
    const visited = new Uint8Array(width * height);
    const cornerColors: { r: number; g: number; b: number }[] = [];

    // Sample corner pixels to determine background color
    const corners = [
      0, // top-left
      (width - 1) * 4, // top-right
      (height - 1) * width * 4, // bottom-left
      ((height - 1) * width + (width - 1)) * 4, // bottom-right
    ];

    corners.forEach((i) => {
      cornerColors.push({
        r: data[i],
        g: data[i + 1],
        b: data[i + 2],
      });
    });

    // Use average of corner colors as background
    const bgColor = {
      r: Math.round(cornerColors.reduce((sum, c) => sum + c.r, 0) / cornerColors.length),
      g: Math.round(cornerColors.reduce((sum, c) => sum + c.g, 0) / cornerColors.length),
      b: Math.round(cornerColors.reduce((sum, c) => sum + c.b, 0) / cornerColors.length),
    };

    // Flood fill from all corners. `fillQueue` holds pixel *indices*
    // (0..width*height-1), not byte offsets - kept as a growable array
    // read via an advancing `head` pointer instead of `.shift()`, which is
    // O(n) per call and turns this into an O(n^2) walk on any real photo
    // (a 1920x1080 image is ~2M pixels).
    const fillQueue: number[] = [];
    let head = 0;

    const enqueue = (idx: number) => {
      if (!visited[idx]) {
        visited[idx] = 1;
        fillQueue.push(idx);
      }
    };

    corners.forEach((byteIdx) => enqueue(byteIdx / 4));

    while (head < fillQueue.length) {
      const idx = fillQueue[head++];
      const pixelIdx = idx * 4;
      const x = idx % width;
      const y = Math.floor(idx / width);

      const pixelColor = {
        r: data[pixelIdx],
        g: data[pixelIdx + 1],
        b: data[pixelIdx + 2],
      };

      if (colorDistance(pixelColor, bgColor) <= tolerance) {
        // Make transparent
        data[pixelIdx + 3] = 0;

        // 4-connected neighbors. Left/right are only added when still on
        // the same row - `y * width + (x - 1)` / `(x + 1)` without that
        // check silently wraps into the previous/next row at the image
        // edges (a background-colored region that's genuinely
        // disconnected from every corner could get erased anyway through
        // that phantom edge).
        if (y > 0) enqueue(idx - width);
        if (y < height - 1) enqueue(idx + width);
        if (x > 0) enqueue(idx - 1);
        if (x < width - 1) enqueue(idx + 1);
      }
    }
  };

  const removeChromaKey = (data: Uint8ClampedArray, width: number, height: number, keyColor: { r: number; g: number; b: number }) => {
    for (let i = 0; i < data.length; i += 4) {
      const pixelColor = {
        r: data[i],
        g: data[i + 1],
        b: data[i + 2],
      };

      if (colorDistance(pixelColor, keyColor) <= tolerance) {
        data[i + 3] = 0; // Make transparent
      }
    }
  };

  const handleDownload = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.download = 'image-no-background.png';
    link.href = processedImage;
    link.click();
  };

  return (
    <div className="tb-v2-flex tb-v2-flex-col tb-v2-gap-4 tb-v2-p-4">
      <h2 className="tb-v2-text-2xl tb-v2-font-bold">Background Remover</h2>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="tb-v2-file-input"
      />

      {image && (
        <>
          <div className="tb-v2-flex tb-v2-gap-2">
            <button
              onClick={() => setMethod('floodfill')}
              className={`tb-v2-btn ${method === 'floodfill' ? 'tb-v2-btn-primary' : 'tb-v2-btn-secondary'}`}
            >
              Auto Detect
            </button>
            <button
              onClick={() => setMethod('chroma')}
              className={`tb-v2-btn ${method === 'chroma' ? 'tb-v2-btn-primary' : 'tb-v2-btn-secondary'}`}
            >
              Color Key
            </button>
          </div>

          {method === 'chroma' && (
            <div className="tb-v2-flex tb-v2-items-center tb-v2-gap-4">
              <label className="tb-v2-text-sm tb-v2-font-medium">Key Color:</label>
              <input
                type="color"
                value={chromaKeyColor}
                onChange={(e) => setChromaKeyColor(e.target.value)}
                className="tb-v2-w-10 tb-v2-h-10 tb-v2-rounded"
              />
            </div>
          )}

          <div className="tb-v2-flex tb-v2-items-center tb-v2-gap-4">
            <label className="tb-v2-text-sm tb-v2-font-medium">Tolerance: {tolerance}</label>
            <input
              type="range"
              min="1"
              max="128"
              value={tolerance}
              onChange={(e) => setTolerance(Number(e.target.value))}
              className="tb-v2-range"
            />
          </div>

          <button
            onClick={removeBackground}
            disabled={isProcessing}
            className="tb-v2-btn tb-v2-btn-primary tb-v2-disabled:opacity-50"
          >
            {isProcessing ? 'Processing...' : 'Remove Background'}
          </button>
        </>
      )}

      <canvas ref={canvasRef} className="tb-v2-hidden" />

      {image && (
        <div className="tb-v2-mt-4">
          <p className="tb-v2-tool-label" style={{marginBottom:8}}>Original</p>
          <img src={image} alt="Original" className="tb-v2-max-w-full tb-v2-rounded-lg" />
        </div>
      )}

      {processedImage && (
        <div className="tb-v2-mt-4">
          <p className="tb-v2-tool-label" style={{marginBottom:8}}>Result (with transparency)</p>
          <img src={processedImage} alt="No Background" className="tb-v2-max-w-full tb-v2-rounded-lg" style={{ backgroundImage: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAdgAAAHYBTnsmCAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAABUSURBVDiNY/z//z8DJYCJgUIwaAzFMEoYRMVA4Y5LQNNLUMNA4TYowg1QLIMaB4rXIFYN0PQC1HhQ4oBEukE1LpT4IOqB2BgBAE0cFfVvYI0lAAAAAElFTkSuQmCC")', backgroundRepeat: 'repeat' }} />
          <button onClick={handleDownload} className="tb-v2-btn tb-v2-btn-secondary tb-v2-mt-2">
            Download PNG
          </button>
        </div>
      )}

      <div className="tb-v2-text-sm tb-v2-text-gray-500 tb-v2-mt-4">
        <p className="tb-v2-font-medium">Tips:</p>
        <ul className="tb-v2-list-disc tb-v2-pl-5">
          <li><strong>Auto Detect:</strong> Samples corners to identify and remove background color</li>
          <li><strong>Color Key:</strong> Removes a specific color (e.g., green screen)</li>
          <li>Increase tolerance for more color variation in removal</li>
        </ul>
      </div>
    </div>
  );
}