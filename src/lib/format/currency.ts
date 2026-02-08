/**
 * Currency and Number Formatting Utilities
 *
 * Pure Intl-based formatting for currency, numbers, and token amounts.
 *
 * @module lib/format/currency
 */

/**
 * Format a number as currency (USD by default)
 */
export function formatCurrency(
  value: number | null | undefined,
  options: {
    currency?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    compact?: boolean;
  } = {},
): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "$0.00";
  }

  const {
    currency = "USD",
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
    compact = false,
  } = options;

  if (compact && Math.abs(value) >= 1000) {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      notation: "compact",
      maximumFractionDigits: 1,
    });
    return formatter.format(value);
  }

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  });

  return formatter.format(value);
}

/**
 * Format a raw number with commas and optional decimals
 */
export function formatNumber(
  value: number | null | undefined,
  options: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    compact?: boolean;
  } = {},
): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "0";
  }

  const {
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
    compact = false,
  } = options;

  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits,
    maximumFractionDigits,
    notation: compact ? "compact" : "standard",
  });

  return formatter.format(value);
}

/**
 * Format a token amount with proper decimals
 */
export function formatTokenAmount(
  value: number | bigint | null | undefined,
  decimals: number = 18,
  options: {
    significantDigits?: number;
    maxDecimals?: number;
  } = {},
): string {
  if (value === null || value === undefined) {
    return "0";
  }

  const { significantDigits = 6, maxDecimals = 6 } = options;

  const numValue =
    typeof value === "bigint"
      ? Number(value) / Math.pow(10, decimals)
      : value;

  if (isNaN(numValue)) {
    return "0";
  }

  if (Math.abs(numValue) < 0.000001 && numValue !== 0) {
    return numValue.toExponential(2);
  }

  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxDecimals,
    maximumSignificantDigits: significantDigits,
  });

  return formatter.format(numValue);
}

/**
 * Format bytes to human-readable size
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

/**
 * Format number in compact notation (1K, 1M, 1B)
 */
export function formatCompact(
  value: number | null | undefined,
  options: { decimals?: number } = {},
): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "0";
  }

  const { decimals = 1 } = options;

  const formatter = new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: decimals,
  });

  return formatter.format(value);
}

/**
 * Format as USD with sign prefix for positive/negative
 */
export function formatUsdChange(
  value: number | null | undefined,
  options: { decimals?: number } = {},
): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "$0.00";
  }

  const { decimals = 2 } = options;
  const absValue = Math.abs(value);

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  const formatted = formatter.format(absValue);
  return value >= 0 ? `+${formatted}` : `-${formatted}`;
}

/**
 * Format large numbers with proper separators
 */
export function formatLargeNumber(
  value: number | null | undefined,
  options: { decimals?: number; compact?: boolean } = {},
): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "0";
  }

  const { decimals = 2, compact = false } = options;

  if (compact && Math.abs(value) >= 1_000_000) {
    return formatCompact(value, { decimals });
  }

  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });

  return formatter.format(value);
}

/**
 * Format crypto amount with appropriate decimals
 * Shows more decimals for small amounts
 */
export function formatCryptoAmount(
  value: number | null | undefined,
  symbol?: string,
): string {
  if (value === null || value === undefined || isNaN(value)) {
    return symbol ? `0 ${symbol}` : "0";
  }

  let formatted: string;

  if (Math.abs(value) < 0.0001 && value !== 0) {
    formatted = value.toExponential(2);
  } else if (Math.abs(value) < 1) {
    formatted = value.toFixed(6).replace(/\.?0+$/, "");
  } else if (Math.abs(value) < 1000) {
    formatted = value.toFixed(4).replace(/\.?0+$/, "");
  } else {
    formatted = formatLargeNumber(value, { decimals: 2 });
  }

  return symbol ? `${formatted} ${symbol}` : formatted;
}
