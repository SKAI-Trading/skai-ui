/**
 * SKAI Design Tokens - TypeScript Definitions
 * Generated from Figma: Skai Web App (3sSzw1KewMtUbeLAv7uW0r)
 *
 * @example
 * import { colors, typography, spacing } from '@skai/ui/tokens';
 *
 * const Button = styled.button`
 *   background-color: ${colors.brand.skyBlue};
 *   font-family: ${typography.fontFamily.body};
 *   padding: ${spacing.buttonV} ${spacing.buttonH};
 *   border-radius: ${spacing.radiusButton};
 * `;
 */

// ============================================================================
// COLOR TOKENS (From Figma Variables)
// ============================================================================

export const colors = {
  /** Primary brand colors */
  brand: {
    /** Primary CTA color - #56C7F3 */
    skyBlue: "#56C7F3",
    skyBlue300: "#56C7F3",

    /** Premium/gold accent - #999966 */
    printersGold: "#999966",
    printersGold300: "#999966",

    /** Warning/highlight accent - #FFFF16 */
    sunYellow: "#FFFF16",
    sunYellow300: "#FFFF16",
  },

  /** Background colors (dark theme) */
  greenCoal: {
    /** Border/divider color - #123F3C */
    100: "#123F3C",
    /** Card/modal background - #122524 */
    200: "#122524",
    /** Main app background - #001615 */
    300: "#001615",
    /** Default (main background) */
    DEFAULT: "#001615",
  },

  /** Core neutrals */
  core: {
    white: "#FFFFFF",
    black: "#000000",
  },

  /** App-specific colors */
  app: {
    /** Placeholder/muted text - #95A09F */
    ash: "#95A09F",
    ash300: "#95A09F",

    /** Success/profit/long - #17F9B4 */
    green: "#17F9B4",
    green300: "#17F9B4",
    greenO: "#17F9B4",

    /** Error/loss/short - #FF574A */
    red: "#FF574A",
    red300: "#FF574A",
    redO: "#FB3324",

    /** Secondary text - #E0E0E0 */
    gray100: "#E0E0E0",
  },

  /** Semantic color aliases */
  semantic: {
    success: "#17F9B4",
    warning: "#FFFF16",
    error: "#FF574A",
    info: "#56C7F3",
    profit: "#17F9B4",
    loss: "#FF574A",
  },
} as const;

// ============================================================================
// TYPOGRAPHY TOKENS (From Figma)
// ============================================================================

export const typography = {
  /** Font families */
  fontFamily: {
    /** Display/decorative text */
    display: "'Cormorant Garamond', Georgia, serif",
    /** Body/UI text */
    body: "'Manrope', system-ui, sans-serif",
    /** Alias for body */
    sans: "'Manrope', system-ui, sans-serif",
    /** Code/monospace */
    mono: "'JetBrains Mono', monospace",
  },

  /** Font sizes (rem) */
  fontSize: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    base: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
    "5xl": "3rem", // 48px
    "6xl": "3.75rem", // 60px
  },

  /** Figma typography presets */
  presets: {
    /** Headlines - 32px, light, -1.28px tracking */
    superHeadline: {
      fontSize: "32px",
      fontWeight: 300,
      lineHeight: "36px",
      letterSpacing: "-1.28px",
      fontFamily: "'Manrope', sans-serif",
    },
    /** Subheadlines - 18px, regular, -0.72px tracking */
    subHeadline: {
      fontSize: "18px",
      fontWeight: 400,
      lineHeight: "24px",
      letterSpacing: "-0.72px",
      fontFamily: "'Manrope', sans-serif",
    },
    /** Body text - 16px, regular, -0.64px tracking */
    paragraph1: {
      fontSize: "16px",
      fontWeight: 400,
      lineHeight: "22px",
      letterSpacing: "-0.64px",
      fontFamily: "'Manrope', sans-serif",
    },
    /** Small text - 14px, regular, -0.56px tracking */
    paragraph2: {
      fontSize: "14px",
      fontWeight: 400,
      lineHeight: "18px",
      letterSpacing: "-0.56px",
      fontFamily: "'Manrope', sans-serif",
    },
  },
} as const;

// ============================================================================
// SPACING TOKENS (From Figma)
// ============================================================================

export const spacing = {
  /** Base spacing scale */
  0: "0",
  0.5: "0.125rem",
  1: "0.25rem",
  2: "0.5rem",
  3: "0.75rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  7: "1.75rem",
  8: "2rem",
  9: "2.25rem",
  10: "2.5rem",
  12: "3rem",
  14: "3.5rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
  32: "8rem",
  px: "1px",

  /** Component-specific spacing (from Figma) */
  input: "22px",
  buttonH: "40px",
  buttonV: "22px",
  modal: "32px",
  modalBottom: "48px",
  sectionGap: "24px",

  /** Border radius */
  radiusButton: "16px",
  radiusInput: "16px",
  radiusCard: "24px",
  radiusModal: "24px",
} as const;

// ============================================================================
// SHADOW TOKENS (From Figma)
// ============================================================================

export const shadows = {
  /** Modal shadow */
  modal: "0px 10px 80px 0px rgba(0, 0, 0, 0.25)",
  /** Dropdown shadow */
  dropdown: "0px 4px 20px 0px rgba(0, 0, 0, 0.15)",
  /** Card hover shadow */
  cardHover: "0px 8px 40px 0px rgba(0, 0, 0, 0.20)",
} as const;

// ============================================================================
// ANIMATION TOKENS
// ============================================================================

export const animation = {
  /** Duration values */
  duration: {
    instant: "0ms",
    fast: "150ms",
    normal: "300ms",
    slow: "500ms",
  },
  /** Easing functions */
  easing: {
    default: "cubic-bezier(0.4, 0, 0.2, 1)",
    in: "cubic-bezier(0.4, 0, 1, 1)",
    out: "cubic-bezier(0, 0, 0.2, 1)",
    inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    spring: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  },
} as const;

// ============================================================================
// BREAKPOINT TOKENS
// ============================================================================

export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

// ============================================================================
// Z-INDEX TOKENS
// ============================================================================

export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  toast: 1080,
} as const;

// ============================================================================
// COMBINED TOKENS EXPORT
// ============================================================================

export const tokens = {
  colors,
  typography,
  spacing,
  shadows,
  animation,
  breakpoints,
  zIndex,
} as const;

export default tokens;

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type Colors = typeof colors;
export type Typography = typeof typography;
export type Spacing = typeof spacing;
export type Shadows = typeof shadows;
export type Animation = typeof animation;
export type Breakpoints = typeof breakpoints;
export type ZIndex = typeof zIndex;
export type Tokens = typeof tokens;

// Color value type helpers
export type BrandColor = keyof typeof colors.brand;
export type GreenCoalShade = keyof typeof colors.greenCoal;
export type AppColor = keyof typeof colors.app;
export type SemanticColor = keyof typeof colors.semantic;
