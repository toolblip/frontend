'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { EMOJI_SEARCH_INDEX } from '@/lib/emoji-data';

interface EmojiPickerProps {
  onSelect: (char: string) => void;
  onClose: () => void;
}

export default function EmojiPicker({ onSelect, onClose }: EmojiPickerProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  // Tracks whether the mousedown that started this click also landed on the
  // backdrop itself, not just where the click event happened to bubble to -
  // otherwise dragging a text selection from inside the search box out past
  // the dialog's edge fires a click on the backdrop and closes the modal
  // mid-selection.
  const mouseDownOnBackdrop = useRef(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return EMOJI_SEARCH_INDEX.map((r) => r.entry);
    return EMOJI_SEARCH_INDEX.filter((r) => r.haystack.includes(q)).map((r) => r.entry);
  }, [query]);

  const handleSelect = (char: string) => {
    onSelect(char);
    // Keep the modal usable for picking several characters in a row -
    // onSelect (insertEmoji) is told not to steal focus back to the
    // punycode textarea while this stays open, so refocus the search input
    // here instead of leaving focus wherever the click landed.
    inputRef.current?.focus();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onMouseDown={(e) => {
        mouseDownOnBackdrop.current = e.target === e.currentTarget;
      }}
      onClick={(e) => {
        if (mouseDownOnBackdrop.current && e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Emoji and symbol picker"
        className="flex max-h-[80vh] w-full max-w-lg flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl dark:border-gray-800 dark:bg-gray-950"
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
          ref={inputRef}
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
                  onClick={() => handleSelect(e.char)}
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
