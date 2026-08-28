'use client';

import { useState, useEffect, useRef } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const RESULT_CAP = 500;
const EXAMPLE_LETTERS = 'listen';

function buildLetterCounts(letters: string): Map<string, number> {
  const counts = new Map<string, number>();
  for (const ch of letters.toLowerCase()) {
    if (!/[a-z]/.test(ch)) continue;
    counts.set(ch, (counts.get(ch) ?? 0) + 1);
  }
  return counts;
}

function canFormWord(word: string, available: Map<string, number>, allowRepeats: boolean): boolean {
  if (allowRepeats) {
    for (const ch of word) {
      if (!available.has(ch)) return false;
    }
    return true;
  }
  const needed = new Map<string, number>();
  for (const ch of word) {
    needed.set(ch, (needed.get(ch) ?? 0) + 1);
  }
  for (const [ch, count] of needed) {
    if ((available.get(ch) ?? 0) < count) return false;
  }
  return true;
}

function matchesPattern(word: string, pattern: string): boolean {
  if (!pattern) return true;
  if (word.length !== pattern.length) return false;
  for (let i = 0; i < pattern.length; i++) {
    const p = pattern[i];
    if (p === '?') continue;
    if (p !== word[i]) return false;
  }
  return true;
}

export default function WordFinderClient() {
  const [wordList, setWordList] = useState<string[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [letters, setLetters] = useState('');
  const [pattern, setPattern] = useState('');
  const [minLen, setMinLen] = useState('');
  const [maxLen, setMaxLen] = useState('');
  const [allowRepeats, setAllowRepeats] = useState(false);
  const [results, setResults] = useState<string[] | null>(null);
  const [totalMatches, setTotalMatches] = useState(0);
  const [searching, setSearching] = useState(false);
  const loadStarted = useRef(false);

  useEffect(() => {
    if (loadStarted.current) return;
    loadStarted.current = true;
    fetch('/data/word-list.json')
      .then(r => {
        if (!r.ok) throw new Error('failed');
        return r.json();
      })
      .then((data: string[]) => setWordList(data))
      .catch(() => setLoadError(true));
  }, []);

  const findWords = () => {
    if (!wordList) return;
    setSearching(true);
    // Defer slightly so the "searching" state can paint before the heavy loop.
    setTimeout(() => {
      const available = buildLetterCounts(letters);
      const min = minLen ? parseInt(minLen, 10) : null;
      const max = maxLen ? parseInt(maxLen, 10) : null;
      const pat = pattern.trim().toLowerCase();
      const matches: string[] = [];
      let total = 0;

      for (const word of wordList) {
        if (min !== null && word.length < min) continue;
        if (max !== null && word.length > max) continue;
        if (pat && !matchesPattern(word, pat)) continue;
        if (letters.trim() && !canFormWord(word, available, allowRepeats)) continue;
        if (!letters.trim() && !pat) continue;
        total++;
        if (matches.length < RESULT_CAP) matches.push(word);
      }

      setResults(matches);
      setTotalMatches(total);
      setSearching(false);
    }, 10);
  };

  const canSearch = !!wordList && (letters.trim().length > 0 || pattern.trim().length > 0);

  const copyResults = () => {
    if (!results) return;
    navigator.clipboard.writeText(results.join('\n')).catch(() => {});
  };

  const loadExample = () => {
    setLetters(EXAMPLE_LETTERS);
    setPattern('');
    setMinLen('4');
    setMaxLen('6');
    setResults(null);
    setTotalMatches(0);
  };

  const clearAll = () => {
    setLetters('');
    setPattern('');
    setMinLen('');
    setMaxLen('');
    setResults(null);
    setTotalMatches(0);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Available Letters</span>
        <ToolExampleClearActions
          onExample={loadExample}
          onClear={clearAll}
          canClear={
            letters.length > 0 ||
            pattern.length > 0 ||
            minLen.length > 0 ||
            maxLen.length > 0 ||
            !!results
          }
        />
      </div>
      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {loadError && (
          <div className="tb-v2-banner tb-v2-banner-err">Could not load the word list. Try reloading the page.</div>
        )}
        {!wordList && !loadError && (
          <div className="tb-v2-banner tb-v2-banner-info">Loading dictionary (~270,000 words)...</div>
        )}

        <div>
          <span className="tb-v2-tool-label" style={{ display: 'block', marginBottom: 6 }}>Letters you have</span>
          <input
            type="text"
            value={letters}
            onChange={e => setLetters(e.target.value)}
            placeholder="e.g. tresna"
            className="tb-v2-input tb-v2-input-mono"
          />
        </div>

        <div className="tb-v2-grid-3">
          <div style={{ padding: '0 12px 0 0' }}>
            <span className="tb-v2-tool-label" style={{ display: 'block', marginBottom: 6 }}>Pattern (? = any letter)</span>
            <input
              type="text"
              value={pattern}
              onChange={e => setPattern(e.target.value)}
              placeholder="e.g. c?t"
              className="tb-v2-input tb-v2-input-mono"
            />
          </div>
          <div style={{ padding: '0 12px' }}>
            <span className="tb-v2-tool-label" style={{ display: 'block', marginBottom: 6 }}>Min length</span>
            <input
              type="number"
              min={1}
              value={minLen}
              onChange={e => setMinLen(e.target.value)}
              placeholder="1"
              className="tb-v2-input"
            />
          </div>
          <div style={{ padding: '0 0 0 12px' }}>
            <span className="tb-v2-tool-label" style={{ display: 'block', marginBottom: 6 }}>Max length</span>
            <input
              type="number"
              min={1}
              value={maxLen}
              onChange={e => setMaxLen(e.target.value)}
              placeholder="15"
              className="tb-v2-input"
            />
          </div>
        </div>

        <label className="tb-v2-checkbox-row">
          <input type="checkbox" checked={allowRepeats} onChange={e => setAllowRepeats(e.target.checked)} />
          Allow repeating letters beyond how many times they appear (ignore Scrabble-style multiplicity)
        </label>

        <button
          type="button"
          onClick={findWords}
          disabled={!canSearch || searching}
          className="tb-v2-btn tb-v2-btn-primary tb-v2-btn-lg"
        >
          {searching ? 'Searching...' : 'Find Words'}
        </button>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Results</span>
        <button type="button" onClick={copyResults} disabled={!results || results.length === 0} className="tb-v2-copy-btn">
          Copy
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        {!results ? (
          <p className="tb-v2-empty">Enter letters and/or a pattern, then click Find Words.</p>
        ) : results.length === 0 ? (
          <p className="tb-v2-empty">No matching words found.</p>
        ) : (
          <>
            <p style={{ fontSize: 12.5, color: 'var(--fg-2)', marginBottom: 10 }}>
              Showing {results.length} of {totalMatches} matching word{totalMatches === 1 ? '' : 's'}
              {totalMatches > results.length ? ` (first ${RESULT_CAP})` : ''}.
            </p>
            <div className="tb-v2-stats-grid" style={{ border: '1px solid var(--line)', borderRadius: 'var(--radius-sm)' }}>
              {results.map(w => (
                <div key={w} className="tb-v2-stat-pill">
                  <span style={{ fontFamily: 'var(--f-mono)', fontSize: 13.5 }}>{w}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
