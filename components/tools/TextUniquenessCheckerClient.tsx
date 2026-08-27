'use client';

import { useState } from 'react';

const EXAMPLE = `Our product helps teams ship faster and build better software. Many companies trust our platform every day.

Our product helps teams ship faster and build better software. We continue to improve the experience each week.

Clear writing helps readers finish your article quickly. Clear writing helps readers finish your article when you revise carefully.`;

interface DuplicateGroup {
  phrase: string;
  count: number;
  occurrences: number[];
}

function findDuplications(text: string): DuplicateGroup[] {
  const results: DuplicateGroup[] = [];
  
  // Check for repeated phrases (5+ words)
  const phrases = text.split(/\s+/);
  const phraseCount = new Map<string, { count: number; indices: number[] }>();
  
  for (let len = 5; len <= 10; len++) {
    phraseCount.clear();
    
    for (let i = 0; i <= phrases.length - len; i++) {
      const phrase = phrases.slice(i, i + len).join(' ').toLowerCase();
      const existing = phraseCount.get(phrase);
      
      if (existing) {
        existing.count++;
        existing.indices.push(i);
      } else {
        phraseCount.set(phrase, { count: 1, indices: [i] });
      }
    }
    
    // Find duplicates for this phrase length
    for (const [phrase, data] of phraseCount.entries()) {
      if (data.count > 1 && phrase.length > 20) {
        results.push({
          phrase: phrases.slice(data.indices[0], data.indices[0] + len).join(' '),
          count: data.count,
          occurrences: data.indices
        });
      }
    }
  }
  
  // Sort by count descending
  return results.sort((a, b) => b.count - a.count).slice(0, 10);
}

function findSimilarSentences(text: string): string[] {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
  const similar: string[] = [];
  
  for (let i = 0; i < sentences.length; i++) {
    const words1 = new Set(sentences[i].toLowerCase().match(/\b[a-z]+\b/g) || []);
    
    for (let j = i + 1; j < sentences.length; j++) {
      const words2 = new Set(sentences[j].toLowerCase().match(/\b[a-z]+\b/g) || []);
      
      // Calculate Jaccard similarity
      const intersection = new Set([...words1].filter(x => words2.has(x)));
      const union = new Set([...words1, ...words2]);
      const similarity = union.size > 0 ? intersection.size / union.size : 0;
      
      if (similarity > 0.7) {
        similar.push(`"${sentences[i].trim().slice(0, 50)}..." ≈ "${sentences[j].trim().slice(0, 50)}..."`);
      }
    }
  }
  
  return similar.slice(0, 5);
}

export default function TextUniquenessCheckerClient() {
  const [text, setText] = useState('');

  const duplicates = findDuplications(text);
  const similarSentences = findSimilarSentences(text);
  const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
  const uniqueWordCount = new Set(text.toLowerCase().match(/\b[a-z]+\b/g) || []).size;
  const uniquenessRatio = wordCount > 0 ? ((uniqueWordCount / wordCount) * 100).toFixed(1) : '100';

  const clear = () => {
    setText('');
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Text to Check</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" onClick={() => setText(EXAMPLE)} className="tb-v2-btn-sm">
            Load Example
          </button>
          {text && (
            <button type="button" onClick={clear} className="tb-v2-btn-sm">
              Clear
            </button>
          )}
        </div>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste text to check for duplicated phrases and content..."
        className="tb-v2-tool-textarea"
        style={{ minHeight: 150 }}
        aria-label="Text input for uniqueness checking"
      />

      {text.length > 0 && (
        <>
          <div className="tb-v2-tool-output-head" style={{ marginTop: 16 }}>
            <span className="tb-v2-tool-label">Uniqueness Analysis</span>
          </div>
          <div className="tb-v2-tool-output-body" style={{ marginTop: 8 }}>
            <div style={{ 
              padding: 16, 
              background: 'var(--tb-bg-secondary)', 
              borderRadius: 8,
              textAlign: 'center',
              marginBottom: 16
            }}>
              <div style={{ fontSize: 11, color: 'var(--tb-text-secondary)', marginBottom: 4 }}>
                Text Uniqueness
              </div>
              <div style={{ 
                fontSize: 32, 
                fontWeight: 700, 
                color: parseFloat(uniquenessRatio) > 70 ? '#22c55e' : parseFloat(uniquenessRatio) > 40 ? '#eab308' : '#ef4444'
              }}>
                {uniquenessRatio}%
              </div>
              <div style={{ fontSize: 11, color: 'var(--tb-text-secondary)', marginTop: 4 }}>
                {uniqueWordCount} unique words out of {wordCount} total
              </div>
            </div>

            {duplicates.length > 0 && (
              <>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, color: '#f59e0b' }}>
                  Repeated Phrases
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                  {duplicates.map((dup, i) => (
                    <div key={i} style={{ 
                      padding: 10, 
                      background: 'var(--tb-bg-primary)', 
                      borderRadius: 6,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{ fontSize: 12, color: '#f59e0b' }}>×{dup.count}</span>
                      <span style={{ fontSize: 12 }}>"{dup.phrase.slice(0, 40)}..."</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {similarSentences.length > 0 && (
              <>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, color: '#8b5cf6' }}>
                  Similar Sentences
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {similarSentences.map((sim, i) => (
                    <div key={i} style={{ 
                      padding: 10, 
                      background: 'var(--tb-bg-primary)', 
                      borderRadius: 6,
                      fontSize: 11,
                      color: 'var(--tb-text-secondary)'
                    }}>
                      {sim}
                    </div>
                  ))}
                </div>
              </>
            )}

            {duplicates.length === 0 && similarSentences.length === 0 && (
              <div style={{ padding: 16, background: 'var(--tb-bg-secondary)', borderRadius: 8, textAlign: 'center' }}>
                <span style={{ color: '#22c55e', fontWeight: 500 }}>✓ No significant duplication detected</span>
              </div>
            )}
          </div>
        </>
      )}

      {text.length === 0 && (
        <div className="tb-v2-tool-output-body" style={{ marginTop: 8 }}>
          <span style={{ color: 'var(--tb-text-secondary)' }}>Enter text to check uniqueness</span>
        </div>
      )}
    </div>
  );
}
