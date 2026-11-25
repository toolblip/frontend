'use client';

import { useEffect, useRef } from 'react';

// The marquee needs a second copy of the badge row to loop. Cloning it in the browser keeps
// that copy out of the server HTML and the RSC payload, which roughly halved the footer's weight.
export default function DirectoryMarqueeClone() {
  const marker = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const track = marker.current?.parentElement;
    const group = marker.current?.previousElementSibling;
    if (!track || !group) return;
    const copy = group.cloneNode(true) as HTMLElement;
    copy.setAttribute('aria-hidden', 'true');
    copy.querySelectorAll('script').forEach((el) => el.remove()); // badge scripts already ran for the original
    copy.querySelectorAll('a').forEach((a) => a.setAttribute('tabindex', '-1'));
    // Badge images reveal themselves through React state; the clone has no handlers, so mirror it.
    copy.querySelectorAll('img').forEach((img) => {
      const wrap = img.parentElement;
      const reveal = () => wrap?.setAttribute('data-loaded', '');
      if (img.complete && img.naturalWidth > 0) reveal();
      else img.addEventListener('load', reveal, { once: true });
    });
    track.appendChild(copy);
    return () => copy.remove();
  }, []);

  return <span ref={marker} hidden />;
}
