import * as React from "react";
import { cn } from "../../lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Accessible label for screen readers (defaults to "Loading"). */
  label?: string;
  /** Shape variant — saves consumers from re-deriving common skeleton shapes
   * via className. Defaults to "rect". */
  shape?: "rect" | "circle" | "text";
}

const shapeClasses: Record<NonNullable<SkeletonProps["shape"]>, string> = {
  rect: "rounded-md",
  circle: "rounded-full",
  // Slightly shorter than default — visually matches a line of body text.
  text: "rounded h-4",
};

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, label = "Loading", shape = "rect", ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="status"
        aria-busy="true"
        aria-live="polite"
        aria-label={label}
        className={cn(
          "animate-pulse motion-reduce:animate-none bg-muted",
          shapeClasses[shape],
          className,
        )}
        {...props}
      />
    );
  },
);
Skeleton.displayName = "Skeleton";

export { Skeleton };
