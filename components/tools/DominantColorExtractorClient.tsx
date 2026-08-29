'use client';

import { useRef, useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

interface SwatchColor {
  hex: string;
  r: number;
  g: number;
  b: number;
  percent: number;
}

const BUCKET_SIZE = 32;
const SAMPLE_DIM = 150;
const NUM_COLORS = 6;
const SAMPLE = '/samples/tool-sample.png';

function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((x) => Math.round(x).toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  );
}

function extractDominantColors(imageData: ImageData, count: number): SwatchColor[] {
  const data = imageData.data;
  const buckets = new Map<string, { rSum: number; gSum: number; bSum: number; count: number }>();
  let totalOpaque = 0;

  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a < 128) continue;
    const r = data[i],
      g = data[i + 1],
      b = data[i + 2];
    const key = `${Math.floor(r / BUCKET_SIZE)}-${Math.floor(g / BUCKET_SIZE)}-${Math.floor(b / BUCKET_SIZE)}`;
    const bucket = buckets.get(key);
    if (bucket) {
      bucket.rSum += r;
      bucket.gSum += g;
      bucket.bSum += b;
      bucket.count += 1;
    } else {
      buckets.set(key, { rSum: r, gSum: g, bSum: b, count: 1 });
    }
    totalOpaque += 1;
  }

  if (totalOpaque === 0) return [];

  return Array.from(buckets.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, count)
    .map((bucket) => {
      const r = bucket.rSum / bucket.count;
      const g = bucket.gSum / bucket.count;
      const b = bucket.bSum / bucket.count;
      return {
        hex: rgbToHex(r, g, b),
        r: Math.round(r),
        g: Math.round(g),
        b: Math.round(b),
        percent: (bucket.count / totalOpaque) * 100,
      };
    });
}

export default function DominantColorExtractorClient() {
  const [imageSrc, setImageSrc] = useState('');
  const [colors, setColors] = useState<SwatchColor[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [copiedHex, setCopiedHex] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImage = (src: string) => {
    const img = new Image();
    img.onload = () => {
      setImageSrc(src);
      const scale = Math.min(1, SAMPLE_DIM / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, w, h);
      const imageData = ctx.getImageData(0, 0, w, h);
      setColors(extractDominantColors(imageData, NUM_COLORS));
    };
    img.onerror = () => setError('Could not load that image.');
    img.crossOrigin = 'Anonymous';
    img.src = src;
  };

  const loadFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }
    setError('');
    const url = URL.createObjectURL(file);
    processImage(url);
  };

  const clearAll = () => {
    setImageSrc('');
    setColors([]);
    setError('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    loadFile(e.target.files?.[0]);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    loadFile(e.dataTransfer.files?.[0]);
  };

  const copy = (hex: string) => {
    navigator.clipboard.writeText(hex).catch(() => {});
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(''), 1500);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head" style={{ borderBottom: '1px solid var(--line)' }}>
        <span className="tb-v2-tool-label">Dominant Color Extractor</span>
        <ToolExampleClearActions
          onExample={() => {
            setError('');
            processImage(SAMPLE);
          }}
          onClear={clearAll}
          canClear={Boolean(imageSrc || colors.length)}
        />
      </div>
      <div style={{ padding: 20 }}>
        <div
          className={`tb-v2-dropzone ${isDragging ? 'dragging' : ''}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <span style={{ fontSize: 28 }}>🎨</span>
          <span className="tb-v2-dropzone-text">Click or drag an image here</span>
          <span className="tb-v2-dropzone-hint">Colors are extracted entirely in your browser</span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>
        {error && (
          <div className="tb-v2-banner tb-v2-banner-err" style={{ marginTop: 12 }}>
            {error}
          </div>
        )}
        {imageSrc && (
          <div
            style={{
              marginTop: 12,
              maxHeight: 260,
              overflow: 'auto',
              borderRadius: 8,
              border: '1px solid var(--line)',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageSrc} alt="Uploaded" style={{ width: '100%', display: 'block' }} />
          </div>
        )}
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Dominant Colors</span>
      </div>
      <div className="tb-v2-tool-output-body">
        {colors.length === 0 ? (
          <p className="tb-v2-empty">Upload an image or use Examples to extract dominant colors.</p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: 12,
            }}
          >
            {colors.map((c) => (
              <button
                key={c.hex}
                type="button"
                onClick={() => copy(c.hex)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  border: '1px solid var(--line)',
                  borderRadius: 8,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  background: 'none',
                  padding: 0,
                }}
              >
                <div style={{ height: 56, background: c.hex }} />
                <div style={{ padding: '8px 10px', textAlign: 'left' }}>
                  <div style={{ fontFamily: 'var(--f-mono)', fontSize: 13, fontWeight: 700 }}>
                    {copiedHex === c.hex ? 'Copied' : c.hex}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--fg-2)' }}>
                    rgb({c.r}, {c.g}, {c.b})
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--fg-2)' }}>{c.percent.toFixed(1)}% of image</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
