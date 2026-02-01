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
  scaleInBounce: "animate-in zoom-in-95 duration-300",

  // Slide animations
  slideInTop: "animate-in slide-in-from-top",
  slideInBottom: "animate-in slide-in-from-bottom",
  slideInLeft: "animate-in slide-in-from-left",
  slideInRight: "animate-in slide-in-from-right",
  slideOutTop: "animate-out slide-out-to-top",
  slideOutBottom: "animate-out slide-out-to-bottom",
  slideOutLeft: "animate-out slide-out-to-left",
  slideOutRight: "animate-out slide-out-to-right",

  // Combined for overlays
  overlayIn: "animate-in fade-in-0 zoom-in-95",
  overlayOut: "animate-out fade-out-0 zoom-out-95",

  // Shimmer effect for loading
  shimmer:
    "animate-pulse bg-gradient-to-r from-transparent via-white/10 to-transparent",

  // Bounce animations
  bounceIn: "animate-in zoom-in-50 duration-500",
  bounceOut: "animate-out zoom-out-50 duration-300",

  // Duration modifiers
  durationInstant: "duration-0",
  durationFast: "duration-150",
  durationNormal: "duration-300",
  durationSlow: "duration-500",
  durationSlower: "duration-700",

  // Delay modifiers
  delay75: "delay-75",
  delay100: "delay-100",
  delay150: "delay-150",
  delay200: "delay-200",
  delay300: "delay-300",
  delay500: "delay-500",
  delay700: "delay-700",
  delay1000: "delay-1000",
} as const;

// ============================================
// Keyframe Definitions (for CSS-in-JS)
// ============================================

export const keyframes = {
  // Shimmer effect
  shimmer: {
    "0%": { transform: "translateX(-100%)" },
    "100%": { transform: "translateX(100%)" },
  },

  // Shake effect
  shake: {
    "0%, 100%": { transform: "translateX(0)" },
    "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-4px)" },
    "20%, 40%, 60%, 80%": { transform: "translateX(4px)" },
  },

  // Wiggle effect
  wiggle: {
    "0%, 100%": { transform: "rotate(-3deg)" },
    "50%": { transform: "rotate(3deg)" },
  },

  // Float effect
  float: {
    "0%, 100%": { transform: "translateY(0)" },
    "50%": { transform: "translateY(-10px)" },
  },

  // Ping effect (like Tailwind's ping)
  ping: {
    "75%, 100%": {
      transform: "scale(2)",
      opacity: "0",
    },
  },

  // Heartbeat effect
  heartbeat: {
    "0%": { transform: "scale(1)" },
    "14%": { transform: "scale(1.3)" },
    "28%": { transform: "scale(1)" },
    "42%": { transform: "scale(1.3)" },
    "70%": { transform: "scale(1)" },
  },

  // Confetti burst
  confetti: {
    "0%": { transform: "translateY(0) rotate(0deg)", opacity: "1" },
    "100%": { transform: "translateY(-500px) rotate(720deg)", opacity: "0" },
  },

  // Typewriter cursor
  blink: {
    "0%, 100%": { opacity: "1" },
    "50%": { opacity: "0" },
  },

  // Gradient shift
  gradientShift: {
    "0%": { backgroundPosition: "0% 50%" },
    "50%": { backgroundPosition: "100% 50%" },
    "100%": { backgroundPosition: "0% 50%" },
  },
} as const;

// ============================================
// Shake Animation Component
// ============================================

export interface ShakeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether to trigger shake */
  shake?: boolean;
  /** Duration of shake in ms */
  duration?: number;
  /** Callback when shake completes */
  onShakeEnd?: () => void;
}

