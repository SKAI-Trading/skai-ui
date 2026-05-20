import * as React from "react";
import { Check, Copy } from "lucide-react";
import { Button, type ButtonProps } from "../core/button";
import { cn } from "../../lib/utils";

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
    const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    React.useEffect(() => {
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }, []);

    const handleCopy = React.useCallback(async () => {
      try {
        // navigator.clipboard is undefined in non-secure contexts (http://
        // without localhost) and some sandboxed iframes. Fall back to the
        // deprecated execCommand path so the button still works.
        if (
          typeof navigator !== "undefined" &&
          navigator.clipboard &&
          typeof navigator.clipboard.writeText === "function"
        ) {
          await navigator.clipboard.writeText(value);
        } else if (typeof document !== "undefined") {
          const ta = document.createElement("textarea");
          ta.value = value;
          ta.setAttribute("readonly", "");
          ta.style.position = "fixed";
          ta.style.opacity = "0";
          document.body.appendChild(ta);
          ta.select();
          const ok = document.execCommand("copy");
          document.body.removeChild(ta);
          if (!ok) throw new Error("execCommand copy returned false");
        } else {
          throw new Error("Clipboard API unavailable");
        }
        setCopied(true);
        onCopySuccess?.(value);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setCopied(false);
        }, successDuration);
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Failed to copy");
        onCopyError?.(error);
        // eslint-disable-next-line no-console
        console.error("Copy failed:", error);
      }
    }, [value, successDuration, onCopySuccess, onCopyError]);

    return (
      <Button
        ref={ref}
        type="button"
        variant={variant}
        size={showLabel ? "sm" : size}
        onClick={handleCopy}
        className={cn("transition-all", copied && "text-green-500", className)}
        aria-label={copied ? labels.copied : labels.copy}
        aria-live="polite"
        {...props}
      >
        {children || (
          <>
            {copied ? (
              <Check className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Copy className="h-4 w-4" aria-hidden="true" />
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
