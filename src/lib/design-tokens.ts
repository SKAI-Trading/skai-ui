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
 * Font families from Figma design system
 * - Cormorant Garamond: Headlines (elegant serif)
 * - Manrope: Sub-headlines, UI text (modern sans)
 * - Mulish: Body text, numbers (readable sans)
 */
export const skaiFonts = {
  heading: ["Cormorant Garamond", "Georgia", "serif"],
  subheading: ["Manrope", "system-ui", "sans-serif"],
  body: ["Mulish", "system-ui", "sans-serif"],
  // Aliases
  display: ["Cormorant Garamond", "Georgia", "serif"],
  sans: ["Manrope", "system-ui", "sans-serif"],
  mono: ["JetBrains Mono", "Menlo", "monospace"],
} as const;

/**
 * Font sizes from Figma (desktop breakpoint)
 */
export const skaiFontSizes = {
  // Headlines (Cormorant Garamond)
  "headline-2": ["82px", { lineHeight: "90px", letterSpacing: "-0.02em" }],
  "headline-3": ["54px", { lineHeight: "48px" }],
  "headline-4": ["34px", { lineHeight: "24px" }],

  // Super-headlines (Manrope)
  "super-3": ["42px", { lineHeight: "48px" }],
  "super-4": ["32px", { lineHeight: "36px" }],

  // Sub-headlines (Manrope)
  "sub-1": ["24px", { lineHeight: "28px" }],
  "sub-2": ["18px", { lineHeight: "24px" }],

  // Numbers (Mulish)
  "number-1": ["42px", { lineHeight: "48px" }],
  "number-2": ["32px", { lineHeight: "38px" }],
  "number-3": ["22px", { lineHeight: "26px" }],
  "number-4": ["14px", { lineHeight: "18px" }],

  // Paragraphs (Manrope/Mulish)
  "para-1": ["16px", { lineHeight: "22px" }],
  "para-2": ["14px", { lineHeight: "18px" }],

  // Labels (Mulish)
  "label-1": ["16px", { lineHeight: "16px" }],
  "label-2": ["11px", { lineHeight: "14px" }],
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
// TYPE EXPORTS
// =============================================================================

export type SkaiColorKey = keyof typeof skaiColors;
export type SkaiFontKey = keyof typeof skaiFonts;
export type SkaiGradientKey = keyof typeof gradients;
