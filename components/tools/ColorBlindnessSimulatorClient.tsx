'use client';

import { useEffect, useRef, useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

interface FilterDef {
  id: string;
  name: string;
  description: string;
  matrix: number[][] | null;
}

const SAMPLE_SRC = '/samples/tool-sample.png';

const filters: FilterDef[] = [
  {
    id: 'protanopia',
    name: 'Protanopia',
    description: 'Red-blind (no red cones)',
    matrix: [
      [0.567, 0.433, 0],
      [0.558, 0.442, 0],
      [0, 0.242, 0.758],
    ],
  },
  {
    id: 'deuteranopia',
    name: 'Deuteranopia',
    description: 'Green-blind (no green cones)',
    matrix: [
      [0.625, 0.375, 0],
      [0.7, 0.3, 0],
      [0, 0.3, 0.7],
    ],
  },
  {
    id: 'tritanopia',
    name: 'Tritanopia',
    description: 'Blue-blind (no blue cones)',
    matrix: [
      [0.95, 0.05, 0],
      [0, 0.433, 0.567],
      [0, 0.475, 0.525],
    ],
  },
  {
    id: 'achromatopsia',
    name: 'Achromatopsia',
    description: 'Full color blindness (grayscale only)',
    matrix: null,
  },
];

function clamp255(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
}

export default function ColorBlindnessSimulatorClient() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [pendingImg, setPendingImg] = useState<HTMLImageElement | null>(null);

  const sourceCanvasRef = useRef<HTMLCanvasElement>(null);
  const canvasMapRef = useRef<Record<string, HTMLCanvasElement | null>>({});

  function processImage(img: HTMLImageElement) {
    const sourceCanvas = sourceCanvasRef.current;
    if (!sourceCanvas) return false;

    const width = img.naturalWidth;
    const height = img.naturalHeight;

    sourceCanvas.width = width;
    sourceCanvas.height = height;
    const sourceCtx = sourceCanvas.getContext('2d');
    if (!sourceCtx) return false;

    sourceCtx.drawImage(img, 0, 0, width, height);
    const imageData = sourceCtx.getImageData(0, 0, width, height);
    const original = imageData.data;

    for (const filter of filters) {
      const canvas = canvasMapRef.current[filter.id];
      if (!canvas) return false;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return false;

      const output = ctx.createImageData(width, height);
      const outData = output.data;

      for (let i = 0; i < original.length; i += 4) {
        const r = original[i];
        const g = original[i + 1];
        const b = original[i + 2];
        const a = original[i + 3];

        if (filter.matrix) {
          const [row0, row1, row2] = filter.matrix;
          outData[i] = clamp255(r * row0[0] + g * row0[1] + b * row0[2]);
          outData[i + 1] = clamp255(r * row1[0] + g * row1[1] + b * row1[2]);
          outData[i + 2] = clamp255(r * row2[0] + g * row2[1] + b * row2[2]);
        } else {
          const gray = clamp255(r * 0.299 + g * 0.587 + b * 0.114);
          outData[i] = gray;
          outData[i + 1] = gray;
          outData[i + 2] = gray;
        }
        outData[i + 3] = a;
      }

      ctx.putImageData(output, 0, 0);
    }

    setDimensions({ width, height });
    return true;
  }

  // Draw after filter canvases mount (imageSrc truthy) — avoids canvas-mount race.
  useEffect(() => {
    if (!imageSrc || !pendingImg) return;
    const img = pendingImg;
    let cancelled = false;

    const run = () => {
      if (cancelled) return;
      try {
        const ok = processImage(img);
        if (!ok) {
          // Refs may not be attached yet on the first paint; try once more.
          requestAnimationFrame(() => {
            if (cancelled) return;
            try {
              if (!processImage(img)) setError('Could not process that image.');
            } catch {
              setError('Could not process that image.');
            } finally {
              setProcessing(false);
              setPendingImg(null);
            }
          });
          return;
        }
      } catch {
        setError('Could not process that image.');
      }
      setProcessing(false);
      setPendingImg(null);
    };

    run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- process once per pending load
  }, [imageSrc, pendingImg]);

  function loadFromSrc(src: string, name: string) {
    setError('');
    setProcessing(true);
    setFileName(name);
    const img = new Image();
    img.onload = () => {
      setImageSrc(src);
      setPendingImg(img);
    };
    img.onerror = () => {
      setError('Could not load that image.');
      setProcessing(false);
    };
    img.src = src;
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }

    setError('');
    setProcessing(true);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result as string;
      const img = new Image();
      img.onload = () => {
        setImageSrc(src);
        setPendingImg(img);
      };
      img.onerror = () => {
        setError('Could not load that image.');
        setProcessing(false);
      };
      img.src = src;
    };
    reader.onerror = () => {
      setError('Could not read that file.');
      setProcessing(false);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  function clearAll() {
    setImageSrc(null);
    setFileName('');
    setDimensions(null);
    setError('');
    setProcessing(false);
    setPendingImg(null);
  }

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head" style={{ borderBottom: '1px solid var(--line)' }}>
        <span className="tb-v2-tool-label">Color Blindness Simulator</span>
        <ToolExampleClearActions
          onExample={() => loadFromSrc(SAMPLE_SRC, 'tool-sample.png')}
          onClear={clearAll}
          canClear={Boolean(imageSrc)}
        />
      </div>

      <div className="tb-v2-section" style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 20 }}>
        <p style={{ fontSize: 13, color: 'var(--tb-text-secondary)', margin: 0 }}>
          Upload an image to see how it appears to people with different types of color vision
          deficiency. Everything runs in your browser — the image is never uploaded to a server.
        </p>

        <label
          className="block w-full p-8 border-2 border-dashed rounded-xl cursor-pointer text-center hover:border-indigo-400 transition-colors"
          style={{ borderColor: 'var(--tb-border)' }}
        >
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
          <span style={{ color: 'var(--tb-text-secondary)' }}>
            {fileName ? fileName : 'Click to upload an image'}
          </span>
        </label>
        {error && <p style={{ fontSize: 12, color: '#ef4444', margin: 0 }}>{error}</p>}
        {processing && (
          <p style={{ fontSize: 13, color: 'var(--tb-text-secondary)', margin: 0 }}>Processing image…</p>
        )}

        <canvas ref={sourceCanvasRef} className="hidden" />

        {!imageSrc && !processing && (
          <div className="text-center" style={{ padding: '24px 16px' }}>
            <p style={{ color: 'var(--tb-text-secondary)', margin: 0 }}>
              No image yet. Use Examples or upload an image above.
            </p>
          </div>
        )}

        {imageSrc && (
          <div>
            <h3 className="tb-v2-section-title" style={{ marginBottom: 12 }}>
              Results {dimensions ? `(${dimensions.width}×${dimensions.height})` : ''}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                className="tb-v2-section"
                style={{ borderTop: 'none', border: '1px solid var(--tb-border)', borderRadius: 8 }}
              >
                <p className="font-semibold text-sm mb-1">Original</p>
                <p className="text-xs text-gray-500 mb-2">Normal color vision</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageSrc}
                  alt="Original"
                  style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 6 }}
                />
              </div>

              {filters.map((filter) => (
                <div
                  key={filter.id}
                  className="tb-v2-section"
                  style={{ borderTop: 'none', border: '1px solid var(--tb-border)', borderRadius: 8 }}
                >
                  <p className="font-semibold text-sm mb-1">{filter.name}</p>
                  <p className="text-xs text-gray-500 mb-2">{filter.description}</p>
                  <canvas
                    ref={(el) => {
                      canvasMapRef.current[filter.id] = el;
                    }}
                    style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 6 }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
