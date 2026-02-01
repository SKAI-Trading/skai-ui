import * as React from "react";
import { cn } from "../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const pnlDisplayVariants = cva(
  "inline-flex items-baseline gap-1 font-medium tabular-nums",
  {
    variants: {
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
        xl: "text-2xl",
      },
      result: {
        profit: "text-green-500",
        loss: "text-red-500",
        breakeven: "text-muted-foreground",
      },
    },
    defaultVariants: {
      size: "md",
      result: "breakeven",
    },
  },
);

export interface PnLDisplayProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, "children">,
    Omit<VariantProps<typeof pnlDisplayVariants>, "result"> {
  /** PnL value (positive = profit, negative = loss) */
  value: number;
  /** Show percentage */
  percentage?: number;
  /** Currency symbol */
  currency?: string;
  /** Show label */
  label?: string;
  /** Number of decimals */
  decimals?: number;
  /** Threshold to consider breakeven */
  breakevenThreshold?: number;
}

const PnLDisplay = React.forwardRef<HTMLDivElement, PnLDisplayProps>(
  (
    {
      value,
      percentage,
      currency = "$",
      label,
      decimals = 2,
      breakevenThreshold = 0.01,
      size,
      className,
      ...props
    },
    ref,
  ) => {
    const isProfit = value > breakevenThreshold;
    const isLoss = value < -breakevenThreshold;
    const result = isProfit ? "profit" : isLoss ? "loss" : "breakeven";

    const sign = isProfit ? "+" : "";
    const absValue = Math.abs(value);

    return (
      <div
        ref={ref}
        className={cn(pnlDisplayVariants({ size, result }), className)}
        {...props}
      >
        {label && (
          <span className="text-muted-foreground font-normal mr-1">
            {label}
          </span>
        )}
        <span>
          {sign}
          {currency}
          {absValue.toLocaleString(undefined, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          })}
        </span>
        {percentage !== undefined && (
          <span className="text-[0.8em] opacity-80">
            ({sign}
            {percentage.toFixed(2)}%)
          </span>
        )}
      </div>
    );
  },
);
PnLDisplay.displayName = "PnLDisplay";

// Unrealized vs Realized PnL display
export interface UnrealizedPnLProps extends PnLDisplayProps {
  /** Mark as unrealized (adds "(Unrealized)" label) */
  isUnrealized?: boolean;
}

const UnrealizedPnL = React.forwardRef<HTMLDivElement, UnrealizedPnLProps>(
  ({ isUnrealized = true, ...props }, ref) => (
    <div className="flex flex-col">
      <PnLDisplay ref={ref} {...props} />
      {isUnrealized && (
        <span className="text-xs text-muted-foreground">(Unrealized)</span>
      )}
    </div>
  ),
);
UnrealizedPnL.displayName = "UnrealizedPnL";

export { PnLDisplay, UnrealizedPnL, pnlDisplayVariants };
