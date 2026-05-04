'use client';

import { useState } from 'react';

interface ValidationResult {
  email: string;
  isValid: boolean;
  reason?: string;
  suggestions?: string[];
}

export default function EmailValidatorClient() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkResults, setBulkResults] = useState<ValidationResult[]>([]);

  const validateEmail = (email: string): ValidationResult => {
    const trimmed = email.trim();
    
    if (!trimmed) {
      return { email: trimmed, isValid: false, reason: 'Email address is empty' };
    }

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    if (!emailRegex.test(trimmed)) {
      const suggestions: string[] = [];
      
      // Check for common typos in domain
      const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com'];
      const domain = trimmed.split('@')[1];
      
      if (domain) {
        // Check for misspelled domains
        const typos: Record<string, string> = {
          'gmial.com': 'gmail.com',
          'gmal.com': 'gmail.com',
          'gamil.com': 'gmail.com',
          'yaho.com': 'yahoo.com',
          'hotmal.com': 'hotmail.com',
          'outook.com': 'outlook.com',
        };
        
        if (typos[domain.toLowerCase()]) {
          suggestions.push(`Did you mean ${trimmed.replace(domain, typos[domain.toLowerCase()])}?`);
        }
        
        // Check for missing dots in domain
        if (!domain.includes('.') && commonDomains.some(d => d.startsWith(domain.split(/[0-9]/)[0]))) {
          suggestions.push('Domain may be missing a dot');
        }
      }
      
      // Generate specific error message
      let reason = 'Invalid email format';
      if (!trimmed.includes('@')) {
        reason = 'Missing @ symbol';
      } else if (trimmed.startsWith('@')) {
        reason = 'Missing local part (before @)';
      } else if (trimmed.endsWith('@')) {
        reason = 'Missing domain (after @)';
      } else if (trimmed.split('@').length > 2) {
        reason = 'Too many @ symbols';
      } else if (!/\.[a-zA-Z]{2,}$/.test(trimmed)) {
        reason = 'Missing or invalid top-level domain';
      }

      return { 
        email: trimmed, 
        isValid: false, 
        reason,
        suggestions: suggestions.length > 0 ? suggestions : undefined
      };
    }

    // Additional checks for valid emails
    const [local, domain] = trimmed.split('@');
    
    if (local.length > 64) {
      return { email: trimmed, isValid: false, reason: 'Local part (before @) is too long (max 64 characters)' };
    }
    
    if (domain.length > 255) {
      return { email: trimmed, isValid: false, reason: 'Domain (after @) is too long (max 255 characters)' };
    }

    // Check for suspicious patterns
    if (/\.{2,}/.test(local)) {
      return { email: trimmed, isValid: false, reason: 'Local part contains consecutive dots' };
    }

    if (/^\./.test(local)) {
      return { email: trimmed, isValid: false, reason: 'Local part cannot start with a dot' };
    }

    if (/\.$/.test(local)) {
      return { email: trimmed, isValid: false, reason: 'Local part cannot end with a dot' };
    }

    // All checks passed
    return { email: trimmed, isValid: true };
  };

  const handleValidate = () => {
    if (bulkMode) {
      const emails = input.split('\n').filter(e => e.trim());
      const results = emails.map(email => validateEmail(email));
      setBulkResults(results);
    } else {
      setResult(validateEmail(input));
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address{bulkMode ? 's (one per line)' : ''}
        </label>
        {bulkMode ? (
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="email1@example.com&#10;email2@example.com&#10;invalid-email"
            className="w-full h-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          />
        ) : (
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="user@example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
          />
        )}
      </div>

      <div className="flex items-center gap-4 mb-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={bulkMode}
            onChange={(e) => {
              setBulkMode(e.target.checked);
              setResult(null);
              setBulkResults([]);
            }}
            className="w-4 h-4"
          />
          <span className="text-sm">Bulk validation (multiple emails)</span>
        </label>
      </div>

      <button
        onClick={handleValidate}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Validate {bulkMode ? 'Emails' : 'Email'}
      </button>

      {!bulkMode && result && (
        <div className="flex-1">
          <div className={`p-4 rounded-md mb-4 ${result.isValid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className={`w-4 h-4 rounded-full ${result.isValid ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span className={`font-medium ${result.isValid ? 'text-green-700' : 'text-red-700'}`}>
                {result.isValid ? 'Valid Email' : 'Invalid Email'}
              </span>
            </div>
            
            {!result.isValid && result.reason && (
              <p className="text-sm text-red-600 ml-6">{result.reason}</p>
            )}
            
            {result.suggestions && result.suggestions.length > 0 && (
              <div className="mt-3 ml-6">
                <p className="text-sm font-medium text-gray-700">Suggestions:</p>
                <ul className="mt-1 space-y-1">
                  {result.suggestions.map((s, i) => (
                    <li key={i} className="text-sm text-blue-600">{s}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {bulkMode && bulkResults.length > 0 && (
        <div className="flex-1 overflow-auto">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">
              Results ({bulkResults.filter(r => r.isValid).length}/{bulkResults.length} valid)
            </label>
          </div>
          
          <div className="space-y-2">
            {bulkResults.map((r, index) => (
              <div
                key={index}
                className={`p-3 rounded-md border ${
                  r.isValid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${r.isValid ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    <span className="font-mono text-sm">{r.email}</span>
                  </div>
                  {!r.isValid && r.reason && (
                    <span className="text-xs text-red-600">{r.reason}</span>
                  )}
                </div>
                {r.suggestions && (
                  <div className="mt-1 ml-5">
                    {r.suggestions.map((s, i) => (
                      <span key={i} className="text-xs text-blue-600">{s}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
