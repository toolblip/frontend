import type { Metadata } from 'next';
import { Suspense } from 'react';
import Script from 'next/script';
import CookieBanner from '@/components/CookieBanner';
import Analytics from '@/components/Analytics';
import ThemeProvider from '@/components/ThemeProvider';
import ThemeToggle from '@/components/ThemeToggle';
import NavbarRight from '@/components/NavbarRight';
import ApiStatus from '@/components/ApiStatus';
import TopLoader from '@/components/TopLoader';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Toolblip — Free Online Developer Tools',
    template: '%s | Toolblip',
  },
  description:
    'Free browser-based tools: word counter, JSON formatter, Base64, URL encoder, UUID generator, and more. 100% client-side, no uploads, no account needed.',
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <Script
          id="theme-init"
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme');var d=document.documentElement;var isDark=t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(isDark)d.classList.add('dark');})()`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 antialiased transition-colors">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-red-600 focus:text-white focus:rounded-lg focus:text-sm focus:font-medium"
        >
          Skip to content
        </a>

        <ThemeProvider>
        <Suspense fallback={null}><TopLoader /></Suspense>
        {/* Nav */}
        <header className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2.5 flex-shrink-0">
              <img src="/logos/logo.png" alt="Toolblip" className="h-7 w-auto object-contain dark:hidden" />
              <img src="/logos/logo-dark.png" alt="Toolblip" className="h-7 w-auto object-contain hidden dark:block" />
            </a>

            {/* Nav links - center */}
            <nav aria-label="Main navigation" className="hidden md:flex items-center gap-8 text-sm">
              <a href="/tools" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                All Tools
              </a>
              <a href="/directory" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                Directory
              </a>
              <a href="/blog" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                Blog
              </a>
              <a href="/api-docs" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                API Docs
              </a>
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <NavbarRight />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main id="main-content" className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-gray-800 mt-16 py-6">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-4">
              <span>
                &copy; {new Date().getFullYear()} Toolblip. Built to stay out of your way.
              </span>
              <ApiStatus />
            </div>
            <nav aria-label="Footer navigation" className="flex gap-5">
              <a href="/about" className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
                About
              </a>
              <a href="/privacy" className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
                Privacy
              </a>
              <a href="/terms" className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
                Terms
              </a>
              <a href="/donate" className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
                Donate
              </a>
            </nav>
          </div>
        </footer>

        <Analytics />
        <CookieBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}
// force push
