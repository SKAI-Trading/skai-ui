/**
 * Header Theme Configuration
 * 
 * Centralized theme tokens for the SKAI header system.
 * Edit these values to customize the header appearance across all apps.
 */

// =============================================================================
// COLOR TOKENS
// =============================================================================

export const headerColors = {
  /** Primary background color */
  background: "#001615",
  /** Border color */
  border: "#123F3C",
  /** Border hover/active */
  borderHover: "#1a5a55",
  /** Brand primary (cyan) */
  brandPrimary: "#56C7F3",
  /** Brand secondary (teal) */
  brandSecondary: "#2CECAD",
  /** Glow color for status pills */
  glow: "rgba(44, 236, 173, 0.02)",
  /** Text primary */
  textPrimary: "#FFFFFF",
  /** Text muted */
  textMuted: "#9CA3AF",
  /** Active state background */
  activeBackground: "rgba(86, 199, 243, 0.1)",
} as const;

// =============================================================================
// LAYOUT TOKENS
// =============================================================================

export const headerLayout = {
  /** Header heights */
  height: {
    default: 56,
    compact: 48,
    large: 64,
  },
  /** Navigation row height */
  navHeight: 40,
  /** Mobile menu width */
  mobileMenuWidth: "85vw",
  mobileMenuMaxWidth: "320px",
  /** Minimum touch target size */
  minTouchTarget: 44,
  /** Border radius for pills/buttons */
  borderRadius: {
    pill: "9999px",
    button: "12px",
    card: "16px",
  },
} as const;

// =============================================================================
// BRANDING CONFIGURATION
// =============================================================================

export interface HeaderBrandConfig {
  /** Logo image path */
  logoSrc: string;
  /** Logo alt text */
  logoAlt: string;
  /** Brand name (split for styling) */
  brandName: {
    primary: string;
    secondary: string;
  };
  /** Brand URL */
  brandUrl: string;
  /** Show text on mobile */
  showTextOnMobile?: boolean;
}

export const defaultBrandConfig: HeaderBrandConfig = {
  logoSrc: "/skai-logo-mark.svg",
  logoAlt: "Skai",
  brandName: {
    primary: "Skai",
    secondary: ".trade",
  },
  brandUrl: "/",
  showTextOnMobile: false,
};

// =============================================================================
// NAVIGATION CONFIGURATION
// =============================================================================

export interface HeaderNavItemConfig {
  to: string;
  label: string;
  icon?: string;
  badge?: string | number;
  external?: boolean;
}

export interface HeaderNavGroupConfig {
  id: string;
  label: string;
  items: HeaderNavItemConfig[];
  adminOnly?: boolean;
}

// =============================================================================
// CSS CUSTOM PROPERTIES
// =============================================================================

/**
 * Generate CSS custom properties for header theming
 */
export function getHeaderCssVars(): React.CSSProperties {
  return {
    "--header-bg": headerColors.background,
    "--header-border": headerColors.border,
    "--header-brand-primary": headerColors.brandPrimary,
    "--header-brand-secondary": headerColors.brandSecondary,
    "--header-text-primary": headerColors.textPrimary,
    "--header-text-muted": headerColors.textMuted,
  } as React.CSSProperties;
}

// =============================================================================
// TAILWIND CLASS HELPERS
// =============================================================================

export const headerClasses = {
  /** Base header styles */
  header: `sticky top-0 z-50 backdrop-blur-xl bg-[${headerColors.background}] border-b border-[${headerColors.border}] shadow-[0_1px_15px_${headerColors.glow}]`,
  /** Header container */
  container: "container mx-auto px-4",
  /** Top row (logo + search + actions) */
  topRow: `flex items-center justify-between h-14 border-b border-[${headerColors.border}]/50`,
  /** Navigation row */
  navRow: "hidden lg:flex items-center gap-1 h-10 overflow-x-auto scrollbar-hide",
  /** Active nav item */
  navItemActive: `text-primary bg-[${headerColors.activeBackground}]`,
  /** Mobile menu item */
  mobileMenuItem: "flex items-center gap-3 text-sm font-medium transition-colors min-h-[48px] px-3 mx-1 rounded-xl",
} as const;
