'use client';

import { useState, useRef, useCallback } from 'react';
import { convertHeicIfNeeded } from '@/lib/heic';
import { useSubscription } from '@/hooks/useSubscription';
import { FileSizeError, UpgradeNotice } from '@/components/FileSizeGuard';

type RemovalMethod = 'floodfill' | 'chroma' | 'ai';

const MODEL_CACHE_NAME = 'imgly-bg-removal-model-v1';
const MODEL_CDN_PREFIX = 'https://staticimgly.com/';

// Captured once at module load, before removeBackgroundAI ever swaps
// window.fetch out - fetchWithModelCache below must call through this,
// not the bare `fetch` identifier, or it would resolve to itself
// (window.fetch at call time) and recurse forever instead of ever
// reaching the network.
const nativeFetch = typeof window !== 'undefined' ? window.fetch.bind(window) : undefined;

// The model CDN sends no Cache-Control header, so the browser can't
// safely reuse its own HTTP cache across visits - every request behaves
// as a fresh fetch. Cache Storage doesn't depend on the response's own
// headers, so once a chunk is stored here it stays until we evict it.
async function fetchWithModelCache(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
  if (!url.startsWith(MODEL_CDN_PREFIX) || !nativeFetch || !('caches' in window)) {
    return nativeFetch ? nativeFetch(input, init) : fetch(input, init);
  }
  const cache = await caches.open(MODEL_CACHE_NAME);
  const cached = await cache.match(url);
  if (cached) return cached;
  const response = await nativeFetch(input, init);
  if (response.ok) {
    cache.put(url, response.clone()).catch(() => {});
  }
  return response;
}

