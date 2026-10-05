import type { InstallBrowser, InstallOs } from '@/lib/pwa-install';

type MarkKind = InstallOs | InstallBrowser;

export default function InstallMark({ kind }: { kind: MarkKind }) {
  return (
    <span className="tb-pwa-mark" aria-hidden="true">
      {mark(kind)}
    </span>
  );
}

function mark(kind: MarkKind) {
  switch (kind) {
    case 'chrome':
      return (
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" fill="#4285f4" />
          <path fill="#ea4335" d="M12 2a10 10 0 0 1 8.66 5H12V2z" />
          <path fill="#fbbc05" d="M20.66 7A10 10 0 0 1 7.1 20.3L12 12l8.66-5z" />
          <path fill="#34a853" d="M7.1 20.3A10 10 0 0 1 3.34 7H12l-4.9 13.3z" />
          <circle cx="12" cy="12" r="4.2" fill="#fff" />
          <circle cx="12" cy="12" r="3" fill="#4285f4" />
        </svg>
      );
    case 'safari':
      return (
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" fill="#1c7cf2" />
          <circle cx="12" cy="12" r="7.2" fill="none" stroke="#fff" strokeWidth="0.7" opacity="0.85" />
          <path d="m12 4.8 1.5 7.2L12 19.2 10.5 12z" fill="#fff" />
          <path d="M12 4.8 13.5 12 12 12z" fill="#e23b2f" />
        </svg>
      );
    case 'edge':
      return (
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" fill="#0c59a4" />
          <path fill="#36c5f0" d="M4.5 14.5c2.2 3.6 6 5.2 10 4.2 2.6-.6 4.6-2.4 5.5-4.6-2.4 1.6-5.2 1.8-8.2.2-2.2-1.2-4.2-1.2-7.3.2z" />
          <path d="M6.5 15.2c2.4 2 5.4 2.2 8.2.8" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case 'firefox':
      return (
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" fill="#ff7139" />
          <path fill="#6d28d9" d="M6.5 16.5c.8-5 3.6-8.2 8-9.2-1.8 2-1.6 4-.4 5.8 1.8-1.2 3-3.2 3.8-5.4.8 2.2.6 5.2-1.4 7.6-2.2 2.6-6.4 2.8-10 .2z" />
          <circle cx="9.2" cy="12.6" r="1" fill="#1e1b4b" />
        </svg>
      );
    case 'opera':
      return (
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" fill="#ff1b2d" />
          <circle cx="12" cy="12" r="4.2" fill="none" stroke="#fff" strokeWidth="2.2" />
        </svg>
      );
    case 'samsung':
      return (
        <svg viewBox="0 0 24 24">
          <rect x="2" y="2" width="20" height="20" rx="6" fill="#4b3dff" />
          <path fill="#fff" d="M7 8.2h9.2a1.8 1.8 0 0 1 1.8 1.8v3.2a1.8 1.8 0 0 1-1.8 1.8H11l-2.6 2v-2H7a1.8 1.8 0 0 1-1.8-1.8v-3.2A1.8 1.8 0 0 1 7 8.2z" />
        </svg>
      );
    case 'ios':
      return (
        <svg viewBox="0 0 24 24">
          <rect x="7" y="2" width="10" height="20" rx="2.4" fill="#1d1d1f" />
          <rect x="8.3" y="4.2" width="7.4" height="13.2" rx="0.6" fill="#f2f2f4" />
          <circle cx="12" cy="19.3" r="0.7" fill="#f2f2f4" />
        </svg>
      );
    case 'android':
      return (
        <svg viewBox="0 0 24 24">
          <path d="M7 6.2 8.4 8.6M17 6.2 15.6 8.6" stroke="#3ddc84" strokeWidth="1.4" strokeLinecap="round" />
          <rect x="5" y="9" width="14" height="9.5" rx="4" fill="#3ddc84" />
          <circle cx="9.2" cy="13" r="1" fill="#064e3b" />
          <circle cx="14.8" cy="13" r="1" fill="#064e3b" />
          <path d="M8 18.2v2.2M16 18.2v2.2" stroke="#3ddc84" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case 'mac':
      return (
        <svg viewBox="0 0 24 24">
          <rect x="3.5" y="4" width="17" height="11.5" rx="1.4" fill="#d1d1d6" />
          <rect x="4.8" y="5.2" width="14.4" height="8.6" rx="0.4" fill="#1d1d1f" />
          <path fill="#a1a1a6" d="M2 17.2h20l-1.8 2.2H3.8z" />
        </svg>
      );
    case 'windows':
      return (
        <svg viewBox="0 0 24 24">
          <path fill="#f25022" d="M3 5.2 11 4v7.2H3z" />
          <path fill="#7fba00" d="M12.2 3.8 21 2.5v8.7h-8.8z" />
          <path fill="#00a4ef" d="M3 12.8h8V20l-8-1.1z" />
          <path fill="#ffb900" d="M12.2 12.8H21V21l-8.8-1.2z" />
        </svg>
      );
    case 'chromeos':
      return (
        <svg viewBox="0 0 24 24">
          <rect x="3.5" y="4" width="17" height="11.5" rx="1.4" fill="#d1d1d6" />
          <rect x="4.8" y="5.2" width="14.4" height="8.6" rx="0.4" fill="#1d1d1f" />
          <circle cx="12" cy="9.4" r="2.1" fill="#4285f4" />
          <path fill="#ea4335" d="M12 7.3a2.1 2.1 0 0 1 1.8 1h-1.8z" />
          <path fill="#a1a1a6" d="M2 17.2h20l-1.8 2.2H3.8z" />
        </svg>
      );
    case 'linux':
      return (
        <svg viewBox="0 0 24 24">
          <ellipse cx="12" cy="14.2" rx="5.6" ry="6.2" fill="#1f2937" />
          <ellipse cx="12" cy="15" rx="3" ry="4" fill="#f8fafc" />
          <circle cx="12" cy="7.2" r="3" fill="#1f2937" />
          <ellipse cx="12" cy="8.1" rx="1.5" ry="0.9" fill="#f5c518" />
          <circle cx="10.9" cy="6.6" r="0.45" fill="#fff" />
          <circle cx="13.1" cy="6.6" r="0.45" fill="#fff" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24">
          <rect x="3" y="4" width="18" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="M8 20h8M12 16v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
  }
}
