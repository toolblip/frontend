'use client';

import { useState, useRef } from 'react';

export default function Base64ImageDecoderClient() {
  const [imageData, setImageData] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [decodedUrl, setDecodedUrl] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const decode = (base64: string) => {
    try {
      const match = base64.match(/^data:([^;]+);base64,/);
      const mimeType = match?.[1] || 'image/png';
      const data = base64.replace(/^data:[^;]+;base64,/, '');
      const binary = atob(data);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: mimeType });
      const url = URL.createObjectURL(blob);
      setDecodedUrl(url);
      setError('');
    } catch {
      setError('Invalid Base64 image data');
      setDecodedUrl('');
    }
  };

  const onTextChange = (text: string) => {
    setImageData(text);
    if (text.trim()) {
      setLoading(true);
      setTimeout(() => {
        decode(text);
        setLoading(false);
      }, 100);
    } else {
      setDecodedUrl('');
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      setImageData(text);
      decode(text);
    };
    reader.onerror = () => setError('Failed to read file');
    reader.readAsText(file);
  };

  const download = () => {
    if (!decodedUrl) return;
    const a = document.createElement('a');
    a.href = decodedUrl;
    a.download = 'decoded-image';
    a.click();
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Base64 Image Data</span>
      </div>
      <textarea
        value={imageData}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder="Paste Base64 image data URL (data:image/png;base64,...)..."
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)', minHeight: '100px' }}
        aria-label="Base64 image input"
      />

      <div style={{ margin: '0.75rem 0' }}>
        <input
          ref={fileRef}
          type="file"
          accept=".txt,.b64"
          onChange={onFileChange}
          className="tb-v2-file-input"
          aria-label="Load Base64 from text file"
        />
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Preview</span>
        {decodedUrl && (
          <button type="button" onClick={download} className="tb-v2-copy-btn">
            Download
          </button>
        )}
      </div>
      <div className="tb-v2-tool-output-body" style={{ textAlign: 'center' }}>
        {loading ? (
          <p className="tb-v2-hint">Decoding...</p>
        ) : error ? (
          <p className="tb-v2-error" role="alert">{error}</p>
        ) : decodedUrl ? (
          <img
            src={decodedUrl}
            alt="Decoded Base64"
            style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '0.5rem' }}
          />
        ) : (
          <p className="tb-v2-hint">Decoded image will appear here</p>
        )}
      </div>
    </div>
  );
}
