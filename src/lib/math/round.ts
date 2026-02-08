/**
 * Rounding Utilities
 *
 * Precision rounding functions.
 *
 * @module lib/math/round
 */

/**
 * Round to specified decimal places
 */
export function roundToDecimals(value: number, decimals: number = 2): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}

/**
 * Round down (floor) to specified decimal places
 */
export function floorToDecimals(value: number, decimals: number = 2): number {
  const multiplier = Math.pow(10, decimals);
  return Math.floor(value * multiplier) / multiplier;
}

/**
 * Round up (ceil) to specified decimal places
 */
export function ceilToDecimals(value: number, decimals: number = 2): number {
  const multiplier = Math.pow(10, decimals);
  return Math.ceil(value * multiplier) / multiplier;
}

/**
 * Round to significant figures
 */
export function roundToSignificant(
  value: number,
  figures: number = 3,
): number {
  if (value === 0) return 0;

  const magnitude = Math.floor(Math.log10(Math.abs(value)));
  const multiplier = Math.pow(10, figures - magnitude - 1);

  return Math.round(value * multiplier) / multiplier;
}

/**
 * Banker's rounding (round half to even) - fairest for splitting
 */
export function roundBankers(value: number, decimals: number = 2): number {
  const multiplier = Math.pow(10, decimals);
  const scaled = value * multiplier;
  const floor = Math.floor(scaled);
  const decimal = scaled - floor;

  // Exactly 0.5 - round to nearest even
  if (Math.abs(decimal - 0.5) < Number.EPSILON) {
    return (floor % 2 === 0 ? floor : floor + 1) / multiplier;
  }

  return Math.round(scaled) / multiplier;
}
