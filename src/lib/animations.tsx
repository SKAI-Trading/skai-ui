/**
 * SKAI Animation System
 *
 * Consistent motion primitives for the SKAI design system.
 * Includes CSS keyframes, Tailwind classes, and React hooks.
 */

import * as React from "react";
import { cn } from "../lib/utils";

// ============================================
// Animation Duration Tokens
// ============================================

export const durations = {
  instant: 0,
  fast: 150,
  normal: 300,
  slow: 500,
  slower: 700,
} as const;

// ============================================
// Easing Functions
// ============================================

export const easings = {
  // Standard easing
  ease: "cubic-bezier(0.4, 0, 0.2, 1)",
  easeIn: "cubic-bezier(0.4, 0, 1, 1)",
  easeOut: "cubic-bezier(0, 0, 0.2, 1)",
  easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",

  // Bouncy easing for playful elements
  bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  bounceIn: "cubic-bezier(0.6, -0.28, 0.735, 0.045)",
  bounceOut: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",

  // Sharp easing for UI feedback
  sharp: "cubic-bezier(0.4, 0, 0.6, 1)",

  // Spring-like easing
  spring: "cubic-bezier(0.175, 0.885, 0.32, 1.1)",
} as const;

// ============================================
// Reduced Motion Hook
// ============================================

export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return reducedMotion;
}

// ============================================
// Animation Wrapper Components
// ============================================

export interface FadeInProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Delay before animation starts (ms) */
  delay?: number;
  /** Animation duration (ms) */
  duration?: number;
  /** Direction of fade */
  direction?: "up" | "down" | "left" | "right" | "none";
  /** Distance to travel (px) */
  distance?: number;
  /** Whether animation has run */
  animate?: boolean;
}

export const FadeIn = React.forwardRef<HTMLDivElement, FadeInProps>(
  (
    {
      delay = 0,
      duration = durations.normal,
      direction = "up",
      distance = 20,
      animate = true,
      className,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const reducedMotion = useReducedMotion();
    const [isVisible, setIsVisible] = React.useState(!animate);

    React.useEffect(() => {
      if (!animate) return;
      const timer = setTimeout(() => setIsVisible(true), delay);
      return () => clearTimeout(timer);
    }, [animate, delay]);

    const transform = React.useMemo(() => {
      if (reducedMotion || isVisible) return "translate(0, 0)";
      switch (direction) {
        case "up":
          return `translateY(${distance}px)`;
        case "down":
          return `translateY(-${distance}px)`;
        case "left":
          return `translateX(${distance}px)`;
        case "right":
          return `translateX(-${distance}px)`;
        default:
          return "translate(0, 0)";
      }
    }, [direction, distance, isVisible, reducedMotion]);

    return (
      <div
        ref={ref}
        className={className}
        style={{
          opacity: isVisible ? 1 : 0,
          transform,
          transition: reducedMotion
            ? "none"
            : `opacity ${duration}ms ${easings.ease}, transform ${duration}ms ${easings.ease}`,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  },
);

FadeIn.displayName = "FadeIn";

// ============================================
// Stagger Children Animation
// ============================================

export interface StaggerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Delay between each child (ms) */
  staggerDelay?: number;
  /** Initial delay before first child (ms) */
  initialDelay?: number;
  /** Whether animation is active */
  animate?: boolean;
}

export const Stagger = React.forwardRef<HTMLDivElement, StaggerProps>(
  (
    {
      staggerDelay = 50,
      initialDelay = 0,
      animate = true,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <div ref={ref} className={className} {...props}>
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement(child)) return child;

          return (
            <FadeIn
              key={index}
              delay={initialDelay + index * staggerDelay}
              animate={animate}
            >
              {child}
            </FadeIn>
          );
        })}
      </div>
    );
  },
);

Stagger.displayName = "Stagger";

// ============================================
// Pulse Animation (for loading states)
// ============================================

export interface PulseProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether to animate */
  animate?: boolean;
  /** Pulse intensity (scale factor) */
  intensity?: number;
}

export const Pulse = React.forwardRef<HTMLDivElement, PulseProps>(
  (
    { animate = true, intensity = 1.05, className, children, ...props },
    ref,
  ) => {
    const reducedMotion = useReducedMotion();

    return (
      <div
        ref={ref}
        className={cn(animate && !reducedMotion && "animate-pulse", className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Pulse.displayName = "Pulse";

// ============================================
// Spin Animation (for loaders)
// ============================================

export interface SpinProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Duration of one rotation (ms) */
  duration?: number;
  /** Direction of spin */
  direction?: "clockwise" | "counter-clockwise";
}

export const Spin = React.forwardRef<HTMLDivElement, SpinProps>(
  (
    { duration = 1000, direction = "clockwise", className, children, ...props },
    ref,
  ) => {
    const reducedMotion = useReducedMotion();

    return (
      <div
        ref={ref}
        className={className}
        style={{
          animation: reducedMotion
            ? "none"
            : `spin ${duration}ms linear infinite`,
          animationDirection:
            direction === "counter-clockwise" ? "reverse" : "normal",
        }}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Spin.displayName = "Spin";

// ============================================
// Scale on Hover/Press
// ============================================

export interface ScaleOnInteractProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Scale factor on hover */
  hoverScale?: number;
  /** Scale factor on press */
  pressScale?: number;
}

export const ScaleOnInteract = React.forwardRef<
  HTMLDivElement,
  ScaleOnInteractProps
>(
  (
    { hoverScale = 1.02, pressScale = 0.98, className, children, ...props },
    ref,
  ) => {
    const reducedMotion = useReducedMotion();

    return (
      <div
        ref={ref}
        className={cn(
          !reducedMotion && "transition-transform duration-150",
          !reducedMotion && "hover:scale-[var(--hover-scale)]",
          !reducedMotion && "active:scale-[var(--press-scale)]",
          className,
        )}
        style={
          {
            "--hover-scale": hoverScale,
            "--press-scale": pressScale,
          } as React.CSSProperties
        }
        {...props}
      >
        {children}
      </div>
    );
  },
);

ScaleOnInteract.displayName = "ScaleOnInteract";

// ============================================
// CSS Animation Classes (for Tailwind)
// ============================================

export const animationClasses = {
  // Fade animations
  fadeIn: "animate-in fade-in",
  fadeOut: "animate-out fade-out",
  fadeInUp: "animate-in fade-in slide-in-from-bottom-4",
  fadeInDown: "animate-in fade-in slide-in-from-top-4",
  fadeInLeft: "animate-in fade-in slide-in-from-right-4",
  fadeInRight: "animate-in fade-in slide-in-from-left-4",

  // Scale animations
  scaleIn: "animate-in zoom-in-95",
  scaleOut: "animate-out zoom-out-95",

  // Slide animations
  slideInTop: "animate-in slide-in-from-top",
  slideInBottom: "animate-in slide-in-from-bottom",
  slideInLeft: "animate-in slide-in-from-left",
  slideInRight: "animate-in slide-in-from-right",

  // Combined for overlays
  overlayIn: "animate-in fade-in-0 zoom-in-95",
  overlayOut: "animate-out fade-out-0 zoom-out-95",

  // Duration modifiers
  durationFast: "duration-150",
  durationNormal: "duration-300",
  durationSlow: "duration-500",
} as const;
