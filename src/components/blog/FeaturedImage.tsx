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
      <div className="h-44 w-full flex items-center justify-center" style={{ background: gradient }}>
        <span className="text-5xl font-bold text-white/30 uppercase">{title.charAt(0)}</span>
      </div>
    );
  }

  return (
    <div className="h-44 w-full overflow-hidden group-hover:opacity-100 transition-opacity" style={{ background: gradient }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className="w-full h-full object-cover opacity-90"
        onError={(e) => {
          // Hide broken image, show gradient instead
          const img = e.currentTarget;
          img.style.display = 'none';
        }}
      />
    </div>
  );
}
