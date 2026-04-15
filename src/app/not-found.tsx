import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 — Page Not Found',
  description: 'The page you were looking for does not exist.',
};

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 sm:py-32 text-center">
      <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Page not found.</p>
      <Link
        href="/"
        className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors text-sm"
      >
        ← Back to home
      </Link>
    </div>
  );
}
