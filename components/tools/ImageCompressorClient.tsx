'use client';

import { useState, useRef } from 'react';
import { Upload, FileImage } from 'lucide-react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

type OutputFormat = 'jpeg' | 'png' | 'webp';

export default function ImageCompressorClient() {
  const [image, setImage] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState<OutputFormat>('jpeg');
  const [isCompressing, setIsCompressing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [resultNote, setResultNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [resultFormat, setResultFormat] = useState('');
  const [resultFileName, setResultFileName] = useState('');
  const loadId = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadFile = (file: File) => {
    if (file.type && !file.type.startsWith('image/')) return;
    const id = ++loadId.current;
    setSourceFile(file);
    setFileName(file.name);
    setOriginalSize(file.size);
    setImage(null);
    setOriginalDimensions({ width: 0, height: 0 });
    setResult(null);
    setCompressedSize(0);
    setResultFormat('');
    setResultFileName('');
    setResultNote(null);
    setError(null);
    setIsDragging(false);
    setIsCompressing(false);
    const fail = () => {
      if (id !== loadId.current) return;
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
        setImage(src);
        setOriginalDimensions({ width: img.width, height: img.height });
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
    const id = loadId.current;
    try {
      const response = await fetch('/samples/tool-sample.png');
      if (!response.ok) throw new Error('Sample image unavailable');
      const blob = await response.blob();
      if (id !== loadId.current) return;
      loadFile(new File([blob], 'tool-sample.png', { type: blob.type || 'image/png' }));
    } catch {
      if (id === loadId.current) setError('The sample image could not be loaded. Please try again.');
    }
  };

  const clear = () => {
    loadId.current++;
    setFileName('');
    setIsDragging(false);
    setIsCompressing(false);
    setImage(null);
    setOriginalSize(0);
    setCompressedSize(0);
    setOriginalDimensions({ width: 0, height: 0 });
    setResult(null);
    setSourceFile(null);
    setResultNote(null);
    setResultFormat('');
    setResultFileName('');
    setError(null);
    setQuality(80);
    setFormat('jpeg');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const compressImage = () => {
    if (!image || !sourceFile || !canvasRef.current || isCompressing) return;

    setIsCompressing(true);
    setError(null);
    setResult(null);
    setResultNote(null);
    setCompressedSize(0);
    setResultFormat('');
    setResultFileName('');

    const canvas = canvasRef.current;
    const id = loadId.current;
    const fail = () => {
      if (id !== loadId.current) return;
      setError('This image could not be compressed. Please try again or choose another image.');
      setIsCompressing(false);
    };

    const img = new Image();
    img.onerror = fail;
    img.onload = () => {
      if (id !== loadId.current) return;
      try {
        const ctx = canvas.getContext('2d');
        if (!ctx) { fail(); return; }
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          if (id !== loadId.current) return;
          if (!blob) { fail(); return; }

          const keepOriginal = blob.size >= sourceFile.size;
          const output = keepOriginal ? sourceFile : blob;
          const outputFormat = output.type.split('/')[1]?.split('+')[0]
            || (keepOriginal ? sourceFile.name.split('.').pop() : '');
          if (!outputFormat) { fail(); return; }

          const reader = new FileReader();
          reader.onerror = fail;
          reader.onabort = fail;
          reader.onload = () => {
            if (id !== loadId.current) return;
            if (typeof reader.result !== 'string') { fail(); return; }
            setResult(reader.result);
            setCompressedSize(output.size);
            setResultFormat(outputFormat);
            setResultFileName(keepOriginal ? sourceFile.name : `compressed.${outputFormat}`);
            setResultNote(keepOriginal ? 'No smaller export was available with these settings. The original was kept unchanged.' : null);
            setIsCompressing(false);
          };
          try { reader.readAsDataURL(output); } catch { fail(); }
        }, `image/${format}`, format === 'png' ? undefined : quality / 100);
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

  return (
    <div className="tb-image-tool">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Image</span>
        <ToolExampleClearActions onExample={loadExample} onClear={clear} canClear={!!sourceFile || !!error} />
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
        >
          {image ? <FileImage size={22} aria-hidden="true" /> : <Upload size={28} aria-hidden="true" />}
          <span className="tb-image-upload-copy">
            <span className="tb-v2-dropzone-text">{image ? fileName : 'Click to upload or drag an image here'}</span>
            <span className="tb-v2-dropzone-hint">{image ? `${formatBytes(originalSize)} · Click or drop to replace` : 'PNG, JPEG, WebP, GIF and other browser-supported images'}</span>
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
                      <button key={option} type="button" onClick={() => setFormat(option)} aria-pressed={format === option} className={`tb-v2-mode-tab ${format === option ? 'on' : ''}`}>
                        {option === 'webp' ? 'WebP' : option.toUpperCase()}
                      </button>
                    ))}
                  </div>
                  <p className="tb-image-hint">
                    {format === 'jpeg' && 'Good for photos. Adjustable quality and smaller files.'}
                    {format === 'png' && 'Lossless graphics. Quality does not affect PNG output.'}
                    {format === 'webp' && 'Compact images with adjustable quality.'}
                  </p>
                </div>
                <div className="tb-image-field">
                  <label className="tb-image-card-head" htmlFor="compress-quality"><span className="tb-v2-tool-label">Quality</span><span className="tb-v2-range-val">{quality}%</span></label>
                  <input id="compress-quality" type="range" min="1" max="100" value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="tb-image-quality" />
                  <p className="tb-image-hint">Lower quality makes smaller JPEG and WebP files.</p>
                </div>
              </div>
              <div className="tb-image-actions">
                <button type="button" onClick={compressImage} disabled={isCompressing} className="tb-v2-btn tb-v2-btn-primary">{isCompressing ? 'Compressing…' : 'Compress Image'}</button>
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
                <div className="tb-image-preview">
                  {result ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={result} alt="Compressed image" />
                  ) : <p className="tb-image-hint">Choose your settings and compress to preview the result.</p>}
                </div>
                <p className="tb-image-hint">{result ? `${originalDimensions.width} × ${originalDimensions.height} px` : 'Your compressed image will appear here.'}</p>
              </figure>
            </div>
            {result && (
              <div className="tb-v2-card tb-image-result" aria-live="polite">
                <div>
                  <strong>{resultNote ? 'Original kept · no size reduction' : compressionRatio > 0 ? `${compressionRatio}% smaller` : 'Less than 1% smaller'}</strong>
                  <p className="tb-image-hint">{formatBytes(originalSize)} original → {formatBytes(compressedSize)} {resultNote ? 'unchanged' : 'compressed'}</p>
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
