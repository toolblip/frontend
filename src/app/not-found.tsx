'use client';

import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-[0.2em] mb-6">
          Oops!
        </p>
        <p className="text-[8rem] sm:text-[10rem] font-black leading-none text-green-500 dark:text-green-400 select-none mb-2 tracking-tighter">
          404
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Page not found
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-10 text-base">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors text-sm"
          >
            <Home size={16} />
            Go home
          </Link>
          <Link
            href="/tools"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300 font-medium py-2.5 px-6 rounded-lg transition-colors text-sm"
          >
            <Search size={16} />
            Browse tools
          </Link>
        </div>
      </div>
    </div>
  );
}
