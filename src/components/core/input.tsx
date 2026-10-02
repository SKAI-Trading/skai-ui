import * as React from "react";
import { cn } from "../../lib/utils";

/**
 * Props for the Input component
 * Extends native input props with additional accessibility features
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Error message to display - also sets aria-invalid */
  error?: string;
  /** ID for the error message element (auto-generated if not provided) */
  errorId?: string;
  /** Description text for the input */
  description?: string;
  /** ID for the description element (auto-generated if not provided) */
  descriptionId?: string;
}

/**
 * What a `type="number"` field will take from the keyboard, a paste or a drop.
 *
 * Browsers let a number field hold `e`, `E`, `+` and `-` because they spell an
 * exponent ("1e5"), and Firefox lets it hold any letter at all. A controlled
 * `value` cannot keep them out: while the box reads "e" its value is the empty
 * string, so no change event fires and the letter stays on screen (report
 * 664eb181, an "e" in the spot ticket's Amount box). Every amount, price and
 * count field in the apps is one of these, so the field refuses them itself:
 * digits, the decimal point (and the comma some locales type for it), and a
 * minus sign only where the field can hold a value below zero.
 */
const NUMBER_FIELD_CHAR = /[0-9.,]/;

type InputMin = React.InputHTMLAttributes<HTMLInputElement>["min"];

/** A field whose `min` is zero or more has no use for a minus sign. */
export function numberFieldTakesNegative(min: InputMin): boolean {
  if (min === undefined || min === null || min === "") return true;
  const floor = Number(min);
  return !(Number.isFinite(floor) && floor >= 0);
}

/**
 * True when a keystroke must not reach a number field. Keys that do not type
 * a character (Backspace, the arrows, Tab, Enter) always pass.
 */
export function numberFieldRefusesKey(key: string, negative: boolean): boolean {
  if (key.length !== 1) return false;
  if (NUMBER_FIELD_CHAR.test(key)) return false;
  return !(key === "-" && negative);
}

/** True when pasted or dropped text carries anything a number field refuses. */
export function numberFieldRefusesText(text: string, negative: boolean): boolean {
  return (negative ? /[^0-9.,\s-]/ : /[^0-9.,\s]/).test(text);
}

type GuardedHandlers = Pick<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onKeyDown" | "onPaste" | "onDrop"
>;

/**
 * The key, paste and drop handlers a number field runs, each after the
 * caller's own. A caller that already called `preventDefault` has decided, and
 * a shortcut held with Ctrl, Cmd or Alt (copy, select all) passes. Any other
 * type gets the caller's handlers back untouched.
 */
function numberFieldGuards(
  type: string | undefined,
  min: InputMin,
  { onKeyDown, onPaste, onDrop }: GuardedHandlers,
): GuardedHandlers {
  if (type !== "number") return { onKeyDown, onPaste, onDrop };
  const negative = numberFieldTakesNegative(min);
  return {
    onKeyDown: (e) => {
      onKeyDown?.(e);
      if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return;
      if (numberFieldRefusesKey(e.key, negative)) e.preventDefault();
    },
    onPaste: (e) => {
      onPaste?.(e);
      if (e.defaultPrevented) return;
      const text = e.clipboardData?.getData("text") ?? "";
      if (numberFieldRefusesText(text, negative)) e.preventDefault();
    },
    onDrop: (e) => {
      onDrop?.(e);
      if (e.defaultPrevented) return;
      const text = e.dataTransfer?.getData("text") ?? "";
      if (numberFieldRefusesText(text, negative)) e.preventDefault();
    },
  };
}

/**
 * Input - Text input with accessibility enhancements
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Input placeholder="Enter text" />
 *
 * // With error
 * <Input error="This field is required" />
 *
 * // With description
 * <Input description="Enter your email address" />
 * ```
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      error,
      errorId,
      description,
      descriptionId,
      "aria-describedby": ariaDescribedBy,
      onKeyDown,
      onPaste,
      onDrop,
      ...props
    },
    ref,
  ) => {
    const generatedErrorId = React.useId();
    const generatedDescriptionId = React.useId();
    const guards = numberFieldGuards(type, props.min, { onKeyDown, onPaste, onDrop });

    const effectiveErrorId = errorId || generatedErrorId;
    const effectiveDescriptionId = descriptionId || generatedDescriptionId;

    const hasError = !!error;

    // Build aria-describedby from multiple sources
    const describedByParts: string[] = [];
    if (ariaDescribedBy) describedByParts.push(ariaDescribedBy);
    if (description) describedByParts.push(effectiveDescriptionId);
    if (hasError) describedByParts.push(effectiveErrorId);
    const finalDescribedBy =
      describedByParts.length > 0 ? describedByParts.join(" ") : undefined;

    return (
      <div className="space-y-1">
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            hasError && "border-destructive focus-visible:ring-destructive",
            className,
          )}
          ref={ref}
          aria-invalid={hasError}
          aria-describedby={finalDescribedBy}
          {...props}
          {...guards}
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
Input.displayName = "Input";

// =============================================================================
// SKAI BRANDED INPUT (From Figma Design System)
// =============================================================================
// Uses SKAI design tokens: 3 sizes × 6 states × 2 modes
// - Sizes: large (132px), medium (98px), small (88px)
// - States: normal, active, focus, completed, error
// - Modes: dark, light
// =============================================================================

export interface SkaiInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Label text above the input */
  label?: string;
  /** Size variant: large, medium, small */
  skaiSize?: "large" | "medium" | "small";
  /** Color mode: dark or light */
  mode?: "dark" | "light";
  /** Current state (overrides auto-detected state) */
  state?: "normal" | "active" | "focus" | "completed" | "error";
  /** Error message (sets state to error) */
  error?: string;
  /** Helper text or action (e.g., "Max" button) */
  helperAction?: React.ReactNode;
  /** Secondary display value (e.g., USD equivalent) */
  secondaryValue?: string;
}

