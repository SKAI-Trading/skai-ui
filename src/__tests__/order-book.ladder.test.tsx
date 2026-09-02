/**
 * OrderBook ladder — the measured facts of `/spot` frame `7710:92603`.
 *
 * These are design values, not taste, so they get an oracle of their own rather
 * than riding along in the behavioural suite. Two reports live here:
 *
 *   ee0af2a5  the depth bar must FADE from the price outwards. The frame ramps
 *             it left-to-right; a flat tint pinned to the right edge reads as a
 *             bar growing the wrong way.
 *   1ec7f3d4  price / size / total must carry the frame's type size, tracking
 *             and column widths.
 *
 * Class facts are compared as TOKENS. `className.includes("left-0")` is also
 * true of `-left-0.5` and of a `left-0` that some other utility overrides, and
 * a substring oracle on this file has been vacuous before (skai-ui `9f38df3`).
 *
 * @module __tests__/order-book.ladder.test
 */

import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import {
  OrderBook,
  type OrderBookData,
} from "../components/trading/order-book";

/** One level a side, so "the first bar" is unambiguous. */
const book: OrderBookData = {
  bids: [{ id: "b0", price: 121723, size: 0.5, total: 0.5 }],
  asks: [{ id: "a0", price: 121788, size: 0.25, total: 0.25 }],
  spread: 65,
  spreadPercent: 0.0534,
  lastUpdate: 0,
};

/**
 * Four levels a side, cumulative totals doubling, so the ramp has a RANGE.
 * A one-level book puts every bar at 100% and cannot tell a depth-scaled bar
 * from a hardcoded one — the range is the whole point of this fixture.
 * Both sides stay inside the default `levels` of 12, so the deepest level here
 * is also the deepest one rendered.
 */
const deepBook: OrderBookData = {
  bids: [
    { id: "b0", price: 121723, size: 1, total: 1 },
    { id: "b1", price: 121722, size: 1, total: 2 },
    { id: "b2", price: 121721, size: 2, total: 4 },
    { id: "b3", price: 121720, size: 4, total: 8 },
  ],
  asks: [
    { id: "a0", price: 121788, size: 1, total: 1 },
    { id: "a1", price: 121789, size: 1, total: 2 },
    { id: "a2", price: 121790, size: 2, total: 4 },
    { id: "a3", price: 121791, size: 4, total: 8 },
  ],
  spread: 65,
  spreadPercent: 0.0534,
  lastUpdate: 0,
};

const tokens = (el: Element | null | undefined) =>
  new Set((el?.className ?? "").toString().split(/\s+/).filter(Boolean));

function ladder() {
  const view = render(<OrderBook data={book} />);
  const rows = (label: string) =>
    Array.from(
      view.container
        .querySelector(`[aria-label="${label}"]`)!
        .querySelectorAll<HTMLElement>('[role="row"]'),
    );
  const ask = rows("Ask orders")[0];
  const bid = rows("Bid orders")[0];
  return {
    view,
    ask,
    bid,
    bar: (row: HTMLElement) =>
      row.querySelector<HTMLElement>('[aria-hidden="true"]')!,
    cells: (row: HTMLElement) =>
      Array.from(row.querySelectorAll<HTMLElement>("span")),
    header: view.container.querySelector<HTMLElement>(
      '[role="table"] > [role="row"]',
    )!,
  };
}

/** `to right` from 0.04 to the side's deep stop — whitespace-tolerant. */
const ramp = (r: number, g: number, b: number, endAlpha: string) =>
  new RegExp(
    `^linear-gradient\\(\\s*to right\\s*,\\s*` +
      `rgba\\(\\s*${r}\\s*,\\s*${g}\\s*,\\s*${b}\\s*,\\s*0\\.04\\s*\\)\\s*,\\s*` +
      `rgba\\(\\s*${r}\\s*,\\s*${g}\\s*,\\s*${b}\\s*,\\s*${endAlpha}\\s*\\)\\s*\\)$`,
  );

