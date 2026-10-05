import InstallMark from '@/components/v2/InstallMarks';
import type { InstallOs, InstallVisual } from '@/lib/pwa-install';

export default function InstallGuideScene({ visual, os }: { visual: InstallVisual; os: InstallOs }) {
  return (
    <figure className="tb-pwa-scene">
      <div className="tb-pwa-scene-stage" aria-hidden="true">
        {stage(visual, os)}
      </div>
      <figcaption>{caption(visual, os)}</figcaption>
    </figure>
  );
}

function caption(visual: InstallVisual, os: InstallOs): string {
  switch (visual) {
    case 'omnibox':
      return 'The install icon is at the right end of the address bar.';
    case 'edge-bar':
      return 'Edge uses the same spot. The icon looks like a screen with a plus.';
    case 'safari-dock':
      return 'Open File in the menu bar, then Add to Dock.';
    case 'firefox-desktop':
      return os === 'mac'
        ? "Firefox can't add this to the Dock. Chrome, Edge, or Safari can."
        : "Firefox can't install this. Open the page in Chrome or Edge.";
    case 'ios-share':
      return 'Tap Share at the bottom of Safari, then Add to Home Screen.';
    case 'ios-other':
      return 'Only Safari can add the icon. Open toolblip.com there, then use Share.';
    case 'android-menu':
      return 'Tap the three dots at the top right, then Install app.';
    case 'samsung-menu':
      return 'Tap the menu at the bottom right, then Add page to and Home screen.';
    case 'android-firefox':
      return 'Tap the menu, then Install.';
    case 'android-edge':
      return 'Tap the menu at the bottom, then Add to phone.';
    default:
      return 'Open the browser menu and look for Install or Add to Home Screen.';
  }
}

function stage(visual: InstallVisual, os: InstallOs) {
  switch (visual) {
    case 'omnibox':
    case 'edge-bar':
      return <Omnibox edge={visual === 'edge-bar'} />;
    case 'safari-dock':
      return <SafariMenu />;
    case 'firefox-desktop':
      return <FirefoxSwap mac={os === 'mac'} />;
    case 'ios-share':
      return <IosShare />;
    case 'ios-other':
      return <IosOther />;
    case 'android-menu':
      return <AndroidMenu item="Install app" top />;
    case 'samsung-menu':
      return <AndroidMenu item="Add page to" top={false} />;
    case 'android-firefox':
      return <AndroidMenu item="Install" top={false} />;
    case 'android-edge':
      return <AndroidMenu item="Add to phone" top={false} />;
    default:
      return <AndroidMenu item="Install app" top />;
  }
}

function Badge({ n }: { n: number }) {
  return <span className="tb-pwa-badge">{n}</span>;
}

function Omnibox({ edge }: { edge: boolean }) {
  return (
    <div className="tb-pwa-window">
      <div className="tb-pwa-window-dots">
        <i />
        <i />
        <i />
      </div>
      <div className="tb-pwa-url">
        <span>toolblip.com</span>
        <span className="tb-pwa-hot tb-pwa-install-glyph">
          {edge ? <EdgeInstallIcon /> : <ChromeInstallIcon />}
          <Badge n={1} />
        </span>
      </div>
    </div>
  );
}

function ChromeInstallIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <rect x="4" y="4" width="12" height="10" rx="1.4" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M16 9h3v8a1.5 1.5 0 0 1-1.5 1.5H8" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M10 12v4M8 14l2 2 2-2" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function EdgeInstallIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <rect x="4" y="5" width="16" height="12" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 8v5M9.5 11 12 13.5 14.5 11" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function SafariMenu() {
  return (
    <div className="tb-pwa-window tb-pwa-window-menu">
      <div className="tb-pwa-menubar">
        <span className="tb-pwa-hot">
          File
          <Badge n={1} />
        </span>
        <span>Edit</span>
        <span>View</span>
        <span>History</span>
      </div>
      <div className="tb-pwa-dropdown">
        <span>New Window</span>
        <span className="tb-pwa-hot">
          Add to Dock
          <Badge n={2} />
        </span>
        <span>Share</span>
      </div>
    </div>
  );
}

function FirefoxSwap({ mac }: { mac: boolean }) {
  return (
    <div className="tb-pwa-swap">
      <span className="tb-pwa-swap-label">Open this page in</span>
      <span className="tb-pwa-swap-apps">
        <span className="tb-pwa-swap-app">
          <InstallMark kind="chrome" />
          Chrome
        </span>
        <span className="tb-pwa-swap-app">
          <InstallMark kind="edge" />
          Edge
        </span>
        {mac ? (
          <span className="tb-pwa-swap-app">
            <InstallMark kind="safari" />
            Safari
          </span>
        ) : null}
      </span>
    </div>
  );
}

function IosShare() {
  return (
    <div className="tb-pwa-phone">
      <div className="tb-pwa-phone-url">toolblip.com</div>
      <div className="tb-pwa-sheet">
        <span>Copy</span>
        <span className="tb-pwa-hot">
          Add to Home Screen
          <Badge n={2} />
        </span>
        <span>Add Bookmark</span>
      </div>
      <div className="tb-pwa-toolbar">
        <i />
        <span className="tb-pwa-hot tb-pwa-share">
          <svg viewBox="0 0 24 24">
            <path d="M12 4v10M8 8l4-4 4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M6 12v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-6" fill="none" stroke="currentColor" strokeWidth="1.8" />
          </svg>
          <Badge n={1} />
        </span>
        <i />
      </div>
    </div>
  );
}

function IosOther() {
  return (
    <div className="tb-pwa-swap tb-pwa-swap-phone">
      <span className="tb-pwa-swap-app tb-pwa-hot">
        <InstallMark kind="safari" />
        Open in Safari
        <Badge n={1} />
      </span>
      <span className="tb-pwa-swap-then">then Share, then Add to Home Screen</span>
    </div>
  );
}

function AndroidMenu({ item, top }: { item: string; top: boolean }) {
  return (
    <div className={`tb-pwa-phone ${top ? 'is-top' : 'is-bottom'}`}>
      <div className="tb-pwa-phone-url">
        <span>toolblip.com</span>
        {top ? (
          <span className="tb-pwa-hot tb-pwa-dots">
            ···
            <Badge n={1} />
          </span>
        ) : null}
      </div>
      <div className={`tb-pwa-sheet ${top ? '' : 'is-low'}`}>
        <span>Bookmarks</span>
        <span className="tb-pwa-hot">
          {item}
          <Badge n={2} />
        </span>
        <span>Settings</span>
      </div>
      {top ? null : (
        <div className="tb-pwa-toolbar">
          <i />
          <i />
          <span className="tb-pwa-hot tb-pwa-dots">
            ···
            <Badge n={1} />
          </span>
        </div>
      )}
    </div>
  );
}
