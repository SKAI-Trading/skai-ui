/**
 * SKAI Design System Tokens
 * Source of truth from Figma: https://www.figma.com/file/TyX8YAtNDEIvsnSLQ3IXId/Skai-Design
 *
 * @description Core design tokens for the SKAI ecosystem.
 * Import these in tailwind.config.ts to maintain consistency across all apps.
 *
 * @example
 * ```ts
 * // In tailwind.config.ts
 * import { skaiColors, skaiFonts } from '@skai/ui/tokens';
 *
 * export default {
 *   theme: {
 *     extend: {
 *       colors: skaiColors,
 *       fontFamily: skaiFonts,
 *     }
 *   }
 * }
 * ```
 */

// =============================================================================
// COLOR TOKENS
// =============================================================================

/**
 * Core colors - Black & White
 */
export const coreColors = {
  white: "#FFFFFF",
  black: "#000000",
} as const;

/**
 * Primary brand colors - Green Coal palette (dark backgrounds)
 */
export const greenCoalColors = {
  300: "#001615", // Darkest - primary dark background
  200: "#122524", // Medium - secondary dark background
  100: "#123F3C", // Lightest - tertiary dark background
} as const;

/**
 * Accent colors
 */
export const accentColors = {
  alienGreen: "#17F9B4", // Primary accent (same as green.300)
  skyBlue: "#56C7F3", // Secondary accent
  printersGold: "#999966", // Gold accent
} as const;

/**
 * Semantic colors - Trading states
 */
export const semanticColors = {
  green: {
    300: "#17F9B4", // Profit, success, buy, long
    opacity24: "rgba(23, 249, 180, 0.24)", // Transparent green
  },
  red: {
    300: "#FF574A", // Loss, error, sell, short
    opacity34: "rgba(255, 87, 74, 0.34)", // Transparent red
  },
} as const;

/**
 * Earth tone colors
 */
export const earthColors = {
  earth: "#CAAD7E", // Warm accent
  coral: "#FF7E50", // Warm accent
  sunYellow: "#FFFF16", // Highlight/warning
} as const;

/**
 * Neutral colors
 */
export const neutralColors = {
  wind: "#E2F2EC", // Light background (greenish tint)
  cloud: "#FFFFEE", // Light background (warm tint)
  ash: "#95A09F", // Muted text
  gray: {
    600: "#4C4C4C", // Dark gray
    300: "#878787", // Medium gray
    100: "#E0E0E0", // Light gray
  },
} as const;

/**
 * Gradient definitions
 */
export const gradients = {
  primary: {
    from: "#56C7F3", // Sky Blue
    to: "#17F9B4", // Alien Green
    css: "linear-gradient(135deg, #56C7F3 0%, #17F9B4 100%)",
  },
} as const;

// =============================================================================
// COMBINED COLOR PALETTE FOR TAILWIND
// =============================================================================

/**
 * Complete SKAI color palette for Tailwind CSS
 * Use this in tailwind.config.ts theme.extend.colors
 */
export const skaiColors = {
  // Core
  white: coreColors.white,
  black: coreColors.black,

  // Primary - Green Coal (dark backgrounds)
  "green-coal": {
    DEFAULT: greenCoalColors[300],
    300: greenCoalColors[300],
    200: greenCoalColors[200],
    100: greenCoalColors[100],
  },

  // Accents
  "alien-green": accentColors.alienGreen,
  "sky-blue": accentColors.skyBlue,
  "printers-gold": accentColors.printersGold,

  // Semantic - Trading
  "skai-green": {
    DEFAULT: semanticColors.green[300],
    300: semanticColors.green[300],
    "opacity-24": semanticColors.green.opacity24,
  },
  "skai-red": {
    DEFAULT: semanticColors.red[300],
    300: semanticColors.red[300],
    "opacity-34": semanticColors.red.opacity34,
  },

  // Earth tones
  earth: earthColors.earth,
  coral: earthColors.coral,
  "sun-yellow": earthColors.sunYellow,

  // Neutrals
  wind: neutralColors.wind,
  cloud: neutralColors.cloud,
  ash: neutralColors.ash,
  "skai-gray": {
    600: neutralColors.gray[600],
    300: neutralColors.gray[300],
    100: neutralColors.gray[100],
  },
} as const;

