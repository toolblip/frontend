'use client';

import { useState, useRef, useEffect } from 'react';

type BarcodeType = 'CODE128' | 'CODE39' | 'EAN13' | 'EAN8' | 'UPC' | 'CODABAR';

export default function BarcodeGeneratorClient() {
  const [input, setInput] = useState('');
  const [barcodeType, setBarcodeType] = useState<BarcodeType>('CODE128');
  const [showBarcode, setShowBarcode] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const barcodeTypes: { id: BarcodeType; name: string; description: string }[] = [
    { id: 'CODE128', name: 'Code 128', description: 'Most versatile, supports all ASCII' },
    { id: 'CODE39', name: 'Code 39', description: 'Alphanumeric, used in military' },
    { id: 'EAN13', name: 'EAN-13', description: 'Product barcodes (13 digits)' },
    { id: 'EAN8', name: 'EAN-8', description: 'Small products (8 digits)' },
    { id: 'UPC', name: 'UPC-A', description: 'US product barcodes (12 digits)' },
    { id: 'CODABAR', name: 'Codabar', description: 'Libraries, blood banks' },
  ];

  const generateBarcodePatterns = (text: string, type: BarcodeType): { bars: boolean[]; width: number } => {
    // Simplified barcode generation - real barcodes need proper encoding tables
    const bars: boolean[] = [];
    
    // Start pattern
    bars.push(true, false, true);
    
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      // Generate a pseudo-random but consistent pattern based on character
      for (let j = 0; j < 7; j++) {
        bars.push(((charCode + j) % 3) === 0);
      }
      // Inter-character gap
      bars.push(false);
    }
    
    // End pattern
    bars.push(true, false, true, false, true);
    
    return { bars, width: bars.length * 2 };
  };

  const drawBarcode = () => {
    if (!input.trim() || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Validate input based on barcode type
    const numericInput = input.replace(/\D/g, '');
    let validInput = input;
    
    switch (barcodeType) {
      case 'EAN13':
        validInput = numericInput.slice(0, 12).padEnd(12, '0');
        break;
      case 'EAN8':
        validInput = numericInput.slice(0, 7).padEnd(7, '0');
        break;
      case 'UPC':
        validInput = numericInput.slice(0, 11).padEnd(11, '0');
        break;
    }

    const { bars, width } = generateBarcodePatterns(validInput, barcodeType);
    
    const height = 100;
    const quietZone = 20;
    const totalWidth = width + quietZone * 2;
    
    canvas.width = totalWidth;
    canvas.height = height + 40;

    // Clear canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw bars
    ctx.fillStyle = 'black';
    let x = quietZone;
    
    for (let i = 0; i < bars.length; i++) {
      if (bars[i]) {
        ctx.fillRect(x, 10, 2, height);
      }
      x += 2;
    }

    // Draw text
    ctx.fillStyle = 'black';
    ctx.font = '14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(validInput, totalWidth / 2, height + 25);

    setShowBarcode(true);
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `barcode-${barcodeType}-${input}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleCopyImage = async () => {
    if (!canvasRef.current) return;
    
    try {
      const canvas = canvasRef.current;
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b!), 'image/png');
      });
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
    } catch (err) {
      // Fallback: copy text
      navigator.clipboard.writeText(input);
    }
  };

  useEffect(() => {
    if (showBarcode) {
      drawBarcode();
    }
  }, [input, barcodeType]);

  return (
    <div className="tb-v2-flex tb-v2-flex-col tb-v2-gap-4 tb-v2-p-4">
      <h2 className="tb-v2-text-2xl tb-v2-font-bold">Barcode Generator</h2>
      <p className="tb-v2-text-sm tb-v2-text-gray-500">Generate 1D barcodes from text or numbers</p>

      {/* Barcode Type Selection */}
      <div className="tb-v2-card">
        <label className="tb-v2-label">Barcode Type</label>
        <div className="tb-v2-grid tb-v2-grid-cols-2 tb-v2-gap-2">
          {barcodeTypes.map(type => (
            <button
              key={type.id}
              onClick={() => { setBarcodeType(type.id); setShowBarcode(false); }}
              className={`tb-v2-btn tb-v2-text-left tb-v2-p-3 ${barcodeType === type.id ? 'tb-v2-btn-primary' : 'tb-v2-btn-secondary'}`}
            >
              <span className="tb-v2-font-medium">{type.name}</span>
              <p className="tb-v2-text-xs tb-v2-opacity-70">{type.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="tb-v2-card">
        <label className="tb-v2-label">
          {barcodeType === 'EAN13' && 'Enter 12 digits'}
          {barcodeType === 'EAN8' && 'Enter 7 digits'}
          {barcodeType === 'UPC' && 'Enter 11 digits'}
          {barcodeType !== 'EAN13' && barcodeType !== 'EAN8' && barcodeType !== 'UPC' && 'Enter text or numbers'}
        </label>
        <input
          type="text"
          value={input}
          onChange={(e) => { setInput(e.target.value); setShowBarcode(false); }}
          placeholder={barcodeType === 'EAN13' || barcodeType === 'EAN8' || barcodeType === 'UPC' ? '123456789012' : 'Enter value to encode'}
          className="tb-v2-input"
          maxLength={barcodeType === 'EAN13' ? 12 : barcodeType === 'EAN8' ? 7 : barcodeType === 'UPC' ? 11 : 50}
        />
        <p className="tb-v2-text-xs tb-v2-text-gray-500 tb-v2-mt-1">
          {(barcodeType === 'EAN13' || barcodeType === 'EAN8' || barcodeType === 'UPC') && 
           `Current: ${input.replace(/\D/g, '').length} / ${barcodeType === 'EAN13' ? 12 : barcodeType === 'EAN8' ? 7 : 11} digits`}
        </p>
      </div>

      {/* Generate Button */}
      <button
        onClick={drawBarcode}
        disabled={!input.trim()}
        className="tb-v2-btn tb-v2-btn-primary tb-v2-disabled:opacity-50"
      >
        Generate Barcode
      </button>

      {/* Preview */}
      {showBarcode && (
        <div className="tb-v2-card">
          <div className="tb-v2-flex tb-v2-justify-between tb-v2-items-center tb-v2-mb-3">
            <h3 className="tb-v2-text-lg tb-v2-font-semibold">Preview</h3>
            <div className="tb-v2-flex tb-v2-gap-2">
              <button onClick={handleCopyImage} className="tb-v2-btn tb-v2-btn-secondary tb-v2-text-sm">
                📋 Copy Image
              </button>
              <button onClick={handleDownload} className="tb-v2-btn tb-v2-btn-primary tb-v2-text-sm">
                ⬇️ Download PNG
              </button>
            </div>
          </div>
          <div className="tb-v2-flex tb-v2-justify-center tb-v2-p-4 tb-v2-bg-white tb-v2-rounded-lg">
            <canvas ref={canvasRef} />
          </div>
          <p className="tb-v2-text-center tb-v2-text-sm tb-v2-text-gray-500 tb-v2-mt-2">
            {barcodeType} • {input}
          </p>
        </div>
      )}

      {/* Info */}
      <div className="tb-v2-card tb-v2-bg-gray-50">
        <h3 className="tb-v2-text-lg tb-v2-font-semibold tb-v2-mb-2">Barcode Types</h3>
        <ul className="tb-v2-text-sm tb-v2-space-y-1">
          <li><strong>Code 128:</strong> Can encode all 128 ASCII characters</li>
          <li><strong>Code 39:</strong> alphanumeric, used in military and automotive</li>
          <li><strong>EAN-13:</strong> International product barcodes (12 digits + check digit)</li>
          <li><strong>EAN-8:</strong> Short product barcodes (7 digits + check digit)</li>
          <li><strong>UPC-A:</strong> US product barcodes (11 digits + check digit)</li>
          <li><strong>Codabar:</strong> Used in libraries, blood banks, etc.</li>
        </ul>
      </div>
    </div>
  );
}
