'use client';

import Link from 'next/link';
import { Home, Wrench } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center animate-in fade-in zoom-in duration-500">
        <p className="text-[8rem] sm:text-[10rem] font-black leading-none text-[#58D65D] dark:text-[#58D65D] select-none mb-2 tracking-tighter">
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
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#58D65D] hover:bg-[#4bc44e] text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 text-sm hover:shadow-lg hover:shadow-[#58D65D]/20 hover:-translate-y-0.5"
          >
            <Home size={16} />
            Go home
          </Link>
          <Link
            href="/tools"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-700 hover:border-[#58D65D] dark:hover:border-[#58D65D] text-gray-700 dark:text-gray-300 font-medium py-2.5 px-6 rounded-lg transition-all duration-200 text-sm hover:text-[#58D65D] dark:hover:text-[#58D65D] hover:-translate-y-0.5"
          >
            <Wrench size={16} />
            Browse tools
          </Link>
        </div>
      </div>
    </div>
  );
}
