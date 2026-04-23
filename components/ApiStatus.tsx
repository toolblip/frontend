'use client';

import { useState, useEffect } from 'react';

type ApiState = 'checking' | 'online' | 'offline';

export default function ApiStatus() {
  const [state, setState] = useState<ApiState>('checking');

  useEffect(() => {
    const check = async () => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.toolblip.com'}/api/tools`, {
          signal: controller.signal,
          cache: 'no-store',
        });
        clearTimeout(timeout);

        if (res.ok) {
          setState('online');
        } else {
          setState('offline');
        }
      } catch {
        setState('offline');
      }
    };

    check();
  }, []);

  return (
    <div className="flex items-center gap-1.5" title={`API: ${state === 'checking' ? 'Checking...' : state === 'online' ? 'Online' : 'Offline'}`}>
      <span
        className={`w-2 h-2 rounded-full inline-block ${
          state === 'checking'
            ? 'bg-yellow-400 animate-pulse'
            : state === 'online'
            ? 'bg-red-500'
            : 'bg-red-500'
        }`}
      />
      <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:inline">
        {state === 'checking' ? 'Checking...' : state === 'online' ? 'API Online' : 'Offline'}
      </span>
    </div>
  );
}
