import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

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
        // Sky Blue #56C7F3 as a LITERAL, not `text-primary`.
        //
        // This library defines --primary AS #56C7F3 (styles/index.css: "Sky Blue,
        // Figma canonical"), so `text-primary` is correct here in isolation. But
        // the main app OVERRIDES --primary to the retired alien-green #2DEDAD
        // (skai-interface src/index.css), so every spinner that does not name a
        // variant rendered GREEN inside that app — 419 bare <Spinner> usages.
        //
        // That made it the single largest remaining green surface, and it is why
        // "the greens are fixed" kept getting contradicted: the tester auth gate
        // had its shield/refresh icons repainted blue while the spinner beside
        // them stayed green (reports 81c8d04b, 489f515c, 28577d7f, 18305822 —
        // "verifying access still has a green loading circle", "green circle over
        // the blue submit button").
        //
        // A literal is override-proof, which is the point. Fixing the consumer's
        // --primary instead would repaint ~2589 other usages — far too broad.
        default: "text-[#56C7F3]",
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
  /**
   * Render as a decorative icon (aria-hidden, no status/live region). Use for
   * spinners inside a button or next to text that already conveys the loading
   * state — this matches a plain inline icon's semantics and avoids announcing
   * "Loading" from every transient inline spinner. Defaults to false, which
   * keeps the announced role="status" behavior for standalone region loaders.
   */
  decorative?: boolean;
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size, variant, label = "Loading", decorative = false, ...props }, ref) => {
    const a11yProps = decorative
      ? ({ "aria-hidden": true } as const)
      : ({
          role: "status",
          "aria-busy": true,
          "aria-live": "polite",
          "aria-label": label,
        } as const);
    return (
      <div
        ref={ref}
        {...a11yProps}
        className={cn(
          spinnerVariants({ size, variant }),
          "motion-reduce:animate-none",
          className,
        )}
        {...props}
      >
        {!decorative && <span className="sr-only">{label}</span>}
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
      <div
        ref={ref}
        className={cn("relative", className)}
        aria-busy="true"
        {...props}
      >
        {children}
        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center gap-3",
            "bg-background/80",
            blur && "backdrop-blur-sm",
          )}
        >
          {/* Spinner already provides role=status + aria-live=polite */}
          <Spinner size={spinnerSize} />
          {text && (
            <p className="text-sm text-muted-foreground animate-pulse motion-reduce:animate-none">
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