/**
 * SKAI Branded Input - Uses Figma design system tokens
 *
 * @example
 * // Large dark input (default)
 * <SkaiInput label="Amount" placeholder="0.00" />
 *
 * // Medium light input with error
 * <SkaiInput
 *   label="Email"
 *   mode="light"
 *   skaiSize="medium"
 *   error="Invalid email format"
 * />
 *
 * // With helper action and secondary value
 * <SkaiInput
 *   label="From"
 *   helperAction={<button>Max</button>}
 *   secondaryValue="≈ $1,234.56"
 * />
 */
const SkaiInput = React.forwardRef<HTMLInputElement, SkaiInputProps>(
  (
    {
      className,
      label,
      skaiSize = "large",
      mode = "dark",
      state,
      error,
      helperAction,
      secondaryValue,
      onFocus,
      onBlur,
      onKeyDown,
      onPaste,
      onDrop,
      id,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const guards = numberFieldGuards(props.type, props.min, {
      onKeyDown,
      onPaste,
      onDrop,
    });
    // Accessibility: associate the label with the input via htmlFor/id, and
    // wire error/secondary value into aria-describedby + aria-invalid so screen
    // readers announce them. Auto-generate ids when caller doesn't provide one.
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const secondaryId = `${inputId}-secondary`;
    const describedByParts: string[] = [];
    if (error) describedByParts.push(errorId);
    if (secondaryValue && !error) describedByParts.push(secondaryId);
    const ariaDescribedBy =
      describedByParts.length > 0 ? describedByParts.join(" ") : undefined;

    // Determine current state
    const currentState = error
      ? "error"
      : state || (isFocused ? "focus" : "normal");

    // Size classes from Figma
    const sizeClasses = {
      large: "min-h-[132px] p-5 text-base",
      medium: "min-h-[98px] p-4 text-sm",
      small: "min-h-[88px] p-3 text-sm",
    };

    // Mode classes
    const modeClasses = {
      dark: "bg-[#001615] text-white placeholder:text-white/60",
      light: "bg-white text-[#001615] placeholder:text-[#001615]/60",
    };

    // State classes (border colors from Figma)
    const stateClasses = {
      normal: "border-transparent",
      active: "border-[#2DEDAD]",
      focus: "border-[#56C7F3] shadow-[0px_4px_12px_rgba(0,0,0,0.24)]",
      completed: "border-[#2DEDAD]",
      error: "border-[#FF574A]",
    };

    // Label size classes
    const labelSizeClasses = {
      large: "text-sm",
      medium: "text-xs",
      small: "text-xs",
    };

    // Border radius from Figma
    const radiusClasses = {
      large: "rounded-[16px]",
      medium: "rounded-xl",
      small: "rounded-xl",
    };

    return (
      <div
        className={cn(
          "flex flex-col gap-2 border-[1.5px] transition-all duration-200",
          sizeClasses[skaiSize],
          modeClasses[mode],
          stateClasses[currentState],
          radiusClasses[skaiSize],
          className,
        )}
      >
        {/* Header: Label + Helper Action */}
        {(label || helperAction) && (
          <div className="flex items-center justify-between">
            {label && (
              <label
                htmlFor={inputId}
                className={cn(
                  "font-['Manrope'] tracking-[-0.04em]",
                  labelSizeClasses[skaiSize],
                  mode === "dark" ? "text-white" : "text-[#001615]",
                )}
              >
                {label}
              </label>
            )}
            {helperAction && (
              <div className="text-[#2DEDAD] text-sm">{helperAction}</div>
            )}
          </div>
        )}

        {/* Input */}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={ariaDescribedBy}
          className={cn(
            "bg-transparent outline-none font-['Manrope'] tracking-[-0.04em] w-full",
            "placeholder:opacity-60",
          )}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          {...props}
          {...guards}
        />

        {/* Footer: Secondary Value or Error */}
        {(secondaryValue || error) && (
          <div
            id={error ? errorId : secondaryId}
            role={error ? "alert" : undefined}
            className={cn(
              "text-xs font-['Manrope'] tracking-[-0.04em]",
              error ? "text-[#FF574A]" : "text-white/60",
            )}
          >
            {error || secondaryValue}
          </div>
        )}
      </div>
    );
  },
);
SkaiInput.displayName = "SkaiInput";

export { Input, SkaiInput };
