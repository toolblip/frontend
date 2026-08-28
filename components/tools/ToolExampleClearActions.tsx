'use client';

type Props = {
  onExample: () => void;
  onClear: () => void;
  /** When false, Clear is disabled (empty input). Default: always enabled. */
  canClear?: boolean;
  exampleLabel?: string;
  clearLabel?: string;
};

/**
 * Shared Examples (accent) + Clear (muted) actions for tool input headers.
 * Use two colors so the primary action stands out from reset.
 */
export default function ToolExampleClearActions({
  onExample,
  onClear,
  canClear = true,
  exampleLabel = 'Examples',
  clearLabel = 'Clear',
}: Props) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <button type="button" onClick={onExample} className="tb-v2-btn tb-v2-btn-sm tb-v2-btn-primary">
        {exampleLabel}
      </button>
      <button
        type="button"
        onClick={onClear}
        disabled={!canClear}
        className="tb-v2-btn tb-v2-btn-sm"
        style={{ opacity: canClear ? 1 : 0.45 }}
      >
        {clearLabel}
      </button>
    </div>
  );
}
