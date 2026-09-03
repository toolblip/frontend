'use client';

type Props = {
  onExample: () => void;
  onClear: () => void;
  /** When false, Clear is disabled (empty input). Default: always enabled. */
  canClear?: boolean;
  /** Override the Examples link label. */
  exampleLabel?: string;
  /** 1 → "Example", 2+ → "Examples". Ignored when exampleLabel is set. */
  exampleCount?: number;
  clearLabel?: string;
  /** Disable Example while an operation is active. Clear remains available for reset/cancel. */
  exampleDisabled?: boolean;
};

/** Shared Examples (red text link) + Clear (muted text link) for tool input headers. */
export default function ToolExampleClearActions({
  onExample,
  onClear,
  canClear = true,
  exampleLabel,
  exampleCount,
  clearLabel = 'Clear',
  exampleDisabled = false,
}: Props) {
  const resolvedExampleLabel =
    exampleLabel ?? (exampleCount === 1 ? 'Example' : 'Examples');

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <button
        type="button"
        onClick={onExample}
        disabled={exampleDisabled}
        className="tb-v2-tool-text-action tb-v2-tool-text-action-accent"
      >
        {resolvedExampleLabel}
      </button>
      <button type="button" onClick={onClear} disabled={!canClear} className="tb-v2-tool-text-action">
        {clearLabel}
      </button>
    </div>
  );
}
