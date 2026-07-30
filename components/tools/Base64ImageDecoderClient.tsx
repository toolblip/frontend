'use client';

import { useState, useRef } from 'react';

export default function Base64ImageDecoderClient() {
  const [imageData, setImageData] = useState('');
  const [error, setError] = useState('');
  const [decodedUrl, setDecodedUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const decode = (base64: string) => {
    try {
      const match = base64.match(/^data:([^;]+);base64,/);
      const mimeType = match?.[1] || 'image/png';
      const data = base64.replace(/^data:[^;]+;base64,/, '');
      const binary = atob(data);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const blob = new Blob([bytes], { type: mimeType });
      setDecodedUrl(URL.createObjectURL(blob));
      setError('');
    } catch {
      setError('Invalid Base64 image data');
      setDecodedUrl('');
    }
  };

  const onTextChange = (text: string) => {
    setImageData(text);
    if (text.trim()) {
      setTimeout(() => decode(text), 100);
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
    a.download = 'decoded-image.png';
    a.click();
  };

  const copy = () => {
    navigator.clipboard.writeText(imageData);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Base64 Data</span>
        <button onClick={copy} className="tb-v2-copy-btn" disabled={!imageData}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <textarea
        value={imageData}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder="Paste Base64 image data (data:image/png;base64,...)"
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)', minHeight: 100 }}
        rows={4}
      />

      <div className="flex gap-2">
        <input ref={fileRef} type="file" accept=".txt,.b64" onChange={onFileChange} className="hidden" />
        <button onClick={() => fileRef.current?.click()} className="tb-v2-btn tb-v2-btn-ghost tb-v2-btn-sm">
          📁 Load from file
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {decodedUrl && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Decoded Image</span>
            <button onClick={download} className="tb-v2-btn tb-v2-btn-ghost tb-v2-btn-sm">
              ⬇️ Download
            </button>
          </div>
          <div className="flex justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <img src={decodedUrl} alt="Decoded" className="max-w-full max-h-96 rounded-lg" />
          </div>
        </>
      )}

      {!decodedUrl && !error && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-2">🖼️</div>
          <p>Paste Base64 data above to decode to image</p>
        </div>
      )}
    </div>
  );
}
