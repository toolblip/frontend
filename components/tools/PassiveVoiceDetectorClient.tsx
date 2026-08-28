'use client';

import React, { useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const EXAMPLE =
  'The quarterly report was written by the intern. Several errors were found during review and the deadline was missed.';

interface PassiveVoiceOccurrence {
  sentence: string;
  startIndex: number;
  endIndex: number;
  verbPhrase: string;
}

function detectPassiveVoice(text: string): PassiveVoiceOccurrence[] {
  const occurrences: PassiveVoiceOccurrence[] = [];
  
  // Common passive voice patterns
  const passivePatterns = [
    /\b(am|is|are|was|were|be|been|being)\s+(\w+ed|written|spoken|broken|chosen|driven|eaten|fallen|forgotten|given|gotten|hidden|ridden|risen|spoken|stolen|sworn|thrown|woken|worn|withdrawn)\b/gi,
    /\b(has|have|had)\s+been\s+(\w+ed|written|spoken|broken|chosen|driven|eaten|fallen|forgotten|given|gotten|hidden|ridden|risen|spoken|stolen|sworn|thrown|woken|worn|withdrawn)\b/gi,
    /\b(will|would|shall|should|may|might|must|can|could)\s+(be\s+)?(\w+ed|written|spoken|broken|chosen|driven|eaten|fallen|forgotten|given|gotten|hidden|ridden|risen|spoken|stolen|sworn|thrown|woken|worn|withdrawn)\b/gi,
  ];

  // More general passive detection: forms of "to be" + past participle
  const sentences = text.split(/(?<=[.!?])\s+/);
  let currentIndex = 0;

  for (const sentence of sentences) {
    const lowerSentence = sentence.toLowerCase();
    
    // Check for passive voice patterns
    for (const pattern of passivePatterns) {
      pattern.lastIndex = 0;
      let match;
      while ((match = pattern.exec(lowerSentence)) !== null) {
        const startIndex = currentIndex + match.index;
        const endIndex = startIndex + match[0].length;
        occurrences.push({
          sentence: sentence.trim(),
          startIndex,
          endIndex,
          verbPhrase: match[0]
        });
      }
    }
    
    currentIndex += sentence.length + 1;
  }

  // Sort by start index
  return occurrences.sort((a, b) => a.startIndex - b.startIndex);
}

function highlightPassiveVoice(text: string, occurrences: PassiveVoiceOccurrence[]): React.ReactElement[] {
  const result: React.ReactElement[] = [];
  let lastIndex = 0;

  for (const occurrence of occurrences) {
    // Add text before this occurrence
    if (occurrence.startIndex > lastIndex) {
      result.push(
        <span key={`text-${lastIndex}`}>
          {text.slice(lastIndex, occurrence.startIndex)}
        </span>
      );
    }

    // Add highlighted occurrence
    result.push(
      <span 
        key={`highlight-${occurrence.startIndex}`}
        style={{ 
          backgroundColor: '#fef08a', 
          color: '#a16207',
          padding: '1px 2px',
          borderRadius: 2,
          fontWeight: 500
        }}
        title={`Passive voice: "${occurrence.verbPhrase}"`}
      >
        {text.slice(occurrence.startIndex, occurrence.endIndex)}
      </span>
    );

    lastIndex = occurrence.endIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    result.push(
      <span key={`text-${lastIndex}`}>
        {text.slice(lastIndex)}
      </span>
    );
  }

  return result;
}

export default function PassiveVoiceDetectorClient() {
  const [text, setText] = useState('');
  const [showHighlight, setShowHighlight] = useState(true);

  const occurrences = detectPassiveVoice(text);

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Text to Analyze</span>
        <ToolExampleClearActions
          onExample={() => setText(EXAMPLE)}
          onClear={() => setText('')}
          canClear={text.length > 0}
        />
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste text to detect passive voice constructions..."
        className="tb-v2-tool-textarea"
        style={{ minHeight: 150 }}
        aria-label="Text input for passive voice detection"
      />

      <div style={{ display: 'flex', gap: 8, marginTop: 12, padding: '0 20px 12px' }}>
        <label style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 6,
          padding: '8px 16px',
          background: 'var(--tb-bg-secondary)',
          borderRadius: 6,
          cursor: 'pointer',
          fontSize: 13
        }}>
          <input 
            type="checkbox" 
            checked={showHighlight} 
            onChange={(e) => setShowHighlight(e.target.checked)}
            style={{ width: 14, height: 14 }}
          />
          Highlight
        </label>
      </div>

      {showHighlight && occurrences.length > 0 && text.length > 0 && (
        <div className="tb-v2-tool-output-head" style={{ marginTop: 16 }}>
          <span className="tb-v2-tool-label">Highlighted Text</span>
        </div>
      )}
      
      {showHighlight && occurrences.length > 0 && text.length > 0 && (
        <div className="tb-v2-tool-output-body" style={{ marginTop: 8 }}>
          <div style={{ 
            padding: 16, 
            background: 'var(--tb-bg-secondary)', 
            borderRadius: 8,
            lineHeight: 1.7,
            fontSize: 14
          }}>
            {highlightPassiveVoice(text, occurrences)}
          </div>
        </div>
      )}

      {occurrences.length > 0 && (
        <>
          <div className="tb-v2-tool-output-head" style={{ marginTop: 16 }}>
            <span className="tb-v2-tool-label">Passive Voice Occurrences ({occurrences.length})</span>
          </div>
          <div className="tb-v2-tool-output-body" style={{ marginTop: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {occurrences.map((occ, i) => (
                <div key={i} style={{ 
                  padding: 10, 
                  background: 'var(--tb-bg-secondary)', 
                  borderRadius: 6,
                  borderLeft: '3px solid #eab308'
                }}>
                  <div style={{ fontSize: 12, color: '#a16207', fontWeight: 500, marginBottom: 4 }}>
                    "{occ.verbPhrase}"
                  </div>
                  <div style={{ fontSize: 13 }}>
                    {occ.sentence}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {occurrences.length === 0 && text.length > 20 && (
        <>
          <div className="tb-v2-tool-output-head" style={{ marginTop: 16 }}>
            <span className="tb-v2-tool-label">Result</span>
          </div>
          <div className="tb-v2-tool-output-body" style={{ marginTop: 8 }}>
            <div style={{ padding: 16, background: 'var(--tb-bg-secondary)', borderRadius: 8, textAlign: 'center' }}>
              <span style={{ color: '#22c55e', fontWeight: 500 }}>✓ No passive voice detected</span>
            </div>
          </div>
        </>
      )}

      {text.length <= 20 && text.length > 0 && (
        <div className="tb-v2-tool-output-body" style={{ marginTop: 8 }}>
          <span style={{ color: 'var(--tb-text-secondary)' }}>Enter more text to analyze</span>
        </div>
      )}
    </div>
  );
}
