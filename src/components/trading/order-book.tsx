import * as React from "react";
import { cn } from "../../lib/utils";
import { Activity } from "lucide-react";

/**
 * A single price level in the order book
 * @example
 * ```tsx
 * const level: OrderBookLevel = {
 *   id: "bid-1",
 *   price: 50000.50,
 *   size: 1.5,
 *   total: 1.5
 * };
 * ```
 */
export interface OrderBookLevel {
  /** Unique identifier for this level */
  id: string;
  /** Price at this level */
  price: number;
  /** Size/quantity at this level */
  size: number;
  /** Cumulative total up to this level */
  total: number;
  /** Number of orders at this price (optional) */
  orderCount?: number;
  /** Custom metadata */
  meta?: Record<string, unknown>;
}

/**
 * Complete order book data structure
 * @example
 * ```tsx
 * const orderBook: OrderBookData = {
 *   bids: [{ id: "1", price: 50000, size: 1.5, total: 1.5 }],
 *   asks: [{ id: "2", price: 50001, size: 1.0, total: 1.0 }],
 *   spread: 1,
 *   spreadPercent: 0.002,
 *   lastUpdate: Date.now()
 * };
 * ```
 */
export interface OrderBookData {
  /** Buy orders (highest first) */
  bids: OrderBookLevel[];
  /** Sell orders (lowest first) */
  asks: OrderBookLevel[];
  /** Absolute spread between best bid/ask */
  spread: number;
  /** Spread as percentage */
  spreadPercent: number;
  /** Timestamp of last update */
  lastUpdate: number;
}

export interface OrderBookProps {
  /** Order book data to display */
  data: OrderBookData | null;
  /** Whether data is loading */
  loading?: boolean;
  /** Whether the feed is live */
  isLive?: boolean;
  /** Callback when live toggle is clicked */
  onLiveToggle?: () => void;
  /** Callback when a price row is clicked */
  onPriceClick?: (price: number) => void;
  /** Callback when a row is double-clicked */
  onRowDoubleClick?: (price: number, size: number, side: "bid" | "ask") => void;
  /** Number of levels to show per side */
  levels?: number;
  /** Price precision (decimal places) */
  pricePrecision?: number;
  /** Size precision (decimal places) */
  sizePrecision?: number;
  /** Quote currency symbol */
  quoteCurrency?: string;
  /** Show cumulative depth bars */
  showDepthBars?: boolean;
  /** Custom className */
  className?: string;
  /** Highlight changes with animation */
  highlightChanges?: boolean;
}

/**
 * OrderBook component displays bid/ask levels with depth visualization.
 * Commonly used in trading interfaces to show market depth.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <OrderBook
 *   data={orderBookData}
 *   onPriceClick={(price) => setSelectedPrice(price)}
 * />
 *
 * // With all options
 * <OrderBook
 *   data={orderBookData}
 *   isLive={true}
 *   onLiveToggle={() => setIsLive(!isLive)}
 *   levels={15}
 *   pricePrecision={2}
 *   sizePrecision={4}
 *   quoteCurrency="USDT"
 *   showDepthBars={true}
 *   onRowDoubleClick={(price, size, side) => {
 *     openTradeModal(price, size, side);
 *   }}
 * />
 * ```
 */
