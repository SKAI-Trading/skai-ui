/**
 * Format Utilities - Barrel Export
 *
 * All formatting functions for the SKAI platform.
 *
 * @module lib/format
 */

// Address formatting
export {
  formatAddress,
  formatAddressOrName,
  formatAddressWithCopy,
  isSameAddress,
} from "./address";

// Currency and number formatting
export {
  formatBytes,
  formatCompact,
  formatCryptoAmount,
  formatCurrency,
  formatLargeNumber,
  formatNumber,
  formatTokenAmount,
  formatUsdChange,
} from "./currency";

// Date and time formatting
export {
  formatDate,
  formatDateTime,
  formatDuration,
  formatISODate,
  formatRelativeTime,
  formatSmartDate,
  formatTimestamp,
  isToday,
  timeAgo,
} from "./date";

// Percentage formatting
export {
  formatBasisPoints,
  formatMultiplier,
  formatPercent,
  formatPercentChange,
  formatProbability,
  formatWinRate,
} from "./percent";
