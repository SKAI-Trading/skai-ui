import * as React from "react";
import { cn } from "../../lib/utils";
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

    // A loss MUST render a minus sign — relying on red color alone fails
    // WCAG 1.4.1 (use of color) and silently drops the negative sign for
    // screen-reader users who only hear "Loss $50". The percentage uses the
    // same sign so the parenthetical never disagrees with the headline.
    const sign = isProfit ? "+" : isLoss ? "-" : "";
    const absValue = Math.abs(value);

    // Format display value for aria
    const formattedValue = absValue.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    const resultText = isProfit ? "Profit" : isLoss ? "Loss" : "Breakeven";
    // Use the magnitude of percentage so a caller passing a signed value
    // (e.g. -5) can't produce a double sign ("--5.00%") now that loss has a
    // real "-" prefix.
    const absPercentage =
      percentage !== undefined ? Math.abs(percentage) : undefined;
    const percentText =
      absPercentage !== undefined
        ? `, ${sign}${absPercentage.toFixed(2)} percent`
        : "";
    const ariaLabel = `${label ? label + ": " : ""}${resultText} ${sign}${currency}${formattedValue}${percentText}`;

    return (
      <div
        ref={ref}
        className={cn(pnlDisplayVariants({ size, result }), className)}
        role="status"
        aria-label={ariaLabel}
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
        {absPercentage !== undefined && (
          <span className="text-[0.8em] opacity-80">
            ({sign}
            {absPercentage.toFixed(2)}%)
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

// PnL Card component
export interface PnLCardProps extends Omit<PnLDisplayProps, 'label'> {
  /** Card title */
  title: string;
}

const PnLCard = React.forwardRef<HTMLDivElement, PnLCardProps>(
  ({ title, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "p-4 rounded-lg border bg-card flex flex-col gap-2",
        className,
      )}
    >
      <span className="text-sm text-muted-foreground">{title}</span>
      <PnLDisplay {...props} />
    </div>
  ),
);
PnLCard.displayName = "PnLCard";

export { PnLDisplay, UnrealizedPnL, PnLCard, pnlDisplayVariants };
