'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/providers/auth-provider';
import { IconUser } from '@/components/v2/icons';

export default function NavbarAuth() {
  const { user, logout, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  if (loading) {
    return (
      <span className="tb-v2-btn tb-v2-btn-primary opacity-60" aria-label="Checking session">
        ...
      </span>
    );
  }

  if (user) {
    const displayName = String(user.name || user.email || 'Account');
    const displayEmail = String(user.email || '');

    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          aria-expanded={menuOpen}
          aria-haspopup="true"
          aria-label="Account menu"
        >
          <span className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-semibold uppercase">
            {displayName.charAt(0)}
          </span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-50">
            <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{displayName}</p>
              {displayEmail && <p className="text-xs text-gray-500 truncate">{displayEmail}</p>}
            </div>
            <Link
              href="/dashboard"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Sign out
            </button>
          </div>
        )}

        {menuOpen && (
          <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
        )}
      </div>
    );
  }

  return (
    <Link href="/login" className="tb-v2-btn tb-v2-btn-ghost tb-v2-nav-signin-icon" aria-label="Sign in">
      <IconUser className="tb-v2-ic" />
    </Link>
  );
}
