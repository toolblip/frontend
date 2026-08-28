'use client';

import { useState, useMemo } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

interface EmojiInfo {
  emoji: string;
  name: string;
  category: string;
  keywords: string[];
}

const emojiData: EmojiInfo[] = [
  { emoji: '😀', name: 'Grinning Face', category: 'Smileys', keywords: ['happy', 'smile', 'grin'] },
  { emoji: '😃', name: 'Grinning Face with Big Eyes', category: 'Smileys', keywords: ['happy', 'smile', 'big eyes'] },
  { emoji: '😄', name: 'Grinning Face with Smiling Eyes', category: 'Smileys', keywords: ['happy', 'smile', 'eyes'] },
  { emoji: '😁', name: 'Beaming Face with Smiling Eyes', category: 'Smileys', keywords: ['happy', 'smile', 'proud'] },
  { emoji: '😅', name: 'Grinning Face with Sweat', category: 'Smileys', keywords: ['nervous', 'sweat', 'relief'] },
  { emoji: '😂', name: 'Face with Tears of Joy', category: 'Smileys', keywords: ['laugh', 'cry', 'happy'] },
  { emoji: '🤣', name: 'Rolling on the Floor Laughing', category: 'Smileys', keywords: ['laugh', 'floor', 'funny'] },
  { emoji: '😊', name: 'Smiling Face with Smiling Eyes', category: 'Smileys', keywords: ['happy', 'blush', 'smile'] },
  { emoji: '😇', name: 'Smiling Face with Halo', category: 'Smileys', keywords: ['angel', 'innocent', 'halo'] },
  { emoji: '🙂', name: 'Slightly Smiling Face', category: 'Smileys', keywords: ['smile', 'positive'] },
  { emoji: '😉', name: 'Winking Face', category: 'Smileys', keywords: ['wink', 'flirt', 'playful'] },
  { emoji: '😍', name: 'Heart Eyes', category: 'Smileys', keywords: ['love', 'heart', 'romance'] },
  { emoji: '🥰', name: 'Smiling Face with Hearts', category: 'Smileys', keywords: ['love', 'hearts', 'adore'] },
  { emoji: '😘', name: 'Face Blowing a Kiss', category: 'Smileys', keywords: ['kiss', 'love', 'romance'] },
  { emoji: '😎', name: 'Smiling Face with Sunglasses', category: 'Smileys', keywords: ['cool', 'sunglasses', 'smart'] },
  { emoji: '🤔', name: 'Thinking Face', category: 'Smileys', keywords: ['think', 'hmm', 'consider'] },
  { emoji: '🤨', name: 'Face with Raised Eyebrow', category: 'Smileys', keywords: ['skeptical', 'dubious'] },
  { emoji: '😐', name: 'Neutral Face', category: 'Smileys', keywords: ['neutral', 'meh'] },
  { emoji: '😑', name: 'Expressionless Face', category: 'Smileys', keywords: ['neutral', 'expressionless'] },
  { emoji: '😶', name: 'Face Without Mouth', category: 'Smileys', keywords: ['quiet', 'silence'] },
  { emoji: '😏', name: 'Smirking Face', category: 'Smileys', keywords: ['smirk', 'sly', 'knowing'] },
  { emoji: '😒', name: 'Unamused Face', category: 'Smileys', keywords: ['unamused', 'annoyed'] },
  { emoji: '🙄', name: 'Face with Rolling Eyes', category: 'Smileys', keywords: ['eye roll', 'annoyed'] },
  { emoji: '😬', name: 'Grimacing Face', category: 'Smileys', keywords: ['grimace', 'nervous'] },
  { emoji: '😌', name: 'Relieved Face', category: 'Smileys', keywords: ['relieved', 'phew'] },
  { emoji: '😔', name: 'Pensive Face', category: 'Smileys', keywords: ['sad', 'pensive', 'miss'] },
  { emoji: '😷', name: 'Face with Medical Mask', category: 'Smileys', keywords: ['sick', 'mask', 'covid'] },
  { emoji: '🤒', name: 'Face with Thermometer', category: 'Smileys', keywords: ['sick', 'fever', 'ill'] },
  { emoji: '👍', name: 'Thumbs Up', category: 'Gestures', keywords: ['ok', 'good', 'like'] },
  { emoji: '👎', name: 'Thumbs Down', category: 'Gestures', keywords: ['dislike', 'bad'] },
  { emoji: '👏', name: 'Clapping Hands', category: 'Gestures', keywords: ['clap', 'applause', 'bravo'] },
  { emoji: '🙌', name: 'Raising Hands', category: 'Gestures', keywords: ['celebrate', 'praise'] },
  { emoji: '🤝', name: 'Handshake', category: 'Gestures', keywords: ['deal', 'agree', 'shake'] },
  { emoji: '🙏', name: 'Folded Hands', category: 'Gestures', keywords: ['please', 'thanks', 'pray'] },
  { emoji: '✌️', name: 'Victory Hand', category: 'Gestures', keywords: ['peace', 'victory', 'yo'] },
  { emoji: '❤️', name: 'Red Heart', category: 'Symbols', keywords: ['love', 'heart'] },
  { emoji: '💔', name: 'Broken Heart', category: 'Symbols', keywords: ['heartbreak', 'sad', 'love'] },
  { emoji: '✨', name: 'Sparkles', category: 'Symbols', keywords: ['magic', 'star', 'new'] },
  { emoji: '🔥', name: 'Fire', category: 'Symbols', keywords: ['hot', 'fire', 'trending'] },
  { emoji: '⭐', name: 'Star', category: 'Symbols', keywords: ['star', 'favorite'] },
  { emoji: '💯', name: 'Hundred Points', category: 'Symbols', keywords: ['100', 'perfect', 'score'] },
  { emoji: '✅', name: 'Check Mark', category: 'Symbols', keywords: ['check', 'yes', 'done'] },
  { emoji: '❌', name: 'Cross Mark', category: 'Symbols', keywords: ['cross', 'no', 'wrong'] },
  { emoji: '⚠️', name: 'Warning', category: 'Symbols', keywords: ['warning', 'caution'] },
  { emoji: '💡', name: 'Light Bulb', category: 'Symbols', keywords: ['idea', 'tip', 'think'] },
  { emoji: '🚀', name: 'Rocket', category: 'Travel', keywords: ['rocket', 'space', 'fast'] },
  { emoji: '✈️', name: 'Airplane', category: 'Travel', keywords: ['airplane', 'flight', 'travel'] },
  { emoji: '🚗', name: 'Car', category: 'Travel', keywords: ['car', 'drive', 'automobile'] },
  { emoji: '🏠', name: 'House', category: 'Travel', keywords: ['house', 'home'] },
  { emoji: '💻', name: 'Laptop', category: 'Objects', keywords: ['computer', 'laptop', 'tech'] },
  { emoji: '📱', name: 'Mobile Phone', category: 'Objects', keywords: ['phone', 'mobile', 'call'] },
  { emoji: '📧', name: 'Email', category: 'Objects', keywords: ['email', 'mail', 'envelope'] },
  { emoji: '💰', name: 'Money Bag', category: 'Objects', keywords: ['money', 'dollar', 'rich'] },
  { emoji: '🎉', name: 'Party Popper', category: 'Objects', keywords: ['party', 'celebrate', 'tada'] },
  { emoji: '🎯', name: 'Bullseye', category: 'Objects', keywords: ['target', 'goal', 'hit'] },
  { emoji: '💪', name: 'Flexed Biceps', category: 'People', keywords: ['strong', 'muscle', 'power'] },
  { emoji: '👀', name: 'Eyes', category: 'People', keywords: ['eyes', 'look', 'see'] },
  { emoji: '👋', name: 'Waving Hand', category: 'People', keywords: ['wave', 'hi', 'hello'] },
  { emoji: '🌍', name: 'Globe', category: 'Nature', keywords: ['globe', 'world', 'earth'] },
  { emoji: '🌸', name: 'Cherry Blossom', category: 'Nature', keywords: ['flower', 'spring', 'japan'] },
  { emoji: '🌺', name: 'Hibiscus', category: 'Nature', keywords: ['flower', 'tropical'] },
  { emoji: '🌻', name: 'Sunflower', category: 'Nature', keywords: ['flower', 'sun'] },
  { emoji: '🌈', name: 'Rainbow', category: 'Nature', keywords: ['rainbow', 'colorful'] },
  { emoji: '☀️', name: 'Sun', category: 'Nature', keywords: ['sun', 'sunny', 'weather'] },
  { emoji: '🌙', name: 'Crescent Moon', category: 'Nature', keywords: ['moon', 'night', 'sleep'] },
  { emoji: '⏰', name: 'Alarm Clock', category: 'Objects', keywords: ['alarm', 'clock', 'wake'] },
  { emoji: '⏳', name: 'Hourglass', category: 'Objects', keywords: ['hourglass', 'time', 'wait'] },
  { emoji: '📅', name: 'Calendar', category: 'Objects', keywords: ['calendar', 'date', 'schedule'] },
];