// =============================================================================
// TYPOGRAPHY TOKENS
// =============================================================================

/**
 * Font families from Figma design system - ALIGNED WITH TYPOGRAPHY.CSS
 * - Cormorant Garamond: Headlines, display text (elegant serif)
 * - Manrope: Sub-headlines, UI text (modern sans-serif) 
 * - Mulish: Body text, numbers, labels (readable sans-serif)
 * - JetBrains Mono: Code, technical data (monospace)
 */
export const skaiFonts = {
  heading: ["Cormorant Garamond", "Georgia", "serif"],
  subheading: ["Manrope", "system-ui", "sans-serif"],
  body: ["Mulish", "system-ui", "sans-serif"],
  mono: ["JetBrains Mono", "Menlo", "monospace"],
  // Aliases for consistency
  display: ["Cormorant Garamond", "Georgia", "serif"],
  sans: ["Manrope", "system-ui", "sans-serif"],
} as const;

/**
 * Typography scale from Figma Design System
 * Each entry: [fontSize, { lineHeight, letterSpacing, fontWeight }]
 * Responsive sizes are handled in CSS (see typography.css)
 *
 * USAGE GUIDE:
 * - Headlines (Cormorant Garamond): Page titles, hero text, major headings
 * - Super-headlines (Manrope): Section intros, impact statements
 * - Sub-headlines (Manrope): Card titles, section headers, UI headings
 * - Numbers (Mulish): Prices, stats, numerical data
 * - Paragraphs (Manrope): Body text, descriptions
 * - Labels (Mulish): Form labels, badges, captions
 */
