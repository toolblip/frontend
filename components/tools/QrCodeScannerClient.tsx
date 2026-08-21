'use client';

import { useState, useRef, useCallback } from 'react';

export default function QrCodeScannerClient() {
  const [image, setImage] = useState<string | null>(null);
  const [qrResult, setQrResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setQrResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const decodeQRCode = useCallback(() => {
    if (!image || !canvasRef.current) return;

    setIsScanning(true);
    setError(null);
    setQrResult(null);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Simple QR code detection using pattern matching
      // This is a basic implementation - for production, use a library like jsQR
      const result = detectQRCode(imageData, canvas.width, canvas.height);
      
      if (result) {
        setQrResult(result);
      } else {
        setError('No QR code detected in the image. Please try a clearer image.');
      }
      setIsScanning(false);
    };
    img.src = image;
  }, [image]);

  // Basic QR code detection using edge detection and pattern analysis
  const detectQRCode = (imageData: ImageData, width: number, height: number): string | null => {
    const data = imageData.data;
    
    // Convert to grayscale and detect finder patterns (the three corner squares)
    const grayscale: number[] = [];
    for (let i = 0; i < data.length; i += 4) {
      const gray = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
      grayscale.push(gray);
    }

    // Look for finder patterns (7x7 modules of alternating pixels)
    // QR codes have distinctive finder patterns in corners
    const minModuleSize = 10;
    const finderCandidates: { x: number; y: number; size: number }[] = [];

    // Scan for finder patterns (top-left, top-right, bottom-left)
    for (let y = 0; y < height - minModuleSize * 7; y += minModuleSize) {
      for (let x = 0; x < width - minModuleSize * 7; x += minModuleSize) {
        if (isFinderPattern(grayscale, x, y, width, minModuleSize)) {
          finderCandidates.push({ x, y, size: minModuleSize });
        }
      }
    }

    if (finderCandidates.length < 2) {
      // Not enough finder patterns for a QR code
      // Try to detect any rectangular barcode-like pattern
      return detectSimpleBarcode(grayscale, width, height);
    }

    // Extract data using a simplified approach
    // This is a basic implementation - real QR decoding is complex
    return extractQRData(grayscale, width, height, finderCandidates);
  };

  const isFinderPattern = (gray: number[], x: number, y: number, width: number, moduleSize: number): boolean => {
    const size = moduleSize * 7;
    if (x + size >= width) return false;
    
    // Check for the distinctive finder pattern: alternating rings
    // Center should be dark, then light ring, then dark ring
    let centerSum = 0;
    let ring1Sum = 0;
    let ring2Sum = 0;
    
    const mid = moduleSize * 3;
    for (let dy = 0; dy < moduleSize; dy++) {
      for (let dx = 0; dx < moduleSize; dx++) {
        const idx = (y + dy + mid) * width + (x + dx + mid);
        const idx1 = (y + dy) * width + (x + dx);
        const idx2 = (y + dy + size - moduleSize) * width + (x + dx + size - moduleSize);
        
        if (idx < gray.length) centerSum += gray[idx];
        if (idx1 < gray.length) ring1Sum += gray[idx1];
        if (idx2 < gray.length) ring2Sum += gray[idx2];
      }
    }
    
    const centerAvg = centerSum / (moduleSize * moduleSize);
    const ring1Avg = ring1Sum / (moduleSize * moduleSize);
    const ring2Avg = ring2Sum / (moduleSize * moduleSize);
    
    // Center should be dark, rings should be light
    return centerAvg < 100 && ring1Avg > 150 && ring2Avg < 100;
  };

  const detectSimpleBarcode = (gray: number[], width: number, height: number): string | null => {
    // Detect vertical barcode-like patterns
    let barcodeData = '';
    let startX = 0;
    let inBar = false;
    let barWidth = 0;
    const threshold = 128;
    
    // Sample middle row
    const middleY = Math.floor(height / 2);
    const row: number[] = [];
    for (let x = 0; x < width; x++) {
      row.push(gray[middleY * width + x]);
    }
    
    // Find transitions
    for (let x = 0; x < width; x++) {
      const isDark = row[x] < threshold;
      if (isDark && !inBar) {
        inBar = true;
        startX = x;
        barWidth = 1;
      } else if (isDark && inBar) {
        barWidth++;
      } else if (!isDark && inBar) {
        inBar = false;
        // This is a simple detection - real barcodes need more sophisticated decoding
        barcodeData += barWidth > 3 ? '1' : '0';
      }
    }
    
    // If we found enough patterns, it might be a barcode
    if (barcodeData.length > 10) {
      return `Barcode pattern detected: ${barcodeData.substring(0, 50)}... (decoding requires specialized library)`;
    }
    
    return null;
  };

  const extractQRData = (gray: number[], width: number, height: number, finders: { x: number; y: number; size: number }[]): string | null => {
    // Calculate module size from finder patterns
    const moduleSize = Math.max(...finders.map(f => f.size));
    
    // For a real QR decoder, we would:
    // 1. Use finder patterns to determine orientation
    // 2. Locate alignment patterns
    // 3. Extract timing patterns
    // 4. Read format and version info
    // 5. Decode the data
    
    // This is a simplified placeholder
    // In production, use jsQR or similar library
    
    // Try to find data regions by analyzing the area between finders
    const dataRegion = analyzeDataRegion(gray, width, height, finders, moduleSize);
    
    if (dataRegion) {
      return dataRegion;
    }
    
    return 'QR code detected but content could not be decoded. For full QR decoding, please use a QR code library like jsQR.';
  };

  const analyzeDataRegion = (gray: number[], width: number, height: number, finders: { x: number; y: number; size: number }[], moduleSize: number): string | null => {
    // This would analyze the data portion of the QR code
    // For now, return a message that we detected a QR but couldn't decode
    
    // Simple check: look for high-density dark/light patterns
    let darkPixels = 0;
    const totalPixels = width * height;
    
    for (let i = 0; i < gray.length; i++) {
      if (gray[i] < 128) darkPixels++;
    }
    
    const darkRatio = darkPixels / totalPixels;
    
    // QR codes typically have around 50% dark pixels when including quiet zone
    if (darkRatio > 0.2 && darkRatio < 0.8) {
      return `QR Code detected (${Math.round(darkRatio * 100)}% dark pixels). For full decoding, integrate a QR library like jsQR.`;
    }
    
    return null;
  };

  const handleDownload = () => {
    if (!qrResult) return;
    const blob = new Blob([qrResult], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'qr-result.txt';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="tb-v2-flex tb-v2-flex-col tb-v2-gap-4 tb-v2-p-4">
      <h2 className="tb-v2-text-2xl tb-v2-font-bold">QR Code Scanner</h2>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="tb-v2-file-input"
      />

      {image && (
        <button
          onClick={decodeQRCode}
          disabled={isScanning}
          className="tb-v2-btn tb-v2-btn-primary tb-v2-disabled:opacity-50"
        >
          {isScanning ? 'Scanning...' : 'Scan QR Code'}
        </button>
      )}

      <canvas ref={canvasRef} className="hidden" />

      {image && (
        <div className="tb-v2-mt-4">
          <p className="tb-v2-tool-label" style={{marginBottom:8}}>Uploaded Image</p>
          <img src={image} alt="QR Code" className="tb-v2-max-w-full tb-v2-rounded-lg" />
        </div>
      )}

      {error && (
        <div className="tb-v2-p-4 tb-v2-bg-red-100 tb-v2-text-red-700 tb-v2-rounded-lg">
          {error}
        </div>
      )}

      {qrResult && (
        <div className="tb-v2-mt-4">
          <p className="tb-v2-tool-label" style={{marginBottom:8}}>QR Code Result</p>
          <div className="tb-v2-p-4 tb-v2-bg-green-100 tb-v2-text-green-800 tb-v2-rounded-lg tb-v2-break-all">
            {qrResult}
          </div>
          <button onClick={handleDownload} className="tb-v2-btn tb-v2-btn-secondary tb-v2-mt-2">
            Save Result
          </button>
        </div>
      )}

      <div className="tb-v2-text-sm tb-v2-text-gray-500 tb-v2-mt-4">
        <p className="tb-v2-font-medium">Note:</p>
        <p>This basic scanner uses pattern detection. For reliable QR code decoding, consider integrating a library like jsQR.</p>
      </div>
    </div>
  );
}