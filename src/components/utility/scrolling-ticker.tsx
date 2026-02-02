import * as React from "react";
import { cn } from "../../lib/utils";

export interface ScrollingTickerItem {
  /** Unique identifier */
  id: string;
  /** Content to display */
  content: React.ReactNode;
}

export interface ScrollingTickerProps {
  /** Items to display in the ticker */
  items: ScrollingTickerItem[];
  /** Speed of scroll animation in pixels per second */
  speed?: number;
  /** Direction of scroll */
  direction?: "left" | "right";
  /** Pause on hover */
  pauseOnHover?: boolean;
  /** Gap between items */
  gap?: number;
  /** Custom className */
  className?: string;
  /** Custom className for items */
  itemClassName?: string;
  /** Separator between items */
  separator?: React.ReactNode;
  /** Whether to show gradient fade on edges */
  showFade?: boolean;
  /** Fade width in pixels */
  fadeWidth?: number;
}

/**
 * ScrollingTicker - Continuous horizontal scrolling marquee
 *
 * Features:
 * - Smooth infinite scroll animation
 * - Configurable speed and direction
 * - Pause on hover
 * - Gradient fade on edges
 * - Responsive and accessible
 *
 * @example
 * ```tsx
 * <ScrollingTicker
 *   items={[
 *     { id: "1", content: <span>BTC $45,000</span> },
 *     { id: "2", content: <span>ETH $3,200</span> },
 *   ]}
 *   speed={50}
 *   pauseOnHover
 * />
 * ```
 */
const ScrollingTicker = React.forwardRef<HTMLDivElement, ScrollingTickerProps>(
  (
    {
      items,
      speed = 50,
      direction = "left",
      pauseOnHover = true,
      gap = 32,
      className,
      itemClassName,
      separator,
      showFade = true,
      fadeWidth = 40,
    },
    ref,
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [contentWidth, setContentWidth] = React.useState(0);
    const [isPaused, setIsPaused] = React.useState(false);

    // Measure content width for animation
    React.useEffect(() => {
      const measureContent = () => {
        if (containerRef.current) {
          const firstGroup = containerRef.current.querySelector(
            "[data-ticker-group]",
          );
          if (firstGroup) {
            setContentWidth(firstGroup.scrollWidth);
          }
        }
      };

      measureContent();
      window.addEventListener("resize", measureContent);
      return () => window.removeEventListener("resize", measureContent);
    }, [items, gap]);

    // Calculate animation duration based on speed
    const duration = contentWidth > 0 ? contentWidth / speed : 20;

    // Duplicate items to create seamless loop
    const renderItems = (key: string) => (
      <div
        className={cn("flex shrink-0 items-center", `gap-[${gap}px]`)}
        style={{ gap: `${gap}px` }}
        data-ticker-group
        key={key}
      >
        {items.map((item, index) => (
          <React.Fragment key={`${key}-${item.id}`}>
            <div className={cn("shrink-0", itemClassName)}>{item.content}</div>
            {separator && index < items.length - 1 && (
              <div className="shrink-0 text-muted-foreground">{separator}</div>
            )}
          </React.Fragment>
        ))}
      </div>
    );

    if (items.length === 0) return null;

    return (
      <div
        ref={ref}
        className={cn("relative overflow-hidden", className)}
        onMouseEnter={() => pauseOnHover && setIsPaused(true)}
        onMouseLeave={() => pauseOnHover && setIsPaused(false)}
        role="marquee"
        aria-live="off"
        aria-label="Scrolling ticker"
      >
        {/* Left fade gradient */}
        {showFade && (
          <div
            className="pointer-events-none absolute left-0 top-0 z-10 h-full bg-gradient-to-r from-background to-transparent"
            style={{ width: `${fadeWidth}px` }}
          />
        )}

        {/* Scrolling content */}
        <div
          ref={containerRef}
          className={cn("flex", isPaused && "animation-play-state-paused")}
          style={{
            animationName: "ticker-scroll",
            animationDuration: `${duration}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            animationDirection: direction === "right" ? "reverse" : "normal",
            animationPlayState: isPaused ? "paused" : "running",
          }}
        >
          {renderItems("group-1")}
          {renderItems("group-2")}
          {renderItems("group-3")}
        </div>

        {/* Right fade gradient */}
        {showFade && (
          <div
            className="pointer-events-none absolute right-0 top-0 z-10 h-full bg-gradient-to-l from-background to-transparent"
            style={{ width: `${fadeWidth}px` }}
          />
        )}

        {/* CSS animation keyframes */}
        <style>{`
          @keyframes ticker-scroll {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(-${contentWidth + gap}px);
            }
          }
        `}</style>
      </div>
    );
  },
);

ScrollingTicker.displayName = "ScrollingTicker";

/**
 * TickerItem - Pre-styled item for common use cases
 */
interface TickerItemProps {
  /** Label text */
  label?: string;
  /** Main value */
  value: React.ReactNode;
  /** Change indicator (+/-) */
  change?: React.ReactNode;
  /** Icon */
  icon?: React.ReactNode;
  /** Custom className */
  className?: string;
}

const TickerItem: React.FC<TickerItemProps> = ({
  label,
  value,
  change,
  icon,
  className,
}) => (
  <div className={cn("flex items-center gap-2", className)}>
    {icon && <span className="shrink-0">{icon}</span>}
    {label && <span className="text-muted-foreground">{label}</span>}
    <span className="font-medium">{value}</span>
    {change && <span>{change}</span>}
  </div>
);

TickerItem.displayName = "TickerItem";

export { ScrollingTicker, TickerItem };
