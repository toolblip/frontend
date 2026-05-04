'use client';

import { useState, useEffect } from 'react';

export default function PasswordStrengthCheckerClient() {
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const checkStrength = (pwd: string) => {
    let score = 0;
    const tips: string[] = [];

    if (pwd.length === 0) {
      setStrength(0);
      setSuggestions(['Enter a password to check']);
      return;
    }

    // Length check
    if (pwd.length >= 8) score++;
    else tips.push('Use at least 8 characters');
    
    if (pwd.length >= 12) score++;
    
    // Character variety checks
    if (/[a-z]/.test(pwd)) score++;
    else tips.push('Add lowercase letters');
    
    if (/[A-Z]/.test(pwd)) score++;
    else tips.push('Add uppercase letters');
    
    if (/[0-9]/.test(pwd)) score++;
    else tips.push('Add numbers');
    
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;
    else tips.push('Add special characters (!@#$%^&*)');

    // Penalty for common patterns
    if (/^[a-zA-Z]+$/.test(pwd) || /^[0-9]+$/.test(pwd)) {
      score = Math.max(0, score - 2);
      tips.push('Avoid using only letters or only numbers');
    }

    // Check for common passwords
    const commonPasswords = ['password', '123456', 'qwerty', 'admin', 'letmein'];
    if (commonPasswords.includes(pwd.toLowerCase())) {
      score = 1;
      tips.push('Avoid common passwords');
    }

    setStrength(Math.min(6, score));
    setSuggestions(tips.length > 0 ? tips : ['Strong password!']);
  };

  useEffect(() => {
    checkStrength(password);
  }, [password]);

  const getStrengthLabel = () => {
    if (strength === 0) return '';
    if (strength <= 1) return 'Very Weak';
    if (strength <= 2) return 'Weak';
    if (strength <= 3) return 'Fair';
    if (strength <= 4) return 'Good';
    if (strength <= 5) return 'Strong';
    return 'Very Strong';
  };

  const getStrengthColor = () => {
    if (strength <= 1) return 'bg-red-500';
    if (strength <= 2) return 'bg-orange-500';
    if (strength <= 3) return 'bg-yellow-500';
    if (strength <= 4) return 'bg-lime-500';
    if (strength <= 5) return 'bg-green-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password to check..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
        />
      </div>

      {password && (
        <>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Strength</span>
              <span className="text-sm font-medium text-gray-700">{getStrengthLabel()}</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${getStrengthColor()} transition-all duration-300 rounded-full`}
                style={{ width: `${(strength / 6) * 100}%` }}
              />
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Suggestions</h3>
            <ul className="space-y-1">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Password Breakdown</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Length:</span>
                <span className="font-medium">{password.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Lowercase:</span>
                <span className={/[a-z]/.test(password) ? 'text-green-600' : 'text-red-600'}>
                  {/[a-z]/.test(password) ? '✓' : '✗'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Uppercase:</span>
                <span className={/[A-Z]/.test(password) ? 'text-green-600' : 'text-red-600'}>
                  {/[A-Z]/.test(password) ? '✓' : '✗'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Numbers:</span>
                <span className={/[0-9]/.test(password) ? 'text-green-600' : 'text-red-600'}>
                  {/[0-9]/.test(password) ? '✓' : '✗'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Special:</span>
                <span className={/[^a-zA-Z0-9]/.test(password) ? 'text-green-600' : 'text-red-600'}>
                  {/[^a-zA-Z0-9]/.test(password) ? '✓' : '✗'}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
