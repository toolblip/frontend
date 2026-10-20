"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/auth-provider";
import { isSafeNext } from "@/lib/safe-next";

/**
 * Where to go after sign in / sign up: a safe `next` param, plus `favorite=1` when a tool favorite started the flow.
 * Used only by the sign-in and sign-up pages, so it also sends visitors who are already signed in straight there.
 */
export function useAuthNext() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [next, setNext] = useState("/dashboard");
  const [favorite, setFavorite] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nextParam = params.get("next");
    // A next that is itself a sign-in page would bounce a signed-in visitor forever.
    if (isSafeNext(nextParam) && !/^\/(login|signup)(\/|\?|$)/.test(nextParam)) setNext(nextParam);
    setFavorite(params.get("favorite") === "1" || params.get("favorite") === "true");
    setReady(true);
  }, []);

  const target = favorite ? `${next}${next.includes("?") ? "&" : "?"}favorite=1` : next;

  useEffect(() => {
    if (ready && !loading && user) router.replace(target);
  }, [ready, loading, user, router, target]);

  return { next, target };
}
