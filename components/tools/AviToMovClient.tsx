'use client';

import { useState } from 'react';

export default function AviToMovClient() {
  const [file, setFile] = useState<File | null>(null);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setDownloadUrl('');
    }
  };

  const handleConvert = () => {
    if (!file) return;
    setIsProcessing(true);

    // AVI to MOV requires re-encoding (MOV uses different codecs)
    // Browser cannot do this - we just provide the original file as a placeholder
    setTimeout(() => {
      const url = URL.createObjectURL(file);
      setDownloadUrl(url);
      setIsProcessing(false);
    }, 500);
  };

  return (
    <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:16,padding:"16px 20px"}}>
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-sm text-amber-800 dark:text-amber-200">
        <strong>Note:</strong> Converting AVI to MOV requires re-encoding video/audio streams. This browser tool can only prepare a placeholder. Use FFmpeg for actual conversion.
      </div>

      <div>
        <div className="tb-v2-tool-label mb-2">Video File (AVI)</div>
        <input
          type="file"
          accept="video/x-msvideo,.avi"
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
          {isProcessing ? 'Processing...' : 'Convert to MOV'}
        </button>
      )}

      {downloadUrl && (
        <div className="space-y-3">
          <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-3">
              This is a placeholder. Real AVI to MOV conversion requires FFmpeg or similar tools.
            </p>
            <a
              href={downloadUrl}
              download={file?.name.replace(/\.avi$/i, '.mov') || 'video.mov'}
              className="tb-v2-btn tb-v2-btn-secondary w-full text-center block"
            >
              Download MOV (Placeholder)
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
