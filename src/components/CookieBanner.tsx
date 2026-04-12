'use client';

import { useEffect, useState } from 'react';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('toolblip_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  function accept() {
    localStorage.setItem('toolblip_cookie_consent', 'accepted');
    setVisible(false);
    window.dispatchEvent(new CustomEvent('toolblip:analytics:enable'));
  }

  function decline() {
    localStorage.setItem('toolblip_cookie_consent', 'declined');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 inset-x-0 z-50 bg-gray-900 border-t border-gray-700 p-4 shadow-2xl"
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-4 text-sm">
        <p className="text-gray-300 flex-1 leading-relaxed">
          We use analytics cookies to understand how tools are used. No personal data is sold or shared.{' '}
          <a href="/privacy" className="underline text-green-400 ml-1 hover:text-green-300 transition-colors">
            Privacy policy
          </a>
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={accept}
            aria-label="Accept analytics cookies"
            className="bg-green-500 hover:bg-green-400 text-black font-medium px-4 py-1.5 rounded-lg text-sm transition-colors"
          >
            Accept
          </button>
          <button
            onClick={decline}
            aria-label="Decline analytics cookies"
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-1.5 rounded-lg text-sm transition-colors"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
