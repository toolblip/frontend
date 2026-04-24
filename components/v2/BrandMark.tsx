type Props = { size?: number; className?: string };

export default function BrandMark({ size = 34, className }: Props) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size * 0.72}
      height={size * 0.72}
      fill="none"
      aria-hidden="true"
      className={className}
      style={{ width: size * 0.72, height: size * 0.72 }}
    >
      <g fill="#d93030">
        <path d="M19.2 3.4l.9 1.7 1.9-.2.4 1.9 1.7.9-.6 1.8 1.2 1.5-1.2 1.5.6 1.8-1.7.9-.4 1.9-1.9-.2-.9 1.7-1.7-.9-1.7.9-.9-1.7-1.9.2-.4-1.9-1.7-.9.6-1.8L10.3 9l1.2-1.5-.6-1.8 1.7-.9.4-1.9 1.9.2.9-1.7 1.7.9 1.7-.9z"/>
        <circle cx="17.5" cy="9" r="1.9" fill="#1c1c1e"/>
        <path d="M9.2 11.9l.7 1.3 1.5-.1.3 1.4 1.3.7-.5 1.4.9 1.1-.9 1.1.5 1.4-1.3.7-.3 1.4-1.5-.1-.7 1.3-1.3-.7-1.3.7-.7-1.3-1.5.1-.3-1.4-1.3-.7.5-1.4-.9-1.1.9-1.1-.5-1.4 1.3-.7.3-1.4 1.5.1.7-1.3 1.3.7 1.3-.7z"/>
        <circle cx="7.9" cy="16.1" r="1.5" fill="#1c1c1e"/>
      </g>
      <path
        d="M11 23 L14 23 L15.5 20 L17.5 26 L19.5 19 L21 23 L27 23"
        stroke="#b5b5b8"
        strokeWidth="1.3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
