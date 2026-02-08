/**
 * Safe Parsing Utilities
 *
 * Safe number parsing with defaults and validation.
 *
 * @module lib/math/safe
 */

/**
 * Safely parse integer with default fallback
 */
export function safeParseInt(
  value: string | number | null | undefined,
  defaultValue: number = 0,
): number {
  if (value === null || value === undefined) return defaultValue;
  if (typeof value === "number") return Math.floor(value);

  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Safely parse float with default fallback
 */
export function safeParseFloat(
  value: string | number | null | undefined,
  defaultValue: number = 0,
): number {
  if (value === null || value === undefined) return defaultValue;
  if (typeof value === "number") return isNaN(value) ? defaultValue : value;

  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Safe division (returns 0 if dividing by zero)
 */
export function safeDivide(
  numerator: number,
  denominator: number,
  defaultValue: number = 0,
): number {
  if (denominator === 0 || isNaN(denominator)) return defaultValue;
  const result = numerator / denominator;
  return isFinite(result) ? result : defaultValue;
}

/**
 * Safe percentage calculation
 */
export function safePercent(
  part: number,
  whole: number,
  defaultValue: number = 0,
): number {
  return safeDivide(part, whole, defaultValue) * 100;
}

/**
 * Ensure value is a valid finite number
 */
export function ensureNumber(
  value: unknown,
  defaultValue: number = 0,
): number {
  if (typeof value === "number" && isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = parseFloat(value);
    if (isFinite(parsed)) return parsed;
  }

  return defaultValue;
}

/**
 * Check if value is a valid positive number
 */
export function isPositiveNumber(value: unknown): value is number {
  return typeof value === "number" && isFinite(value) && value > 0;
}

/**
 * Check if value is a valid non-negative number
 */
export function isNonNegativeNumber(value: unknown): value is number {
  return typeof value === "number" && isFinite(value) && value >= 0;
}