describe("OrderBook depth bar — report ee0af2a5", () => {
  it("anchors the bar to the left edge and centres it in the row", () => {
    const l = ladder();
    for (const row of [l.ask, l.bid]) {
      const cls = tokens(l.bar(row));
      // The bar grows out of the price, so it is pinned left and never right.
      expect(cls.has("left-0")).toBe(true);
      expect(cls.has("right-0")).toBe(false);
      // 16px of bar centred in the 18px slot — 1px of air top and bottom.
      expect(cls.has("h-4")).toBe(true);
      expect(cls.has("top-1/2")).toBe(true);
      expect(cls.has("-translate-y-1/2")).toBe(true);
      expect(cls.has("inset-y-0")).toBe(false);
    }
  });

  it("fills each side with its frame ramp rather than a flat tint", () => {
    const l = ladder();
    const askFill = l.bar(l.ask).style.backgroundImage;
    const bidFill = l.bar(l.bid).style.backgroundImage;

    // A dropped declaration serialises as "", which every containment check
    // below would pass over in silence.
    expect(askFill).not.toBe("");
    expect(bidFill).not.toBe("");

    expect(askFill).toMatch(ramp(251, 51, 36, "0\\.24"));
    expect(bidFill).toMatch(ramp(23, 249, 180, "0\\.14"));
    // The two sides do not share a ramp — the ask deepens further than the bid.
    expect(askFill).not.toBe(bidFill);
  });

  it("still sizes the bar by cumulative depth", () => {
    const l = ladder();
    expect(l.bar(l.ask).style.width).toBe("100%");
  });

  it("spreads the ramp across the ladder instead of filling every row", () => {
    const view = render(<OrderBook data={deepBook} />);
    const widths = (label: string) =>
      Array.from(
        view.container
          .querySelector(`[aria-label="${label}"]`)!
          .querySelectorAll<HTMLElement>('[aria-hidden="true"]'),
      ).map((bar) => bar.style.width);

    // DOM order is array order on both sides; the ask side is only reversed
    // visually, by flex-col-reverse, so index 0 stays the level at the spread.
    for (const label of ["Ask orders", "Bid orders"]) {
      const w = widths(label);
      expect(w).toEqual(["12.5%", "25%", "50%", "100%"]);
      // Distinctness is the assertion a flat or saturated ladder fails: every
      // bar at 100% is exactly what a book with one dominant level renders.
      expect(new Set(w).size).toBe(4);
    }
  });

  it("draws no bar at all when depth bars are off", () => {
    const { container } = render(<OrderBook data={book} showDepthBars={false} />);
    expect(container.querySelectorAll('[aria-hidden="true"]').length).toBe(0);
  });
});

describe("OrderBook ladder rows — report 1ec7f3d4", () => {
  it("sets the rows in the frame's type, not in mono", () => {
    const l = ladder();
    for (const row of [l.ask, l.bid]) {
      const cls = tokens(row);
      expect(cls.has("font-mulish")).toBe(true);
      expect(cls.has("font-mono")).toBe(false);
      expect(cls.has("text-xs")).toBe(true);
      expect(cls.has("leading-4")).toBe(true);
      expect(cls.has("tracking-[-0.48px]")).toBe(true);
      // 16px of type plus a 1px rule of air each side = the 18px slot.
      expect(cls.has("px-4")).toBe(true);
      expect(cls.has("py-px")).toBe(true);
    }
  });

  it("gives price / size / total the frame's 70-55-70 split", () => {
    const l = ladder();
    for (const row of [l.ask, l.bid]) {
      const [price, size, total] = l.cells(row);
      expect(tokens(price).has("w-[70px]")).toBe(true);
      expect(tokens(size).has("w-[55px]")).toBe(true);
      expect(tokens(total).has("w-[70px]")).toBe(true);
      // Price hangs off the left edge; the two quantities off the right one.
      expect(tokens(price).has("text-left")).toBe(true);
      expect(tokens(size).has("text-right")).toBe(true);
      expect(tokens(total).has("text-right")).toBe(true);
      expect(tokens(size).has("text-center")).toBe(false);
    }
  });

  it("colours the price by side and leaves the quantities white", () => {
    const l = ladder();
    const [askPrice, askSize, askTotal] = l.cells(l.ask);
    const [bidPrice] = l.cells(l.bid);
    expect(tokens(askPrice).has("text-skai-red-300")).toBe(true);
    expect(tokens(bidPrice).has("text-alien-green-bright")).toBe(true);
    expect(tokens(askSize).has("text-white")).toBe(true);
    expect(tokens(askTotal).has("text-white")).toBe(true);
    // The generic semantic pair is a different red and a different green.
    expect(tokens(askPrice).has("text-destructive")).toBe(false);
    expect(tokens(bidPrice).has("text-primary")).toBe(false);
  });
});

describe("OrderBook column header — report 1ec7f3d4", () => {
  it("carries the quote on the two columns denominated in it", () => {
    const { getByText, queryByText } = render(
      <OrderBook data={book} quoteCurrency="USD" />,
    );
    expect(getByText("Price")).toBeInTheDocument();
    expect(getByText("Size (USD)")).toBeInTheDocument();
    expect(getByText("Total (USD)")).toBeInTheDocument();
    expect(queryByText("Price (USD)")).toBeNull();
  });

  it("sets the header in the frame's label style", () => {
    const cls = tokens(ladder().header);
    expect(cls.has("text-ash")).toBe(true);
    expect(cls.has("text-xs")).toBe(true);
    expect(cls.has("leading-4")).toBe(true);
    expect(cls.has("tracking-[-0.48px]")).toBe(true);
    expect(cls.has("font-normal")).toBe(true);
    expect(cls.has("font-medium")).toBe(false);
    expect(cls.has("px-4")).toBe(true);
    expect(cls.has("py-1")).toBe(true);
  });
});
