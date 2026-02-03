import * as React from "react";
import { cn } from "../../lib/utils";

export interface TickerBackgroundProps {
  className?: string;
  /**
   * Number of ticker rows to display
   * @default 8
   */
  rows?: number;
  /**
   * Animation speed in seconds
   * @default 30
   */
  speed?: number;
  /**
   * Opacity of the ticker text
   * @default 0.08
   */
  opacity?: number;
}

// Stock symbols and crypto pairs for the ticker
const TICKER_SYMBOLS = [
  "AAPL",
  "GOOGL",
  "MSFT",
  "AMZN",
  "NVDA",
  "META",
  "TSLA",
  "BRK.A",
  "BTC/USD",
  "ETH/USD",
  "SOL/USD",
  "AVAX/USD",
  "MATIC/USD",
  "DOT/USD",
  "JPM",
  "V",
  "MA",
  "UNH",
  "JNJ",
  "XOM",
  "PG",
  "HD",
  "LINK/USD",
  "UNI/USD",
  "AAVE/USD",
  "MKR/USD",
  "CRV/USD",
  "SNX/USD",
];

// Generate random price change for visual interest
const generatePriceChange = (seed: number) => {
  const change = ((seed * 17) % 20) - 10;
  return change >= 0 ? `+${change.toFixed(2)}%` : `${change.toFixed(2)}%`;
};

/**
 * TickerBackground - Animated stock ticker background effect
 *
 * Creates scrolling rows of stock/crypto symbols with randomized
 * directions and speeds for a dynamic trading floor aesthetic.
 */
export function TickerBackground({
  className,
  rows = 8,
  speed = 30,
  opacity = 0.08,
}: TickerBackgroundProps) {
  // Memoize ticker items to prevent regeneration
  const tickerRows = React.useMemo(() => {
    return Array.from({ length: rows }, (_, rowIndex) => {
      // Alternate direction for visual interest
      const isReverse = rowIndex % 2 === 1;
      // Vary speed slightly per row
      const rowSpeed = speed + (rowIndex % 3) * 5;
      // Offset start position
      const offset = (rowIndex * 12.5) % 100;

      // Create duplicated symbols for seamless loop
      const symbols = [...TICKER_SYMBOLS, ...TICKER_SYMBOLS];

      return {
        isReverse,
        rowSpeed,
        offset,
        symbols: symbols.map((symbol, i) => ({
          symbol,
          change: generatePriceChange(rowIndex * 100 + i),
          isPositive: ((rowIndex * 100 + i) * 17) % 20 >= 10,
        })),
      };
    });
  }, [rows, speed]);

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 select-none overflow-hidden",
        className
      )}
      style={{ opacity }}
      aria-hidden="true"
    >
      {tickerRows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="absolute whitespace-nowrap"
          style={{
            top: `${(rowIndex / rows) * 100}%`,
            transform: `translateX(${row.offset}%)`,
            animation: `ticker-scroll-${row.isReverse ? "reverse" : "forward"} ${row.rowSpeed}s linear infinite`,
          }}
        >
          <div className="inline-flex gap-8 font-mono text-sm text-white/80">
            {row.symbols.map((item, i) => (
              <span key={i} className="inline-flex items-center gap-2">
                <span className="font-semibold">{item.symbol}</span>
                <span className={item.isPositive ? "text-emerald-400" : "text-red-400"}>
                  {item.change}
                </span>
              </span>
            ))}
          </div>
        </div>
      ))}

      {/* Keyframe animations injected via style tag */}
      <style>{`
        @keyframes ticker-scroll-forward {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes ticker-scroll-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
      `}</style>
    </div>
  );
}
