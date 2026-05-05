'use client';

import { useState, useMemo } from 'react';

export default function AiDetectorClient() {
  const [text, setText] = useState('');

  const analysis = useMemo(() => {
    if (!text.trim()) return null;

    const words = text.trim().split(/\s+/);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);

    // AI indicator phrases
    const aiPhrases = [
      'furthermore', 'moreover', 'additionally', 'consequently', 'thus',
      'hence', 'therefore', 'additionally', 'in conclusion', 'in summary',
      'it is worth noting', 'it is important to', 'it should be noted',
      'as such', 'in this regard', 'with this in mind', 'on the other hand',
      'it is clear that', 'it is evident that', 'demonstrates', 'indicates',
      'suggests that', 'reveals', 'illustrates', 'highlights'
    ];
    const textLower = text.toLowerCase();
    const phraseCount = aiPhrases.filter(phrase => textLower.includes(phrase)).length;

    // Sentence uniformity analysis
    const sentenceLengths = sentences.map(s => s.trim().split(/\s+/).length);
    const avgSentenceLength = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
    const variance = sentenceLengths.reduce((sum, len) => sum + Math.pow(len - avgSentenceLength, 2), 0) / sentenceLengths.length;
    const stdDev = Math.sqrt(variance);
    const uniformityScore = Math.max(0, 100 - (stdDev * 5));

    // Word entropy pattern (simulated by checking character diversity)
    const allChars = textLower.replace(/\s+/g, '');
    const charCounts: Record<string, number> = {};
    for (const char of allChars) {
      charCounts[char] = (charCounts[char] || 0) + 1;
    }
    const charFreqs = Object.values(charCounts).map(c => c / allChars.length);
    const entropy = -charFreqs.reduce((sum, f) => sum + (f > 0 ? f * Math.log2(f) : 0), 0);
    const maxEntropy = Math.log2(26);
    const entropyScore = (entropy / maxEntropy) * 100;

    // Repetition analysis
    const wordFreqs: Record<string, number> = {};
    for (const word of words) {
      wordFreqs[word.toLowerCase()] = (wordFreqs[word.toLowerCase()] || 0) + 1;
    }
    const repeatedWords = Object.entries(wordFreqs).filter(([_, count]) => count > 3).length;

    // Calculate overall AI probability
    const phraseScore = Math.min(phraseCount * 8, 40);
    const uniformityPenalty = uniformityScore > 85 ? 20 : 0;
    const lowEntropyPenalty = entropyScore < 60 ? 15 : 0;
    const aiProbability = Math.min(phraseScore + uniformityPenalty + lowEntropyPenalty, 95);

    return {
      wordCount: words.length,
      sentenceCount: sentences.length,
      paragraphCount: paragraphs.length,
      avgSentenceLength: avgSentenceLength.toFixed(1),
      phraseCount,
      uniformityScore: uniformityScore.toFixed(1),
      entropyScore: entropyScore.toFixed(1),
      repeatedWords,
      aiProbability: aiProbability.toFixed(0)
    };
  }, [text]);

  return (
    <div className="tb-v2-flex tb-v2-flex-col tb-v2-gap-4 tb-v2-p-4">
      <h2 className="tb-v2-text-2xl tb-v2-font-bold">AI Text Detector</h2>
      <p className="tb-v2-text-sm tb-v2-text-gray-500">Analyze text for AI-generation indicators</p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste text to analyze..."
        className="tb-v2-textarea tb-v2-min-h-[200px]"
      />

      {analysis && (
        <div className="tb-v2-flex tb-v2-flex-col tb-v2-gap-4">
          <div className="tb-v2-grid tb-v2-grid-cols-2 tb-v2-gap-4">
            <div className="tb-v2-card">
              <p className="tb-v2-text-sm tb-v2-text-gray-500">AI Probability</p>
              <p className={`tb-v2-text-3xl tb-v2-font-bold ${
                Number(analysis.aiProbability) > 70 ? 'tb-v2-text-red-500' :
                Number(analysis.aiProbability) > 40 ? 'tb-v2-text-yellow-500' :
                'tb-v2-text-green-500'
              }`}>
                {analysis.aiProbability}%
              </p>
            </div>
            <div className="tb-v2-card">
              <p className="tb-v2-text-sm tb-v2-text-gray-500">AI Indicator Phrases</p>
              <p className="tb-v2-text-3xl tb-v2-font-bold tb-v2-text-orange-500">{analysis.phraseCount}</p>
            </div>
          </div>

          <div className="tb-v2-card">
            <h3 className="tb-v2-text-lg tb-v2-font-semibold tb-v2-mb-3">Text Statistics</h3>
            <div className="tb-v2-grid tb-v2-grid-cols-2 tb-v2-gap-2 tb-v2-text-sm">
              <div>Words: <span className="tb-v2-font-medium">{analysis.wordCount}</span></div>
              <div>Sentences: <span className="tb-v2-font-medium">{analysis.sentenceCount}</span></div>
              <div>Paragraphs: <span className="tb-v2-font-medium">{analysis.paragraphCount}</span></div>
              <div>Avg Sentence Length: <span className="tb-v2-font-medium">{analysis.avgSentenceLength} words</span></div>
            </div>
          </div>

          <div className="tb-v2-card">
            <h3 className="tb-v2-text-lg tb-v2-font-semibold tb-v2-mb-3">Pattern Analysis</h3>
            <div className="tb-v2-grid tb-v2-grid-cols-2 tb-v2-gap-2 tb-v2-text-sm">
              <div>Sentence Uniformity: <span className="tb-v2-font-medium">{analysis.uniformityScore}%</span></div>
              <div>Character Entropy: <span className="tb-v2-font-medium">{analysis.entropyScore}%</span></div>
              <div>Repeated Words (3+): <span className="tb-v2-font-medium">{analysis.repeatedWords}</span></div>
            </div>
          </div>

          <div className="tb-v2-card tb-v2-bg-gray-50">
            <h3 className="tb-v2-text-lg tb-v2-font-semibold tb-v2-mb-2">Interpretation</h3>
            <p className="tb-v2-text-sm">
              {Number(analysis.aiProbability) > 70 && 
                'This text shows strong indicators of AI generation. High uniformity and common AI phrases detected.'}
              {Number(analysis.aiProbability) > 40 && Number(analysis.aiProbability) <= 70 &&
                'This text shows moderate indicators. Some patterns may be AI-like but could also occur naturally.'}
              {Number(analysis.aiProbability) <= 40 &&
                'This text appears to have human writing patterns with natural variation and low repetition.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
