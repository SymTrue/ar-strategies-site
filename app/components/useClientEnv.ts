'use client';

import { useSyncExternalStore } from 'react';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/* Reads prefers-reduced-motion during render and re-renders only when the
   query actually changes.

   The pattern this replaces — `useState(false)` plus an effect that calls
   `setReduced(mq.matches)` on mount — costs a second render pass every time
   the component mounts, and briefly paints the non-reduced state to someone
   who explicitly asked for less motion. useSyncExternalStore subscribes to
   the media query instead, so a visitor toggling the OS setting mid-session
   is picked up too. The server snapshot is `false` so SSR markup matches
   what the client paints before hydration. */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(REDUCED_MOTION_QUERY);
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    },
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );
}

const noopSubscribe = () => () => {};

/* True once the client has hydrated, false during SSR — for components that
   genuinely cannot render on the server (canvas, WebGL, anything measuring
   real layout).

   Replaces the `useState(false)` + `useEffect(() => setMounted(true))` gate,
   which is a cascading render on every mount. This resolves during the
   hydration pass itself rather than after a committed no-op render. */
export function useIsHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