const categories = ['All', 'Smileys', 'Gestures', 'Symbols', 'Travel', 'Objects', 'People', 'Nature'];
const EXAMPLE = 'laugh';

export default function EmojiFinderClient() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [copiedEmoji, setCopiedEmoji] = useState<string | null>(null);

  const filteredEmojis = useMemo(() => {
    return emojiData.filter((emoji) => {
      const matchesSearch =
        search === '' ||
        emoji.name.toLowerCase().includes(search.toLowerCase()) ||
        emoji.keywords.some((k) => k.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory = category === 'All' || emoji.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  const handleCopy = (emoji: string) => {
    navigator.clipboard.writeText(emoji).catch(() => {});
    setCopiedEmoji(emoji);
    setTimeout(() => setCopiedEmoji((prev) => (prev === emoji ? null : prev)), 1200);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Search emojis</span>
        <ToolExampleClearActions
          onExample={() => {
            setSearch(EXAMPLE);
            setCategory('All');
          }}
          onClear={() => {
            setSearch('');
            setCategory('All');
          }}
          canClear={search.length > 0 || category !== 'All'}
        />
      </div>
      <div style={{ padding: '12px 20px' }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="tb-v2-input"
          placeholder="Search by name or keyword..."
        />
      </div>

      <div style={{ padding: '0 20px 16px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <div className="tb-v2-mode-tabs" role="group" aria-label="Category">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`tb-v2-mode-tab ${category === cat ? 'on' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">
          {filteredEmojis.length} emoji{filteredEmojis.length === 1 ? '' : 's'}
        </span>
      </div>
      <div className="tb-v2-tool-output-body">
        {filteredEmojis.length === 0 ? (
          <p className="tb-v2-empty">No emojis found matching your search.</p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
              gap: 10,
            }}
          >
            {filteredEmojis.map((emoji, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleCopy(emoji.emoji)}
                style={{
                  padding: 12,
                  background: 'var(--surface-2)',
                  border: '1px solid var(--line)',
                  borderRadius: 8,
                  textAlign: 'center',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 6 }}>{emoji.emoji}</div>
                <div style={{ fontSize: 11, color: 'var(--fg-2)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {copiedEmoji === emoji.emoji ? 'Copied' : emoji.name}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
