/**
 * Clamp Utilities
 *
 * @module lib/math/clamp
 */

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Clamp and round to integer
 */
export function clampInt(value: number, min: number, max: number): number {
  return Math.floor(clamp(value, min, max));
}

/**
 * Clamp to percentage range (0-100)
 */
export function clampPercent(value: number): number {
  return clamp(value, 0, 100);
}

/**
 * Clamp to probability range (0-1)
 */
export function clampProbability(value: number): number {
  return clamp(value, 0, 1);
}

/**
 * Clamp to positive (min 0)
 */
export function clampPositive(value: number): number {
  return Math.max(0, value);
}

/**
 * Clamp to positive non-zero (min > 0)
 */
export function clampPositiveNonZero(
  value: number,
  minValue: number = 0.001,
): number {
  return Math.max(minValue, value);
}
