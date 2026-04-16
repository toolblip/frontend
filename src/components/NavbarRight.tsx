'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface User {
  name: string;
  email: string;
}

export default function NavbarRight() {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem('toolblip_user');
    if (raw) {
      try {
        setUser(JSON.parse(raw) as User);
      } catch {
        localStorage.removeItem('toolblip_user');
        localStorage.removeItem('toolblip_token');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('toolblip_token');
    localStorage.removeItem('toolblip_user');
    window.location.href = '/';
  };

  if (user) {
    return (
      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
          aria-expanded={menuOpen}
        >
          <span className="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-semibold uppercase">
            {user.name.charAt(0)}
          </span>
          <span className="hidden sm:inline">{user.name}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-44 bg-[#1a1d27] border border-gray-700 rounded-lg shadow-xl py-1 z-50">
            <div className="px-3 py-2 border-b border-gray-700">
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
            >
              Sign out
            </button>
          </div>
        )}
        {menuOpen && <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/login"
        className="text-sm text-gray-400 hover:text-white transition-colors px-3 py-1.5"
      >
        Sign in
      </Link>
      <Link
        href="/signup"
        className="text-sm bg-green-600 hover:bg-green-500 text-white px-3.5 py-1.5 rounded-md font-medium transition-colors"
      >
        Sign up
      </Link>
    </div>
  );
}
