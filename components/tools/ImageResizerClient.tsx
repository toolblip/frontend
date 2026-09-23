'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, FileImage } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { FileSizeError, UpgradeNotice } from '@/components/FileSizeGuard';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

export default function ImageResizerClient() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [maintain, setMaintain] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const loadId = useRef(0);
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { tier } = useSubscription();
  const maxSizeMB = tier === 'free' ? 5 : tier === 'starter' ? 10 : tier === 'ultra' ? 100 : tier === 'max' ? 500 : 5;

  const isOversized = file != null && file.size / (1024 * 1024) > maxSizeMB;

  const loadFile = (f: File) => {
    if (f.type && !f.type.startsWith('image/')) return;
    const id = ++loadId.current;
    setDimensions({ width: 0, height: 0 });
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
    const img = new Image();
    img.onload = () => {
      if (id !== loadId.current) return;
      setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      setWidth(img.naturalWidth);
      setHeight(img.naturalHeight);
    };
    img.src = url;
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) loadFile(f);
    e.target.value = '';
  };

  const loadExample = async () => {
    const id = loadId.current;
    const response = await fetch('/samples/tool-sample.png');
    if (!response.ok) return;
    const blob = await response.blob();
    if (id !== loadId.current) return;
    loadFile(new File([blob], 'tool-sample.png', { type: blob.type || 'image/png' }));
  };

  const clear = () => {
    loadId.current++;
    setIsDragging(false);
    setDimensions({ width: 0, height: 0 });
    setFile(null);
    setPreview('');
    setWidth(800);
    setHeight(600);
    setMaintain(true);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const resize = () => {
    const canvas = canvasRef.current;
    if (!canvas || !file) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = new Image();
    img.onload = () => {
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url; a.download = `resized-${width}x${height}.png`; a.click();
    };
    img.src = preview;
  };

  return (
    <div className="tb-image-tool">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Image</span>
        <ToolExampleClearActions onExample={loadExample} onClear={clear} canClear={!!file} />
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
            <span className="tb-v2-dropzone-text">{file ? file.name : 'Click to upload or drag an image here'}</span>
            <span className="tb-v2-dropzone-hint">{file ? `${(file.size / 1024).toFixed(1)} KB · Click or drop to replace` : 'PNG, JPEG, WebP, GIF and other browser-supported images'}</span>
          </span>
        </button>
        <div><UpgradeNotice tier={tier} /><FileSizeError file={file} maxSizeMB={maxSizeMB} /></div>
        {preview && (
          <div className="tb-image-workspace">
            <figure className="tb-v2-card tb-image-preview-card">
              <figcaption className="tb-image-card-head"><span className="tb-v2-tool-label">Source preview</span><span className="tb-image-hint">{dimensions.width} × {dimensions.height} px</span></figcaption>
              <div className="tb-image-preview">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="Source image to resize" />
              </div>
              <a href={preview} download={file?.name} className="tb-v2-btn">Download Original</a>
            </figure>
            <div className="tb-v2-card tb-image-settings">
              <span className="tb-v2-tool-label">Resize dimensions</span>
              <div className="tb-image-fields">
                <label className="tb-image-field">
                  <span>Width (px)</span>
                  <input type="number" value={width} min={1} className="tb-v2-input" onChange={(e) => {
                    const value = Number(e.target.value);
                    setWidth(value);
                    if (maintain && dimensions.width) setHeight(Math.max(1, Math.round(value * dimensions.height / dimensions.width)));
                  }} />
                </label>
                <label className="tb-image-field">
                  <span>Height (px)</span>
                  <input type="number" value={height} min={1} className="tb-v2-input" onChange={(e) => {
                    const value = Number(e.target.value);
                    setHeight(value);
                    if (maintain && dimensions.height) setWidth(Math.max(1, Math.round(value * dimensions.width / dimensions.height)));
                  }} />
                </label>
              </div>
              <label className="tb-v2-checkbox-row"><input type="checkbox" checked={maintain} onChange={(e) => setMaintain(e.target.checked)} />Maintain aspect ratio</label>
              <p className="tb-image-hint">Output: {width} × {height} px · PNG</p>
              <button type="button" onClick={resize} disabled={isOversized || width < 1 || height < 1 || !dimensions.width} className="tb-v2-btn tb-v2-btn-primary">
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
