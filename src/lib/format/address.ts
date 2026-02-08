/**
 * Address Formatting Utilities
 *
 * @module lib/format/address
 */

/**
 * Format a wallet address for display (shortened)
 *
 * @example
 * formatAddress("0x1234567890123456789012345678901234567890")
 * // => "0x1234...7890"
 */
export function formatAddress(
  address: string | null | undefined,
  options: { start?: number; end?: number } = {},
): string {
  if (!address) {
    return "";
  }

  const { start = 6, end = 4 } = options;

  if (address.length <= start + end) {
    return address;
  }

  return `${address.slice(0, start)}...${address.slice(-end)}`;
}

// Note: truncateAddress and shortenAddress aliases are available from
// components/trading/wallet-address. Use formatAddress as the canonical name.

/**
 * Format address with copy functionality hint
 */
export function formatAddressWithCopy(
  address: string | null | undefined,
  options: { start?: number; end?: number } = {},
): { formatted: string; full: string } {
  const formatted = formatAddress(address, options);
  return {
    formatted,
    full: address || "",
  };
}

/**
 * Check if two addresses are the same (case-insensitive)
 */
export function isSameAddress(
  addr1: string | null | undefined,
  addr2: string | null | undefined,
): boolean {
  if (!addr1 || !addr2) return false;
  return addr1.toLowerCase() === addr2.toLowerCase();
}

/**
 * Format address for display with ENS/username fallback
 */
export function formatAddressOrName(
  address: string | null | undefined,
  name?: string | null,
  options: { start?: number; end?: number } = {},
): string {
  if (name) {
    return name;
  }
  return formatAddress(address, options);
}
