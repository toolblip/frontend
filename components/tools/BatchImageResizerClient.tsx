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
  const fileRef = useRef<HTMLInputElement>(null);

  const targetWidth = customWidth ? parseInt(customWidth) : selectedPreset.width;
  const targetHeight = customHeight ? parseInt(customHeight) : selectedPreset.height;

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
    if (selected) setFiles(Array.from(selected));
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Images</span>
      </div>
      <input
        ref={fileRef}
        type="file"
        multiple
        accept="image/*"
        onChange={onFilesChange}
        className="tb-v2-file-input"
        aria-label="Select images to resize"
      />
      {files.length > 0 && (
        <p className="tb-v2-hint">{files.length} image(s) selected</p>
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

      <div className="tb-v2-flex-row" style={{ gap: '0.75rem', margin: '0.75rem 0' }}>
        <div style={{ flex: 1 }}>
          <label className="tb-v2-tool-label" style={{ display: 'block', marginBottom: '0.25rem' }}>Width</label>
          <input
            type="number"
            value={customWidth || targetWidth}
            onChange={(e) => setCustomWidth(e.target.value)}
            className="tb-v2-tool-input"
            aria-label="Width"
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', paddingTop: '1.25rem' }}>
          <button
            type="button"
            onClick={() => setLockAspect(!lockAspect)}
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
            onChange={(e) => setCustomHeight(e.target.value)}
            className="tb-v2-tool-input"
            aria-label="Height"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={processImages}
        disabled={!files.length || processing}
        className="tb-v2-btn w-full"
        style={{ marginBottom: '0.75rem' }}
      >
        {processing ? 'Processing...' : 'Resize Images'}
      </button>

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
