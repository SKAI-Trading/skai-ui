import { cn } from "../../lib/utils";

// =============================================================================
// TICKER BACKGROUND COMPONENT
// =============================================================================
// An animated stock ticker-style background with vertical bars that animate
// like a live trading chart. Features:
// - Smooth wave-like animations with varied timing
// - Shimmer overlay effect
// - Blur depth effect
// - Responsive design
// - Reduced motion support
// =============================================================================

export interface TickerBackgroundProps {
  /** Number of bars to render (default: 200) */
  barCount?: number;
  /** Whether to blur the background (e.g., when modal is open) */
  isBlurred?: boolean;
  /** Additional className for the container */
  className?: string;
  /** Whether to show the shimmer overlay (default: true) */
  showShimmer?: boolean;
  /** Whether to show the bottom blur/depth effect (default: true) */
  showDepthBlur?: boolean;
}

/**
 * TickerBackground - Animated stock ticker-style background
 *
 * @example
 * ```tsx
 * <TickerBackground
 *   barCount={200}
 *   isBlurred={isModalOpen}
 *   showShimmer={true}
 * />
 * ```
 */
export function TickerBackground({
  barCount = 200,
  isBlurred = false,
  className,
  showShimmer = true,
  showDepthBlur = true,
}: TickerBackgroundProps) {
  return (
    <>
      {/* Animated Stock Ticker Bars */}
      <div
        className={cn(
          "ticker-bars-container transition-all duration-300",
          isBlurred && "blur-md",
          className
        )}
      >
        {/* Generate bars for dense ticker effect */}
        {Array.from({ length: barCount }).map((_, i) => (
          <div key={i} className="bar" />
        ))}
      </div>

      {/* Shimmer overlay for moving light effect */}
      {showShimmer && (
        <div
          className={cn(
            "ticker-shimmer transition-all duration-300",
            isBlurred && "blur-md opacity-50"
          )}
        />
      )}

      {/* Bottom glow/blur for depth */}
      {showDepthBlur && (
        <div
          className={cn(
            "stock-ticker-blur transition-all duration-300",
            isBlurred && "blur-lg"
          )}
        />
      )}
    </>
  );
}

TickerBackground.displayName = "TickerBackground";

export default TickerBackground;
