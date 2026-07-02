'use client';

import { useState, useEffect } from 'react';

interface ServiceStatus {
  name: string;
  url: string;
  status: 'checking' | 'up' | 'down';
  latency: number | null;
}

const SERVICES: { name: string; url: string }[] = [
  { name: 'Frontend', url: 'https://toolblip.com' },
  { name: 'API', url: 'https://api.toolblip.com/api/health' },
  { name: 'Custom Domain', url: 'https://api.toolblip.com' },
];

function StatusDot({ status }: { status: ServiceStatus['status'] }) {
  const colorMap = {
    checking: 'bg-yellow-400 animate-pulse',
    up: 'bg-green-500',
    down: 'bg-red-500',
  };

  return (
    <span
      className={`inline-block w-4 h-4 rounded-full flex-shrink-0 shadow-sm ${colorMap[status]}`}
    />
  );
}

export default function FrontendHealthClient() {
  const [services, setServices] = useState<ServiceStatus[]>(
    SERVICES.map((s) => ({ ...s, status: 'checking', latency: null }))
  );
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function checkService(service: (typeof SERVICES)[number]): Promise<ServiceStatus> {
      const start = performance.now();
      try {
        const timeout = setTimeout(() => controller.abort(), 5000);
        const res = await fetch(service.url, {
          signal: controller.signal,
          cache: 'no-store',
          mode: 'no-cors',
        });
        clearTimeout(timeout);

        const latency = Math.round(performance.now() - start);

        // When using no-cors, response is opaque — status is always 0.
        // Treat any non-error response as "up".
        return {
          ...service,
          status: 'up' as const,
          latency,
        };
      } catch {
        const latency = Math.round(performance.now() - start);
        return {
          ...service,
          status: 'down' as const,
          latency,
        };
      }
    }

    async function runChecks() {
      const results = await Promise.all(
        SERVICES.map((s) => checkService(s).catch(() => ({
          ...s,
          status: 'down' as const,
          latency: null,
        })))
      );
      setServices(results);
      setLastChecked(new Date());
    }

    runChecks();

    return () => controller.abort();
  }, []);

  const allUp = services.every((s) => s.status === 'up');
  const stillChecking = services.some((s) => s.status === 'checking');

  return (
    <div className="tb-v2-page">
      <div className="tb-v2-container">
        <div className="tb-v2-article">
          <div className="tb-v2-kicker">System Status</div>
          <h1 className="tb-v2-page-title">Frontend Health</h1>

          <div className="tb-v2-article-section">
            <p>
              Live status checks for Toolblip&apos;s frontend, API, and custom domain.
              Each endpoint is tested with a 5-second timeout. Status refreshes on page load.
            </p>
          </div>

          {/* Overall banner */}
          <div
            className={`rounded-2xl border p-5 mb-10 text-sm font-semibold ${
              stillChecking
                ? 'border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950/40 dark:text-yellow-300'
                : allUp
                  ? 'border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950/40 dark:text-green-300'
                  : 'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300'
            }`}
          >
            {stillChecking
              ? '⏳ Running health checks…'
              : allUp
                ? '✅ All services operational'
                : '⚠️ Some services are unreachable'}
          </div>

          {/* Status cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.name}
                className={`rounded-2xl border p-5 transition-shadow ${
                  service.status === 'checking'
                    ? 'border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900/60'
                    : service.status === 'up'
                      ? 'border-green-200 bg-white shadow-sm dark:border-green-800 dark:bg-slate-900/60'
                      : 'border-red-200 bg-white shadow-sm dark:border-red-800 dark:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <StatusDot status={service.status} />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {service.name}
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>Status</span>
                    <span
                      className={`font-semibold ${
                        service.status === 'checking'
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : service.status === 'up'
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {service.status === 'checking'
                        ? 'Checking…'
                        : service.status === 'up'
                          ? 'Operational'
                          : 'Unreachable'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Response time</span>
                    <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                      {service.latency !== null ? `${service.latency}ms` : '—'}
                    </span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                    <span className="block truncate font-mono text-xs text-slate-400 dark:text-slate-500">
                      {service.url}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Last checked timestamp */}
          <div className="mt-10 text-center text-xs text-slate-400 dark:text-slate-500">
            {lastChecked
              ? `Last checked: ${lastChecked.toLocaleTimeString()} · ${lastChecked.toLocaleDateString()}`
              : 'Checking…'}
          </div>
        </div>
      </div>
    </div>
  );
}
