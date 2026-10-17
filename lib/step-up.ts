/**
 * Step-up re-verification. Any authed request that comes back 403 `step_up_required`
 * opens the StepUpDialog (mounted once in the root layout), then retries the request.
 */
export const STEP_UP_EVENT = "tb:step-up-required";

type StepUpDetail = { resolve: (ok: boolean) => void };

export function requestStepUp(): Promise<boolean> {
  return new Promise((resolve) => {
    window.dispatchEvent(new CustomEvent<StepUpDetail>(STEP_UP_EVENT, { detail: { resolve } }));
  });
}

/** fetch() that transparently completes a step-up challenge and retries once. Returns the 403 if the user cancels. */
export async function stepUpFetch(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  const res = await fetch(input, init);
  if (res.status !== 403) return res;
  const body = await res.clone().json().catch(() => null);
  if (body?.code !== "step_up_required") return res;
  if (!(await requestStepUp())) return res;
  return fetch(input, init);
}
