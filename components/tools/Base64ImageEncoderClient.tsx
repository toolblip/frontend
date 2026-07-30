'use client';

import { useState, useRef } from 'react';

export default function Base64ImageEncoderClient() {
  const [dataUrl, setDataUrl] = useState('');
  const [preview, setPreview] = useState('');
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const encodeFile = (file: File) => {
    setError('');
    if (!file.type.startsWith('image/')) { setError('Please select an image file'); return; }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setDataUrl(result);
      setPreview(result);
    };
    reader.onerror = () => setError('Failed to read file');
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) encodeFile(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) encodeFile(file);
  };

  const copy = () => {
    if (!dataUrl) return;
    navigator.clipboard.writeText(dataUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-label mb-2">Image File</div>
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => fileRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          isDragging
            ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500'
        }`}
      >
        <div className="text-4xl mb-2">🖼️</div>
        <p className="text-gray-600 dark:text-gray-400">
          {isDragging ? 'Drop image here' : 'Click or drag an image to encode'}
        </p>
      </div>
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

      {error && <span style={{ color: '#ef4444', fontSize: 13 }}>{error}</span>}

      {preview && (
        <div className="flex items-center gap-3">
          <img src={preview} alt="Preview" style={{ maxWidth: 120, maxHeight: 120, borderRadius: 8 }} />
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p className="font-medium text-gray-700 dark:text-gray-300">{fileName}</p>
            <p>{dataUrl.length.toLocaleString()} characters encoded</p>
          </div>
        </div>
      )}

      {!dataUrl && (
        <p className="tb-v2-empty">
          Upload an image above to get its Base64 data URL, ready to paste into CSS or HTML.
        </p>
      )}

      {dataUrl && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Base64 Data URL</span>
            <button type="button" onClick={copy} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="tb-v2-tool-output-body">
            <textarea
              value={dataUrl}
              readOnly
              className="tb-v2-tool-textarea"
              style={{ fontFamily: 'var(--f-mono)', fontSize: 12, minHeight: 100 }}
            />
          </div>
        </>
      )}
    </div>
  );
}
