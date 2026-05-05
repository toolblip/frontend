'use client';

import { useState, useRef } from 'react';

export default function Base64ImageViewerClient() {
  const [imageData, setImageData] = useState('');
  const [error, setError] = useState('');
  const [valid, setValid] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const validate = (base64: string) => {
    try {
      const match = base64.match(/^data:([^;]+);base64,/);
      if (!match) {
        setError('Invalid data URL format. Expected: data:image/...;base64,...');
        setValid(false);
        return;
      }
      const mimeType = match[1];
      if (!mimeType.startsWith('image/')) {
        setError('Data URL is not an image type');
        setValid(false);
        return;
      }
      setError('');
      setValid(true);
    } catch {
      setError('Invalid Base64 string');
      setValid(false);
    }
  };

  const onTextChange = (text: string) => {
    setImageData(text);
    if (text.trim()) {
      validate(text);
    } else {
      setError('');
      setValid(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      setImageData(text);
      validate(text);
    };
    reader.onerror = () => setError('Failed to read file');
    reader.readAsText(file);
  };

  const copyDataUrl = () => {
    navigator.clipboard.writeText(imageData).catch(() => {});
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Base64 Image Data URL</span>
      </div>
      <textarea
        value={imageData}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder="data:image/png;base64,iVBORw0KGgo..."
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)', minHeight: '100px' }}
        aria-label="Base64 image data URL"
      />

      <div style={{ margin: '0.75rem 0' }}>
        <input
          ref={fileRef}
          type="file"
          accept=".txt,.b64"
          onChange={onFileChange}
          className="tb-v2-file-input"
          aria-label="Load from text file"
        />
        <p className="tb-v2-hint" style={{ marginTop: '0.5rem' }}>
          Load Base64 from a .txt or .b64 file
        </p>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Image Display</span>
        {valid && (
          <button type="button" onClick={copyDataUrl} className="tb-v2-copy-btn">
            Copy Data URL
          </button>
        )}
      </div>
      <div className="tb-v2-tool-output-body" style={{ textAlign: 'center' }}>
        {error ? (
          <p className="tb-v2-error" role="alert">{error}</p>
        ) : valid && imageData ? (
          <img
            src={imageData}
            alt="Base64"
            style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '0.5rem' }}
          />
        ) : (
          <p className="tb-v2-hint">Enter a Base64 data URL above to display the image</p>
        )}
      </div>
    </div>
  );
}
