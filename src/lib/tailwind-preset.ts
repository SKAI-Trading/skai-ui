/**
 * SKAI UI Tailwind Preset
 *
 * This is the SINGLE SOURCE OF TRUTH for all SKAI design tokens.
 * All consuming applications should extend this preset in their tailwind.config.ts:
 *
 * @example
 * ```ts
 * // In your tailwind.config.ts:
 * import skaiPreset from '@skai/ui/tailwind-preset';
 *
 * export default {
 *   presets: [skaiPreset],
 *   content: ['./src/**\/*.{ts,tsx}', './modules/skai-ui/src/**\/*.{ts,tsx}'],
 *   // Add any app-specific overrides here
 * } satisfies Config;
 * ```
 *
 * @packageDocumentation
 */

import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import {
  skaiColors,
  skaiFonts,
  skaiFontSizes,
  skaiSpacing,
  skaiBorderRadius,
  skaiShadows,
} from "./design-tokens";
import { breakpoints, zIndex } from "./tokens";

// =============================================================================
// ANIMATION KEYFRAMES (From Figma motion specs)
// =============================================================================

export const skaiKeyframes = {
  // Accordion animations
  "accordion-down": {
    from: { height: "0" },
    to: { height: "var(--radix-accordion-content-height)" },
  },
  "accordion-up": {
    from: { height: "var(--radix-accordion-content-height)" },
    to: { height: "0" },
  },

  // Fade animations
  "fade-in": {
    "0%": { opacity: "0", transform: "translateY(10px)" },
    "100%": { opacity: "1", transform: "translateY(0)" },
  },
  "fade-out": {
    "0%": { opacity: "1", transform: "translateY(0)" },
    "100%": { opacity: "0", transform: "translateY(10px)" },
  },

  // Slide animations
  "slide-in-right": {
    "0%": { transform: "translateX(100%)", opacity: "0" },
    "100%": { transform: "translateX(0)", opacity: "1" },
  },
  "slide-out-left": {
    "0%": { transform: "translateX(0)", opacity: "1" },
    "100%": { transform: "translateX(-100%)", opacity: "0" },
  },
  "slide-in-bottom": {
    "0%": { transform: "translateY(100%)", opacity: "0" },
    "100%": { transform: "translateY(0)", opacity: "1" },
  },
  "slide-out-bottom": {
    "0%": { transform: "translateY(0)", opacity: "1" },
    "100%": { transform: "translateY(100%)", opacity: "0" },
  },

  // Scale animations
  "scale-in": {
    "0%": { transform: "scale(0.95)", opacity: "0" },
    "100%": { transform: "scale(1)", opacity: "1" },
  },
  "scale-out": {
    "0%": { transform: "scale(1)", opacity: "1" },
    "100%": { transform: "scale(0.95)", opacity: "0" },
  },

  // Special animations
  "celebration-slide": {
    "0%": { transform: "translateY(-100%)", opacity: "0" },
    "15%": { transform: "translateY(0)", opacity: "1" },
    "85%": { transform: "translateY(0)", opacity: "1" },
    "100%": { transform: "translateY(-100%)", opacity: "0" },
  },
  "pulse-glow": {
    "0%, 100%": { boxShadow: "0 0 20px 5px rgba(var(--primary), 0.3)" },
    "50%": { boxShadow: "0 0 40px 10px rgba(var(--primary), 0.5)" },
  },
  shimmer: {
    "0%": { transform: "translateX(-100%)" },
    "100%": { transform: "translateX(100%)" },
  },
  ticker: {
    "0%": { transform: "translateX(0)" },
    "100%": { transform: "translateX(-50%)" },
  },
  "spin-slow": {
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(360deg)" },
  },
  gradient: {
    "0%, 100%": { backgroundPosition: "0% 50%" },
    "50%": { backgroundPosition: "100% 50%" },
  },

  // Bounce animations
  bounce: {
    "0%, 100%": {
      transform: "translateY(-25%)",
      animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)",
    },
    "50%": {
      transform: "translateY(0)",
      animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
    },
  },

  // Ping animation
  ping: {
    "75%, 100%": { transform: "scale(2)", opacity: "0" },
  },

  // Pulse animation
  pulse: {
    "0%, 100%": { opacity: "1" },
    "50%": { opacity: ".5" },
  },
} as const;

// =============================================================================
// ANIMATION DURATIONS (From Figma motion specs)
// =============================================================================

export const skaiAnimations = {
  // Accordion
  "accordion-down": "accordion-down 0.2s ease-out",
  "accordion-up": "accordion-up 0.2s ease-out",

  // Fades
  "fade-in": "fade-in 0.3s ease-out",
  "fade-out": "fade-out 0.3s ease-in",

  // Slides
  "slide-in-right": "slide-in-right 0.3s ease-out",
  "slide-out-left": "slide-out-left 0.3s ease-in",
  "slide-in-bottom": "slide-in-bottom 0.3s ease-out",
  "slide-out-bottom": "slide-out-bottom 0.3s ease-in",

  // Scales
  "scale-in": "scale-in 0.2s ease-out",
  "scale-out": "scale-out 0.2s ease-in",

  // Special
  "celebration-slide": "celebration-slide 3s ease-in-out",
  "pulse-glow": "pulse-glow 2s ease-in-out infinite",
  shimmer: "shimmer 2s linear infinite",
  ticker: "ticker 30s linear infinite",
  "spin-slow": "spin-slow 3s linear infinite",
  gradient: "gradient 3s ease infinite",

  // Standard
  bounce: "bounce 1s infinite",
  ping: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
  pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
  spin: "spin 1s linear infinite",
} as const;

