'use client';

import { useState } from 'react';
import Nav from './Nav';
import SearchPalette from './SearchPalette';

export default function Shell({ children }: { children: React.ReactNode }) {
  const [paletteOpen, setPaletteOpen] = useState(false);

  return (
    <div className="tb-v2-shell">
      <Nav onOpenSearch={() => setPaletteOpen(true)} />
      <main id="main-content" className="flex-1" style={{ flex: 1 }}>
        {children}
      </main>
      <SearchPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}
