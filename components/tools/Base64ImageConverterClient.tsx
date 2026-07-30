'use client';

import { useState, useRef } from 'react';

export default function Base64ImageConverterClient() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const encodeImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setOutput(result);
      setPreview(result);
      setError('');
    };
    reader.onerror = () => {
      setError('Failed to read file');
      setOutput('');
      setPreview(null);
    };
    reader.readAsDataURL(file);
  };

  const decodeImage = (base64: string) => {
    try {
      const match = base64.match(/^data:([^;]+);base64,/);
      if (!match) {
        const binary = atob(base64.trim());
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        const blob = new Blob([bytes], { type: 'image/png' });
        setPreview(URL.createObjectURL(blob));
        setOutput(base64);
      } else {
        const mimeType = match[1];
        const data = base64.replace(/^data:[^;]+;base64,/, '');
        const binary = atob(data);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        const blob = new Blob([bytes], { type: mimeType });
        setPreview(URL.createObjectURL(blob));
        setOutput(base64);
      }
      setError('');
    } catch {
      setError('Invalid Base64 image data');
      setPreview(null);
      setOutput('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (mode === 'encode') {
      encodeImage(file);
    } else {
      const reader = new FileReader();
      reader.onload = () => decodeImage(reader.result as string);
      reader.readAsText(file);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/') && mode === 'encode') {
      encodeImage(file);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">{mode === 'encode' ? 'Image' : 'Base64'}</span>
        <div className="tb-v2-mode-tabs" role="tablist">
          {(['encode', 'decode'] as const).map((m) => (
            <button
              key={m}
              role="tab"
              aria-selected={mode === m}
              onClick={() => { setMode(m); setInput(''); setOutput(''); setPreview(null); setError(''); }}
              className={`tb-v2-mode-tab ${mode === m ? 'on' : ''}`}
            >
              {m === 'encode' ? 'Encode' : 'Decode'}
            </button>
          ))}
        </div>
      </div>

      {mode === 'encode' ? (
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
            {isDragging ? 'Drop image here' : 'Click or drag image to encode'}
          </p>
          <p className="text-xs text-gray-500 mt-1">JPG, PNG, GIF, WebP</p>
        </div>
      ) : (
        <textarea
          value={input}
          onChange={(e) => { setInput(e.target.value); if (mode === 'decode' && e.target.value.trim()) decodeImage(e.target.value); }}
          placeholder="Paste Base64 image data (data:image/...;base64,...)"
          className="tb-v2-tool-textarea"
          style={{ fontFamily: 'var(--f-mono)', minHeight: 100 }}
          rows={4}
        />
      )}

      <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {preview && (
        <div>
          <label className="tb-v2-tool-label">Preview</label>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <img src={preview} alt="Preview" className="max-w-full max-h-64 mx-auto rounded-lg" />
          </div>
        </div>
      )}

      {output && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Output ({(output.length / 1024).toFixed(1)} KB)</span>
            <button onClick={copy} className="tb-v2-copy-btn">
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="tb-v2-tool-output-body">
            <pre className="tb-v2-tool-pre text-xs break-all" style={{ maxHeight: 200, overflowY: 'auto' }}>
              {output.slice(0, 500)}{output.length > 500 ? '...' : ''}
            </pre>
          </div>
        </>
      )}

      {!preview && !output && !error && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-2">{mode === 'encode' ? '🖼️' : '📄'}</div>
          <p>{mode === 'encode' ? 'Upload an image to encode to Base64' : 'Paste Base64 data to decode to image'}</p>
        </div>
      )}
    </div>
  );
}
