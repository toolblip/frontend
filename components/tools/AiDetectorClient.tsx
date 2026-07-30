'use client';

import { useState } from 'react';

const EXAMPLE_TEXT = `Furthermore, it is important to note that effective time management is essential for productivity. Moreover, individuals who prioritize their tasks tend to achieve better outcomes. Consequently, one must consider various strategies to optimize workflow. Additionally, the implementation of structured routines can significantly enhance overall efficiency.`;

export default function AiDetectorClient() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<{ score: number; label: string; details: string } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);

  const analyzeText = async () => {
    if (!text.trim()) return;

    setIsAnalyzing(true);

    // Simulate AI detection analysis
    // In production, this would call an actual AI detection API
    await new Promise(resolve => setTimeout(resolve, 600));

    const words = text.trim().split(/\s+/);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    const avgWordLength = words.reduce((sum, w) => sum + w.length, 0) / words.length;
    const avgSentenceLength = words.length / Math.max(sentences.length, 1);

    let aiScore = 0;

    if (avgWordLength > 4 && avgWordLength < 6) aiScore += 15;
    if (avgSentenceLength > 12 && avgSentenceLength < 20) aiScore += 20;
    if (!text.includes("'") && text.length > 200) aiScore += 10;

    const formalPatterns = ['furthermore', 'moreover', 'nevertheless', 'consequently', 'subsequently', 'additionally'];
    const hasFormal = formalPatterns.some(p => text.toLowerCase().includes(p));
    if (hasFormal) aiScore += 15;

    const personalPatterns = ['i think', 'in my experience', 'personally', 'i believe', 'i feel'];
    const hasPersonal = personalPatterns.some(p => text.toLowerCase().includes(p));
    if (!hasPersonal && text.length > 300) aiScore += 15;

    if (text.includes('  ') && !text.includes('\n')) aiScore += 5;

    const transitions = ['however', 'therefore', 'thus', 'hence', 'accordingly'];
    const transitionCount = transitions.reduce((count, t) => {
      const regex = new RegExp(`\\b${t}\\b`, 'gi');
      return count + (text.match(regex)?.length || 0);
    }, 0);
    if (transitionCount > 3) aiScore += 10;

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

  const loadExample = () => {
    setText(EXAMPLE_TEXT);
    setResult(null);
  };

  const handleClear = () => {
    setText('');
    setResult(null);
  };

  const copyResult = () => {
    if (!result) return;
    navigator.clipboard.writeText(`AI Detection: ${result.label} (${result.score}%)\n${result.details}`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const scoreColor =
    !result ? '' :
    result.score < 30 ? 'var(--green, #16a34a)' :
    result.score < 60 ? 'var(--yellow, #ca8a04)' :
    result.score < 80 ? 'var(--orange, #ea580c)' :
    'var(--red, #dc2626)';

  return (
    <div className="flex flex-col gap-4">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Text to Analyze</span>
        <div className="flex gap-2">
          <button type="button" onClick={loadExample} className="tb-v2-btn-sm">
            Load Example
          </button>
          {(text || result) && (
            <button type="button" onClick={handleClear} className="tb-v2-btn-sm">
              Clear
            </button>
          )}
        </div>
      </div>

      <textarea
        value={text}
        onChange={(e) => { setText(e.target.value); setResult(null); }}
        placeholder="Paste or type text to analyze for AI-generated patterns..."
        className="tb-v2-tool-textarea"
        rows={8}
      />
      <p className="text-xs text-gray-400">
        {text.length} characters · {text.trim() ? text.trim().split(/\s+/).length : 0} words
      </p>

      <button
        type="button"
        onClick={analyzeText}
        disabled={!text.trim() || isAnalyzing}
        className="tb-v2-btn tb-v2-btn-primary"
      >
        {isAnalyzing ? 'Analyzing...' : 'Analyze Text'}
      </button>

      {!result && !isAnalyzing && (
        <p className="tb-v2-empty">
          Paste text above to estimate how likely it is to be AI-generated, based on word variation, sentence rhythm, and formal transition words.
        </p>
      )}

      {result && (
        <div className="tb-v2-tool-output-body">
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Detection Result</span>
            <button type="button" onClick={copyResult} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          <div className="flex flex-col items-center gap-3 py-2">
            <div className="relative w-[120px] h-[120px]">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="fill-none stroke-gray-200 dark:stroke-gray-700"
                  strokeWidth="3"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  fill="none"
                  stroke={scoreColor}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${result.score}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold">{result.score}%</span>
              </div>
            </div>

            <div
              className="text-center px-3 py-1.5 rounded-lg font-semibold text-sm"
              style={{ background: `color-mix(in srgb, ${scoreColor} 16%, transparent)`, color: scoreColor }}
            >
              {result.label}
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm">
              {result.details}
            </p>
          </div>
        </div>
      )}

      <div className="tb-v2-tool-output-body">
        <span className="tb-v2-tool-label">Detection Factors</span>
        <ul className="text-sm text-gray-500 dark:text-gray-400 mt-2 space-y-1 list-disc list-inside">
          <li>Word and sentence length uniformity</li>
          <li>Use of formal transitions like "furthermore" or "consequently"</li>
          <li>Presence of personal voice and first-hand experience</li>
          <li>Natural variation versus repeated sentence rhythm</li>
        </ul>
      </div>
    </div>
  );
}
