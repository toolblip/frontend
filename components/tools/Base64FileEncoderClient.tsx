'use client';

import { useState, useRef } from 'react';

export default function Base64FileEncoderClient() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const [copied, setCopied] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
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

  const onTextChange = (text: string) => {
    if (mode === 'decode') {
      handleDecode(text);
    } else {
      setOutput('');
      setError('');
      setDownloadUrl('');
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(output).catch(() => {});
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
        <>
          <input
            ref={fileRef}
            type="file"
            onChange={onFileChange}
            className="tb-v2-file-input"
            aria-label="Select file to encode"
          />
          <p className="tb-v2-hint" style={{ marginTop: '0.5rem' }}>
            Select a file to encode to Base64
          </p>
        </>
      ) : (
        <>
          <textarea
            value={output}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder="Paste Base64 string or load from file..."
            className="tb-v2-tool-textarea"
            style={{ fontFamily: 'var(--f-mono)' }}
            aria-label="Base64 input"
          />
          <div style={{ marginTop: '0.5rem' }}>
            <input
              ref={fileRef}
              type="file"
              onChange={onFileChange}
              className="tb-v2-file-input"
              aria-label="Load Base64 from file"
            />
          </div>
        </>
      )}

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">{mode === 'encode' ? 'Base64 Output' : 'Decoded File'}</span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {downloadUrl && (
            <a href={downloadUrl} download={fileName} className="tb-v2-copy-btn" style={{ textDecoration: 'none' }}>
              Download
            </a>
          )}
          <button type="button" onClick={copy} disabled={!output} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
      <div className="tb-v2-tool-output-body">
        {error ? (
          <p className="tb-v2-error" role="alert">{error}</p>
        ) : (
          <pre className="tb-v2-tool-pre" style={{ wordBreak: 'break-all', maxHeight: '300px', overflowY: 'auto' }}>
            {output || '—'}
          </pre>
        )}
      </div>
    </div>
  );
}
