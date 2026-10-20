"use client";

import { useState } from "react";
import { renamePasskey, type PasskeyItem } from "@/lib/passkeys";

/** Shown right after a passkey is created: a nickname pre-filled with the device suggestion. No skip; an empty name keeps the suggestion. */
export default function PasskeyNameStep({ passkey, onDone }: { passkey: PasskeyItem; onDone: () => void }) {
  const [name, setName] = useState(passkey.name);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function save() {
    const trimmed = name.trim();
    if (!trimmed || trimmed === passkey.name) return onDone();
    setError("");
    setBusy(true);
    try {
      await renamePasskey(passkey.id, trimmed);
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the name.");
      setBusy(false);
    }
  }

  return (
    <>
      <h1 className="tb-v2-auth-title">Passkey created</h1>
      <p className="tb-v2-auth-notice">
        Give it a name you will recognize, like the device it is on. It helps you pick the right one when you have passkeys on several devices.
      </p>
      {error && (
        <p role="alert" className="tb-v2-auth-error">
          {error}
        </p>
      )}
      <form
        className="tb-v2-auth-form"
        onSubmit={(e) => {
          e.preventDefault();
          void save();
        }}
      >
        <div className="tb-v2-auth-field">
          <label htmlFor="passkey-nickname" className="tb-v2-auth-label">
            Passkey name
          </label>
          <input
            id="passkey-nickname"
            type="text"
            maxLength={60}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={(e) => e.currentTarget.select()}
            className="tb-v2-auth-input"
            placeholder="e.g. Work laptop"
          />
        </div>
        <button type="submit" disabled={busy} className="tb-v2-auth-submit">
          {busy ? "Saving..." : "Save and continue"}
        </button>
      </form>
    </>
  );
}
