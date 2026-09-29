'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Nav from './Nav';
import SponsorStrip from './SponsorStrip';

const SearchPalette = dynamic(() => import('./SearchPalette'));

export default function Shell({ children, footer }: { children: React.ReactNode; footer: React.ReactNode }) {
  const [paletteOpen, setPaletteOpen] = useState(false);

  return (
    <div className="tb-v2-shell">
      <Nav onOpenSearch={() => setPaletteOpen(true)} />
      <SponsorStrip />
      <main id="main-content" className="flex-1" style={{ flex: 1 }}>
        {children}
      </main>
      {footer}
      {paletteOpen && <SearchPalette open onClose={() => setPaletteOpen(false)} />}
    </div>
  );
}
