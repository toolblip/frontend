'use client';

import { useState, useRef } from 'react';

export default function ExtractTextClient() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgElRef = useRef<HTMLImageElement>(null);

  const loadFile = (file: File | undefined) => {
    if (!file) return;
    setError('');
    setCopyError('');
    setCopied(false);
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }
    setFileName(file.name);
    setImageUrl(URL.createObjectURL(file));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => loadFile(e.target.files?.[0]);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    loadFile(e.dataTransfer.files?.[0]);
  };

  const copyImage = async () => {
    setCopyError('');
    const img = imgElRef.current;
    if (!img || typeof ClipboardItem === 'undefined') {
      setCopyError('This browser does not support copying images to the clipboard.');
      return;
    }
    try {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas not supported in this browser.');
      ctx.drawImage(img, 0, 0);
      const blob: Blob | null = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('Could not prepare the image for copying.');
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      setCopyError(e instanceof Error ? e.message : 'Could not copy this image to the clipboard.');
    }
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-banner" style={{ margin: 20 }}>
        Real OCR (recognizing text inside a photo) needs a trained machine learning model, which isn't available in
        this browser tool. Instead, you can preview your image here and copy it to your clipboard to paste into a
        real OCR service, such as Google Lens, Google Docs (upload to Drive, then &quot;Open with Google Docs&quot;),
        Apple Live Text (Preview or Quick Look on a Mac), Windows PowerToys Text Extractor, or desktop Tesseract OCR.
      </div>

      <div style={{ padding: '0 20px 20px' }}>
        <div
          className={`tb-v2-dropzone ${isDragging ? 'dragging' : ''}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <span style={{ fontSize: 28 }}>🖼️</span>
          <span className="tb-v2-dropzone-text">Click or drag an image here</span>
          <span className="tb-v2-dropzone-hint">Processed entirely in your browser</span>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
        </div>
      </div>

      {error && <div className="tb-v2-banner-err" style={{ margin: '0 20px 20px' }}>{error}</div>}

      {imageUrl && (
        <div style={{ padding: '0 20px 20px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgElRef}
            src={imageUrl}
            alt={fileName}
            style={{ maxWidth: '100%', maxHeight: 400, border: '1px solid var(--line)', borderRadius: 4, marginBottom: 12, display: 'block' }}
          />
          <button type="button" onClick={copyImage} className="tb-v2-btn tb-v2-btn-primary">
            {copied ? 'Copied' : 'Copy Image to Clipboard'}
          </button>
          {copyError && <div className="tb-v2-banner-err" style={{ marginTop: 12 }}>{copyError}</div>}
        </div>
      )}

      {!imageUrl && !error && <p className="tb-v2-empty" style={{ margin: '0 20px 20px' }}>Upload an image to preview it and copy it for use with a real OCR tool.</p>}
    </div>
  );
}
