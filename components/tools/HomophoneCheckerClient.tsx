'use client';

import { useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const EXAMPLE =
  "Your going to loose the game if you past the ball to their team. Its raining whether we stay or go.";

interface HomophoneGroup {
  words: string[];
  description: string;
}

const HOMOPHONE_GROUPS: HomophoneGroup[] = [
  { words: ['there', 'their', "they're"], description: 'there (place), their (possessive), they\'re (they are)' },
  { words: ['your', "you're"], description: 'your (possessive), you\'re (you are)' },
  { words: ['its', "it's"], description: 'its (possessive), it\'s (it is/it has)' },
  { words: ['to', 'too', 'two'], description: 'to (preposition), too (also/excessive), two (number)' },
  { words: ['than', 'then'], description: 'than (comparison), then (time)' },
  { words: ['affect', 'effect'], description: 'affect (verb), effect (noun)' },
  { words: ['accept', 'except'], description: 'accept (to take), except (excluding)' },
  { words: ['weather', 'whether'], description: 'weather (climate), whether (if)' },
  { words: ['passed', 'past'], description: 'passed (went by), past (time before)' },
  { words: ['loose', 'lose'], description: 'loose (not tight), lose (to misplace)' },
  { words: ['quiet', 'quite'], description: 'quiet (silent), quite (very)' },
  { words: ['principal', 'principle'], description: 'principal (main/administrator), principle (rule)' },
  { words: ['advice', 'advise'], description: 'advice (noun - recommendation), advise (verb - to recommend)' },
  { words: ['cite', 'site', 'sight'], description: 'cite (quote), site (place), sight (vision)' },
  { words: ['fair', 'fare'], description: 'fair (just/集市), fare (ticket price)' },
];

interface Issue {
  word: string;
  group: HomophoneGroup;
  suggestion: string;
  context: string;
  index: number;
}

function checkHomophones(text: string): Issue[] {
  const issues: Issue[] = [];
  const lowerText = text.toLowerCase();
  
  for (const group of HOMOPHONE_GROUPS) {
    const otherWords = group.words.filter(w => w.toLowerCase() !== w);
    
    for (const word of group.words) {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      let match;
      
      while ((match = regex.exec(text)) !== null) {
        const matchedWord = text.slice(match.index, match.index + word.length);
        const beforeContext = text.slice(Math.max(0, match.index - 20), match.index);
        const afterContext = text.slice(match.index + word.length, Math.min(text.length, match.index + word.length + 20));
        
        // Check if this might be used incorrectly
        // Suggest the most common alternative based on context patterns
        let suggestion = '';
        
        if (group.words.includes('there') && word.toLowerCase() === 'there') {
          if (lowerText[match.index - 1] === "'") continue; // Skip contractions like they're
          suggestion = 'their';
        } else if (group.words.includes('their') && word.toLowerCase() === 'their') {
          if (lowerText[match.index - 1] === "'") continue;
          suggestion = 'there';
        } else if (group.words.includes('your') && word.toLowerCase() === 'your') {
          if (lowerText[match.index - 1] === "'") continue;
          suggestion = "you're";
        } else if (group.words.includes("you're") && matchedWord.toLowerCase() === "you're") {
          suggestion = 'your';
        } else if (group.words.includes('its') && word.toLowerCase() === 'its') {
          if (lowerText[match.index - 1] === "'") continue;
          suggestion = "it's";
        } else if (group.words.includes("it's") && matchedWord.toLowerCase() === "it's") {
          suggestion = 'its';
        } else if (group.words.includes('to') && word.toLowerCase() === 'to') {
          suggestion = 'too';
        } else if (group.words.includes('too') && word.toLowerCase() === 'too') {
          suggestion = 'to';
        } else if (group.words.includes('than') && word.toLowerCase() === 'than') {
          suggestion = 'then';
        } else if (group.words.includes('then') && word.toLowerCase() === 'then') {
          suggestion = 'than';
        } else if (group.words.includes('loose') && word.toLowerCase() === 'loose') {
          suggestion = 'lose';
        } else if (group.words.includes('lose') && word.toLowerCase() === 'lose') {
          suggestion = 'loose';
        } else if (group.words.includes('quiet') && word.toLowerCase() === 'quiet') {
          suggestion = 'quite';
        } else if (group.words.includes('quite') && word.toLowerCase() === 'quite') {
          suggestion = 'quiet';
        } else if (group.words.includes('passed') && word.toLowerCase() === 'passed') {
          suggestion = 'past';
        } else if (group.words.includes('past') && word.toLowerCase() === 'past') {
          suggestion = 'passed';
        }
        
        if (suggestion) {
          issues.push({
            word: matchedWord,
            group,
            suggestion,
            context: `...${beforeContext}${matchedWord}${afterContext}...`,
            index: match.index
          });
        }
      }
    }
  }
  
  return issues.sort((a, b) => a.index - b.index);
}

export default function HomophoneCheckerClient() {
  const [text, setText] = useState('');
  const [issues, setIssues] = useState<Issue[]>([]);

  const analyze = () => {
    setIssues(checkHomophones(text));
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Text to Check</span>
        <ToolExampleClearActions
          onExample={() => {
            setText(EXAMPLE);
            setIssues([]);
          }}
          onClear={() => {
            setText('');
            setIssues([]);
          }}
          canClear={text.length > 0}
        />
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste text to check for common homophone errors (there/their/they're, your/you're, its/it's, etc.)..."
        className="tb-v2-tool-textarea"
        style={{ minHeight: 150 }}
        aria-label="Text input for homophone checking"
      />

      <div style={{ display: 'flex', gap: 8, marginTop: 12, padding: '0 20px' }}>
        <button type="button" onClick={analyze} className="tb-v2-btn tb-v2-btn-primary">Check</button>
      </div>

      {issues.length > 0 && (
        <>
          <div className="tb-v2-tool-output-head" style={{ marginTop: 16 }}>
            <span className="tb-v2-tool-label">Found Issues ({issues.length})</span>
          </div>
          <div className="tb-v2-tool-output-body" style={{ marginTop: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {issues.map((issue, i) => (
                <div key={i} style={{ 
                  padding: 12, 
                  background: 'var(--tb-bg-secondary)', 
                  borderRadius: 6 
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ 
                      fontSize: 13, 
                      fontWeight: 600, 
                      color: '#ef4444',
                      textDecoration: 'underline'
                    }}>
                      {issue.word}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--tb-text-secondary)' }}>→</span>
                    <span style={{ 
                      fontSize: 13, 
                      fontWeight: 600, 
                      color: '#22c55e'
                    }}>
                      {issue.suggestion}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--tb-text-secondary)' }}>
                    {issue.group.description}
                  </div>
                  <div style={{ 
                    fontSize: 11, 
                    color: 'var(--tb-text-secondary)',
                    marginTop: 6,
                    padding: 6,
                    background: 'var(--tb-bg-primary)',
                    borderRadius: 4,
                    fontFamily: 'monospace'
                  }}>
                    {issue.context}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {issues.length === 0 && text.length > 20 && (
        <>
          <div className="tb-v2-tool-output-head" style={{ marginTop: 16 }}>
            <span className="tb-v2-tool-label">Result</span>
          </div>
          <div className="tb-v2-tool-output-body" style={{ marginTop: 8 }}>
            <div style={{ padding: 16, background: 'var(--tb-bg-secondary)', borderRadius: 8, textAlign: 'center' }}>
              <span style={{ color: '#22c55e', fontWeight: 500 }}>✓ No common homophone errors detected</span>
            </div>
          </div>
        </>
      )}

      {text.length <= 20 && text.length > 0 && (
        <div className="tb-v2-tool-output-body" style={{ marginTop: 8 }}>
          <span style={{ color: 'var(--tb-text-secondary)' }}>Enter more text to check</span>
        </div>
      )}
    </div>
  );
}
