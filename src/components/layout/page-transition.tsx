/**
 * PageTransition - Fade animation wrapper for page changes
 *
 * Presentational component - receives location key from parent.
 * The consuming app passes location.key from its router.
 *
 * Replays the fade-in CSS animation on each route change WITHOUT
 * remounting children, so persistent elements (Header, BottomTickerBar)
 * rendered outside this wrapper stay mounted.
 */

import * as React from "react";

export interface PageTransitionProps {
  /** Unique key for the current location (e.g., location.key from router) */
  locationKey: string;
  /** Children to render with transition */
  children: React.ReactNode;
}

/**
 * PageTransition - Smooth fade-in animation between page changes
 *
 * Uses CSS animation class toggling (remove + re-add via rAF) to
 * replay the entry animation without destroying React component tree.
 */
export function PageTransition({
  locationKey,
  children,
}: PageTransitionProps) {
  const [animate, setAnimate] = React.useState(true);
  const prevKey = React.useRef(locationKey);

  React.useEffect(() => {
    if (locationKey !== prevKey.current) {
      prevKey.current = locationKey;
      // Remove animation class, then re-add on next frame to restart CSS animation
      setAnimate(false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimate(true);
        });
      });
    }
  }, [locationKey]);

  return (
    <div className={animate ? "page-fade-enter" : "opacity-0"}>
      {children}
    </div>
  );
}
