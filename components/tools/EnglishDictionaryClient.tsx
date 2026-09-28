'use client';
import UtilityDesignLayout from './UtilityDesignLayout';
import ToolExampleClearActions from './ToolExampleClearActions';

import { useState, useRef, useEffect } from 'react';

import { fetchDictionary, DICTIONARY_PROVIDER, DICTIONARY_LICENSE, type DictionaryResult } from '@/lib/utility-design/dictionary';

const EXAMPLE = 'eloquent';

export function DictionaryAttribution({ sourceUrl }: { sourceUrl?: string }) {
  return (
      <p style={{ fontSize: 12, marginTop: 10 }}>
        Definitions from <a href={DICTIONARY_PROVIDER} target="_blank" rel="noopener noreferrer">FreeDictionaryAPI.com</a> and Wiktionary,
        {' '}licensed under <a href={DICTIONARY_LICENSE} target="_blank" rel="noopener noreferrer">CC BY-SA 4.0</a>. Pronunciation is shown as IPA; audio is not provided.
        {sourceUrl && <> <a href={sourceUrl} target="_blank" rel="noopener noreferrer">Original Wiktionary entry</a>.</>}
      </p>
  );
}

export default function EnglishDictionaryClient() {
  const request = useRef<AbortController|null>(null);
  useEffect(() => () => { request.current?.abort(); request.current = null; }, []);
  const [word, setWord] = useState('');
  const [result, setResult] = useState<DictionaryResult | null>(null);
  const entries = result?.entries;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const lookup = async (target?: string) => {
    const q = (target ?? word).trim();
    request.current?.abort(); request.current = null;
    if (!q || q.length > 100) { setLoading(false); setResult(null); setError('Enter a word up to 100 characters.'); return; }
    const controller = new AbortController(); request.current = controller;
    const timeout = setTimeout(() => controller.abort(), 30000);
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await fetchDictionary(q, controller.signal);
      if (request.current !== controller || controller.signal.aborted) return;
      if (!data) { setError(`No definitions found for "${q}".`); return; }
      setResult(data);
    } catch {
      if(request.current === controller) setError('Lookup unavailable or timed out. Try again.');
    } finally {
      clearTimeout(timeout);
      if(request.current === controller) setLoading(false);
    }
  };

  const loadExample = () => {
    setWord(EXAMPLE);
    lookup(EXAMPLE);
  };

  return (<UtilityDesignLayout>
    <div>
      <ToolExampleClearActions onExample={() => { loadExample(); }} onClear={() => { request.current?.abort(); request.current=null; setWord(''); setResult(null); setLoading(false); setError(''); }}/>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Word</span>

      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input maxLength={100} aria-label="Word"
          type="text"
          value={word}
          onChange={e => { request.current?.abort(); request.current=null; setLoading(false); setResult(null); setError(''); setWord(e.target.value); }}
          onKeyDown={e => { if (e.key === 'Enter') lookup(); }}
          placeholder="Type a word to look up..."
          className="tb-v2-input"
        />
        <button type="button" onClick={() => lookup()} disabled={loading || !word.trim()} className="tb-v2-btn tb-v2-btn-primary">
          {loading ? 'Looking up...' : 'Look Up'}
        </button>
      </div>

      <DictionaryAttribution sourceUrl={result?.sourceUrl} />

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Definition</span>
      </div>
      <div className="tb-v2-tool-output-body">
        {error && <div className="tb-v2-banner-err">{error}</div>}
        {!error && !entries && !loading && (
          <p className="tb-v2-empty">Look up a word to see its definitions, synonyms, and IPA pronunciation.</p>
        )}
        {entries && entries.map((entry, ei) => (
          <div key={ei} style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 20, fontWeight: 700 }}>{entry.word}</span>
              {entry.phonetics.length > 0 && <span aria-label="IPA pronunciation" style={{ fontFamily: 'var(--f-mono)', color: 'var(--fg-2)' }}>{entry.phonetics.join(' · ')}</span>}
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
  </UtilityDesignLayout>
  );
}
