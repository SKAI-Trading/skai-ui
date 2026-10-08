import * as React from "react";
import { cn } from "../../lib/utils";
import { skaiFontSizes } from "../../lib/design-tokens";
import { useNumberFieldGuard } from "./number-field-guard";

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

/** Tailwind's own size scale in px. The preset's named sizes come from skaiFontSizes. */
const TAILWIND_TEXT_PX: Record<string, number> = {
  xs: 12, sm: 14, base: 16, lg: 18, xl: 20, "2xl": 24, "3xl": 30,
  "4xl": 36, "5xl": 48, "6xl": 60, "7xl": 72, "8xl": 96, "9xl": 128,
};

function lengthPx(value: unknown): number | undefined {
  const m = /^(\d*\.?\d+)(px|rem)$/.exec(String(value ?? ""));
  if (!m) return undefined;
  return Number(m[1]) * (m[2] === "rem" ? 16 : 1);
}

/** The px a bare size class such as `text-xs`, `text-[22px]` or `text-para-2` sets, when it can be read. */
function textClassPx(sizeClass: string): number | undefined {
  const key = sizeClass.slice("text-".length);
  if (key.startsWith("[")) return lengthPx(key.slice(1, -1));
  if (key in TAILWIND_TEXT_PX) return TAILWIND_TEXT_PX[key];
  const token = (skaiFontSizes as Record<string, unknown>)[key];
  return lengthPx(Array.isArray(token) ? token[0] : token);
}

const isSize = (c: string) => cn("text-base", c) === c;
// tailwind-merge files a size under line height too (a size sets one), so a
// size is ruled out before a class is read as a line height.
const isLeading = (c: string) => !isSize(c) && cn("leading-none", c) === c;

/**
 * The last class `className` names under `variant` ("" for none, or "sm:")
 * that passes `test`, without the variant and with its `!` kept. The last one
 * is the one that wins.
 */
function lastOwn(
  className: string | undefined,
  variant: "" | "sm:",
  test: (c: string) => boolean,
): string | undefined {
  return (className ?? "")
    .split(/\s+/)
    .filter((c) => c.startsWith(variant))
    .map((c) => c.slice(variant.length))
    .filter((c) => {
      const bare = c.replace(/^!/, "");
      return bare !== "" && test(bare);
    })
    .pop();
}

/** Tailwind's own line heights for its two sizes under 16. */
const TAILWIND_TEXT_LEADING: Record<string, string> = { xs: "1rem", sm: "1.25rem" };

/**
 * The line height a size class carries: its `/` value (`text-sm/[18px]` ->
 * `[18px]`), else the token's own (`text-para-1-mobile` -> `[1rem]`). An
 * arbitrary `text-[14px]` carries none.
 */
function sizeLeading(sizeClass: string): string | undefined {
  const m = /^!?text-(\[[^\]]+\]|[^/\s]+)(?:\/(.+))?$/.exec(sizeClass);
  if (!m) return undefined;
  if (m[2]) return m[2];
  if (m[1].startsWith("[")) return undefined;
  const token = (skaiFontSizes as Record<string, unknown>)[m[1]];
  const tokenLeading = Array.isArray(token) ? (token[1] as { lineHeight?: string } | undefined)?.lineHeight : undefined;
  const leading = TAILWIND_TEXT_LEADING[m[1]] ?? tokenLeading;
  return leading ? `[${leading}]` : undefined;
}

/** Whether a size class is under 16px, or cannot be read here (a CSS variable, an `em`). */
function under16(sizeClass: string): boolean {
  const size = sizeClass.replace(/^!/, "").replace(/^(text-(?:\[[^\]]+\]|[^/\s]+))\/.+$/, "$1");
  const px = textClassPx(size);
  return px === undefined || px < 16;
}

/**
 * `text-base` under `variant`, important when the caller's size is, and
 * carrying the caller's own line height for that band, because a `text-*`
 * under a breakpoint would otherwise replace it with its own 24px.
 */
function sixteen(variant: string, size: string, leading: string | undefined): string {
  return `${variant}${size.startsWith("!") ? "!" : ""}text-base${leading ? `/${leading}` : ""}`;
}

/**
 * The text size classes a field adds under its caller's, so that it is never
 * under 16px below md, where iOS Safari zooms the page into a focused field
 * that is, and draws the frames' 14px from md up (Casey 2026-10-08 Q29, which
 * takes back the phone half of 2026-10-05 #10; zoom is never locked).
 *
 * - The caller names no size: `text-base md:text-sm`.
 * - The caller names a size under 16: `max-md:text-base`, so its size holds
 *   from md up (#105) and the phone gets 16 on the caller's own line height
 *   (`max-md:text-base/[18px]` under `leading-[18px]` or `text-sm/[18px]`,
 *   `max-md:text-base/[1.25rem]` under a bare `text-sm`), so the field's box
 *   keeps its height. When the caller's size is marked important
 *   (`!text-xs`), so is the 16.
 * - The caller names an `sm:` size under 16: `sm:max-md:text-base` too.
 *   Tailwind writes `max-md:` before `sm:`, so without it the caller's `sm:`
 *   size would win from 640 to 767.
 * - The caller names 16 or more: nothing; its size holds at every width.
 *
 * A caller that sets its own `max-md:` size replaces the 16, and is choosing
 * the zoom. Input, Textarea and PasswordInput apply this, and so does every
 * field built on them. A field on a raw element takes the same rule with
 * `cn(fieldTextSize(className), className)`.
 */
export function fieldTextSize(className?: string): string | undefined {
  const own = lastOwn(className, "", isSize);
  const ownSm = lastOwn(className, "sm:", isSize);
  // The line height in force on a phone, and from 640 to 767: a `leading-*`
  // outranks the size's own `/` value, and an `sm:` one the bare one.
  const leading = (c: string | undefined) => c?.replace(/^!/, "").slice("leading-".length);
  const phoneLeading = leading(lastOwn(className, "", isLeading)) ?? (own && sizeLeading(own));
  const smLeading = leading(lastOwn(className, "sm:", isLeading)) ?? (ownSm && sizeLeading(ownSm)) ?? phoneLeading;
  const classes: string[] = [];
  if (own === undefined) classes.push("text-base md:text-sm");
  else if (under16(own)) classes.push(sixteen("max-md:", own, phoneLeading));
  if (ownSm !== undefined && under16(ownSm)) classes.push(sixteen("sm:max-md:", ownSm, smLeading));
  return classes.length > 0 ? classes.join(" ") : undefined;
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
    // A number field refuses what cannot be part of a plain decimal and reads
    // a typed or pasted comma — see number-field-guard.
    const guard = useNumberFieldGuard({
      enabled: type === "number",
      min: props.min,
      ref,
      onKeyDown,
      onPaste,
      onDrop,
    });

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
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            fieldTextSize(className),
            hasError && "border-destructive focus-visible:ring-destructive",
            className,
          )}
          aria-invalid={hasError}
          aria-describedby={finalDescribedBy}
          {...props}
          {...guard}
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
    const guard = useNumberFieldGuard({
      enabled: props.type === "number",
      min: props.min,
      ref,
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
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={ariaDescribedBy}
          className={cn(
            "bg-transparent outline-none font-['Manrope'] tracking-[-0.04em] w-full",
            "placeholder:opacity-60",
            // It takes its size from the box; medium and small are 14, so the
            // field itself goes to 16 below md (Q29).
            fieldTextSize(cn(sizeClasses[skaiSize], className)),
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
          {...guard}
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
