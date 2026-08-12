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

// ============================================================================
// Token DISPLAY labels — what a user reads, not what the chain calls it
// ============================================================================
//
// Casey's ruling, 2026-08-12: **"always show USD for a user's balance for sUSD
// everywhere. sUSD is just the technical term."**
//
// `sUSD` is SKAI's native stablecoin (predeploy 0x5B41…0002, 1:1 with the
// dollar). The ticker is an implementation detail of the chain. A user holding
// it holds dollars, and every balance, amount and denomination they read should
// say so.
//
// ★ THIS IS A LABEL CHANGE, NOT AN IDENTITY CHANGE. The symbol `sUSD` must keep
// its exact spelling everywhere it *identifies* the token rather than *presents*
// it:
//
//   KEEP `sUSD`                          USE `tokenDisplaySymbol()`
//   ─────────────────────────────────    ─────────────────────────────────
//   contract + predeploy addresses       "Balance: 120.00 USD"
//   type unions, e.g. "sUSD" | "SKAI"    amount inputs and their suffixes
//   service args, RPC and query keys     token pickers on user surfaces
//   chain explorer + tx detail           deposit / withdraw / send / receive
//   Command Center and admin panels      game bet and payout denominations
//   analytics events, logs, Sentry       portfolio and wallet rows
//   docs and runbooks                    marketing and landing copy
//
// The rule of thumb: if changing the string could break a lookup, a comparison,
// a route, or an operator's ability to reason about the chain, it is an
// identity and must stay `sUSD`. If it is read by a person deciding what they
// own or what they are about to spend, it is a presentation and becomes `USD`.
//
// Deliberately a mapping rather than a rename: the token keeps one name in code,
// so there is exactly one place to change if the ruling ever moves, and no
// call site has to remember the policy.

/** Token symbols whose user-facing label differs from their on-chain ticker. */
const DISPLAY_SYMBOL_OVERRIDES: Readonly<Record<string, string>> = {
  sUSD: "USD",
  SUSD: "USD",
};

/**
 * The label to show a user for a token symbol.
 *
 * Pass the on-chain symbol; get back what belongs on screen. Unknown symbols
 * are returned unchanged, so this is safe to apply broadly — it can only affect
 * symbols that have a deliberate override.
 *
 * @example
 * tokenDisplaySymbol("sUSD")  // "USD"
 * tokenDisplaySymbol("SKAI")  // "SKAI"
 * tokenDisplaySymbol("ETH")   // "ETH"
 */
export function tokenDisplaySymbol(symbol: string | null | undefined): string {
  if (!symbol) return "";
  return DISPLAY_SYMBOL_OVERRIDES[symbol] ?? symbol;
}

/**
 * True when a symbol is presented under a different name than it carries
 * on-chain. Useful where a surface wants to show the technical ticker as
 * secondary detail (a tooltip, an explorer link) alongside the display label.
 */
export function hasDisplayAlias(symbol: string | null | undefined): boolean {
  return Boolean(symbol && symbol in DISPLAY_SYMBOL_OVERRIDES);
}

/**
 * Join an ALREADY-FORMATTED amount to its DISPLAY symbol.
 *
 * @example
 * formatAmountWithSymbol("120.00", "sUSD")  // "120.00 USD"
 * formatAmountWithSymbol("0.42", "ETH")     // "0.42 ETH"
 *
 * Deliberately does NOT format the number. Call sites already decide their own
 * precision — a balance row, a bet slip and a fee line all round differently —
 * and this function's job is the label, not the maths. Note in particular that
 * `formatTokenAmount`'s second parameter is the token's ON-CHAIN DECIMALS (18),
 * not a display precision; wiring it in here would silently mis-scale every
 * caller that passed a display precision instead.
 *
 * An empty or unknown amount is returned as-is, so an offline em dash stays an
 * em dash rather than becoming "— USD".
 */
export function formatAmountWithSymbol(
  formattedAmount: string | null | undefined,
  symbol: string | null | undefined,
): string {
  const value = formattedAmount ?? "";
  const label = tokenDisplaySymbol(symbol);
  if (!value) return "";
  if (!label) return value;
  // Never append a denomination to a placeholder: "— USD" reads as a real
  // quantity in an unknown currency rather than as an unknown quantity.
  if (value === "—" || value === "-" || value === "…") return value;
  return `${value} ${label}`;
}
