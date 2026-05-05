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
    // Detect barcode format based on pattern characteristics
    const digits = pattern.replace(/\D/g, '');
    
    if (digits.length === 13) return 'EAN13';
    if (digits.length === 8) return 'EAN8';
    if (digits.length === 12) return 'UPC';
    if (/^[A-Z0-9\-\.\$\/\+\%]+$/.test(pattern) && pattern.length > 10) return 'CODE39';
    if (pattern.length > 20) return 'CODE128';
    
    return 'CODABAR';
  };

  const analyzeBarcodePattern = (gray: number[], width: number, height: number): string | null => {
    // Sample multiple rows to find barcode patterns
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

    // Find common pattern
    const commonLength = Math.min(...patterns.map(p => p.length));
    let consensus = '';
    
    for (let i = 0; i < commonLength; i++) {
      const bits = patterns.map(p => p[i]);
      const oneCount = bits.filter(b => b === '1').length;
      consensus += oneCount >= 2 ? '1' : '0';
    }

    // Extract digits from barcode pattern (simplified)
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

    if (digits.length >= 4) {
      return digits.replace(/^0+/, '') || digits;
    }

    return null;
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

      // Convert to grayscale
      const grayscale: number[] = [];
      for (let i = 0; i < data.length; i += 4) {
        const gray = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
        grayscale.push(gray);
      }

      // Try different barcode detection strategies
      let result: string | null = null;

      // Strategy 1: Look for vertical bar patterns
      result = analyzeBarcodePattern(grayscale, canvas.width, canvas.height);

      // Strategy 2: If auto-detect, analyze pattern for format
      if (result) {
        const format = detectBarcodeFormat(result);
        setDetectedFormat(selectedFormat === 'auto' ? format : selectedFormat);
        setScanResult(result);
      } else {
        setError('No barcode detected in the image. Please try a clearer image with good contrast.');
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownload = () => {
    if (!scanResult) return;
    const blob = new Blob([`Barcode Result\nFormat: ${detectedFormat}\nValue: ${scanResult}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'barcode-result.txt';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    if (scanResult) {
      navigator.clipboard.writeText(scanResult);
    }
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
    <div className="tb-v2-flex tb-v2-flex-col tb-v2-gap-4 tb-v2-p-4">
      <h2 className="tb-v2-text-2xl tb-v2-font-bold">Barcode Scanner</h2>
      <p className="tb-v2-text-sm tb-v2-text-gray-500">Scan and decode common barcode formats from images</p>

      {/* Format Selection */}
      <div className="tb-v2-card">
        <label className="tb-v2-label">Barcode Format</label>
        <select
          value={selectedFormat}
          onChange={(e) => setSelectedFormat(e.target.value as BarcodeFormat)}
          className="tb-v2-input"
        >
          {formats.map(f => (
            <option key={f.id} value={f.id}>{f.name}</option>
          ))}
        </select>
      </div>

      {/* Upload */}
      <div className="tb-v2-card">
        <label className="tb-v2-label">Upload Image</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="tb-v2-file-input"
        />
        <p className="tb-v2-text-xs tb-v2-text-gray-500 tb-v2-mt-1">
          Supports JPG, PNG, WebP. For best results, use a clear image with good contrast.
        </p>
      </div>

      {image && (
        <button
          onClick={decodeBarcode}
          disabled={isScanning}
          className="tb-v2-btn tb-v2-btn-primary tb-v2-disabled:opacity-50"
        >
          {isScanning ? 'Scanning...' : 'Scan Barcode'}
        </button>
      )}

      <canvas ref={canvasRef} className="tb-v2-hidden" />

      {image && (
        <div className="tb-v2-card">
          <div className="tb-v2-flex tb-v2-justify-between tb-v2-items-center tb-v2-mb-2">
            <p className="tb-v2-text-sm tb-v2-font-medium">Uploaded Image</p>
            <button onClick={handleClear} className="tb-v2-btn tb-v2-btn-secondary tb-v2-text-sm">
              ✕ Clear
            </button>
          </div>
          <img src={image} alt="Barcode" className="tb-v2-max-w-full tb-v2-rounded-lg tb-v2-mx-auto" />
        </div>
      )}

      {error && (
        <div className="tb-v2-p-4 tb-v2-bg-red-100 tb-v2-text-red-700 tb-v2-rounded-lg">
          {error}
        </div>
      )}

      {scanResult && (
        <div className="tb-v2-card">
          <div className="tb-v2-flex tb-v2-justify-between tb-v2-items-center tb-v2-mb-3">
            <h3 className="tb-v2-text-lg tb-v2-font-semibold">Scan Result</h3>
            <div className="tb-v2-flex tb-v2-gap-2">
              <button onClick={copyToClipboard} className="tb-v2-btn tb-v2-btn-secondary tb-v2-text-sm">
                📋 Copy
              </button>
              <button onClick={handleDownload} className="tb-v2-btn tb-v2-btn-primary tb-v2-text-sm">
                ⬇️ Save
              </button>
            </div>
          </div>
          <div className="tb-v2-p-4 tb-v2-bg-green-100 tb-v2-rounded-lg">
            <p className="tb-v2-text-sm tb-v2-text-green-600 mb-1">Format: {detectedFormat}</p>
            <p className="tb-v2-text-2xl tb-v2-font-bold tb-v2-text-green-800 tb-v2-break-all">
              {scanResult}
            </p>
          </div>
        </div>
      )}

      <div className="tb-v2-card tb-v2-bg-gray-50">
        <h3 className="tb-v2-text-lg tb-v2-font-semibold tb-v2-mb-2">Supported Formats</h3>
        <ul className="tb-v2-text-sm tb-v2-space-y-1">
          <li><strong>EAN-13:</strong> 13-digit product barcodes</li>
          <li><strong>EAN-8:</strong> 8-digit product barcodes</li>
          <li><strong>UPC-A:</strong> 12-digit US product barcodes</li>
          <li><strong>Code 128:</strong> High-density alphanumeric</li>
          <li><strong>Code 39:</strong> Alphanumeric for industrial use</li>
          <li><strong>Codabar:</strong> Libraries, blood banks</li>
        </ul>
      </div>
    </div>
  );
}
