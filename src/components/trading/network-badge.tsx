import * as React from "react";
import { cn } from "../../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const networkBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full font-medium",
  {
    variants: {
      size: {
        xs: "px-1.5 py-0.5 text-[10px]",
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-1 text-sm",
        lg: "px-3 py-1.5 text-base",
      },
      variant: {
        default: "bg-muted text-muted-foreground",
        colored: "", // Colors applied via network config
      },
    },
    defaultVariants: {
      size: "sm",
      variant: "colored",
    },
  },
);

// Network configurations
export interface NetworkConfig {
  name: string;
  shortName?: string;
  chainId: number;
  color: string;
  bgColor: string;
  icon?: string;
}

export const NETWORK_CONFIGS: Record<number, NetworkConfig> = {
  1: {
    name: "Ethereum",
    shortName: "ETH",
    chainId: 1,
    color: "text-blue-600",
    bgColor: "bg-blue-500/10",
  },
  8453: {
    name: "Base",
    shortName: "BASE",
    chainId: 8453,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  10: {
    name: "Optimism",
    shortName: "OP",
    chainId: 10,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  42161: {
    name: "Arbitrum",
    shortName: "ARB",
    chainId: 42161,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
  },
  137: {
    name: "Polygon",
    shortName: "MATIC",
    chainId: 137,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  56: {
    name: "BNB Chain",
    shortName: "BNB",
    chainId: 56,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  43114: {
    name: "Avalanche",
    shortName: "AVAX",
    chainId: 43114,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  250: {
    name: "Fantom",
    shortName: "FTM",
    chainId: 250,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
  },
  324: {
    name: "zkSync Era",
    shortName: "zkSync",
    chainId: 324,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
  },
  59144: {
    name: "Linea",
    shortName: "LINEA",
    chainId: 59144,
    color: "text-black dark:text-white",
    bgColor: "bg-gray-500/10",
  },
  // Testnets
  11155111: {
    name: "Sepolia",
    shortName: "SEP",
    chainId: 11155111,
    color: "text-gray-500",
    bgColor: "bg-gray-500/10",
  },
  84532: {
    name: "Base Sepolia",
    shortName: "BASE-SEP",
    chainId: 84532,
    color: "text-gray-500",
    bgColor: "bg-gray-500/10",
  },
};

export interface NetworkBadgeProps
  extends
    Omit<React.HTMLAttributes<HTMLSpanElement>, "children">,
    VariantProps<typeof networkBadgeVariants> {
  /** Chain ID */
  chainId: number;
  /** Use short name */
  shortName?: boolean;
  /** Show chain icon/dot */
  showIcon?: boolean;
  /** Custom network config for unknown chains */
  customConfig?: NetworkConfig;
}

const NetworkBadge = React.forwardRef<HTMLSpanElement, NetworkBadgeProps>(
  (
    {
      chainId,
      shortName = false,
      showIcon = true,
      customConfig,
      size,
      variant,
      className,
      ...props
    },
    ref,
  ) => {
    const config = customConfig ||
      NETWORK_CONFIGS[chainId] || {
        name: `Chain ${chainId}`,
        shortName: `#${chainId}`,
        chainId,
        color: "text-muted-foreground",
        bgColor: "bg-muted",
      };

    const displayName = shortName
      ? config.shortName || config.name
      : config.name;

    const colorStyles =
      variant === "colored" ? cn(config.color, config.bgColor) : "";

    return (
      <span
        ref={ref}
        className={cn(
          networkBadgeVariants({ size, variant }),
          colorStyles,
          className,
        )}
        {...props}
      >
        {showIcon && (
          <span
            className={cn(
              "rounded-full",
              size === "xs"
                ? "h-1.5 w-1.5"
                : size === "lg"
                  ? "h-2.5 w-2.5"
                  : "h-2 w-2",
              config.color.replace("text-", "bg-"),
            )}
          />
        )}
        {displayName}
      </span>
    );
  },
);
NetworkBadge.displayName = "NetworkBadge";

// Multi-chain badge for showing supported chains
export interface MultiChainBadgeProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, "children">,
    VariantProps<typeof networkBadgeVariants> {
  chainIds: number[];
  maxVisible?: number;
}

const MultiChainBadge = React.forwardRef<HTMLDivElement, MultiChainBadgeProps>(
  ({ chainIds, maxVisible = 3, size, className, ...props }, ref) => {
    const visible = chainIds.slice(0, maxVisible);
    const remaining = chainIds.length - maxVisible;

    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-1", className)}
        {...props}
      >
        {visible.map((chainId) => (
          <NetworkBadge key={chainId} chainId={chainId} shortName size={size} />
        ))}
        {remaining > 0 && (
          <span
            className={cn(
              "text-muted-foreground",
              size === "xs" ? "text-[10px]" : "text-xs",
            )}
          >
            +{remaining}
          </span>
        )}
      </div>
    );
  },
);
MultiChainBadge.displayName = "MultiChainBadge";

export { NetworkBadge, MultiChainBadge, networkBadgeVariants };
