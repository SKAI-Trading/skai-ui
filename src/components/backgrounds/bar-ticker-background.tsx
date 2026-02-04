import * as React from "react";
import { cn } from "../../lib/utils";

export interface BarTickerBackgroundProps {
  /**
   * Number of bars to render (total across both halves)
   * @default 200
   */
  barCount?: number;
  /**
   * Whether to blur the background (e.g., when modal is open)
   * @default false
   */
  isBlurred?: boolean;
  /**
   * Additional className for the container
   */
  className?: string;
  /**
   * Show the shimmer sweep effect (disabled by default to prevent flicker)
   * @default false
   */
  showShimmer?: boolean;
  /**
   * Show the depth blur overlay
   * @default true
   */
  showDepthBlur?: boolean;
}

/**
 * BarTickerBackground - Animated vertical bar background matching Figma design
 *
 * Creates an animated stock ticker-style background with TWO LAYERS matching
 * Figma node 2005-4492:
 *
 * LAYER STRUCTURE:
 * - BACK layer: Taller bars (more visible on edges)
 * - FRONT layer: Shorter bars (more visible in center)
 *
 * Each layer uses MIRROR architecture:
 * - LEFT half: bars grow from left edge toward center
 * - RIGHT half: mirrored copy (scaleX: -1) creating perfect symmetry
 *
 * The green tint visible in Figma comes from Ellipse 24 (a blurred green
 * circle glow) positioned behind the bars in LandingWaitlist.tsx.
 *
 * Requires backgrounds.css to be imported for animations.
 */
export function BarTickerBackground({
  barCount = 200,
  isBlurred = false,
  className,
  showShimmer = false,
  showDepthBlur = true,
}: BarTickerBackgroundProps) {
  // Create bars for one half only - right half will mirror via CSS
  const halfCount = Math.floor(barCount / 2);

  // Memoize bar array to prevent unnecessary re-renders
  const bars = React.useMemo(
    () => Array.from({ length: halfCount }, (_, i) => i),
    [halfCount]
  );

  return (
    <>
      {/* BACK LAYER - Taller bars (behind front layer) */}
      <div
        className={cn(
          "ticker-bars-wrapper ticker-bars-back transition-all duration-300",
          isBlurred && "blur-md",
          className
        )}
        aria-hidden="true"
      >
        {/* LEFT half - bars grow from left edge toward center */}
        <div className="ticker-bars-left">
          {bars.map((i) => (
            <div
              key={`back-left-${i}`}
              className="bar bar-back"
              style={{ "--bar-index": i } as React.CSSProperties}
            />
          ))}
        </div>

        {/* RIGHT half - mirrored copy via scaleX(-1) */}
        <div className="ticker-bars-right">
          {bars.map((i) => (
            <div
              key={`back-right-${i}`}
              className="bar bar-back"
              style={{ "--bar-index": i } as React.CSSProperties}
            />
          ))}
        </div>
      </div>

      {/* FRONT LAYER - Shorter bars (in front) */}
      <div
        className={cn(
          "ticker-bars-wrapper ticker-bars-front transition-all duration-300",
          isBlurred && "blur-md"
        )}
        aria-hidden="true"
      >
        {/* LEFT half - bars grow from left edge toward center */}
        <div className="ticker-bars-left">
          {bars.map((i) => (
            <div
              key={`front-left-${i}`}
              className="bar bar-front"
              style={{ "--bar-index": i } as React.CSSProperties}
            />
          ))}
        </div>

        {/* RIGHT half - mirrored copy via scaleX(-1) */}
        <div className="ticker-bars-right">
          {bars.map((i) => (
            <div
              key={`front-right-${i}`}
              className="bar bar-front"
              style={{ "--bar-index": i } as React.CSSProperties}
            />
          ))}
        </div>
      </div>

      {showShimmer && (
        <div
          className={cn(
            "ticker-shimmer transition-all duration-300",
            isBlurred && "blur-md opacity-50"
          )}
          aria-hidden="true"
        />
      )}
      {showDepthBlur && (
        <div
          className={cn(
            "stock-ticker-blur transition-all duration-300",
            isBlurred && "blur-lg"
          )}
          aria-hidden="true"
        />
      )}
    </>
  );
}
