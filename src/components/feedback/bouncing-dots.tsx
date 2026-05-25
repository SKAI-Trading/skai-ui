import * as React from "react";
import { cn } from "../../lib/utils";

interface BouncingDotsProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  dotClassName?: string;
  size?: "sm" | "md" | "lg";
  /** Accessible label for the loading indicator (default: "Loading"). */
  label?: string;
}

const dotSizes = {
  sm: "w-1.5 h-1.5",
  md: "w-2.5 h-2.5",
  lg: "w-3.5 h-3.5",
} as const;

/**
 * BouncingDots — animated loading indicator (Figma: Loading states)
 *
 * Three dots with staggered bounce animation.
 */
const BouncingDots = React.forwardRef<HTMLDivElement, BouncingDotsProps>(
  ({ className, dotClassName, size = "md", label = "Loading", ...rest }, ref) => {
    const dot = cn(
      "rounded-full bg-primary animate-bounce-dot motion-reduce:animate-none",
      dotSizes[size],
      dotClassName,
    );

    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        aria-label={rest["aria-label"] ?? label}
        {...rest}
        className={cn("inline-flex items-center gap-1.5", className)}
      >
        <span aria-hidden="true" className={dot} style={{ animationDelay: "0ms" }} />
        <span aria-hidden="true" className={dot} style={{ animationDelay: "160ms" }} />
        <span aria-hidden="true" className={dot} style={{ animationDelay: "320ms" }} />
        <span className="sr-only">{label}</span>
      </div>
    );
  },
);
BouncingDots.displayName = "BouncingDots";

export { BouncingDots };
export type { BouncingDotsProps };
