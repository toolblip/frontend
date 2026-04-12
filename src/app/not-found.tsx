import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-32 text-center">
      <h1 className="text-6xl font-bold text-white mb-4">404</h1>
      <p className="text-gray-400 mb-8">Page not found.</p>
      <Link
        href="/"
        className="text-green-400 hover:text-green-300 transition-colors text-sm"
      >
        ← Back to home
      </Link>
    </div>
  );
}
