"use client";
import { useState } from 'react';

const COLLOCATIONS: Record<string, string[]> = {
  'make': ['a decision', 'a mistake', 'progress', 'an effort', 'money'],
  'do': ['homework', 'business', 'a favor', 'research', 'exercise'],
  'take': ['a break', 'a risk', 'action', 'notes', 'a photo'],
  'pay': ['attention', 'a visit', 'a compliment', 'the price', 'tribute'],
  'break': ['a record', 'the law', 'the ice', 'a promise', 'a habit'],
};

export default function EnglishCollocationsCheckerClient() {
  const [word, setWord] = useState('make');
  const collocations = COLLOCATIONS[word.toLowerCase()] || [];

  return (
    <div>
      <div className="tb-v2-tool-input-head"><span className="tb-v2-tool-label">Verb</span></div>
      <input value={word} onChange={e => setWord(e.target.value)} className="tb-v2-tool-textarea" />
      <div style={{ marginTop: '1rem' }}>
        <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Common collocations with &quot;{word}&quot;:</p>
        {collocations.length > 0 ? (
          collocations.map((c, i) => (
            <div key={i} style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid #e5e7eb' }}>
              <strong>{word}</strong> {c}
            </div>
          ))
        ) : (
          <p style={{ color: '#6b7280' }}>No collocations found. Try: make, do, take, pay, break</p>
        )}
      </div>
    </div>
  );
}
