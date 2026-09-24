'use client';

import { useState, type ImgHTMLAttributes } from 'react';

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'onLoad' | 'onError' | 'loading'> & {
  fallback: string;
};

// Text is visible even before hydration. Only successfully decoded images are
// revealed, so missing assets never expose the browser's broken-image icon.
export default function DirectoryBadgeImage({ fallback, alt, ...props }: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <span className="tb-v2-directory-image" data-loaded={loaded || undefined}>
      <span className="tb-v2-directory-text" aria-hidden={loaded || undefined}>{fallback}</span>
      <img
        {...props}
        alt={alt}
        aria-hidden={!loaded || undefined}
        loading="eager"
        ref={(image) => {
          if (image?.complete && image.naturalWidth > 0) setLoaded(true);
        }}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(false)}
      />
    </span>
  );
}
