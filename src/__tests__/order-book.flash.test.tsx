/**
 * OrderBook — which level lights up when the book changes, and for how long
 * (report d97f0616).
 *
 * The reference is Hyperliquid's own book, read 2026-10-20 off app.hyperliquid.xyz:
 * a row overlay that rises to its peak in the first fifth of 800 ms and fades
 * out, coloured by side, between the depth bar and the figures, its start held
 * back by a fixed per-row offset (0, 400, 200, 150, 100, 250, 350, 50, 450, 300
 * ms down the side) so a sweep ripples instead of blinking in step, and never
 * restarted while it runs.
 *
 * What starts it here is a change AT A PRICE: a level whose resting size moved
 * (a fill took some, a maker added some) or a price that was not on that side
 * before (a new order). A row whose price merely moved up or down the ladder
 * because a level above it came or went did not change and stays dark; the
 * widget used to key its flash on row position, so exactly those rows lit.
 *
 * @module __tests__/order-book.flash.test
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, act } from "@testing-library/react";
import { OrderBook, type OrderBookData } from "../components/trading/order-book";

type L = [price: number, size: number];

/** A book with cumulative totals, the shape every producer hands the widget. */
function book(asks: L[], bids: L[]): OrderBookData {
  let ca = 0;
  let cb = 0;
  return {
    asks: asks.map(([price, size], i) => ({ id: `a${i}`, price, size, total: (ca += size) })),
    bids: bids.map(([price, size], i) => ({ id: `b${i}`, price, size, total: (cb += size) })),
    spread: asks[0][0] - bids[0][0],
    spreadPercent: 0.01,
    lastUpdate: 0,
  };
}

const ASKS: L[] = [
  [50001, 1],
  [50002, 1.5],
  [50003, 2],
];
const BIDS: L[] = [
  [50000, 1.5],
  [49999, 2],
  [49998, 1],
];

/** "<side> <price cell>" for every row whose overlay is mounted. */
function lit(container: HTMLElement): string[] {
  return Array.from(container.querySelectorAll<HTMLElement>("[data-book-flash]")).map(
    (el) =>
      `${el.getAttribute("data-book-flash")} ${
        el.closest('[role="row"]')!.querySelector("span")!.textContent
      }`,
  );
}

/** The widget's previous row tint, which keyed on position. None may be left. */
function tinted(container: HTMLElement): number {
  return Array.from(container.querySelectorAll('[role="rowgroup"] [role="row"]')).filter((r) =>
    /(^|\s)bg-(alien-green-bright|skai-red-300)\/20(\s|$)/.test(r.className),
  ).length;
}

let reduce = false;
const animate = vi.fn();

beforeEach(() => {
  vi.useFakeTimers();
  reduce = false;
  animate.mockReset();
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: (query: string) => ({
      matches: query.includes("prefers-reduced-motion") ? reduce : false,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }),
  });
  Object.defineProperty(HTMLElement.prototype, "animate", { configurable: true, value: animate });
});

afterEach(() => {
  vi.useRealTimers();
  delete (HTMLElement.prototype as { animate?: unknown }).animate;
});

function mount(first: OrderBookData, props: Partial<React.ComponentProps<typeof OrderBook>> = {}) {
  const view = render(<OrderBook data={first} pricePrecision={1} {...props} />);
  const next = (data: OrderBookData) => view.rerender(<OrderBook data={data} pricePrecision={1} {...props} />);
  const after = (ms: number) => act(() => void vi.advanceTimersByTime(ms));
  // Dark at every 25 ms step: a highlight that came and went inside one long
  // advance would never be seen by a single look at the end.
  const darkFor = (ms: number) => {
    for (let t = 0; t < ms; t += 25) {
      after(25);
      expect(lit(view.container)).toEqual([]);
      expect(tinted(view.container)).toBe(0);
    }
  };
  return { view, next, after, darkFor, lit: () => lit(view.container), tinted: () => tinted(view.container) };
}

