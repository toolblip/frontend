'use client';

import { useState } from 'react';

function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  try {
    return decodeURIComponent(
      atob(str)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  } catch {
    return atob(str);
  }
}

function decodeJwt(token: string) {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [header, payload, signature] = parts;
  try {
    return {
      header: JSON.parse(base64UrlDecode(header)),
      payload: JSON.parse(base64UrlDecode(payload)),
      signature,
      valid: true,
    };
  } catch {
    return null;
  }
}

export default function JwtDecoderClient() {
  const [token, setToken] = useState('');
  const [decoded, setDecoded] = useState<ReturnType<typeof decodeJwt>>(null);
  const [error, setError] = useState('');

  const handleDecode = () => {
    const result = decodeJwt(token.trim());
    if (result) {
      setDecoded(result);
      setError('');
    } else {
      setError('Invalid JWT format. Expected: header.payload.signature');
      setDecoded(null);
    }
  };

  const formatJson = (obj: object) => JSON.stringify(obj, null, 2);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">
          Paste your JWT token
        </label>
        <textarea
          value={token}
          onChange={e => setToken(e.target.value)}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
          rows={4}
          className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-red-500 resize-none"
        />
      </div>
      <button
        onClick={handleDecode}
        className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-medium transition-colors"
      >
        Decode
      </button>
      {error && (
        <div className="text-red-500 text-sm bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg px-4 py-2">
          {error}
        </div>
      )}
      {decoded && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Header</label>
            <pre className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 font-mono text-xs text-gray-800 dark:text-gray-200 overflow-x-auto">
              {formatJson(decoded.header)}
            </pre>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Payload</label>
            <pre className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 font-mono text-xs text-gray-800 dark:text-gray-200 overflow-x-auto">
              {formatJson(decoded.payload)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
