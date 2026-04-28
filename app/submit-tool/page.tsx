'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.toolblip.com';

interface ToolSuggestion {
  name: string;
  url: string;
  description: string;
  category: string;
  email: string;
}

const CATEGORIES = [
  'Developer Tools',
  'Text Tools',
  'Image Tools',
  'Color Tools',
  'Conversion Tools',
  'Encoder / Decoder',
  'SEO Tools',
  'Math Tools',
  'Network Tools',
  'CSS Tools',
  'Utility',
  'PDF Tools',
  'Video Tools',
  'AI Tools',
  'Document Generator',
];

export default function SubmitToolPage() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [checked, setChecked] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<ToolSuggestion>({
    name: '',
    url: '',
    description: '',
    category: '',
    email: '',
  });

  useEffect(() => {
    const raw = localStorage.getItem('toolblip_user');
    if (raw) {
      try {
        const u = JSON.parse(raw) as { name: string; email: string };
        setUser(u);
        setForm((f) => ({ ...f, email: u.email }));
      } catch {
        // invalid stored user
      }
    }
    setChecked(true);
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.description || !form.category) {
      setError('Please fill in all required fields.');
      return;
    }
    setError(null);
    setSubmitting(true);

    try {
      const token = localStorage.getItem('toolblip_token');
      const res = await fetch(`${API_BASE}/api/tools/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token ?? ''}`,
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? 'Submission failed. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (!checked) return null;

  // Not logged in - show auth prompt
  if (!user) {
    return (
      <div className="tb-v2-container" style={{ paddingTop: '64px', paddingBottom: '96px' }}>
        <div className="tb-v2-mm-card" style={{ maxWidth: '480px', margin: '0 auto', textAlign: 'center', padding: '48px 32px' }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>🔐</div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--fg-1)', marginBottom: '8px' }}>
            Sign in to submit a tool
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--fg-2)', marginBottom: '28px', lineHeight: '1.6' }}>
            You need a Toolblip account to submit a tool to the community directory.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link
              href="/login?next=/submit-tool"
              className="tb-v2-btn tb-v2-btn-primary"
              style={{ justifyContent: 'center' }}
            >
              Sign In
            </Link>
            <Link
              href="/signup?next=/submit-tool"
              className="tb-v2-btn tb-v2-btn-secondary"
              style={{ justifyContent: 'center' }}
            >
              Create Account
            </Link>
          </div>
          <p style={{ marginTop: '20px', fontSize: '13px', color: 'var(--fg-3)' }}>
            Free forever. No credit card required.
          </p>
        </div>
      </div>
    );
  }

  // Logged in - show form
  if (submitted) {
    return (
      <div className="tb-v2-container" style={{ paddingTop: '64px', paddingBottom: '96px' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto', textAlign: 'center', padding: '64px 32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--fg-1)', marginBottom: '8px' }}>
            Tool submitted!
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--fg-2)', marginBottom: '24px', lineHeight: '1.6' }}>
            Thanks for contributing to Toolblip. We will review <strong>{form.name}</strong> and add it to the directory if it meets our standards.
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <Link href="/tools" className="tb-v2-btn tb-v2-btn-secondary">
              Browse Tools
            </Link>
            <button
              onClick={() => setSubmitted(false)}
              className="tb-v2-btn tb-v2-btn-primary"
            >
              Submit Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tb-v2-container" style={{ paddingTop: '48px', paddingBottom: '96px' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>
        {/* Breadcrumb */}
        <nav className="tb-v2-breadcrumb" style={{ marginBottom: '24px' }}>
          <Link href="/">Home</Link>
          <span className="tb-v2-breadcrumb-sep">›</span>
          <span>Submit Tool</span>
        </nav>

        <div className="tb-v2-tool-header" style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--fg-1)', marginBottom: '6px' }}>
            Submit a Tool
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--fg-2)' }}>
            Know a great free tool that should be on Toolblip? Let us know and we will review it for the directory.
          </p>
        </div>

        <div className="tb-v2-tool-card">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Name */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--fg-1)' }} htmlFor="name">
                Tool name <span style={{ color: 'var(--red)' }}>*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. JSON Formatter"
                style={{
                  height: '38px', padding: '0 12px',
                  border: '1px solid var(--line)', borderRadius: '8px',
                  background: 'var(--surface)', color: 'var(--fg-1)',
                  fontSize: '14px', outline: 'none',
                }}
              />
            </div>

            {/* URL */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--fg-1)' }} htmlFor="url">
                Tool URL <span style={{ color: 'var(--red)' }}>*</span>
              </label>
              <input
                id="url"
                name="url"
                type="url"
                required
                value={form.url}
                onChange={handleChange}
                placeholder="https://..."
                style={{
                  height: '38px', padding: '0 12px',
                  border: '1px solid var(--line)', borderRadius: '8px',
                  background: 'var(--surface)', color: 'var(--fg-1)',
                  fontSize: '14px', outline: 'none',
                }}
              />
            </div>

            {/* Category */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--fg-1)' }} htmlFor="category">
                Category <span style={{ color: 'var(--red)' }}>*</span>
              </label>
              <select
                id="category"
                name="category"
                required
                value={form.category}
                onChange={handleChange}
                style={{
                  height: '38px', padding: '0 12px',
                  border: '1px solid var(--line)', borderRadius: '8px',
                  background: 'var(--surface)', color: 'var(--fg-1)',
                  fontSize: '14px', outline: 'none', cursor: 'pointer',
                }}
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--fg-1)' }} htmlFor="description">
                Description <span style={{ color: 'var(--red)' }}>*</span>
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                value={form.description}
                onChange={handleChange}
                placeholder="Briefly describe what this tool does and why it belongs on Toolblip..."
                style={{
                  padding: '10px 12px',
                  border: '1px solid var(--line)', borderRadius: '8px',
                  background: 'var(--surface)', color: 'var(--fg-1)',
                  fontSize: '14px', outline: 'none', resize: 'vertical', lineHeight: '1.5',
                }}
              />
            </div>

            {/* Email */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--fg-1)' }} htmlFor="email">
                Your email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                style={{
                  height: '38px', padding: '0 12px',
                  border: '1px solid var(--line)', borderRadius: '8px',
                  background: 'var(--surface)', color: 'var(--fg-1)',
                  fontSize: '14px', outline: 'none',
                }}
              />
              <p style={{ fontSize: '12px', color: 'var(--fg-3)' }}>
                Pre-filled from your account. We will only use this to follow up on your submission.
              </p>
            </div>

            {error && (
              <div style={{
                padding: '10px 14px', borderRadius: '8px',
                background: 'color-mix(in srgb, var(--red) 10%, transparent)',
                border: '1px solid color-mix(in srgb, var(--red) 30%, transparent)',
                color: 'var(--red)', fontSize: '13px',
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="tb-v2-btn tb-v2-btn-primary"
              style={{ alignSelf: 'flex-start', height: '40px', padding: '0 20px', fontSize: '14px' }}
            >
              {submitting ? 'Submitting...' : 'Submit Tool'}
            </button>
          </form>
        </div>

        <p style={{ marginTop: '16px', fontSize: '12px', color: 'var(--fg-3)', textAlign: 'center' }}>
          We review submissions within 1-2 weeks. Submitted tools must be free and publicly accessible.
        </p>
      </div>
    </div>
  );
}
