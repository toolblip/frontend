'use client';

import { useState } from 'react';
import { IconDown } from '@/components/v2/icons';
import { usePwaInstall } from '@/hooks/usePwaInstall';

/** More → Product row: native install prompt, or iOS Add-to-Home-Screen tip. */
export default function InstallAppMoreRow({
  onClose,
  variant = 'mega',
}: {
  onClose?: () => void;
  variant?: 'mega' | 'mobile';
}) {
  const { mode, install } = usePwaInstall();
  const [iosOpen, setIosOpen] = useState(false);

  if (mode === 'hidden') return null;

  if (variant === 'mobile') {
    return (
      <>
        <button
          type="button"
          className="tb-v2-nav-mobile-install"
          onClick={() => {
            if (mode === 'prompt') {
              void install().then(() => onClose?.());
              return;
            }
            setIosOpen((o) => !o);
          }}
        >
          Install app
        </button>
        {mode === 'ios-tip' && iosOpen && (
          <p className="tb-v2-nav-mobile-install-tip">
            Tap Share, then <strong>Add to Home Screen</strong>.
          </p>
        )}
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        className="tb-v2-mm-more-row tb-v2-mm-more-row-btn"
        onClick={() => {
          if (mode === 'prompt') {
            void install().then(() => onClose?.());
            return;
          }
          setIosOpen((o) => !o);
        }}
      >
        <div className="tb-v2-mm-more-icon">
          <IconDown className="tb-v2-ic" />
        </div>
        <div className="tb-v2-mm-more-txt">
          <div className="tb-v2-mm-more-title">Install app</div>
          <div className="tb-v2-mm-more-desc">
            {mode === 'ios-tip'
              ? 'Add Toolblip to your Home Screen'
              : 'Use Toolblip offline on this device'}
          </div>
        </div>
      </button>
      {mode === 'ios-tip' && iosOpen && (
        <p className="tb-v2-mm-install-ios-tip">
          Tap the Share button, then choose <strong>Add to Home Screen</strong>.
        </p>
      )}
    </>
  );
}
