/**
 * SKAI Theme Configuration
 *
 * Centralized theme system for designers to customize the entire look and feel.
 * Changes here propagate across all components automatically.
 *
 * Usage:
 *   import { theme, createTheme } from '@skai/ui';
 */

/**
 * Default SKAI theme configuration
 * Designers can create custom themes by extending this
 */
export const theme = {
  /**
   * Color palette - All colors used in the design system
   * Format: HSL values as "H S% L%"
   */
  colors: {
    // Brand colors
    brand: {
      primary: "199 90% 65%", // #56C0F6 - Main brand cyan
      secondary: "166 80% 55%", // #2DEDAD - Teal accent
      tertiary: "270 76% 60%", // Purple accent
    },

    // Background colors
    background: {
      default: "225 80% 4%", // #020717 - Main background
      card: "225 60% 8%", // #0D1424 - Card background
      glass: "225 50% 12%", // #15213B - Glass panel
      elevated: "225 60% 6%", // Elevated elements
      muted: "225 30% 15%", // #1B2236 - Muted areas
    },

    // Text colors
    text: {
      primary: "0 0% 100%", // White
      secondary: "225 20% 70%", // #A8B1C8 - Secondary text
      muted: "225 20% 60%", // #8B92A8 - Muted text
      disabled: "225 20% 40%", // Disabled text
    },

    // Border colors
    border: {
      default: "225 30% 20%", // #2D3A54
      subtle: "225 30% 15%", // Subtle borders
      focus: "199 90% 65%", // Focus ring (primary)
    },

    // Trading colors
    trading: {
      long: "142 76% 36%", // #16A34A - Green (buy/profit)
      longGlow: "142 76% 46%", // Glow variant
      short: "0 84% 60%", // #EF4444 - Red (sell/loss)
      shortGlow: "0 84% 70%", // Glow variant
      neutral: "0 0% 50%", // Neutral/unchanged
    },

    // Semantic colors
    semantic: {
      success: "142 76% 36%",
      warning: "38 92% 50%",
      error: "0 84% 60%",
      info: "199 90% 65%",
    },
  },

  /**
   * Typography - Font configuration
   */
  typography: {
    fonts: {
      sans: "'Poppins', system-ui, -apple-system, sans-serif",
      mono: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
      display: "'Manrope', system-ui, sans-serif",
    },

    sizes: {
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

    weights: {
      light: "300",
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },

    lineHeights: {
      none: "1",
      tight: "1.25",
      snug: "1.375",
      normal: "1.5",
      relaxed: "1.625",
      loose: "2",
    },
  },

  /**
   * Spacing - Consistent spacing scale
   */
  spacing: {
    0: "0",
    px: "1px",
    0.5: "0.125rem", // 2px
    1: "0.25rem", // 4px
    1.5: "0.375rem", // 6px
    2: "0.5rem", // 8px
    2.5: "0.625rem", // 10px
    3: "0.75rem", // 12px
    3.5: "0.875rem", // 14px
    4: "1rem", // 16px
    5: "1.25rem", // 20px
    6: "1.5rem", // 24px
    7: "1.75rem", // 28px
    8: "2rem", // 32px
    9: "2.25rem", // 36px
    10: "2.5rem", // 40px
    12: "3rem", // 48px
    14: "3.5rem", // 56px
    16: "4rem", // 64px
    20: "5rem", // 80px
    24: "6rem", // 96px
  },

  /**
   * Border radius - Corner rounding
   */
  radius: {
    none: "0",
    sm: "0.25rem", // 4px
    md: "0.375rem", // 6px
    lg: "0.5rem", // 8px
    xl: "0.75rem", // 12px
    "2xl": "1rem", // 16px
    "3xl": "1.5rem", // 24px
    full: "9999px", // Circular
  },

  /**
   * Shadows - Elevation levels
   */
  shadows: {
    none: "none",
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    glow: "0 0 30px hsl(199 90% 65% / 0.3)",
    glowStrong: "0 0 40px hsl(199 90% 65% / 0.5)",
  },

  /**
   * Transitions - Animation presets
   */
  transitions: {
    durations: {
      fast: "150ms",
      normal: "300ms",
      slow: "500ms",
    },

    easings: {
      default: "cubic-bezier(0.4, 0, 0.2, 1)",
      in: "cubic-bezier(0.4, 0, 1, 1)",
      out: "cubic-bezier(0, 0, 0.2, 1)",
      inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
      bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    },
  },

  /**
   * Breakpoints - Responsive design
   */
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },

  /**
   * Z-index - Stacking order
   */
  zIndex: {
    base: "0",
    dropdown: "50",
    sticky: "100",
    overlay: "200",
    modal: "300",
    popover: "400",
    toast: "500",
    tooltip: "600",
  },

  /**
   * Component-specific theming
   */
  components: {
    button: {
      borderRadius: "0.5rem",
      fontWeight: "500",
      sizes: {
        sm: { height: "2rem", padding: "0.75rem", fontSize: "0.875rem" },
        md: { height: "2.5rem", padding: "1rem", fontSize: "0.875rem" },
        lg: { height: "2.75rem", padding: "1.5rem", fontSize: "1rem" },
      },
    },

    input: {
      borderRadius: "0.375rem",
      sizes: {
        sm: { height: "2rem", padding: "0.5rem" },
        md: { height: "2.5rem", padding: "0.75rem" },
        lg: { height: "3rem", padding: "1rem" },
      },
    },

    card: {
      borderRadius: "0.75rem",
      padding: "1.5rem",
      borderWidth: "1px",
    },

    dialog: {
      borderRadius: "1rem",
      padding: "1.5rem",
    },
  },
} as const;

