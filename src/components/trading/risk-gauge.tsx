import * as React from "react";
import { cn } from "../../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

/**
 * Risk level type
 */
export type RiskLevel = "low" | "medium" | "high" | "critical";

/**
 * Risk gauge variants
 */
const riskGaugeVariants = cva("relative", {
  variants: {
    size: {
      sm: "h-16 w-16",
      md: "h-24 w-24",
      lg: "h-32 w-32",
      xl: "h-40 w-40",
    },
    variant: {
      arc: "",
      bar: "h-auto w-full",
      circle: "",
    },
  },
  defaultVariants: {
    size: "md",
    variant: "arc",
  },
});

/**
 * Props for RiskGauge component
 */
export interface RiskGaugeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof riskGaugeVariants> {
  /** Risk score from 0-100 */
  score: number;
  /** Risk level (auto-calculated if not provided) */
  level?: RiskLevel;
  /** Show numeric score */
  showScore?: boolean;
  /** Show risk label */
  showLabel?: boolean;
  /** Custom label text */
  label?: string;
  /** Animate on mount */
  animated?: boolean;
}

/**
 * Calculate risk level from score
 */
function calculateRiskLevel(score: number): RiskLevel {
  if (score <= 25) return "low";
  if (score <= 50) return "medium";
  if (score <= 75) return "high";
  return "critical";
}

/**
 * Risk level colors
 */
const riskColors: Record<
  RiskLevel,
  { bg: string; text: string; fill: string }
> = {
  low: {
    bg: "bg-green-500/20",
    text: "text-green-500",
    fill: "stroke-green-500",
  },
  medium: {
    bg: "bg-yellow-500/20",
    text: "text-yellow-500",
    fill: "stroke-yellow-500",
  },
  high: {
    bg: "bg-orange-500/20",
    text: "text-orange-500",
    fill: "stroke-orange-500",
  },
  critical: {
    bg: "bg-red-500/20",
    text: "text-red-500",
    fill: "stroke-red-500",
  },
};

/**
 * Risk level labels
 */
const riskLabels: Record<RiskLevel, string> = {
  low: "Low Risk",
  medium: "Medium Risk",
  high: "High Risk",
  critical: "Critical Risk",
};

/**
 * Arc Gauge variant
 */
