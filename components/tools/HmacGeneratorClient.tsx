'use client';

import React, { useState, useEffect } from 'react';

type Algorithm = 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512';

export default function HmacGeneratorClient() {
  const [secret, setSecret] = useState('your-secret-key');
  const [message, setMessage] = useState('Hello, World!');
  const [algorithm, setAlgorithm] = useState<Algorithm>('SHA-256');
  const [result, setResult] = useState('');
  const [isComputing, setIsComputing] = useState(false);
  const [format, setFormat] = useState<'hex' | 'base64'>('hex');

  const computeHmac = async () => {
    if (!secret || !message) {
      setResult('');
      return;
    }

    setIsComputing(true);
    try {
      const encoder = new TextEncoder();
      const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: algorithm },
        false,
        ['sign']
      );

      const signature = await crypto.subtle.sign(
        'HMAC',
        key,
        encoder.encode(message)
      );

      if (format === 'hex') {
        const hexArray = Array.from(new Uint8Array(signature))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
        setResult(hexArray);
      } else {
        const base64Array = btoa(String.fromCharCode(...new Uint8Array(signature)));
        setResult(base64Array);
      }
    } catch (err) {
      setResult(`Error: ${err instanceof Error ? err.message : 'Failed to compute HMAC'}`);
    } finally {
      setIsComputing(false);
    }
  };

  useEffect(() => {
    computeHmac();
  }, [secret, message, algorithm, format]);

  const algorithms: { value: Algorithm; label: string; description: string }[] = [
    { value: 'SHA-1', label: 'SHA-1', description: '160-bit (deprecated for security)' },
    { value: 'SHA-256', label: 'SHA-256', description: '256-bit (recommended)' },
    { value: 'SHA-384', label: 'SHA-384', description: '384-bit (high security)' },
    { value: 'SHA-512', label: 'SHA-512', description: '512-bit (highest security)' },
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="tb-v2-card">
      <div className="tb-v2-card-header">
        <h2 className="tb-v2-card-title">HMAC Generator</h2>
        <p className="tb-v2-card-description">
          Generate Hash-based Message Authentication Codes (HMAC) for secure message authentication
        </p>
      </div>

      <div className="tb-v2-form-group">
        <label className="tb-v2-label">Secret Key</label>
        <input
          type="text"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          className="tb-v2-input font-mono"
          placeholder="Enter your secret key"
        />
        <p className="tb-v2-text text-xs mt-1">The secret key used to sign the message</p>
      </div>

      <div className="tb-v2-form-group">
        <label className="tb-v2-label">Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="tb-v2-input font-mono min-h-[100px]"
          placeholder="Enter the message to authenticate"
        />
      </div>

      <div className="tb-v2-form-group">
        <label className="tb-v2-label">Hash Algorithm</label>
        <div className="grid grid-cols-2 gap-2">
          {algorithms.map((algo) => (
            <button
              key={algo.value}
              onClick={() => setAlgorithm(algo.value)}
              className={`p-3 rounded border text-left transition-colors ${
                algorithm === algo.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-semibold text-sm">{algo.label}</div>
              <div className="text-xs text-gray-500">{algo.description}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="tb-v2-form-group">
        <label className="tb-v2-label">Output Format</label>
        <div className="tb-v2-mode-tabs">
          <button
            onClick={() => setFormat('hex')}
            className={`px-4 py-2 rounded border transition-colors ${
              format === 'hex'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            Hexadecimal
          </button>
          <button
            onClick={() => setFormat('base64')}
            className={`px-4 py-2 rounded border transition-colors ${
              format === 'base64'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            Base64
          </button>
        </div>
      </div>

      <div className="tb-v2-form-group">
        <div className="flex justify-between items-center">
          <label className="tb-v2-label">HMAC Result</label>
          <button
            onClick={copyToClipboard}
            className="tb-v2-button tb-v2-button-primary text-sm"
            disabled={!result || isComputing}
          >
            Copy
          </button>
        </div>
        <div className="tb-v2-card p-4 bg-gray-50 rounded-lg">
          <code className="text-sm break-all text-gray-800">
            {isComputing ? 'Computing...' : result || 'Enter secret and message'}
          </code>
        </div>
      </div>

      <div className="tb-v2-form-group">
        <div className="tb-v2-label">What is HMAC?</div>
        <div className="tb-v2-card p-4 text-sm space-y-2">
          <p>
            <strong>HMAC (Hash-based Message Authentication Code)</strong> is a specific type of MAC 
            that involves a cryptographic hash function and a secret cryptographic key.
          </p>
          <p>
            It provides both <strong>integrity</strong> and <strong>authenticity</strong> verification, 
            ensuring that a message hasn't been altered and confirming the sender's identity.
          </p>
          <p className="text-gray-600">
            <strong>Common use cases:</strong> API authentication, message integrity verification, 
            secure communication protocols (TLS, SSH), and webhook signature validation.
          </p>
        </div>
      </div>
    </div>
  );
}
