'use client';

import { useState, useRef, useCallback } from 'react';

type BarcodeFormat = 'EAN13' | 'EAN8' | 'UPC' | 'CODE128' | 'CODE39' | 'CODABAR' | 'auto';

export default function BarcodeScannerClient() {
  const [image, setImage] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [detectedFormat, setDetectedFormat] = useState<BarcodeFormat | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<BarcodeFormat>('auto');
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setScanResult(null);
        setDetectedFormat(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const detectBarcodeFormat = (pattern: string): BarcodeFormat => {
    const digits = pattern.replace(/\D/g, '');
    if (digits.length === 13) return 'EAN13';
    if (digits.length === 8) return 'EAN8';
    if (digits.length === 12) return 'UPC';
    if (/^[A-Z0-9\-\.\$\/\+\%]+$/.test(pattern) && pattern.length > 10) return 'CODE39';
    if (pattern.length > 20) return 'CODE128';
    return 'CODABAR';
  };

  const analyzeBarcodePattern = (gray: number[], width: number, height: number): string | null => {
    const sampleRows = [Math.floor(height * 0.3), Math.floor(height * 0.5), Math.floor(height * 0.7)];
    const patterns: string[] = [];

    for (const rowY of sampleRows) {
      let row = '';
      let x = 0;
      let barWidth = 0;
      let isBar = true;
      const threshold = 128;

      while (x < width) {
        const idx = rowY * width + x;
        const isDark = gray[idx] < threshold;
        if (isDark === isBar) {
          barWidth++;
        } else {
          if (barWidth > 0) {
            row += isBar ? '1'.repeat(Math.min(barWidth, 5)) : '0'.repeat(Math.min(barWidth, 5));
          }
          isBar = !isBar;
          barWidth = 1;
        }
        x++;
      }
      patterns.push(row);
    }

    const commonLength = Math.min(...patterns.map(p => p.length));
    let consensus = '';
    for (let i = 0; i < commonLength; i++) {
      const bits = patterns.map(p => p[i]);
      const oneCount = bits.filter(b => b === '1').length;
      consensus += oneCount >= 2 ? '1' : '0';
    }

    let digits = '';
    let ones = 0;
    for (const char of consensus) {
      if (char === '1') {
        ones++;
      } else if (ones > 0) {
        digits += Math.min(Math.floor(ones / 2), 4).toString();
        ones = 0;
      }
    }

    return digits.length >= 4 ? (digits.replace(/^0+/, '') || digits) : null;
  };

  const decodeBarcode = useCallback(() => {
    if (!image || !canvasRef.current) return;
    setIsScanning(true);
    setError(null);
    setScanResult(null);
    setDetectedFormat(null);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      const grayscale: number[] = [];
      for (let i = 0; i < data.length; i += 4) {
        grayscale.push(data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
      }

      const result = analyzeBarcodePattern(grayscale, canvas.width, canvas.height);

      if (result) {
        const format = detectBarcodeFormat(result);
        setDetectedFormat(selectedFormat === 'auto' ? format : selectedFormat);
        setScanResult(result);
      } else {
        setError('No barcode detected. Try a clearer image with good contrast.');
      }
      setIsScanning(false);
    };
    img.src = image;
  }, [image, selectedFormat]);

  const handleClear = () => {
    setImage(null);
    setScanResult(null);
    setDetectedFormat(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const copy = () => {
    if (!scanResult) return;
    navigator.clipboard.writeText(scanResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const formats: { id: BarcodeFormat; name: string }[] = [
    { id: 'auto', name: 'Auto Detect' },
    { id: 'EAN13', name: 'EAN-13' },
    { id: 'EAN8', name: 'EAN-8' },
    { id: 'UPC', name: 'UPC-A' },
    { id: 'CODE128', name: 'Code 128' },
    { id: 'CODE39', name: 'Code 39' },
    { id: 'CODABAR', name: 'Codabar' },
  ];

  return (
    <div>
      {/* Format Selection */}
      <div>
        <label className="tb-v2-tool-label">Barcode Format</label>
        <div className="flex flex-wrap gap-2">
          {formats.map(f => (
            <button
              key={f.id}
              onClick={() => setSelectedFormat(f.id)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                selectedFormat === f.id
                  ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700'
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>
      </div>

      {/* Upload */}
      <div>
        <label className="tb-v2-tool-label">Upload Image</label>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors"
        >
          <div className="text-4xl mb-2">📷</div>
          <p className="text-gray-600 dark:text-gray-400">Click to upload barcode image</p>
          <p className="text-xs text-gray-500 mt-1">JPG, PNG, WebP</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      {image && (
        <button
          onClick={decodeBarcode}
          disabled={isScanning}
          className="tb-v2-btn tb-v2-btn-primary tb-v2-btn-lg w-full"
        >
          {isScanning ? '⏳ Scanning...' : '🔍 Scan Barcode'}
        </button>
      )}

      <canvas ref={canvasRef} className="hidden" />

      {image && (
        <div>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Uploaded Image</span>
            <button onClick={handleClear} className="tb-v2-btn tb-v2-btn-ghost tb-v2-btn-sm">
              ✕ Clear
            </button>
          </div>
          <img src={image} alt="Barcode" className="max-w-full rounded-xl mx-auto border border-gray-200 dark:border-gray-700" />
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {scanResult && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Scan Result</span>
            <button onClick={copy} className="tb-v2-copy-btn">
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
            <p className="text-sm text-green-600 dark:text-green-400 mb-1">Format: {detectedFormat}</p>
            <p className="text-2xl font-bold text-green-800 dark:text-green-200 break-all font-mono">{scanResult}</p>
          </div>
        </>
      )}

      {!image && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-2">📸</div>
          <p>Upload a barcode image to scan</p>
        </div>
      )}
    </div>
  );
}
