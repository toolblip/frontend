'use client';

import { useState, useEffect, useRef } from 'react';
import { Upload, FileImage } from 'lucide-react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

type OutputFormat = 'jpeg' | 'png' | 'webp';
type DimensionValidation = { valid: true; error: '' } | { valid: false; error: string };

const DEFAULT_QUALITY = 80;
const MAX_CANVAS_SIDE = 8192;
const MAX_CANVAS_PIXELS = 40_000_000;
const SAMPLE_URL = '/samples/image-resizer-mountain.jpg';
const SAMPLE_NAME = 'image-resizer-mountain.jpg';
const SAMPLE_MIME = 'image/jpeg';

const FORMAT_OPTIONS: Record<OutputFormat, { requestedMimeType: string; requestedExtension: 'jpg' | 'png' | 'webp'; formatLabel: 'JPEG' | 'PNG' | 'WebP'; qualityApplies: boolean }> = {
  jpeg: { requestedMimeType: 'image/jpeg', requestedExtension: 'jpg', formatLabel: 'JPEG', qualityApplies: true },
  png: { requestedMimeType: 'image/png', requestedExtension: 'png', formatLabel: 'PNG', qualityApplies: false },
  webp: { requestedMimeType: 'image/webp', requestedExtension: 'webp', formatLabel: 'WebP', qualityApplies: true },
};

export function validateCompressorDimensions(width: number, height: number): DimensionValidation {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width < 1 || height < 1) {
    return { valid: false, error: 'This image decoded with zero dimensions. Try another file.' };
  }

  if (width > MAX_CANVAS_SIDE || height > MAX_CANVAS_SIDE) {
    return { valid: false, error: `Use images up to ${MAX_CANVAS_SIDE} px on each side.` };
  }

  if (width * height > MAX_CANVAS_PIXELS) {
    return { valid: false, error: 'Use a smaller image, up to 40 megapixels.' };
  }

  return { valid: true, error: '' };
}

