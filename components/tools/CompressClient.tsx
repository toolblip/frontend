'use client';

import React, { useState } from 'react';

export default function CompressClient() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(80);
  const [compressing, setCompressing] = useState(false);
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

  const compress = async () => {
    if (!file) return;
    setCompressing(true);
    await new Promise(r => setTimeout(r, 1500));
    setCompressing(false);
    setDone(true);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Compress File</span>
      </div>

      <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:20,padding:"20px"}}>
        <div
          onDragOver={e => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${dragActive ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200'}`}
        >
          <input type="file" onChange={handleUpload} className="hidden" id="compress-upload" />
          <label htmlFor="compress-upload" className="cursor-pointer">
            <div className="text-4xl mb-2">📁</div>
            <div className="text-gray-500 mb-1">{file ? file.name : 'Drop file or click to upload'}</div>
            <div className="text-xs text-gray-400">{file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Any file type'}</div>
          </label>
        </div>

        {file && (
          <>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Quality</span><span>{quality}%</span>
              </div>
              <input type="range" min="10" max="100" value={quality} onChange={e => setQuality(Number(e.target.value))} className="w-full" />
            </div>
            <button type="button" onClick={compress} disabled={compressing}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50">
              {compressing ? 'Compressing...' : 'Compress File'}
            </button>
            {done && <div className="text-center text-green-600 font-medium">Compressed successfully</div>}
          </>
        )}
      </div>
    </div>
  );
}
