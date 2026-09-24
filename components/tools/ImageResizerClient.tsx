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

export function getImageResizerExportPlan(rawWidth: number, rawHeight: number) {
  const validation = validateResizeDimensions(rawWidth, rawHeight);
  if (!validation.valid) return null;
  return {
    width: validation.width,
    height: validation.height,
    filename: `resized-${validation.width}x${validation.height}.png`,
  };
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
  const loadId = useRef(0);
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { tier } = useSubscription();
  const maxSizeMB = tier === 'free' ? 5 : tier === 'starter' ? 10 : tier === 'ultra' ? 100 : tier === 'max' ? 500 : 5;

  const isOversized = file != null && file.size / (1024 * 1024) > maxSizeMB;
  const dimensionValidation = validateResizeDimensions(width, height);
  const canResize = Boolean(file && preview && dimensions.width && dimensionValidation.valid && !isOversized && !loading);
  const dimensionErrorId = 'image-resizer-dimension-error';
  const limitsHintId = 'image-resizer-limits-hint';
  const dimensionDescribedBy = dimensionValidation.valid ? limitsHintId : `${limitsHintId} ${dimensionErrorId}`;

  const loadFile = (f: File) => {
    const id = ++loadId.current;
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
    setIsDragging(false);
    setLoading(false);
    setError('');
    setDimensions({ width: 0, height: 0 });
    setFile(null);
    setPreview('');
    setWidth(800);
    setHeight(600);
    setMaintain(true);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const resize = () => {
    const plan = getImageResizerExportPlan(width, height);
    if (!plan) {
      setError(dimensionValidation.error);
      return;
    }
    if (!preview || !file || !dimensions.width || isOversized) return;
    const id = loadId.current;
    const sourceUrl = preview;
    setError('');
    const canvas = canvasRef.current;
    if (!canvas) {
      setError('Could not create the resize canvas in this browser. Try reloading the page.');
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setError('Could not start the image export in this browser. Try a different image or reload the page.');
      return;
    }
    const img = new Image();
    img.onload = () => {
      if (id !== loadId.current || sourceUrl !== preview) return;
      canvas.width = plan.width;
      canvas.height = plan.height;
      const nextCtx = canvas.getContext('2d');
      if (!nextCtx) {
        setError('Could not finish the image export in this browser. Try a different image or reload the page.');
        return;
      }
      nextCtx.drawImage(img, 0, 0, plan.width, plan.height);
      let url = '';
      try {
        url = canvas.toDataURL('image/png');
      } catch {
        setError('The resized image could not be exported. Try smaller dimensions or a replacement image.');
        return;
      }
      if (id !== loadId.current || sourceUrl !== preview) return;
      const a = document.createElement('a');
      a.href = url; a.download = plan.filename; a.click();
    };
    img.onerror = () => {
      if (id !== loadId.current) return;
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
                    const value = Number(e.target.value);
                    setWidth(value);
                    if (maintain && dimensions.width) setHeight(Math.max(1, Math.round(value * dimensions.height / dimensions.width)));
                  }} />
                </label>
                <label className="tb-image-field">
                  <span>Height (px)</span>
                  <input type="number" value={height} min={1} max={MAX_CANVAS_SIDE} step={1} className="tb-v2-input" aria-invalid={!dimensionValidation.valid} aria-describedby={dimensionDescribedBy} onChange={(e) => {
                    const value = Number(e.target.value);
                    setHeight(value);
                    if (maintain && dimensions.height) setWidth(Math.max(1, Math.round(value * dimensions.width / dimensions.height)));
                  }} />
                </label>
              </div>
              <label className="tb-v2-checkbox-row"><input type="checkbox" checked={maintain} onChange={(e) => setMaintain(e.target.checked)} />Maintain aspect ratio</label>
              <p className="tb-image-hint">Output: {width} × {height} px · PNG</p>
              <p id={limitsHintId} className="tb-image-hint">Use whole-pixel dimensions up to {MAX_CANVAS_SIDE} px per side and 40 MP total.</p>
              {!dimensionValidation.valid && <div id={dimensionErrorId} className="tb-v2-error" role="alert">{dimensionValidation.error}</div>}
              <button type="button" onClick={resize} disabled={!canResize} className="tb-v2-btn tb-v2-btn-primary">
                {isOversized ? 'File Too Large' : 'Resize & Download'}
              </button>
            </div>
          </div>
        )}
      </div>
      <canvas ref={canvasRef} hidden />
    </div>
  );
}