export default function ImageBackgroundRemoverClient() {
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [method, setMethod] = useState<RemovalMethod>('ai');
  const [tolerance, setTolerance] = useState(32);
  const [chromaKeyColor, setChromaKeyColor] = useState('#00ff00');
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiProgress, setAiProgress] = useState<number | null>(null);
  const [aiStage, setAiStage] = useState<'fetch' | 'compute'>('fetch');
  const [aiError, setAiError] = useState<string | null>(null);
  const [isConvertingHeic, setIsConvertingHeic] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { tier } = useSubscription();
  const maxSizeMB = tier === 'free' ? 5 : tier === 'starter' ? 10 : tier === 'ultra' ? 100 : tier === 'max' ? 500 : 5;
  const isOversized = selectedFile != null && selectedFile.size / (1024 * 1024) > maxSizeMB;
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

  const loadImage = async (file: File) => {
    setSelectedFile(file);
    requestIdRef.current += 1;
    releaseProcessedBlobUrl();

    setIsConvertingHeic(true);
    const decodable = await convertHeicIfNeeded(file);
    setIsConvertingHeic(false);

    setImageFile(decodable);
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
      setProcessedImage(null);
      setAiError(null);
    };
    reader.readAsDataURL(decodable);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) loadImage(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    // HEIC/HEIF files often report an empty or non-"image/" MIME type
    // (OS-dependent), so fall back to checking the extension too.
    if (file && (file.type.startsWith('image/') || /\.(heic|heif)$/i.test(file.name))) {
      loadImage(file);
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

    // Swapped in only for the duration of this call so the imgly library's
    // internal fetch() of model chunks goes through the Cache Storage
    // wrapper above - restored in `finally` below regardless of outcome.
    const originalFetch = window.fetch;
    window.fetch = fetchWithModelCache as typeof fetch;

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
      window.fetch = originalFetch;
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
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-2xl font-bold">Background Remover</h2>

      {!image ? (
        <div
          className="border-2 border-dashed border-gray-700 hover:border-red-600 rounded-xl p-12 text-center transition-colors cursor-pointer"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <span className="text-3xl mb-3 block">🖼️</span>
          {isConvertingHeic ? (
            <p className="text-gray-400 text-sm">Converting HEIC photo...</p>
          ) : (
            <>
              <p className="text-gray-400 text-sm">Drag & drop an image, or click to browse</p>
              <p className="text-gray-600 text-xs mt-1">PNG, JPG, WebP, GIF, HEIC</p>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={isConvertingHeic}
            className="hidden"
            aria-label="Upload image"
          />
          <UpgradeNotice tier={tier} />
          <FileSizeError file={selectedFile} maxSizeMB={maxSizeMB} />
        </div>
      ) : (
        <>
          <div className="flex gap-2">
            <button
              onClick={() => selectMethod('ai')}
              disabled={isProcessing}
              className={`tb-v2-btn ${method === 'ai' ? 'tb-v2-btn-primary' : 'tb-v2-btn-ghost'} disabled:opacity-50`}
            >
              AI Remove
            </button>
            <button
              onClick={() => selectMethod('floodfill')}
              disabled={isProcessing}
              className={`tb-v2-btn ${method === 'floodfill' ? 'tb-v2-btn-primary' : 'tb-v2-btn-ghost'} disabled:opacity-50`}
            >
              Auto Detect
            </button>
            <button
              onClick={() => selectMethod('chroma')}
              disabled={isProcessing}
              className={`tb-v2-btn ${method === 'chroma' ? 'tb-v2-btn-primary' : 'tb-v2-btn-ghost'} disabled:opacity-50`}
            >
              Color Key
            </button>
          </div>

          {method === 'ai' && !isProcessing && (
            <p className="text-sm text-gray-500">
              Uses an AI segmentation model to cut out the subject, even against busy or uneven backgrounds.
            </p>
          )}

          {isProcessing && aiStage === 'fetch' && (
            <div className="text-sm text-gray-500">
              <div className="flex items-center justify-between mb-1">
                <span>Downloading local AI model (first use only, then cached)</span>
                <span>{aiProgress ?? 0}%</span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-600 transition-all"
                  style={{ width: `${aiProgress ?? 0}%` }}
                />
              </div>
            </div>
          )}

          {isProcessing && aiStage === 'compute' && (
            <div className="text-sm text-gray-500">
              <div className="flex items-center justify-between mb-1">
                <span>Running AI segmentation on your image (model already cached, this is the analysis step)</span>
                <span>{aiProgress ?? 0}%</span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-600 transition-all"
                  style={{ width: `${aiProgress ?? 0}%` }}
                />
              </div>
            </div>
          )}

          {method === 'chroma' && (
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Key Color:</label>
              <input
                type="color"
                value={chromaKeyColor}
                onChange={(e) => setChromaKeyColor(e.target.value)}
                className="w-10 h-10 rounded"
              />
            </div>
          )}

          {method !== 'ai' && (
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Tolerance: {tolerance}</label>
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

          <div className="flex gap-2">
            <button
              onClick={method === 'ai' ? removeBackgroundAI : removeBackground}
              disabled={isProcessing || isOversized}
              className="tb-v2-btn tb-v2-btn-primary disabled:opacity-50"
              title={isOversized ? 'File size exceeds your plan limit' : ''}
            >
              {isProcessing
                ? aiProgress !== null
                  ? aiStage === 'fetch'
                    ? `Downloading model...`
                    : `Processing image...`
                  : 'Processing...'
                : isOversized
                  ? 'File Too Large'
                  : 'Remove Background'}
            </button>
            <button
              onClick={() => { setImage(null); setImageFile(null); setSelectedFile(null); setProcessedImage(null); setAiError(null); }}
              className="tb-v2-btn tb-v2-btn-ghost"
            >
              Choose New Image
            </button>
          </div>

          {aiError && (
            <div className="p-4 bg-red-100 text-red-700 rounded-lg">{aiError}</div>
          )}
        </>
      )}

      <canvas ref={canvasRef} className="hidden" />

      {image && (
        <div className="mt-4">
          <p className="tb-v2-tool-label" style={{marginBottom:8}}>Original</p>
          <img src={image} alt="Original" className="max-w-full max-h-[70vh] object-contain rounded-lg" />
        </div>
      )}

      {processedImage && (
        <div className="mt-4">
          <p className="tb-v2-tool-label" style={{marginBottom:8}}>Result (with transparency)</p>
          <img src={processedImage} alt="No Background" className="max-w-full max-h-[70vh] object-contain rounded-lg" style={{ backgroundImage: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAdgAAAHYBTnsmCAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAABUSURBVDiNY/z//z8DJYCJgUIwaAzFMEoYRMVA4Y5LQNNLUMNA4TYowg1QLIMaB4rXIFYN0PQC1HhQ4oBEukE1LpT4IOqB2BgBAE0cFfVvYI0lAAAAAElFTkSuQmCC")', backgroundRepeat: 'repeat' }} />
          <button onClick={handleDownload} className="tb-v2-btn tb-v2-btn-ghost mt-2">
            Download PNG
          </button>
        </div>
      )}

      <div className="text-sm text-gray-500 mt-4">
        <p className="font-medium">Tips:</p>
        <ul className="list-disc pl-5">
          <li><strong>AI Remove:</strong> AI segmentation model - best for photos, works on any background</li>
          <li><strong>Auto Detect:</strong> Samples corners to identify and remove background color</li>
          <li><strong>Color Key:</strong> Removes a specific color (e.g., green screen)</li>
          <li>Auto Detect and Color Key both use the Tolerance slider - raise it for more color variation</li>
        </ul>
      </div>
    </div>
  );
}