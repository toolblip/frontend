'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [next, setNext] = useState('/');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nextParam = params.get('next');
    if (nextParam && nextParam.startsWith('/')) {
      setNext(nextParam);
    }
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://api.toolblip.com'}/api/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('toolblip_token', data.token);
        localStorage.setItem('toolblip_user', JSON.stringify(data.user));
        window.location.href = next;
      } else {
        setError(data.message ?? 'Invalid email or password.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">Sign in</h1>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
        <span className="text-gray-500 dark:text-gray-400 text-sm">or</span>
        <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error && <p role="alert" className="text-red-600 dark:text-red-400 text-sm">{error}</p>}

        <div>
          <label htmlFor="email" className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Email</label>
          <input id="email" type="email" name="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-green-500 transition-colors" />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Password</label>
          <input id="password" type="password" name="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-green-500 transition-colors" />
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors text-sm">
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 underline transition-colors">
          Sign up
        </Link>
      </p>
    </div>
  );
}
