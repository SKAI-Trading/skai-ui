/**
 * SKAI Motion Tokens — single source of truth.
 *
 * These are the only motion primitives any feature code should reach for.
 * `lib/animations.tsx` and `lib/tailwind-preset.ts` both re-export from here
 * so the Tailwind classes, the framer-motion presets, and the React motion
 * components all stay in lockstep — no more drift between "tailwind says 200ms"
 * and "animations.tsx says 150ms".
 *
 * Naming follows industry consensus (Material 3 / Carbon / Hopper / Mavik 2026)
 * rather than the original Figma duplicates so the system reads as one thing
 * across the app.
 */

// =============================================================================
// DURATIONS — the canonical ladder
// =============================================================================
//
// Picked over the original (animations.tsx) ladder of {0, 150, 300, 500, 700}
// because the 100/200 break point lines up with how the eye actually reads
// motion: under ~100ms a transition feels instantaneous; 200ms is the dominant
// "deliberate UI" beat; 300ms reads as a discrete event (modal opening).
//
// Hopper, Mavik 2026, and Apple's iOS carousel all converge on this shape.

export const durations = {
  /** 0ms — no animation. Used for prefers-reduced-motion fallbacks. */
  instant: 0,
  /** 75ms — sub-perceptual. Hover-color crossfades, focus-ring fade. */
  micro: 75,
  /** 100ms — instant-feeling. Button hover lift, link color change. */
  fast: 100,
  /** 200ms — the dominant UI beat. Button click feedback, dropdown open, tab swap. */
  base: 200,
  /** 300ms — discrete event. Modal/sheet enter, panel slide, route transition. */
  slow: 300,
  /** 500ms — narrative beat. Large layout shifts, hero reveals. */
  slower: 500,
  /** 800ms — cinematic. Page-level entrances only; never on user-triggered UI. */
  slowest: 800,
} as const;

export type DurationToken = keyof typeof durations;

// =============================================================================
// EASING — five named curves, each with a job
// =============================================================================
//
// The previous system had 9 easings with names like "bounce-in" / "bounce-out"
// that engineers picked at random. This drops it to 5 with role-based names so
// the *intent* is obvious from the choice.

// Framer-motion's `Transition.ease` type accepts 4-tuple control points OR a
// small set of named keywords — NOT arbitrary cubic-bezier strings. We export
// tuples here so the values flow into `transition={{ ease: easings.standard }}`
// without a cast, and stringify to `cubic-bezier(...)` at the CSS boundary
// (see `motionCssVars` below).

/** Tuple of 4 cubic-bezier control points (P1.x, P1.y, P2.x, P2.y). */
export type EasingTuple = readonly [number, number, number, number];

export const easings = {
  /** `[0.4, 0, 0.2, 1]` — the default for any persistent transition (hover, focus, color). */
  standard: [0.4, 0, 0.2, 1] as EasingTuple,
  /** `[0.05, 0.7, 0.1, 1]` — M3 emphasized. Use for the moments users actually look at. Asymmetric, decelerates hard at the end. */
  emphasized: [0.05, 0.7, 0.1, 1] as EasingTuple,
  /** `[0, 0, 0.2, 1]` — for entrances. Object arrives and settles. */
  decelerate: [0, 0, 0.2, 1] as EasingTuple,
  /** `[0.3, 0, 0.8, 0.15]` — for exits. Object gets out of the way fast. */
  accelerate: [0.3, 0, 0.8, 0.15] as EasingTuple,
  /** `[0.34, 1.56, 0.64, 1]` — bouncy overshoot. Reserve for moments of delight (badge earn, win confirmation). Never on routine UI. */
  expressive: [0.34, 1.56, 0.64, 1] as EasingTuple,
  /** `"linear"` — for continuous motion only (tickers, progress bars). Framer-motion accepts the string keyword here. */
  linear: "linear" as const,
} as const;

/** Stringify a tuple easing as a CSS `cubic-bezier(...)` value. Identity for the linear keyword. */
export function easingToCss(e: EasingTuple | "linear"): string {
  return typeof e === "string" ? e : `cubic-bezier(${e.join(", ")})`;
}

export type EasingToken = keyof typeof easings;

// =============================================================================
// SPRINGS — framer-motion physics presets
// =============================================================================
//
// Framer-motion's default {stiffness: 100, damping: 10} is too bouncy for
// professional UI. The presets below correspond to the named feels in the
// industry: Apple-style (250/30), gentle iOS sheets (120/20), sharp dismiss
// (400/30). `mass: 1` everywhere — only change mass when animating something
// that's literally larger or heavier.

export const springs = {
  /** Sharp & responsive. Button press, close action — gets out of the way. */
  snappy: { type: "spring" as const, stiffness: 400, damping: 30, mass: 1 },
  /** The Apple iOS-carousel feel. Use this for shared-layoutId morphs and most natural motion. */
  default: { type: "spring" as const, stiffness: 250, damping: 30, mass: 1 },
  /** Soft and graceful. Sheets, drawers, gentle reveals. */
  gentle: { type: "spring" as const, stiffness: 120, damping: 20, mass: 1 },
  /** Playful overshoot. Earned-state reveals only — never routine UI. */
  bouncy: { type: "spring" as const, stiffness: 200, damping: 12, mass: 1 },
} as const;

export type SpringToken = keyof typeof springs;

