'use client';

import { useState, useMemo } from 'react';

interface GrammarIssue {
  type: 'error' | 'warning' | 'suggestion';
  category: string;
  original: string;
  suggestion: string;
  explanation: string;
}

const grammarRules: Array<{
  pattern: RegExp;
  type: 'error' | 'warning' | 'suggestion';
  category: string;
  suggestion: string | ((match: string) => string);
  explanation: string;
}> = [
  {
    pattern: /\bi\b/g,
    type: 'error',
    category: 'Capitalization',
    suggestion: 'I',
    explanation: 'The pronoun "I" should always be capitalized.',
  },
  {
    pattern: /\b(its|its)\s+(?:a|an|eastern|western|northern|southern)\b/gi,
    type: 'error',
    category: 'Possessive',
    suggestion: "it's",
    explanation: "Use 'it's' (it is or it has) instead of 'its' when followed by a noun that describes.",
  },
  {
    pattern: /\b(their|there|theyre)\b(?!\s+(?:is|are|was|were|have|has|had|will|would|should|could|may|might|must))/gi,
    type: 'warning',
    category: 'Homophones',
    suggestion: 'their',
    explanation: 'Consider if you meant "their" (possessive), "there" (location), or "they\'re" (they are).',
  },
  {
    pattern: /\b(your|youre)\b(?!\s+(?:welcome|about|are|were|have|has|had|will|would|should|could|may|might|must|going|coming|doing|here|there|what|where|when|why|how))/gi,
    type: 'warning',
    category: 'Homophones',
    suggestion: "you're",
    explanation: 'Consider if you meant "your" (possessive) or "you\'re" (you are).',
  },
  {
    pattern: /\btheir\b(?=\s+(?:is|are|was|were|have|has|had|will|would|should|could|may|might|must|going|coming|here|there))/gi,
    type: 'error',
    category: 'Homophones',
    suggestion: "they're",
    explanation: 'Use "they\'re" (they are) when meaning "they are".',
  },
  {
    pattern: /\byour\b(?=\s+(?:welcome|about|are|were|have|has|had|will|would|should|could|going|coming|doing|here|there|what|where|when|why|how))/gi,
    type: 'error',
    category: 'Homophones',
    suggestion: "you're",
    explanation: 'Use "you\'re" (you are) when meaning "you are".',
  },
  {
    pattern: /\b(alot)\b/gi,
    type: 'error',
    category: 'Common Misspellings',
    suggestion: 'a lot',
    explanation: '"A lot" is two words, not one.',
  },
  {
    pattern: /\b(could of|would of|should of|might of|must of|has of|had of|was of|were of|are of|is of)\b/gi,
    type: 'error',
    category: 'Verb Forms',
    suggestion: (match) => match.replace(' of', ' have'),
    explanation: 'Use "have" instead of "of" with modal verbs.',
  },
  {
    pattern: /\b(then)\s+(?=i|he|she|we|they|you)\b(?!\s+(?:came|went|saw|had|did|said|knew|thought|found|got|made|took)/i,
    type: 'warning',
    category: 'Common Confusions',
    suggestion: 'than',
    explanation: 'Use "than" for comparisons, "then" for time/sequence.',
  },
  {
    pattern: /\b(lead)\b(?=\s+(?:the|her|his|their|your|a|an|some|any|no|this|that|these|those))/gi,
    type: 'error',
    category: 'Verb Forms',
    suggestion: 'led',
    explanation: '"Lead" is a noun or present tense verb. "Led" is the past tense.',
  },
  {
    pattern: /\b(accept|except)\b/gi,
    type: 'warning',
    category: 'Homophones',
    suggestion: 'accept',
    explanation: '"Accept" means to receive. "Except" means excluding.',
  },
  {
    pattern: /\b(affect|effect)\b/gi,
    type: 'warning',
    category: 'Homophones',
    suggestion: 'affect',
    explanation: '"Affect" is usually a verb (to influence). "Effect" is usually a noun (the result).',
  },
  {
    pattern: /\b(lose|loose)\b/gi,
    type: 'warning',
    category: 'Homophones',
    suggestion: 'lose',
    explanation: '"Lose" is a verb (to misplace). "Loose" is an adjective (not tight).',
  },
  {
    pattern: /\b(sit|set)\b(?=\s+(?:down|up|in|on|out|off))/gi,
    type: 'warning',
    category: 'Verb Forms',
    suggestion: 'sit',
    explanation: '"Sit" means to be seated. "Set" means to place something down.',
  },
  {
    pattern: /\b(lay|lies)\b(?=\s+(?:down|on|in|at))/gi,
    type: 'warning',
    category: 'Verb Forms',
    suggestion: 'lie',
    explanation: '"Lie" means to recline (past tense: lay). "Lay" means to place something (past tense: laid).',
  },
  {
    pattern: /\b(layed)\b/gi,
    type: 'error',
    category: 'Verb Forms',
    suggestion: 'laid',
    explanation: '"Laid" is the correct past tense of "lay".',
  },
  {
    pattern: /\b(learnt|learned)\b/gi,
    type: 'suggestion',
    category: 'Regional Variation',
    suggestion: 'learned',
    explanation: '"Learned" is the standard past tense in American English.',
  },
  {
    pattern: /\b(doesnt|doesent|does'nt)\b/gi,
    type: 'error',
    category: 'Contractions',
    suggestion: "doesn't",
    explanation: 'The correct spelling of the contraction is "doesn\'t".',
  },
  {
    pattern: /\b(dont)\b(?=\s+(?:you|we|they|I))/gi,
    type: 'error',
    category: 'Contractions',
    suggestion: "don't",
    explanation: 'Use "don\'t" for "do not" (except with "does" or "did").',
  },
  {
    pattern: /\b(couldnt|could'nt|couldent)\b/gi,
    type: 'error',
    category: 'Contractions',
    suggestion: "couldn't",
    explanation: 'The correct spelling of the contraction is "couldn\'t".',
  },
];

export default function EnglishGrammarCheckerClient() {
  const [input, setInput] = useState('');

  const issues = useMemo<GrammarIssue[]>(() => {
    if (!input.trim()) return [];

    const foundIssues: GrammarIssue[] = [];

    grammarRules.forEach(rule => {
      const matches = input.matchAll(new RegExp(rule.pattern.source, rule.pattern.flags));
      
      for (const match of matches) {
        const suggestion = typeof rule.suggestion === 'function' 
          ? rule.suggestion(match[0]) 
          : rule.suggestion;
        
        foundIssues.push({
          type: rule.type,
          category: rule.category,
          original: match[0],
          suggestion,
          explanation: rule.explanation,
        });
      }
    });

    // Remove duplicates
    const unique = foundIssues.filter((issue, index, self) => 
      index === self.findIndex(i => i.original === issue.original && i.category === issue.category)
    );

    return unique;
  }, [input]);

  const handleFix = (issue: GrammarIssue) => {
    const regex = new RegExp(`\\b${issue.original}\\b`, 'gi');
    setInput(prev => prev.replace(regex, (match) => {
      // Preserve case
      if (match[0] === match[0].toUpperCase()) {
        return issue.suggestion.charAt(0).toUpperCase() + issue.suggestion.slice(1);
      }
      return issue.suggestion;
    }));
  };

  const fixAll = () => {
    let result = input;
    issues.forEach(issue => {
      const regex = new RegExp(`\\b${issue.original}\\b`, 'gi');
      result = result.replace(regex, (match) => {
        if (match[0] === match[0].toUpperCase()) {
          return issue.suggestion.charAt(0).toUpperCase() + issue.suggestion.slice(1);
        }
        return issue.suggestion;
      });
    });
    setInput(result);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(input);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">English Grammar Checker</h1>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Enter text to check</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-3 border rounded-lg h-48 dark:bg-gray-800 dark:border-gray-700"
          placeholder="Paste or type your text here to check for grammar issues..."
        />
      </div>

      {input && (
        <div className="mb-4 flex items-center justify-between">
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm">
              Found <strong>{issues.length}</strong> issue{issues.length !== 1 ? 's' : ''}
              {' '}({issues.filter(i => i.type === 'error').length} errors,{' '}
              {issues.filter(i => i.type === 'warning').length} warnings,{' '}
              {issues.filter(i => i.type === 'suggestion').length} suggestions)
            </p>
          </div>
          <div className="flex gap-2">
            {issues.length > 0 && (
              <button
                onClick={fixAll}
                className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm transition"
              >
                Fix All
              </button>
            )}
            <button
              onClick={handleCopy}
              className="px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 text-sm transition"
            >
              Copy
            </button>
          </div>
        </div>
      )}

      {issues.length > 0 && (
        <div className="mb-6 space-y-3">
          {issues.map((issue, i) => (
            <div
              key={i}
              className={`p-4 rounded-lg border-l-4 ${
                issue.type === 'error'
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-500'
                  : issue.type === 'warning'
                  ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
                  : 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      issue.type === 'error'
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                        : issue.type === 'warning'
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                    }`}>
                      {issue.type.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500">{issue.category}</span>
                  </div>
                  <div className="font-mono text-sm mb-1">
                    Found: <span className="line-through text-red-500">{issue.original}</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {issue.explanation}
                  </div>
                  <div className="font-mono text-sm mt-1">
                    Suggested: <span className="text-green-600 dark:text-green-400">{issue.suggestion}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleFix(issue)}
                  className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  Fix
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {input && issues.length === 0 && (
        <div className="mb-6 p-6 bg-green-50 dark:bg-green-900/30 rounded-lg text-center">
          <div className="text-4xl mb-2">✓</div>
          <p className="text-green-700 dark:text-green-400 font-medium">
            No grammar issues detected!
          </p>
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="font-medium mb-2">What it checks:</h3>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <li>• Capitalization of "I"</li>
          <li>• Common homophoneconfusions (their/there/they're, your/you're, etc.)</li>
          <li>• Contraction spelling</li>
          <li>• Common misspellings</li>
          <li>• Verb form errors</li>
          <li>• Note: This is not a comprehensive grammar checker</li>
        </ul>
      </div>
    </div>
  );
}
