import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * false while the server renders (and during the first browser render),
 * true afterwards. The cart lives in localStorage, which the server can't
 * see, so components wait for this before showing cart contents. That keeps
 * the server HTML and the first browser render identical (no hydration error).
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
