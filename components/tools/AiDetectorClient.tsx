'use client';

import { useState } from 'react';

export default function AiDetectorClient() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<{ score: number; label: string; details: string } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeText = async () => {
    if (!text.trim()) return;

    setIsAnalyzing(true);

    // Simulate AI detection analysis
    // In production, this would call an actual AI detection API
    await new Promise(resolve => setTimeout(resolve, 800));

    const words = text.trim().split(/\s+/);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    const avgWordLength = words.reduce((sum, w) => sum + w.length, 0) / words.length;
    const avgSentenceLength = words.length / Math.max(sentences.length, 1);

    // Heuristics for AI detection
    let aiScore = 0;

    // Very uniform word length suggests AI
    if (avgWordLength > 4 && avgWordLength < 6) aiScore += 15;

    // Very uniform sentence length
    if (avgSentenceLength > 12 && avgSentenceLength < 20) aiScore += 20;

    // Lack of contractions
    if (!text.includes("'") && text.length > 200) aiScore += 10;

    // Very formal language patterns
    const formalPatterns = ['furthermore', 'moreover', 'nevertheless', 'consequently', 'subsequently', 'additionally'];
    const hasFormal = formalPatterns.some(p => text.toLowerCase().includes(p));
    if (hasFormal) aiScore += 15;

    // Lack of personal experience/voice
    const personalPatterns = ['i think', 'in my experience', 'personally', 'i believe', 'i feel'];
    const hasPersonal = personalPatterns.some(p => text.toLowerCase().includes(p));
    if (!hasPersonal && text.length > 300) aiScore += 15;

    // Perfect punctuation spacing
    if (text.includes('  ') && !text.includes('\n')) aiScore += 5;

    // Too many transitions
    const transitions = ['however', 'therefore', 'thus', 'hence', 'accordingly'];
    const transitionCount = transitions.reduce((count, t) => {
      const regex = new RegExp(`\\b${t}\\b`, 'gi');
      return count + (text.match(regex)?.length || 0);
    }, 0);
    if (transitionCount > 3) aiScore += 10;

    // Normalize score
    aiScore = Math.min(100, Math.max(0, aiScore + Math.random() * 10));

    let label: string;
    let details: string;

    if (aiScore < 30) {
      label = 'Likely Human';
      details = 'The text shows natural variation and human-like patterns.';
    } else if (aiScore < 60) {
      label = 'Possibly AI-Assisted';
      details = 'The text shows some patterns that could indicate AI assistance.';
    } else if (aiScore < 80) {
      label = 'Likely AI-Generated';
      details = 'The text shows strong indicators of AI generation.';
    } else {
      label = 'Almost Certainly AI';
      details = 'This text shows very strong patterns typical of AI-generated content.';
    }

    setResult({ score: Math.round(aiScore), label, details });
    setIsAnalyzing(false);
  };

  const handleClear = () => {
    setText('');
    setResult(null);
  };

  const copyResult = () => {
    if (result) {
      navigator.clipboard.writeText(`AI Detection: ${result.label} (${result.score}%)\n${result.details}`);
    }
  };

  return (
    <div className="tb-v2-flex tb-v2-flex-col tb-v2-gap-4 tb-v2-p-4">
      <h2 className="tb-v2-text-2xl tb-v2-font-bold">AI Detector</h2>
      <p className="tb-v2-text-sm tb-v2-text-gray-500">Detect if text was likely written by AI</p>

      {/* Input */}
      <div className="tb-v2-card">
        <div className="tb-v2-flex tb-v2-justify-between tb-v2-items-center tb-v2-mb-2">
          <label className="tb-v2-label tb-v2-mb-0">Text to Analyze</label>
          <button onClick={handleClear} className="tb-v2-btn tb-v2-btn-secondary tb-v2-text-sm">
            Clear
          </button>
        </div>
        <textarea
          value={text}
          onChange={(e) => { setText(e.target.value); setResult(null); }}
          placeholder="Paste or type text to analyze for AI patterns..."
          className="tb-v2-input tb-v2-min-h-[150px]"
          rows={6}
        />
        <p className="tb-v2-text-xs tb-v2-text-gray-400 tb-v2-mt-1">
          {text.length} characters | {text.trim().split(/\s+/).filter(Boolean).length} words
        </p>
      </div>

      {/* Actions */}
      <button
        onClick={analyzeText}
        disabled={!text.trim() || isAnalyzing}
        className="tb-v2-btn tb-v2-btn-primary"
      >
        {isAnalyzing ? '🔄 Analyzing...' : '🔍 Analyze Text'}
      </button>

      {/* Result */}
      {result && (
        <div className="tb-v2-card">
          <div className="tb-v2-flex tb-v2-justify-between tb-v2-items-center tb-v2-mb-4">
            <label className="tb-v2-label tb-v2-mb-0">Detection Result</label>
            <button onClick={copyResult} className="tb-v2-btn tb-v2-btn-secondary tb-v2-text-sm">
              📋 Copy
            </button>
          </div>

          <div className="tb-v2-text-center tb-v2-mb-4">
            <div className="tb-v2-inline-block tb-v2-relative tb-v2-w-[120px] tb-v2-h-[120px]">
              <svg className="tb-v2-w-full tb-v2-h-full tb-v2-transform tb-v2-rotate-[-90deg]" viewBox="0 0 36 36">
                <path
                  className="tb-v2-fill-none tb-v2-stroke-gray-200 tb-v2-stroke-width-3"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={`tb-v2-fill-none tb-v2-stroke-width-3 tb-v2-stroke-linecap-round ${
                    result.score < 30 ? 'tb-v2-stroke-green-500' :
                    result.score < 60 ? 'tb-v2-stroke-yellow-500' :
                    result.score < 80 ? 'tb-v2-stroke-orange-500' :
                    'tb-v2-stroke-red-500'
                  }`}
                  strokeDasharray={`${result.score}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="tb-v2-absolute tb-v2-inset-0 tb-v2-flex tb-v2-flex-col tb-v2-items-center tb-v2-justify-center">
                <span className="tb-v2-text-2xl tb-v2-font-bold">{result.score}%</span>
              </div>
            </div>
          </div>

          <div className={`tb-v2-text-center tb-v2-p-3 tb-v2-rounded-lg tb-v2-mb-2 ${
            result.score < 30 ? 'tb-v2-bg-green-100 tb-v2-text-green-800' :
            result.score < 60 ? 'tb-v2-bg-yellow-100 tb-v2-text-yellow-800' :
            result.score < 80 ? 'tb-v2-bg-orange-100 tb-v2-text-orange-800' :
            'tb-v2-bg-red-100 tb-v2-text-red-800'
          }`}>
            <span className="tb-v2-font-semibold">{result.label}</span>
          </div>

          <p className="tb-v2-text-sm tb-v2-text-gray-600 tb-v2-text-center">
            {result.details}
          </p>
        </div>
      )}

      {/* Tips */}
      <div className="tb-v2-card tb-v2-bg-gray-50">
        <h3 className="tb-v2-text-lg tb-v2-font-semibold tb-v2-mb-2">Detection Factors</h3>
        <ul className="tb-v2-text-sm tb-v2-space-y-1 tb-v2-text-gray-600">
          <li>• Word and sentence length patterns</li>
          <li>• Use of formal transitions and language</li>
          <li>• Personal voice and experience indicators</li>
          <li>• Natural language variation</li>
        </ul>
      </div>
    </div>
  );
}
