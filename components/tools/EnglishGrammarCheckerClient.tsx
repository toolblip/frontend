'use client';

import { useState } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

interface GrammarIssue {
  type: 'error' | 'warning' | 'info';
  category: string;
  message: string;
  suggestion?: string;
}

const EXAMPLE =
  "Its a nice day and I could of gone to the park, but their isnt enough time. Alot of people say than they prefer rain anyway.";

export default function EnglishGrammarCheckerClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<GrammarIssue[]>([]);
  const [checked, setChecked] = useState(false);

  const check = () => {
    setChecked(true);
    if (!input.trim()) {
      setOutput([]);
      return;
    }
    const issues: GrammarIssue[] = [];
    const patterns: { pat: RegExp; type: 'error' | 'warning' | 'info'; cat: string; msg: string; sug?: string }[] = [
      {
        pat: /\b(their)\s+(?:is|are|was|were)\b/gi,
        type: 'error',
        cat: 'Subject-Verb Agreement',
        msg: 'Check subject-verb agreement with "their"',
      },
      {
        pat: /\b(its)\s+(?:is|are|was|were)\b/gi,
        type: 'error',
        cat: 'Possessive vs Contraction',
        msg: '"Its" shows possession, not a contraction of "it is"',
        sug: "it's",
      },
      {
        pat: /\b(your)\s+(?:is|are|was|were)\b/gi,
        type: 'error',
        cat: 'Possessive vs Contraction',
        msg: '"Your" shows possession, not a contraction of "you are"',
        sug: "you're",
      },
      {
        pat: /\b(could of|would of|should of|might of|must of|has of|had of)\b/gi,
        type: 'error',
        cat: 'Verb Forms',
        msg: 'Use "have" instead of "of" with modal verbs',
      },
      {
        pat: /\b(then)\s+(?:i|he|she|we|they|you)\b/gi,
        type: 'warning',
        cat: 'Common Confusions',
        msg: 'Did you mean "than" for comparison?',
        sug: 'than',
      },
      {
        pat: /\b(than)\s+(?:came|went|saw|had|did|said|knew|thought|found|got|made|took)\b/gi,
        type: 'warning',
        cat: 'Common Confusions',
        msg: 'Did you mean "then" for time/sequence?',
        sug: 'then',
      },
      { pat: /\b(alot)\b/gi, type: 'error', cat: 'Common Typos', msg: '"alot" is not a word. Did you mean "a lot"?', sug: 'a lot' },
      { pat: /\s{2,}/g, type: 'info', cat: 'Spacing', msg: 'Multiple spaces detected', sug: 'single space' },
      { pat: /\b(etc)\s*\.\s*\./gi, type: 'info', cat: 'Punctuation', msg: '"Etc." already includes a period', sug: 'etc.' },
    ];

    for (const { pat, type, cat, msg, sug } of patterns) {
      if (pat.test(input)) {
        const matches = input.match(pat);
        if (matches) {
          issues.push({
            type,
            category: cat,
            message: `${matches.length} occurrence(s): "${matches[0]}"  -  ${msg}`,
            suggestion: sug,
          });
        }
      }
    }

    setOutput(issues);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Enter your text</span>
        <ToolExampleClearActions
          onExample={() => {
            setInput(EXAMPLE);
            setChecked(false);
            setOutput([]);
          }}
          onClear={() => {
            setInput('');
            setChecked(false);
            setOutput([]);
          }}
          canClear={input.length > 0}
        />
      </div>
      <textarea
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setChecked(false);
        }}
        placeholder="Enter text to check for grammar issues..."
        className="tb-v2-tool-textarea"
        style={{ minHeight: 140 }}
      />
      <div style={{ marginTop: 12 }}>
        <button type="button" onClick={check} className="tb-v2-btn tb-v2-btn-primary">
          Check Grammar
        </button>
      </div>
      {!checked ? (
        <div className="tb-v2-tool-output-body" style={{ marginTop: 12 }}>
          <span style={{ color: 'var(--tb-text-secondary)', fontSize: 14 }}>
            Enter some text and click Check Grammar to see suggestions.
          </span>
        </div>
      ) : output.length > 0 ? (
        <div className="tb-v2-tool-output-body" style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {output.map((issue, i) => (
            <div
              key={i}
              style={{
                padding: 12,
                borderRadius: 8,
                border: '1px solid var(--line)',
                background: 'var(--tb-bg-secondary)',
                fontSize: 13,
              }}
            >
              <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--tb-text-secondary)' }}>{issue.category}</div>
              <p style={{ margin: '6px 0 0' }}>{issue.message}</p>
              {issue.suggestion && (
                <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--tb-text-secondary)' }}>Suggestion: {issue.suggestion}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="tb-v2-tool-output-body" style={{ marginTop: 12 }}>
          <span style={{ color: 'var(--tb-text-secondary)', fontSize: 14 }}>No issues detected!</span>
        </div>
      )}
    </div>
  );
}
