type PasskeyAuthButtonProps = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
};

export default function PasskeyAuthButton({ label, onClick, disabled }: PasskeyAuthButtonProps) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} className="tb-v2-auth-oauth" data-testid="passkey-auth-button">
      <svg aria-hidden="true" className="tb-v2-auth-oauth-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="7.5" cy="15.5" r="4.5" />
        <path d="M10.7 12.3 21 2" />
        <path d="m18 5 3 3" />
        <path d="m15 8 2 2" />
      </svg>
      <span>{label}</span>
    </button>
  );
}
