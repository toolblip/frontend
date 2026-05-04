'use client';

import { useState, useRef } from 'react';

interface Metadata {
  name?: string;
  size?: number;
  type?: string;
  width?: number;
  height?: number;
  lastModified?: string;
}

export default function ImageMetadataViewerClient() {
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setError('');
    const meta: Metadata = {
      name: file.name,
      size: file.size,
      type: file.type || 'unknown',
      lastModified: new Date(file.lastModified).toLocaleString()
    };

    if (file.type.startsWith('image/')) {
      const img = new Image();
      img.onload = () => {
        setMetadata({ ...meta, width: img.width, height: img.height });
      };
      img.onerror = () => {
        setError('Could not load image dimensions');
        setMetadata(meta);
      };
      img.src = URL.createObjectURL(file);
    } else {
      setError('Please select an image file');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Upload Image</span>
      </div>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        style={{
          marginTop: 8,
          padding: 24,
          border: '2px dashed var(--tb-border)',
          borderRadius: 8,
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'border-color 0.2s'
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
        <div style={{ color: 'var(--tb-text-secondary)' }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>📷</div>
          <div>Drop an image here or click to upload</div>
        </div>
      </div>

      {error && <div style={{ color: '#ef4444', marginTop: 12, fontSize: 14 }}>{error}</div>}

      {metadata && (
        <>
          <div className="tb-v2-tool-output-head" style={{ marginTop: 16 }}>
            <span className="tb-v2-tool-label">Metadata</span>
          </div>
          <div className="tb-v2-tool-output-body" style={{ marginTop: 8 }}>
            <div style={{ display: 'grid', gap: 8 }}>
              {metadata.name && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--tb-border)' }}>
                  <span style={{ color: 'var(--tb-text-secondary)' }}>Filename</span>
                  <span style={{ fontWeight: 500, wordBreak: 'break-all' }}>{metadata.name}</span>
                </div>
              )}
              {metadata.type && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--tb-border)' }}>
                  <span style={{ color: 'var(--tb-text-secondary)' }}>Type</span>
                  <span style={{ fontWeight: 500 }}>{metadata.type}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--tb-border)' }}>
                <span style={{ color: 'var(--tb-text-secondary)' }}>Size</span>
                <span style={{ fontWeight: 500 }}>{formatSize(metadata.size)}</span>
              </div>
              {metadata.width && metadata.height && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--tb-border)' }}>
                  <span style={{ color: 'var(--tb-text-secondary)' }}>Dimensions</span>
                  <span style={{ fontWeight: 500 }}>{metadata.width} × {metadata.height} px</span>
                </div>
              )}
              {metadata.lastModified && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                  <span style={{ color: 'var(--tb-text-secondary)' }}>Last Modified</span>
                  <span style={{ fontWeight: 500 }}>{metadata.lastModified}</span>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
