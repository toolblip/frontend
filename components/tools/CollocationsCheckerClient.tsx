'use client';

import React, { useState } from 'react';

const COMMON_COLLOCATIONS: Record<string, string[]> = {
  'make': ['make a decision', 'make a mistake', 'make money', 'make progress', 'make sure', 'make a call', 'make an effort', 'make a plan'],
  'take': ['take a break', 'take a look', 'take notes', 'take action', 'take responsibility', 'take advantage', 'take care', 'take place', 'take off', 'take on', 'take up', 'take it easy', 'take into account'],
  'do': ['do a good job', 'do business', 'do research', 'do exercise', 'do the laundry', 'do homework', 'do the dishes', 'do your best'],
  'have': ['have a look', 'have breakfast', 'have fun', 'have a problem', 'have a question', 'have dinner', 'have a meeting', 'have confidence'],
  'get': ['get up', 'get older', 'get started', 'get better', 'get worse', 'get along', 'get together', 'get rid of'],
  'break': ['break a leg', 'break the ice', 'break down', 'break up', 'break free', 'break through', 'break a record'],
  'come': ['come true', 'come back', 'come forward', 'come home', 'come up with', 'come across', 'come along'],
  'run': ['run a business', 'run out of', 'run into', 'run away', 'run late', 'run fast', 'run for office'],
  'pay': ['pay attention', 'pay back', 'pay off', 'pay a visit', 'pay respect', 'pay dividends'],
  'think': ['think twice', 'think about', 'think of', 'think big', 'think outside the box', 'think highly of'],
  'tell': ['tell a story', 'tell the truth', 'tell time', 'tell apart', 'tell on someone'],
  'find': ['find out', 'find a way', 'find fault', 'find relief', 'find balance', 'find fault with', 'find solace in'],
  'give': ['give a call', 'give a try', 'give up', 'give in', 'give away', 'give back'],
  'show': ['show up', 'show off', 'show around', 'show respect', 'show gratitude'],
  'know': ['know by heart', 'know the truth', 'know best', 'know for sure'],
  'go': ['go ahead', 'go away', 'go back', 'go through', 'go beyond', 'go along'],
  'see': ['see to it', 'see off', 'see through', 'see eye to eye', 'see red'],
  'use': ['use up', 'use out', 'make use of', 'put to use'],
};

export default function CollocationsCheckerClient() {
  const [text, setText] = useState('');
  const [results, setResults] = useState<Array<{ phrase: string; type: string; suggestion?: string }>>([]);

  const checkCollocations = () => {
    const words = text.toLowerCase().split(/\s+/);
    const found: typeof results = [];

    for (let i = 0; i < words.length; i++) {
      const word = words[i].replace(/[^a-z]/g, '');
      const bigram = `${word} ${words[i + 1] || ''}`.replace(/[^a-z\s]/g, '').trim();
      const trigram = `${word} ${words[i + 1] || ''} ${words[i + 2] || ''}`.replace(/[^a-z\s]/g, '').trim();

      if (COMMON_COLLOCATIONS[word]) {
        const matches = COMMON_COLLOCATIONS[word].filter(col =>
          col.includes(bigram) || col.includes(trigram)
        );
        if (matches.length > 0) {
          found.push({ phrase: matches[0], type: 'found' });
        } else if (bigram.length > 3) {
          const similar = COMMON_COLLOCATIONS[word].find(col => {
            const similarity = col.split(' ').filter(w => bigram.includes(w)).length;
            return similarity >= 1;
          });
          if (similar) {
            found.push({ phrase: bigram, type: 'maybe', suggestion: similar });
          }
        }
      }
    }

    setResults(found);
  };

  const copyResults = () => {
    const text = results.map(r =>
      r.type === 'found' ? `✓ ${r.phrase}` : `? ${r.phrase}${r.suggestion ? ` (did you mean: ${r.suggestion})` : ''}`
    ).join('\n');
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Collocations Checker</h1>
      <p className="text-sm text-gray-600 mb-4">
        Common collocations in English are word pairings that sound natural together.
        Enter text below and we&apos;ll highlight any common collocations we find.
      </p>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Enter Text</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-40 p-3 border rounded resize-y"
          placeholder="Type or paste text to check for collocations..."
        />
      </div>

      <button
        onClick={checkCollocations}
        disabled={!text.trim()}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        Check Collocations
      </button>

      {results.length > 0 && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Found {results.length} collocations</span>
            <button onClick={copyResults} className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300">
              Copy
            </button>
          </div>
          <div className="space-y-2">
            {results.map((r, i) => (
              <div key={i} className={`p-3 rounded border ${r.type === 'found' ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                <span className="font-medium">{r.type === 'found' ? '✓' : '?'} {r.phrase}</span>
                {r.suggestion && (
                  <span className="text-sm text-gray-600 ml-2">
                    Did you mean: <span className="font-medium">{r.suggestion}</span>?
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {text && results.length === 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded border text-gray-600">
          No common collocations detected. Try using verbs like &quot;make&quot;, &quot;take&quot;, &quot;do&quot;, &quot;get&quot;, &quot;have&quot;, &quot;break&quot;, &quot;come&quot; followed by nouns.
        </div>
      )}
    </div>
  );
}
