import * as React from "react";
import { cn } from "../../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { TrendingUpIcon, TrendingDownIcon, MinusIcon } from "lucide-react";

const priceChangeVariants = cva(
  "inline-flex items-center gap-1 font-medium tabular-nums",
  {
    variants: {
      size: {
        xs: "text-xs",
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
        xl: "text-xl",
      },
      direction: {
        up: "text-green-500",
        down: "text-red-500",
        neutral: "text-muted-foreground",
      },
    },
    defaultVariants: {
      size: "sm",
      direction: "neutral",
    },
  },
);

export interface PriceChangeProps
  extends
    Omit<React.HTMLAttributes<HTMLSpanElement>, "children">,
    Omit<VariantProps<typeof priceChangeVariants>, "direction"> {
  /** Price change value (positive or negative) */
  value: number;
  /** Show as percentage */
  isPercentage?: boolean;
  /** Show icon */
  showIcon?: boolean;
  /** Show + sign for positive values */
  showSign?: boolean;
  /** Number of decimal places */
  decimals?: number;
  /** Prefix symbol (e.g., "$") */
  prefix?: string;
  /** Suffix symbol */
  suffix?: string;
  /** Invert colors (positive = red, negative = green) */
  invertColors?: boolean;
}

const PriceChange = React.forwardRef<HTMLSpanElement, PriceChangeProps>(
  (
    {
      value,
      isPercentage = true,
      showIcon = true,
      showSign = true,
      decimals = 2,
      prefix = "",
      suffix = "",
      invertColors = false,
      size,
      className,
      ...props
    },
    ref,
  ) => {
    const isPositive = value > 0;
    const isNegative = value < 0;

    let direction: "up" | "down" | "neutral" = "neutral";
    if (isPositive) direction = invertColors ? "down" : "up";
    if (isNegative) direction = invertColors ? "up" : "down";

    const Icon = isPositive
      ? TrendingUpIcon
      : isNegative
        ? TrendingDownIcon
        : MinusIcon;

    const sign = showSign && isPositive ? "+" : "";
    const displayValue = Math.abs(value).toFixed(decimals);
    const percentSymbol = isPercentage ? "%" : "";

    // Screen reader friendly description
    const directionText = isPositive ? "up" : isNegative ? "down" : "unchanged";
    const ariaLabel = `Price ${directionText} ${prefix}${displayValue}${percentSymbol}${suffix}`;

    return (
      <span
        ref={ref}
        className={cn(priceChangeVariants({ size, direction }), className)}
        role="status"
        aria-label={ariaLabel}
        {...props}
      >
        {showIcon && <Icon className="h-[1em] w-[1em]" />}
        <span>
          {sign}
          {prefix}
          {displayValue}
          {percentSymbol}
          {suffix}
        </span>
      </span>
    );
  },
);
PriceChange.displayName = "PriceChange";

// Simplified variants
export const PercentageChange = React.forwardRef<
  HTMLSpanElement,
  Omit<PriceChangeProps, "isPercentage">
>((props, ref) => <PriceChange ref={ref} isPercentage {...props} />);
PercentageChange.displayName = "PercentageChange";

export const USDChange = React.forwardRef<
  HTMLSpanElement,
  Omit<PriceChangeProps, "isPercentage" | "prefix">
>((props, ref) => (
  <PriceChange ref={ref} isPercentage={false} prefix="$" {...props} />
));
USDChange.displayName = "USDChange";

export { PriceChange, priceChangeVariants };
