// Components - Core
export * from "./components/button";
export * from "./components/card";
export * from "./components/input";
export * from "./components/badge";
export * from "./components/label";
export * from "./components/textarea";
export * from "./components/skai-icon";
export * from "./components/skai-logo";

// Components - Feedback
export * from "./components/alert";
export * from "./components/alert-dialog";
export * from "./components/progress";
export * from "./components/skeleton";
export * from "./components/tooltip";
export * from "./components/toast";
export * from "./components/toaster";
export * from "./components/spinner";
export * from "./components/empty-state";
export * from "./components/error-boundary";
export * from "./components/notification";

// Components - Forms
export * from "./components/checkbox";
export * from "./components/radio-group";
export * from "./components/select";
export * from "./components/slider";
export * from "./components/switch";
export * from "./components/toggle";
export * from "./components/form";
export * from "./components/input-otp";
export * from "./components/number-input";
export * from "./components/password-input";
export * from "./components/search-input";
export * from "./components/currency-input";
export * from "./components/tag-input";

// Components - Layout
export * from "./components/separator";
export * from "./components/scroll-area";
export * from "./components/accordion";
export * from "./components/collapsible";
export * from "./components/sidebar";
export * from "./components/resizable";
export * from "./components/drawer";
export * from "./components/stepper";
export * from "./components/scrolling-ticker";

// Components - Overlay
export * from "./components/dialog";
export * from "./components/dropdown-menu";
export * from "./components/popover";
export * from "./components/sheet";
export * from "./components/hover-card";
export * from "./components/context-menu";
export * from "./components/command";

// Components - Navigation
export * from "./components/tabs";
export * from "./components/breadcrumb";
export * from "./components/pagination";

// Components - Data Display
export * from "./components/avatar";
export * from "./components/table";
export * from "./components/calendar";
export * from "./components/chart";
export * from "./components/percentage-bar";
export * from "./components/countdown";

// Components - Trading (SKAI-specific)
export * from "./components/token-icon";
export * from "./components/price-display";
export * from "./components/loading-button";
export * from "./components/copy-button";
export * from "./components/wallet-address";
export * from "./components/amount-input";
export * from "./components/fee-display";
export * from "./components/online-indicator";
export * from "./components/price-change";
export * from "./components/pnl-display";
export * from "./components/leverage-slider";
export * from "./components/network-badge";
export * from "./components/transaction-status";
export * from "./components/trade-settings";
export * from "./components/gas-estimate";
export * from "./components/status-indicator";
export * from "./components/risk-gauge";
export * from "./components/tier-badge";

// Components - Composites
export * from "./components/stat-card";
export * from "./components/confirm-dialog";
export * from "./components/token-select";
export * from "./components/swap-input";
export * from "./components/autocomplete";
export * from "./components/date-picker";

// Components - Trading Advanced
export * from "./components/order-book";
export * from "./components/depth-chart";

// Components - Performance (Lazy-loaded)
export * from "./components/lazy-chart";

// Components - Decorative
export * from "./components/dock-icon";
export * from "./components/particle-background";

// Components - Theme
export * from "./components/theme-provider";

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

// Styles - import this in your app's main CSS
// import '@skai/ui/dist/styles.css';