function getSafeBaseName(fileName: string) {
  return (fileName.replace(/\.[^.]+$/, '').trim() || 'image').replace(/[^\w.-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'image';
}

function getFormatFromMime(mimeType: string, fallbackName = '') {
  const normalized = mimeType.toLowerCase();
  if (normalized === 'image/jpeg' || normalized === 'image/jpg') return { extension: 'jpg', label: 'JPEG', mimeType: 'image/jpeg' };
  if (normalized === 'image/png') return { extension: 'png', label: 'PNG', mimeType: 'image/png' };
  if (normalized === 'image/webp') return { extension: 'webp', label: 'WebP', mimeType: 'image/webp' };
  const extension = fallbackName.toLowerCase().split('.').pop();
  if (extension === 'jpg' || extension === 'jpeg') return { extension: 'jpg', label: 'JPEG', mimeType: 'image/jpeg' };
  if (extension === 'png') return { extension: 'png', label: 'PNG', mimeType: 'image/png' };
  if (extension === 'webp') return { extension: 'webp', label: 'WebP', mimeType: 'image/webp' };
  return { extension: extension || 'image', label: (extension || 'File').toUpperCase(), mimeType: mimeType || '' };
}

export function getImageCompressorPlan(format: OutputFormat, sourceFileName: string) {
  const option = FORMAT_OPTIONS[format];
  return {
    ...option,
    filename: `${getSafeBaseName(sourceFileName)}-compressed.${option.requestedExtension}`,
  };
}

export function getImageCompressorOutputPolicy({
  original,
  encoded,
  originalName,
  compressedName,
  requestedMimeType,
}: {
  original: Blob;
  encoded: Blob;
  originalName: string;
  compressedName: string;
  requestedMimeType: string;
}) {
  if (encoded.size >= original.size) {
    const originalFormat = getFormatFromMime(original.type, originalName);
    return {
      blob: original,
      fileName: originalName,
      formatLabel: originalFormat.label,
      keptOriginal: true,
      note: 'No smaller export was available with these settings. The original file was kept unchanged.',
    };
  }

  const actualMimeType = encoded.type || requestedMimeType;
  const actualFormat = getFormatFromMime(actualMimeType, compressedName);
  const requestedFormat = getFormatFromMime(requestedMimeType);
  const fellBack = actualFormat.mimeType && actualFormat.mimeType !== requestedMimeType;
  const finalName = fellBack
    ? `${getSafeBaseName(compressedName)}.${actualFormat.extension}`
    : compressedName;

  return {
    blob: encoded,
    fileName: finalName,
    formatLabel: actualFormat.label,
    keptOriginal: false,
    note: fellBack ? `Your browser exported ${actualFormat.label} instead of ${requestedFormat.label}.` : null,
  };
}

export function getImageCompressorResultSummary(keptOriginal: boolean, compressionRatio: number) {
  if (keptOriginal) {
    return {
      title: 'Original kept · no size reduction',
      sizeWord: 'unchanged',
    };
  }

  return {
    title: compressionRatio > 0 ? `${compressionRatio}% smaller` : 'Less than 1% smaller',
    sizeWord: 'compressed',
  };
}

export default function ImageCompressorClient() {
  const [image, setImage] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [quality, setQuality] = useState(DEFAULT_QUALITY);
  const [format, setFormat] = useState<OutputFormat>('jpeg');
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [isLoadingSample, setIsLoadingSample] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [resultNote, setResultNote] = useState<string | null>(null);
  const [resultKeptOriginal, setResultKeptOriginal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [resultFormat, setResultFormat] = useState('');
  const [resultFileName, setResultFileName] = useState('');
  const loadId = useRef(0);
  const encodeId = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => () => {
    loadId.current++;
    encodeId.current++;
  }, []);

  const invalidateResult = () => {
    encodeId.current++;
    setIsCompressing(false);
    setResult(null);
    setCompressedSize(0);
    setResultFormat('');
    setResultFileName('');
    setResultNote(null);
    setResultKeptOriginal(false);
  };

  const resetWorkspace = () => {
    invalidateResult();
    setSourceFile(null);
    setFileName('');
    setOriginalSize(0);
    setImage(null);
    setOriginalDimensions({ width: 0, height: 0 });
  };

  const loadFile = (file: File) => {
    const id = ++loadId.current;
    invalidateResult();
    setError(null);
    setIsDragging(false);
    setIsLoadingSample(false);
    if (file.type && !file.type.startsWith('image/')) {
      resetWorkspace();
      setIsLoadingImage(false);
      setError('That file type is not supported. Choose a PNG, JPEG, WebP, GIF, or another browser-supported image.');
      return;
    }
    setIsLoadingImage(true);
    setSourceFile(file);
    setFileName(file.name);
    setOriginalSize(file.size);
    setImage(null);
    setOriginalDimensions({ width: 0, height: 0 });
    const fail = () => {
      if (id !== loadId.current) return;
      resetWorkspace();
      setIsLoadingImage(false);
      setError('This image could not be read. Please try another file.');
    };
    const reader = new FileReader();
    reader.onerror = fail;
    reader.onabort = fail;
    reader.onload = () => {
      if (id !== loadId.current) return;
      const src = reader.result;
      if (typeof src !== 'string') { fail(); return; }

      const img = new Image();
      img.onload = () => {
        if (id !== loadId.current) return;
        const validation = validateCompressorDimensions(img.naturalWidth, img.naturalHeight);
        if (!validation.valid) {
          resetWorkspace();
          setIsLoadingImage(false);
          setError(validation.error);
          return;
        }
        setImage(src);
        setOriginalDimensions({ width: img.naturalWidth, height: img.naturalHeight });
        setIsLoadingImage(false);
      };
      img.onerror = fail;
      img.src = src;
    };
    try { reader.readAsDataURL(file); } catch { fail(); }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) loadFile(file);
    e.target.value = '';
  };

  const loadExample = async () => {
    const id = ++loadId.current;
    resetWorkspace();
    setIsLoadingImage(true);
    setIsLoadingSample(true);
    setError(null);
    setFormat('jpeg');
    setQuality(DEFAULT_QUALITY);
    try {
      const response = await fetch(SAMPLE_URL);
      if (!response.ok) throw new Error('Sample image unavailable');
      const blob = await response.blob();
      if (id !== loadId.current) return;
      loadFile(new File([blob], SAMPLE_NAME, { type: blob.type || SAMPLE_MIME }));
    } catch {
      if (id !== loadId.current) return;
      resetWorkspace();
      setIsLoadingImage(false);
      setIsLoadingSample(false);
      setError('The sample image could not be loaded. Please try again.');
    }
  };

  const clear = () => {
    loadId.current++;
    encodeId.current++;
    setIsLoadingImage(false);
    setIsLoadingSample(false);
    setIsDragging(false);
    setIsCompressing(false);
    setError(null);
    setFileName('');
    setImage(null);
    setOriginalSize(0);
    setCompressedSize(0);
    setOriginalDimensions({ width: 0, height: 0 });
    setResult(null);
    setSourceFile(null);
    setResultNote(null);
    setResultKeptOriginal(false);
    setResultFormat('');
    setResultFileName('');
    setQuality(DEFAULT_QUALITY);
    setFormat('jpeg');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const compressImage = () => {
    if (!image || !sourceFile || !canvasRef.current || isCompressing || isLoadingImage) return;

    const id = ++encodeId.current;
    setIsCompressing(true);
    setError(null);
    setResult(null);
    setResultNote(null);
    setResultKeptOriginal(false);
    setCompressedSize(0);
    setResultFormat('');
    setResultFileName('');

    const canvas = canvasRef.current;
    const fail = () => {
      if (id !== encodeId.current) return;
      setError('This image could not be compressed. Please try again or choose another image.');
      setIsCompressing(false);
    };

    const img = new Image();
    img.onerror = fail;
    img.onload = () => {
      if (id !== encodeId.current) return;
      try {
        const validation = validateCompressorDimensions(img.naturalWidth, img.naturalHeight);
        if (!validation.valid) {
          setError(validation.error);
          setIsCompressing(false);
          return;
        }
        const ctx = canvas.getContext('2d');
        if (!ctx) { fail(); return; }
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        if (format === 'jpeg') {
          ctx.fillStyle = '#fff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(img, 0, 0);
        const plan = getImageCompressorPlan(format, sourceFile.name);

        canvas.toBlob((blob) => {
          if (id !== encodeId.current) return;
          if (!blob) { fail(); return; }
          const policy = getImageCompressorOutputPolicy({
            original: sourceFile,
            encoded: blob,
            originalName: sourceFile.name,
            compressedName: plan.filename,
            requestedMimeType: plan.requestedMimeType,
          });

          const reader = new FileReader();
          reader.onerror = fail;
          reader.onabort = fail;
          reader.onload = () => {
            if (id !== encodeId.current) return;
            if (typeof reader.result !== 'string') { fail(); return; }
            setResult(reader.result);
            setCompressedSize(policy.blob.size);
            setResultFormat(policy.formatLabel);
            setResultFileName(policy.fileName);
            setResultNote(policy.note);
            setResultKeptOriginal(policy.keptOriginal);
            setIsCompressing(false);
          };
          try { reader.readAsDataURL(policy.blob); } catch { fail(); }
        }, plan.requestedMimeType, plan.qualityApplies ? quality / 100 : undefined);
      } catch { fail(); }
    };
    img.src = image;
  };

  const handleDownload = () => {
    if (!result) return;
    const link = document.createElement('a');
    link.download = resultFileName;
    link.href = result;
    link.click();
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const compressionRatio = originalSize > 0 && compressedSize > 0
    ? Math.round((1 - compressedSize / originalSize) * 100)
    : 0;
  const outputPlan = sourceFile ? getImageCompressorPlan(format, sourceFile.name) : null;
  const qualityApplies = outputPlan?.qualityApplies ?? false;
  const canClear = !!sourceFile || !!image || !!result || !!error || isLoadingImage || isLoadingSample || isCompressing;
  const resultSummary = getImageCompressorResultSummary(resultKeptOriginal, compressionRatio);

  return (
    <div className="tb-image-tool">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Image</span>
        <ToolExampleClearActions onExample={loadExample} onClear={clear} canClear={canClear} />
      </div>
      <div className="tb-image-tool-body">
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} hidden aria-label="Select image to compress" />
        <button
          type="button"
          className={`tb-v2-dropzone tb-image-upload ${image ? 'tb-image-upload-compact' : ''} ${isDragging ? 'dragging' : ''}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); const dropped = e.dataTransfer.files[0]; if (dropped) loadFile(dropped); }}
          aria-label={image ? 'Replace image. Click or drop an image' : 'Choose image or drag and drop'}
          disabled={isLoadingImage}
        >
          {image ? <FileImage size={22} aria-hidden="true" /> : <Upload size={28} aria-hidden="true" />}
          <span className="tb-image-upload-copy">
            <span className="tb-v2-dropzone-text">{isLoadingImage ? (isLoadingSample ? 'Loading example…' : 'Loading image…') : image ? fileName : 'Click to upload or drag an image here'}</span>
            <span className="tb-v2-dropzone-hint">{isLoadingImage ? 'You can clear this while it loads.' : image ? `${formatBytes(originalSize)} · Click or drop to replace` : 'PNG, JPEG, WebP, GIF and other browser-supported images'}</span>
          </span>
        </button>
        {error && <p className="tb-image-hint" role="alert">{error}</p>}
        {image && (
          <>
            <div className="tb-v2-card tb-image-settings">
              <div className="tb-image-fields">
                <div className="tb-image-field">
                  <span className="tb-v2-tool-label">Output format</span>
                  <div className="tb-v2-mode-tabs" role="group" aria-label="Output format">
                    {(['jpeg', 'png', 'webp'] as OutputFormat[]).map((option) => (
                      <button key={option} type="button" onClick={() => { setFormat(option); invalidateResult(); }} aria-pressed={format === option} className={`tb-v2-mode-tab ${format === option ? 'on' : ''}`}>
                        {option === 'webp' ? 'WebP' : option.toUpperCase()}
                      </button>
                    ))}
                  </div>
                  <p className="tb-image-hint">
                    {format === 'jpeg' && 'Good for photos. Adjustable quality and smaller files.'}
                    {format === 'png' && 'PNG is lossless here, so the quality slider is disabled.'}
                    {format === 'webp' && 'Compact images with adjustable quality.'}
                  </p>
                </div>
                <div className="tb-image-field">
                  <label className="tb-image-card-head" htmlFor="compress-quality"><span className="tb-v2-tool-label">Quality</span><span className="tb-v2-range-val">{qualityApplies ? `${quality}%` : 'PNG lossless'}</span></label>
                  <input id="compress-quality" type="range" min="1" max="100" value={quality} onChange={(e) => { setQuality(Number(e.target.value)); invalidateResult(); }} disabled={!qualityApplies} className="tb-image-quality" />
                  <p className="tb-image-hint">{qualityApplies ? 'Quality controls visual fidelity, not the final percent reduction.' : 'PNG ignores quality settings; try JPEG or WebP for lossy compression.'}</p>
                </div>
              </div>
              {format === 'jpeg' && <p className="tb-image-hint">Transparent pixels are composited on white because JPEG has no alpha channel.</p>}
              <div className="tb-image-actions">
                <button type="button" onClick={compressImage} disabled={isCompressing || isLoadingImage} className="tb-v2-btn tb-v2-btn-primary">{isCompressing ? 'Compressing…' : 'Compress Image'}</button>
              </div>
            </div>
            <div className="tb-image-workspace">
              <figure className="tb-v2-card tb-image-preview-card">
                <figcaption className="tb-image-card-head"><span className="tb-v2-tool-label">Original</span><span className="tb-image-hint">{formatBytes(originalSize)}</span></figcaption>
                <div className="tb-image-preview">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image} alt="Original image" />
                </div>
                <p className="tb-image-hint">{originalDimensions.width} × {originalDimensions.height} px</p>
              </figure>
              <figure className="tb-v2-card tb-image-preview-card">
                <figcaption className="tb-image-card-head"><span className="tb-v2-tool-label">Compressed</span>{result && <span className="tb-image-hint">{formatBytes(compressedSize)} · {resultFormat.toUpperCase()}</span>}</figcaption>
                <div className="tb-image-preview" aria-busy={isCompressing}>
                  {result ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={result} alt="Compressed image" />
                  ) : <p className="tb-image-hint">{isCompressing ? 'Compressing…' : 'Choose your settings and compress to preview the result.'}</p>}
                </div>
                <p className="tb-image-hint">{result ? `${originalDimensions.width} × ${originalDimensions.height} px` : 'Your compressed image will appear here.'}</p>
              </figure>
            </div>
            {result && (
              <div className="tb-v2-card tb-image-result" aria-live="polite">
                <div>
                  <strong>{resultSummary.title}</strong>
                  <p className="tb-image-hint">{formatBytes(originalSize)} original → {formatBytes(compressedSize)} {resultSummary.sizeWord}</p>
                  {resultNote && <p className="tb-image-hint">{resultNote}</p>}
                </div>
                <button type="button" onClick={handleDownload} className="tb-v2-btn tb-v2-btn-primary">Download {resultFormat.toUpperCase()}</button>
              </div>
            )}
          </>
        )}
      </div>
      <canvas ref={canvasRef} hidden />
    </div>
  );
}