// =============================================================================
// TRANSITION PRESETS
// =============================================================================

export const skaiTransitionDuration = {
  instant: "0ms",
  fast: "150ms",
  normal: "300ms",
  slow: "500ms",
  slower: "700ms",
} as const;

export const skaiTransitionTimingFunction = {
  DEFAULT: "cubic-bezier(0.4, 0, 0.2, 1)",
  in: "cubic-bezier(0.4, 0, 1, 1)",
  out: "cubic-bezier(0, 0, 0.2, 1)",
  "in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
  bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  spring: "cubic-bezier(0.175, 0.885, 0.32, 1.1)",
} as const;

// =============================================================================
// GRADIENT BACKGROUNDS
// =============================================================================

export const skaiBackgroundImage = {
  "gradient-primary": "var(--gradient-primary)",
  "gradient-glow": "var(--gradient-glow)",
  "gradient-bg": "var(--gradient-bg)",
  "skai-gradient": "linear-gradient(135deg, #56C7F3, #17F9B4)",
  "skai-gradient-vertical": "linear-gradient(180deg, #56C7F3, #17F9B4)",
  "skai-gradient-gold": "linear-gradient(135deg, #FFB547, #E8A027)",
  "skai-gradient-dark": "linear-gradient(135deg, #001615, #00312D)",
} as const;

// =============================================================================
// SEMANTIC COLORS (CSS Variable-based for theme switching)
// =============================================================================

export const skaiSemanticColors = {
  border: "hsl(var(--border))",
  input: "hsl(var(--input))",
  ring: "hsl(var(--ring))",
  background: "hsl(var(--background))",
  foreground: "hsl(var(--foreground))",
  glass: "hsl(var(--glass))",
  primary: {
    DEFAULT: "hsl(var(--primary))",
    foreground: "hsl(var(--primary-foreground))",
    glow: "hsl(var(--primary-glow))",
  },
  secondary: {
    DEFAULT: "hsl(var(--secondary))",
    foreground: "hsl(var(--secondary-foreground))",
    glow: "hsl(var(--secondary-glow))",
  },
  long: {
    DEFAULT: "hsl(var(--long))",
    foreground: "hsl(var(--long-foreground))",
    glow: "hsl(var(--long-glow))",
  },
  short: {
    DEFAULT: "hsl(var(--short))",
    foreground: "hsl(var(--short-foreground))",
    glow: "hsl(var(--short-glow))",
  },
  destructive: {
    DEFAULT: "hsl(var(--destructive))",
    foreground: "hsl(var(--destructive-foreground))",
  },
  muted: {
    DEFAULT: "hsl(var(--muted))",
    foreground: "hsl(var(--muted-foreground))",
  },
  accent: {
    DEFAULT: "hsl(var(--accent))",
    foreground: "hsl(var(--accent-foreground))",
  },
  popover: {
    DEFAULT: "hsl(var(--popover))",
    foreground: "hsl(var(--popover-foreground))",
  },
  card: {
    DEFAULT: "hsl(var(--card))",
    foreground: "hsl(var(--card-foreground))",
  },
} as const;

// =============================================================================
// GRID SYSTEM (From Figma)
// =============================================================================

export const skaiScreens = {
  sm: breakpoints.sm,
  md: breakpoints.md,
  lg: breakpoints.lg,
  xl: breakpoints.xl,
  "2xl": breakpoints["2xl"],
} as const;

// =============================================================================
// Z-INDEX SCALE (From Figma)
// =============================================================================

export const skaiZIndex = {
  dropdown: zIndex.dropdown.toString(),
  sticky: zIndex.sticky.toString(),
  fixed: zIndex.fixed.toString(),
  "modal-backdrop": zIndex.modalBackdrop.toString(),
  modal: zIndex.modal.toString(),
  popover: zIndex.popover.toString(),
  tooltip: zIndex.tooltip.toString(),
  toast: zIndex.toast.toString(),
} as const;

// =============================================================================
// COMPLETE TAILWIND PRESET
// =============================================================================

/**
 * The complete SKAI UI Tailwind preset.
 * Use this as a preset in your tailwind.config.ts to inherit all SKAI tokens.
 */
const skaiPreset: Partial<Config> = {
  darkMode: ["class"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // Typography - from design-tokens.ts (SINGLE SOURCE OF TRUTH)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fontFamily: skaiFonts as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fontSize: skaiFontSizes as any,

      // Colors
      colors: {
        ...skaiColors,
        ...skaiSemanticColors,
      },

      // Spacing (extends Tailwind defaults)
      spacing: skaiSpacing,

      // Border radius
      borderRadius: {
        ...skaiBorderRadius,
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      // Shadows
      boxShadow: skaiShadows,

      // Gradients
      backgroundImage: skaiBackgroundImage,

      // Z-index
      zIndex: skaiZIndex,

      // Animations
      keyframes: skaiKeyframes,
      animation: skaiAnimations,

      // Transitions
      transitionDuration: skaiTransitionDuration,
      transitionTimingFunction: skaiTransitionTimingFunction,

      // Screens/breakpoints
      screens: skaiScreens,
    },
  },
  plugins: [tailwindcssAnimate],
};

export default skaiPreset;

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type SkaiPresetConfig = typeof skaiPreset;
export type SkaiKeyframe = keyof typeof skaiKeyframes;
export type SkaiAnimation = keyof typeof skaiAnimations;
export type SkaiTransitionDuration = keyof typeof skaiTransitionDuration;
export type SkaiTransitionTimingFunction =
  keyof typeof skaiTransitionTimingFunction;
export type SkaiScreen = keyof typeof skaiScreens;
export type SkaiZIndexLevel = keyof typeof skaiZIndex;