export const skaiFontSizes = {
  // Headlines (Cormorant Garamond) - Desktop / Tablet / Mobile
  // headline-2: 82px / 82px / 82px
  "headline-2": [
    "82px",
    { lineHeight: "90px", letterSpacing: "-0.02em", fontWeight: "300" },
  ],
  "headline-2-italic": [
    "82px",
    {
      lineHeight: "90px",
      letterSpacing: "-0.02em",
      fontWeight: "300",
      fontStyle: "italic",
    },
  ],
  // headline-3: 54px / 40px / 30px
  "headline-3": [
    "54px",
    { lineHeight: "48px", letterSpacing: "-0.02em", fontWeight: "300" },
  ],
  "headline-3-italic": [
    "54px",
    {
      lineHeight: "48px",
      letterSpacing: "-0.02em",
      fontWeight: "300",
      fontStyle: "italic",
    },
  ],
  // headline-4: 34px / 34px / 34px
  "headline-4": [
    "34px",
    { lineHeight: "24px", letterSpacing: "-0.02em", fontWeight: "300" },
  ],

  // Super-headlines (Manrope) - Desktop / Tablet / Mobile
  // super-3: 42px / 32px / 24px
  "super-3": [
    "42px",
    { lineHeight: "48px", letterSpacing: "-0.04em", fontWeight: "300" },
  ],
  // super-4: 32px / 24px / 20px
  "super-4": [
    "32px",
    { lineHeight: "36px", letterSpacing: "-0.04em", fontWeight: "300" },
  ],

  // Sub-headlines (Manrope) - Desktop / Tablet / Mobile
  // sub-1: 24px / 18px / 16px
  "sub-1": [
    "24px",
    { lineHeight: "28px", letterSpacing: "-0.04em", fontWeight: "300" },
  ],
  // sub-2: 18px / 14px / 12px
  "sub-2": [
    "18px",
    { lineHeight: "24px", letterSpacing: "-0.04em", fontWeight: "300" },
  ],
  "sub-2-semibold": [
    "18px",
    { lineHeight: "24px", letterSpacing: "-0.04em", fontWeight: "600" },
  ],

  // Numbers (Mulish) - Desktop / Tablet / Mobile
  // number-1: 42px / 32px / 24px
  "number-1": [
    "42px",
    { lineHeight: "48px", letterSpacing: "-0.04em", fontWeight: "300" },
  ],
  // number-2: 32px / 24px / 20px
  "number-2": [
    "32px",
    { lineHeight: "38px", letterSpacing: "-0.04em", fontWeight: "300" },
  ],
  // number-3: 22px / 16px / 14px
  "number-3": [
    "22px",
    { lineHeight: "26px", letterSpacing: "-0.04em", fontWeight: "300" },
  ],
  // number-4: 14px / 12px / 10px
  "number-4": [
    "14px",
    { lineHeight: "18px", letterSpacing: "-0.04em", fontWeight: "300" },
  ],

  // Paragraphs (Manrope) - Desktop / Tablet / Mobile
  // para-1: 16px / 14px / 12px
  "para-1": [
    "16px",
    { lineHeight: "22px", letterSpacing: "-0.04em", fontWeight: "300" },
  ],
  "para-1-semibold": [
    "16px",
    { lineHeight: "22px", letterSpacing: "-0.04em", fontWeight: "600" },
  ],
  // para-2: 14px / 12px / 10px
  "para-2": [
    "14px",
    { lineHeight: "18px", letterSpacing: "-0.04em", fontWeight: "300" },
  ],
  "para-2-semibold": [
    "14px",
    { lineHeight: "18px", letterSpacing: "-0.04em", fontWeight: "600" },
  ],

  // Labels (Mulish) - Desktop / Tablet / Mobile
  // label-1: 16px / 16px / 16px
  "label-1": [
    "16px",
    { lineHeight: "16px", letterSpacing: "-0.04em", fontWeight: "300" },
  ],
  // label-2: 11px / 8px / 8px
  "label-2": [
    "11px",
    { lineHeight: "14px", letterSpacing: "-0.04em", fontWeight: "300" },
  ],
} as const;

// =============================================================================
// SPACING & LAYOUT TOKENS
// =============================================================================

/**
 * Grid system from Figma
 * Desktop: 24 columns, 16px gutter, 32px margin
 * Tablet: 12 columns, 12px gutter, 30px margin
 * Mobile: 6 columns, 8px gutter, 24px margin
 */
export const skaiGrid = {
  desktop: {
    columns: 24,
    gutter: "16px",
    margin: "32px",
    columnWidth: "42px",
    breakpoint: "1024px",
  },
  tablet: {
    columns: 12,
    gutter: "12px",
    margin: "30px",
    columnWidth: "48px",
    breakpoint: "768px",
  },
  mobile: {
    columns: 6,
    gutter: "8px",
    margin: "24px",
    columnWidth: "48px",
    breakpoint: "375px",
  },
} as const;

// =============================================================================
// CSS CUSTOM PROPERTIES
// =============================================================================

/**
 * Generate CSS custom properties for theming
 * Use this to inject SKAI tokens into :root
 */
