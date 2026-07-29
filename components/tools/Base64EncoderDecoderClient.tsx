'use client';

import { useState, useCallback } from 'react';

function base64Encode(str: string): string {
  return btoa(unescape(encodeURIComponent(str)));
}

function base64Decode(str: string): string {
  try {
    return decodeURIComponent(escape(atob(str)));
  } catch {
    throw new Error('Invalid Base64 string');
  }
}

export default function Base64EncoderDecoderClient() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const process = useCallback(() => {
    setError('');
    setOutput('');
    if (!input.trim()) return;
    try {
      setOutput(mode === 'encode' ? base64Encode(input) : base64Decode(input));
    } catch (e) {
      setError(mode === 'encode' ? 'Failed to encode.' : 'Invalid Base64 string  -  cannot decode.');
      setOutput('');
    }
  }, [input, mode]);

  const copy = useCallback((text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
  }, []);

  const swap = useCallback(() => {
    setInput(output);
    setOutput('');
    setError('');
    setMode(mode === 'encode' ? 'decode' : 'encode');
  }, [output, mode]);

  return (
    <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:20,padding:"20px"}}>
      {/* Mode tabs */}
      <div className="tb-v2-mode-tabs">
        {(['encode', 'decode'] as const).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setOutput(''); setError(''); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === m ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          >
            {m === 'encode' ? 'Encode' : 'Decode'}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="tb-v2-tool-label">
            {mode === 'encode' ? 'Text to Encode' : 'Base64 String to Decode'}
          </label>
          {output && (
            <button
              onClick={swap}
              className="tb-v2-btn tb-v2-btn-ghost tb-v2-btn-sm" style={{color:"var(--red)",fontSize:12}}
            >
              Use output as input ↕
            </button>
          )}
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'encode' ? 'Enter text to Base64 encode...' : 'Enter Base64 string to decode...'}
          className="tb-v2-tool-textarea"
        />
      </div>

      <button
        onClick={process}
        className="tb-v2-btn tb-v2-btn-primary tb-v2-btn-lg"
      >
        {mode === 'encode' ? 'Encode → Base64' : 'Decode ← Base64'}
      </button>

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Output */}
      {output && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="tb-v2-tool-label">Output</label>
            <button
              onClick={() => copy(output)}
              className="tb-v2-btn tb-v2-btn-ghost tb-v2-btn-sm" style={{color:"var(--red)",fontSize:12}}
            >
              Copy
            </button>
          </div>
          <div className="tb-v2-tool-pre">
            {output}
          </div>
        </div>
      )}
    </div>
  );
}
