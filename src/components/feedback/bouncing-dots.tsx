import * as React from "react";
import { cn } from "../../lib/utils";

interface BouncingDotsProps {
  className?: string;
  dotClassName?: string;
  size?: "sm" | "md" | "lg";
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
  ({ className, dotClassName, size = "md" }, ref) => {
    const dot = cn(
      "rounded-full bg-primary animate-bounce-dot motion-reduce:animate-none",
      dotSizes[size],
      dotClassName,
    );

    return (
      <div
        ref={ref}
        className={cn("inline-flex items-center gap-1.5", className)}
        role="status"
        aria-live="polite"
        aria-label="Loading"
      >
        <span aria-hidden="true" className={dot} style={{ animationDelay: "0ms" }} />
        <span aria-hidden="true" className={dot} style={{ animationDelay: "160ms" }} />
        <span aria-hidden="true" className={dot} style={{ animationDelay: "320ms" }} />
        <span className="sr-only">Loading</span>
      </div>
    );
  },
);
BouncingDots.displayName = "BouncingDots";

export { BouncingDots };
export type { BouncingDotsProps };
