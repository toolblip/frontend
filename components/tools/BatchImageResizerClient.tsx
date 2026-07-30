'use client';

import { useState, useRef, useCallback } from 'react';

interface ResizeOption {
  width: number;
  height: number;
  label: string;
}

const PRESETS: ResizeOption[] = [
  { label: 'HD (1280×720)', width: 1280, height: 720 },
  { label: 'Full HD (1920×1080)', width: 1920, height: 1080 },
  { label: 'Square (1080×1080)', width: 1080, height: 1080 },
  { label: 'Portrait (1080×1920)', width: 1080, height: 1920 },
  { label: 'Thumbnail (300×300)', width: 300, height: 300 },
  { label: '480p (854×480)', width: 854, height: 480 },
  { label: '720p (1280×720)', width: 1280, height: 720 },
  { label: '1080p (1920×1080)', width: 1920, height: 1080 },
];

export default function BatchImageResizerClient() {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<ResizeOption>(PRESETS[0]);
  const [customWidth, setCustomWidth] = useState('');
  const [customHeight, setCustomHeight] = useState('');
  const [lockAspect, setLockAspect] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const aspectRef = useRef<number>(1280 / 720);

  const targetWidth = customWidth ? parseInt(customWidth) : selectedPreset.width;
  const targetHeight = customHeight ? parseInt(customHeight) : selectedPreset.height;

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const w = e.target.value;
    setCustomWidth(w);
    if (lockAspect && w) {
      const wNum = parseInt(w);
      if (wNum > 0 && !isNaN(wNum)) {
        setCustomHeight(String(Math.round(wNum / aspectRef.current)));
      }
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const h = e.target.value;
    setCustomHeight(h);
    if (lockAspect && h) {
      const hNum = parseInt(h);
      if (hNum > 0 && !isNaN(hNum)) {
        setCustomWidth(String(Math.round(hNum * aspectRef.current)));
      }
    }
  };

  const handleLockToggle = () => {
    const newLock = !lockAspect;
    setLockAspect(newLock);
    if (newLock) {
      const w = targetWidth;
      const h = targetHeight;
      if (w > 0 && h > 0) {
        aspectRef.current = w / h;
      }
    }
  };

  const processImages = useCallback(async () => {
    if (!files.length) return;
    setProcessing(true);
    setResults([]);

    const processed: string[] = [];

    for (const file of files) {
      const img = new Image();
      const url = URL.createObjectURL(file);
      await new Promise<void>((resolve) => {
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          const ctx = canvas.getContext('2d');
          if (!ctx) { resolve(); return; }

          const scale = Math.min(targetWidth / img.width, targetHeight / img.height);
          const x = (targetWidth - img.width * scale) / 2;
          const y = (targetHeight - img.height * scale) / 2;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, targetWidth, targetHeight);
          ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

          processed.push(canvas.toDataURL('image/jpeg', 0.9));
          URL.revokeObjectURL(url);
          resolve();
        };
        img.onerror = () => resolve();
        img.src = url;
      });
    }

    setResults(processed);
    setProcessing(false);
  }, [files, targetWidth, targetHeight]);

  const downloadAll = () => {
    results.forEach((dataUrl, i) => {
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `resized-${i + 1}.jpg`;
      a.click();
    });
  };

  const onFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (selected) { setFiles(Array.from(selected)); setResults([]); }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = Array.from(e.dataTransfer.files || []).filter((f) => f.type.startsWith('image/'));
    if (dropped.length) { setFiles(dropped); setResults([]); }
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Images</span>
      </div>
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => fileRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          isDragging
            ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500'
        }`}
      >
        <div className="text-4xl mb-2">🖼️</div>
        <p className="text-gray-600 dark:text-gray-400">
          {isDragging ? 'Drop images here' : 'Click or drag images to resize'}
        </p>
      </div>
      <input
        ref={fileRef}
        type="file"
        multiple
        accept="image/*"
        onChange={onFilesChange}
        className="hidden"
        aria-label="Select images to resize"
      />
      {files.length > 0 && (
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl" style={{ marginTop: '0.75rem' }}>
          <p className="text-sm text-gray-600 dark:text-gray-400">{files.length} image(s) selected</p>
          <button type="button" onClick={() => { setFiles([]); setResults([]); }} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>
      )}

      <div style={{ margin: '0.75rem 0' }}>
        <label className="tb-v2-tool-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Size Preset</label>
        <select
          value={selectedPreset.label}
          onChange={(e) => {
            const preset = PRESETS.find((p) => p.label === e.target.value);
            if (preset) setSelectedPreset(preset);
          }}
          className="tb-v2-select"
          aria-label="Size preset"
        >
          {PRESETS.map((p) => (
            <option key={p.label} value={p.label}>{p.label}</option>
          ))}
        </select>
      </div>

      <div className="flex" style={{ gap: '0.75rem', margin: '0.75rem 0' }}>
        <div style={{ flex: 1 }}>
          <label className="tb-v2-tool-label" style={{ display: 'block', marginBottom: '0.25rem' }}>Width</label>
          <input
            type="number"
            value={customWidth || targetWidth}
            onChange={handleWidthChange}
            className="tb-v2-tool-input"
            aria-label="Width"
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', paddingTop: '1.25rem' }}>
          <button
            type="button"
            onClick={handleLockToggle}
            className="tb-v2-btn"
            style={{ padding: '0.4rem 0.5rem', fontSize: '1rem' }}
            aria-label={lockAspect ? 'Unlock aspect ratio' : 'Lock aspect ratio'}
          >
            {lockAspect ? '🔗' : '⛓️‍💥'}
          </button>
        </div>
        <div style={{ flex: 1 }}>
          <label className="tb-v2-tool-label" style={{ display: 'block', marginBottom: '0.25rem' }}>Height</label>
          <input
            type="number"
            value={customHeight || targetHeight}
            onChange={handleHeightChange}
            className="tb-v2-tool-input"
            aria-label="Height"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={processImages}
        disabled={!files.length || processing}
        className="tb-v2-btn tb-v2-btn-primary w-full"
        style={{ marginBottom: '0.75rem' }}
      >
        {processing ? 'Processing...' : 'Resize Images'}
      </button>

      {!files.length && !results.length && (
        <p className="tb-v2-empty">
          Drop one or more images above, pick a size preset, and resize them all at once.
        </p>
      )}

      {results.length > 0 && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Results ({results.length})</span>
            <button type="button" onClick={downloadAll} className="tb-v2-copy-btn">
              Download All
            </button>
          </div>
          <div className="tb-v2-tool-output-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.75rem' }}>
              {results.map((dataUrl, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <img
                    src={dataUrl}
                    alt={`Resized ${i + 1}`}
                    style={{ width: '100%', aspectRatio: `${targetWidth}/${targetHeight}`, objectFit: 'cover', borderRadius: '0.5rem' }}
                  />
                  <a href={dataUrl} download={`resized-${i + 1}.jpg`} className="tb-v2-copy-btn" style={{ textDecoration: 'none', textAlign: 'center' }}>
                    Download
                  </a>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
