'use client';

import { useEffect, useRef, useState, type ComponentType } from 'react';
import HeroToyPreview from './HeroToyPreview';

export default function HeroToyOnView() {
  const ref = useRef<HTMLDivElement>(null);
  const [InteractiveToy, setInteractiveToy] = useState<ComponentType | null>(null);

  useEffect(() => {
    let active = true;
    let observer: IntersectionObserver | undefined;
    const activate = () => {
      observer?.disconnect();
      import('./HeroToy').then(({ default: Toy }) => {
        if (active) setInteractiveToy(() => Toy);
      });
    };

    if (!('IntersectionObserver' in window) || !ref.current) {
      activate();
    } else {
      observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) activate();
      }, { rootMargin: '120px 0px' });
      observer.observe(ref.current);
    }

    return () => {
      active = false;
      observer?.disconnect();
    };
  }, []);

  return <div ref={ref}>{InteractiveToy ? <InteractiveToy /> : <HeroToyPreview />}</div>;
}
