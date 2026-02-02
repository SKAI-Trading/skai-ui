"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { AlertTriangle, AlertCircle, XCircle, Flame } from "lucide-react";
import { Progress } from "../feedback/progress";

interface LiquidationWarningProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Current price */
  currentPrice: number;
  /** Liquidation price */
  liquidationPrice: number;
  /** Entry price */
  entryPrice: number;
  /** Position side */
  side: "long" | "short";
  /** Leverage */
  leverage?: number;
  /** Custom risk thresholds */
  thresholds?: {
    safe: number; // Default: 0.2 (20% from liq)
    warning: number; // Default: 0.1 (10% from liq)
    danger: number; // Default: 0.05 (5% from liq)
  };
  /** Compact display mode */
  compact?: boolean;
  /** Show distance in percentage */
  showPercentage?: boolean;
  /** Show distance in price */
  showPrice?: boolean;
  /** Animation enabled */
  animate?: boolean;
  /** Callback when risk level changes */
  onRiskLevelChange?: (
    level: "safe" | "warning" | "danger" | "critical",
  ) => void;
}

type RiskLevel = "safe" | "warning" | "danger" | "critical";

/**
 * LiquidationWarning - Visual alert when position is near liquidation
 *
 * @example
 * <LiquidationWarning
 *   currentPrice={50000}
 *   liquidationPrice={45000}
 *   entryPrice={52000}
 *   side="long"
 *   leverage={10}
 * />
 */
const LiquidationWarning = React.forwardRef<
  HTMLDivElement,
  LiquidationWarningProps
