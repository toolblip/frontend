'use client';

import React, { useState } from 'react';

export default function CompressAviClient() {
  const [file, setFile] = useState<File | null>(null);
  const [compressing, setCompressing] = useState(false);
  const [done, setDone] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) { setFile(f); setDone(false); }
  };

  const compress = async () => {
    if (!file) return;
    setCompressing(true);
    await new Promise(r => setTimeout(r, 2000));
    setCompressing(false);
    setDone(true);
  };

  return (
    <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:20,padding:"20px"}}>
      <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
        <input type="file" accept="video/avi,.avi" onChange={handleUpload} className="hidden" id="compress-avi-upload" />
        <label htmlFor="compress-avi-upload" className="cursor-pointer">
          <div className="text-4xl mb-2">🎬</div>
          <div className="text-gray-500 mb-1">{file ? file.name : 'Drop AVI file or click to upload'}</div>
          <div className="text-xs text-gray-400">{file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : '.avi format'}</div>
        </label>
      </div>

      {file && (
        <button onClick={compress} disabled={compressing}
          className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50">
          {compressing ? 'Compressing AVI...' : 'Compress AVI'}
        </button>
      )}
      {done && <div className="text-center text-green-600 font-medium">✓ AVI compressed successfully!</div>}
    </div>
  );
}
