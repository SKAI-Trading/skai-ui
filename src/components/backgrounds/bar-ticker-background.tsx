import * as React from "react";
import { cn } from "../../lib/utils";

export interface BarTickerBackgroundProps {
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
 * Bar heights are extracted directly from Figma node 2005:4515 (320 vectors
 * per layer). The pattern is mirrored (left half = reversed right half).
 *
 * LAYER STRUCTURE:
 * - BACK layer: Taller bars with stepped heights (volume-chart style)
 * - FRONT layer: Shorter bars with occasional spikes (candlestick wicks)
 *
 * Each layer uses MIRROR architecture:
 * - LEFT half: bars rendered from edge toward center
 * - RIGHT half: mirrored copy (scaleX: -1) creating perfect symmetry
 *
 * Requires backgrounds.css to be imported for animations.
 */

// Figma bar heights extracted from node 2005:4515 vectors.
// Run-length encoded as [normalizedHeight, barCount] pairs.
// 160 bars per half, mirrored for right side.

// Back layer (tall bars) - max height 441.7px in Figma
const BACK_PATTERN: [number, number][] = [
  [0.67, 3],
  [0.798, 5],
  [0.844, 4],
  [0.894, 8],
  [0.93, 3],
  [0.629, 6],
  [0.54, 8],
  [0.598, 6],
  [0.629, 7],
  [0.714, 3],
  [0.798, 5],
  [0.862, 5],
  [0.894, 5],
  [0.93, 4],
  [0.956, 5],
  [1.0, 6],
  [0.956, 5],
  [0.93, 4],
  [0.894, 5],
  [0.862, 5],
  [0.798, 5],
  [0.714, 3],
  [0.629, 7],
  [0.598, 6],
  [0.54, 8],
  [0.629, 6],
  [0.93, 3],
  [0.894, 8],
  [0.844, 4],
  [0.798, 5],
  [0.67, 3],
];

// Front layer (short bars with occasional spikes) - max height 160.3px in Figma
const FRONT_PATTERN: [number, number][] = [
  [0.321, 3],
  [0.381, 5],
  [0.404, 4],
  [0.428, 8],
  [0.445, 3],
  [0.301, 6],
  [0.258, 8],
  [0.286, 6],
  [0.301, 7],
  [0.342, 3],
  [0.381, 5],
  [0.412, 5],
  [0.428, 5],
  [0.445, 4],
  [0.457, 5],
  [0.664, 1],
  [0.765, 1],
  [0.958, 1],
  [0.702, 1],
  [0.478, 2],
  [0.457, 5],
  [0.445, 4],
  [0.428, 5],
  [0.412, 5],
  [0.381, 5],
  [0.342, 3],
  [0.301, 7],
  [0.286, 6],
  [0.258, 2],
  [0.492, 2],
  [0.258, 4],
  [0.301, 6],
  [0.445, 3],
  [0.428, 8],
  [0.404, 4],
  [0.381, 5],
  [0.321, 3],
];

// Expand run-length encoded pattern into per-bar height array
function expandPattern(pattern: [number, number][]): number[] {
  const result: number[] = [];
  for (const [height, count] of pattern) {
    for (let i = 0; i < count; i++) {
      result.push(height);
    }
  }
  return result;
}

const backHeights = expandPattern(BACK_PATTERN);
const frontHeights = expandPattern(FRONT_PATTERN);

export function BarTickerBackground({
  isBlurred = false,
  className,
  showShimmer = false,
  showDepthBlur = true,
}: BarTickerBackgroundProps) {
  const backBars = React.useMemo(
    () => backHeights.map((h, i) => ({ index: i, variation: h })),
    []
  );

  const frontBars = React.useMemo(
    () => frontHeights.map((h, i) => ({ index: i, variation: h })),
    []
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
          {backBars.map((bar) => (
            <div
              key={`back-left-${bar.index}`}
              className="bar bar-back"
              style={{
                "--bar-index": bar.index,
                "--height-variation": bar.variation,
              } as React.CSSProperties}
            />
          ))}
        </div>

        {/* RIGHT half - mirrored copy via scaleX(-1) */}
        <div className="ticker-bars-right">
          {backBars.map((bar) => (
            <div
              key={`back-right-${bar.index}`}
              className="bar bar-back"
              style={{
                "--bar-index": bar.index,
                "--height-variation": bar.variation,
              } as React.CSSProperties}
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
          {frontBars.map((bar) => (
            <div
              key={`front-left-${bar.index}`}
              className="bar bar-front"
              style={{
                "--bar-index": bar.index,
                "--height-variation": bar.variation,
              } as React.CSSProperties}
            />
          ))}
        </div>

        {/* RIGHT half - mirrored copy via scaleX(-1) */}
        <div className="ticker-bars-right">
          {frontBars.map((bar) => (
            <div
              key={`front-right-${bar.index}`}
              className="bar bar-front"
              style={{
                "--bar-index": bar.index,
                "--height-variation": bar.variation,
              } as React.CSSProperties}
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
