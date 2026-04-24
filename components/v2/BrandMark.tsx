type Props = { size?: number; className?: string };

export default function BrandMark({ size = 34, className }: Props) {
  const innerSize = Math.round(size * 0.72);
  return (
    <div
      className={`tb-v2-brand-mark ${className ?? ''}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <img
        src="/logos/logo-dark.png"
        alt=""
        width={innerSize}
        height={innerSize}
        style={{ width: innerSize, height: innerSize, objectFit: 'contain' }}
      />
    </div>
  );
}
