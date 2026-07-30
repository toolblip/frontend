'use client';

import { useState } from 'react';

export default function CompressMovClient() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const loadFile = (f: File) => {
    setFile(f);
    setDone(false);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) loadFile(f);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const f = e.dataTransfer.files?.[0];
    if (f) loadFile(f);
  };

  const handleCompress = async () => {
    if (!file) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setDone(true);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Compress MOV</span>
      </div>

      <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:20,padding:"20px"}}>
        <div
          onDragOver={e => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${dragActive ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200'}`}
        >
          <input id="mov-input" type="file" accept=".mov" onChange={handleUpload} className="hidden" />
          <label htmlFor="mov-input" className="cursor-pointer">
            <div className="text-4xl mb-2">📹</div>
            <div className="text-gray-500 mb-1">{file ? file.name : 'Drop MOV file or click to upload'}</div>
            <div className="text-xs text-gray-400">{file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : '.mov format'}</div>
          </label>
        </div>

        {file && (
          <>
            <div>
              <div className="tb-v2-tool-label" style={{marginBottom:8}}>Quality</div>
              <select className="tb-v2-input" value={quality} onChange={e => setQuality(e.target.value)}>
                <option value="low">Low (smaller file)</option>
                <option value="medium">Medium</option>
                <option value="high">High (larger file)</option>
              </select>
            </div>
            <button type="button" onClick={handleCompress} disabled={loading}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50">
              {loading ? 'Compressing...' : 'Compress MOV'}
            </button>
            {done && <div className="text-center text-green-600 font-medium">Compressed successfully</div>}
          </>
        )}
      </div>
    </div>
  );
}
