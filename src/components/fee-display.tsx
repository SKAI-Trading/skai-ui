/**
 * FeeDisplay Component
 *
 * Displays fee information with breakdown for transactions.
 * Configurable for different contexts (trading, gaming, etc.)
 *
 * @example
 * ```tsx
 * import { FeeDisplay } from '@skai/ui';
 *
 * <FeeDisplay
 *   amount={100}
 *   feePercent={0.3}
 *   tokenSymbol="USDC"
 * />
 * ```
 */

import * as React from "react";
import { Info, TrendingDown } from "lucide-react";
import { cn } from "../lib/utils";
import { Card, CardContent } from "./card";
import { Badge } from "./badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

interface FeeDisplayProps {
  /** Input amount */
  amount: number;
  /** Fee percentage (e.g., 0.3 for 0.3%) */
  feePercent: number;
  /** Token symbol */
  tokenSymbol?: string;
  /** Show detailed breakdown */
  showBreakdown?: boolean;
  /** Display variant */
  variant?: "default" | "compact" | "inline";
  /** Whether loading */
  loading?: boolean;
  /** Label for the fee (default: "Platform Fee") */
  feeLabel?: string;
  /** Show rewards hint */
  showRewardsHint?: boolean;
  /** Rewards hint text */
  rewardsHintText?: string;
  /** Additional class names */
  className?: string;
}

/**
 * Format fee as percentage string
 */
const formatFeePercent = (fee: number) => {
  return `${fee.toFixed(2)}%`;
};

/**
 * Format amount with proper decimals
 */
const formatAmount = (amount: number) => {
  return amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  });
};

const FeeDisplay = React.forwardRef<HTMLDivElement, FeeDisplayProps>(
  (
    {
      amount,
      feePercent,
      tokenSymbol = "USDC",
      showBreakdown = true,
      variant = "default",
      loading = false,
      feeLabel = "Platform Fee",
      showRewardsHint = false,
      rewardsHintText,
      className,
    },
    ref,
  ) => {
    const feeAmount = (amount * feePercent) / 100;
    const netAmount = amount - feeAmount;

    // Compact variant - single line
    if (variant === "compact") {
      return (
        <div
          ref={ref}
          className={cn("flex items-center justify-between text-sm", className)}
        >
          <span className="text-muted-foreground">
            {feeLabel} ({formatFeePercent(feePercent)}):
          </span>
          <span className="font-medium">
            {formatAmount(feeAmount)} {tokenSymbol}
          </span>
        </div>
      );
    }

    // Inline variant - for tooltips or small spaces
    if (variant === "inline") {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span ref={ref}>
                <Badge
                  variant="outline"
                  className={cn("cursor-help", className)}
                >
                  Fee: {formatFeePercent(feePercent)}
                </Badge>
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-1 text-xs">
                <div>
                  Amount: {formatAmount(amount)} {tokenSymbol}
                </div>
                <div>
                  Fee: {formatAmount(feeAmount)} {tokenSymbol}
                </div>
                <div className="font-semibold">
                  Net: {formatAmount(netAmount)} {tokenSymbol}
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    // Default variant - full card with breakdown
    if (loading) {
      return (
        <Card ref={ref} className={className}>
          <CardContent className="pt-6">
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-muted rounded w-1/3"></div>
              <div className="h-8 bg-muted rounded w-1/2"></div>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card ref={ref} className={className}>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold">Fee Breakdown</h4>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-xs">
                        Platform fees help maintain the protocol and provide
                        rewards to users
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Badge variant="secondary">{formatFeePercent(feePercent)}</Badge>
            </div>

            {/* Breakdown */}
            {showBreakdown && (
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Input Amount:</span>
                  <span className="font-medium">
                    {formatAmount(amount)} {tokenSymbol}
                  </span>
                </div>
                <div className="flex items-center justify-between text-orange-500">
                  <span>{feeLabel}:</span>
                  <span className="font-medium">
                    -{formatAmount(feeAmount)} {tokenSymbol}
                  </span>
                </div>
                <div className="border-t pt-2 mt-2 flex items-center justify-between">
                  <span className="font-semibold">Net Amount:</span>
                  <span className="font-bold text-primary">
                    {formatAmount(netAmount)} {tokenSymbol}
                  </span>
                </div>
              </div>
            )}

            {/* Rewards Hint */}
            {showRewardsHint && rewardsHintText && (
              <div className="flex items-start gap-2 p-3 bg-primary/10 rounded-lg">
                <TrendingDown className="h-4 w-4 text-primary mt-0.5" />
                <div className="text-xs">
                  <p className="font-medium text-primary">{rewardsHintText}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  },
);
FeeDisplay.displayName = "FeeDisplay";

/**
 * House Edge Display for Gaming
 */
interface HouseEdgeDisplayProps {
  /** House edge percentage */
  houseEdge: number;
  /** Optional bet amount for calculations */
  betAmount?: number;
  /** Whether loading */
  loading?: boolean;
  /** Additional class names */
  className?: string;
}

const HouseEdgeDisplay = React.forwardRef<
  HTMLDivElement,
  HouseEdgeDisplayProps
>(({ houseEdge, betAmount, loading = false, className }, ref) => {
  if (loading) {
    return (
      <div
        ref={ref}
        className={cn("animate-pulse h-6 bg-muted rounded w-32", className)}
      />
    );
  }

  const expectedReturn = betAmount
    ? betAmount * ((100 - houseEdge) / 100)
    : null;

  return (
    <div ref={ref} className={cn("flex items-center gap-2", className)}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="secondary" className="cursor-help">
              House Edge: {formatFeePercent(houseEdge)}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-1 text-xs max-w-xs">
              <p className="font-semibold">What is House Edge?</p>
              <p>
                The house edge is the mathematical advantage the platform has
                over players. A {formatFeePercent(houseEdge)} house edge means
                your expected return is {formatFeePercent(100 - houseEdge)}.
              </p>
              {betAmount && expectedReturn && (
                <div className="pt-2 border-t">
                  <p>Example bet: {formatAmount(betAmount)}</p>
                  <p>Expected return: {formatAmount(expectedReturn)}</p>
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
});
HouseEdgeDisplay.displayName = "HouseEdgeDisplay";

export { FeeDisplay, HouseEdgeDisplay, formatFeePercent, formatAmount };
export type { FeeDisplayProps, HouseEdgeDisplayProps };
