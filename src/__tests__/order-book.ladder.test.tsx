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

/**
 * The tablet band, `8846:63552` on 8837-63445 (read live 2026-09-24), 708 wide:
 * "Frame 283" padded 4/16, labels in Manrope 10/12 at y=4 (Figma's
 * Sm/Paragraph 3 300). Price opens at x=16; Size is right-aligned and ends at
 * x=382; Total is right-aligned and ends at x=692. The ladder rows under it
 * (70 / 55 / 70, SPACE_BETWEEN across 676) put the Size cell's right edge at
 * 381.5 and the Total cell's at 692, so the labels stand on the ladder's own
 * columns. The 1440 band draws its own cell model (89 / hug / fill) and keeps it.
 *
 * The 10/12 type is the one thing here the code does not draw: no token carries
 * Sm/Paragraph 3 300 (figma/tokens/DRIFT.md), and 10 against 12 is visible, so
 * the labels stay on `text-xs` and the missing token is reported instead of a
 * raw size being written into the widget.
 */
const SCREEN_AT = { md: 768, lg: 1024 } as const;

/** The token of one family that wins at `width`, unprefixed < md < lg. */
function winning(el: Element, family: RegExp, width: number): string | null {
  let win: string | null = null;
  let rank = -1;
  for (const token of tokens(el)) {
    const m = /^(?:(md|lg):)?(.+)$/.exec(token)!;
    const at = m[1] ? SCREEN_AT[m[1] as "md" | "lg"] : 0;
    if (at > width || !family.test(m[2])) continue;
    const r = m[1] === "lg" ? 2 : m[1] === "md" ? 1 : 0;
    if (r >= rank) {
      win = m[2];
      rank = r;
    }
  }
  return win;
}

const FONT_PX: Record<string, number> = { "text-xs": 12, "text-[10px]": 10 };
const LINE_PX: Record<string, number> = { "leading-3": 12, "leading-4": 16 };
const WIDTH = /^w-/;
const GROW = /^flex-(1|none|auto|initial)$/;

/** A cell's width at `width` in px, or "hug" / "fill" when the flex line decides it. */
function cellWidth(cell: Element, width: number): number | "hug" | "fill" {
  const w = winning(cell, WIDTH, width);
  const grow = winning(cell, GROW, width);
  if (grow === "flex-1") return "fill";
  if (w === null || w === "w-auto") return "hug";
  const px = /^w-\[(\d+)px\]$/.exec(w);
  if (!px) throw new Error(`cannot read ${w}`);
  return Number(px[1]);
}

describe("OrderBook column header at 768 — 8846:63552", () => {
  it("sets the labels on the text-xs token at every width, on a 12 line from md", () => {
    const { header } = ladder();
    const type = (width: number) => ({
      size: FONT_PX[winning(header, /^text-(xs|\[[^\]]+\])$/, width)!],
      line: LINE_PX[winning(header, /^leading-/, width)!],
    });
    // The 12 line is what closes the band on the board's 20.
    expect(type(768)).toEqual({ size: 12, line: 12 });
    expect(type(1023)).toEqual({ size: 12, line: 12 });
    expect(type(1440)).toEqual({ size: 12, line: 16 });
    // 375 has no reading of its own yet and draws what it drew before.
    expect(type(375)).toEqual({ size: 12, line: 16 });
    expect(tokens(header).has("font-sans")).toBe(true);
  });

  it("writes no raw font size on the band or its labels, at any width", () => {
    // Wave 71 rule C: a value no token names is reported, not hard-coded.
    const { header } = ladder();
    for (const el of [header, ...Array.from(header.children)]) {
      const raw = Array.from(tokens(el)).filter((t) =>
        /^(?:(?:sm|md|lg|xl|2xl):)?text-\[\d/.test(t),
      );
      expect(raw, el.textContent ?? "").toEqual([]);
    }
  });

  it("ends the Size label on its cell's edge from md, however long the symbol", () => {
    // 55 is the ladder's Size cell and its right edge (381.5) is where the
    // board ends the label. Measured in Manrope 400 at 12px, -0.48px:
    // "Size (BTC)" 53.1 fits, this widget's default "Size (USDT)" is 60.9 and
    // does not. Truncated it would read "Size (US…"; right-aligned and left to
    // overflow it would start at the cell's left edge and end past 381.5.
    // Packed to its end, the label stays whole and ends on the edge.
    const { header } = ladder();
    const size = header.children[1];
    const at = (width: number) => ({
      display: winning(size, /^(flex|block|inline|inline-block|inline-flex)$/, width),
      justify: winning(size, /^justify-/, width),
      overflow: winning(size, /^(truncate|overflow-(hidden|visible|clip))$/, width),
    });
    expect(size.textContent).toBe("Size (USDT)");
    expect(at(768)).toEqual({
      display: "flex",
      justify: "justify-end",
      overflow: "overflow-visible",
    });
    expect(at(1023)).toEqual(at(768));
    // One line at every width: `truncate` carries the nowrap, and nothing
    // lets the label wrap under the band's 12 line.
    expect(tokens(size).has("truncate")).toBe(true);
    expect(Array.from(tokens(size)).some((t) => /whitespace-(normal|pre-wrap|pre-line)$/.test(t))).toBe(false);
    // 1440 hugs its label, so packing it to the end moves nothing, and it
    // clips again; 375 has not been re-read and keeps the plain truncating
    // cell it drew before.
    expect(cellWidth(size, 1440)).toBe("hug");
    expect(at(1440).overflow).toBe("overflow-hidden");
    expect(at(375)).toEqual({ display: null, justify: null, overflow: "truncate" });
  });

  it("stands the three labels on the ladder's own cells from md", () => {
    const l = ladder();
    const labels = Array.from(l.header.children);
    const cells = l.cells(l.ask);
    expect(labels.map((c) => c.textContent)).toEqual([
      "Price",
      "Size (USDT)",
      "Total (USDT)",
    ]);
    for (const width of [768, 1023]) {
      expect(labels.map((c) => cellWidth(c, width))).toEqual(
        cells.map((c) => cellWidth(c, width)),
      );
    }
    expect(cells.map((c) => cellWidth(c, 768))).toEqual([70, 55, 70]);
    // Both rows spread their cells across the same 16px inset.
    for (const row of [l.header, l.ask]) {
      expect(tokens(row).has("justify-between")).toBe(true);
      expect(tokens(row).has("px-4")).toBe(true);
    }
  });

  it("lands Size and Total where the tablet board ends them, on its 708 panel", () => {
    const { header } = ladder();
    const [price, size, total] = Array.from(header.children).map((c) => cellWidth(c, 768));
    const inner = 708 - 16 - 16;
    const gap = (inner - (price as number) - (size as number) - (total as number)) / 2;
    const sizeRight = 16 + (price as number) + gap + (size as number);
    const totalRight = 16 + inner;
    expect(Math.abs(sizeRight - 382)).toBeLessThanOrEqual(0.5);
    expect(totalRight).toBe(692);
    for (const cell of Array.from(header.children).slice(1)) {
      expect(tokens(cell).has("text-right")).toBe(true);
    }
  });

  it("keeps the 1440 band's own 89 / hug / fill", () => {
    const { header } = ladder();
    for (const width of [375, 1024, 1440]) {
      expect(Array.from(header.children).map((c) => cellWidth(c, width))).toEqual([
        89,
        "hug",
        "fill",
      ]);
    }
  });
});
