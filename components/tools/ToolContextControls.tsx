'use client';

type ToolContextControlsProps = {
  isPaid: boolean;
  hasSaved: boolean;
  onSave: () => void;
  onClear: () => void;
  /** Short description of what gets saved, e.g. "formatting mode and indent". */
  description: string;
};

/**
 * Paid-gated, explicit save/clear control for a tool's default settings.
 * Renders nothing for free/guest users.
 */
export default function ToolContextControls({
  isPaid,
  hasSaved,
  onSave,
  onClear,
  description,
}: ToolContextControlsProps) {
  if (!isPaid) return null;

  return (
    <div
      data-testid="tool-context-controls"
      className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-900/60"
    >
      <span className="text-gray-600 dark:text-gray-300">
        {hasSaved ? 'Your saved defaults are applied.' : `Save your ${description} as defaults.`}
      </span>
      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          data-testid="save-tool-context"
          onClick={onSave}
          className="rounded-full bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-700"
        >
          Save as default
        </button>
        {hasSaved && (
          <button
            type="button"
            data-testid="clear-tool-context"
            onClick={onClear}
            className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-red-900 dark:hover:bg-red-950/40 dark:hover:text-red-400"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
