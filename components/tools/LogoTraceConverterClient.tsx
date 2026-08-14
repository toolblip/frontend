'use client';

import { useRef, useState } from 'react';

// imagetracerjs ships no TypeScript types; import the raw module and cast it
// to the minimal surface we actually use.
// @ts-expect-error - imagetracerjs has no type declarations
import ImageTracerRaw from 'imagetracerjs';

interface ImageTracerOptions {
  ltres?: number;
  qtres?: number;
  pathomit?: number;
  numberofcolors?: number;
  scale?: number;
  [key: string]: unknown;
}
interface ImageTracerStatic {
  imagedataToSVG(imageData: ImageData, options?: ImageTracerOptions | string): string;
}
const ImageTracer = ImageTracerRaw as ImageTracerStatic;

const PRESETS = [
  { id: 'default', label: 'Default' },
  { id: 'posterized2', label: 'Posterized (few colors)' },
  { id: 'detailed', label: 'Detailed' },
] as const;

function loadImageData(file: File): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read this file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Could not decode this image.'));
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('Canvas is not supported in this browser.')); return; }
        ctx.drawImage(img, 0, 0);
        try {
          resolve(ctx.getImageData(0, 0, canvas.width, canvas.height));
        } catch {
          reject(new Error('Could not read pixel data from this image.'));
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export default function LogoTraceConverterClient() {
  const [fileName, setFileName] = useState('');
  const [preview, setPreview] = useState('');
  const [svg, setSvg] = useState('');
  const [preset, setPreset] = useState<(typeof PRESETS)[number]['id']>('default');
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const imageDataRef = useRef<ImageData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const trace = (imgd: ImageData, presetId: string) => {
    const result = ImageTracer.imagedataToSVG(imgd, presetId);
    setSvg(result);
  };

  const loadFile = async (file: File | undefined) => {
    if (!file) return;
    setError('');
    setSvg('');
    if (!/^image\/(png|jpe?g|webp|gif|bmp)$/i.test(file.type)) {
      setError('Please choose a raster image file (PNG, JPG, WEBP, GIF, or BMP).');
      return;
    }
    setLoading(true);
    try {
      const imgd = await loadImageData(file);
      imageDataRef.current = imgd;
      setFileName(file.name);
      setPreview(URL.createObjectURL(file));
      trace(imgd, preset);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not trace this image.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => loadFile(e.target.files?.[0]);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    loadFile(e.dataTransfer.files?.[0]);
  };

  const changePreset = (presetId: (typeof PRESETS)[number]['id']) => {
    setPreset(presetId);
    if (imageDataRef.current) {
      setError('');
      try {
        trace(imageDataRef.current, presetId);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Could not trace this image.');
      }
    }
  };

  const downloadSvg = () => {
    if (!svg) return;
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(fileName.replace(/\.[^.]+$/, '') || 'traced')}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Upload Raster Logo</span>
      </div>
      <div style={{ padding: 20 }}>
        <div
          className={`tb-v2-dropzone ${isDragging ? 'dragging' : ''}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <span style={{ fontSize: 28 }}>🖼️</span>
          <span className="tb-v2-dropzone-text">{loading ? 'Tracing...' : 'Click or drag a PNG/JPG image here'}</span>
          <span className="tb-v2-dropzone-hint">Traced entirely in your browser</span>
          <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/bmp" onChange={handleFileChange} style={{ display: 'none' }} />
        </div>

        <div style={{ display: 'flex', gap: 6, marginTop: 16, flexWrap: 'wrap' }}>
          {PRESETS.map(p => (
            <button
              key={p.id}
              type="button"
              onClick={() => changePreset(p.id)}
              className={`tb-v2-mode-tab ${p.id === preset ? 'on' : ''}`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="tb-v2-banner-err" style={{ margin: '0 20px 20px' }}>{error}</div>}

      {svg && (
        <div style={{ padding: '0 20px 20px' }}>
          <div className="tb-v2-grid-2">
            <div>
              <span className="tb-v2-tool-label">Original</span>
              <div className="tb-v2-tool-pre" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="Original raster upload" style={{ maxWidth: '100%', maxHeight: 260 }} />
              </div>
            </div>
            <div>
              <span className="tb-v2-tool-label">Traced SVG</span>
              <div
                className="tb-v2-tool-pre"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200, background: '#fff' }}
                dangerouslySetInnerHTML={{ __html: svg }}
              />
            </div>
          </div>

          <button type="button" onClick={downloadSvg} className="tb-v2-btn tb-v2-btn-primary tb-v2-btn-lg" style={{ marginTop: 16 }}>
            Download SVG
          </button>
        </div>
      )}

      {!svg && !error && !loading && (
        <p className="tb-v2-empty" style={{ margin: '0 20px 20px' }}>Upload a raster logo to trace it into a vector SVG.</p>
      )}
    </div>
  );
}
