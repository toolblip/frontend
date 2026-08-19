'use client';

import { useState, useCallback, useRef } from 'react';

export default function GifToJpgClient() {
  const [fileName, setFileName] = useState('');
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [jpgUrl, setJpgUrl] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [dimensions, setDimensions] = useState<{ w: number; h: number } | null>(null);
  const [quality, setQuality] = useState(0.92);
  const [bgColor, setBgColor] = useState('#ffffff');
  const imgRef = useRef<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setJpgUrl(null);
    setError('');
    setDimensions(null);
  };

  const renderJpg = useCallback((img: HTMLImageElement, q: number, bg: string) => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setError('Could not create a canvas context in this browser.');
        return;
      }
      // JPEG has no alpha channel, so paint a background first, then draw
      // the GIF's current/first displayed frame on top of it.
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      setDimensions({ w: img.naturalWidth, h: img.naturalHeight });
      setJpgUrl(canvas.toDataURL('image/jpeg', q));
    } catch {
      setError('Failed to convert this file. It may not be a valid GIF/image.');
    }
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    reset();
    const file = e.target.files?.[0];
    if (!file) {
      setFileName('');
      setSourceUrl(null);
      imgRef.current = null;
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('That file does not look like an image. Please choose a GIF file.');
      setFileName('');
      setSourceUrl(null);
      imgRef.current = null;
      return;
    }

    setFileName(file.name);
    const objectUrl = URL.createObjectURL(file);
    setSourceUrl(objectUrl);

    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      renderJpg(img, quality, bgColor);
    };
    img.onerror = () => {
      setError('Failed to load this file as an image. It may be corrupted or not a valid GIF.');
    };
    img.src = objectUrl;
  }, [quality, bgColor, renderJpg]);

  const handleQualityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = Number(e.target.value);
    setQuality(q);
    if (imgRef.current) renderJpg(imgRef.current, q, bgColor);
  };

  const handleBgColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const bg = e.target.value;
    setBgColor(bg);
    if (imgRef.current) renderJpg(imgRef.current, quality, bg);
  };

  const clearAll = () => {
    setFileName('');
    setSourceUrl(null);
    imgRef.current = null;
    reset();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">GIF to JPG</span>
        {(sourceUrl || jpgUrl) && (
          <button type="button" onClick={clearAll} className="tb-v2-btn-sm">
            Clear
          </button>
        )}
      </div>

      <p style={{ fontSize: 13, color: 'var(--tb-v2-muted, #6b7280)', margin: '4px 0 12px' }}>
        Extracts the first frame of the GIF as a static JPG.
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
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-end', marginTop: 12 }}>
          <div>
            <label className="tb-v2-tool-label" style={{ display: 'block', marginBottom: 6 }}>
              Quality: {quality.toFixed(2)}
            </label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.01"
              value={quality}
              onChange={handleQualityChange}
              aria-label="JPEG quality"
            />
          </div>
          <div>
            <label className="tb-v2-tool-label" style={{ display: 'block', marginBottom: 6 }}>
              Background color
            </label>
            <input
              type="color"
              value={bgColor}
              onChange={handleBgColorChange}
              aria-label="Background color for transparent areas"
            />
          </div>
        </div>
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

          {jpgUrl && (
            <div>
              <p className="tb-v2-tool-label" style={{ marginBottom: 8 }}>
                JPG Result{dimensions ? ` (${dimensions.w}×${dimensions.h})` : ''}
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={jpgUrl}
                alt="Converted JPG"
                style={{ maxWidth: 260, maxHeight: 260, borderRadius: 8, display: 'block' }}
              />
              <a
                href={jpgUrl}
                download="converted.jpg"
                className="tb-v2-btn-primary"
                style={{ display: 'inline-block', marginTop: 10, textDecoration: 'none' }}
              >
                Download JPG
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
