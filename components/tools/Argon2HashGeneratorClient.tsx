'use client';

import { useState } from 'react';

export default function Argon2HashGeneratorClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const generateHash = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    // Demo placeholder - real Argon2 requires crypto library
    // This generates a fake but formatted hash for demonstration
    const fakeHash = '$argon2id$v=19$m=65536,t=3,p=4$' + btoa(input).substring(0, 32).replace(/=/g, '') + '$' + btoa(Math.random().toString()).substring(0, 22).replace(/=/g, '');

    setOutput(fakeHash);
  };

  const copy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-2">
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
          <span className="text-lg">⚠️</span>
          <span className="font-medium text-sm">Demo Only</span>
        </div>
        <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
          This tool generates placeholder hashes for demonstration purposes only.
          Do not use these hashes in production systems.
        </p>
      </div>

      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Input Text</span>
        <button type="button" onClick={() => setInput('correct horse battery staple')} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter text to hash"
        className="tb-v2-input"
      />

      <button type="button" onClick={generateHash} disabled={!input.trim()} className="tb-v2-btn tb-v2-btn-primary">
        Generate Argon2 Hash
      </button>

      {!output && (
        <p className="tb-v2-empty">
          Enter text above to see a correctly formatted Argon2id hash string with realistic parameters.
        </p>
      )}

      {output && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Argon2 Hash</span>
            <button
              type="button"
              onClick={copy}
              className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="tb-v2-tool-output-body">
            <pre className="tb-v2-tool-pre break-all">{output}</pre>
          </div>
        </>
      )}

      <div className="tb-v2-tool-output-body space-y-2 text-sm">
        <p className="font-medium text-gray-700 dark:text-gray-300">Argon2 Parameters:</p>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1 text-xs">
          <li><strong>v</strong> = Version (19)</li>
          <li><strong>m</strong> = Memory (65536 KB)</li>
          <li><strong>t</strong> = Iterations (3)</li>
          <li><strong>p</strong> = Parallelism (4)</li>
        </ul>
      </div>
    </div>
  );
}
