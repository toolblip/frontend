'use client';

import { useState } from 'react';

interface Definition { definition: string; example?: string; synonyms: string[]; antonyms: string[]; }
interface Meaning { partOfSpeech: string; definitions: Definition[]; synonyms: string[]; antonyms: string[]; }
interface Phonetic { text?: string; audio?: string; }
interface Entry { word: string; phonetic?: string; phonetics: Phonetic[]; meanings: Meaning[]; }

const EXAMPLE = 'eloquent';

export default function EnglishDictionaryClient() {
  const [word, setWord] = useState('');
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const lookup = async (target?: string) => {
    const q = (target ?? word).trim();
    if (!q) return;
    setLoading(true);
    setError('');
    setEntries(null);
    try {
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(q)}`);
      if (res.status === 404) {
        setError(`No definitions found for "${q}".`);
        return;
      }
      if (!res.ok) {
        setError('Lookup failed. Please try again.');
        return;
      }
      const data = await res.json();
      setEntries(data as Entry[]);
    } catch {
      setError('Network error while looking up the word.');
    } finally {
      setLoading(false);
    }
  };

  const loadExample = () => {
    setWord(EXAMPLE);
    lookup(EXAMPLE);
  };

  const playAudio = (url: string) => {
    if (!url) return;
    const audioUrl = url.startsWith('http') ? url : `https:${url}`;
    new Audio(audioUrl).play().catch(() => {});
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Word</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">Load Example</button>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          value={word}
          onChange={e => setWord(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') lookup(); }}
          placeholder="Type a word to look up..."
          className="tb-v2-input"
        />
        <button type="button" onClick={() => lookup()} disabled={loading || !word.trim()} className="tb-v2-btn tb-v2-btn-primary">
          {loading ? 'Looking up...' : 'Look Up'}
        </button>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Definition</span>
      </div>
      <div className="tb-v2-tool-output-body">
        {error && <div className="tb-v2-banner-err">{error}</div>}
        {!error && !entries && !loading && (
          <p className="tb-v2-empty">Look up a word to see its definitions, synonyms, and pronunciation.</p>
        )}
        {entries && entries.map((entry, ei) => (
          <div key={ei} style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 20, fontWeight: 700 }}>{entry.word}</span>
              {entry.phonetic && <span style={{ fontFamily: 'var(--f-mono)', color: 'var(--fg-2)' }}>{entry.phonetic}</span>}
              {entry.phonetics.filter(p => p.audio).slice(0, 1).map((p, pi) => (
                <button key={pi} type="button" onClick={() => playAudio(p.audio as string)} className="tb-v2-btn-sm">Play</button>
              ))}
            </div>
            {entry.meanings.map((m, mi) => (
              <div key={mi} style={{ marginTop: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--blue)', textTransform: 'uppercase', letterSpacing: 0.4 }}>{m.partOfSpeech}</div>
                <ol style={{ margin: '6px 0 0', paddingLeft: 20 }}>
                  {m.definitions.slice(0, 5).map((d, di) => (
                    <li key={di} style={{ marginBottom: 6, fontSize: 14 }}>
                      {d.definition}
                      {d.example && <div style={{ fontSize: 13, color: 'var(--fg-2)', fontStyle: 'italic' }}>"{d.example}"</div>}
                    </li>
                  ))}
                </ol>
                {(m.synonyms.length > 0 || m.antonyms.length > 0) && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                    {m.synonyms.slice(0, 8).map(s => <span key={s} className="tb-v2-chip">{s}</span>)}
                    {m.antonyms.slice(0, 8).map(a => <span key={a} className="tb-v2-chip" style={{ opacity: 0.7 }}>{a}</span>)}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
