import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Toolblip — Free Online Developer Tools',
    template: '%s | Toolblip',
  },
  description: 'Free browser-based tools: word counter, JSON formatter, Base64, URL encoder, UUID generator, and more. 100% client-side, no uploads, no account needed.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://toolblip.com'),
  openGraph: {
    type: 'website',
    siteName: 'Toolblip',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-gray-950 text-gray-100 antialiased">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body className="min-h-screen flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-green-600 focus:text-white focus:rounded-lg focus:text-sm focus:font-medium"
        >
          Skip to content
        </a>

        {/* Nav */}
        <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <a
              href="/"
              className="text-lg font-bold text-white tracking-tight hover:text-green-400 transition-colors"
            >
              Toolblip
            </a>
            <nav aria-label="Main navigation" className="flex items-center gap-6 text-sm">
              <a href="/directory" className="text-gray-400 hover:text-white transition-colors">
                Directory
              </a>
              <a href="/tools" className="text-gray-400 hover:text-white transition-colors">
                All Tools
              </a>
              <span id="nav-auth">
                <a href="/login" className="text-gray-400 hover:text-white transition-colors">
                  Sign in
                </a>
              </span>
            </nav>
          </div>
        </header>

        {/* Page content */}
        <main id="main-content" className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-800 mt-16 py-8">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <span>
              &copy; {new Date().getFullYear()} Toolblip — 100% client-side, nothing leaves your browser.
            </span>
            <nav aria-label="Footer navigation" className="flex gap-5">
              <a href="/about" className="hover:text-gray-300 transition-colors">About</a>
              <a href="/privacy" className="hover:text-gray-300 transition-colors">Privacy</a>
              <a href="/terms" className="hover:text-gray-300 transition-colors">Terms</a>
              <a href="/donate" className="hover:text-gray-300 transition-colors">Donate</a>
            </nav>
          </div>
        </footer>

        {/* Cookie consent banner */}
        <div
          id="cookie-banner"
          className="hidden fixed bottom-0 inset-x-0 z-50 bg-gray-900 border-t border-gray-700 p-4"
        >
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-4 text-sm">
            <p className="text-gray-300 flex-1">
              We use analytics cookies to understand how tools are used. No personal data is sold or shared.{' '}
              <a href="/privacy" className="underline text-green-400 ml-1">Privacy policy</a>
            </p>
            <div className="flex gap-3 shrink-0">
              <button
                id="consent-accept"
                className="bg-green-500 hover:bg-green-400 text-black font-medium px-4 py-1.5 rounded-lg text-sm transition-colors"
              >
                Accept
              </button>
              <button
                id="consent-decline"
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-1.5 rounded-lg text-sm transition-colors"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
