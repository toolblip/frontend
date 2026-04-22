'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface User {
  name: string;
  email: string;
}

export default function NavbarAuth() {
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

  const handleLogout = async () => {
    const token = localStorage.getItem('toolblip_token');
    if (token) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.toolblip.com'}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
      } catch {
        // ignore network errors on logout
      }
    }
    localStorage.removeItem('toolblip_token');
    localStorage.removeItem('toolblip_user');
    window.location.href = '/';
  };

  if (user) {
    return (
      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          aria-expanded={menuOpen}
          aria-haspopup="true"
        >
          <span className="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-semibold uppercase">
            {user.name.charAt(0)}
          </span>
          <span className="hidden sm:inline text-gray-700 dark:text-gray-200">{user.name}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-50">
            <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
            <Link
              href="/account"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Account
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Sign out
            </button>
          </div>
        )}

        {/* Backdrop to close menu */}
        {menuOpen && (
          <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 text-sm">
      <Link
        href="/login"
        className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        Sign in
      </Link>
      <Link
        href="/signup"
        className="bg-green-600 hover:bg-green-700 text-white px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors"
      >
        Sign Up
      </Link>
    </div>
  );
}
