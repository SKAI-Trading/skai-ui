import * as React from "react";
import { cn } from "../../lib/utils";

interface CircularProgressProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Progress value (0–100). Values outside the range are clamped. */
  value: number;
  /** Size in pixels. Default: 64. */
  size?: number;
  /** Stroke width in pixels. Default: 4. */
  strokeWidth?: number;
  /** Show the centered percentage label. */
  showLabel?: boolean;
  /** Track (background ring) className. */
  trackClassName?: string;
  /** Indicator (foreground ring) className. */
  indicatorClassName?: string;
  /** Accessible label (defaults to "Progress"). */
  label?: string;
}

/**
 * CircularProgress — SVG circular progress indicator (Figma: Loading states)
 *
 * Displays a circular progress ring with optional percentage label.
 *
 * `ref` points at the wrapper `<div>` so consumers can read/measure it; the
 * inner `<svg>` carries the progressbar ARIA role.
 */
const CircularProgress = React.forwardRef<HTMLDivElement, CircularProgressProps>(
  (
    {
      value,
      size = 64,
      strokeWidth = 4,
      className,
      showLabel = true,
      trackClassName,
      indicatorClassName,
      label = "Progress",
      ...rest
    },
    ref,
  ) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const clamped = Math.max(0, Math.min(100, value));
    const offset = circumference - (clamped / 100) * circumference;

    return (
      <div
        ref={ref}
        {...rest}
        className={cn(
          "relative inline-flex items-center justify-center",
          className,
        )}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
          role="progressbar"
          aria-label={label}
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuetext={`${Math.round(clamped)} percent`}
        >
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            className={cn("stroke-muted", trackClassName)}
          />
          {/* Indicator */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={cn(
              "stroke-primary transition-[stroke-dashoffset] duration-300 ease-out motion-reduce:transition-none",
              indicatorClassName,
            )}
          />
        </svg>
        {showLabel && (
          <span
            aria-hidden="true"
            className="absolute text-xs font-numbers tabular-nums text-foreground"
          >
            {Math.round(clamped)}%
          </span>
        )}
      </div>
    );
  },
);
CircularProgress.displayName = "CircularProgress";

export { CircularProgress };
export type { CircularProgressProps };
