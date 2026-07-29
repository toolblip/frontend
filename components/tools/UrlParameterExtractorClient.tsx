'use client';

import { useState } from 'react';

interface Param {
  key: string;
  value: string;
}

export default function UrlParameterExtractorClient() {
  const [url, setUrl] = useState('');
  const [params, setParams] = useState<Param[]>([]);
  const [error, setError] = useState('');

  const extractParams = () => {
    setError('');
    setParams([]);
    
    try {
      const urlObj = new URL(url);
      const searchParams = urlObj.searchParams;
      
      if (searchParams.toString() === '') {
        setError('No parameters found in URL');
        return;
      }

      const extracted: Param[] = [];
      searchParams.forEach((value, key) => {
        extracted.push({ key, value });
      });
      
      setParams(extracted);
    } catch (e) {
      setError('Invalid URL. Please enter a valid URL including protocol (https://)');
    }
  };

  const buildUrl = () => {
    if (!url) return '';
    try {
      const urlObj = new URL(url.split('?')[0]);
      params.forEach(p => {
        if (p.key) urlObj.searchParams.set(p.key, p.value);
      });
      return urlObj.toString();
    } catch {
      return '';
    }
  };

  const updateParam = (index: number, field: 'key' | 'value', val: string) => {
    const updated = [...params];
    updated[index] = { ...updated[index], [field]: val };
    setParams(updated);
  };

  const addParam = () => {
    setParams([...params, { key: '', value: '' }]);
  };

  const removeParam = (index: number) => {
    setParams(params.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <label className="tb-v2-tool-label" style={{marginBottom:8}}>
          URL with Parameters
        </label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/page?id=123&name=john"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
        />
      </div>

      <button
        onClick={extractParams}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Extract Parameters
      </button>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
          {error}
        </div>
      )}

      {params.length > 0 && (
        <>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Extracted Parameters
              </label>
              <button
                onClick={addParam}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                + Add Parameter
              </button>
            </div>
            
            <div className="space-y-2">
              {params.map((param, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={param.key}
                    onChange={(e) => updateParam(index, 'key', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Key"
                  />
                  <input
                    type="text"
                    value={param.value}
                    onChange={(e) => updateParam(index, 'value', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Value"
                  />
                  <button
                    onClick={() => removeParam(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="tb-v2-tool-label" style={{marginBottom:8}}>
              Reconstructed URL
            </label>
            <pre className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md overflow-auto font-mono text-sm break-all">
              {buildUrl()}
            </pre>
            <button
              onClick={() => navigator.clipboard.writeText(buildUrl())}
              className="mt-2 px-3 py-1.5 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Copy to Clipboard
            </button>
          </div>
        </>
      )}
    </div>
  );
}
