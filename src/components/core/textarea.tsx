import * as React from "react";
import { cn } from "../../lib/utils";

/**
 * Props for the Textarea component
 * Extends native textarea props with the same accessibility wiring as Input
 * (error / description + aria-invalid + aria-describedby).
 */
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Error message to display - also sets aria-invalid */
  error?: string;
  /** ID for the error message element (auto-generated if not provided) */
  errorId?: string;
  /** Description text under the textarea */
  description?: string;
  /** ID for the description element (auto-generated if not provided) */
  descriptionId?: string;
}

/**
 * Textarea — multi-line text input with the same a11y affordances as Input.
 *
 * @example
 * <Textarea description="Max 500 characters" />
 * <Textarea error="This field is required" />
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      error,
      errorId,
      description,
      descriptionId,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref,
  ) => {
    const generatedErrorId = React.useId();
    const generatedDescriptionId = React.useId();

    const effectiveErrorId = errorId || generatedErrorId;
    const effectiveDescriptionId = descriptionId || generatedDescriptionId;

    const hasError = !!error;

    const describedByParts: string[] = [];
    if (ariaDescribedBy) describedByParts.push(ariaDescribedBy);
    if (description) describedByParts.push(effectiveDescriptionId);
    if (hasError) describedByParts.push(effectiveErrorId);
    const finalDescribedBy =
      describedByParts.length > 0 ? describedByParts.join(" ") : undefined;

    return (
      <div className={description || hasError ? "space-y-1" : undefined}>
        <textarea
          className={cn(
            // `text-base md:text-sm` (16px on mobile, 14px from md up) — NOT a bare
            // `text-sm`. iOS Safari auto-zooms the viewport when a focused field's
            // font is < 16px, and (unlike a blur) it does NOT zoom back out when the
            // field is UNMOUNTED while still focused — e.g. the bug-report form swaps
            // to its success panel on submit, leaving the page stuck zoomed in
            // (report f08095a9). Matching the Input primitive (which already uses
            // this exact pattern) keeps the whole textarea family zoom-safe on phones
            // while unchanged at 14px on desktop.
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base md:text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            hasError && "border-destructive focus-visible:ring-destructive",
            className,
          )}
          ref={ref}
          aria-invalid={hasError || undefined}
          aria-describedby={finalDescribedBy}
          {...props}
        />
        {description && !hasError && (
          <p
            id={effectiveDescriptionId}
            className="text-xs text-muted-foreground"
          >
            {description}
          </p>
        )}
        {hasError && (
          <p
            id={effectiveErrorId}
            className="text-xs text-destructive"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