// =============================================================================
// INTERACTION TOKENS — hover / press / focus magic numbers
// =============================================================================
//
// These are the values <Pressable> and any custom interactive surface should
// reach for. Magic numbers picked from 2026 design-system research:
//   - press scale 0.97: small enough to feel like depression, big enough to register
//   - hover lift 2px: visible but not floating
//   - focus ring 2px / offset 2px: passes WCAG AA non-text contrast at 3:1

export const interaction = {
  /** Card / button rests at scale(1). On press, scale to 0.97 with `snappy` spring. */
  pressScale: 0.97,
  /** On hover, lift -2px on the Y axis with `fast` duration. */
  hoverLiftPx: 2,
  /** Hover scale alternative when lift is not appropriate (chips, icon buttons). */
  hoverScale: 1.02,
  /** Focus ring width in CSS pixels. */
  focusRingPx: 2,
  /** Focus ring offset from element edge. */
  focusOffsetPx: 2,
  /** Shadow elevation lift on hover (matches Figma card hover token). */
  hoverShadow: "0 8px 24px -4px rgba(0, 0, 0, 0.25)",
} as const;

// =============================================================================
// TRANSITION PRESETS — drop-in framer-motion `transition` props
// =============================================================================
//
// `transition={transitions.layoutMorph}` is the canonical chat-open / shared-
// element morph. The others are for the choreography table in the system docs.

export const transitions = {
  /** Default for layoutId morphs (chat-open, tab-indicator, shared cards). */
  layoutMorph: {
    ...springs.default,
    // `layout` key lets the spring apply to position/size changes specifically.
    layout: { ...springs.default },
  },
  /** Sheet / modal enter. */
  sheetEnter: { duration: durations.slow / 1000, ease: easings.decelerate },
  /** Sheet / modal exit. */
  sheetExit: { duration: durations.base / 1000, ease: easings.accelerate },
  /** Route / page transition. */
  pageTransition: { duration: durations.base / 1000, ease: easings.emphasized },
  /** Quick hover/focus state change. */
  microState: { duration: durations.fast / 1000, ease: easings.standard },
  /** Staggered list entrance — base delay between items. */
  stagger: { staggerChildren: 0.04, delayChildren: 0.05 },
} as const;

// =============================================================================
// CSS CUSTOM PROPERTIES — published so non-React surfaces can read them
// =============================================================================
//
// The values land on `:root` via skai-ui's CSS so vanilla CSS / Tailwind
// arbitrary values can reach them with `var(--skai-motion-duration-base)` etc.

export const motionCssVars = {
  // Durations
  "--skai-motion-duration-instant": "0ms",
  "--skai-motion-duration-micro": "75ms",
  "--skai-motion-duration-fast": "100ms",
  "--skai-motion-duration-base": "200ms",
  "--skai-motion-duration-slow": "300ms",
  "--skai-motion-duration-slower": "500ms",
  "--skai-motion-duration-slowest": "800ms",
  // Easings — stringified to cubic-bezier(...) for CSS consumption.
  "--skai-motion-easing-standard": easingToCss(easings.standard),
  "--skai-motion-easing-emphasized": easingToCss(easings.emphasized),
  "--skai-motion-easing-decelerate": easingToCss(easings.decelerate),
  "--skai-motion-easing-accelerate": easingToCss(easings.accelerate),
  "--skai-motion-easing-expressive": easingToCss(easings.expressive),
  // Interaction
  "--skai-press-scale": String(interaction.pressScale),
  "--skai-hover-lift": `${interaction.hoverLiftPx}px`,
  "--skai-hover-scale": String(interaction.hoverScale),
  "--skai-focus-ring-width": `${interaction.focusRingPx}px`,
  "--skai-focus-ring-offset": `${interaction.focusOffsetPx}px`,
} as const;

// =============================================================================
// LEGACY ALIASES — for backwards compatibility
// =============================================================================
//
// Old code uses `durations.fast` expecting 150ms. The new canonical value is
// 100ms. This alias map preserves the OLD names with the NEW values so the
// migration is a value snap, not a rename. If anything looks "too fast" after
// the migration, bump that specific call-site rather than reverting the token.

/** @deprecated Use `durations.*` directly. Kept so `import { durationsLegacy as durations }` works. */
export const durationsLegacy = {
  instant: durations.instant,
  fast: durations.fast, // was 150 → now 100
  normal: durations.base, // was 300 → now 200
  slow: durations.slow, // was 500 → now 300
  slower: durations.slower, // was 700 → now 500
} as const;

/**
 * @deprecated Use `easings.*` directly with the new role-based names.
 *
 * Legacy easings are STRINGS — feature code uses these in CSS template literals
 * like `transition: opacity ${duration}ms ${easings.ease}`. The canonical
 * `easings` export is tuples (for framer-motion type compatibility); stringify
 * them here so legacy CSS interpolation keeps producing valid `cubic-bezier(...)`.
 */
export const easingsLegacy = {
  ease: easingToCss(easings.standard),
  easeIn: easingToCss(easings.accelerate),
  easeOut: easingToCss(easings.decelerate),
  easeInOut: easingToCss(easings.standard),
  bounce: easingToCss(easings.expressive),
  bounceIn: "cubic-bezier(0.6, -0.28, 0.735, 0.045)",
  bounceOut: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  sharp: "cubic-bezier(0.4, 0, 0.6, 1)",
  spring: "cubic-bezier(0.175, 0.885, 0.32, 1.1)",
} as const;
