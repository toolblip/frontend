'use client';

import { useState, useMemo } from 'react';

interface VarietyResult {
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasDigits: boolean;
  hasSpecial: boolean;
  hasSpaces: boolean;
  hasLetters: boolean;
  varietyScore: number;
  varietyLabel: string;
  missingTypes: string[];
  uniqueChars: number;
  totalChars: number;
}

export default function CharacterVarietyCheckerClient() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const result = useMemo((): VarietyResult | null => {
    if (!text) return null;

    const chars = text.split('');
    const uniqueChars = new Set(chars).size;
    const totalChars = chars.length;

    const hasUppercase = /[A-Z]/.test(text);
    const hasLowercase = /[a-z]/.test(text);
    const hasDigits = /[0-9]/.test(text);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(text);
    const hasSpaces = /\s/.test(text);
    const hasLetters = /[a-zA-Z]/.test(text);

    const missingTypes: string[] = [];
    if (!hasUppercase) missingTypes.push('uppercase letters');
    if (!hasLowercase) missingTypes.push('lowercase letters');
    if (!hasDigits) missingTypes.push('digits');
    if (!hasSpecial) missingTypes.push('special characters');

    let varietyScore = 0;
    if (hasUppercase) varietyScore += 25;
    if (hasLowercase) varietyScore += 25;
    if (hasDigits) varietyScore += 25;
    if (hasSpecial) varietyScore += 25;

    const uniqueRatio = uniqueChars / totalChars;
    if (uniqueRatio > 0.5) varietyScore += 10;
    if (uniqueRatio > 0.7) varietyScore += 10;
    varietyScore = Math.min(varietyScore, 100);

    let varietyLabel: string;
    if (varietyScore >= 80) varietyLabel = 'Excellent';
    else if (varietyScore >= 60) varietyLabel = 'Good';
    else if (varietyScore >= 40) varietyLabel = 'Fair';
    else if (varietyScore >= 20) varietyLabel = 'Poor';
    else varietyLabel = 'Very Poor';

    return {
      hasUppercase,
      hasLowercase,
      hasDigits,
      hasSpecial,
      hasSpaces,
      hasLetters,
      varietyScore,
      varietyLabel,
      missingTypes,
      uniqueChars,
      totalChars
    };
  }, [text]);

  const getScoreColor = (score: number): string => {
    if (score >= 80) return '#27ae60';
    if (score >= 60) return '#2ecc71';
    if (score >= 40) return '#f39c12';
    if (score >= 20) return '#e67e22';
    return '#e74c3c';
  };

  const loadExample = () => setText('P@ssw0rd 2026!');

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Text</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
          Load Example
        </button>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter your text, password, or string to analyze..."
        className="tb-v2-tool-textarea"
        rows={4}
        aria-label="Text input"
      />

      {!result && (
        <p className="tb-v2-empty">Enter text above to score its character variety and see a full breakdown.</p>
      )}

      {result && (
        <>
          <div className="tb-v2-tool-output-body" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3.5rem', fontWeight: 700, color: getScoreColor(result.varietyScore) }}>
              {result.varietyScore}
            </div>
            <div style={{ fontSize: '1.1rem', color: getScoreColor(result.varietyScore), fontWeight: 600 }}>
              {result.varietyLabel}
            </div>
          </div>

          <div className="tb-v2-grid-2">
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-center">
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">{result.totalChars}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Total Characters</div>
            </div>
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-center">
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">{result.uniqueChars}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Unique Characters</div>
            </div>
          </div>

          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Character Types</span>
          </div>
          <div className="tb-v2-tool-output-body">
            <div className="flex flex-col gap-1.5 text-sm">
              <div className="flex items-center gap-2" style={{ color: result.hasUppercase ? '#27ae60' : '#e74c3c' }}>
                <span>{result.hasUppercase ? '✓' : '✗'}</span>
                <span>Uppercase Letters (A-Z)</span>
              </div>
              <div className="flex items-center gap-2" style={{ color: result.hasLowercase ? '#27ae60' : '#e74c3c' }}>
                <span>{result.hasLowercase ? '✓' : '✗'}</span>
                <span>Lowercase Letters (a-z)</span>
              </div>
              <div className="flex items-center gap-2" style={{ color: result.hasDigits ? '#27ae60' : '#e74c3c' }}>
                <span>{result.hasDigits ? '✓' : '✗'}</span>
                <span>Digits (0-9)</span>
              </div>
              <div className="flex items-center gap-2" style={{ color: result.hasSpecial ? '#27ae60' : '#e74c3c' }}>
                <span>{result.hasSpecial ? '✓' : '✗'}</span>
                <span>Special Characters (!@#$%...)</span>
              </div>
              <div className="flex items-center gap-2" style={{ color: result.hasSpaces ? '#27ae60' : '#95a5a6' }}>
                <span>{result.hasSpaces ? '✓' : '○'}</span>
                <span>Whitespace</span>
              </div>
              <div className="flex items-center gap-2" style={{ color: result.hasLetters ? '#27ae60' : '#95a5a6' }}>
                <span>{result.hasLetters ? '✓' : '○'}</span>
                <span>Letters (alphabetic)</span>
              </div>
            </div>
          </div>

          {result.missingTypes.length > 0 && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 text-sm">
              Missing: {result.missingTypes.join(', ')}
            </div>
          )}

          <button
            type="button"
            onClick={() => copyToClipboard(JSON.stringify(result, null, 2))}
            className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
          >
            {copied ? 'Copied' : 'Copy Analysis as JSON'}
          </button>
        </>
      )}
    </div>
  );
}
