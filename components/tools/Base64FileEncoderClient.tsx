'use client';

import { useState, useRef } from 'react';

export default function Base64FileEncoderClient() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const [copied, setCopied] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleEncode = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      setOutput(base64);
      setFileName(file.name);
      setError('');
      setDownloadUrl('');
    };
    reader.onerror = () => {
      setError('Failed to read file');
      setOutput('');
    };
    reader.readAsDataURL(file);
  };

  const handleDecode = (base64: string) => {
    try {
      const mimeType = base64.match(/^data:([^;]+);base64,/)?.[1] || 'application/octet-stream';
      const data = base64.replace(/^data:[^;]+;base64,/, '');
      const binary = atob(data);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: mimeType });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setOutput(`Decoded: ${(blob.size / 1024).toFixed(1)} KB - ${mimeType}`);
      setFileName('decoded-file');
      setError('');
    } catch {
      setError('Invalid Base64 string');
      setOutput('');
      setDownloadUrl('');
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (mode === 'encode') {
      handleEncode(file);
    } else {
      const reader = new FileReader();
      reader.onload = () => handleDecode(reader.result as string);
      reader.readAsText(file);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && mode === 'encode') handleEncode(file);
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">{mode === 'encode' ? 'File' : 'Base64'}</span>
        <div className="tb-v2-mode-tabs" role="tablist">
          {(['encode', 'decode'] as const).map((m) => (
            <button
              key={m}
              role="tab"
              aria-selected={mode === m}
              onClick={() => { setMode(m); setOutput(''); setError(''); setDownloadUrl(''); }}
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
          <div className="text-4xl mb-2">📁</div>
          <p className="text-gray-600 dark:text-gray-400">
            {isDragging ? 'Drop file here' : 'Click or drag file to encode'}
          </p>
          <p className="text-xs text-gray-500 mt-1">Any file type supported</p>
        </div>
      ) : (
        <textarea
          value={output}
          onChange={(e) => {
            setOutput(e.target.value);
            if (mode === 'decode') handleDecode(e.target.value);
          }}
          placeholder="Paste Base64 string or load from file..."
          className="tb-v2-tool-textarea"
          style={{ fontFamily: 'var(--f-mono)', minHeight: 120 }}
          rows={6}
        />
      )}

      <input
        ref={fileRef}
        type="file"
        onChange={onFileChange}
        className="hidden"
      />

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {output && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">{mode === 'encode' ? 'Base64 Output' : 'Decoded File'}</span>
            <div className="flex gap-2">
              {downloadUrl && (
                <a href={downloadUrl} download={fileName} className="tb-v2-btn tb-v2-btn-ghost tb-v2-btn-sm">
                  ⬇️ Download
                </a>
              )}
              <button onClick={copy} className="tb-v2-copy-btn">
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
          <div className="tb-v2-tool-output-body">
            <pre className="tb-v2-tool-pre text-sm break-all" style={{ maxHeight: 300, overflowY: 'auto' }}>
              {output}
            </pre>
          </div>
          {fileName && (
            <p className="text-xs text-gray-500 text-center">
              {fileName} {output.length > 100 && `(${(output.length / 1024).toFixed(1)} KB)`}
            </p>
          )}
        </>
      )}

      {!output && !error && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-2">{mode === 'encode' ? '📁' : '📄'}</div>
          <p>{mode === 'encode' ? 'Upload a file to encode to Base64' : 'Paste Base64 string to decode'}</p>
        </div>
      )}
    </div>
  );
}
