'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, FileImage } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { FileSizeError, UpgradeNotice } from '@/components/FileSizeGuard';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const MAX_CANVAS_SIDE = 8192;
const MAX_CANVAS_PIXELS = 40_000_000;

type ResizeValidation =
  | { valid: true; width: number; height: number; error: '' }
  | { valid: false; width: 0; height: 0; error: string };

type ResizeFormatChoice = 'auto' | 'png' | 'jpeg' | 'webp';

type ResizeExportPlan = {
  width: number;
  height: number;
  requestedMimeType: string;
  extension: 'png' | 'jpg' | 'webp';
  formatLabel: 'PNG' | 'JPEG' | 'WebP';
  filename: string;
  unsupportedSourceFormat: boolean;
  note: string;
};

type ResizeResult = {
  url: string;
  filename: string;
  sourceWidth: number;
  sourceHeight: number;
  sourceFormatLabel: string;
  width: number;
  height: number;
  mimeType: string;
  formatLabel: string;
  sizeBytes: number;
  sizeChange: ReturnType<typeof getImageResizerSizeChange>;
  notes: string[];
};

const MIME_TO_FORMAT: Record<string, { choice: Exclude<ResizeFormatChoice, 'auto'>; mimeType: string; extension: 'png' | 'jpg' | 'webp'; label: 'PNG' | 'JPEG' | 'WebP' }> = {
  'image/png': { choice: 'png', mimeType: 'image/png', extension: 'png', label: 'PNG' },
  'image/jpeg': { choice: 'jpeg', mimeType: 'image/jpeg', extension: 'jpg', label: 'JPEG' },
  'image/jpg': { choice: 'jpeg', mimeType: 'image/jpeg', extension: 'jpg', label: 'JPEG' },
  'image/webp': { choice: 'webp', mimeType: 'image/webp', extension: 'webp', label: 'WebP' },
};

const FORMAT_TO_MIME: Record<Exclude<ResizeFormatChoice, 'auto'>, { mimeType: string; extension: 'png' | 'jpg' | 'webp'; label: 'PNG' | 'JPEG' | 'WebP' }> = {
  png: { mimeType: 'image/png', extension: 'png', label: 'PNG' },
  jpeg: { mimeType: 'image/jpeg', extension: 'jpg', label: 'JPEG' },
  webp: { mimeType: 'image/webp', extension: 'webp', label: 'WebP' },
};

const DEFAULT_QUALITY = 86;

export function validateResizeDimensions(rawWidth: number, rawHeight: number): ResizeValidation {
  if (!Number.isFinite(rawWidth) || !Number.isFinite(rawHeight)) {
    return { valid: false, width: 0, height: 0, error: 'Enter a width and height before downloading.' };
  }

  if (!Number.isInteger(rawWidth) || !Number.isInteger(rawHeight)) {
    return { valid: false, width: 0, height: 0, error: 'Width and height must be whole pixels.' };
  }

  if (rawWidth < 1 || rawHeight < 1) {
    return { valid: false, width: 0, height: 0, error: 'Width and height must be at least 1 pixel.' };
  }

  if (rawWidth > MAX_CANVAS_SIDE || rawHeight > MAX_CANVAS_SIDE) {
    return { valid: false, width: 0, height: 0, error: `Use dimensions up to ${MAX_CANVAS_SIDE} px on each side.` };
  }

  if (rawWidth * rawHeight > MAX_CANVAS_PIXELS) {
    return { valid: false, width: 0, height: 0, error: 'Use a smaller output size, up to 40 megapixels.' };
  }

  return { valid: true, width: rawWidth, height: rawHeight, error: '' };
}

