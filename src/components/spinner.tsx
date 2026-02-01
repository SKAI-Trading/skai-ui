import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const spinnerVariants = cva(
  "animate-spin rounded-full border-current border-t-transparent",
  {
    variants: {
      size: {
        xs: "h-3 w-3 border",
        sm: "h-4 w-4 border-2",
        md: "h-6 w-6 border-2",
        lg: "h-8 w-8 border-[3px]",
        xl: "h-12 w-12 border-4",
      },
      variant: {
        default: "text-primary",
        muted: "text-muted-foreground",
        white: "text-white",
        success: "text-green-500",
        warning: "text-yellow-500",
        error: "text-red-500",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  },
);

export interface SpinnerProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  /** Accessible label for screen readers */
  label?: string;
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size, variant, label = "Loading", ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="status"
        aria-label={label}
        className={cn(spinnerVariants({ size, variant }), className)}
        {...props}
      >
        <span className="sr-only">{label}</span>
      </div>
    );
  },
);
Spinner.displayName = "Spinner";

export interface LoadingOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether the overlay is visible */
  loading?: boolean;
  /** Spinner size */
  spinnerSize?: SpinnerProps["size"];
  /** Loading text */
  text?: string;
  /** Blur the background */
  blur?: boolean;
}

const LoadingOverlay = React.forwardRef<HTMLDivElement, LoadingOverlayProps>(
  (
    {
      loading = true,
      spinnerSize = "lg",
      text,
      blur = true,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    if (!loading) return <>{children}</>;

    return (
      <div ref={ref} className={cn("relative", className)} {...props}>
        {children}
        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center gap-3",
            "bg-background/80",
            blur && "backdrop-blur-sm",
          )}
        >
          <Spinner size={spinnerSize} />
          {text && (
            <p className="text-sm text-muted-foreground animate-pulse">
              {text}
            </p>
          )}
        </div>
      </div>
    );
  },
);
LoadingOverlay.displayName = "LoadingOverlay";

export { Spinner, LoadingOverlay, spinnerVariants };
