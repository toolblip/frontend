'use client';

import { useMemo, useState } from 'react';
import { EMOJI_DATA } from '@/lib/emoji-data';

interface EmojiPickerProps {
  onSelect: (char: string) => void;
  onClose: () => void;
}

export default function EmojiPicker({ onSelect, onClose }: EmojiPickerProps) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return EMOJI_DATA;
    return EMOJI_DATA.filter(
      (e) => e.name.toLowerCase().includes(q) || e.keywords.some((k) => k.toLowerCase().includes(q))
    );
  }, [query]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Emoji and symbol picker"
        className="flex max-h-[80vh] w-full max-w-lg flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl dark:border-gray-800 dark:bg-gray-950"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-start justify-between gap-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Emoji &amp; symbols</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-xl leading-none text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            aria-label="Close emoji picker"
          >
            ×
          </button>
        </div>

        <input
          type="text"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, e.g. &quot;cat&quot; or &quot;heart&quot;..."
          className="mb-3 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-gray-900 outline-none focus:border-red-400 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
        />

        <div className="min-h-0 flex-1 overflow-y-auto">
          {results.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              No matches for &quot;{query}&quot;.
            </p>
          ) : (
            <div className="grid grid-cols-6 gap-2 sm:grid-cols-8">
              {results.map((e) => (
                <button
                  key={e.char}
                  type="button"
                  title={e.name}
                  aria-label={e.name}
                  onClick={() => onSelect(e.char)}
                  className="flex aspect-square items-center justify-center rounded-lg text-2xl transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {e.char}
                </button>
              ))}
            </div>
          )}
        </div>

        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          Click one to insert it into the Unicode/IDN input. Keep this open to add more than one.
        </p>
      </div>
    </div>
  );
}
