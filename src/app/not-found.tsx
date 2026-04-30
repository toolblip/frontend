import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-[10rem] leading-none font-bold tracking-tight text-green-500 dark:text-green-400 mb-6 select-none">
        404
      </div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
        Page not found
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-10 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          href="/"
          className="px-6 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 active:scale-95 transition-all"
        >
          Go home
        </Link>
        <Link
          href="/tools"
          className="px-6 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:border-green-500 dark:hover:border-green-500 hover:text-green-600 dark:hover:text-green-400 active:scale-95 transition-all"
        >
          Browse tools
        </Link>
      </div>
    </div>
  );
}
