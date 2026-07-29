'use client';

import { useState } from 'react';

export default function Azw3ToMobiClient() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setMessage('');
    }
  };

  const handleConvert = () => {
    if (!file) return;
    setIsProcessing(true);
    setMessage('');

    // AZW3 to MOBI conversion - both are Amazon formats
    // MOBI is older, AZW3 is newer (KF8)
    // Browser cannot process these formats
    setTimeout(() => {
      setIsProcessing(false);
      setMessage('AZW3 to MOBI conversion is complex. AZW3 (KF8) contains advanced features that MOBI (KF7) does not support. Some formatting may be lost. Use Calibre for best results.');
    }, 500);
  };

  return (
    <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:16,padding:"16px 20px"}}>
      <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-xl p-4 text-sm text-purple-800 dark:text-purple-200">
        <strong>ebook format conversion:</strong> Converting AZW3 (KF8) to MOBI (KF7) may result in formatting loss since MOBI is an older format with fewer features.
      </div>

      <div>
        <div className="tb-v2-tool-label mb-2">AZW3 File</div>
        <input
          type="file"
          accept=".azw3,application/vnd.amazon.mobi8-ebook"
          onChange={handleFileChange}
          className="tb-v2-tool-input w-full"
        />
        {file && (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </p>
        )}
      </div>

      {file && (
        <button
          type="button"
          onClick={handleConvert}
          disabled={isProcessing}
          className="tb-v2-btn tb-v2-btn-primary w-full"
        >
          {isProcessing ? 'Processing...' : 'Analyze for Conversion'}
        </button>
      )}

      {message && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
          <p className="text-sm text-amber-800 dark:text-amber-200 whitespace-pre-line">{message}</p>
        </div>
      )}

      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-2">
        <p className="tb-v2-tool-label">Recommended Desktop Tools:</p>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
          <li><strong>Calibre</strong> - Free, handles AZW3 to MOBI conversion</li>
          <li><strong>KindleGen</strong> - Amazon&apos;s official tool for MOBI creation</li>
        </ul>
      </div>

      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm text-blue-800 dark:text-blue-200">
        <strong>Tip:</strong> If your Kindle device supports it, consider keeping AZW3 format for best compatibility with advanced features.
      </div>
    </div>
  );
}
