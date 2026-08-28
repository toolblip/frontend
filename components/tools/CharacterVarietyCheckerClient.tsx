'use client';

import { useState, useMemo } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const EXAMPLE = 'P@ssw0rd 2026!';

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
      totalChars,
    };
  }, [text]);

  const scoreStatus =
    !result
      ? ''
      : result.varietyScore >= 80
        ? 'tb-v2-status-ok'
        : result.varietyScore >= 40
          ? 'tb-v2-status-warn'
          : 'tb-v2-status-err';

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Enter your text</span>
        <ToolExampleClearActions
          onExample={() => {
            setText(EXAMPLE);
            setCopied(false);
          }}
          onClear={() => {
            setText('');
            setCopied(false);
          }}
          canClear={text.length > 0}
        />
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter your text, password, or string to analyze..."
        className="tb-v2-tool-textarea"
        rows={4}
        aria-label="Text input"
      />

      {!result ? (
        <div className="tb-v2-tool-output-body">
          <div className="tb-v2-empty">
            Paste text or load the example to score character variety (upper, lower, digits, specials).
          </div>
        </div>
      ) : (
        <>
          <div className="tb-v2-stats-grid">
            <div className="tb-v2-stat-pill">
              <span className="tb-v2-stat-pill-val">{result.varietyScore}</span>
              <span className="tb-v2-stat-pill-lbl">Score / 100</span>
            </div>
            <div className="tb-v2-stat-pill">
              <span className="tb-v2-stat-pill-val">{result.totalChars}</span>
              <span className="tb-v2-stat-pill-lbl">Total chars</span>
            </div>
            <div className="tb-v2-stat-pill">
              <span className="tb-v2-stat-pill-val">{result.uniqueChars}</span>
              <span className="tb-v2-stat-pill-lbl">Unique chars</span>
            </div>
            <div className="tb-v2-stat-pill">
              <span className="tb-v2-stat-pill-val">
                <span className={`tb-v2-status ${scoreStatus}`}>{result.varietyLabel}</span>
              </span>
              <span className="tb-v2-stat-pill-lbl">Label</span>
            </div>
          </div>

          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Character Types</span>
            <button
              type="button"
              onClick={() => copyToClipboard(JSON.stringify(result, null, 2))}
              className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}
            >
              {copied ? 'Copied' : 'Copy JSON'}
            </button>
          </div>
          <div className="tb-v2-tool-output-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13.5 }}>
              {(
                [
                  ['Uppercase letters (A-Z)', result.hasUppercase],
                  ['Lowercase letters (a-z)', result.hasLowercase],
                  ['Digits (0-9)', result.hasDigits],
                  ['Special characters', result.hasSpecial],
                  ['Whitespace', result.hasSpaces],
                  ['Letters (alphabetic)', result.hasLetters],
                ] as const
              ).map(([label, ok]) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className={`tb-v2-status ${ok ? 'tb-v2-status-ok' : 'tb-v2-status-err'}`}>
                    {ok ? 'Yes' : 'No'}
                  </span>
                  <span>{label}</span>
                </div>
              ))}
            </div>

            {result.missingTypes.length > 0 && (
              <div className="tb-v2-banner tb-v2-banner-err" style={{ marginTop: 14 }}>
                Missing: {result.missingTypes.join(', ')}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
