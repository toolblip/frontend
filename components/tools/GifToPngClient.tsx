'use client';

import { useState, useCallback, useRef } from 'react';

export default function GifToPngClient() {
  const [fileName, setFileName] = useState('');
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [pngUrl, setPngUrl] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [dimensions, setDimensions] = useState<{ w: number; h: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setPngUrl(null);
    setError('');
    setDimensions(null);
  };

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    reset();
    const file = e.target.files?.[0];
    if (!file) {
      setFileName('');
      setSourceUrl(null);
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('That file does not look like an image. Please choose a GIF file.');
      setFileName('');
      setSourceUrl(null);
      return;
    }

    setFileName(file.name);
    const objectUrl = URL.createObjectURL(file);
    setSourceUrl(objectUrl);

    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setError('Could not create a canvas context in this browser.');
          return;
        }
        // No background fill: PNG supports transparency, so we keep the
        // GIF's current frame exactly as rasterized, alpha channel included.
        ctx.drawImage(img, 0, 0);
        setDimensions({ w: img.naturalWidth, h: img.naturalHeight });
        setPngUrl(canvas.toDataURL('image/png'));
      } catch {
        setError('Failed to convert this file. It may not be a valid GIF/image.');
      }
    };
    img.onerror = () => {
      setError('Failed to load this file as an image. It may be corrupted or not a valid GIF.');
    };
    img.src = objectUrl;
  }, []);

  const clearAll = () => {
    setFileName('');
    setSourceUrl(null);
    reset();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">GIF to PNG</span>
        {(sourceUrl || pngUrl) && (
          <button type="button" onClick={clearAll} className="tb-v2-btn-sm">
            Clear
          </button>
        )}
      </div>

      <p style={{ fontSize: 13, color: 'var(--tb-v2-muted, #6b7280)', margin: '4px 0 12px' }}>
        Extracts the first frame of the GIF as a static PNG.
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/gif,.gif"
        onChange={handleFileChange}
        className="tb-v2-file-input"
        aria-label="Choose a GIF file"
      />

      {error && (
        <p style={{ fontSize: 13, color: '#ef4444', marginTop: 8 }} role="alert">
          {error}
        </p>
      )}

      {!fileName && !error && (
        <p style={{ fontSize: 13, color: 'var(--tb-v2-muted, #6b7280)', marginTop: 12 }}>
          No file selected yet. Choose a .gif file to get started.
        </p>
      )}

      {sourceUrl && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 16 }}>
          <div>
            <p className="tb-v2-tool-label" style={{ marginBottom: 8 }}>Original GIF</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={sourceUrl}
              alt="Original GIF"
              style={{ maxWidth: 260, maxHeight: 260, borderRadius: 8, display: 'block' }}
            />
          </div>

          {pngUrl && (
            <div>
              <p className="tb-v2-tool-label" style={{ marginBottom: 8 }}>
                PNG Result{dimensions ? ` (${dimensions.w}×${dimensions.h})` : ''}
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={pngUrl}
                alt="Converted PNG"
                style={{ maxWidth: 260, maxHeight: 260, borderRadius: 8, display: 'block' }}
              />
              <a
                href={pngUrl}
                download="converted.png"
                className="tb-v2-btn-primary"
                style={{ display: 'inline-block', marginTop: 10, textDecoration: 'none' }}
              >
                Download PNG
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
