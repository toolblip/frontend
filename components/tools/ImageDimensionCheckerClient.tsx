'use client';

import { useState, useRef } from 'react';

export default function ImageDimensionCheckerClient() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [result, setResult] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = ev => setPreview(ev.target?.result as string);
    reader.readAsDataURL(f);
    setResult('');
  };

  const process = () => {
    if (!file || !preview) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      setResult(canvas.toDataURL('image/png'));
    };
    img.src = preview;
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Image Dimension Checker</h1>
      <label className="block w-full p-8 border-2 border-dashed rounded-xl cursor-pointer text-center hover:border-indigo-400 transition-colors">
        <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
        <span className="text-gray-500">{file ? file.name : 'Click to upload an image'}</span>
      </label>
      {preview && <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />}
      <canvas ref={canvasRef} className="hidden" />
      <button
        onClick={process}
        disabled={!file}
        className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50"
      >
        Process
      </button>
      {result && (
        <div className="space-y-2">
          <img src={result} alt="Result" className="max-w-full rounded-lg" />
          <a href={result} download="result.png" className="text-sm text-indigo-500 hover:text-indigo-600">Download Result</a>
        </div>
      )}
    </div>
  );
}