export const OrderBook = React.forwardRef<HTMLDivElement, OrderBookProps>(
  (
    {
      data,
      loading = false,
      isLive = true,
      onLiveToggle,
      onPriceClick,
      onRowDoubleClick,
      levels = 12,
      pricePrecision = 2,
      sizePrecision = 4,
      quoteCurrency = "USDT",
      showDepthBars = true,
      className,
      highlightChanges = true,
    },
    ref,
  ) => {
    const [priceChanges, setPriceChanges] = React.useState<
      Record<string, "up" | "down" | null>
    >({});
    const prevPricesRef = React.useRef<Map<string, number>>(new Map());

    // Track price changes for animation
    React.useEffect(() => {
      if (!data || !highlightChanges) return;

      const newChanges: Record<string, "up" | "down" | null> = {};

      data.bids.forEach((bid, idx) => {
        const key = `bid-${idx}`;
        const prevPrice = prevPricesRef.current.get(key);
        if (prevPrice !== undefined && prevPrice !== bid.price) {
          newChanges[key] = bid.price > prevPrice ? "up" : "down";
          setTimeout(() => {
            setPriceChanges((prev) => ({ ...prev, [key]: null }));
          }, 300);
        }
        prevPricesRef.current.set(key, bid.price);
      });

      data.asks.forEach((ask, idx) => {
        const key = `ask-${idx}`;
        const prevPrice = prevPricesRef.current.get(key);
        if (prevPrice !== undefined && prevPrice !== ask.price) {
          newChanges[key] = ask.price > prevPrice ? "up" : "down";
          setTimeout(() => {
            setPriceChanges((prev) => ({ ...prev, [key]: null }));
          }, 300);
        }
        prevPricesRef.current.set(key, ask.price);
      });

      if (Object.keys(newChanges).length > 0) {
        setPriceChanges((prev) => ({ ...prev, ...newChanges }));
      }
    }, [data, highlightChanges]);

    if (loading || !data) {
      return (
        <div
          ref={ref}
          className={cn(
            "h-full flex items-center justify-center text-muted-foreground text-sm",
            className,
          )}
        >
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 animate-pulse" />
            Loading order book...
          </div>
        </div>
      );
    }

    const maxBidTotal = data.bids[data.bids.length - 1]?.total || 1;
    const maxAskTotal = data.asks[data.asks.length - 1]?.total || 1;

    const renderLevel = (
      level: OrderBookLevel,
      idx: number,
      side: "bid" | "ask",
    ) => {
      const key = `${side}-${idx}`;
      const change = priceChanges[key];
      const isAsk = side === "ask";
      const maxTotal = isAsk ? maxAskTotal : maxBidTotal;
      const depthPercent = showDepthBars ? (level.total / maxTotal) * 100 : 0;

      return (
        <div
          key={level.id}
          role="row"
          onClick={() => onPriceClick?.(level.price)}
          onDoubleClick={() =>
            onRowDoubleClick?.(level.price, level.size, side)
          }
          className={cn(
            "relative grid grid-cols-3 gap-2 px-3 py-1 text-xs transition-all duration-200 cursor-pointer select-none font-mono",
            isAsk ? "hover:bg-destructive/10" : "hover:bg-primary/10",
            change === "up" && "bg-primary/20",
            change === "down" && "bg-destructive/20",
          )}
        >
          {showDepthBars && (
            <div
              className={cn(
                "absolute inset-y-0 right-0 transition-all duration-300",
                isAsk ? "bg-destructive/10" : "bg-primary/10",
              )}
              style={{ width: `${depthPercent}%` }}
              aria-hidden="true"
            />
          )}
          <span
            className={cn(
              "relative z-10 text-left font-semibold",
              isAsk ? "text-destructive" : "text-primary",
            )}
          >
            {level.price.toFixed(pricePrecision)}
          </span>
          <span className="relative z-10 text-center text-foreground/90">
            {level.size.toFixed(sizePrecision)}
          </span>
          <span className="relative z-10 text-right text-muted-foreground">
            {(level.size * level.price).toFixed(pricePrecision)}
          </span>
        </div>
      );
    };

    return (
      <div
        ref={ref}
        role="table"
        aria-label="Order Book"
        className={cn(
          "h-full flex flex-col bg-card/40 backdrop-blur border border-border rounded-lg overflow-hidden",
          className,
        )}
      >
        {/* Header */}
        <div className="p-3 border-b border-border flex items-center justify-between shrink-0">
          <h3 className="text-sm font-semibold">Order Book</h3>
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                isLive ? "bg-primary animate-pulse" : "bg-muted",
              )}
            />
            {onLiveToggle && (
              <button
                onClick={onLiveToggle}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {isLive ? "Live" : "Paused"}
              </button>
            )}
          </div>
        </div>

        {/* Column Headers */}
        <div
          role="row"
          className="grid grid-cols-3 gap-2 px-3 py-2 text-xs text-muted-foreground border-b border-border font-medium shrink-0"
        >
          <span className="text-left">Price ({quoteCurrency})</span>
          <span className="text-center">Size</span>
          <span className="text-right">Total</span>
        </div>

        {/* Order Levels */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Asks (reversed to show lowest at bottom) */}
          <div
            role="rowgroup"
            aria-label="Ask orders"
            className="flex-1 flex flex-col-reverse overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
          >
            {data.asks
              .slice(0, levels)
              .map((ask, idx) => renderLevel(ask, idx, "ask"))}
          </div>

          {/* Spread */}
          <div className="py-2 px-3 bg-card/50 border-y border-border flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-primary font-mono">
                {data.spread.toFixed(pricePrecision)}
              </span>
              <span className="text-xs text-muted-foreground">Spread</span>
            </div>
            <span className="text-xs text-muted-foreground font-mono">
              {data.spreadPercent.toFixed(4)}%
            </span>
          </div>

          {/* Bids */}
          <div
            role="rowgroup"
            aria-label="Bid orders"
            className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
          >
            {data.bids
              .slice(0, levels)
              .map((bid, idx) => renderLevel(bid, idx, "bid"))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground shrink-0">
          <span className="font-mono">
            Last: {new Date(data.lastUpdate).toLocaleTimeString()}
          </span>
        </div>
      </div>
    );
  },
);

OrderBook.displayName = "OrderBook";

export default OrderBook;
