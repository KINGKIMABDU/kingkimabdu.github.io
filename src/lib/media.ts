"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * A media query read as external state rather than copied into React state
 * from an effect, matching how Intro reads its own. The server snapshot is
 * `false`, so anything gated on this renders in its cheaper form until
 * hydration and never mismatches.
 */
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    [query]
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
}
