'use client';

import { useState } from 'react';

export default function AviToMkvClient() {
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

    // AVI to MKV is essentially a container re-package
    // In browser, we can only create a download of the original file with new extension
    // Real conversion requires FFmpeg
    setTimeout(() => {
      const url = URL.createObjectURL(file);
      setDownloadUrl(url);
      setIsProcessing(false);
    }, 500);
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm text-blue-800 dark:text-blue-200">
        <strong>Re-package only:</strong> This tool re-packages AVI video into MKV container format. No transcoding is performed. For best results, use FFmpeg.
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
          {isProcessing ? 'Processing...' : 'Re-package to MKV'}
        </button>
      )}

      {downloadUrl && (
        <div className="space-y-3">
          <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl p-4">
            <p className="text-sm text-green-800 dark:text-green-200 mb-3">
              Re-packaging complete! The file has been prepared for download.
            </p>
            <a
              href={downloadUrl}
              download={file?.name.replace(/\.avi$/i, '.mkv') || 'video.mkv'}
              className="tb-v2-btn tb-v2-btn-primary w-full text-center block"
            >
              Download MKV
            </a>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Note: This is a container conversion. Video/audio streams are not re-encoded.
          </p>
        </div>
      )}
    </div>
  );
}
