import * as React from "react";
import { cn } from "../../lib/utils";
import { CopyButton } from "../utility/copy-button";
import { ExternalLink } from "lucide-react";

export interface WalletAddressProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onCopy"
> {
  /** The wallet address to display */
  address: string;
  /** Number of characters to show at start */
  startChars?: number;
  /** Number of characters to show at end */
  endChars?: number;
  /** Show copy button */
  showCopy?: boolean;
  /** Show external link to explorer */
  showExplorer?: boolean;
  /** Chain for explorer link */
  chain?: "ethereum" | "base" | "arbitrum" | "optimism" | "polygon" | "solana";
  /** Custom explorer URL (overrides chain) */
  explorerUrl?: string;
  /** Variant styling */
  variant?: "default" | "badge" | "inline";
  /** Callback when copied */
  onCopyAddress?: (address: string) => void;
}

const EXPLORER_URLS: Record<string, string> = {
  ethereum: "https://etherscan.io/address/",
  base: "https://basescan.org/address/",
  arbitrum: "https://arbiscan.io/address/",
  optimism: "https://optimistic.etherscan.io/address/",
  polygon: "https://polygonscan.com/address/",
  solana: "https://solscan.io/account/",
};

/**
 * Truncate address for display
 */
function truncateAddress(
  address: string,
  startChars: number = 6,
  endChars: number = 4,
): string {
  if (!address) return "";
  if (address.length <= startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

const WalletAddress = React.forwardRef<HTMLDivElement, WalletAddressProps>(
  (
    {
      address,
      startChars = 6,
      endChars = 4,
      showCopy = true,
      showExplorer = false,
      chain = "ethereum",
      explorerUrl,
      variant = "default",
      onCopyAddress,
      className,
      ...props
    },
    ref,
  ) => {
    const truncated = truncateAddress(address, startChars, endChars);
    const explorer = explorerUrl || EXPLORER_URLS[chain];

    const variantStyles = {
      default: "inline-flex items-center gap-1",
      badge:
        "inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-muted-foreground text-sm",
      inline: "inline",
    };

    return (
      <div
        ref={ref}
        className={cn(variantStyles[variant], className)}
        {...props}
      >
        <span
          className="font-mono text-sm"
          title={address}
          aria-label={`Wallet address: ${address}`}
        >
          {truncated}
        </span>

        {showCopy && (
          <CopyButton
            value={address}
            onCopySuccess={onCopyAddress}
            size="icon"
            variant="ghost"
            className="h-6 w-6"
          />
        )}

        {showExplorer && explorer && (
          <a
            href={`${explorer}${address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center h-6 w-6 rounded-md hover:bg-accent transition-colors"
            aria-label="View on explorer"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    );
  },
);

WalletAddress.displayName = "WalletAddress";

export { WalletAddress, truncateAddress, EXPLORER_URLS };
