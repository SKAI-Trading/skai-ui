import * as React from "react";
import { cn } from "../../lib/utils";

export interface BarTickerBackgroundProps {
  /**
   * Number of bars to render per layer
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
 * Creates an animated stock ticker-style background with two layers of
 * vertical bars in the same cyan/sky blue color (#56C7F3) that oscillate
 * like a live trading chart. The green tint visible in Figma comes from
 * Ellipse 24 (a green radial gradient glow) positioned behind the bars.
 *
 * Matches Figma design node 2005-4492 with file node 2005-4515 (bars).
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
  // Memoize the bars arrays to prevent unnecessary re-renders
  // Front layer (cyan) has full bar count, back layer (green) has 80%
  const frontBars = React.useMemo(
    () => Array.from({ length: barCount }, (_, i) => i),
    [barCount]
  );
  const backBars = React.useMemo(
    () => Array.from({ length: Math.floor(barCount * 0.85) }, (_, i) => i),
    [barCount]
  );

  return (
    <>
      {/* Back layer - cyan/sky blue (#56C7F3), taller bars for depth */}
      <div
        className={cn(
          "ticker-bars-container ticker-bars-back transition-all duration-300",
          isBlurred && "blur-md",
          className
        )}
        aria-hidden="true"
      >
        {backBars.map((i) => (
          <div key={i} className="bar bar-back" />
        ))}
      </div>

      {/* Front layer - cyan/sky blue (#56C7F3), shorter bars in front */}
      <div
        className={cn(
          "ticker-bars-container ticker-bars-front transition-all duration-300",
          isBlurred && "blur-md",
          className
        )}
        aria-hidden="true"
      >
        {frontBars.map((i) => (
          <div key={i} className="bar bar-front" />
        ))}
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