>(
  (
    {
      currentPrice,
      liquidationPrice,
      entryPrice,
      side,
      leverage,
      thresholds = {
        safe: 0.2,
        warning: 0.1,
        danger: 0.05,
      },
      compact = false,
      showPercentage = true,
      showPrice = true,
      animate = true,
      onRiskLevelChange,
      className,
      ...props
    },
    ref,
  ) => {
    const prevRiskLevel = React.useRef<RiskLevel | null>(null);

    // Calculate distance to liquidation
    const distanceToLiq = Math.abs(currentPrice - liquidationPrice);
    const distancePercent = distanceToLiq / currentPrice;

    // Determine risk level
    const getRiskLevel = (): RiskLevel => {
      if (distancePercent <= thresholds.danger) return "critical";
      if (distancePercent <= thresholds.warning) return "danger";
      if (distancePercent <= thresholds.safe) return "warning";
      return "safe";
    };

    const riskLevel = getRiskLevel();

    // Notify on risk level change
    React.useEffect(() => {
      if (prevRiskLevel.current !== riskLevel) {
        prevRiskLevel.current = riskLevel;
        onRiskLevelChange?.(riskLevel);
      }
    }, [riskLevel, onRiskLevelChange]);

    // Visual configurations per risk level
    const riskConfig: Record<
      RiskLevel,
      {
        icon: React.ReactNode;
        color: string;
        bgColor: string;
        borderColor: string;
        label: string;
        progressColor: string;
      }
    > = {
      safe: {
        icon: null,
        color: "text-green-500",
        bgColor: "bg-green-500/10",
        borderColor: "border-green-500/20",
        label: "Safe",
        progressColor: "bg-green-500",
      },
      warning: {
        icon: <AlertCircle className="h-4 w-4" />,
        color: "text-yellow-500",
        bgColor: "bg-yellow-500/10",
        borderColor: "border-yellow-500/30",
        label: "Caution",
        progressColor: "bg-yellow-500",
      },
      danger: {
        icon: <AlertTriangle className="h-4 w-4" />,
        color: "text-orange-500",
        bgColor: "bg-orange-500/10",
        borderColor: "border-orange-500/40",
        label: "High Risk",
        progressColor: "bg-orange-500",
      },
      critical: {
        icon: <Flame className="h-4 w-4" />,
        color: "text-red-500",
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/50",
        label: "LIQUIDATION RISK",
        progressColor: "bg-red-500",
      },
    };

    const config = riskConfig[riskLevel];

    // Calculate progress (inverted - lower = more risk)
    const safetyProgress = Math.min(
      100,
      (distancePercent / thresholds.safe) * 100,
    );

    // Format helpers
    const formatPrice = (price: number) =>
      price.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

    const formatPercent = (percent: number) => `${(percent * 100).toFixed(2)}%`;

    if (riskLevel === "safe" && !compact) {
      return null; // Don't show when safe in non-compact mode
    }

    if (compact) {
      return (
        <div
          ref={ref}
          className={cn(
            "inline-flex items-center gap-2 px-2 py-1 rounded text-xs font-medium",
            config.bgColor,
            config.color,
            animate && riskLevel === "critical" && "animate-pulse",
            className,
          )}
          {...props}
        >
          {config.icon}
          <span>
            Liq: ${formatPrice(liquidationPrice)}
            {showPercentage && ` (${formatPercent(distancePercent)})`}
          </span>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          "p-4 rounded-lg border",
          config.bgColor,
          config.borderColor,
          animate && riskLevel === "critical" && "animate-pulse",
          className,
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <span className={cn("flex items-center gap-1.5", config.color)}>
            {config.icon}
            <span className="font-semibold">{config.label}</span>
          </span>
          {leverage && (
            <span className="text-xs text-muted-foreground ml-auto">
              {leverage}x {side.toUpperCase()}
            </span>
          )}
        </div>

        {/* Progress bar */}
        <div className="mb-3">
          <Progress value={safetyProgress} className="h-2" />
        </div>

        {/* Price info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground text-xs">Current Price</span>
            <p className="font-mono font-medium">
              ${formatPrice(currentPrice)}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground text-xs">
              Liquidation Price
            </span>
            <p className={cn("font-mono font-medium", config.color)}>
              ${formatPrice(liquidationPrice)}
            </p>
          </div>
          {showPrice && (
            <div>
              <span className="text-muted-foreground text-xs">Distance</span>
              <p className="font-mono font-medium">
                ${formatPrice(distanceToLiq)}
              </p>
            </div>
          )}
          {showPercentage && (
            <div>
              <span className="text-muted-foreground text-xs">Distance %</span>
              <p className={cn("font-mono font-medium", config.color)}>
                {formatPercent(distancePercent)}
              </p>
            </div>
          )}
        </div>

        {/* Warning message for critical */}
        {riskLevel === "critical" && (
          <div className="mt-3 pt-3 border-t border-red-500/30">
            <div className="flex items-center gap-2 text-red-500 text-sm">
              <XCircle className="h-4 w-4" />
              <span className="font-medium">
                Position at extreme risk! Consider reducing size or adding
                margin.
              </span>
            </div>
          </div>
        )}
      </div>
    );
  },
);

LiquidationWarning.displayName = "LiquidationWarning";

// Simple inline indicator
interface LiquidationIndicatorProps {
  distancePercent: number;
  className?: string;
}

const LiquidationIndicator = React.forwardRef<
  HTMLSpanElement,
  LiquidationIndicatorProps
>(({ distancePercent, className }, ref) => {
  const getRiskColor = () => {
    if (distancePercent <= 0.05) return "text-red-500";
    if (distancePercent <= 0.1) return "text-orange-500";
    if (distancePercent <= 0.2) return "text-yellow-500";
    return "text-green-500";
  };

  return (
    <span
      ref={ref}
      className={cn("font-mono text-xs", getRiskColor(), className)}
    >
      {(distancePercent * 100).toFixed(1)}% from liq
    </span>
  );
});

LiquidationIndicator.displayName = "LiquidationIndicator";

export { LiquidationWarning, LiquidationIndicator };
export type { LiquidationWarningProps, LiquidationIndicatorProps };
