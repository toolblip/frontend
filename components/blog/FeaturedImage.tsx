'use client';

interface Props {
  src?: string;
  title: string;
  gradientFrom: string;
  gradientTo: string;
}

export default function FeaturedImage({ src, title, gradientFrom, gradientTo }: Props) {
  const gradient = `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)`;

  if (!src) {
    return (
      <div style={{ background: gradient, height: 180, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 48, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>{title.charAt(0)}</span>
      </div>
    );
  }

  return (
    <div style={{ background: gradient, height: 180, width: '100%', overflow: 'hidden' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }}
        onError={(e) => {
          const img = e.currentTarget as HTMLImageElement;
          img.style.display = 'none';
        }}
      />
    </div>
  );
}
