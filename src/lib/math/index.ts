/**
 * Math Utilities - Barrel Export
 *
 * @module lib/math
 */

// Clamping utilities
export {
  clamp,
  clampInt,
  clampPercent,
  clampProbability,
  clampPositive,
  clampPositiveNonZero,
} from "./clamp";

// Rounding utilities
export {
  roundToDecimals,
  floorToDecimals,
  ceilToDecimals,
  roundToSignificant,
  roundBankers,
} from "./round";

// Safe parsing utilities
export {
  safeParseInt,
  safeParseFloat,
  safeDivide,
  safePercent,
  ensureNumber,
  isPositiveNumber,
  isNonNegativeNumber,
} from "./safe";
