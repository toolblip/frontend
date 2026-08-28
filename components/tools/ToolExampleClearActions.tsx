'use client';

type Props = {
  onExample: () => void;
  onClear: () => void;
  /** When false, Clear is disabled (empty input). Default: always enabled. */
  canClear?: boolean;
  exampleLabel?: string;
  clearLabel?: string;
};

/** Shared Examples (red text link) + Clear (muted text link) for tool input headers. */
export default function ToolExampleClearActions({
  onExample,
  onClear,
  canClear = true,
  exampleLabel = 'Examples',
  clearLabel = 'Clear',
}: Props) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <button
        type="button"
        onClick={onExample}
        className="tb-v2-tool-text-action tb-v2-tool-text-action-accent"
      >
        {exampleLabel}
      </button>
      <button type="button" onClick={onClear} disabled={!canClear} className="tb-v2-tool-text-action">
        {clearLabel}
      </button>
    </div>
  );
}
