/**
 * SKAI UI Design Tokens Export (for Tailwind config)
 *
 * This file exports ONLY the design tokens for use in tailwind.config.ts files.
 * It does NOT export React components to avoid JSX compilation issues with
 * Tailwind's jiti loader.
 *
 * Usage in tailwind.config.ts:
 *   import { skaiPreset } from './modules/skai-ui/src/tokens-export';
 *   export default { presets: [skaiPreset] } satisfies Config;
 *
 * For React components, import from:
 *   import { Button, Card } from '@skai/ui';
 *
 * @packageDocumentation
 */

// =============================================================================
// TAILWIND PRESET (Single Source of Truth)
// =============================================================================

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

// =============================================================================
// DESIGN TOKENS (Colors, Typography, Spacing)
// =============================================================================

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

// =============================================================================
// FIGMA TOKENS
// =============================================================================

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

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type {
  SkaiPresetConfig,
  SkaiKeyframe,
  SkaiAnimation,
  SkaiTransitionDuration,
  SkaiTransitionTimingFunction,
  SkaiScreen,
  SkaiZIndexLevel,
} from "./lib/tailwind-preset";

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
