'use client';

import { useState, useMemo } from 'react';

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

export default function EmojiFinderClient() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [copiedEmoji, setCopiedEmoji] = useState<string | null>(null);

  const filteredEmojis = useMemo(() => {
    return emojiData.filter(emoji => {
      const matchesSearch = search === '' || 
        emoji.name.toLowerCase().includes(search.toLowerCase()) ||
        emoji.keywords.some(k => k.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory = category === 'All' || emoji.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  const handleCopy = (emoji: string) => {
    navigator.clipboard.writeText(emoji).catch(() => {});
    setCopiedEmoji(emoji);
    setTimeout(() => setCopiedEmoji(prev => (prev === emoji ? null : prev)), 1200);
  };

  return (
    <div className="" style={{padding:"20px"}}>
      <h1 className="text-2xl font-bold mb-6">Emoji Finder</h1>

      <div className="mb-4">
        <label className="tb-v2-tool-label" style={{marginBottom:8}}>Search emojis</label>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="tb-v2-input"
          placeholder="Search by name or keyword..."
        />
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1 rounded-full text-sm transition ${
              category === cat
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredEmojis.length > 0 && (
        <div className="tb-v2-section" style={{padding:16,background:"var(--surface-2)"}}>
          <p className="text-sm">
            <strong>{filteredEmojis.length}</strong> emojis found
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {filteredEmojis.map((emoji, i) => (
          <button
            key={i}
            onClick={() => handleCopy(emoji.emoji)}
            className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition text-center group"
          >
            <div className="text-3xl mb-2">{emoji.emoji}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-blue-500 truncate">
              {copiedEmoji === emoji.emoji ? 'Copied' : emoji.name}
            </div>
          </button>
        ))}
      </div>

      {filteredEmojis.length === 0 && (
        <p className="tb-v2-empty">No emojis found matching your search.</p>
      )}
    </div>
  );
}