export function generateCSSVariables(): string {
  return `
:root {
  /* Core */
  --skai-white: ${coreColors.white};
  --skai-black: ${coreColors.black};

  /* Green Coal */
  --skai-green-coal-300: ${greenCoalColors[300]};
  --skai-green-coal-200: ${greenCoalColors[200]};
  --skai-green-coal-100: ${greenCoalColors[100]};

  /* Accents */
  --skai-alien-green: ${accentColors.alienGreen};
  --skai-sky-blue: ${accentColors.skyBlue};
  --skai-printers-gold: ${accentColors.printersGold};

  /* Semantic */
  --skai-green: ${semanticColors.green[300]};
  --skai-green-24: ${semanticColors.green.opacity24};
  --skai-red: ${semanticColors.red[300]};
  --skai-red-34: ${semanticColors.red.opacity34};

  /* Earth */
  --skai-earth: ${earthColors.earth};
  --skai-coral: ${earthColors.coral};
  --skai-sun-yellow: ${earthColors.sunYellow};

  /* Neutrals */
  --skai-wind: ${neutralColors.wind};
  --skai-cloud: ${neutralColors.cloud};
  --skai-ash: ${neutralColors.ash};
  --skai-gray-600: ${neutralColors.gray[600]};
  --skai-gray-300: ${neutralColors.gray[300]};
  --skai-gray-100: ${neutralColors.gray[100]};

  /* Gradient */
  --skai-gradient-primary: ${gradients.primary.css};
}
`.trim();
}

// =============================================================================
// COMPONENT TOKENS
// =============================================================================

/**
 * Button/CTA component specs from Figma
 * 4 sizes × 4 types with state variants
 */
export const skaiButton = {
  sizes: {
    massive: {
      height: "72px",
      padding: "20px 48px",
      fontSize: "18px",
      lineHeight: "24px",
      borderRadius: "16px",
      iconSize: "24px",
    },
    large: {
      height: "64px",
      padding: "20px 40px",
      fontSize: "16px",
      lineHeight: "22px",
      borderRadius: "16px",
      iconSize: "24px",
    },
    medium: {
      height: "50px",
      padding: "14px 32px",
      fontSize: "14px",
      lineHeight: "18px",
      borderRadius: "12px",
      iconSize: "16px",
    },
    small: {
      height: "46px",
      padding: "12px 24px",
      fontSize: "14px",
      lineHeight: "18px",
      borderRadius: "12px",
      iconSize: "16px",
    },
  },
  types: {
    primary: {
      background: "#56C7F3", // Sky Blue
      text: "#001615", // Green Coal 300
      hoverBackground: "#17F9B4", // Alien Green
      focusRing: "#17F9B4",
    },
    secondary: {
      background: "transparent",
      border: "#56C7F3",
      text: "#56C7F3",
      hoverBackground: "rgba(86, 199, 243, 0.1)",
      focusRing: "#56C7F3",
    },
    tertiary: {
      background: "transparent",
      text: "#FFFFFF",
      hoverText: "#17F9B4",
      focusRing: "#17F9B4",
    },
    link: {
      background: "transparent",
      text: "#17F9B4",
      hoverText: "#56C7F3",
      textDecoration: "underline",
    },
  },
} as const;

/**
 * Input component specs from Figma
 * 3 sizes × 6 states × 2 modes
 */
export const skaiInput = {
  sizes: {
    large: {
      height: "132px",
      padding: "20px",
      fontSize: "16px",
      lineHeight: "22px",
      borderRadius: "16px",
      labelSize: "14px",
    },
    medium: {
      height: "98px",
      padding: "16px",
      fontSize: "14px",
      lineHeight: "18px",
      borderRadius: "12px",
      labelSize: "12px",
    },
    small: {
      height: "88px",
      padding: "12px",
      fontSize: "14px",
      lineHeight: "18px",
      borderRadius: "12px",
      labelSize: "12px",
    },
  },
  states: {
    normal: {
      borderColor: "transparent",
      borderWidth: "1.5px",
    },
    active: {
      borderColor: "#17F9B4", // Alien Green
      borderWidth: "1.5px",
    },
    focus: {
      borderColor: "#56C7F3", // Sky Blue
      borderWidth: "2px",
      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.24)",
    },
    completed: {
      borderColor: "#17F9B4",
      borderWidth: "1.5px",
    },
    error: {
      borderColor: "#FF574A", // Red
      borderWidth: "1.5px",
    },
  },
  modes: {
    dark: {
      background: "#001615", // Green Coal 300
      text: "#FFFFFF",
      placeholder: "rgba(255, 255, 255, 0.6)",
      label: "#FFFFFF",
    },
    light: {
      background: "#FFFFFF",
      text: "#001615",
      placeholder: "rgba(0, 22, 21, 0.6)",
      label: "#001615",
    },
  },
} as const;

