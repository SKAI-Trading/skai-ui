import * as React from "react";
import { cn } from "../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

// =============================================================================
// TICKER TAPE TYPES
// =============================================================================

export interface TickerTapeItem {
  /** Unique identifier */
  id: string;
  /** Display content (can be string or React node) */
  content: React.ReactNode;
  /** Optional click handler */
  onClick?: () => void;
  /** Optional href for link */
  href?: string;
  /** Value change indicator */
  change?: "positive" | "negative" | "neutral";
}

const tickerTapeVariants = cva("relative w-full overflow-hidden", {
  variants: {
    variant: {
      default: "bg-transparent",
      muted: "bg-muted/30",
      bordered: "border-y border-border",
      glass: "bg-background/50 backdrop-blur-sm",
    },
    size: {
      sm: "h-6 text-xs",
      md: "h-8 text-sm",
      lg: "h-10 text-base",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

const tickerTapeItemVariants = cva(
  "inline-flex items-center whitespace-nowrap transition-colors",
  {
    variants: {
      change: {
        positive: "text-green-500",
        negative: "text-red-500",
        neutral: "text-muted-foreground",
      },
    },
  },
);

export interface TickerTapeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tickerTapeVariants> {
  /** Items to display in the ticker */
  items: TickerTapeItem[];
  /** Animation speed in pixels per second */
  speed?: number;
  /** Scroll direction */
  direction?: "left" | "right";
  /** Pause animation on hover */
  pauseOnHover?: boolean;
  /** Gap between items in pixels */
  gap?: number;
  /** Separator between items */
  separator?: React.ReactNode;
  /** Show gradient fade at edges */
  showFade?: boolean;
  /** Whether ticker is paused */
  paused?: boolean;
  /** Duplicate items for seamless loop (auto-calculated if not specified) */
  duplicateCount?: number;
}

// =============================================================================
// TICKER TAPE COMPONENT
// =============================================================================

/**
 * TickerTape - Horizontally scrolling news/price ticker
 *
 * Features:
 * - Smooth infinite scroll animation
 * - Configurable speed and direction
 * - Pause on hover
 * - Click handlers for items
 * - Change indicators (positive/negative/neutral)
 * - Edge fade gradients
 *
 * @example Price ticker
 * ```tsx
 * <TickerTape
 *   items={[
 *     { id: "btc", content: "BTC $67,234.56", change: "positive" },
 *     { id: "eth", content: "ETH $3,456.78", change: "negative" },
 *     { id: "sol", content: "SOL $178.90", change: "positive" },
 *   ]}
 *   speed={50}
 *   pauseOnHover
 * />
 * ```
 *
 * @example News ticker
 * ```tsx
 * <TickerTape
 *   variant="bordered"
 *   items={[
 *     { id: "news1", content: "🔥 New feature launched!" },
 *     { id: "news2", content: "📈 Trading volume up 50%" },
 *   ]}
 *   separator={<span className="mx-4">•</span>}
 * />
 * ```
 */
const TickerTape = React.forwardRef<HTMLDivElement, TickerTapeProps>(
  (
    {
      items,
      speed = 50,
      direction = "left",
      pauseOnHover = true,
      gap = 48,
      separator,
      showFade = true,
      variant,
      size,
      paused = false,
      duplicateCount,
      className,
      ...props
    },
    ref,
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [contentWidth, setContentWidth] = React.useState(0);
    const [isHovered, setIsHovered] = React.useState(false);

    // Calculate how many times to duplicate for seamless loop
    const effectiveDuplicateCount = React.useMemo(() => {
      if (duplicateCount) return duplicateCount;
      // Ensure we have enough content to fill the container twice
      return Math.max(2, Math.ceil(2000 / (contentWidth || 1000)));
    }, [duplicateCount, contentWidth]);

    // Measure content width
    React.useEffect(() => {
      const measureContent = () => {
        if (containerRef.current) {
          const firstSet = containerRef.current.querySelector(
            "[data-ticker-content]",
          );
          if (firstSet) {
            setContentWidth(firstSet.scrollWidth);
          }
        }
      };
      measureContent();
      window.addEventListener("resize", measureContent);
      return () => window.removeEventListener("resize", measureContent);
    }, [items]);

    // Calculate animation duration based on content width and speed
    const duration = contentWidth / speed;

    const isPaused = paused || (pauseOnHover && isHovered);

    const renderItem = (item: TickerTapeItem, index: number) => {
      const itemContent = (
        <span
          className={cn(
            tickerTapeItemVariants({ change: item.change }),
            item.onClick || item.href
              ? "cursor-pointer hover:text-foreground"
              : "",
          )}
        >
          {item.content}
        </span>
      );

      const wrappedContent = item.href ? (
        <a
          key={`${item.id}-${index}`}
          href={item.href}
          className="inline-flex items-center"
        >
          {itemContent}
        </a>
      ) : item.onClick ? (
        <button
          key={`${item.id}-${index}`}
          onClick={item.onClick}
          className="inline-flex items-center"
        >
          {itemContent}
        </button>
      ) : (
        <span key={`${item.id}-${index}`} className="inline-flex items-center">
          {itemContent}
        </span>
      );

      return (
        <React.Fragment key={`${item.id}-${index}`}>
          {wrappedContent}
          {index < items.length - 1 &&
            (separator || (
              <span style={{ width: gap }} className="inline-block" />
            ))}
        </React.Fragment>
      );
    };

    const renderContent = () => (
      <div data-ticker-content className="inline-flex items-center">
        {items.map(renderItem)}
        {/* Gap after last item before repeat */}
        <span style={{ width: gap }} className="inline-block" />
      </div>
    );

    return (
      <div
        ref={ref}
        className={cn(tickerTapeVariants({ variant, size }), className)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        {/* Left fade gradient */}
        {showFade && (
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        )}

        {/* Scrolling content container */}
        <div
          ref={containerRef}
          className="flex items-center h-full"
          style={{
            animation: `ticker-scroll ${duration}s linear infinite`,
            animationDirection: direction === "right" ? "reverse" : "normal",
            animationPlayState: isPaused ? "paused" : "running",
          }}
        >
          {/* Duplicate content for seamless loop */}
          {Array.from({ length: effectiveDuplicateCount }).map((_, i) => (
            <React.Fragment key={i}>{renderContent()}</React.Fragment>
          ))}
        </div>

        {/* Right fade gradient */}
        {showFade && (
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        )}

        {/* CSS Animation Keyframes */}
        <style>{`
          @keyframes ticker-scroll {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(-${100 / effectiveDuplicateCount}%);
            }
          }
        `}</style>
      </div>
    );
  },
);
TickerTape.displayName = "TickerTape";

export { TickerTape, tickerTapeVariants, tickerTapeItemVariants };
