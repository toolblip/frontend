"use client";

import { useEffect, useRef, useState } from "react";
import { PasskeyCancelledError, listPasskeys, passkeysSupported, sendStepUpEmailCode, stepUpWithPasskey, verifyStepUpEmailCode, type PasskeyItem } from "@/lib/passkeys";
import { STEP_UP_EVENT } from "@/lib/step-up";

type View = "passkey" | "email";

/** Global step-up modal. Opened by requestStepUp() from lib/step-up.ts; resolves true once re-verified. */
export default function StepUpDialog() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>("passkey");
  const [passkeys, setPasskeys] = useState<PasskeyItem[]>([]);
  const [choice, setChoice] = useState<number | "any">("any");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const resolversRef = useRef<Array<(ok: boolean) => void>>([]);

  useEffect(() => {
    function onRequest(event: Event) {
      const { resolve } = (event as CustomEvent<{ resolve: (ok: boolean) => void }>).detail;
      resolversRef.current.push(resolve);
      setOpen(true);
    }
    window.addEventListener(STEP_UP_EVENT, onRequest);
    return () => window.removeEventListener(STEP_UP_EVENT, onRequest);
  }, []);

  // Fresh state each time the dialog opens; zero passkeys (or no browser support) goes straight to email.
  useEffect(() => {
    if (!open) return;
    setError("");
    setNotice("");
    setCode("");
    setCodeSent(false);
    setChoice("any");
    if (!passkeysSupported()) {
      switchToEmail();
      return;
    }
    listPasskeys()
      .then((list) => {
        setPasskeys(list);
        if (list.length === 0) switchToEmail();
        else setView("passkey");
      })
      .catch(() => switchToEmail());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function finish(ok: boolean) {
    setOpen(false);
    const resolvers = resolversRef.current;
    resolversRef.current = [];
    resolvers.forEach((resolve) => resolve(ok));
  }

  function switchToEmail() {
    setView("email");
    setBusy(true);
    sendStepUpEmailCode()
      .then(() => setCodeSent(true))
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Could not send a code."))
      .finally(() => setBusy(false));
  }

  async function verifyPasskey() {
    setError("");
    setNotice("");
    setBusy(true);
    try {
      await stepUpWithPasskey(choice === "any" ? null : choice);
      finish(true);
    } catch (err) {
      if (err instanceof PasskeyCancelledError) setNotice("Passkey check was cancelled. Try again or email me a code instead.");
      else setError(err instanceof Error ? err.message : "Could not verify your passkey.");
    } finally {
      setBusy(false);
    }
  }

  async function verifyCode(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await verifyStepUpEmailCode(code.trim());
      finish(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "That code is not right. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (!open) return null;

  const inputClass = "w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-gray-900 outline-none focus:border-red-400 dark:border-gray-800 dark:bg-gray-900 dark:text-white";
  const primaryClass = "w-full rounded-xl bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700 disabled:opacity-60";

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 px-4">
      <div role="dialog" aria-modal="true" aria-labelledby="step-up-title" className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl dark:border-gray-800 dark:bg-gray-950">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 id="step-up-title" className="text-lg font-bold text-gray-900 dark:text-white">Confirm it&apos;s you</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">This action needs a quick check before it continues.</p>
          </div>
          <button type="button" onClick={() => finish(false)} className="text-xl leading-none text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white" aria-label="Close">
            ×
          </button>
        </div>

        {error && <p role="alert" className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-200">{error}</p>}
        {notice && <p role="status" className="mb-3 text-sm text-gray-600 dark:text-gray-300">{notice}</p>}

        {view === "passkey" && (
          <div className="space-y-4">
            <fieldset className="space-y-2">
              <legend className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">Use a passkey</legend>
              {passkeys.map((passkey) => (
                <label key={passkey.id} className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-200">
                  <input type="radio" name="step-up-passkey" checked={choice === passkey.id} onChange={() => setChoice(passkey.id)} />
                  <span>{passkey.name}</span>
                </label>
              ))}
              <label className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-200">
                <input type="radio" name="step-up-passkey" checked={choice === "any"} onChange={() => setChoice("any")} />
                <span>Any of my passkeys</span>
              </label>
            </fieldset>
            <button type="button" onClick={verifyPasskey} disabled={busy} className={primaryClass}>
              {busy ? "Waiting for passkey..." : "Verify"}
            </button>
            <button type="button" onClick={switchToEmail} disabled={busy} className="w-full text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400">
              Email me a code instead
            </button>
          </div>
        )}

        {view === "email" && (
          <form onSubmit={verifyCode} className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {codeSent ? "We emailed you a 6-digit code. It expires in 10 minutes." : "Sending a code to your email..."}
            </p>
            <div>
              <label htmlFor="step-up-code" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">Code</label>
              <input id="step-up-code" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} onChange={(e) => setCode(e.target.value)} className={inputClass} />
            </div>
            <button type="submit" disabled={busy || code.trim().length !== 6} className={primaryClass}>
              {busy ? "Checking..." : "Verify"}
            </button>
            <div className="flex items-center justify-between text-sm">
              <button type="button" onClick={() => { setCode(""); switchToEmail(); }} disabled={busy} className="font-medium text-red-600 hover:text-red-700 dark:text-red-400">
                Send a new code
              </button>
              {passkeys.length > 0 && (
                <button type="button" onClick={() => { setError(""); setView("passkey"); }} disabled={busy} className="font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                  Use a passkey
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
