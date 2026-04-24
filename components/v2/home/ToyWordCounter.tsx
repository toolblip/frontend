'use client';

import { useMemo, useState } from 'react';

const SEED = `The best tool is the one that doesn't get in your way.

Paste anything here - an email, a tweet, a paragraph from your novel - and watch the counts update live. No character limit, no telemetry.`;

export default function ToyWordCounter() {
  const [text, setText] = useState(SEED);

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const chars = text.length;
    const sentences = trimmed ? (text.match(/[.!?]+(\s|$)/g) || []).length || 1 : 0;
    const reading = Math.max(1, Math.ceil(words / 238));
    return { words, chars, sentences, reading };
  }, [text]);

  return (
    <>
      <textarea
        className="tb-v2-toy-textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste anything…"
        spellCheck={false}
      />
      <div className="tb-v2-toy-stats">
        <div className="tb-v2-toy-stat">
          <div className="tb-v2-toy-stat-num">{stats.words.toLocaleString()}</div>
          <div className="tb-v2-toy-stat-lbl">Words</div>
        </div>
        <div className="tb-v2-toy-stat">
          <div className="tb-v2-toy-stat-num">{stats.chars.toLocaleString()}</div>
          <div className="tb-v2-toy-stat-lbl">Characters</div>
        </div>
        <div className="tb-v2-toy-stat">
          <div className="tb-v2-toy-stat-num">{stats.sentences}</div>
          <div className="tb-v2-toy-stat-lbl">Sentences</div>
        </div>
        <div className="tb-v2-toy-stat">
          <div className="tb-v2-toy-stat-num">
            {stats.reading}
            <sub>m</sub>
          </div>
          <div className="tb-v2-toy-stat-lbl">To read</div>
        </div>
      </div>
    </>
  );
}
