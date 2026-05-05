'use client';

import { useState } from 'react';

export default function CompressMovClient() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState('medium');
  const [loading, setLoading] = useState(false);

  const handleCompress = async () => {
    if (!file) return;
    setLoading(true);
    // Tool implementation placeholder
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    alert(`Compressed ${file.name} (${quality} quality)`);
  };

  return (
    <div className="tb-v2-card">
      <div className="tb-v2-card-header">
        <h2 className="tb-v2-card-title">Compress MOV</h2>
        <p className="tb-v2-card-desc">Reduce MOV video file size while preserving quality</p>
      </div>
      <div className="tb-v2-card-body">
        <div className="tb-v2-upload-zone" onClick={() => document.getElementById('mov-input')?.click()}>
          <input id="mov-input" type="file" accept=".mov" onChange={e => setFile(e.target.files?.[0] || null)} hidden />
          <span className="tb-v2-upload-icon">📹</span>
          <span>{file ? file.name : 'Click to select MOV file'}</span>
        </div>
        <div className="tb-v2-form-group">
          <label>Quality</label>
          <select className="tb-v2-input" value={quality} onChange={e => setQuality(e.target.value)}>
            <option value="low">Low (smaller file)</option>
            <option value="medium">Medium</option>
            <option value="high">High (larger file)</option>
          </select>
        </div>
        <button className="tb-v2-btn-primary" onClick={handleCompress} disabled={!file || loading}>
          {loading ? 'Compressing...' : 'Compress MOV'}
        </button>
      </div>
    </div>
  );
}
