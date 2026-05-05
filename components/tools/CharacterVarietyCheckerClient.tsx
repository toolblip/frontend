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

    // Calculate variety score (0-100)
    let varietyScore = 0;
    if (hasUppercase) varietyScore += 25;
    if (hasLowercase) varietyScore += 25;
    if (hasDigits) varietyScore += 25;
    if (hasSpecial) varietyScore += 25;

    // Bonus for unique character ratio
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

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Enter text to check character variety</span>
      </div>

      <div className="tb-v2-input-group">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your text, password, or string to analyze..."
          className="tb-v2-textarea"
          rows={4}
          aria-label="Text input"
        />
      </div>

      {result && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Variety Score</span>
          </div>
          <div className="tb-v2-tool-output-body">
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '4rem',
                  fontWeight: 700,
                  color: getScoreColor(result.varietyScore)
                }}
              >
                {result.varietyScore}
              </div>
              <div
                style={{
                  fontSize: '1.25rem',
                  color: getScoreColor(result.varietyScore),
                  fontWeight: 600
                }}
              >
                {result.varietyLabel}
              </div>
            </div>
          </div>

          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Character Statistics</span>
          </div>
          <div className="tb-v2-tool-output-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
              <div className="tb-v2-stat-box">
                <div className="tb-v2-stat-value">{result.totalChars}</div>
                <div className="tb-v2-stat-label">Total Characters</div>
              </div>
              <div className="tb-v2-stat-box">
                <div className="tb-v2-stat-value">{result.uniqueChars}</div>
                <div className="tb-v2-stat-label">Unique Characters</div>
              </div>
            </div>
          </div>

          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Character Types</span>
          </div>
          <div className="tb-v2-tool-output-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div className="tb-v2-check-item" style={{ color: result.hasUppercase ? '#27ae60' : '#e74c3c' }}>
                <span>{result.hasUppercase ? '✓' : '✗'}</span>
                <span>Uppercase Letters (A-Z)</span>
              </div>
              <div className="tb-v2-check-item" style={{ color: result.hasLowercase ? '#27ae60' : '#e74c3c' }}>
                <span>{result.hasLowercase ? '✓' : '✗'}</span>
                <span>Lowercase Letters (a-z)</span>
              </div>
              <div className="tb-v2-check-item" style={{ color: result.hasDigits ? '#27ae60' : '#e74c3c' }}>
                <span>{result.hasDigits ? '✓' : '✗'}</span>
                <span>Digits (0-9)</span>
              </div>
              <div className="tb-v2-check-item" style={{ color: result.hasSpecial ? '#27ae60' : '#e74c3c' }}>
                <span>{result.hasSpecial ? '✓' : '✗'}</span>
                <span>Special Characters (!@#$%...)</span>
              </div>
              <div className="tb-v2-check-item" style={{ color: result.hasSpaces ? '#27ae60' : '#95a5a6' }}>
                <span>{result.hasSpaces ? '✓' : '○'}</span>
                <span>Whitespace</span>
              </div>
              <div className="tb-v2-check-item" style={{ color: result.hasLetters ? '#27ae60' : '#95a5a6' }}>
                <span>{result.hasLetters ? '✓' : '○'}</span>
                <span>Letters (alphabetic)</span>
              </div>
            </div>
          </div>

          {result.missingTypes.length > 0 && (
            <div className="tb-v2-tool-output-head">
              <span className="tb-v2-tool-label">Recommendations</span>
            </div>
          )}
          {result.missingTypes.length > 0 && (
            <div className="tb-v2-tool-output-body">
              <p className="tb-v2-hint" style={{ color: '#e74c3c' }}>
                Missing: {result.missingTypes.join(', ')}
              </p>
            </div>
          )}

          <div style={{ marginTop: '0.75rem' }}>
            <button
              type="button"
              onClick={() => copyToClipboard(JSON.stringify(result, null, 2))}
              className="tb-v2-btn tb-v2-btn-secondary"
            >
              Copy Analysis as JSON
            </button>
          </div>
        </>
      )}

      {!result && (
        <div className="tb-v2-tool-output-body">
          <p className="tb-v2-hint">Enter text to analyze character variety and composition</p>
        </div>
      )}
    </div>
  );
}
