'use client';

import { useState, useMemo } from 'react';

type Category = 'verb-noun' | 'adj-noun' | 'adverb-adj' | 'preposition';

const CATEGORY_LABELS: Record<Category, string> = {
  'verb-noun': 'Verb + Noun',
  'adj-noun': 'Adjective + Noun',
  'adverb-adj': 'Adverb + Adjective',
  preposition: 'Preposition Combos',
};

interface Entry { phrase: string; example: string; }

const DATA: Record<Category, Entry[]> = {
  'verb-noun': [
    { phrase: 'make a decision', example: 'She made a decision to change careers.' },
    { phrase: 'make a mistake', example: 'Everyone makes mistakes sometimes.' },
    { phrase: 'do homework', example: 'He does his homework right after school.' },
    { phrase: 'take a photo', example: 'Can you take a photo of us?' },
    { phrase: 'take a shower', example: 'I usually take a shower in the morning.' },
    { phrase: 'catch a cold', example: 'She caught a cold after the trip.' },
    { phrase: 'ask a question', example: 'Feel free to ask a question at any time.' },
    { phrase: 'pay attention', example: 'Please pay attention to the instructions.' },
    { phrase: 'save time', example: 'Taking the highway saves a lot of time.' },
    { phrase: 'keep a promise', example: 'He always keeps his promises.' },
    { phrase: 'give a speech', example: 'The mayor gave a speech at the opening.' },
    { phrase: 'raise awareness', example: 'The campaign aims to raise awareness.' },
  ],
  'adj-noun': [
    { phrase: 'heavy rain', example: 'The heavy rain flooded the streets.' },
    { phrase: 'strong coffee', example: 'He drinks strong coffee every morning.' },
    { phrase: 'high risk', example: 'This investment carries a high risk.' },
    { phrase: 'deep sleep', example: 'She fell into a deep sleep.' },
    { phrase: 'fast food', example: 'They grabbed some fast food for lunch.' },
    { phrase: 'major decision', example: 'Buying a house is a major decision.' },
    { phrase: 'strict rules', example: 'The school has strict rules on uniforms.' },
    { phrase: 'bright idea', example: 'That was a bright idea!' },
    { phrase: 'wide range', example: 'The store offers a wide range of products.' },
    { phrase: 'severe damage', example: 'The storm caused severe damage.' },
  ],
  'adverb-adj': [
    { phrase: 'deeply concerned', example: 'We are deeply concerned about the results.' },
    { phrase: 'highly likely', example: 'It is highly likely to rain tomorrow.' },
    { phrase: 'bitterly cold', example: 'The wind was bitterly cold last night.' },
    { phrase: 'widely known', example: 'This fact is widely known among experts.' },
    { phrase: 'perfectly clear', example: 'The instructions were perfectly clear.' },
    { phrase: 'utterly ridiculous', example: 'The plan sounded utterly ridiculous.' },
    { phrase: 'fully aware', example: 'She was fully aware of the risks.' },
    { phrase: 'closely related', example: 'The two topics are closely related.' },
  ],
  preposition: [
    { phrase: 'interested in', example: 'He is interested in learning French.' },
    { phrase: 'good at', example: 'She is very good at chess.' },
    { phrase: 'afraid of', example: 'Many people are afraid of spiders.' },
    { phrase: 'married to', example: 'He has been married to Anna for ten years.' },
    { phrase: 'depend on', example: 'The outcome depends on the weather.' },
    { phrase: 'listen to', example: 'I like to listen to music while working.' },
    { phrase: 'look at', example: 'Look at this beautiful sunset.' },
    { phrase: 'wait for', example: 'We waited for the bus for twenty minutes.' },
    { phrase: 'arrive at', example: 'We will arrive at the station by noon.' },
    { phrase: 'congratulate on', example: 'I want to congratulate you on your promotion.' },
    { phrase: 'different from', example: 'This version is different from the last one.' },
    { phrase: 'proud of', example: 'Her parents are very proud of her.' },
  ],
};

export default function EnglishCollocationsUniqueClient() {
  const [category, setCategory] = useState<Category>('verb-noun');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const entries = DATA[category];
    if (!q) return entries;
    return entries.filter(e => e.phrase.toLowerCase().includes(q) || e.example.toLowerCase().includes(q));
  }, [category, search]);

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Browse Collocations</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
        {(Object.keys(CATEGORY_LABELS) as Category[]).map(c => (
          <button key={c} type="button" onClick={() => setCategory(c)} className={`tb-v2-mode-tab ${category === c ? 'on' : ''}`}>
            {CATEGORY_LABELS[c]}
          </button>
        ))}
      </div>
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search this category..."
        className="tb-v2-input"
        style={{ marginBottom: 10 }}
      />

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">{CATEGORY_LABELS[category]}</span>
      </div>
      <div className="tb-v2-tool-output-body">
        {filtered.length === 0 ? (
          <p className="tb-v2-empty">No matching collocations found.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.map(e => (
              <div key={e.phrase} className="tb-v2-tool-pre" style={{ padding: '8px 12px' }}>
                <div style={{ fontWeight: 600, fontFamily: 'var(--f-mono)' }}>{e.phrase}</div>
                <div style={{ fontSize: 13, color: 'var(--fg-2)', marginTop: 2 }}>{e.example}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