describe("OrderBook level highlight — report d97f0616", () => {
  it("draws nothing for the first book it is given", () => {
    const b = mount(book(ASKS, BIDS));
    b.darkFor(1000);
  });

  it("lights the level a fill shrank, in its side's colour, for 800 ms", () => {
    const b = mount(book(ASKS, BIDS));
    b.next(book([[50001, 0.4], ...ASKS.slice(1)], BIDS));
    b.after(1);
    expect(b.lit()).toEqual(["ask 50001.0"]);

    const overlay = b.view.container.querySelector<HTMLElement>("[data-book-flash]")!;
    // App/Red-O, the ask side's overlay paint: #FB3324 at 34%.
    expect(overlay.style.backgroundColor).toBe("rgba(251, 51, 36, 0.34)");
    expect(overlay.getAttribute("aria-hidden")).toBe("true");

    b.after(798);
    expect(b.lit()).toEqual(["ask 50001.0"]);
    b.after(2);
    expect(b.lit()).toEqual([]);
  });

  it("lights the level a maker added size to, on the bid side in green", () => {
    const b = mount(book(ASKS, BIDS));
    b.next(book(ASKS, [[50000, 4], ...BIDS.slice(1)]));
    b.after(1);
    expect(b.lit()).toEqual(["bid 50000.0"]);
    // App/Green-O: #17F9B4 at 24%.
    expect(b.view.container.querySelector<HTMLElement>("[data-book-flash]")!.style.backgroundColor).toBe(
      "rgba(23, 249, 180, 0.24)",
    );
  });

  it("lights a new order's price and not the rows it pushed down the ladder", () => {
    const b = mount(book(ASKS, BIDS));
    b.next(book(ASKS, [[50000.5, 0.2], ...BIDS]));
    // The new level is row 0 of the bids, which starts at once; the three
    // below it each sit one row further from the spread than they did.
    b.after(1);
    expect(b.lit()).toEqual(["bid 50000.5"]);
    expect(b.tinted()).toBe(0);
    b.after(1000);
    expect(b.lit()).toEqual([]);
  });

  it("leaves every row dark when a level is taken out and the rest move along", () => {
    const b = mount(book(ASKS, BIDS));
    b.next(book(ASKS.slice(1), BIDS));
    b.darkFor(1000);
  });

  it("leaves every row dark when a snapshot repeats the same book", () => {
    const b = mount(book(ASKS, BIDS));
    b.next(book(ASKS, BIDS));
    b.darkFor(1000);
  });

  it("holds each start back by the row's place from the spread", () => {
    const b = mount(book(ASKS, BIDS));
    // Rows 1 and 2 of the bids change together: 400 ms and 200 ms.
    b.next(book(ASKS, [BIDS[0], [49999, 0.5], [49998, 3]]));
    b.after(199);
    expect(b.lit()).toEqual([]);
    b.after(2);
    expect(b.lit()).toEqual(["bid 49998.0"]);
    b.after(200);
    expect(b.lit().sort()).toEqual(["bid 49998.0", "bid 49999.0"]);
    // Row 2 ends at 200 + 800, row 1 at 400 + 800.
    b.after(600);
    expect(b.lit()).toEqual(["bid 49999.0"]);
    b.after(200);
    expect(b.lit()).toEqual([]);
  });

  it("does not restart a highlight that is still running", () => {
    const b = mount(book(ASKS, BIDS));
    b.next(book([[50001, 0.5], ...ASKS.slice(1)], BIDS));
    b.after(500);
    b.next(book([[50001, 0.25], ...ASKS.slice(1)], BIDS));
    b.after(299);
    expect(b.lit()).toEqual(["ask 50001.0"]);
    b.after(2);
    expect(b.lit()).toEqual([]);
    // Over, so the next change starts a new one.
    b.next(book([[50001, 0.1], ...ASKS.slice(1)], BIDS));
    b.after(1);
    expect(b.lit()).toEqual(["ask 50001.0"]);
    // A new overlay, so the rise and fade run again from the start.
    expect(animate).toHaveBeenCalledTimes(2);
    b.after(798);
    expect(b.lit()).toEqual(["ask 50001.0"]);
    b.after(2);
    expect(b.lit()).toEqual([]);
  });

  it("only lights rows it draws", () => {
    const b = mount(book(ASKS, BIDS), { levels: 2 });
    b.next(book([...ASKS.slice(0, 2), [50003, 9]], BIDS));
    b.darkFor(1000);
  });

  it("runs the rise and fade on the element, peaking a fifth of the way through", () => {
    const b = mount(book(ASKS, BIDS));
    b.next(book([[50001, 0.4], ...ASKS.slice(1)], BIDS));
    b.after(1);
    expect(animate).toHaveBeenCalledTimes(1);
    const [frames, timing] = animate.mock.calls[0];
    expect(frames).toEqual([{ opacity: 0 }, { opacity: 1, offset: 0.2 }, { opacity: 0 }]);
    expect(timing).toMatchObject({ duration: 800, fill: "forwards" });
    // Until the animation runs the overlay is invisible: no animation, no tint.
    expect(b.view.container.querySelector<HTMLElement>("[data-book-flash]")!.style.opacity).toBe("0");
  });

  it("draws nothing for a reader who asked for reduced motion", () => {
    reduce = true;
    const b = mount(book(ASKS, BIDS));
    b.next(book([[50001, 0.4], ...ASKS.slice(1)], BIDS));
    b.darkFor(1000);
    expect(animate).not.toHaveBeenCalled();
  });

  it("draws nothing when highlightChanges is off", () => {
    const b = mount(book(ASKS, BIDS), { highlightChanges: false });
    b.next(book([[50001, 0.4], ...ASKS.slice(1)], BIDS));
    b.darkFor(1000);
  });

  it("starts over on a fresh mount, so a caller that keys the widget by market draws no burst", () => {
    const b = mount(book(ASKS, BIDS));
    b.view.unmount();
    const c = mount(book([[60001, 1]], [[60000, 1]]));
    c.darkFor(1000);
  });
});
