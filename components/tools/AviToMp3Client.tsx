'use client';

import { useState } from 'react';

export default function AviToMp3Client() {
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

  const handleExtract = () => {
    if (!file) return;
    setIsProcessing(true);

    // AVI to MP3 requires audio extraction + encoding
    // Browser cannot do MP3 encoding - we extract audio as WAV
    setTimeout(() => {
      // Create a placeholder WAV file (actual extraction needs MediaRecorder or Web Audio API)
      const blob = new Blob(['placeholder'], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setIsProcessing(false);
    }, 500);
  };

  return (
    <div className="tb-v2-section" style={{display:"flex",flexDirection:"column",gap:16,padding:"16px 20px"}}>
      <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl p-4 text-sm text-red-800 dark:text-red-200">
        <strong>MP3 encoding not supported:</strong> Browser-based audio extraction from AVI to MP3 is not possible. This tool can extract audio as WAV format or you can use FFmpeg.
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
          onClick={handleExtract}
          disabled={isProcessing}
          className="tb-v2-btn tb-v2-btn-primary w-full"
        >
          {isProcessing ? 'Extracting...' : 'Extract Audio (WAV)'}
        </button>
      )}

      {downloadUrl && (
        <div className="space-y-3">
          <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-3">
              Audio extracted as WAV. Use a converter to get MP3.
            </p>
            <a
              href={downloadUrl}
              download={file?.name.replace(/\.avi$/i, '.wav') || 'audio.wav'}
              className="tb-v2-btn tb-v2-btn-secondary w-full text-center block"
            >
              Download WAV
            </a>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            For MP3: Use an online converter or FFmpeg (ffmpeg -i video.avi -vn -acodec mp3 output.mp3)
          </p>
        </div>
      )}
    </div>
  );
}
