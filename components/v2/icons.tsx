import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const base = (d: string) => (props: IconProps) => (
  <svg viewBox="0 0 24 24" className="tb-v2-ic" {...props}>
    <path d={d} />
  </svg>
);

const compound = (children: React.ReactNode) => (props: IconProps) => (
  <svg viewBox="0 0 24 24" className="tb-v2-ic" {...props}>
    {children}
  </svg>
);

export const IconDev = compound(
  <>
    <path d="m9 8-4 4 4 4" />
    <path d="m15 8 4 4-4 4" />
  </>
);
export const IconText = compound(
  <>
    <path d="M6 4v3" />
    <path d="M6 4h12" />
    <path d="M18 4v3" />
    <path d="M12 4v16" />
    <path d="M9 20h6" />
  </>
);
export const IconImage = compound(
  <>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <circle cx="9" cy="10" r="1.5" />
    <path d="m3 17 5-5 5 5" />
    <path d="m13 15 3-3 5 5" />
  </>
);
export const IconColor = compound(
  <>
    <path d="M12 3a9 9 0 1 0 9 9c0-1.5-1.2-2-2.5-2H17a2 2 0 0 1 0-4c1.3 0 2-.7 2-2a5 5 0 0 0-7-3Z" />
    <circle cx="8" cy="10" r="1" />
    <circle cx="8" cy="14" r="1" />
    <circle cx="12" cy="7" r="1" />
  </>
);
export const IconConv = compound(
  <>
    <path d="M7 7h12" />
    <path d="m15 3 4 4-4 4" />
    <path d="M17 17H5" />
    <path d="m9 13-4 4 4 4" />
  </>
);
export const IconSEO = compound(
  <>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </>
);
export const IconCSS = compound(
  <>
    <path d="M4 4h16l-1.5 16L12 22l-6.5-2L4 4Z" />
    <path d="M8 9h8l-.5 4-3.5 1-3.5-1-.2-2" />
  </>
);
export const IconNet = compound(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3a13 13 0 0 1 0 18" />
    <path d="M12 3a13 13 0 0 0 0 18" />
  </>
);
export const IconEnc = compound(
  <>
    <rect x="4" y="10" width="16" height="10" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </>
);
export const IconUtil = compound(
  <>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v3" />
    <path d="M12 19v3" />
    <path d="m4.9 4.9 2.1 2.1" />
    <path d="m17 17 2.1 2.1" />
    <path d="M2 12h3" />
    <path d="M19 12h3" />
    <path d="m4.9 19.1 2.1-2.1" />
    <path d="m17 7 2.1-2.1" />
  </>
);
export const IconMath = compound(
  <>
    <path d="M5 6h14" />
    <path d="M5 12h14" />
    <path d="m7 18 4-4" />
    <path d="m11 18-4-4" />
    <path d="M17 14v8" />
    <path d="M13 18h8" />
  </>
);
export const IconSearch = compound(
  <>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </>
);
export const IconArrow = compound(
  <>
    <path d="M5 12h14" />
    <path d="m13 5 7 7-7 7" />
  </>
);
export const IconArrowUR = compound(
  <>
    <path d="M7 17 17 7" />
    <path d="M8 7h9v9" />
  </>
);
export const IconCheck = base('m5 12 5 5 9-11');
export const IconClose = compound(
  <>
    <path d="M6 6l12 12" />
    <path d="M18 6 6 18" />
  </>
);
export const IconSun = compound(
  <>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 3v2" />
    <path d="M12 19v2" />
    <path d="m4.9 4.9 1.4 1.4" />
    <path d="m17.7 17.7 1.4 1.4" />
    <path d="M3 12h2" />
    <path d="M19 12h2" />
    <path d="m4.9 19.1 1.4-1.4" />
    <path d="m17.7 6.3 1.4-1.4" />
  </>
);
export const IconMoon = base('M20 15A8 8 0 0 1 9 4a7 7 0 1 0 11 11Z');
export const IconLaptop = compound(
  <>
    <rect x="3" y="5" width="18" height="11" rx="1" />
    <path d="M2 20h20" />
  </>
);
export const IconChevronDown = base('m6 9 6 6 6-6');
export const IconMCP = compound(
  <>
    <circle cx="6" cy="12" r="2.5" />
    <circle cx="18" cy="6" r="2.5" />
    <circle cx="18" cy="18" r="2.5" />
    <path d="m8.3 10.7 7.4-3.4" />
    <path d="m8.3 13.3 7.4 3.4" />
  </>
);
export const IconAI = compound(
  <>
    <path d="M12 3v2" />
    <path d="M12 19v2" />
    <path d="M5 12H3" />
    <path d="M21 12h-2" />
    <rect x="7" y="7" width="10" height="10" rx="2" />
    <circle cx="10" cy="11" r="0.8" fill="currentColor" />
    <circle cx="14" cy="11" r="0.8" fill="currentColor" />
    <path d="M10 14.5h4" />
  </>
);
export const IconMenu = compound(
  <>
    <path d="M4 7h16" />
    <path d="M4 12h16" />
    <path d="M4 17h16" />
  </>
);
