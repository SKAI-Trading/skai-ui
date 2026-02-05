/**
 * CSS Custom Property Fallbacks
 *
 * Provides fallback values for CSS custom properties (CSS variables)
 * for older browsers that don't support them (IE11, older Safari).
 *
 * @example
 * ```tsx
 * import { cssVar, cssVarWithFallback, injectFallbackStyles } from "@skai/ui";
 *
 * // Use in inline styles
 * <div style={{ color: cssVar("--primary", "#17F9B4") }} />
 *
 * // Generate fallback stylesheet
 * injectFallbackStyles();
 * ```
 */

/**
 * Default fallback values for common design tokens
 */
export const defaultFallbacks: Record<string, string> = {
  // Colors - Background (Green Coal #001615)
  "--background": "hsl(173, 100%, 4%)",
  "--foreground": "hsl(60, 100%, 97%)",
  "--card": "hsl(170, 40%, 7%)",
  "--card-foreground": "hsl(60, 100%, 97%)",
  "--popover": "hsl(170, 40%, 7%)",
  "--popover-foreground": "hsl(60, 100%, 97%)",

  // Colors - Primary (Sky Blue #56C7F3)
  "--primary": "hsl(197, 87%, 64%)",
  "--primary-foreground": "hsl(173, 100%, 4%)",

  // Colors - Secondary (Alien Green #17F9B4)
  "--secondary": "hsl(158, 95%, 53%)",
  "--secondary-foreground": "hsl(173, 100%, 4%)",

  // Colors - Muted
  "--muted": "hsl(215, 25%, 17%)",
  "--muted-foreground": "hsl(215, 15%, 65%)",

  // Colors - Accent
  "--accent": "hsl(215, 25%, 17%)",
  "--accent-foreground": "hsl(180, 100%, 98%)",

  // Colors - Destructive
  "--destructive": "hsl(0, 84%, 60%)",
  "--destructive-foreground": "hsl(180, 100%, 98%)",

  // Colors - Border/Input/Ring
  "--border": "hsl(222, 20%, 20%)",
  "--input": "hsl(222, 20%, 20%)",
  "--ring": "hsl(169, 89%, 56%)",

  // Trading Colors
  "--bid": "hsl(169, 89%, 56%)",
  "--ask": "hsl(0, 84%, 60%)",
  "--profit": "hsl(142, 71%, 45%)",
  "--loss": "hsl(0, 84%, 60%)",
  "--long": "hsl(169, 89%, 56%)",
  "--short": "hsl(0, 84%, 60%)",
  "--price-up": "hsl(142, 71%, 45%)",
  "--price-down": "hsl(0, 84%, 60%)",

  // Radius
  "--radius": "0.75rem",

  // Chart
  "--chart-1": "hsl(169, 89%, 56%)",
  "--chart-2": "hsl(200, 95%, 55%)",
  "--chart-3": "hsl(45, 93%, 47%)",
  "--chart-4": "hsl(280, 65%, 60%)",
  "--chart-5": "hsl(0, 84%, 60%)",
};

/**
 * Checks if CSS custom properties are supported
 * @returns true if CSS custom properties are supported
 */
export function supportsCSSVariables(): boolean {
  if (typeof window === "undefined") return true;
  return window.CSS?.supports?.("color", "var(--test)") ?? false;
}

/**
 * Gets a CSS custom property value with a fallback
 * @param property - The CSS custom property name (e.g., "--primary")
 * @param fallback - Fallback value if CSS variables aren't supported
 * @returns The CSS value string
 *
 * @example
 * ```tsx
 * <div style={{ backgroundColor: cssVar("--primary", "#17F9B4") }} />
 * ```
 */
export function cssVar(property: string, fallback?: string): string {
  const fallbackValue = fallback ?? defaultFallbacks[property] ?? "inherit";

  if (!supportsCSSVariables()) {
    return fallbackValue;
  }

  return `var(${property}, ${fallbackValue})`;
}

/**
 * Gets the computed value of a CSS custom property
 * @param property - The CSS custom property name
 * @param element - Element to get the computed style from (defaults to documentElement)
 * @returns The computed value or fallback
 */
export function getCSSVarValue(property: string, element?: Element): string {
  if (typeof window === "undefined") {
    return defaultFallbacks[property] ?? "";
  }

  const el = element ?? document.documentElement;
  const value = getComputedStyle(el).getPropertyValue(property).trim();

  return value || (defaultFallbacks[property] ?? "");
}

/**
 * Sets a CSS custom property value
 * @param property - The CSS custom property name
 * @param value - The value to set
 * @param element - Element to set the property on (defaults to documentElement)
 */
export function setCSSVar(
  property: string,
  value: string,
  element?: HTMLElement,
): void {
  if (typeof window === "undefined") return;

  const el = element ?? document.documentElement;
  el.style.setProperty(property, value);
}

