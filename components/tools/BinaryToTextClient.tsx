'use client';

import { useState, useCallback } from 'react';

function binaryToText(binary: string): string {
  const cleaned = binary.replace(/\s+/g, '');
  if (!/^[01]+$/.test(cleaned)) return '';
  const bytes = cleaned.match(/.{1,8}/g) || [];
  return bytes.map(b => String.fromCharCode(parseInt(b, 2))).join('');
}

function textToBinary(text: string): string {
  return text.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
}

export default function BinaryToTextClient() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'toText' | 'toBinary'>('toText');
  const [output, setOutput] = useState('');

  const process = useCallback(() => {
    if (!input.trim()) { setOutput(''); return; }
    setOutput(mode === 'toText' ? binaryToText(input) : textToBinary(input));
  }, [input, mode]);

  const copy = useCallback((text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
  }, []);

  const swap = useCallback(() => {
    setInput(output);
    setOutput('');
    setMode(mode === 'toText' ? 'toBinary' : 'toText');
  }, [output, mode]);

  return (
    <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:20,padding:"20px"}}>
      <div className="tb-v2-mode-tabs">
        {(['toText', 'toBinary'] as const).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setOutput(''); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === m ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          >
            {m === 'toText' ? 'Binary → Text' : 'Text → Binary'}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <label className="tb-v2-tool-label">
          {mode === 'toText' ? 'Binary Input' : 'Text Input'}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'toText' ? 'Enter binary (e.g., 01001000 01100101)...' : 'Enter text to convert...'}
          className="tb-v2-tool-textarea"
        />
      </div>

      <button
        onClick={process}
        className="tb-v2-btn tb-v2-btn-primary tb-v2-btn-lg"
      >
        Convert
      </button>

      {output && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="tb-v2-tool-label">Output</label>
            <div className="tb-v2-mode-tabs">
              <button onClick={swap} className="tb-v2-btn tb-v2-btn-ghost tb-v2-btn-sm" style={{color:"var(--red)",fontSize:12}}>
                Swap ↕
              </button>
              <button onClick={() => copy(output)} className="tb-v2-btn tb-v2-btn-ghost tb-v2-btn-sm" style={{color:"var(--red)",fontSize:12}}>
                Copy
              </button>
            </div>
          </div>
          <div className="tb-v2-tool-pre">
            {output}
          </div>
        </div>
      )}
    </div>
  );
}
