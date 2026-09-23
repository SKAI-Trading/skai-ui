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
 * Drawn wherever the book holds no figure. An em dash, deliberately not a zero
 * and deliberately not the ellipsis a loading row uses: "we cannot derive this"
 * and "this is still arriving" must never produce the same pixels.
 */
const UNKNOWN_FIGURE = "—";

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
  /**
   * Absolute spread between best bid and best ask, or `null` when there is no
   * spread to state.
   *
   * A one-sided book — real levels on one side, nothing on the other — has no
   * spread at all, and producers that type the field `number` hand that case
   * over as a zero. A zero-width spread is the most bullish claim an order book
   * can make about a market's liquidity, and it was being made about markets
   * with no offers in them. `null` is the only value that says "no spread",
   * so the widget can draw {@link UNKNOWN_FIGURE} instead of inventing one.
   * Deliberately no third case.
   */
  spread: number | null;
  /** Spread as a percentage, or `null` on the same terms as {@link spread}. */
  spreadPercent: number | null;
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
  /**
   * Render a cash figure in the ladder — Price and Total.
   *
   * Both columns are money, and the frame writes them with a currency symbol
   * and thousands separators ("$121,723"), which `toFixed` cannot produce. The
   * default keeps every existing caller on exactly the output they had.
   *
   * ⛔ Deliberately NOT applied to the Spread row: frame 9002:163859 draws that
   * as a bare figure, so formatting it would be a regression dressed as
   * consistency. Size is not money either — it is a quantity of the base asset
   * and keeps `sizePrecision`.
   */
  formatPrice?: (value: number) => string;
  /**
   * Render the Total column, when it does not read like the Price column.
   *
   * They are both cash and they were given one formatter, but frame 9002:163721
   * does not write them the same way: Price is "$121,723" and Total beside it is
   * "2,889,871" — grouped, and with no currency mark. The column header already
   * carries the unit ("Total (USDT)"), so repeating it on every row would say
   * the same thing twice down the ladder.
   *
   * Defaults to `formatPrice`, so a caller that passes only that keeps the
   * behaviour it has, and a caller that passes neither keeps `toFixed`.
   */
  formatTotal?: (value: number) => string;
  /** Size precision (decimal places) */
  sizePrecision?: number;
  /** Quote currency symbol — denominates Price and Total */
  quoteCurrency?: string;
  /**
   * Base currency symbol — denominates Size, which is a quantity of the asset
   * and not a cash amount. Defaults to `quoteCurrency` so callers written
   * before the split keep their old labels.
   */
  baseCurrency?: string;
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
 *   baseCurrency="BTC"
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
      formatPrice,
      formatTotal,
      quoteCurrency = "USDT",
      baseCurrency = quoteCurrency,
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

    // Price and Total are cash; Size is a quantity and is deliberately not
    // routed through either. Default preserves the previous toFixed output.
    const money = (v: number) =>
      formatPrice ? formatPrice(v) : v.toFixed(pricePrecision);

    // Total falls back to the price formatter, so a caller that passes one gets
    // what it got before; 9002:163721 draws the two differently and a caller
    // that cares now says so.
    const totalMoney = (v: number) =>
      formatTotal ? formatTotal(v) : money(v);

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
                )}, size ${level.size.toFixed(sizePrecision)} ${baseCurrency}`
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
            {money(level.price)}
          </span>
          <span className="relative z-10 w-[55px] shrink-0 text-right text-white">
            {level.size.toFixed(sizePrecision)}
          </span>
          <span className="relative z-10 w-[70px] shrink-0 text-right text-white">
            {totalMoney(level.size * level.price)}
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
            clip it. Price carries no suffix. Size and Total take DIFFERENT
            suffixes because they hold different units — Size is `level.size`,
            a quantity of the base asset, while Total is `size * price`, a cash
            amount in the quote. Labelling both with the quote read "Size (USD)
            0.262338" against a price of 78,222.50, which is 0.262338 BTC
            announced as twenty-six cents. */}
        {/* ★ THE BAND IS RULED ON BOTH EDGES, and it had only the lower one.
            Two readings agree and neither was acted on: the tablet board
            `9002:163721` puts a zero-height `line` at the top of "Frame 442"
            and another at its foot (`9002:163748` / `9002:163753`), and the
            wave-45 pass that took the quote row's own `border-b` away recorded
            the reason in as many words — the divider the quote row appeared to
            own belongs to this band, which draws one at each edge. Removing it
            there without adding it here left the two rows with no rule between
            them at all.

            ⚠ THE BAND WAS 26, NOT 24, from the day it took the upper rule.
            The 1440 cut closes on 24 (`7712:29463`, read 2026-09-16;
            `7732:32546` and `7710:92627`, read 2026-09-21): Frame 442 is 24
            tall with a zero-height `line` at y=0 and another at y=24, and
            "Frame 283" holds the three labels at y=4 on a 16px line box, the
            first `book` row opening at 24. That is 4 + 16 + 4 = 24 with both
            rules drawn inside it and counted in neither pad. `py-1` over
            `leading-4` is that sum only while the rules take no room;
            `border-y` makes them real, and the box came to 1 + 4 + 16 + 4 + 1.
            `lg:py-[3px]` pays for the rules out of the pad, so at 1440 the band
            is 1 + 3 + 16 + 3 + 1 = 24 with the labels still at y=4.

            Below `lg` it stays 26, unchanged on purpose. The tablet cut states
            the band twice and disagrees with itself ("Frame 442" declares 20,
            its content measures 22 — 4 + a 14 line box + 4 — and the first
            ladder row opens at 20, so the lower rule overlaps that row by two),
            and no reading of the 375 band is on record. Settle those from their
            own boards, not from this one. */}
        <div
          role="row"
          className="flex items-center justify-between px-4 py-1 lg:py-[3px] font-sans text-xs font-normal leading-4 tracking-[-0.48px] text-ash border-y border-border shrink-0"
        >
          <span className="w-[89px] shrink-0 truncate text-left">Price</span>
          <span className="shrink-0 truncate text-right">
            Size ({baseCurrency})
          </span>
          <span className="min-w-px flex-1 truncate text-right">
            Total ({quoteCurrency})
          </span>
        </div>

        {/* Order Levels.

            Below `lg` the two sides are equal `flex-1` halves. The 1440 board
            does not split them evenly. Its ladder body (`7732:32533` on
            4144-64244, `7710:92614` on 7710-91527, both read 2026-09-21) is a
            20 quote row, `sells` 294 — the 24 band over fifteen 18px asks —
            the 20 Spread row at y=314, then sixteen 18px bids, 288. What the
            band and the spread leave, 558 there, goes 270 to the asks and 288
            to the bids: fifteen parts to sixteen, which is what
            `lg:flex-[15_1_0%]` and `lg:flex-[16_1_0%]` say.

            They are grow factors on a zero basis, and that is what keeps the
            split away from books nobody stands to a height. Under a parent of
            no definite height a percentage basis falls back to the content, so
            a content-sized book still hugs its rows exactly as it did; only a
            book handed a height (ConnectedOrderBook's `fillHeight`, which the
            /spot desktop column passes) is split at all. A fixed 270 would
            have grown every one of the others.

            The ask half also keeps its rows as a floor (`lg:min-h-min`). The
            ratio is exact only on the board's own 558, and /spot hands over
            less: its panel and this root each draw a 1px border inside the 622
            the board fills, so on the row's 672 floor the classes leave 552,
            where fifteen asks at fifteen parts in thirty-one would get 267 and
            scroll by three. With the floor they stay whole and the bids give
            up the difference. A caller that asks for more levels than the half
            holds gets every ask shown and the bids scrolling; /spot asks for
            fifteen. */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Asks (reversed to show lowest at bottom) */}
          <div
            role="rowgroup"
            aria-label="Ask orders"
            className="flex-1 lg:flex-[15_1_0%] lg:min-h-min flex flex-col-reverse overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
          >
            {data.asks
              .slice(0, levels)
              .map((ask, idx) => renderLevel(ask, idx, "ask"))}
          </div>

          {/* Spread row — `7712:29575` at 1440 and `9002:163859` at 768, which
              draw the same three cells and differ only in how much slack the
              flexible ones get: the label right-aligned in a `flex-1` cell, the
              absolute spread centred in a box padded 24 either side (a 56-wide
              cell around the frame's 8px sample figure), then the percentage
              left-aligned in a second `flex-1` cell. The trio therefore reads
              as one centred cluster rather than as two opposite edges, which is
              what the old layout drew.

              Twenty tall on both boards: a 16px line box with 2px of air above
              and below, on the panel's own ground — the frames paint no tint
              behind this row and rule neither side of it. All three cells are
              12/16 at -0.48px in white, the label in Manrope and both figures in
              Mulish, matching the ladder beneath. */}
          <div className="flex shrink-0 items-center justify-between px-4 py-[2px] text-xs leading-4 tracking-[-0.48px] text-white">
            <span className="min-w-px flex-1 truncate text-right font-sans">
              Spread
            </span>
            <span className="shrink-0 px-6 text-center font-mulish tabular-nums">
              {typeof data.spread === "number"
                ? data.spread.toFixed(pricePrecision)
                : UNKNOWN_FIGURE}
            </span>
            <span className="min-w-px flex-1 truncate font-mulish tabular-nums">
              {typeof data.spreadPercent === "number"
                ? `${data.spreadPercent.toFixed(4)}%`
                : UNKNOWN_FIGURE}
            </span>
          </div>

          {/* Bids */}
          <div
            role="rowgroup"
            aria-label="Bid orders"
            className="flex-1 lg:flex-[16_1_0%] overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
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
