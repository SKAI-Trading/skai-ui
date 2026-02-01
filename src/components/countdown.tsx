import * as React from "react";
import { cn } from "../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { useCountdown, formatCountdown } from "../hooks/use-countdown";

const countdownVariants = cva("font-mono tabular-nums", {
  variants: {
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-xl",
      xl: "text-3xl",
    },
    variant: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      urgent: "text-red-500",
      success: "text-green-500",
    },
  },
  defaultVariants: {
    size: "md",
    variant: "default",
  },
});

export interface CountdownProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof countdownVariants> {
  /** Target date/time or seconds remaining */
  target: Date | number;
  /** Format style */
  format?: "full" | "short" | "minimal" | "boxes";
  /** Callback when countdown completes */
  onComplete?: () => void;
  /** Show urgent styling when below threshold (seconds) */
  urgentThreshold?: number;
  /** Label to show before countdown */
  label?: string;
  /** Text to show when complete */
  completeText?: string;
}

const Countdown = React.forwardRef<HTMLDivElement, CountdownProps>(
  (
    {
      target,
      format = "short",
      onComplete,
      urgentThreshold = 60,
      label,
      completeText = "Complete!",
      size,
      variant,
      className,
      ...props
    },
    ref,
  ) => {
    const countdown = useCountdown(target, { onComplete });
    const { days, hours, minutes, seconds, totalSeconds, isComplete } =
      countdown;

    // Auto-urgent styling
    const effectiveVariant =
      variant === "default" &&
      totalSeconds > 0 &&
      totalSeconds <= urgentThreshold
        ? "urgent"
        : variant;

    if (isComplete) {
      return (
        <div
          ref={ref}
          className={cn(
            countdownVariants({ size, variant: "success" }),
            className,
          )}
          {...props}
        >
          {completeText}
        </div>
      );
    }

    if (format === "boxes") {
      const TimeBox = ({ value, unit }: { value: number; unit: string }) => (
        <div className="flex flex-col items-center">
          <div
            className={cn(
              "rounded-lg bg-muted px-3 py-2 font-bold",
              size === "sm" && "px-2 py-1 text-sm",
              size === "lg" && "px-4 py-3 text-2xl",
              size === "xl" && "px-5 py-4 text-4xl",
            )}
          >
            {value.toString().padStart(2, "0")}
          </div>
          <span className="mt-1 text-xs text-muted-foreground uppercase">
            {unit}
          </span>
        </div>
      );

      return (
        <div
          ref={ref}
          className={cn("flex items-start gap-2", className)}
          {...props}
        >
          {label && (
            <span className="mr-2 text-sm text-muted-foreground">{label}</span>
          )}
          {days > 0 && <TimeBox value={days} unit="days" />}
          <TimeBox value={hours} unit="hrs" />
          <TimeBox value={minutes} unit="min" />
          <TimeBox value={seconds} unit="sec" />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          countdownVariants({ size, variant: effectiveVariant }),
          className,
        )}
        {...props}
      >
        {label && (
          <span className="mr-2 text-muted-foreground font-normal">
            {label}
          </span>
        )}
        {formatCountdown(countdown, format)}
      </div>
    );
  },
);
Countdown.displayName = "Countdown";

export { Countdown, countdownVariants };
