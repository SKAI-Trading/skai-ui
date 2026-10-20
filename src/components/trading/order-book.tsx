import * as React from "react";
import { cn } from "../../lib/utils";
import { semanticColors } from "../../lib/design-tokens";
import { durations, easings, easingToCss } from "../../lib/motion-tokens";
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
 * The highlight a level takes when the book changes AT ITS PRICE (report
 * d97f0616): a fill took some of it, a maker added to it, or it is a price
 * that was not on that side before. No frame draws one, so the behaviour is
 * Hyperliquid's, read off app.hyperliquid.xyz on 2026-10-20, in our paints:
 *
 * - an overlay over the whole row, between the depth bar and the figures;
 * - opacity 0, up to full a fifth of the way in, back to 0 at 800 ms;
 * - its start held back by a fixed offset per row, counted from the spread,
 *   so a sweep through several levels ripples instead of blinking in step;
 * - a row already lit is not restarted by a second change inside its 800.
 *
 * The paints are the side's `-O` overlay styles, App/Red-O (#FB3324 at 34%)
 * and App/Green-O (#17F9B4 at 24%), the same reds and greens the depth ramp
 * runs to, at the weight the design system gives an overlay. 800 ms is the
 * `slowest` motion token.
 *
 * The keyframes run on the element (`Element.animate`) for the same reason the
 * depth fills are inline: a class would only survive a consuming app whose
 * Tailwind build happens to reach this bundle. The overlay sits at opacity 0,
 * so wherever the animation cannot run nothing is drawn rather than a tint
 * that never fades.
 */
const FLASH_FILL = {
  ask: semanticColors.red.opacity34,
  bid: semanticColors.green.opacity24,
} as const;
const FLASH_MS = durations.slowest;
const FLASH_FRAMES: Keyframe[] = [
  { opacity: 0 },
  { opacity: 1, offset: 0.2 },
  { opacity: 0 },
];
const FLASH_TIMING: KeyframeAnimationOptions = {
  duration: FLASH_MS,
  easing: easingToCss(easings.standard),
  fill: "forwards",
};
/** Start offsets in 50 ms steps, by row from the spread, ten rows a cycle. */
const FLASH_STAGGER = [0, 8, 4, 3, 2, 5, 7, 1, 9, 6] as const;
const FLASH_STAGGER_MS = 50;

const flashKey = (side: "bid" | "ask", price: number) => `${side}:${price}`;

function startFlash(el: HTMLDivElement | null) {
  el?.animate?.(FLASH_FRAMES, FLASH_TIMING);
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * The figure every depth bar is drawn against: the larger of the two sides'
 * deepest cumulative totals among the rows on screen, as Hyperliquid scales
 * its book. One scale for both sides, so a thin side reads as thin beside a
 * deep one, and depth below the last row drawn does not shorten the rows that
 * are. 0 when no drawn row has a positive total.
 */
function depthScale(...sides: OrderBookLevel[][]): number {
  let max = 0;
  for (const side of sides) {
    for (const level of side) {
      if (Number.isFinite(level.total) && level.total > max) max = level.total;
    }
  }
  return max;
}

/**
 * The Total column: each row's notional added to every row between it and the
 * spread, as Hyperliquid's book writes it. It is what a click on the row fills
 * (the whole stack down to it), and it runs the way the depth bar beside it
 * does. A level whose notional is not a number makes that row and every row
 * past it NaN: a total that stepped over it would understate the stack.
 */
function runningTotals(shown: OrderBookLevel[]): number[] {
  let sum = 0;
  return shown.map((level) => (sum += level.size * level.price));
}

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
  /**
   * Callback when a price row is clicked, with the side the row is on. The
   * side is what tells the two rows apart when one price stands on both
   * sides, which the chain allows for a single trader's crossing orders.
   */
  onPriceClick?: (price: number, side: "bid" | "ask") => void;
  /** Callback when a row is double-clicked */
  onRowDoubleClick?: (price: number, size: number, side: "bid" | "ask") => void;
  /** Number of levels to show per side */
  levels?: number;
  /**
   * Levels on the ask side alone, when the two sides are not drawn alike.
   * Defaults to `levels`.
   */
  askLevels?: number;
  /**
   * Levels on the bid side alone. Defaults to `levels`. The /spot 1440 boards
   * draw fifteen asks over sixteen bids (7710:92603, 8558:135100,
   * 8687:100787), which one count for both sides cannot say.
   */
  bidLevels?: number;
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
  /** Show cumulative depth bars, both sides on one scale (see `depthScale`). */
  showDepthBars?: boolean;
  /** Custom className */
  className?: string;
  /**
   * Light a level for a moment when the book changes at its price: its size
   * moved, or it was not on that side before. Never on the first book a mount
   * is given, never for reduced motion. A caller that switches market or tick
   * keys the widget on it, so the new ladder starts dark instead of lighting
   * every row.
   */
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
      askLevels = levels,
      bidLevels = levels,
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
    // Levels lit right now: flashKey -> the time that highlight ends, which is
    // also its identity (the overlay's key, and what its end timer checks).
    const [flashing, setFlashing] = React.useState<ReadonlyMap<string, number>>(
      () => new Map(),
    );
    // Size at every price of the last book, per side. null until the first
    // book, which is never compared with anything.
    const prevSizesRef = React.useRef<Map<string, number> | null>(null);
    // When each level's current highlight ends, so a second change inside it
    // does not restart it.
    const flashEndsRef = React.useRef<Map<string, number>>(new Map());
    // Every pending start and end, cancelled on unmount: a live book schedules
    // these continuously, and a leaked one sets state on an unmounted widget.
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

    // The book is compared by price, not by row. The widget used to key this
    // on row position and compare prices, which lit every row below a level
    // that came or went (each now held its neighbour's price) and never lit
    // the level a fill actually changed, whose price had not moved.
    React.useEffect(() => {
      if (!data) return;
      const sizes = new Map<string, number>();
      for (const level of data.asks) sizes.set(flashKey("ask", level.price), level.size);
      for (const level of data.bids) sizes.set(flashKey("bid", level.price), level.size);
      const prev = prevSizesRef.current;
      prevSizesRef.current = sizes;
      if (!prev || !highlightChanges || prefersReducedMotion()) return;

      const now = Date.now();
      const later = (ms: number, run: () => void) => {
        const timer = setTimeout(() => {
          flashTimersRef.current.delete(timer);
          run();
        }, ms);
        flashTimersRef.current.add(timer);
      };
      const light = (side: "bid" | "ask", shown: OrderBookLevel[]) => {
        shown.forEach((level, idx) => {
          const key = flashKey(side, level.price);
          // Object.is, so a size that reads NaN on both books is no change.
          if (prev.has(key) && Object.is(prev.get(key), level.size)) return;
          if ((flashEndsRef.current.get(key) ?? 0) > now) return;
          const delay = FLASH_STAGGER[idx % FLASH_STAGGER.length] * FLASH_STAGGER_MS;
          const end = now + delay + FLASH_MS;
          flashEndsRef.current.set(key, end);
          later(delay, () => setFlashing((on) => new Map(on).set(key, end)));
          // Clears only its own highlight: a timer that fires late must not
          // put out the next one on the same level.
          later(delay + FLASH_MS, () =>
            setFlashing((on) => {
              if (on.get(key) !== end) return on;
              const next = new Map(on);
              next.delete(key);
              return next;
            }),
          );
        });
      };
      light("ask", data.asks.slice(0, askLevels));
      light("bid", data.bids.slice(0, bidLevels));
    }, [data, highlightChanges, askLevels, bidLevels]);

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

    const shownAsks = data.asks.slice(0, askLevels);
    const shownBids = data.bids.slice(0, bidLevels);
    // `total` is cumulative, so each bar grows away from the spread; both sides
    // are drawn against the one figure `depthScale` takes from the rows shown.
    const scale = depthScale(shownAsks, shownBids);
    const askTotals = runningTotals(shownAsks);
    const bidTotals = runningTotals(shownBids);

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
      side: "bid" | "ask",
      runningTotal: number,
    ) => {
      const flashId = flashing.get(flashKey(side, level.price));
      const isAsk = side === "ask";
      const depthPercent =
        showDepthBars && scale > 0 && Number.isFinite(level.total)
          ? Math.min(100, Math.max(0, (level.total / scale) * 100))
          : 0;

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
          onClick={() => onPriceClick?.(level.price, side)}
          onDoubleClick={() =>
            onRowDoubleClick?.(level.price, level.size, side)
          }
          onKeyDown={
            isInteractive
              ? (e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onPriceClick?.(level.price, side);
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
            "transition-all duration-200 motion-reduce:transition-none cursor-pointer select-none",
            isAsk
              ? "hover:bg-skai-red-300/10"
              : "hover:bg-alien-green-bright/10",
          )}
        >
          {showDepthBars && (
            <div
              className="absolute left-0 top-1/2 h-4 -translate-y-1/2 transition-all duration-300 motion-reduce:transition-none"
              style={{
                width: `${depthPercent}%`,
                backgroundImage: isAsk ? ASK_DEPTH_FILL : BID_DEPTH_FILL,
              }}
              aria-hidden="true"
            />
          )}
          {/* After the bar, so it paints over it; the figures' z-10 keeps them
              on top. See FLASH_FILL. */}
          {flashId !== undefined && (
            <div
              key={flashId}
              ref={startFlash}
              data-book-flash={side}
              className="pointer-events-none absolute inset-0"
              style={{ backgroundColor: FLASH_FILL[side], opacity: 0 }}
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
            {Number.isFinite(runningTotal)
              ? totalMoney(runningTotal)
              : UNKNOWN_FIGURE}
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
            a quantity of the base asset, while Total is `size * price` run
            from the spread (`runningTotals`), a cash amount in the quote.
            Labelling both with the quote read "Size (USD)
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
            `py-[3px]` pays for the rules out of the pad, so at 1440 the band
            is 1 + 3 + 16 + 3 + 1 = 24 with the labels still at y=4.

            THE TABLET BAND IS 20 (8846:63552 on 8837-63445, read live
            2026-09-24): rules at y=0 and y=20, "Frame 283" padded 4/16 with
            the labels on a 12 line at y=4. Same pad, a 12 line:
            1 + 3 + 12 + 3 + 1, and the 12 line is `leading-3`. The board
            sets the labels in Manrope 10/12 (Sm/Paragraph 3 300), which no
            token carries yet (figma/tokens/DRIFT.md lists it with none), so
            they stay on `text-xs` until one does rather than on a raw 10px.

            Its labels sit on the ladder's columns rather than hugging each
            other: Price opens at x=16, Size ends at 382 and Total at 692,
            which is where 70 / 55 / 70 spread across the 676 row put the
            right edges of the Size and Total cells. So from `md` the three
            label cells ARE the ladder's cells, and from `lg` they go back to
            the 1440 board's 89 / hug / fill.

            The Size cell is packed to its end from `md` instead of
            truncated. In Manrope 400 at 12px and -0.48px, "Size (BTC)" and
            "Size (ETH)" are 53 wide and fit the 55, but "Size (USDT)", this
            widget's default, is 61: a clipped cell would read "Size (US…",
            and a plain right-aligned one that overflows starts at its left
            edge and so ends past 382. Packed to the end the label stays whole,
            still ends on the cell's edge, and runs its excess left into the
            empty band between Price and Size. From `lg` the cell hugs its
            label again, so the packing moves nothing there, and it clips as
            it did.

            The 375 band (9777:101098) measures 20 as well, but its label type
            has not been read, so the unprefixed classes are what it drew
            before: 26, with 12/16 labels. */}
        <div
          role="row"
          className="flex items-center justify-between px-4 py-1 md:py-[3px] font-sans text-xs font-normal leading-4 md:leading-3 lg:leading-4 tracking-[-0.48px] text-ash border-y border-border shrink-0"
        >
          <span className="w-[89px] md:w-[70px] lg:w-[89px] shrink-0 truncate text-left">
            Price
          </span>
          <span className="shrink-0 truncate text-right md:flex md:w-[55px] md:justify-end md:overflow-visible lg:w-auto lg:overflow-hidden">
            Size ({baseCurrency})
          </span>
          <span className="min-w-px flex-1 truncate text-right md:w-[70px] md:flex-none lg:w-auto lg:flex-1">
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
            fifteen asks and sixteen bids, which is what the halves hold on the
            board's 622. */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Asks (reversed to show lowest at bottom) */}
          <div
            role="rowgroup"
            aria-label="Ask orders"
            className="flex-1 lg:flex-[15_1_0%] lg:min-h-min flex flex-col-reverse overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
          >
            {shownAsks.map((ask, i) => renderLevel(ask, "ask", askTotals[i]))}
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
              Mulish, matching the ladder beneath.

              The label carries a colon on every board that draws it:
              7710:92742 and 8558/8687 at 1440, 7742:56892 on the dropdown
              cut, 8846:63667 at 768. */}
          <div className="flex shrink-0 items-center justify-between px-4 py-[2px] text-xs leading-4 tracking-[-0.48px] text-white">
            <span className="min-w-px flex-1 truncate text-right font-sans">
              Spread:
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
            {shownBids.map((bid, i) => renderLevel(bid, "bid", bidTotals[i]))}
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
