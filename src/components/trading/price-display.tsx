import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const priceDisplayVariants = cva("inline-flex items-center gap-1 font-mono", {
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
    },
    trend: {
      up: "text-green-500",
      down: "text-red-500",
      neutral: "text-muted-foreground",
    },
  },
  defaultVariants: {
    size: "md",
    trend: "neutral",
  },
});

export interface PriceDisplayProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof priceDisplayVariants> {
  /** The price value to display */
  value: number | string;
  /** Currency symbol (e.g., "$", "€", "ETH") */
  currency?: string;
  /** Position of currency symbol */
  currencyPosition?: "prefix" | "suffix";
  /** Percentage change (shows trend indicator) */
  change?: number;
  /** Show trend icon */
  showTrendIcon?: boolean;
  /** Number of decimal places */
  decimals?: number;
  /** Use compact notation for large numbers */
  compact?: boolean;
  /** Show plus sign for positive values */
  showSign?: boolean;
}

/**
 * Format number with locale-aware formatting
 */
function formatPrice(
  value: number | string,
  decimals: number = 2,
  compact: boolean = false,
): string {
  const num = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(num)) return "—";

  if (compact) {
    if (Math.abs(num) >= 1_000_000_000) {
      return (num / 1_000_000_000).toFixed(2) + "B";
    }
    if (Math.abs(num) >= 1_000_000) {
      return (num / 1_000_000).toFixed(2) + "M";
    }
    if (Math.abs(num) >= 1_000) {
      return (num / 1_000).toFixed(2) + "K";
    }
  }

  // Smart decimals: more for small numbers, fewer for large
  let effectiveDecimals = decimals;
  if (Math.abs(num) < 0.01) {
    effectiveDecimals = Math.max(decimals, 6);
  } else if (Math.abs(num) < 1) {
    effectiveDecimals = Math.max(decimals, 4);
  } else if (Math.abs(num) >= 1000) {
    effectiveDecimals = Math.min(decimals, 2);
  }

  return num.toLocaleString("en-US", {
    minimumFractionDigits: effectiveDecimals,
    maximumFractionDigits: effectiveDecimals,
  });
}

const PriceDisplay = React.forwardRef<HTMLSpanElement, PriceDisplayProps>(
  (
    {
      value,
      currency = "$",
      currencyPosition = "prefix",
      change,
      showTrendIcon = true,
      decimals = 2,
      compact = false,
      showSign = false,
      size,
      trend: propTrend,
      className,
      ...props
    },
    ref,
  ) => {
    // Determine trend from change if not explicitly set
    const trend =
      propTrend ||
      (change !== undefined
        ? change > 0
          ? "up"
          : change < 0
            ? "down"
            : "neutral"
        : "neutral");

    const formattedPrice = formatPrice(value, decimals, compact);
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    const sign = showSign && numValue > 0 ? "+" : "";

    const TrendIcon =
      trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

    const iconSize =
      size === "xs"
        ? 10
        : size === "sm"
          ? 12
          : size === "lg"
            ? 18
            : size === "xl"
              ? 20
              : size === "2xl"
                ? 24
                : 14;

    return (
      <span
        ref={ref}
        className={cn(priceDisplayVariants({ size, trend, className }))}
        {...props}
      >
        {showTrendIcon && change !== undefined && (
          <TrendIcon size={iconSize} className="flex-shrink-0" />
        )}
        <span>
          {currencyPosition === "prefix" && (
            <span className="opacity-70">{currency}</span>
          )}
          {sign}
          {formattedPrice}
          {currencyPosition === "suffix" && (
            <span className="opacity-70 ml-0.5">{currency}</span>
          )}
        </span>
        {change !== undefined && (
          <span className="text-[0.8em] opacity-80">
            ({change > 0 ? "+" : ""}
            {change.toFixed(2)}%)
          </span>
        )}
      </span>
    );
  },
);

PriceDisplay.displayName = "PriceDisplay";

export { PriceDisplay, priceDisplayVariants, formatPrice };
