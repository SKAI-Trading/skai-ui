import * as React from "react";
import { cn } from "../../lib/utils";

export interface BarTickerBackgroundProps {
  /**
   * Number of bars to render
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
   * Show the shimmer sweep effect
   * @default true
   */
  showShimmer?: boolean;
  /**
   * Show the depth blur overlay
   * @default true
   */
  showDepthBlur?: boolean;
}

/**
 * BarTickerBackground - Animated vertical bar background
 *
 * Creates an animated stock ticker-style background with vertical bars
 * that oscillate like a live trading chart. Features a right-to-left
 * traveling wave effect with smooth, calm animations.
 *
 * Requires backgrounds.css to be imported for animations.
 */
export function BarTickerBackground({
  barCount = 200,
  isBlurred = false,
  className,
  showShimmer = true,
  showDepthBlur = true,
}: BarTickerBackgroundProps) {
  // Memoize the bars array to prevent unnecessary re-renders
  const bars = React.useMemo(
    () => Array.from({ length: barCount }, (_, i) => i),
    [barCount]
  );

  return (
    <>
      <div
        className={cn(
          "ticker-bars-container transition-all duration-300",
          isBlurred && "blur-md",
          className
        )}
        aria-hidden="true"
      >
        {bars.map((i) => (
          <div key={i} className="bar" />
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
