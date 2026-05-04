'use client';

import { useState, useCallback } from 'react';

export default function WordAssociationClient() {
  const [word, setWord] = useState('');
  const [associations, setAssociations] = useState<{ type: string; words: string[] }[]>([]);
  const [loading, setLoading] = useState(false);

  const getAssociations = useCallback(async () => {
    if (!word.trim()) return;
    setLoading(true);

    const input = word.toLowerCase().trim();
    const results: { type: string; words: string[] }[] = [];

    // Rhymes
    const rhymePatterns: Record<string, string[]> = {
      'ay': ['day', 'way', 'say', 'may', 'play', 'stay', 'gray', 'pray', 'sway', 'ray'],
      'ight': ['night', 'light', 'right', 'sight', 'might', 'fight', 'bright', 'tight', 'flight', 'white'],
      'ound': ['found', 'sound', 'ground', 'round', 'bound', 'wound', 'pound', 'mound', 'hound', 'count'],
      'ove': ['love', 'dove', 'above', 'shove', 'glove'],
    };

    let rhymes: string[] = [];
    for (const [pat, vals] of Object.entries(rhymePatterns)) {
      if (input.endsWith(pat)) {
        rhymes = vals.filter(w => w !== input);
        break;
      }
    }
    if (rhymes.length > 0) results.push({ type: 'Rhymes', words: rhymes.slice(0, 8) });

    // Synonyms
    const synonymMap: Record<string, string[]> = {
      'happy': ['joyful', 'cheerful', 'glad', 'content', 'pleased', 'delighted', 'ecstatic', 'elated'],
      'sad': ['unhappy', 'sorrowful', 'melancholy', 'dejected', 'gloomy', 'down', 'blue', 'mournful'],
      'big': ['large', 'huge', 'enormous', 'giant', 'massive', 'vast', 'immense', 'gigantic'],
      'small': ['tiny', 'little', 'mini', 'petite', 'compact', 'miniature', 'minute', 'microscopic'],
      'fast': ['quick', 'rapid', 'swift', 'speedy', 'hasty', 'brisk', 'fleet', 'peppy'],
      'slow': ['sluggish', 'gradual', 'leisurely', 'unhurried', 'poky', 'crawling', 'plodding'],
      'smart': ['intelligent', 'clever', 'bright', 'brilliant', 'sharp', 'wise', 'astute', 'savvy'],
      'strong': ['powerful', 'mighty', 'robust', 'sturdy', 'tough', 'muscular', 'forceful', 'intense'],
      'beautiful': ['pretty', 'gorgeous', 'stunning', 'lovely', 'attractive', 'enchanting', 'elegant', 'radiant'],
      'angry': ['mad', 'furious', 'irate', 'annoyed', 'irritated', 'enraged', 'infuriated', 'wrathful'],
    };

    const syns = synonymMap[input];
    if (syns) results.push({ type: 'Synonyms', words: syns });

    // Related
    const relatedMap: Record<string, string[]> = {
      'computer': ['laptop', 'keyboard', 'monitor', 'mouse', 'software', 'hardware', 'internet', 'programming'],
      'book': ['read', 'page', 'chapter', 'author', 'story', 'library', 'novel', 'publisher'],
      'music': ['song', 'melody', 'rhythm', 'album', 'band', 'instrument', 'concert', 'playlist'],
      'food': ['eat', 'cook', 'recipe', 'kitchen', 'restaurant', 'delicious', 'chef', 'dinner'],
      'water': ['drink', 'ocean', 'river', 'lake', 'rain', 'swim', 'fish', 'wave'],
    };

    for (const [key, vals] of Object.entries(relatedMap)) {
      if (input.includes(key) || key.includes(input)) {
        results.push({ type: 'Related', words: vals });
        break;
      }
    }

    if (results.length === 0) {
      results.push({ type: 'Suggestions', words: ['Try a common word like happy, sad, big, small, fast, slow...'] });
    }

    setAssociations(results);
    setLoading(false);
  }, [word]);

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Word</span>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && getAssociations()}
          placeholder="Enter a word..."
          className="tb-v2-tool-input"
          style={{ flex: 1 }}
          aria-label="Word input"
        />
        <button type="button" onClick={getAssociations} disabled={loading} className="tb-v2-primary-btn">
          {loading ? '...' : 'Find'}
        </button>
      </div>

      {associations.map((group, i) => (
        <div key={i} style={{ marginTop: 16 }}>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">{group.type}</span>
          </div>
          <div className="tb-v2-tool-output-body">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {group.words.map((w, j) => (
                <span key={j} style={{
                  padding: '4px 10px',
                  background: 'var(--tb-bg-secondary)',
                  border: '1px solid var(--tb-border)',
                  borderRadius: 4,
                  fontSize: 13,
                  cursor: 'pointer'
                }}
                onClick={() => { setWord(w); }}
                >
                  {w}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}