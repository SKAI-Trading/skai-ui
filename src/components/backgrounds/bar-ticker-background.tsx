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

// The full 160-bar pattern is symmetric:
//   edge(0.67) → rise(0.93) → dip(0.54) → peak(1.0) → dip(0.54) → rise(0.93) → edge(0.67)
//
// Each half renders all 160 bars. The center seam = bar 159 = 0.67 (moderate).
// Peaks (1.0) at bar ~80 (midpoint of each half).
// The mirror creates the symmetric shape across the full viewport.
//
// For wider screens (>1440px), extend outward by prepending edge-height bars.
// The edge bars (0.67) are moderate and blend naturally.

function extendPattern(fullHeights: number[], minBars: number): number[] {
  if (fullHeights.length >= minBars) return fullHeights;
  const needed = minBars - fullHeights.length;
  // Prepend with edge-height bars (first bar value) for seamless extension
  const edgeHeight = fullHeights[0];
  const padding = new Array(needed).fill(edgeHeight);
  return [...padding, ...fullHeights];
}

const backHeights = expandPattern(BACK_PATTERN);
const frontHeights = expandPattern(FRONT_PATTERN);

export function BarTickerBackground({
  isBlurred = false,
  className,
  showShimmer = false,
  showDepthBlur = true,
}: BarTickerBackgroundProps) {
  // Calculate how many bars per half are needed to fill the wrapper.
  // Wrapper is 170% of viewport. Each half is 50% of wrapper = 85% of viewport.
  // Bar slot = 7.6px (3px bar + 4.6px gap).
  // On 1440px: need 85% * 1440 / 7.6 = 161 bars per half (160 from Figma ≈ perfect).
  // On 2560px: need 85% * 2560 / 7.6 = 286 bars per half.
  const [barsPerHalf, setBarsPerHalf] = React.useState(() => {
    const vw = typeof window !== "undefined" ? window.innerWidth : 1440;
    return Math.ceil((vw * 0.85) / 7.6);
  });

  React.useEffect(() => {
    const update = () => setBarsPerHalf(Math.ceil((window.innerWidth * 0.85) / 7.6));
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const backBars = React.useMemo(
    () => extendPattern(backHeights, barsPerHalf).map((h, i) => ({ index: i, variation: h })),
    [barsPerHalf]
  );

  const frontBars = React.useMemo(
    () => extendPattern(frontHeights, barsPerHalf).map((h, i) => ({ index: i, variation: h })),
    [barsPerHalf]
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
