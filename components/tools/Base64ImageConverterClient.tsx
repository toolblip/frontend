'use client';

import { useState, useEffect } from 'react';

export default function Base64ImageConverterClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
      // Check if it's a valid base64 data URL
      const match = base64.match(/^data:([^;]+);base64,/);
      if (!match) {
        // Try to decode as plain base64
        const binary = atob(base64.trim());
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: 'image/png' });
        const url = URL.createObjectURL(blob);
        setPreview(url);
        setOutput(base64);
        setError('');
      } else {
        const mimeType = match[1];
        const data = base64.replace(/^data:[^;]+;base64,/, '');
        const binary = atob(data);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: mimeType });
        const url = URL.createObjectURL(blob);
        setPreview(url);
        setOutput(base64);
        setError('');
      }
    } catch (e) {
      setError('Invalid Base64 image data. Please provide valid base64 encoded image data.');
      setPreview(null);
      setOutput('');
    }
  };

  const handleProcess = () => {
    setError('');
    setPreview(null);
    
    if (!input.trim()) {
      setOutput('');
      return;
    }

    if (mode === 'encode') {
      // For plain base64 input, just echo it
      setOutput(input.trim());
    } else {
      decodeImage(input);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (mode === 'encode') {
        encodeImage(file);
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          handleInputChange(reader.result as string);
        };
        reader.readAsText(file);
      }
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    if (mode === 'decode' && value.trim()) {
      decodeImage(value);
    } else if (mode === 'encode') {
      setPreview(null);
    }
  };

  const copyToClipboard = () => {
    if (output) {
      navigator.clipboard.writeText(output);
    }
  };

  return (
    <div className="tb-v2-tool-card">
      {isMounted && (
      <>
      <h1 className="text-2xl font-bold">Base64 Image Converter</h1>
      
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => { setMode('encode'); setInput(''); setOutput(''); setPreview(null); setError(''); }}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${mode === 'encode' ? 'bg-indigo-500 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
        >
          Encode Image to Base64
        </button>
        <button
          onClick={() => { setMode('decode'); setInput(''); setOutput(''); setPreview(null); setError(''); }}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${mode === 'decode' ? 'bg-indigo-500 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
        >
          Decode Base64 to Image
        </button>
      </div>

      {mode === 'encode' ? (
        <div>
          <label className="tb-v2-tool-label" style={{marginBottom:8}}>Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800"
          />
        </div>
      ) : (
        <div>
          <label className="tb-v2-tool-label" style={{marginBottom:8}}>Paste Base64 Data</label>
          <textarea
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            className="tb-v2-input"
            placeholder="Paste base64 data here (data:image/...;base64,...) or load from file..."
          />
          <div className="mt-2">
            <input
              type="file"
              accept=".txt,.b64"
              onChange={handleFileChange}
              className="text-sm"
            />
          </div>
        </div>
      )}

      <button
        onClick={handleProcess}
        className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
      >
        Convert
      </button>

      {error && (
        <div className="tb-v2-banner tb-v2-banner-err">
          {error}
        </div>
      )}

      {preview && (
        <div className="space-y-2">
          <label className="block text-sm font-medium">Preview</label>
          <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
            <img src={preview} alt="Preview" className="max-w-full max-h-64 mx-auto rounded" />
          </div>
        </div>
      )}

      {output && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Output ({output.length} chars)</span>
            <button onClick={copyToClipboard} className="text-indigo-500 hover:text-indigo-600">Copy</button>
          </div>
          <textarea
            value={output}
            readOnly
            className="tb-v2-input"
          />
        </div>
      )}
      </>
      )}
    </div>
  );
}
