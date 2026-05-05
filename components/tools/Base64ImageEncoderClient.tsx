'use client';

import { useState } from 'react';

export default function Base64ImageEncoderClient() {
  const [dataUrl, setDataUrl] = useState('');
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');

  const encode = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Please select an image file'); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setDataUrl(result);
      setPreview(result);
    };
    reader.onerror = () => setError('Failed to read file');
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Image File</span></div>
      <input type="file" accept="image/*" onChange={encode} className="tb-v2-tool-textarea" style={{ padding: '8px 12px', minHeight: 40 }} />
      {error && <span style={{ color: '#ef4444', fontSize: 13 }}>{error}</span>}
      {preview && <img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: 200, marginTop: 12, borderRadius: 8 }} />}
      <div className="tb-v2-tool-output-head"><span className="tb-v2-tool-label">Base64 Data URL</span></div>
      <div className="tb-v2-tool-output-body">
        <textarea
          value={dataUrl}
          readOnly
          className="tb-v2-tool-textarea"
          style={{ fontFamily: 'var(--f-mono)', fontSize: 12, minHeight: 100 }}
          placeholder="Base64 output will appear here..."
        />
      </div>
    </div>
  );
}
