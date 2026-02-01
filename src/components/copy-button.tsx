import * as React from "react";
import { Check, Copy } from "lucide-react";
import { Button, type ButtonProps } from "./button";
import { cn } from "../lib/utils";

export interface CopyButtonProps extends Omit<
  ButtonProps,
  "onClick" | "onCopy"
> {
  /** Text to copy to clipboard */
  value: string;
  /** Duration to show success state (ms) */
  successDuration?: number;
  /** Callback when copy succeeds */
  onCopySuccess?: (value: string) => void;
  /** Callback when copy fails */
  onCopyError?: (error: Error) => void;
  /** Show text label */
  showLabel?: boolean;
  /** Custom labels */
  labels?: {
    copy?: string;
    copied?: string;
  };
}

const CopyButton = React.forwardRef<HTMLButtonElement, CopyButtonProps>(
  (
    {
      value,
      successDuration = 2000,
      onCopySuccess,
      onCopyError,
      showLabel = false,
      labels = { copy: "Copy", copied: "Copied!" },
      variant = "ghost",
      size = "icon",
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = React.useCallback(async () => {
      try {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        onCopySuccess?.(value);

        setTimeout(() => {
          setCopied(false);
        }, successDuration);
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Failed to copy");
        onCopyError?.(error);
        console.error("Copy failed:", error);
      }
    }, [value, successDuration, onCopySuccess, onCopyError]);

    return (
      <Button
        ref={ref}
        variant={variant}
        size={showLabel ? "sm" : size}
        onClick={handleCopy}
        className={cn("transition-all", copied && "text-green-500", className)}
        aria-label={copied ? labels.copied : labels.copy}
        {...props}
      >
        {children || (
          <>
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {showLabel && (
              <span className="ml-1">
                {copied ? labels.copied : labels.copy}
              </span>
            )}
          </>
        )}
      </Button>
    );
  },
);

CopyButton.displayName = "CopyButton";

export { CopyButton };