/**
 * Label/Tag component specs from Figma
 * 3 sizes × 3 types
 */
export const skaiLabel = {
  sizes: {
    large: {
      height: "18px",
      padding: "2px 8px",
      fontSize: "11px",
      lineHeight: "14px",
      iconSize: "10px",
      gap: "4px",
    },
    medium: {
      height: "14px",
      padding: "2px 6px",
      fontSize: "10px",
      lineHeight: "12px",
      iconSize: "8px",
      gap: "3px",
    },
    small: {
      height: "14px",
      padding: "2px 6px",
      fontSize: "10px",
      lineHeight: "12px",
      iconSize: "8px",
      gap: "3px",
    },
  },
  types: {
    fill: {
      background: "#17F9B4", // Alien Green
      text: "#001615", // Green Coal 300
      borderRadius: "9999px", // Full rounded
    },
    stroke: {
      background: "transparent",
      border: "#17F9B4",
      text: "#17F9B4",
      borderRadius: "9999px",
    },
    flag: {
      background: "#17F9B4",
      text: "#001615",
      borderRadius: "4px", // Slightly rounded
    },
  },
} as const;

/**
 * Icon sizes from Figma
 */
export const skaiIcons = {
  sizes: {
    xs: "10px",
    sm: "16px",
    md: "24px",
    lg: "48px",
  },
  action: [
    "close",
    "hot",
    "enter",
    "back",
    "forward",
    "check-enclosed",
    "copy",
    "dot",
    "loading",
  ],
  social: ["discord", "instagram", "x"],
  wallets: [
    "metamask",
    "coinbase",
    "walletconnect",
    "phantom",
    "google",
    "apple",
  ],
} as const;

/**
 * Box shadow presets from Figma
 */
export const skaiShadows = {
  inputHint: "0px 4px 12px rgba(0, 0, 0, 0.24)",
  card: "0px 8px 24px rgba(0, 0, 0, 0.16)",
  modal: "0px 16px 48px rgba(0, 0, 0, 0.24)",
  button: "0px 4px 8px rgba(0, 0, 0, 0.12)",
} as const;

/**
 * Border radius presets from Figma
 */
export const skaiBorderRadius = {
  none: "0px",
  sm: "4px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  "2xl": "24px",
  full: "9999px",
} as const;

/**
 * Spacing scale (matches Figma s-* variables)
 */
export const skaiSpacing = {
  "0.5": "2px", // s-0.5
  "1": "4px", // s-1
  "2": "8px", // s-2
  "2.5": "10px", // s-2.5
  "3": "12px", // s-3
  "4": "16px", // s-4
  "5": "20px", // s-5
  "6": "24px", // s-6
  "8": "32px", // s-8
  "10": "40px", // s-10
  "12": "48px", // s-12
} as const;

/**
 * Letter spacing presets (-4% from Figma)
 */
export const skaiLetterSpacing = {
  tight: "-0.04em", // -4% used across design
  normal: "0",
  wide: "0.02em",
} as const;

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type SkaiColorKey = keyof typeof skaiColors;
export type SkaiFontKey = keyof typeof skaiFonts;
export type SkaiGradientKey = keyof typeof gradients;
export type SkaiButtonSize = keyof typeof skaiButton.sizes;
export type SkaiButtonType = keyof typeof skaiButton.types;
export type SkaiInputSize = keyof typeof skaiInput.sizes;
export type SkaiInputState = keyof typeof skaiInput.states;
export type SkaiInputMode = keyof typeof skaiInput.modes;
export type SkaiLabelSize = keyof typeof skaiLabel.sizes;
export type SkaiLabelType = keyof typeof skaiLabel.types;
export type SkaiIconSize = keyof typeof skaiIcons.sizes;
