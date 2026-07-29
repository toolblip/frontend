'use client';

import { useState } from 'react';

export default function HtmlEncoderClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);

  const convert = () => {
    try {
      if (mode === 'encode') {
        setOutput(input.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!)));
      } else {
        const ta = document.createElement('textarea');
        ta.innerHTML = input;
        setOutput(ta.value);
      }
    } catch { setOutput('Error processing input'); }
  };

  const copy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  return (
    <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:16,padding:"16px 20px"}}>
      <div className="tb-v2-mode-tabs">
        {(['encode', 'decode'] as const).map(m => (
          <button key={m} onClick={() => setMode(m)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === m ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>
      <textarea value={input} onChange={e => setInput(e.target.value)} placeholder={mode === 'encode' ? 'Enter HTML to encode...' : 'Enter encoded HTML to decode...'} rows={6} className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 text-sm font-mono focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-y" />
      <button onClick={convert} className="w-full bg-red-600 hover:bg-red-500 text-white font-medium py-2.5 rounded-lg transition-colors text-sm">
        {mode === 'encode' ? 'Encode' : 'Decode'}
      </button>
      {output && (
        <div className="relative">
          <pre className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-3 text-sm font-mono whitespace-pre-wrap break-all">{output}</pre>
          <button onClick={copy} className="absolute top-2 right-2 px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md transition-colors">
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
    </div>
  );
}
