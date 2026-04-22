'use client';

import { useState } from 'react';
import Link from 'next/link';
import PasswordStrength from '@/components/ui/PasswordStrength';

export default function SignupForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://api.toolblip.com'}/api/auth/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({ name, email, password, password_confirmation: confirm }),
        }
      );
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('toolblip_token', data.token);
        localStorage.setItem('toolblip_user', JSON.stringify(data.user));
        window.location.href = '/';
      } else {
        const msg = data.message ?? data.errors ? Object.values(data.errors).flat().join(', ') : 'Could not create account. Please try again.';
        setError(msg);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">Create account</h1>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
        <span className="text-gray-500 dark:text-gray-400 text-sm">or</span>
        <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error && <p role="alert" className="text-red-600 dark:text-red-400 text-sm">{error}</p>}

        <div>
          <label htmlFor="name" className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Name</label>
          <input id="name" type="text" name="name" required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)}
            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-green-500 transition-colors" />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Email</label>
          <input id="email" type="email" name="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-green-500 transition-colors" />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Password</label>
          <input id="password" type="password" name="password" required autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-green-500 transition-colors" />
          <PasswordStrength password={password} />
        </div>

        <div>
          <label htmlFor="password-confirm" className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Confirm password</label>
          <input id="password-confirm" type="password" name="password_confirmation" required autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-green-500 transition-colors" />
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors text-sm">
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Already have an account?{' '}
        <Link href="/login" className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 underline transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
