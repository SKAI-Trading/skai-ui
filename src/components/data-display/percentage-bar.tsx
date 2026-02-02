import * as React from "react";
import { cn } from "../../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const percentageBarVariants = cva(
  "relative h-2 w-full overflow-hidden rounded-full bg-muted",
  {
    variants: {
      size: {
        sm: "h-1",
        md: "h-2",
        lg: "h-3",
        xl: "h-4",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export interface PercentageBarProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof percentageBarVariants> {
  /** Percentage value (0-100) */
  value: number;
  /** Color variant */
  color?: "default" | "success" | "warning" | "error" | "gradient";
  /** Show percentage label */
  showLabel?: boolean;
  /** Label position */
  labelPosition?: "inside" | "right" | "top";
  /** Animate the bar */
  animated?: boolean;
}

const PercentageBar = React.forwardRef<HTMLDivElement, PercentageBarProps>(
  (
    {
      value,
      color = "default",
      size,
      showLabel = false,
      labelPosition = "right",
      animated = true,
      className,
      ...props
    },
    ref,
  ) => {
    const percentage = Math.min(100, Math.max(0, value));

    const colorClasses = {
      default: "bg-primary",
      success: "bg-green-500",
      warning: "bg-yellow-500",
      error: "bg-red-500",
      gradient: "bg-gradient-to-r from-primary to-cyan-400",
    };

    const Label = showLabel && (
      <span
        className={cn(
          "text-xs font-medium tabular-nums",
          labelPosition === "inside" &&
            "absolute inset-0 flex items-center justify-center text-white",
          labelPosition === "right" && "ml-2 text-muted-foreground",
          labelPosition === "top" && "mb-1 block text-muted-foreground",
        )}
      >
        {percentage.toFixed(0)}%
      </span>
    );

    return (
      <div
        className={cn(
          "flex items-center",
          labelPosition === "top" && "flex-col items-start",
        )}
      >
        {labelPosition === "top" && Label}
        <div
          ref={ref}
          className={cn(percentageBarVariants({ size }), className)}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          {...props}
        >
          <div
            className={cn(
              "h-full rounded-full",
              colorClasses[color],
              animated && "transition-all duration-500 ease-out",
            )}
            style={{ width: `${percentage}%` }}
          />
          {labelPosition === "inside" && Label}
        </div>
        {labelPosition === "right" && Label}
      </div>
    );
  },
);
PercentageBar.displayName = "PercentageBar";

// Multi-segment percentage bar (e.g., for portfolio allocation)
export interface SegmentedBarSegment {
  value: number;
  color: string;
  label?: string;
}

export interface SegmentedBarProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof percentageBarVariants> {
  segments: SegmentedBarSegment[];
  showTooltips?: boolean;
}

const SegmentedBar = React.forwardRef<HTMLDivElement, SegmentedBarProps>(
  ({ segments, size, showTooltips = true, className, ...props }, ref) => {
    const total = segments.reduce((acc, seg) => acc + seg.value, 0);

    return (
      <div
        ref={ref}
        className={cn(percentageBarVariants({ size }), "flex", className)}
        role="meter"
        {...props}
      >
        {segments.map((segment, i) => {
          const width = total > 0 ? (segment.value / total) * 100 : 0;
          return (
            <div
              key={i}
              className={cn(
                "h-full transition-all duration-500 ease-out first:rounded-l-full last:rounded-r-full",
                showTooltips && "cursor-help",
              )}
              style={{ width: `${width}%`, backgroundColor: segment.color }}
              title={
                showTooltips
                  ? `${segment.label || ""}: ${width.toFixed(1)}%`
                  : undefined
              }
            />
          );
        })}
      </div>
    );
  },
);
SegmentedBar.displayName = "SegmentedBar";

export { PercentageBar, SegmentedBar, percentageBarVariants };