/**
 * Generates CSS fallback styles for browsers that don't support CSS variables
 * @param customFallbacks - Custom fallback values to merge with defaults
 * @returns CSS string with fallback styles
 *
 * @example
 * ```tsx
 * const css = generateFallbackCSS({
 *   "--brand-color": "#ff0000"
 * });
 * ```
 */
export function generateFallbackCSS(
  customFallbacks?: Record<string, string>,
): string {
  const fallbacks = { ...defaultFallbacks, ...customFallbacks };

  const rules: string[] = [];

  // Generate color fallbacks
  rules.push(`:root {`);
  for (const [prop, value] of Object.entries(fallbacks)) {
    rules.push(`  ${prop}: ${value};`);
  }
  rules.push(`}`);

  // Generate utility class fallbacks
  rules.push(`
/* Fallback utility classes for older browsers */
.bg-primary { background-color: ${fallbacks["--primary"]}; }
.bg-secondary { background-color: ${fallbacks["--secondary"]}; }
.bg-destructive { background-color: ${fallbacks["--destructive"]}; }
.bg-muted { background-color: ${fallbacks["--muted"]}; }
.bg-card { background-color: ${fallbacks["--card"]}; }
.bg-background { background-color: ${fallbacks["--background"]}; }

.text-primary { color: ${fallbacks["--primary"]}; }
.text-secondary-foreground { color: ${fallbacks["--secondary-foreground"]}; }
.text-destructive { color: ${fallbacks["--destructive"]}; }
.text-muted-foreground { color: ${fallbacks["--muted-foreground"]}; }
.text-foreground { color: ${fallbacks["--foreground"]}; }

.border-border { border-color: ${fallbacks["--border"]}; }
.border-primary { border-color: ${fallbacks["--primary"]}; }
.border-destructive { border-color: ${fallbacks["--destructive"]}; }

/* Trading color fallbacks */
.text-bid { color: ${fallbacks["--bid"]}; }
.text-ask { color: ${fallbacks["--ask"]}; }
.text-profit { color: ${fallbacks["--profit"]}; }
.text-loss { color: ${fallbacks["--loss"]}; }
.bg-bid { background-color: ${fallbacks["--bid"]}; }
.bg-ask { background-color: ${fallbacks["--ask"]}; }
`);

  return rules.join("\n");
}

/**
 * Injects fallback styles into the document head
 * Only injects if CSS variables are not supported
 * @param customFallbacks - Custom fallback values
 * @returns The created style element, or null if not needed
 *
 * @example
 * ```tsx
 * // In your app initialization
 * useEffect(() => {
 *   injectFallbackStyles();
 * }, []);
 * ```
 */
export function injectFallbackStyles(
  customFallbacks?: Record<string, string>,
): HTMLStyleElement | null {
  if (typeof document === "undefined") return null;

  // Only inject if CSS variables aren't supported
  if (supportsCSSVariables()) {
    return null;
  }

  // Check if already injected
  const existingStyle = document.getElementById("skai-ui-css-fallbacks");
  if (existingStyle) {
    return existingStyle as HTMLStyleElement;
  }

  const css = generateFallbackCSS(customFallbacks);
  const style = document.createElement("style");
  style.id = "skai-ui-css-fallbacks";
  style.textContent = css;
  document.head.appendChild(style);

  return style;
}

/**
 * React hook to ensure CSS fallbacks are loaded
 * @param customFallbacks - Custom fallback values
 *
 * @example
 * ```tsx
 * function App() {
 *   useCSSFallbacks();
 *   return <div>...</div>;
 * }
 * ```
 */
export function useCSSFallbacks(
  customFallbacks?: Record<string, string>,
): void {
  if (typeof window !== "undefined") {
    // Only run once - using a static variable to track injection
    const isInjected = (globalThis as unknown as { __cssInjected?: boolean })
      .__cssInjected;
    if (!isInjected) {
      injectFallbackStyles(customFallbacks);
      (globalThis as unknown as { __cssInjected?: boolean }).__cssInjected =
        true;
    }
  }
}

/**
 * Utility to create a style object with CSS variable fallbacks
 * @param styles - Object with CSS variable values
 * @returns Style object with fallbacks applied
 *
 * @example
 * ```tsx
 * <div style={withFallbacks({
 *   backgroundColor: "var(--primary)",
 *   color: "var(--foreground)",
 * })} />
 * ```
 */
export function withFallbacks(
  styles: Record<string, string>,
): Record<string, string> {
  if (supportsCSSVariables()) {
    return styles;
  }

  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(styles)) {
    // Check if value is a CSS variable
    const varMatch = value.match(/var\((--[\w-]+)(?:,\s*(.+))?\)/);
    if (varMatch) {
      const [, varName, inlineFallback] = varMatch;
      result[key] = inlineFallback ?? defaultFallbacks[varName] ?? value;
    } else {
      result[key] = value;
    }
  }

  return result;
}
