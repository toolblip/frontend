'use client';

import { useState, useMemo } from 'react';

function checkStrength(password: string) {
  const feedback: string[] = [];
  let score = 0;

  // Length checks
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;
  if (password.length >= 20) score++;

  // Character diversity
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) score++;
  if (/[^a-zA-Z0-9!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) score++;

  // Feedback
  if (password.length < 8) feedback.push('Use at least 8 characters');
  if (password.length < 12) feedback.push('Consider using 12+ characters for better security');
  if (!/[a-z]/.test(password)) feedback.push('Add lowercase letters (a-z)');
  if (!/[A-Z]/.test(password)) feedback.push('Add uppercase letters (A-Z)');
  if (!/\d/.test(password)) feedback.push('Add numbers (0-9)');
  if (!/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) feedback.push('Add special characters (!@#$%^&*)');
  if (/(.)\1{2,}/.test(password)) feedback.push('Avoid repeated characters');
  if (/^[a-zA-Z]+$/.test(password)) feedback.push('Mix letters with numbers and symbols');
  if (/^[0-9]+$/.test(password)) feedback.push('Avoid using only numbers');

  // Entropy calculation
  const poolSize = (/[a-z]/.test(password) ? 26 : 0) +
    (/[A-Z]/.test(password) ? 26 : 0) +
    (/\d/.test(password) ? 10 : 0) +
    (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password) ? 32 : 0) +
    (/[^a-zA-Z0-9!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password) ? 100 : 0);
  const entropy = password.length * Math.log2(poolSize || 1);

  // Crack time estimation (assuming 10 billion guesses/sec)
  const guessesPerSec = 10_000_000_000;
  const totalGuesses = Math.pow(2, entropy);
  const seconds = totalGuesses / guessesPerSec;

  let crackTime = '';
  if (seconds < 1) crackTime = 'Instantly';
  else if (seconds < 60) crackTime = `${Math.round(seconds)} seconds`;
  else if (seconds < 3600) crackTime = `${Math.round(seconds / 60)} minutes`;
  else if (seconds < 86400) crackTime = `${Math.round(seconds / 3600)} hours`;
  else if (seconds < 31536000) crackTime = `${Math.round(seconds / 86400)} days`;
  else if (seconds < 31536000 * 1000) crackTime = `${Math.round(seconds / 31536000)} years`;
  else if (seconds < 31536000 * 1000000) crackTime = `${Math.round(seconds / 31536000 / 1000)}k years`;
  else if (seconds < 31536000 * 1e9) crackTime = `${Math.round(seconds / 31536000 / 1e6)}M years`;
  else crackTime = `${(seconds / 31536000 / 1e9).toExponential(1)} billion years`;

  return { score: Math.min(score, 9), entropy, feedback, crackTime, poolSize };
}

export default function PasswordStrengthCheckerClient() {
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);

  const { score, entropy, feedback, crackTime, poolSize } = useMemo(() => checkStrength(password), [password]);
  const pct = Math.min(100, (score / 9) * 100);

  const getStrength = () => {
    if (score <= 2) return { label: 'Weak', color: '#ef4444', emoji: '🔴' };
    if (score <= 4) return { label: 'Fair', color: '#f59e0b', emoji: '🟡' };
    if (score <= 6) return { label: 'Good', color: '#3b82f6', emoji: '🔵' };
    return { label: 'Strong', color: '#10b981', emoji: '🟢' };
  };

  const strength = getStrength();

  const copy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Password</span>
        <div className="flex gap-2">
          <button type="button" onClick={() => setShow(v => !v)} className="tb-v2-mode-tab">
            {show ? '🙈 Hide' : '👁️ Show'}
          </button>
          {password && (
            <button type="button" onClick={copy} className="tb-v2-copy-btn">
              {copied ? 'Copied!' : 'Copy'}
            </button>
          )}
        </div>
      </div>

      <input
        type={show ? 'text' : 'password'}
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Enter your password to check its strength..."
        className="tb-v2-tool-textarea"
        style={{ minHeight: 48, fontFamily: show ? 'var(--f-mono)' : undefined }}
      />

      {password && (
        <>
          {/* Strength bar */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="tb-v2-tool-label">Strength</span>
              <span className="font-semibold" style={{ color: strength.color }}>
                {strength.emoji} {strength.label}
              </span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${pct}%`, backgroundColor: strength.color }}
              />
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <div className="text-lg font-bold">{password.length}</div>
              <div className="text-xs text-gray-500">Characters</div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <div className="text-lg font-bold">{entropy.toFixed(0)}</div>
              <div className="text-xs text-gray-500">Bits of Entropy</div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <div className="text-lg font-bold">{poolSize}</div>
              <div className="text-xs text-gray-500">Pool Size</div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <div className="text-lg font-bold text-xs leading-tight">{crackTime}</div>
              <div className="text-xs text-gray-500">Crack Time</div>
            </div>
          </div>

          {/* Character breakdown */}
          <div className="flex flex-wrap gap-2 text-xs">
            <span className={`px-2 py-1 rounded ${/[a-z]/.test(password) ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
              a-z {/[a-z]/.test(password) ? '✓' : ''}
            </span>
            <span className={`px-2 py-1 rounded ${/[A-Z]/.test(password) ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
              A-Z {/[A-Z]/.test(password) ? '✓' : ''}
            </span>
            <span className={`px-2 py-1 rounded ${/\d/.test(password) ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
              0-9 {/\d/.test(password) ? '✓' : ''}
            </span>
            <span className={`px-2 py-1 rounded ${/[!@#$%^&*]/.test(password) ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
              !@#$ {/[!@#$%^&*]/.test(password) ? '✓' : ''}
            </span>
          </div>
        </>
      )}

      {/* Suggestions */}
      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Suggestions</span>
      </div>
      <div className="tb-v2-tool-output-body">
        {feedback.length > 0 ? (
          <ul className="space-y-1">
            {feedback.map(f => (
              <li key={f} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="text-amber-500">⚠️</span> {f}
              </li>
            ))}
          </ul>
        ) : password ? (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium">
            <span>✅</span> Excellent! Your password meets all recommendations.
          </div>
        ) : (
          <div className="text-gray-500 text-sm">Enter a password to see suggestions</div>
        )}
      </div>
    </div>
  );
}
