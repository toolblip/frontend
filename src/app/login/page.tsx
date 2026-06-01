import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sign In | Toolblip',
  description: 'Sign in to your Toolblip account to save API keys, manage your profile, and submit MCP servers.',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Sign In | Toolblip',
    description: 'Sign in to your Toolblip account to save API keys, manage your profile, and submit MCP servers.',
    url: 'https://toolblip.com/login',
    siteName: 'Toolblip',
    type: 'website',
    locale: 'en_US',
    images: [{ url: 'https://toolblip.com/og-preview.png', width: 1200, height: 630, alt: 'Toolblip' }],
  },
  twitter: {
    card: 'summary',
    title: 'Sign In | Toolblip',
    description: 'Sign in to your Toolblip account to save API keys, manage your profile, and submit MCP servers.',
  },
};

export default function LoginPage() {
  return (
    <main className="max-w-md mx-auto px-4 py-20">
      <div className="text-center mb-8">
        <h1
          className="mb-3"
          style={{
            fontFamily: 'var(--f-display)',
            fontSize: 'clamp(24px, 4vw, 36px)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: 'var(--fg-0)',
          }}
        >
          Log In
        </h1>
        <p style={{ color: 'var(--fg-2)', fontSize: '15px' }}>
          Sign in to your Toolblip account
        </p>
      </div>

      <div
        className="p-8 rounded-2xl border border-[var(--line)]"
        style={{ background: 'var(--surface-2)' }}
      >
        <div className="p-4 rounded-xl border border-dashed border-[var(--line)] text-center"
          style={{ color: 'var(--fg-3)', fontSize: '14px' }}>
          Login form coming soon.
        </div>
      </div>

      <p className="text-center mt-6" style={{ color: 'var(--fg-2)', fontSize: '14px' }}>
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-[var(--red)] hover:underline">
          Sign up
        </Link>
      </p>

      <p className="text-center mt-3">
        <Link href="/" className="text-sm" style={{ color: 'var(--fg-3)' }}>
          ← Back to home
        </Link>
      </p>
    </main>
  );
}
