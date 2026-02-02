// =============================================================================
// SKAI UI COMPONENT LIBRARY
// =============================================================================
// A comprehensive, production-ready UI component library for SKAI Trading
// applications built with React, TypeScript, Radix UI, and Tailwind CSS.
// =============================================================================

// =============================================================================
// COMPONENTS - Organized by Category
// =============================================================================

// Core Components (Button, Card, Input, Badge, Label, Textarea)
export * from "./components/core";

// Form Components (Checkbox, Select, Slider, Switch, etc.)
export * from "./components/forms";

// Layout Components (Separator, ScrollArea, Accordion, Sidebar, etc.)
export * from "./components/layout";

// Navigation Components (Tabs, Breadcrumb, Pagination, etc.)
export * from "./components/navigation";

// Feedback Components (Alert, Progress, Skeleton, Toast, etc.)
export * from "./components/feedback";

// Overlay Components (Dialog, Sheet, Dropdown, Popover, etc.)
export * from "./components/overlays";

// Data Display Components (Table, Avatar, Calendar, Chart, etc.)
export * from "./components/data-display";

// Trading Components (TokenIcon, PriceDisplay, OrderBook, etc.)
export * from "./components/trading";

// Utility Components (ThemeProvider, CopyButton, etc.)
export * from "./components/utility";

// Branding Components (SkaiLogo, SkaiIcon)
export * from "./components/branding";

// =============================================================================
// HOOKS
// =============================================================================

// Hooks - Toast
export * from "./hooks/use-toast";

// Hooks - Utilities
export * from "./hooks/use-debounce";
export * from "./hooks/use-local-storage";
export * from "./hooks/use-media-query";
export * from "./hooks/use-copy-to-clipboard";
export * from "./hooks/use-countdown";
export * from "./hooks/use-click-outside";
export * from "./hooks/use-keyboard-shortcut";
export * from "./hooks/use-intersection-observer";
export * from "./hooks/use-window-size";
export * from "./hooks/use-previous";

// =============================================================================
// UTILITIES & LIBRARIES
// =============================================================================

// Utilities
export { cn } from "./lib/utils";

// Animation System
export * from "./lib/animations";

// Accessibility Utilities
export * from "./lib/accessibility";

// Performance Utilities
export * from "./lib/performance";

// Layout Primitives
export * from "./lib/layout";

// Content System (Text/Copy)
export { content, interpolate, getContent } from "./lib/content";
export type { Content, ContentPath } from "./lib/content";

// Asset System (Images/Icons)
export { assets, assetUrls, placeholders, getAsset } from "./lib/assets";
export type { Assets, AssetCategory } from "./lib/assets";

// Theme Configuration
export {
  theme,
  createTheme,
  themeToCssVars,
  applyTheme,
} from "./lib/theme-config";
export type { Theme, ThemeColors, ThemeTypography } from "./lib/theme-config";

// CSS Custom Property Fallbacks (for older browser support)
export * from "./lib/css-fallbacks";

// =============================================================================
// DESIGN TOKENS
// =============================================================================

// Design Tokens - SKAI color palette, typography, spacing, and components
export {
  // Colors
  skaiColors,
  coreColors,
  greenCoalColors,
  accentColors,
  semanticColors,
  earthColors,
  neutralColors,
  gradients,
  // Typography
  skaiFonts,
  skaiFontSizes,
  skaiLetterSpacing,
  // Layout
  skaiGrid,
  skaiSpacing,
  skaiBorderRadius,
  skaiShadows,
  // Component Tokens
  skaiButton,
  skaiInput,
  skaiLabel,
  skaiIcons,
  // Utilities
  generateCSSVariables,
} from "./lib/design-tokens";
export type {
  SkaiColorKey,
  SkaiFontKey,
  SkaiGradientKey,
  SkaiButtonSize,
  SkaiButtonType,
  SkaiInputSize,
  SkaiInputState,
  SkaiInputMode,
  SkaiLabelSize,
  SkaiLabelType,
  SkaiIconSize,
} from "./lib/design-tokens";

// Figma Design Tokens (from Skai Web App)
export {
  colors,
  typography,
  spacing,
  shadows,
  animation,
  breakpoints,
  zIndex,
  tokens,
} from "./lib/tokens";
export type {
  Colors,
  Typography,
  Spacing,
  Shadows,
  Animation,
  Breakpoints,
  ZIndex,
  Tokens,
  BrandColor,
  GreenCoalShade,
  AppColor,
  SemanticColor,
} from "./lib/tokens";

// =============================================================================
// TAILWIND PRESET - SINGLE SOURCE OF TRUTH
// =============================================================================
// Use this in consuming apps to inherit all SKAI design tokens:
//
// ```ts
// // tailwind.config.ts
// import { skaiPreset } from '@skai/ui';
// export default { presets: [skaiPreset], ... } satisfies Config;
// ```

export { default as skaiPreset } from "./lib/tailwind-preset";
export {
  // Animation exports
  skaiKeyframes,
  skaiAnimations,
  skaiTransitionDuration,
  skaiTransitionTimingFunction,
  // Layout exports
  skaiScreens,
  skaiZIndex,
  // Gradient exports
  skaiBackgroundImage,
  // Semantic color exports
  skaiSemanticColors,
} from "./lib/tailwind-preset";
export type {
  SkaiPresetConfig,
  SkaiKeyframe,
  SkaiAnimation,
  SkaiTransitionDuration,
  SkaiTransitionTimingFunction,
  SkaiScreen,
  SkaiZIndexLevel,
} from "./lib/tailwind-preset";

// =============================================================================
// STYLES
// =============================================================================
// Import this in your app's main CSS:
// import '@skai/ui/dist/styles.css';
