import * as React from "react";
import { cn } from "../../lib/utils";

// Common token icons mapping (can be extended)
//
// ⚠️ CoinGecko serves every one of these at three fixed sizes, selected by the
// path segment: `/thumb/` = 25x25, `/small/` = 50x50, `/large/` = 250x250
// (measured 2026-08-13, all 14 URLs below). This map used `/small/`, i.e. a
// 50px raster, while the largest slot `sizeMap.xl` paints 40 CSS px — 80
// PHYSICAL px on a 2x display and 120 on a 3x. A 50px source into an 80px box
// is a 1.6x upscale, and that is the visible softness reported on the Portfolio
// wallet rows (report 1e78983e, whose screenshot shows the SOL and BTC marks
// blurred while the neighbouring avatar — a vector SVG — stays crisp).
//
// The reporter asked for "PNGs so the icons look professional"; these already
// ARE PNGs, so format was never the problem and converting anything would not
// have helped. Resolution was. `/large/` is the same asset at 250px, which
// covers every slot in `sizeMap` at 3x with room to spare, costs no new
// committed art, and needs no code beyond the URL.
//
// Do NOT "optimise" these back down to `/small/`: the saving is a few KB on a
// CDN-cached image and the cost is a permanently soft logo on every token row.
const TOKEN_ICONS: Record<string, string> = {
  ETH: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
  WETH: "https://assets.coingecko.com/coins/images/2518/large/weth.png",
  BTC: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
  WBTC: "https://assets.coingecko.com/coins/images/7598/large/wrapped_bitcoin_wbtc.png",
  USDC: "https://assets.coingecko.com/coins/images/6319/large/usdc.png",
  USDT: "https://assets.coingecko.com/coins/images/325/large/Tether.png",
  DAI: "https://assets.coingecko.com/coins/images/9956/large/Badge_Dai.png",
  SOL: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
  MATIC: "https://assets.coingecko.com/coins/images/4713/large/polygon.png",
  ARB: "https://assets.coingecko.com/coins/images/16547/large/photo_2023-03-29_21.47.00.jpeg",
  OP: "https://assets.coingecko.com/coins/images/25244/large/Optimism.png",
  LINK: "https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png",
  UNI: "https://assets.coingecko.com/coins/images/12504/large/uniswap-logo.png",
  AAVE: "https://assets.coingecko.com/coins/images/12645/large/AAVE.png",
  // SKAI brand mark — the canonical circular bolt that ships in the consuming
  // app's public root (`/skai-logo-mark.svg`). The old `/assets/skai-icon.png`
  // path 404s (no such asset is bundled) so SKAI tokens fell back to "SK"
  // initials, leaving SKAI logos inconsistent across surfaces.
  SKAI: "/skai-logo-mark.svg",
  // sUSD is SKAI's native stablecoin (not a bridged asset) — brand it with the
  // same SKAI mark instead of falling back to "SU" initials. Keyed uppercase
  // because lookups normalize via `symbol.toUpperCase()` (so "sUSD" → "SUSD").
  SUSD: "/skai-logo-mark.svg",
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

/**
 * Sources whose artwork is NOT square, and therefore must not be cropped.
 *
 * Every CoinGecko mark above is square, so `object-cover` and `object-contain`
 * are indistinguishable on them. The SKAI brand mark is not: the main app ships
 * `public/skai-logo-mark.svg` at 57.1x64 and skai-wallet bundles the same bolt
 * at viewBox 28.9126x32 — both PORTRAIT, ~0.89-0.90 aspect. Covering a square
 * box scales a portrait source until it fills the WIDTH and then clips the
 * overflow off the top and bottom, so the bolt renders at 1:1 and reads
 * visibly wider than the mark actually is.
 *
 * Report bd9e3b2c is exactly that: measured on the reporter's 2x screenshot,
 * the blue pixels of the SKAI and sUSD marks occupy 64x64 (ratio 1.000) where
 * the same asset drawn un-cropped occupies 58x64 (ratio 0.906).
 *
 * Matched on the resolved URL rather than on the symbol, because consumers pass
 * the same bolt through `src` under different filenames — skai-wallet bundles
 * it via Vite as a content-hashed `skai-mark-<hash>.svg`.
 */
const PORTRAIT_ART = /skai(?:-logo)?-mark(?:[.-][^/]*)?\.svg$/i;

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

    // Reset load/error state when the underlying image URL changes — otherwise
    // a TokenIcon that errored for one token keeps showing the fallback
    // initials after the consumer swaps in a different (valid) token.
    React.useEffect(() => {
      setHasError(false);
      setIsLoading(true);
    }, [iconUrl]);

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
                "w-full h-full",
                // Square art keeps `cover` so it fills the circle edge to edge;
                // portrait art must be `contain` or it is cropped (see
                // PORTRAIT_ART).
                PORTRAIT_ART.test(iconUrl) ? "object-contain" : "object-cover",
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
