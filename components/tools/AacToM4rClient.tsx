'use client';

import { useState } from 'react';

export default function AacToM4rClient() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'done'>('idle');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setStatus('idle');
    }
  };

  const convert = () => {
    if (!file) return;
    setStatus('done');
    
    // M4R is just AAC in an M4A container - just rename
    const blob = new Blob([file], { type: 'audio/mp4' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name.replace(/\.[^.]+$/, '') + '.m4r';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="tb-v2-tool-label">Select AAC File</label>
        <input
          type="file"
          accept=".aac,.m4a,.mp4"
          onChange={handleFileChange}
          className="tb-v2-input"
        />
      </div>

      {file && (
        <div className="tb-v2-box p-3">
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {file.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={convert}
        disabled={!file || status === 'done'}
        className="tb-v2-btn disabled:opacity-50"
      >
        {status === 'done' ? 'Downloaded!' : 'Convert to M4R'}
      </button>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          ℹ️ M4R is the iPhone ringtone format. This tool re-packages the original AAC file with the .m4r extension.
        </p>
      </div>

      {status === 'done' && (
        <p className="text-sm text-green-600 dark:text-green-400">
          Download started! Check your downloads folder.
        </p>
      )}
    </div>
  );
}
