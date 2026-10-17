"use client";

import { useEffect, useState } from "react";
import { isSafeNext } from "@/lib/safe-next";

/** Where to go after sign in / sign up: a safe `next` param, plus `favorite=1` when a tool favorite started the flow. */
export function useAuthNext() {
  const [next, setNext] = useState("/dashboard");
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nextParam = params.get("next");
    if (isSafeNext(nextParam)) setNext(nextParam);
    setFavorite(params.get("favorite") === "1" || params.get("favorite") === "true");
  }, []);

  const target = favorite ? `${next}${next.includes("?") ? "&" : "?"}favorite=1` : next;
  return { next, target };
}
