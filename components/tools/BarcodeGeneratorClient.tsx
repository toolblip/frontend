'use client';

import { useState, useRef, useEffect } from 'react';

type BarcodeType = 'CODE128' | 'CODE39' | 'EAN13' | 'EAN8' | 'UPC' | 'CODABAR';

const EXAMPLES: Record<BarcodeType, string> = {
  CODE128: 'HELLO123',
  CODE39: 'TOOLBLIP',
  EAN13: '123456789012',
  EAN8: '1234567',
  UPC: '12345678901',
  CODABAR: 'A12345B',
};

export default function BarcodeGeneratorClient() {
  const [input, setInput] = useState('');
  const [barcodeType, setBarcodeType] = useState<BarcodeType>('CODE128');
  const [showBarcode, setShowBarcode] = useState(false);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const barcodeTypes: { id: BarcodeType; name: string; description: string }[] = [
    { id: 'CODE128', name: 'Code 128', description: 'Most versatile' },
    { id: 'CODE39', name: 'Code 39', description: 'Alphanumeric' },
    { id: 'EAN13', name: 'EAN-13', description: 'Product (13 digits)' },
    { id: 'EAN8', name: 'EAN-8', description: 'Small product (8 digits)' },
    { id: 'UPC', name: 'UPC-A', description: 'US product (12 digits)' },
    { id: 'CODABAR', name: 'Codabar', description: 'Libraries' },
  ];

  const generateBarcodePatterns = (text: string): { bars: boolean[]; width: number } => {
    const bars: boolean[] = [];
    bars.push(true, false, true);
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      for (let j = 0; j < 7; j++) {
        bars.push(((charCode + j) % 3) === 0);
      }
      bars.push(false);
    }
    bars.push(true, false, true, false, true);
    return { bars, width: bars.length * 2 };
  };

  const drawBarcode = () => {
    if (!input.trim() || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const numericInput = input.replace(/\D/g, '');
    let validInput = input;
    
    switch (barcodeType) {
      case 'EAN13': validInput = numericInput.slice(0, 12).padEnd(12, '0'); break;
      case 'EAN8': validInput = numericInput.slice(0, 7).padEnd(7, '0'); break;
      case 'UPC': validInput = numericInput.slice(0, 11).padEnd(11, '0'); break;
    }

    const { bars, width } = generateBarcodePatterns(validInput);
    const height = 100;
    const quietZone = 20;
    const totalWidth = width + quietZone * 2;
    
    canvas.width = totalWidth;
    canvas.height = height + 40;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'black';
    let x = quietZone;
    for (let i = 0; i < bars.length; i++) {
      if (bars[i]) ctx.fillRect(x, 10, 2, height);
      x += 2;
    }

    ctx.fillStyle = 'black';
    ctx.font = '14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(validInput, totalWidth / 2, height + 25);
    setShowBarcode(true);
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `barcode-${barcodeType}-${input}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const copy = () => {
    navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  useEffect(() => {
    if (showBarcode) drawBarcode();
  }, [input, barcodeType]);

  return (
    <div>
      {/* Barcode Type Selection */}
      <div>
        <label className="tb-v2-tool-label">Barcode Type</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {barcodeTypes.map(type => (
            <button
              key={type.id}
              onClick={() => { setBarcodeType(type.id); setShowBarcode(false); }}
              className={`p-3 rounded-lg text-left transition-colors ${
                barcodeType === type.id
                  ? 'bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-300 dark:border-indigo-700'
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <div className="font-medium text-sm">{type.name}</div>
              <div className="text-xs text-gray-500">{type.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div>
        <div className="tb-v2-tool-input-head">
          <span className="tb-v2-tool-label">
            {barcodeType === 'EAN13' ? 'Enter 12 digits' :
             barcodeType === 'EAN8' ? 'Enter 7 digits' :
             barcodeType === 'UPC' ? 'Enter 11 digits' : 'Enter text or numbers'}
          </span>
          <button
            onClick={() => { setInput(EXAMPLES[barcodeType]); setShowBarcode(false); }}
            className="tb-v2-btn tb-v2-btn-ghost tb-v2-btn-sm"
          >
            📋 Example
          </button>
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => { setInput(e.target.value); setShowBarcode(false); }}
          placeholder={EXAMPLES[barcodeType]}
          className="tb-v2-tool-textarea"
          style={{ minHeight: 48, fontFamily: 'var(--f-mono)' }}
          maxLength={barcodeType === 'EAN13' ? 12 : barcodeType === 'EAN8' ? 7 : barcodeType === 'UPC' ? 11 : 50}
        />
        <p className="text-xs text-gray-500 mt-1">
          {['EAN13', 'EAN8', 'UPC'].includes(barcodeType) && 
           `Current: ${input.replace(/\D/g, '').length} / ${barcodeType === 'EAN13' ? 12 : barcodeType === 'EAN8' ? 7 : 11} digits`}
        </p>
      </div>

      <button
        onClick={drawBarcode}
        disabled={!input.trim()}
        className="tb-v2-btn tb-v2-btn-primary tb-v2-btn-lg w-full"
      >
        🔲 Generate Barcode
      </button>

      {showBarcode && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Preview</span>
            <div className="flex gap-2">
              <button onClick={copy} className="tb-v2-copy-btn">
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button onClick={handleDownload} className="tb-v2-btn tb-v2-btn-ghost tb-v2-btn-sm">
                ⬇️ Download
              </button>
            </div>
          </div>
          <div className="flex justify-center p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
            <canvas ref={canvasRef} />
          </div>
          <p className="text-center text-sm text-gray-500">
            {barcodeType} - {input}
          </p>
        </>
      )}

      {!showBarcode && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-2">📊</div>
          <p>Enter data above to generate a barcode</p>
        </div>
      )}
    </div>
  );
}
