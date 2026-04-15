import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 — Page Not Found',
  description: 'The page you were looking for does not exist.',
};

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 sm:py-32 text-center">
      <p className="text-8xl sm:text-9xl font-bold text-green-500 dark:text-green-400 mb-6 select-none">
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
          className="w-full sm:w-auto bg-green-600 hover:bg-green-500 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors text-sm"
        >
          Go home
        </Link>
        <Link
          href="/tools"
          className="w-full sm:w-auto border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300 font-medium py-2.5 px-6 rounded-lg transition-colors text-sm"
        >
          Browse tools
        </Link>
      </div>
    </div>
  );
}