function ArcGauge({
  score,
  level,
  size,
  showScore,
  showLabel,
  label,
  animated,
  className,
}: RiskGaugeProps & { level: RiskLevel }) {
  const colors = riskColors[level];
  const percentage = Math.min(100, Math.max(0, score));

  // SVG arc calculation
  const radius = 40;
  const circumference = Math.PI * radius; // Half circle
  const offset = circumference - (percentage / 100) * circumference;

  const sizeClasses = {
    sm: "h-16 w-32",
    md: "h-24 w-48",
    lg: "h-32 w-64",
    xl: "h-40 w-80",
  };

  return (
    <div
      className={cn(
        "relative flex flex-col items-center",
        sizeClasses[size || "md"],
        className,
      )}
      role="meter"
      aria-valuenow={score}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label || `Risk score: ${score}%`}
    >
      <svg
        viewBox="0 0 100 50"
        className="w-full h-auto"
        style={{ overflow: "visible" }}
      >
        {/* Background arc */}
        <path
          d="M 10 50 A 40 40 0 0 1 90 50"
          fill="none"
          strokeWidth="8"
          className="stroke-muted"
          strokeLinecap="round"
        />
        {/* Progress arc */}
        <path
          d="M 10 50 A 40 40 0 0 1 90 50"
          fill="none"
          strokeWidth="8"
          className={cn(colors.fill, animated && "transition-all duration-700")}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animated ? offset : offset}
          style={{
            transform: "rotate(180deg)",
            transformOrigin: "50px 50px",
          }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
        {showScore && (
          <span className={cn("text-2xl font-bold", colors.text)}>{score}</span>
        )}
        {showLabel && (
          <span className="text-xs text-muted-foreground">
            {label || riskLabels[level]}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * Bar Gauge variant
 */
function BarGauge({
  score,
  level,
  showScore,
  showLabel,
  label,
  animated,
  className,
}: RiskGaugeProps & { level: RiskLevel }) {
  const colors = riskColors[level];
  const percentage = Math.min(100, Math.max(0, score));

  return (
    <div
      className={cn("space-y-2", className)}
      role="meter"
      aria-valuenow={score}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label || `Risk score: ${score}%`}
    >
      {/* Header */}
      <div className="flex items-center justify-between text-sm">
        {showLabel && (
          <span className={colors.text}>{label || riskLabels[level]}</span>
        )}
        {showScore && (
          <span className={cn("font-mono font-bold", colors.text)}>
            {score}%
          </span>
        )}
      </div>

      {/* Bar */}
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full",
            colors.bg.replace("/20", ""),
            animated && "transition-all duration-700",
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Markers */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>0</span>
        <span>25</span>
        <span>50</span>
        <span>75</span>
        <span>100</span>
      </div>
    </div>
  );
}

/**
 * Circle Gauge variant
 */
function CircleGauge({
  score,
  level,
  size,
  showScore,
  showLabel,
  label,
  animated,
  className,
}: RiskGaugeProps & { level: RiskLevel }) {
  const colors = riskColors[level];
  const percentage = Math.min(100, Math.max(0, score));

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        riskGaugeVariants({ size }),
        className,
      )}
      role="meter"
      aria-valuenow={score}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label || `Risk score: ${score}%`}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth="8"
          className="stroke-muted"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth="8"
          className={cn(colors.fill, animated && "transition-all duration-700")}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showScore && (
          <span className={cn("text-2xl font-bold", colors.text)}>{score}</span>
        )}
        {showLabel && (
          <span className="text-xs text-muted-foreground">
            {label || riskLabels[level]}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * RiskGauge - Visual risk assessment indicator
 *
 * @example
 * ```tsx
 * // Arc gauge (default)
 * <RiskGauge score={65} showScore showLabel />
 *
 * // Bar gauge
 * <RiskGauge score={45} variant="bar" showScore showLabel />
 *
 * // Circle gauge
 * <RiskGauge score={80} variant="circle" showScore animated />
 *
 * // Custom level
 * <RiskGauge score={30} level="medium" />
 * ```
 */
const RiskGauge = React.forwardRef<HTMLDivElement, RiskGaugeProps>(
  (
    {
      score,
      level,
      size = "md",
      variant = "arc",
      showScore = true,
      showLabel = true,
      label,
      animated = true,
      className,
      ...props
    },
    ref,
  ) => {
    const calculatedLevel = level || calculateRiskLevel(score);

    const commonProps = {
      score,
      level: calculatedLevel,
      size,
      showScore,
      showLabel,
      label,
      animated,
      className,
    };

    return (
      <div ref={ref} {...props}>
        {variant === "bar" ? (
          <BarGauge {...commonProps} />
        ) : variant === "circle" ? (
          <CircleGauge {...commonProps} />
        ) : (
          <ArcGauge {...commonProps} />
        )}
      </div>
    );
  },
);

RiskGauge.displayName = "RiskGauge";

// Convenience aliases for specific variants
const RiskBar = React.forwardRef<HTMLDivElement, Omit<RiskGaugeProps, 'variant'>>(
  (props, ref) => <RiskGauge ref={ref} variant="bar" {...props} />
);
RiskBar.displayName = "RiskBar";

const RiskMeter = React.forwardRef<HTMLDivElement, Omit<RiskGaugeProps, 'variant'>>(
  (props, ref) => <RiskGauge ref={ref} variant="circle" {...props} />
);
RiskMeter.displayName = "RiskMeter";

// RiskScoreCard - Card wrapper for risk display
export interface RiskScoreCardProps extends Omit<RiskGaugeProps, 'variant' | 'size'> {
  /** Card title */
  title: string;
  /** Optional description */
  description?: string;
}

const RiskScoreCard = React.forwardRef<HTMLDivElement, RiskScoreCardProps>(
  ({ title, description, score, className, ...props }, ref) => {
    const level = props.level || calculateRiskLevel(score);
    const colors = riskColors[level];
    
    return (
      <div
        ref={ref}
        className={cn(
          "p-4 rounded-lg border bg-card flex flex-col gap-3",
          className,
        )}
      >
        <div className="flex items-center justify-between">
          <span className="font-medium">{title}</span>
          <span className={cn("text-xl font-bold", colors.text)}>{score}</span>
        </div>
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-500", colors.bg.replace("/20", ""))}
            style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
          />
        </div>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    );
  }
);
RiskScoreCard.displayName = "RiskScoreCard";

export { RiskGauge, RiskBar, RiskMeter, RiskScoreCard, calculateRiskLevel, riskColors, riskLabels };
