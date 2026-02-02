"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { Badge } from "../core/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../feedback/tooltip";

interface FundingRateDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Current funding rate as decimal (e.g., 0.0001 for 0.01%) */
  rate: number;
  /** Time until next funding in seconds */
  nextFundingIn: number;
  /** Funding interval in hours (default: 8) */
  intervalHours?: number;
  /** Show countdown timer */
  showCountdown?: boolean;
  /** Show rate as annualized */
  showAnnualized?: boolean;
  /** Compact mode (just rate + countdown) */
  compact?: boolean;
  /** Custom format for the rate */
  formatRate?: (rate: number) => string;
  /** Callback when rate updates */
  onRateUpdate?: (rate: number) => void;
}

/**
 * FundingRateDisplay - Shows perpetual futures funding rate with countdown
 *
 * @example
 * <FundingRateDisplay
 *   rate={0.0001}  // 0.01%
 *   nextFundingIn={3600}  // 1 hour
 * />
 */
const FundingRateDisplay = React.forwardRef<
  HTMLDivElement,
  FundingRateDisplayProps
>(
  (
    {
      rate,
      nextFundingIn,
      intervalHours = 8,
      showCountdown = true,
      showAnnualized = false,
      compact = false,
      formatRate,
      onRateUpdate,
      className,
      ...props
    },
    ref,
  ) => {
    const [timeLeft, setTimeLeft] = React.useState(nextFundingIn);

    // Countdown timer
    React.useEffect(() => {
      setTimeLeft(nextFundingIn);

      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) {
            onRateUpdate?.(rate);
            return intervalHours * 60 * 60;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }, [nextFundingIn, intervalHours, rate, onRateUpdate]);

    // Format time as HH:MM:SS
    const formatTime = (seconds: number): string => {
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = seconds % 60;
      return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    // Format rate as percentage
    const displayRate = formatRate
      ? formatRate(rate)
      : `${(rate * 100).toFixed(4)}%`;

    // Calculate annualized rate (rate * periods per year)
    const periodsPerYear = (365 * 24) / intervalHours;
    const annualizedRate = rate * periodsPerYear;
    const displayAnnualized = `${(annualizedRate * 100).toFixed(2)}%`;

    // Determine if rate is positive (longs pay shorts) or negative (shorts pay longs)
    const isPositive = rate >= 0;
    const rateColor = isPositive ? "text-green-500" : "text-red-500";
    const rateBgColor = isPositive ? "bg-green-500/10" : "bg-red-500/10";

    if (compact) {
      return (
        <div
          ref={ref}
          className={cn("inline-flex items-center gap-2 text-sm", className)}
          {...props}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className={cn("font-mono font-medium", rateColor)}>
                  {displayRate}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-xs">
                  <p>Funding Rate: {displayRate}</p>
                  {showAnnualized && <p>Annualized: {displayAnnualized}</p>}
                  <p className="text-muted-foreground mt-1">
                    {isPositive ? "Longs pay shorts" : "Shorts pay longs"}
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {showCountdown && (
            <span className="text-muted-foreground font-mono text-xs">
              {formatTime(timeLeft)}
            </span>
          )}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-4 p-3 rounded-lg border",
          rateBgColor,
          className,
        )}
        {...props}
      >
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Funding Rate</span>
          <div className="flex items-center gap-2">
            <span className={cn("font-mono font-semibold text-lg", rateColor)}>
              {displayRate}
            </span>
            <Badge
              variant={isPositive ? "default" : "destructive"}
              className="text-[10px]"
            >
              {isPositive ? "Long pays" : "Short pays"}
            </Badge>
          </div>
          {showAnnualized && (
            <span className="text-xs text-muted-foreground">
              APR: {displayAnnualized}
            </span>
          )}
        </div>

        {showCountdown && (
          <div className="flex flex-col items-end ml-auto">
            <span className="text-xs text-muted-foreground">
              Next funding in
            </span>
            <span className="font-mono font-medium text-lg">
              {formatTime(timeLeft)}
            </span>
          </div>
        )}
      </div>
    );
  },
);

FundingRateDisplay.displayName = "FundingRateDisplay";

// Compact inline version
interface FundingRateBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  rate: number;
  showSign?: boolean;
}

const FundingRateBadge = ({
  rate,
  showSign = true,
  className,
  ...props
}: FundingRateBadgeProps) => {
  const isPositive = rate >= 0;
  const displayRate = `${showSign && isPositive ? "+" : ""}${(rate * 100).toFixed(4)}%`;

  return (
    <Badge
      variant={isPositive ? "default" : "destructive"}
      className={cn("font-mono", className)}
      {...props}
    >
      {displayRate}
    </Badge>
  );
};

FundingRateBadge.displayName = "FundingRateBadge";

export { FundingRateDisplay, FundingRateBadge };
export type { FundingRateDisplayProps, FundingRateBadgeProps };
