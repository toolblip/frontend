'use client';

import { useState, useEffect } from 'react';

interface Note {
  id: string;
  content: string;
  color: string;
  createdAt: number;
  position: { x: number; y: number };
}

const colors = [
  'bg-yellow-200 dark:bg-yellow-800',
  'bg-green-200 dark:bg-green-800',
  'bg-blue-200 dark:bg-blue-800',
  'bg-pink-200 dark:bg-pink-800',
  'bg-purple-200 dark:bg-purple-800',
  'bg-orange-200 dark:bg-orange-800',
];

export default function StickyNotesClient() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('sticky-notes');
    if (saved) {
      try {
        setNotes(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load notes');
      }
    }
  }, []);

  // Save to localStorage when notes change
  useEffect(() => {
    localStorage.setItem('sticky-notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      content: '',
      color: colors[Math.floor(Math.random() * colors.length)],
      createdAt: Date.now(),
      position: {
        x: Math.random() * (window.innerWidth - 300),
        y: Math.random() * (window.innerHeight - 200),
      },
    };
    setNotes([...notes, newNote]);
    setEditingId(newNote.id);
    setEditContent('');
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setEditContent('');
    }
  };

  const updateNote = (id: string, content: string) => {
    setNotes(notes.map(n => n.id === id ? { ...n, content } : n));
  };

  const startEditing = (note: Note) => {
    setEditingId(note.id);
    setEditContent(note.content);
  };

  const saveEdit = () => {
    if (editingId) {
      updateNote(editingId, editContent);
      setEditingId(null);
      setEditContent('');
    }
  };

  const clearAll = () => {
    setNotes([]);
    localStorage.removeItem('sticky-notes');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Sticky Notes</h1>
          <div className="tb-v2-mode-tabs">
            <button
              onClick={addNote}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Add Note
            </button>
            {notes.length > 0 && (
              <button
                onClick={clearAll}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {notes.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No sticky notes yet. Click "Add Note" to create one!
            </p>
          </div>
        ) : (
          <div className="relative" style={{ height: 'calc(100vh - 150px)' }}>
            {notes.map(note => (
              <div
                key={note.id}
                className={`absolute w-64 p-4 rounded-lg shadow-lg ${note.color} cursor-move`}
                style={{
                  left: note.position.x,
                  top: note.position.y,
                }}
              >
                {editingId === note.id ? (
                  <div className="h-full flex flex-col">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="flex-1 w-full p-2 rounded border-none resize-none dark:bg-gray-700/50"
                      placeholder="Type your note..."
                      autoFocus
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        onClick={saveEdit}
                        className="px-2 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditContent('');
                        }}
                        className="px-2 py-1 bg-gray-400 text-white text-sm rounded hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div
                      onClick={() => startEditing(note)}
                      className="min-h-24 cursor-text whitespace-pre-wrap break-words"
                    >
                      {note.content || <span className="text-gray-400 italic">Click to edit...</span>}
                    </div>
                    <div className="flex justify-between items-center mt-3 pt-2 border-t border-black/10 dark:border-white/10">
                      <span className="text-xs text-black/50 dark:text-white/50">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="text-black/50 hover:text-red-500 dark:text-white/50 dark:hover:text-red-400"
                      >
                        ✕
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
