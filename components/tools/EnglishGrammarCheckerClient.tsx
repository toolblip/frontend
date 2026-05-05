'use client';

import { useState } from 'react';

interface GrammarIssue {
  type: 'error' | 'warning' | 'info';
  category: string;
  message: string;
  suggestion?: string;
}

export default function EnglishGrammarCheckerClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<GrammarIssue[]>([]);

  const check = () => {
    if (!input.trim()) { setOutput([]); return; }
    const issues: GrammarIssue[] = [];
    const patterns: { pat: RegExp; type: 'error' | 'warning' | 'info'; cat: string; msg: string; sug?: string }[] = [
      { pat: /\b(their)\s+(?:is|are|was|were)\b/gi, type: 'error', cat: 'Subject-Verb Agreement', msg: 'Check subject-verb agreement with "their"', sug: undefined },
      { pat: /\b(its)\s+(?:is|are|was|were)\b/gi, type: 'error', cat: 'Possessive vs Contraction', msg: '"Its" shows possession, not a contraction of "it is"', sug: 'it\'s' },
      { pat: /\b(your)\s+(?:is|are|was|were)\b/gi, type: 'error', cat: 'Possessive vs Contraction', msg: '"Your" shows possession, not a contraction of "you are"', sug: 'you\'re' },
      { pat: /\b(could of|would of|should of|might of|must of|has of|had of)\b/gi, type: 'error', cat: 'Verb Forms', msg: 'Use "have" instead of "of" with modal verbs', sug: undefined },
      { pat: /\b(then)\s+(?:i|he|she|we|they|you)\b/gi, type: 'warning', cat: 'Common Confusions', msg: 'Did you mean "than" for comparison?', sug: 'than' },
      { pat: /\b(than)\s+(?:came|went|saw|had|did|said|knew|thought|found|got|made|took)\b/gi, type: 'warning', cat: 'Common Confusions', msg: 'Did you mean "then" for time/sequence?', sug: 'then' },
      { pat: /\b(alot)\b/gi, type: 'error', cat: 'Common Typos', msg: '"alot" is not a word. Did you mean "a lot"?', sug: 'a lot' },
      { pat: /\b(couldnt|couldn\'t|wouldnt|wouldn\'t|shouldnt|shouldn\'t|isnt|isn\'t|arent|aren\'t|wasnt|wasn\'t|werent|weren\'t|dont|don\'t|didnt|didn\'t|hasnt|hasn\'t|hadnt|hadn\'t|was|were)\b/gi, type: 'warning', cat: 'Contractions', msg: 'Check contraction usage', sug: undefined },
      { pat: /\b(i)\s+(?:am|is|are|was|were)\b/gi, type: 'error', cat: 'Capitalization', msg: '"I" should always be capitalized', sug: 'I' },
      { pat: /\s{2,}/g, type: 'info', cat: 'Spacing', msg: 'Multiple spaces detected', sug: 'single space' },
      { pat: /\b(etc)\s*\.\s*\./gi, type: 'info', cat: 'Punctuation', msg: '"Etc." already includes a period', sug: 'etc.' },
    ];

    for (const { pat, type, cat, msg, sug } of patterns) {
      if (pat.test(input)) {
        const matches = input.match(pat);
        if (matches) {
          issues.push({ type, category: cat, message: `${matches.length} occurrence(s): "${matches[0]}" — ${msg}`, suggestion: sug });
        }
      }
    }

    setOutput(issues);
  };

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Enter text to check for grammar issues..."
        rows={6}
        className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 text-sm font-mono focus:ring-2 focus:ring-red-500 outline-none resize-y"
      />
      <button
        onClick={check}
        className="w-full bg-red-600 hover:bg-red-500 text-white font-medium py-2.5 rounded-lg transition-colors text-sm"
      >
        Check Grammar
      </button>
      {output.length > 0 ? (
        <div className="space-y-2">
          {output.map((issue, i) => (
            <div key={i} className={`p-3 rounded-lg border text-sm ${
              issue.type === 'error' ? 'bg-red-50 border-red-200' :
              issue.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
              'bg-blue-50 border-blue-200'
            }`}>
              <div className="flex items-start gap-2">
                <span className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                  issue.type === 'error' ? 'bg-red-500' : issue.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                }`}></span>
                <div>
                  <span className="font-medium text-xs uppercase tracking-wide opacity-70">{issue.category}</span>
                  <p className="mt-1">{issue.message}</p>
                  {issue.suggestion && <p className="mt-1 text-xs opacity-70">Suggestion: {issue.suggestion}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : input && (
        <p className="text-center text-sm text-green-600 dark:text-green-400 py-4">No issues detected!</p>
      )}
    </div>
  );
}
