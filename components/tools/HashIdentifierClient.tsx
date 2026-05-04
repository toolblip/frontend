'use client';

import { useState } from 'react';

interface HashInfo {
  type: string;
  length: number;
  description: string;
  entropy: 'low' | 'medium' | 'high';
}

export default function HashIdentifierClient() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<HashInfo | null>(null);

  const identify = (hash: string) => {
    const cleanHash = hash.trim();
    
    if (!cleanHash) {
      setResult(null);
      return;
    }

    const info: HashInfo = {
      type: 'Unknown',
      length: cleanHash.length,
      description: '',
      entropy: 'low'
    };

    // Check length
    if (cleanHash.length === 32) {
      info.type = 'MD5';
      info.description = '128-bit cryptographic hash. Considered weak for security purposes.';
    } else if (cleanHash.length === 40) {
      if (/^[a-f0-9]{40}$/i.test(cleanHash)) {
        info.type = 'SHA-1';
        info.description = '160-bit cryptographic hash. Deprecated for security use.';
      }
    } else if (cleanHash.length === 56) {
      info.type = 'SHA-224 / SHA-512/224';
      info.description = 'Part of SHA-2 family with 224-bit output.';
    } else if (cleanHash.length === 64) {
      if (/^[a-f0-9]{64}$/i.test(cleanHash)) {
        info.type = 'SHA-256';
        info.description = '256-bit cryptographic hash from SHA-2 family. Widely used.';
      }
    } else if (cleanHash.length === 96) {
      info.type = 'SHA-384';
      info.description = '384-bit hash from SHA-2 family.';
    } else if (cleanHash.length === 128) {
      info.type = 'SHA-512';
      info.description = '512-bit hash from SHA-2 family. High security.';
    }

    // Check format patterns
    if (/^\$2[aby]?\$\d{2}\$.{53}$/.test(cleanHash)) {
      info.type = 'Bcrypt';
      info.description = 'Adaptive hash function designed for password hashing.';
    } else if (/^\$pbkdf2/i.test(cleanHash)) {
      info.type = 'PBKDF2';
      info.description = 'Password-Based Key Derivation Function 2.';
    } else if (/^\$argon2(i|d|id)$/.test(cleanHash)) {
      info.type = 'Argon2';
      info.description = 'Winner of Password Hashing Competition. Modern and secure.';
    } else if (/^[a-f0-9]{16}$|^\$s\$[a-f0-9]{16}$/.test(cleanHash)) {
      info.type = 'Drupal 7.x';
      info.description = 'Drupal 7 password hash format.';
    } else if (/^{sha1}/i.test(cleanHash)) {
      info.type = 'SHA-1 (Base64 encoded)';
      info.description = 'SHA-1 with Base64 representation.';
    } else if (/^{md5}/i.test(cleanHash)) {
      info.type = 'MD5 (Apache variant)';
      info.description = 'MD5 hash with {type} prefix, used in Apache.',
      info.length = cleanHash.replace(/[{}]/g, '').length;
    }

    // Calculate entropy approximation
    const uniqueChars = new Set(cleanHash.toLowerCase()).size;
    const ratio = uniqueChars / cleanHash.length;
    if (ratio > 0.7) info.entropy = 'high';
    else if (ratio > 0.4) info.entropy = 'medium';

    setResult(info);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Hash Input
        </label>
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            identify(e.target.value);
          }}
          placeholder="Enter hash to identify (e.g., 5f4dcc3b5aa765d61d8327deb882cf99)"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
        />
      </div>

      {result && (
        <div className="flex-1 space-y-4">
          <div className="p-4 bg-gray-50 rounded-md">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">Identified Type:</span>
                <p className="font-semibold text-lg">{result.type}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Hash Length:</span>
                <p className="font-semibold text-lg">{result.length} characters</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
            <p className="text-sm text-gray-600">{result.description}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Character Entropy</h3>
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full ${
                result.entropy === 'high' ? 'bg-green-500' :
                result.entropy === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
              <span className="text-sm capitalize">{result.entropy} entropy</span>
              <span className="text-sm text-gray-500">
                ({result.entropy === 'high' ? 'Good character distribution' :
                  result.entropy === 'medium' ? 'Moderate character distribution' :
                  'Low character distribution - possible pattern'})
              </span>
            </div>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This tool provides educated guesses based on hash characteristics. 
              For definitive identification, consult cryptographic documentation or use specialized tools.
            </p>
          </div>
        </div>
      )}

      {!result && input && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 text-sm">Enter a hash to identify its type</p>
        </div>
      )}
    </div>
  );
}
