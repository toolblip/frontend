type Props = { size?: number; className?: string };

export default function BrandMark({ size = 40, className }: Props) {
  return (
    <img
      src="/logos/logo-transparent.png"
      alt=""
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: size, objectFit: 'contain' }}
      aria-hidden="true"
    />
  );
}
