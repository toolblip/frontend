"use client";

import { useId, useState, type ReactNode } from "react";

/**
 * Collapsed-by-default section for secondary sign-in methods. Children mount only
 * while open, so put anything that should not run while collapsed (e.g. Turnstile) inside.
 */
export default function AuthMoreOptions({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="tb-v2-auth-more">
      <button
        type="button"
        className="tb-v2-auth-more-toggle"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        More options
      </button>
      {open && (
        <div id={panelId}>
          {children}
        </div>
      )}
    </div>
  );
}
