'use client';

import { useMemo, useRef, useState } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { FileSizeError, UpgradeNotice } from '@/components/FileSizeGuard';

function num(v: string): number | null {
  const n = parseFloat(v);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}

export default function ImageDpiResizerClient() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [sourceWidth, setSourceWidth] = useState(0);
  const [sourceHeight, setSourceHeight] = useState(0);
  const [currentDpi, setCurrentDpi] = useState('72');
  const [targetDpi, setTargetDpi] = useState('300');
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { tier } = useSubscription();
  const maxSizeMB = tier === 'free' ? 5 : tier === 'starter' ? 10 : tier === 'ultra' ? 100 : tier === 'max' ? 500 : 5;
  const isOversized = file != null && file.size / (1024 * 1024) > maxSizeMB;

  const fromDpi = num(currentDpi);
  const toDpi = num(targetDpi);
  const scale = fromDpi && toDpi ? toDpi / fromDpi : null;
  const targetWidth = sourceWidth && scale ? Math.max(1, Math.round(sourceWidth * scale)) : 0;
  const targetHeight = sourceHeight && scale ? Math.max(1, Math.round(sourceHeight * scale)) : 0;
  const printInches = useMemo(() => {
    if (!sourceWidth || !sourceHeight || !fromDpi) return null;
    return {
      w: round(sourceWidth / fromDpi),
      h: round(sourceHeight / fromDpi),
    };
  }, [sourceWidth, sourceHeight, fromDpi]);

  const loadFile = (next: File | undefined) => {
    if (!next) return;
    if (!next.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }
    setError('');
    setFile(next);
    const url = URL.createObjectURL(next);
    const img = new Image();
    img.onload = () => {
      setSourceWidth(img.naturalWidth);
      setSourceHeight(img.naturalHeight);
      if (preview) URL.revokeObjectURL(preview);
      setPreview(url);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      setError('Could not load this image.');
    };
    img.src = url;
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas || !preview || !targetWidth || !targetHeight || isOversized) return;
    const img = new Image();
    img.onload = () => {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = `dpi-${toDpi}-${targetWidth}x${targetHeight}.png`;
      a.click();
    };
    img.src = preview;
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Image</span>
      </div>
      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {error && <div className="tb-v2-banner tb-v2-banner-err">{error}</div>}
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => loadFile(e.target.files?.[0])}
            className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-red-600 file:text-white file:text-sm file:font-medium hover:file:bg-red-700 cursor-pointer"
          />
          <UpgradeNotice tier={tier} />
          <FileSizeError file={file} maxSizeMB={maxSizeMB} />
        </div>

        {preview && (
          <img src={preview} alt="Selected" className="max-h-56 mx-auto rounded-lg" />
        )}

        <div className="tb-v2-grid-2">
          <div style={{ paddingRight: 12 }}>
            <span className="tb-v2-tool-label">Current DPI</span>
            <input
              type="number"
              min={1}
              className="tb-v2-input"
              style={{ marginTop: 8, fontFamily: 'var(--f-mono)' }}
              value={currentDpi}
              onChange={(e) => setCurrentDpi(e.target.value)}
            />
          </div>
          <div style={{ paddingLeft: 12 }}>
            <span className="tb-v2-tool-label">Target DPI</span>
            <input
              type="number"
              min={1}
              className="tb-v2-input"
              style={{ marginTop: 8, fontFamily: 'var(--f-mono)' }}
              value={targetDpi}
              onChange={(e) => setTargetDpi(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Print resize</span>
      </div>
      <div className="tb-v2-tool-output-body">
        {!sourceWidth ? (
          <p className="tb-v2-empty">Upload an image to calculate the new print resolution.</p>
        ) : (
          <>
            <div className="tb-v2-stats-grid">
              <div className="tb-v2-stat-pill">
                <div style={{ fontSize: 11, color: 'var(--fg-2)' }}>Current pixels</div>
                <div style={{ fontFamily: 'var(--f-mono)', fontWeight: 600 }}>{sourceWidth} × {sourceHeight}</div>
              </div>
              <div className="tb-v2-stat-pill">
                <div style={{ fontSize: 11, color: 'var(--fg-2)' }}>New pixels</div>
                <div style={{ fontFamily: 'var(--f-mono)', fontWeight: 600 }}>{targetWidth} × {targetHeight}</div>
              </div>
              <div className="tb-v2-stat-pill">
                <div style={{ fontSize: 11, color: 'var(--fg-2)' }}>Print size</div>
                <div style={{ fontFamily: 'var(--f-mono)', fontWeight: 600 }}>
                  {printInches ? `${printInches.w} × ${printInches.h} in` : '—'}
                </div>
              </div>
              <div className="tb-v2-stat-pill">
                <div style={{ fontSize: 11, color: 'var(--fg-2)' }}>Scale</div>
                <div style={{ fontFamily: 'var(--f-mono)', fontWeight: 600 }}>
                  {scale ? `${round(scale * 100)}%` : '—'}
                </div>
              </div>
            </div>
            <button
              type="button"
              className="tb-v2-btn tb-v2-btn-primary"
              style={{ marginTop: 16 }}
              onClick={download}
              disabled={!targetWidth || isOversized}
            >
              Download {targetWidth}×{targetHeight} PNG
            </button>
          </>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
