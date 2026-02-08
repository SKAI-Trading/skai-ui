/**
 * PageTransition - Fade animation wrapper for page changes
 *
 * Presentational component - receives location key from parent.
 * The consuming app passes location.key from its router.
 */

import * as React from "react";

export interface PageTransitionProps {
  /** Unique key for the current location (e.g., location.key from router) */
  locationKey: string;
  /** Children to render with transition */
  children: React.ReactNode;
}

/**
 * PageTransition - Smooth fade animation between page changes
 */
export function PageTransition({
  locationKey,
  children,
}: PageTransitionProps) {
  const [displayKey, setDisplayKey] = React.useState(locationKey);
  const [transitionStage, setTransitionStage] = React.useState<
    "fade-in" | "fade-out"
  >("fade-in");

  React.useEffect(() => {
    if (locationKey !== displayKey) {
      setTransitionStage("fade-out");
    }
  }, [locationKey, displayKey]);

  const handleAnimationEnd = () => {
    if (transitionStage === "fade-out") {
      setDisplayKey(locationKey);
      setTransitionStage("fade-in");
    }
  };

  return (
    <div
      className={
        transitionStage === "fade-in"
          ? "page-fade-enter"
          : "page-fade-exit"
      }
      onAnimationEnd={handleAnimationEnd}
    >
      {children}
    </div>
  );
}
