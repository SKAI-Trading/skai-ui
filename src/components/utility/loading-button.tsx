import * as React from "react";
import { Loader2 } from "lucide-react";
import { Button, type ButtonProps } from "../core/button";
import { cn } from "../../lib/utils";

export interface LoadingButtonProps extends ButtonProps {
  /** Whether the button is in loading state */
  loading?: boolean;
  /** Text to show while loading (defaults to children) */
  loadingText?: string;
  /** Position of loading spinner */
  spinnerPosition?: "left" | "right";
  /** Custom spinner component */
  spinner?: React.ReactNode;
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  (
    {
      loading = false,
      loadingText,
      spinnerPosition = "left",
      spinner,
      children,
      disabled,
      className,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    const spinnerElement = spinner || (
      <Loader2
        className="h-4 w-4 animate-spin motion-reduce:animate-none"
        aria-hidden="true"
      />
    );

    return (
      <Button
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        aria-live={loading ? "polite" : undefined}
        className={cn(loading && "cursor-wait", className)}
        {...props}
      >
        {loading ? (
          <>
            {spinnerPosition === "left" && spinnerElement}
            <span>{loadingText || children}</span>
            {spinnerPosition === "right" && spinnerElement}
          </>
        ) : (
          children
        )}
      </Button>
    );
  },
);

LoadingButton.displayName = "LoadingButton";

export { LoadingButton };
