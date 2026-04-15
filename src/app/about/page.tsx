import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | Toolblip',
  description:
    'Toolblip is a collection of free developer and productivity tools that run entirely in your browser. No servers, no uploads, no accounts required.',
  openGraph: {
    title: 'About | Toolblip',
    description: 'Toolblip is a collection of free developer and productivity tools that run entirely in your browser. No servers, no uploads, no accounts required.',
    url: 'https://toolblip.com/about',
    siteName: 'Toolblip',
  },
  twitter: { card: 'summary', title: 'About | Toolblip', description: 'Toolblip is a collection of free developer and productivity tools that run entirely in your browser.' },
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">About Toolblip</h1>

      <div className="space-y-6 text-gray-600 dark:text-gray-300 leading-relaxed">
        <p>
          Toolblip is a collection of free developer and productivity tools that run entirely in your browser.
          There are no servers, no uploads, and no accounts required. You paste your data in, get your result out,
          and nothing leaves your machine.
        </p>

        <p>
          Privacy-first is not a marketing phrase here. Every tool on Toolblip processes data locally using
          JavaScript. Base64 encoding, JSON formatting, text conversion, image manipulation — all of it happens
          client-side. The only analytics collected are cookieless page-view stats via Cloudflare, and optional
          Google Analytics loaded only after you give consent.
        </p>

        <p>
          Toolblip is built and maintained by{' '}
          <a
            href="https://github.com/HarunRRayhan"
            className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
          >
            Harun R Rayhan
          </a>
          . He also builds{' '}
          <a href="https://crontinel.com" className="text-green-400 hover:text-green-300 transition-colors">
            Crontinel
          </a>
          , a Laravel cron and queue monitoring tool for production apps. Both projects share the same goal:
          useful software that respects the people using it.
        </p>
      </div>
    </div>
  );
}
