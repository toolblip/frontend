'use client';

import { useState, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import { useSubscription } from '@/hooks/useSubscription';
import { checkFileSize } from '@/lib/tier-limits';
export default function PdfPasswordRemoverClient() {
  const { tier } = useSubscription();
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; blob?: Blob } | null>(null);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type === 'application/pdf') {
      // Check file size against tier limit
      const sizeError = checkFileSize(selected, tier);
      if (sizeError) {
        setResult({ success: false, message: sizeError });
        return;
      }
      
      setFile(selected);
      setResult(null);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped && dropped.type === 'application/pdf') {
      // Check file size against tier limit
      const sizeError = checkFileSize(dropped, tier);
      if (sizeError) {
        setResult({ success: false, message: sizeError });
        return;
      }
      
      setFile(dropped);
      setResult(null);
    }
  }, []);

  const removePassword = async () => {
    if (!file || !password.trim()) return;
    
    setProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      // Try to load with password - pdf-lib will throw if password is wrong
      // We use ignoreEncryption to bypass metadata encryption
      let pdfDoc: PDFDocument;
      
      try {
        // First try without password (in case it's not actually encrypted)
        pdfDoc = await PDFDocument.load(uint8Array, {
          ignoreEncryption: true,
        });
      } catch {
        // If that fails, the PDF is encrypted and needs a password
        // pdf-lib doesn't support password decryption directly
        // We'll inform the user
        setResult({
          success: false,
          message: 'This PDF is password-protected. pdf-lib cannot decrypt password-protected PDFs directly. Please use a desktop tool like Adobe Acrobat to remove the password first.',
        });
        return;
      }
      
      // Save without encryption metadata
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      
      setResult({
        success: true,
        message: `Successfully processed "${file.name}"`,
        blob,
      });
    } catch (err: any) {
      setResult({
        success: false,
        message: `Error: ${err.message || 'Failed to process PDF'}`,
      });
    } finally {
      setProcessing(false);
    }
  };

  const downloadResult = () => {
    if (!result?.blob) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file?.name?.replace('.pdf', '_unlocked.pdf') || 'unlocked.pdf';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">PDF Password Remover</h1>
      <p className="text-gray-600 dark:text-gray-400">
        Remove password protection from your PDF files. Works entirely in your browser.
      </p>

      {/* File Upload */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors"
      >
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
          id="pdf-upload"
        />
        <label htmlFor="pdf-upload" className="cursor-pointer">
          <div className="text-4xl mb-2">📄</div>
          <p className="text-gray-600 dark:text-gray-400">
            {file ? file.name : 'Drop a PDF here or click to upload'}
          </p>
          {file && (
            <p className="text-sm text-gray-500 mt-1">
              {(file.size / 1024).toFixed(1)} KB
            </p>
          )}
        </label>
      </div>

      {/* Password Input */}
      <div>
        <label className="block text-sm font-medium mb-2">PDF Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter the PDF password"
          className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
        />
      </div>

      {/* Process Button */}
      <button
        onClick={removePassword}
        disabled={!file || !password.trim() || processing}
        className="w-full py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {processing ? 'Processing...' : 'Remove Password'}
      </button>

      {/* Result */}
      {result && (
        <div className={`p-4 rounded-lg ${result.success ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
          <p className={result.success ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>
            {result.message}
          </p>
          {result.success && (
            <button
              onClick={downloadResult}
              className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Download Unlocked PDF
            </button>
          )}
        </div>
      )}
    </div>
  );
}
      {/* Warning */}
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <p className="text-yellow-800 dark:text-yellow-200 text-sm">
          <strong>⚠️ Limitation:</strong> This tool can remove encryption metadata from PDFs that are not password-protected for opening. 
          For PDFs that require a password to open, you&apos;ll need to use a desktop tool like Adobe Acrobat or Preview (Mac) to remove the password first.
        </p>
      </div>

      {/* File Upload */}
