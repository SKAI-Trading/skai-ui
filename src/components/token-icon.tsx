import * as React from "react";
import { cn } from "../lib/utils";

// Common token icons mapping (can be extended)
const TOKEN_ICONS: Record<string, string> = {
  ETH: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
  WETH: "https://assets.coingecko.com/coins/images/2518/small/weth.png",
  BTC: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
  WBTC: "https://assets.coingecko.com/coins/images/7598/small/wrapped_bitcoin_wbtc.png",
  USDC: "https://assets.coingecko.com/coins/images/6319/small/usdc.png",
  USDT: "https://assets.coingecko.com/coins/images/325/small/Tether.png",
  DAI: "https://assets.coingecko.com/coins/images/9956/small/Badge_Dai.png",
  SOL: "https://assets.coingecko.com/coins/images/4128/small/solana.png",
  MATIC: "https://assets.coingecko.com/coins/images/4713/small/polygon.png",
  ARB: "https://assets.coingecko.com/coins/images/16547/small/photo_2023-03-29_21.47.00.jpeg",
  OP: "https://assets.coingecko.com/coins/images/25244/small/Optimism.png",
  LINK: "https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png",
  UNI: "https://assets.coingecko.com/coins/images/12504/small/uniswap-logo.png",
  AAVE: "https://assets.coingecko.com/coins/images/12645/small/AAVE.png",
  SKAI: "/assets/skai-icon.png",
};

export interface TokenIconProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Token symbol (e.g., "ETH", "BTC") */
  symbol: string;
  /** Custom image URL (overrides built-in mapping) */
  src?: string;
  /** Size in pixels */
  size?: "xs" | "sm" | "md" | "lg" | "xl" | number;
  /** Show border ring */
  showBorder?: boolean;
  /** Fallback background color */
  fallbackColor?: string;
}

const sizeMap = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 40,
};

const TokenIcon = React.forwardRef<HTMLDivElement, TokenIconProps>(
  (
    {
      symbol,
      src,
      size = "md",
      showBorder = false,
      fallbackColor,
      className,
      ...props
    },
    ref,
  ) => {
    const [hasError, setHasError] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);

    const pixelSize = typeof size === "number" ? size : sizeMap[size];
    const iconUrl = src || TOKEN_ICONS[symbol.toUpperCase()];

    // Generate consistent color from symbol for fallback
    const generateColor = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      const hue = Math.abs(hash % 360);
      return `hsl(${hue}, 70%, 50%)`;
    };

    const bgColor = fallbackColor || generateColor(symbol);

    return (
      <div
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center rounded-full overflow-hidden flex-shrink-0",
          showBorder && "ring-2 ring-border",
          className,
        )}
        style={{
          width: pixelSize,
          height: pixelSize,
          backgroundColor: hasError || !iconUrl ? bgColor : "transparent",
        }}
        {...props}
      >
        {iconUrl && !hasError ? (
          <>
            {isLoading && (
              <div
                className="absolute inset-0 animate-pulse bg-muted rounded-full"
                style={{ backgroundColor: bgColor }}
              />
            )}
            <img
              src={iconUrl}
              alt={`${symbol} icon`}
              className={cn(
                "w-full h-full object-cover",
                isLoading && "opacity-0",
              )}
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setHasError(true);
                setIsLoading(false);
              }}
            />
          </>
        ) : (
          <span
            className="font-semibold text-white uppercase"
            style={{ fontSize: pixelSize * 0.4 }}
          >
            {symbol.slice(0, 2)}
          </span>
        )}
      </div>
    );
  },
);

TokenIcon.displayName = "TokenIcon";

export { TokenIcon, TOKEN_ICONS };
