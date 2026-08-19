'use client';

import { useState, useCallback, useRef } from 'react';

// upng-js ships without type declarations; this is the minimal shape we use.
type UpngModule = {
  encode: (
    buffers: ArrayBuffer[] | Uint8Array[],
    width: number,
    height: number,
    colorDepth: number,
    delays?: number[]
  ) => ArrayBuffer;
};

export default function GifToApngClient() {
  const [fileName, setFileName] = useState('');
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [apngUrl, setApngUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dimensions, setDimensions] = useState<{ w: number; h: number } | null>(null);
  const [frameCount, setFrameCount] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setApngUrl(null);
    setError('');
    setDimensions(null);
    setFrameCount(null);
  };

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    reset();
    const file = e.target.files?.[0];
    if (!file) {
      setFileName('');
      setSourceUrl(null);
      setSelectedFile(null);
      return;
    }

    const looksLikeGif = file.type === 'image/gif' || file.name.toLowerCase().endsWith('.gif');
    if (!looksLikeGif) {
      setError('That file does not look like a GIF. Please choose a .gif file.');
      setFileName('');
      setSourceUrl(null);
      setSelectedFile(null);
      return;
    }

    setFileName(file.name);
    setSelectedFile(file);
    setSourceUrl(URL.createObjectURL(file));
  }, []);

  const convert = useCallback(async () => {
    if (!selectedFile) return;
    reset();
    setLoading(true);

    try {
      const { parseGIF, decompressFrames } = await import('gifuct-js');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const UPNG = (await import('upng-js' as any)).default as UpngModule;

      const buffer = await selectedFile.arrayBuffer();
      const gif = parseGIF(buffer);
      const frames = decompressFrames(gif, true);

      if (!frames.length) {
        setError('Could not find any frames in this GIF. It may be corrupted or empty.');
        setLoading(false);
        return;
      }

      const logicalWidth = gif.lsd.width;
      const logicalHeight = gif.lsd.height;

      const canvas = document.createElement('canvas');
      canvas.width = logicalWidth;
      canvas.height = logicalHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) {
        setError('Could not create a canvas context in this browser.');
        setLoading(false);
        return;
      }

      const frameBuffers: ArrayBuffer[] = [];
      const delays: number[] = [];

      let previousDims: { left: number; top: number; width: number; height: number } | null = null;

      for (const frame of frames) {
        const disposalType = frame.disposalType;

        // disposalType 2: restore to background before drawing this frame,
        // by clearing the area occupied by the previous frame.
        if (disposalType === 2 && previousDims) {
          ctx.clearRect(previousDims.left, previousDims.top, previousDims.width, previousDims.height);
        }

        // disposalType 3: snapshot the canvas now (before drawing this
        // frame) so we can restore it right after capturing this frame's
        // composited output.
        const snapshotForRestore =
          disposalType === 3 ? ctx.getImageData(0, 0, logicalWidth, logicalHeight) : null;

        const { left, top, width, height } = frame.dims;
        const patchImageData = new ImageData(
          new Uint8ClampedArray(frame.patch),
          width,
          height
        );
        ctx.putImageData(patchImageData, left, top);

        const composited = ctx.getImageData(0, 0, logicalWidth, logicalHeight);
        frameBuffers.push(composited.data.buffer.slice(0));
        delays.push(frame.delay && frame.delay > 0 ? frame.delay : 100);

        if (disposalType === 3 && snapshotForRestore) {
          ctx.putImageData(snapshotForRestore, 0, 0);
        }

        previousDims = { left, top, width, height };
      }

      const apngBuffer = UPNG.encode(frameBuffers, logicalWidth, logicalHeight, 0, delays);
      const blob = new Blob([apngBuffer], { type: 'image/png' });
      const url = URL.createObjectURL(blob);

      setApngUrl(url);
      setDimensions({ w: logicalWidth, h: logicalHeight });
      setFrameCount(frames.length);
    } catch {
      setError('Failed to convert this GIF. It may be corrupted or use an unsupported format.');
    } finally {
      setLoading(false);
    }
  }, [selectedFile]);

  const clearAll = () => {
    setFileName('');
    setSourceUrl(null);
    setSelectedFile(null);
    reset();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">GIF to APNG</span>
        {(sourceUrl || apngUrl) && (
          <button type="button" onClick={clearAll} className="tb-v2-btn-sm">
            Clear
          </button>
        )}
      </div>

      <p style={{ fontSize: 13, color: 'var(--tb-v2-muted, #6b7280)', margin: '4px 0 12px' }}>
        Converts your animated GIF to an animated PNG (APNG) — same animation, often smaller file size.
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/gif,.gif"
        onChange={handleFileChange}
        className="tb-v2-file-input"
        aria-label="Choose a GIF file"
      />

      {selectedFile && (
        <button
          type="button"
          onClick={convert}
          disabled={loading}
          className="tb-v2-btn tb-v2-btn-primary tb-v2-btn-lg"
          style={{ marginTop: 12 }}
        >
          {loading ? 'Converting…' : 'Convert to APNG'}
        </button>
      )}

      {loading && (
        <p style={{ fontSize: 13, color: 'var(--tb-v2-muted, #6b7280)', marginTop: 8 }}>
          Decoding frames and encoding the APNG — this can take a few seconds for larger GIFs.
        </p>
      )}

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

          {apngUrl && (
            <div>
              <p className="tb-v2-tool-label" style={{ marginBottom: 8 }}>
                APNG Result
                {dimensions ? ` (${dimensions.w}×${dimensions.h})` : ''}
                {frameCount ? `, ${frameCount} frame${frameCount === 1 ? '' : 's'}` : ''}
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={apngUrl}
                alt="Converted APNG"
                style={{ maxWidth: 260, maxHeight: 260, borderRadius: 8, display: 'block' }}
              />
              <a
                href={apngUrl}
                download="converted.png"
                className="tb-v2-btn-primary"
                style={{ display: 'inline-block', marginTop: 10, textDecoration: 'none' }}
              >
                Download APNG
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
