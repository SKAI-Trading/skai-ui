import { cn } from "../../lib/utils";

/**
 * Props for the CosmicBackground component
 */
export interface CosmicBackgroundProps {
  /**
   * Additional CSS classes for the container
   */
  className?: string;

  /**
   * Whether to show the animated stars layers
   * @default true
   */
  showStars?: boolean;

  /**
   * Whether to show the floating orbs
   * @default true
   */
  showOrbs?: boolean;

  /**
   * Whether to show the aurora wave effect
   * @default true
   */
  showAurora?: boolean;

  /**
   * Whether to show rising particles
   * @default true
   */
  showParticles?: boolean;

  /**
   * Number of particles to render
   * @default 10
   */
  particleCount?: number;

  /**
   * Whether to show the glowing grid
   * @default true
   */
  showGrid?: boolean;

  /**
   * Whether the background is blurred (e.g., when modal is open)
   * @default false
   */
  isBlurred?: boolean;
}

/**
 * CosmicBackground - An animated cosmic/space background
 *
 * Features animated stars, floating orbs, aurora waves, rising particles,
 * and a subtle glowing grid. Perfect for immersive landing pages and
 * celebration screens.
 *
 * @example
 * ```tsx
 * <CosmicBackground />
 *
 * // With options
 * <CosmicBackground
 *   showParticles={false}
 *   showGrid={false}
 *   isBlurred={modalOpen}
 * />
 * ```
 */
export function CosmicBackground({
  className,
  showStars = true,
  showOrbs = true,
  showAurora = true,
  showParticles = true,
  particleCount = 10,
  showGrid = true,
  isBlurred = false,
}: CosmicBackgroundProps) {
  return (
    <div
      className={cn(
        "cosmic-bg transition-all duration-300",
        isBlurred && "blur-md",
        className
      )}
    >
      {/* Animated stars layers */}
      {showStars && (
        <>
          <div className="cosmic-stars" />
          <div className="cosmic-stars-2" />
        </>
      )}

      {/* Animated gradient orbs */}
      {showOrbs && (
        <>
          <div className="cosmic-orb cosmic-orb-1" />
          <div className="cosmic-orb cosmic-orb-2" />
          <div className="cosmic-orb cosmic-orb-3" />
        </>
      )}

      {/* Aurora wave effect */}
      {showAurora && <div className="cosmic-aurora" />}

      {/* Rising particles */}
      {showParticles && (
        <div className="cosmic-particles">
          {Array.from({ length: particleCount }).map((_, i) => (
            <div key={i} className="cosmic-particle" />
          ))}
        </div>
      )}

      {/* Glowing grid */}
      {showGrid && <div className="cosmic-grid" />}
    </div>
  );
}

export default CosmicBackground;
