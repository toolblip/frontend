'use client';

import { useState, useRef, useCallback } from 'react';

type RemovalMethod = 'floodfill' | 'chroma' | 'ai';

export default function ImageBackgroundRemoverClient() {
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [method, setMethod] = useState<RemovalMethod>('ai');
  const [tolerance, setTolerance] = useState(32);
  const [chromaKeyColor, setChromaKeyColor] = useState('#00ff00');
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiProgress, setAiProgress] = useState<number | null>(null);
  const [aiStage, setAiStage] = useState<'fetch' | 'compute'>('fetch');
  const [aiError, setAiError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Bumped on every upload so an in-flight AI request can tell it's been
  // superseded (e.g. the user picked a new image while a slow ~40MB model
  // download/inference was still running) and skip applying its stale result.
  const requestIdRef = useRef(0);
  // The currently-displayed processedImage, when it's a blob: URL (AI mode),
  // needs an explicit URL.revokeObjectURL or it leaks for the tab's lifetime.
  const processedBlobUrlRef = useRef<string | null>(null);

  const releaseProcessedBlobUrl = () => {
    if (processedBlobUrlRef.current) {
      URL.revokeObjectURL(processedBlobUrlRef.current);
      processedBlobUrlRef.current = null;
    }
  };

  const selectMethod = (next: RemovalMethod) => {
    setMethod(next);
    setAiError(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      requestIdRef.current += 1;
      releaseProcessedBlobUrl();
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setProcessedImage(null);
        setAiError(null);
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

  const removeBackgroundAI = useCallback(async () => {
    if (!imageFile) return;

    const requestId = ++requestIdRef.current;
    setIsProcessing(true);
    setAiProgress(0);
    setAiStage('fetch');
    setAiError(null);

    try {
      // Dynamically imported so this library and its onnxruntime-web
      // runtime dependency only ever load for someone who actually picks
      // AI Remove - everyone else never pays for it. The segmentation
      // model itself (~40MB, the quantized "small" model - trades a
      // little edge quality for a download size that's reasonable for a
      // free tool) is fetched separately from IMG.LY's CDN on first use.
      const { removeBackground: imglyRemoveBackground } = await import('@imgly/background-removal');
      const blob = await imglyRemoveBackground(imageFile, {
        model: 'isnet_quint8',
        progress: (key, current, total) => {
          if (requestIdRef.current !== requestId) return;
          // imgly reports progress in independent phases under different
          // key prefixes ("fetch:<asset>" per downloaded file, each
          // restarting its own byte count from 0; "compute:<stage>" during
          // inference, a 0-4 step counter unrelated to bytes) - treating
          // every call as one running percentage makes the number jump
          // backwards, so at minimum label which phase it's in.
          setAiStage(key.startsWith('fetch:') ? 'fetch' : 'compute');
          setAiProgress(total > 0 ? Math.round((current / total) * 100) : null);
        },
      });
      // Superseded by a newer upload/request while this was in flight -
      // drop the result instead of overwriting whatever the user is now
      // looking at.
      if (requestIdRef.current !== requestId) return;
      releaseProcessedBlobUrl();
      const url = URL.createObjectURL(blob);
      processedBlobUrlRef.current = url;
      setProcessedImage(url);
    } catch (err) {
      if (requestIdRef.current !== requestId) return;
      console.error('AI background removal failed:', err);
      setAiError(
        err instanceof Error
          ? `AI background removal failed: ${err.message}. Try Auto Detect or Color Key instead.`
          : 'AI background removal failed. Try Auto Detect or Color Key instead.'
      );
    } finally {
      if (requestIdRef.current === requestId) {
        setIsProcessing(false);
        setAiProgress(null);
      }
    }
  }, [imageFile]);

  const removeBackground = useCallback(() => {
    if (!image || !canvasRef.current) return;

    const requestId = ++requestIdRef.current;
    setIsProcessing(true);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsProcessing(false);
      return;
    }

    const img = new Image();
    img.onload = () => {
      if (requestIdRef.current !== requestId) return;
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

      releaseProcessedBlobUrl();
      ctx.putImageData(imageData, 0, 0);
      setProcessedImage(canvas.toDataURL('image/png'));
      setIsProcessing(false);
    };
    img.onerror = () => {
      if (requestIdRef.current !== requestId) return;
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

        // 4-connected neighbors. Left/right (`idx - 1` / `idx + 1`) are
        // only added when still on the same row - without the x-bounds
        // check, those wrap into the previous/next row at the image edges
        // (a background-colored region that's genuinely disconnected from
        // every corner could get erased anyway through that phantom edge).
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
        disabled={isProcessing}
        className="tb-v2-file-input"
      />

      {image && (
        <>
          <div className="tb-v2-flex tb-v2-gap-2">
            <button
              onClick={() => selectMethod('ai')}
              disabled={isProcessing}
              className={`tb-v2-btn ${method === 'ai' ? 'tb-v2-btn-primary' : 'tb-v2-btn-secondary'} tb-v2-disabled:opacity-50`}
            >
              AI Remove
            </button>
            <button
              onClick={() => selectMethod('floodfill')}
              disabled={isProcessing}
              className={`tb-v2-btn ${method === 'floodfill' ? 'tb-v2-btn-primary' : 'tb-v2-btn-secondary'} tb-v2-disabled:opacity-50`}
            >
              Auto Detect
            </button>
            <button
              onClick={() => selectMethod('chroma')}
              disabled={isProcessing}
              className={`tb-v2-btn ${method === 'chroma' ? 'tb-v2-btn-primary' : 'tb-v2-btn-secondary'} tb-v2-disabled:opacity-50`}
            >
              Color Key
            </button>
          </div>

          {method === 'ai' && (
            <p className="tb-v2-text-sm tb-v2-text-gray-500">
              Uses an AI segmentation model to cut out the subject, even against busy or uneven backgrounds.
              The model downloads once (~40MB) and your browser will typically cache it for later visits.
            </p>
          )}

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

          {method !== 'ai' && (
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
          )}

          <button
            onClick={method === 'ai' ? removeBackgroundAI : removeBackground}
            disabled={isProcessing}
            className="tb-v2-btn tb-v2-btn-primary tb-v2-disabled:opacity-50"
          >
            {isProcessing
              ? aiProgress !== null
                ? aiStage === 'fetch'
                  ? `Downloading model... ${aiProgress}%`
                  : `Processing image... ${aiProgress}%`
                : 'Processing...'
              : 'Remove Background'}
          </button>

          {aiError && (
            <div className="tb-v2-p-4 tb-v2-bg-red-100 tb-v2-text-red-700 tb-v2-rounded-lg">{aiError}</div>
          )}
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
          <li><strong>AI Remove:</strong> AI segmentation model - best for photos, works on any background</li>
          <li><strong>Auto Detect:</strong> Samples corners to identify and remove background color</li>
          <li><strong>Color Key:</strong> Removes a specific color (e.g., green screen)</li>
          <li>Auto Detect and Color Key both use the Tolerance slider - raise it for more color variation</li>
        </ul>
      </div>
    </div>
  );
}