function getSafeBaseName(fileName: string) {
  return (fileName.replace(/\.[^.]+$/, '').trim() || 'image').replace(/[^\w.-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'image';
}

function getMimeLabel(mimeType: string) {
  if (!mimeType) return 'that format';
  const subtype = mimeType.split('/')[1] || mimeType;
  return subtype
    .replace('svg+xml', 'SVG')
    .replace('jpeg', 'JPEG')
    .replace('jpg', 'JPEG')
    .replace('png', 'PNG')
    .replace('webp', 'WebP')
    .replace('gif', 'GIF')
    .toUpperCase();
}

function inferSourceMimeType(sourceMimeType: string, sourceFileName: string) {
  const normalizedMime = sourceMimeType.toLowerCase();
  if (normalizedMime) return normalizedMime;
  const extension = sourceFileName.toLowerCase().split('.').pop();
  if (extension === 'jpg' || extension === 'jpeg') return 'image/jpeg';
  if (extension === 'png') return 'image/png';
  if (extension === 'webp') return 'image/webp';
  if (extension === 'gif') return 'image/gif';
  if (extension === 'svg') return 'image/svg+xml';
  return '';
}

function getUnsupportedFormatLabel(mimeType: string, fileName: string) {
  if (mimeType) return getMimeLabel(mimeType);
  const extension = fileName.toLowerCase().split('.').pop();
  return extension ? `.${extension}` : 'Unknown source format';
}

export function getImageResizerExportPlan(
  rawWidth: number,
  rawHeight: number,
  sourceMimeType = '',
  sourceFileName = 'image',
  formatChoice: ResizeFormatChoice = 'auto',
): ResizeExportPlan | null {
  const validation = validateResizeDimensions(rawWidth, rawHeight);
  if (!validation.valid) return null;
  const normalizedSourceMime = inferSourceMimeType(sourceMimeType, sourceFileName);
  const sourceFormat = MIME_TO_FORMAT[normalizedSourceMime];
  const selectedFormat = formatChoice === 'auto'
    ? sourceFormat ?? FORMAT_TO_MIME.png
    : FORMAT_TO_MIME[formatChoice];
  const unsupportedSourceFormat = formatChoice === 'auto' && !sourceFormat;
  const note = unsupportedSourceFormat
    ? `${getUnsupportedFormatLabel(normalizedSourceMime, sourceFileName)} is not exportable here, so Auto will create a PNG.`
    : '';

  return {
    width: validation.width,
    height: validation.height,
    requestedMimeType: selectedFormat.mimeType,
    extension: selectedFormat.extension,
    formatLabel: selectedFormat.label,
    filename: `${getSafeBaseName(sourceFileName)}-resized-${validation.width}x${validation.height}.${selectedFormat.extension}`,
    unsupportedSourceFormat,
    note,
  };
}

export function formatImageResizerBytes(bytes: number) {
  return `${Math.round(bytes).toLocaleString()} bytes (${(bytes / 1024).toFixed(1)} KB)`;
}

export function getImageResizerSizeChange(originalBytes: number, resizedBytes: number) {
  const bytes = resizedBytes - originalBytes;
  const percent = originalBytes > 0 ? Number(((bytes / originalBytes) * 100).toFixed(1)) : 0;
  const sign = bytes > 0 ? '+' : '';
  const percentSign = percent > 0 ? '+' : '';
  return {
    bytes,
    percent,
    label: `${sign}${bytes.toLocaleString()} bytes (${percentSign}${percent.toFixed(1)}%)`,
    grew: bytes > 0,
  };
}

function getActualFormatFromMime(mimeType: string) {
  const normalized = mimeType.toLowerCase();
  return MIME_TO_FORMAT[normalized] ?? FORMAT_TO_MIME.png;
}

function getSourceFormatLabel(sourceMimeType: string, sourceFileName: string) {
  const inferredMimeType = inferSourceMimeType(sourceMimeType, sourceFileName);
  return MIME_TO_FORMAT[inferredMimeType]?.label ?? getUnsupportedFormatLabel(inferredMimeType, sourceFileName);
}

export default function ImageResizerClient() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [maintain, setMaintain] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formatChoice, setFormatChoice] = useState<ResizeFormatChoice>('auto');
  const [quality, setQuality] = useState(DEFAULT_QUALITY);
  const [result, setResult] = useState<ResizeResult | null>(null);
  const [encoding, setEncoding] = useState(false);
  const loadId = useRef(0);
  const encodeId = useRef(0);
  const resultUrlRef = useRef('');
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);
  useEffect(() => () => {
    loadId.current++;
    encodeId.current++;
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
  }, []);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { tier } = useSubscription();
  const maxSizeMB = tier === 'free' ? 5 : tier === 'starter' ? 10 : tier === 'ultra' ? 100 : tier === 'max' ? 500 : 5;

  const isOversized = file != null && file.size / (1024 * 1024) > maxSizeMB;
  const dimensionValidation = validateResizeDimensions(width, height);
  const canResize = Boolean(file && preview && dimensions.width && dimensionValidation.valid && !isOversized && !loading && !encoding);
  const dimensionErrorId = 'image-resizer-dimension-error';
  const limitsHintId = 'image-resizer-limits-hint';
  const dimensionDescribedBy = dimensionValidation.valid ? limitsHintId : `${limitsHintId} ${dimensionErrorId}`;
  const exportPlan = file ? getImageResizerExportPlan(width, height, file.type, file.name, formatChoice) : null;
  const showQuality = exportPlan?.requestedMimeType === 'image/jpeg' || exportPlan?.requestedMimeType === 'image/webp';

  const clearResult = () => {
    encodeId.current++;
    setEncoding(false);
    if (resultUrlRef.current) {
      URL.revokeObjectURL(resultUrlRef.current);
      resultUrlRef.current = '';
    }
    setResult(null);
  };

  const replaceResult = (nextResult: ResizeResult) => {
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    resultUrlRef.current = nextResult.url;
    setResult(nextResult);
  };

  const cancelResultOnly = () => {
    encodeId.current++;
    if (resultUrlRef.current) {
      URL.revokeObjectURL(resultUrlRef.current);
      resultUrlRef.current = '';
    }
    setResult(null);
  };

  const loadFile = (f: File) => {
    const id = ++loadId.current;
    clearResult();
    setLoading(false);
    setError('');
    if (f.type && !f.type.startsWith('image/')) {
      setDimensions({ width: 0, height: 0 });
      setFile(null);
      setPreview('');
      setError('That file type is not supported. Choose a PNG, JPEG, WebP, GIF, or another browser-supported image.');
      return;
    }
    setLoading(true);
    setDimensions({ width: 0, height: 0 });
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
    const img = new Image();
    img.onload = () => {
      if (id !== loadId.current) return;
      if (!img.naturalWidth || !img.naturalHeight) {
        setPreview('');
        setDimensions({ width: 0, height: 0 });
        setLoading(false);
        setError('This image decoded with zero dimensions. Try another file or upload a replacement.');
        return;
      }
      setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      setWidth(img.naturalWidth);
      setHeight(img.naturalHeight);
      setLoading(false);
      setError('');
    };
    img.onerror = () => {
      if (id !== loadId.current) return;
      setPreview('');
      setDimensions({ width: 0, height: 0 });
      setLoading(false);
      setError('This image could not be decoded. Try another file or clear it and upload a replacement.');
    };
    img.src = url;
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) loadFile(f);
    e.target.value = '';
  };

  const loadExample = async () => {
    const id = ++loadId.current;
    clearResult();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/samples/tool-sample.png');
      if (!response.ok) throw new Error('Sample image request failed.');
      const blob = await response.blob();
      if (id !== loadId.current) return;
      loadFile(new File([blob], 'tool-sample.png', { type: blob.type || 'image/png' }));
    } catch {
      if (id !== loadId.current) return;
      setLoading(false);
      setError('The sample image could not be loaded. Try the example again or upload your own image.');
    }
  };

  const clear = () => {
    loadId.current++;
    clearResult();
    setIsDragging(false);
    setLoading(false);
    setError('');
    setDimensions({ width: 0, height: 0 });
    setFile(null);
    setPreview('');
    setWidth(800);
    setHeight(600);
    setMaintain(true);
    setFormatChoice('auto');
    setQuality(DEFAULT_QUALITY);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const resize = () => {
    const plan = getImageResizerExportPlan(width, height, file?.type, file?.name, formatChoice);
    if (!plan) {
      setError(dimensionValidation.error);
      return;
    }
    if (!preview || !file || !dimensions.width || isOversized) return;
    cancelResultOnly();
    const sourceLoadId = loadId.current;
    const currentEncodeId = ++encodeId.current;
    const sourceUrl = preview;
    setEncoding(true);
    setError('');
    const canvas = canvasRef.current;
    if (!canvas) {
      if (currentEncodeId === encodeId.current) setEncoding(false);
      setError('Could not create the resize canvas in this browser. Try reloading the page.');
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      if (currentEncodeId === encodeId.current) setEncoding(false);
      setError('Could not start the image export in this browser. Try a different image or reload the page.');
      return;
    }
    const img = new Image();
    img.onload = () => {
      if (sourceLoadId !== loadId.current || currentEncodeId !== encodeId.current || sourceUrl !== preview) return;
      canvas.width = plan.width;
      canvas.height = plan.height;
      const nextCtx = canvas.getContext('2d');
      if (!nextCtx) {
        if (currentEncodeId === encodeId.current) setEncoding(false);
        setError('Could not finish the image export in this browser. Try a different image or reload the page.');
        return;
      }
      if (plan.requestedMimeType === 'image/jpeg') {
        nextCtx.fillStyle = '#ffffff';
        nextCtx.fillRect(0, 0, plan.width, plan.height);
      } else {
        nextCtx.clearRect(0, 0, plan.width, plan.height);
      }
      nextCtx.drawImage(img, 0, 0, plan.width, plan.height);
      try {
        canvas.toBlob((blob) => {
          if (sourceLoadId !== loadId.current || currentEncodeId !== encodeId.current || sourceUrl !== preview) return;
          if (!blob) {
            setEncoding(false);
            setError('The resized image could not be exported. Try smaller dimensions or a replacement image.');
            return;
          }
          const actualFormat = getActualFormatFromMime(blob.type || plan.requestedMimeType);
          const actualMimeType = blob.type || actualFormat.mimeType;
          const actualFilename = actualFormat.extension === plan.extension
            ? plan.filename
            : `${getSafeBaseName(file.name)}-resized-${plan.width}x${plan.height}.${actualFormat.extension}`;
          const notes: string[] = [];
          if (plan.note) notes.push(plan.note);
          if (actualMimeType !== plan.requestedMimeType) {
            notes.push(`Your browser encoded ${actualFormat.label} instead of ${plan.formatLabel}; the download uses the actual format.`);
          }
          if (plan.requestedMimeType === 'image/jpeg') {
            notes.push('JPEG does not support transparency, so transparent pixels were composited on white.');
          }
          const sizeChange = getImageResizerSizeChange(file.size, blob.size);
          if (sizeChange.grew) {
            notes.push('This resized file is larger. Pixel resizing does not guarantee a smaller file. Try JPEG/WebP with lower quality, or choose a different format.');
          }
          replaceResult({
            url: URL.createObjectURL(blob),
            filename: actualFilename,
            sourceWidth: dimensions.width,
            sourceHeight: dimensions.height,
            sourceFormatLabel: getSourceFormatLabel(file.type, file.name),
            width: plan.width,
            height: plan.height,
            mimeType: actualMimeType,
            formatLabel: actualFormat.label,
            sizeBytes: blob.size,
            sizeChange,
            notes,
          });
          setEncoding(false);
        }, plan.requestedMimeType, showQuality ? quality / 100 : undefined);
      } catch {
        if (currentEncodeId === encodeId.current) setEncoding(false);
        setError('The resized image could not be exported. Try smaller dimensions or a replacement image.');
      }
    };
    img.onerror = () => {
      if (sourceLoadId !== loadId.current || currentEncodeId !== encodeId.current) return;
      setEncoding(false);
      setError('The source image could not be decoded for export. Try clearing it and uploading a replacement.');
    };
    img.src = sourceUrl;
  };

  return (
    <div className="tb-image-tool">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Image</span>
        <ToolExampleClearActions onExample={loadExample} onClear={clear} canClear={Boolean(file || preview || error || loading)} exampleDisabled={loading} />
      </div>
      <div className="tb-image-tool-body">
        <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFile} hidden aria-label="Select image to resize" />
        <button
          type="button"
          className={`tb-v2-dropzone tb-image-upload ${file ? 'tb-image-upload-compact' : ''} ${isDragging ? 'dragging' : ''}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); const dropped = e.dataTransfer.files[0]; if (dropped) loadFile(dropped); }}
          aria-label={file ? 'Replace image. Click or drop an image' : 'Choose image or drag and drop'}
        >
          {file ? <FileImage size={22} aria-hidden="true" /> : <Upload size={28} aria-hidden="true" />}
          <span className="tb-image-upload-copy">
            <span className="tb-v2-dropzone-text">{loading ? 'Loading image...' : file ? file.name : 'Click to upload or drag an image here'}</span>
            <span className="tb-v2-dropzone-hint">{file ? `${(file.size / 1024).toFixed(1)} KB · Click or drop to replace` : 'PNG, JPEG, WebP, GIF and other browser-supported images'}</span>
          </span>
        </button>
        <div><UpgradeNotice tier={tier} /><FileSizeError file={file} maxSizeMB={maxSizeMB} /></div>
        {error && <div className="tb-v2-error" role="alert">{error}</div>}
        {preview && (
          <div className="tb-image-workspace">
            <figure className="tb-v2-card tb-image-preview-card">
              <figcaption className="tb-image-card-head"><span className="tb-v2-tool-label">Source preview</span><span className="tb-image-hint">{dimensions.width} × {dimensions.height} px</span></figcaption>
              <div className="tb-image-preview">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="Source image to resize" />
              </div>
              <a
                href={preview}
                download={file?.name}
                className="tb-v2-btn"
                aria-disabled={!dimensions.width}
                style={!dimensions.width ? { pointerEvents: 'none', opacity: 0.55 } : undefined}
                onClick={(e) => { if (!dimensions.width) e.preventDefault(); }}
              >
                Download Original
              </a>
            </figure>
            <div className="tb-v2-card tb-image-settings">
              <span className="tb-v2-tool-label">Resize dimensions</span>
              <div className="tb-image-fields">
                <label className="tb-image-field">
                  <span>Width (px)</span>
                  <input type="number" value={width} min={1} max={MAX_CANVAS_SIDE} step={1} className="tb-v2-input" aria-invalid={!dimensionValidation.valid} aria-describedby={dimensionDescribedBy} onChange={(e) => {
                    clearResult();
                    const value = Number(e.target.value);
                    setWidth(value);
                    if (maintain && dimensions.width) setHeight(Math.max(1, Math.round(value * dimensions.height / dimensions.width)));
                  }} />
                </label>
                <label className="tb-image-field">
                  <span>Height (px)</span>
                  <input type="number" value={height} min={1} max={MAX_CANVAS_SIDE} step={1} className="tb-v2-input" aria-invalid={!dimensionValidation.valid} aria-describedby={dimensionDescribedBy} onChange={(e) => {
                    clearResult();
                    const value = Number(e.target.value);
                    setHeight(value);
                    if (maintain && dimensions.height) setWidth(Math.max(1, Math.round(value * dimensions.width / dimensions.height)));
                  }} />
                </label>
              </div>
              <label className="tb-v2-checkbox-row"><input type="checkbox" checked={maintain} onChange={(e) => { clearResult(); setMaintain(e.target.checked); }} />Maintain aspect ratio</label>
              <label className="tb-image-field">
                <span>Output format</span>
                <select className="tb-v2-input" value={formatChoice} onChange={(e) => { clearResult(); setFormatChoice(e.target.value as ResizeFormatChoice); }}>
                  <option value="auto">Auto / Same as source</option>
                  <option value="png">PNG</option>
                  <option value="jpeg">JPEG</option>
                  <option value="webp">WebP</option>
                </select>
              </label>
              {showQuality && (
                <label className="tb-image-field">
                  <span>Quality: {quality}%</span>
                  <input type="range" min={10} max={100} step={1} value={quality} onChange={(e) => { clearResult(); setQuality(Number(e.target.value)); }} />
                </label>
              )}
              <p className="tb-image-hint">Output: {width} × {height} px · {exportPlan?.formatLabel ?? 'Auto'}</p>
              {exportPlan?.note && <p className="tb-image-hint">{exportPlan.note}</p>}
              {exportPlan?.requestedMimeType === 'image/jpeg' && <p className="tb-image-hint">JPEG exports use a white background where the source has transparency.</p>}
              <p id={limitsHintId} className="tb-image-hint">Use whole-pixel dimensions up to {MAX_CANVAS_SIDE} px per side and 40 MP total.</p>
              {!dimensionValidation.valid && <div id={dimensionErrorId} className="tb-v2-error" role="alert">{dimensionValidation.error}</div>}
              <button type="button" onClick={resize} disabled={!canResize} className="tb-v2-btn tb-v2-btn-primary" aria-busy={encoding}>
                {isOversized ? 'File Too Large' : encoding ? 'Resizing...' : 'Resize image'}
              </button>
            </div>
          </div>
        )}
        {result && (
          <div className="tb-v2-card tb-image-preview-card" aria-live="polite">
            <div className="tb-image-card-head">
              <span className="tb-v2-tool-label">Resized preview</span>
              <span className="tb-image-hint">{result.width} × {result.height} px · {result.formatLabel}</span>
            </div>
            <div className="tb-image-preview">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={result.url} alt="Resized image preview" />
            </div>
            <div className="tb-image-hint">
              <p>Original: {result.sourceWidth} × {result.sourceHeight} px · {result.sourceFormatLabel} · {formatImageResizerBytes(file?.size ?? 0)}</p>
              <p>Result: {result.width} × {result.height} px · {result.mimeType} · {formatImageResizerBytes(result.sizeBytes)}</p>
              <p><strong>File size change: {result.sizeChange.label}</strong></p>
              {result.notes.map((note) => <p className={note.startsWith('This resized file is larger.') ? 'tb-v2-error' : undefined} key={note}>{note}</p>)}
            </div>
            <a href={result.url} download={result.filename} className="tb-v2-btn tb-v2-btn-primary">
              Download resized image
            </a>
          </div>
        )}
      </div>
      <canvas ref={canvasRef} hidden />
    </div>
  );
}
