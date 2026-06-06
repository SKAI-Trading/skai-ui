/**
 * <Pressable> — the canonical interactive surface.
 *
 * Every clickable thing in the app — a card, a chip, an icon button — should
 * use this primitive instead of hand-rolling `hover:bg-* transition-all
 * duration-200`. It ships with:
 *
 *   - hover feedback (lift / scale / tint / none)
 *   - press feedback (scale(0.97) via snappy spring)
 *   - focus-visible ring (2px primary, WCAG AA non-text contrast 3:1)
 *   - reduced-motion fallback (all transforms collapse to a tint change)
 *
 * It's `polymorphic` — pass `as="div"` for a non-button surface (card), `as="a"`
 * for a link, default is `<button type="button">`. It forwards refs and spreads
 * extra props, so it slots into existing markup without churn.
 *
 * @example
 *   <Pressable variant="lift" onClick={...}>
 *     <Card>...</Card>
 *   </Pressable>
 *
 * @example
 *   <Pressable variant="scale" as="a" href="/portfolio" className="rounded-full px-4 py-2">
 *     My performance
 *   </Pressable>
 */
import * as React from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { cn } from "../../lib/utils";
import { springs, interaction } from "../../lib/motion-tokens";

type PressableVariant = "lift" | "scale" | "tint" | "none";

type PressableOwnProps = {
  /**
   * Hover feedback style.
   *   - `lift`  — translateY(-2px) + shadow. Default for cards.
   *   - `scale` — scale(1.02). Default for icon buttons / chips.
   *   - `tint`  — opacity / bg-tint only. Default for inline text buttons.
   *   - `none`  — no hover transform (still gets press + focus). Use when the
   *               surrounding context already provides hover feedback.
   */
  variant?: PressableVariant;
  /** Render as a different element. Defaults to a real <button>. */
  as?: "button" | "a" | "div" | "span";
  /** Disable all interaction feedback and pointer events. */
  disabled?: boolean;
  /** Override the press-down scale. Default 0.97. Lower = more dramatic. */
  pressScale?: number;
  /** Override the hover lift in px (lift variant only). Default 2. */
  hoverLiftPx?: number;
  /** Override the hover scale (scale variant only). Default 1.02. */
  hoverScale?: number;
  /** Suppress focus-visible ring. Use sparingly — accessibility regression. */
  noFocusRing?: boolean;
  className?: string;
  children?: React.ReactNode;
};

export type PressableProps = PressableOwnProps &
  Omit<HTMLMotionProps<"button">, keyof PressableOwnProps>;

export const Pressable = React.forwardRef<HTMLElement, PressableProps>(
  (
    {
      variant = "lift",
      as = "button",
      disabled = false,
      pressScale = interaction.pressScale,
      hoverLiftPx = interaction.hoverLiftPx,
      hoverScale = interaction.hoverScale,
      noFocusRing = false,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const reduced = useReducedMotion();

    // Reduced-motion users still need a hover affordance, just not a transform.
    // We rewrite the variant to `tint` so they see opacity feedback only.
    const effectiveVariant: PressableVariant = reduced
      ? variant === "none"
        ? "none"
        : "tint"
      : variant;

    // Built per-variant so the spring only fires when there's something to
    // animate (avoids GPU-layer churn on no-op variants).
    const whileHover = disabled
      ? undefined
      : effectiveVariant === "lift"
        ? { y: -hoverLiftPx, boxShadow: interaction.hoverShadow }
        : effectiveVariant === "scale"
          ? { scale: hoverScale }
          : effectiveVariant === "tint"
            ? { opacity: 0.85 }
            : undefined;

    const whileTap =
      disabled || effectiveVariant === "none"
        ? undefined
        : reduced
          ? { opacity: 0.7 }
          : { scale: pressScale };

    // `as` selects the underlying motion component. Defaults to <button> so
    // keyboard activation + form submission Just Work; pass `as="div"` only
    // when wrapping a non-interactive container.
    //
    // The cast through `React.ElementType` is intentional: each of `motion.a` /
    // `motion.div` / `motion.span` / `motion.button` has its own ref-element
    // type, and TS computes the union's ref slot as the *intersection* of those
    // types — which is uninhabitable, so no concrete ref value can satisfy it.
    // Treating the picked component as a generic ElementType erases the union
    // and lets the caller hand us whichever HTMLElement matches their `as`.
    const MotionComponent = (
      as === "a"
        ? motion.a
        : as === "div"
          ? motion.div
          : as === "span"
            ? motion.span
            : motion.button
    ) as React.ElementType;

    const focusRingClass = noFocusRing
      ? ""
      : "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background";

    return (
      <MotionComponent
        ref={ref}
        // Native button defaults — non-button `as` overrides drop these.
        type={as === "button" ? "button" : undefined}
        disabled={as === "button" ? disabled : undefined}
        aria-disabled={disabled || undefined}
        whileHover={whileHover}
        whileTap={whileTap}
        transition={springs.snappy}
        className={cn(
          "relative inline-flex items-center justify-center",
          "transition-colors", // colour-only state changes use CSS for cheapness
          focusRingClass,
          disabled && "pointer-events-none opacity-50",
          className,
        )}
        {...rest}
      >
        {children}
      </MotionComponent>
    );
  },
);

Pressable.displayName = "Pressable";
