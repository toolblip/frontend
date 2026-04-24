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
        const msg = data.message ?? (data.errors ? Object.values(data.errors).flat().join(', ') : 'Could not create account. Please try again.');
        setError(msg);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="tb-v2-auth">
      <div className="tb-v2-container">
        <div className="tb-v2-auth-card">
          <h1 className="tb-v2-auth-title">Create account</h1>

          <form onSubmit={handleSubmit} className="tb-v2-auth-form" noValidate>
            {error && <p role="alert" className="tb-v2-auth-error">{error}</p>}

            <div className="tb-v2-auth-field">
              <label htmlFor="name" className="tb-v2-auth-label">Name</label>
              <input
                id="name"
                type="text"
                name="name"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="tb-v2-auth-input"
                placeholder="Harun Rayhan"
              />
            </div>

            <div className="tb-v2-auth-field">
              <label htmlFor="email" className="tb-v2-auth-label">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="tb-v2-auth-input"
                placeholder="you@example.com"
              />
            </div>

            <div className="tb-v2-auth-field">
              <label htmlFor="password" className="tb-v2-auth-label">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="tb-v2-auth-input"
                placeholder="Min. 8 characters"
              />
              <PasswordStrength password={password} />
            </div>

            <div className="tb-v2-auth-field">
              <label htmlFor="password-confirm" className="tb-v2-auth-label">Confirm password</label>
              <input
                id="password-confirm"
                type="password"
                name="password_confirmation"
                required
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="tb-v2-auth-input"
                placeholder="Repeat password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="tb-v2-auth-submit"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="tb-v2-auth-footer">
            Already have an account?{' '}
            <Link href="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
