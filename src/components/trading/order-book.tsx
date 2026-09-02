import * as React from "react";
import { cn } from "../../lib/utils";
import { Activity } from "lucide-react";

/**
 * Depth fills, from the `/spot` order-book frame (`7710:92603`, rows
 * `7710:92635` / `7710:92748`). Each is a left-anchored horizontal ramp — the
 * bar starts almost transparent at the price and deepens as it runs out under
 * the size and total, so depth reads as distance travelled rather than as a
 * block of colour.
 *
 * `#FB3324` is `App/Red-O` and is deliberately NOT the ask price's `App/Red 300`
 * `#FF574A`: the bar sits behind the text and needs a redder, denser base to
 * stay legible under it. Reading either colour off the other inverts the design.
 *
 * These are inline styles rather than `bg-gradient-to-r from-… to-…` because the
 * package ships as a prebuilt bundle: consuming apps compile their own Tailwind,
 * and an arbitrary-value gradient class only survives if their content globs
 * happen to reach this file. A background-image on the element always survives.
 */
const ASK_DEPTH_FILL =
  "linear-gradient(to right, rgba(251, 51, 36, 0.04), rgba(251, 51, 36, 0.24))";
const BID_DEPTH_FILL =
  "linear-gradient(to right, rgba(23, 249, 180, 0.04), rgba(23, 249, 180, 0.14))";

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
 * Drawn to the `/spot` order-book frame `7710:92603`. The ladder's geometry —
 * 18px slots, a 70/55/70 cell split, 12/16 Mulish at -0.48px and the
 * left-anchored depth ramp — is measured, so treat those literals as design
 * values rather than as taste.
 *
 * The root's direct children are addressable from outside: consumers suppress
 * the title bar and the "Last:" footer with `[&>div:first-child]:hidden` /
 * `[&>div:last-child]:hidden` through `className`, because neither has a prop.
 * Reordering or wrapping the root's children silently un-hides them.
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
    // Track every flash-clear timer so we can cancel them on unmount. A live
    // order book fires these continuously; without cleanup each unmount leaks
    // a pending setTimeout that calls setState on an unmounted component.
    const flashTimersRef = React.useRef<Set<ReturnType<typeof setTimeout>>>(
      new Set(),
    );

    React.useEffect(() => {
      const timers = flashTimersRef.current;
      return () => {
        timers.forEach((t) => clearTimeout(t));
        timers.clear();
      };
    }, []);

    // Track price changes for animation
    React.useEffect(() => {
      if (!data || !highlightChanges) return;

      const newChanges: Record<string, "up" | "down" | null> = {};

      const scheduleClear = (key: string) => {
        const timer = setTimeout(() => {
          flashTimersRef.current.delete(timer);
          setPriceChanges((prev) => ({ ...prev, [key]: null }));
        }, 300);
        flashTimersRef.current.add(timer);
      };

      data.bids.forEach((bid, idx) => {
        const key = `bid-${idx}`;
        const prevPrice = prevPricesRef.current.get(key);
        if (prevPrice !== undefined && prevPrice !== bid.price) {
          newChanges[key] = bid.price > prevPrice ? "up" : "down";
          scheduleClear(key);
        }
        prevPricesRef.current.set(key, bid.price);
      });

      data.asks.forEach((ask, idx) => {
        const key = `ask-${idx}`;
        const prevPrice = prevPricesRef.current.get(key);
        if (prevPrice !== undefined && prevPrice !== ask.price) {
          newChanges[key] = ask.price > prevPrice ? "up" : "down";
          scheduleClear(key);
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

    // `total` is cumulative, so the deepest level of a side is its last one and
    // that level is the bar's denominator. Note the denominator is drawn from
    // everything the caller supplied, while only `levels` rows are rendered: a
    // caller that hands over more depth than it asks to show shortens every
    // visible bar by the ratio between the two.
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

      const isInteractive = !!onPriceClick || !!onRowDoubleClick;

      return (
        <div
          key={level.id}
          role="row"
          tabIndex={isInteractive ? 0 : undefined}
          aria-label={
            isInteractive
              ? `${side === "ask" ? "Ask" : "Bid"} ${level.price.toFixed(
                  pricePrecision,
                )}, size ${level.size.toFixed(sizePrecision)}`
              : undefined
          }
          onClick={() => onPriceClick?.(level.price)}
          onDoubleClick={() =>
            onRowDoubleClick?.(level.price, level.size, side)
          }
          onKeyDown={
            isInteractive
              ? (e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onPriceClick?.(level.price);
                  }
                }
              : undefined
          }
          className={cn(
            // 12/16 Mulish at -0.48px in an 18px slot: 16px of type with a 1px
            // rule of air either side (`7710:92634`). `tabular-nums` is the
            // design system's pairing for Mulish on numeric data, and it is what
            // stops the digits shifting sideways as the ladder reprices.
            "relative flex items-center justify-between px-4 py-px",
            "font-mulish text-xs leading-4 tracking-[-0.48px] tabular-nums",
            "transition-all duration-200 cursor-pointer select-none",
            isAsk
              ? "hover:bg-skai-red-300/10"
              : "hover:bg-alien-green-bright/10",
            change === "up" && "bg-alien-green-bright/20",
            change === "down" && "bg-skai-red-300/20",
          )}
        >
          {showDepthBars && (
            <div
              className="absolute left-0 top-1/2 h-4 -translate-y-1/2 transition-all duration-300"
              style={{
                width: `${depthPercent}%`,
                backgroundImage: isAsk ? ASK_DEPTH_FILL : BID_DEPTH_FILL,
              }}
              aria-hidden="true"
            />
          )}
          {/* 70 / 55 / 70 with the slack between them, so the price hangs off
              the left edge and size and total hang off the right one. */}
          <span
            className={cn(
              "relative z-10 w-[70px] shrink-0 text-left",
              isAsk ? "text-skai-red-300" : "text-alien-green-bright",
            )}
          >
            {level.price.toFixed(pricePrecision)}
          </span>
          <span className="relative z-10 w-[55px] shrink-0 text-right text-white">
            {level.size.toFixed(sizePrecision)}
          </span>
          <span className="relative z-10 w-[70px] shrink-0 text-right text-white">
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
                type="button"
                onClick={onLiveToggle}
                aria-pressed={isLive}
                aria-label={isLive ? "Pause live feed" : "Resume live feed"}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {isLive ? "Live" : "Paused"}
              </button>
            )}
          </div>
        </div>

        {/* Column headers (`7710:92629`). The header runs its own cell model —
            a fixed 89px Price, a shrink-to-fit Size and a Total that takes the
            remainder — so the labels are NOT column-aligned with the ladder
            beneath them. That is the frame: a label like "Size (USD)" is wider
            than the 55px column it names, and forcing it into that column would
            clip it. Price carries no suffix; the quote sits on the two columns
            that are denominated in it. */}
        <div
          role="row"
          className="flex items-center justify-between px-4 py-1 font-sans text-xs font-normal leading-4 tracking-[-0.48px] text-ash border-b border-border shrink-0"
        >
          <span className="w-[89px] shrink-0 truncate text-left">Price</span>
          <span className="shrink-0 truncate text-right">
            Size ({quoteCurrency})
          </span>
          <span className="min-w-px flex-1 truncate text-right">
            Total ({quoteCurrency})
          </span>
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