export const Shake = React.forwardRef<HTMLDivElement, ShakeProps>(
  (
    {
      shake = false,
      duration = 500,
      onShakeEnd,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const [isShaking, setIsShaking] = React.useState(false);
    const reducedMotion = useReducedMotion();

    React.useEffect(() => {
      if (shake && !reducedMotion) {
        setIsShaking(true);
        const timer = setTimeout(() => {
          setIsShaking(false);
          onShakeEnd?.();
        }, duration);
        return () => clearTimeout(timer);
      }
    }, [shake, duration, onShakeEnd, reducedMotion]);

    return (
      <div
        ref={ref}
        className={cn(isShaking && "animate-shake", className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Shake.displayName = "Shake";

// ============================================
// Float Animation Component
// ============================================

export interface FloatProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Float duration in ms */
  duration?: number;
  /** Disable floating */
  disabled?: boolean;
}

export const Float = React.forwardRef<HTMLDivElement, FloatProps>(
  (
    { duration = 3000, disabled = false, className, children, style, ...props },
    ref,
  ) => {
    const reducedMotion = useReducedMotion();

    return (
      <div
        ref={ref}
        className={className}
        style={{
          animation:
            disabled || reducedMotion
              ? "none"
              : `float ${duration}ms ease-in-out infinite`,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Float.displayName = "Float";

// ============================================
// Number Ticker Animation
// ============================================

export interface NumberTickerProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Target value to animate to */
  value: number;
  /** Duration of animation in ms */
  duration?: number;
  /** Number of decimal places */
  decimals?: number;
  /** Prefix (e.g., "$") */
  prefix?: string;
  /** Suffix (e.g., "%") */
  suffix?: string;
  /** Format with locale separators */
  formatLocale?: boolean;
}

export const NumberTicker = React.forwardRef<
  HTMLSpanElement,
  NumberTickerProps
>(
  (
    {
      value,
      duration = 1000,
      decimals = 0,
      prefix = "",
      suffix = "",
      formatLocale = true,
      className,
      ...props
    },
    ref,
  ) => {
    const [displayValue, setDisplayValue] = React.useState(0);
    const reducedMotion = useReducedMotion();
    const startValue = React.useRef(0);
    const startTime = React.useRef<number | null>(null);

    React.useEffect(() => {
      if (reducedMotion) {
        setDisplayValue(value);
        return;
      }

      startValue.current = displayValue;
      startTime.current = null;

      const animate = (timestamp: number) => {
        if (startTime.current === null) startTime.current = timestamp;
        const progress = Math.min(
          (timestamp - startTime.current) / duration,
          1,
        );

        // Easing function (ease-out)
        const eased = 1 - Math.pow(1 - progress, 3);
        const current =
          startValue.current + (value - startValue.current) * eased;
        setDisplayValue(current);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }, [value, duration, reducedMotion]);

    const formattedValue = formatLocale
      ? displayValue.toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })
      : displayValue.toFixed(decimals);

    return (
      <span ref={ref} className={cn("tabular-nums", className)} {...props}>
        {prefix}
        {formattedValue}
        {suffix}
      </span>
    );
  },
);

NumberTicker.displayName = "NumberTicker";

// ============================================
// Gradient Text Animation
// ============================================

export interface GradientTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Gradient colors */
  colors?: string[];
  /** Animation duration */
  duration?: number;
  /** Disable animation */
  animated?: boolean;
}

export const GradientText = React.forwardRef<
  HTMLSpanElement,
  GradientTextProps
>(
  (
    {
      colors = ["#00f5ff", "#a855f7", "#ec4899", "#00f5ff"],
      duration = 3000,
      animated = true,
      className,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const reducedMotion = useReducedMotion();
    const gradient = `linear-gradient(90deg, ${colors.join(", ")})`;

    return (
      <span
        ref={ref}
        className={cn("bg-clip-text text-transparent", className)}
        style={{
          backgroundImage: gradient,
          backgroundSize: animated && !reducedMotion ? "200% auto" : "100%",
          animation:
            animated && !reducedMotion
              ? `gradientShift ${duration}ms linear infinite`
              : "none",
          ...style,
        }}
        {...props}
      >
        {children}
      </span>
    );
  },
);

GradientText.displayName = "GradientText";