/**
 * Theme type for TypeScript support
 */
export type Theme = typeof theme;
export type ThemeColors = typeof theme.colors;
export type ThemeTypography = typeof theme.typography;

/**
 * Create a custom theme by extending the default
 *
 * Usage:
 *   const customTheme = createTheme({
 *     colors: {
 *       brand: { primary: "200 100% 50%" }
 *     }
 *   });
 */
export function createTheme(overrides: DeepPartial<Theme>): Theme {
  return deepMerge(theme, overrides) as Theme;
}

/**
 * Deep merge utility for theme creation
 */
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

function deepMerge<T extends object>(target: T, source: DeepPartial<T>): T {
  const result = { ...target };

  for (const key in source) {
    const sourceValue = source[key];
    const targetValue = target[key];

    if (
      sourceValue &&
      typeof sourceValue === "object" &&
      !Array.isArray(sourceValue) &&
      targetValue &&
      typeof targetValue === "object"
    ) {
      (result as Record<string, unknown>)[key] = deepMerge(
        targetValue as object,
        sourceValue as DeepPartial<object>,
      );
    } else if (sourceValue !== undefined) {
      (result as Record<string, unknown>)[key] = sourceValue;
    }
  }

  return result;
}

/**
 * Convert theme colors to CSS custom properties
 */
export function themeToCssVars(t: Theme): Record<string, string> {
  const vars: Record<string, string> = {};

  // Flatten colors
  const flattenObject = (obj: Record<string, unknown>, prefix = ""): void => {
    for (const [key, value] of Object.entries(obj)) {
      const varName = prefix ? `${prefix}-${key}` : key;
      if (typeof value === "string") {
        vars[`--skai-${varName}`] = value;
      } else if (typeof value === "object" && value !== null) {
        flattenObject(value as Record<string, unknown>, varName);
      }
    }
  };

  flattenObject(t.colors, "color");

  return vars;
}

/**
 * Apply theme to document
 */
export function applyTheme(t: Theme): void {
  const cssVars = themeToCssVars(t);
  const root = document.documentElement;

  for (const [property, value] of Object.entries(cssVars)) {
    root.style.setProperty(property, value);
  }
}

export default theme;
