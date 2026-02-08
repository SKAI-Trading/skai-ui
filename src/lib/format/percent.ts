/**
 * Percentage Formatting Utilities
 *
 * @module lib/format/percent
 */

/**
 * Format a number as a percentage
 */
export function formatPercent(
  value: number | null | undefined,
  options: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    showSign?: boolean;
  } = {},
): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "0%";
  }

  const {
    minimumFractionDigits = 1,
    maximumFractionDigits = 2,
    showSign = false,
  } = options;

  const formatter = new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits,
    maximumFractionDigits,
  });

  // Note: Intl.NumberFormat percent expects decimal form (0.5 = 50%)
  // But our percentages are already in percent form (50 = 50%)
  const formatted = formatter.format(value / 100);

  if (showSign && value > 0) {
    return `+${formatted}`;
  }

  return formatted;
}

/**
 * Format basis points (1/100th of a percent)
 * 100 bp = 1%
 */
export function formatBasisPoints(
  basisPoints: number | null | undefined,
  options: { asPercent?: boolean } = {},
): string {
  if (
    basisPoints === null ||
    basisPoints === undefined ||
    isNaN(basisPoints)
  ) {
    return options.asPercent ? "0%" : "0 bp";
  }

  if (options.asPercent) {
    const percent = basisPoints / 100;
    return `${percent.toFixed(2)}%`;
  }

  return `${basisPoints} bp`;
}

/**
 * Format percentage change with color indicator
 */
export function formatPercentChange(
  value: number | null | undefined,
  options: { decimals?: number; showSign?: boolean } = {},
): { formatted: string; isPositive: boolean; isNegative: boolean } {
  const { decimals = 2, showSign = true } = options;

  if (value === null || value === undefined || isNaN(value)) {
    return { formatted: "0%", isPositive: false, isNegative: false };
  }

  const isPositive = value > 0;
  const isNegative = value < 0;
  const absValue = Math.abs(value);

  let formatted = `${absValue.toFixed(decimals)}%`;

  if (showSign) {
    if (isPositive) formatted = `+${formatted}`;
    if (isNegative) formatted = `-${formatted}`;
  } else if (isNegative) {
    formatted = `-${formatted}`;
  }

  return { formatted, isPositive, isNegative };
}

/**
 * Format multiplier (e.g., 2x, 10x)
 */
export function formatMultiplier(
  value: number | null | undefined,
  options: { decimals?: number } = {},
): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "1x";
  }

  const { decimals = 1 } = options;

  if (value === Math.floor(value)) {
    return `${value}x`;
  }

  return `${value.toFixed(decimals)}x`;
}

/**
 * Format probability (0-1 to percentage)
 */
export function formatProbability(
  probability: number | null | undefined,
  options: { decimals?: number } = {},
): string {
  if (
    probability === null ||
    probability === undefined ||
    isNaN(probability)
  ) {
    return "0%";
  }

  const { decimals = 1 } = options;
  const percent = probability * 100;

  return `${percent.toFixed(decimals)}%`;
}

/**
 * Format win rate
 */
export function formatWinRate(
  wins: number,
  total: number,
  options: { decimals?: number } = {},
): string {
  if (total === 0) return "0%";

  const { decimals = 1 } = options;
  const rate = (wins / total) * 100;

  return `${rate.toFixed(decimals)}%`;
}
