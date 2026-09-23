/**
 * OrderBook at 1440 — the heading band and the two halves of the ladder.
 *
 * The /spot boards draw the ladder body the same way on all three 1440 cuts:
 * `7732:32533` (4144-64244) and `7710:92614` (7710-91527), read live
 * 2026-09-21, and 8558-134024, read whole the same day. A 20 quote row, then
 * `sells` 294 — the 24 band (`7732:32546` / `7710:92627`) over fifteen 18px
 * asks — then the 20 Spread row at y=314, then sixteen 18px bids, 288.
 *
 * jsdom lays nothing out, so this reads each rendered element's class list the
 * way the stylesheet resolves it at a given viewport width, then runs the
 * column flex distribution over what it found. The figures it is held to are
 * the board's; everything held to them comes off the rendered DOM.
 *
 * A class that can move a height and that the resolver does not understand
 * THROWS rather than counting as nothing. Summing a class list while a floor
 * sat unread underneath it has shipped an overshoot before.
 *
 * @module __tests__/order-book.split.test
 */

import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import {
  OrderBook,
  type OrderBookData,
} from "../components/trading/order-book";
import { breakpoints } from "../lib/tokens";

/** The 1440 ladder body, off the boards named above. */
const BOARD = {
  band: 24,
  bandLabelTop: 4,
  asks: 270,
  spread: 20,
  bids: 288,
  row: 18,
} as const;

/** What the band drew at every width before the 1440 cut was built. */
const BAND_BEFORE = { box: 26, labelTop: 5 } as const;

// ─── the resolver ──────────────────────────────────────────────────────────

type Screen = "sm" | "md" | "lg" | "xl" | "2xl";
const SCREENS: readonly Screen[] = ["sm", "md", "lg", "xl", "2xl"];

type Prop =
  | "pt"
  | "pb"
  | "bt"
  | "bb"
  | "lh"
  | "h"
  | "minH"
  | "grow"
  | "shrink"
  | "basis"
  | "overflowY"
  | "position";

type Value = number | string;

interface Decl {
  prop: Prop;
  value: Value;
  /** Tailwind's plugin order inside one screen: `p` < `py` < `pt`. */
  rank: number;
}

interface Placed extends Decl {
  screen: number;
  token: string;
}

type Box = Partial<Record<Prop, Value>>;

/** 0 for unprefixed, then sm..2xl in the order the stylesheet emits them. */
function screenIndex(screen: Screen | null): number {
  return screen === null ? 0 : SCREENS.indexOf(screen) + 1;
}

/** The px a screen starts at, off the preset's own breakpoint table. */
function screenStart(index: number): number {
  return index === 0 ? 0 : parseInt(breakpoints[SCREENS[index - 1]], 10);
}

function spacing(v: string, token: string): number {
  if (v === "px") return 1;
  if (/^\d+(\.\d+)?$/.test(v)) return Number(v) * 4;
  const arb = /^\[(\d+(?:\.\d+)?)px\]$/.exec(v);
  if (arb) return Number(arb[1]);
  throw new Error(`cannot read "${v}" in ${token}`);
}

function borderWidth(v: string | undefined, token: string): number {
  if (v === undefined) return 1;
  if (/^(0|2|4|8)$/.test(v)) return Number(v);
  const arb = /^\[(\d+(?:\.\d+)?)px\]$/.exec(v);
  if (arb) return Number(arb[1]);
  throw new Error(`cannot read border width "${v}" in ${token}`);
}

function basis(v: string, token: string): string {
  if (v === "auto") return "auto";
  if (/^\d+(\.\d+)?%$/.test(v)) return v;
  if (/^\d+(\.\d+)?px$/.test(v)) return v;
  if (v === "0") return "0px";
  throw new Error(`cannot read flex basis "${v}" in ${token}`);
}

const FLEX_KEYWORDS: Record<string, readonly [number, number, string]> = {
  "1": [1, 1, "0%"],
  auto: [1, 1, "auto"],
  initial: [0, 1, "auto"],
  none: [0, 0, "auto"],
};

/** Tokens that cannot move a height. Anything neither here nor sized THROWS. */
const INERT: readonly RegExp[] = [
  /^(flex|inline-flex)$/,
  /^flex-(row|row-reverse|col|col-reverse|wrap|nowrap)$/,
  /^(items|justify|self|content|place)-/,
  /^(w|min-w|max-w)-/,
  /^-?(px|pl|pr|ps|pe|mx|ml|mr|ms|me)-/,
  /^(font|tracking|bg|backdrop|rounded|shadow|opacity|z|scrollbar|whitespace|break|cursor|select|transition|duration|ease|delay|animate|pointer-events|outline|ring)(-|$)/,
  /^(tabular-nums|truncate|uppercase|lowercase|capitalize|italic|antialiased)$/,
  // Colour, alignment and size. The line box is taken from `leading-*` alone,
  // and an element with no `leading-*` is refused below.
  /^text-/,
  /^overflow-x-/,
  /^(top|bottom|left|right|inset|inset-x|inset-y)-/,
  /^-?translate-[xy]-/,
  /^(gap-x|space-x)-/,
];

function sizing(base: string, token: string): Decl[] | null {
  let m: RegExpExecArray | null;
  if ((m = /^p-(.+)$/.exec(base))) {
    const v = spacing(m[1], token);
    return [
      { prop: "pt", value: v, rank: 0 },
      { prop: "pb", value: v, rank: 0 },
    ];
  }
  if ((m = /^py-(.+)$/.exec(base))) {
    const v = spacing(m[1], token);
    return [
      { prop: "pt", value: v, rank: 1 },
      { prop: "pb", value: v, rank: 1 },
    ];
  }
  if ((m = /^pt-(.+)$/.exec(base)))
    return [{ prop: "pt", value: spacing(m[1], token), rank: 2 }];
  if ((m = /^pb-(.+)$/.exec(base)))
    return [{ prop: "pb", value: spacing(m[1], token), rank: 2 }];

  if ((m = /^border(?:-([xytblrse]))?(?:-(0|2|4|8|\[[^\]]+\]))?$/.exec(base))) {
    const w = borderWidth(m[2], token);
    switch (m[1]) {
      case undefined:
        return [
          { prop: "bt", value: w, rank: 0 },
          { prop: "bb", value: w, rank: 0 },
        ];
      case "y":
        return [
          { prop: "bt", value: w, rank: 1 },
          { prop: "bb", value: w, rank: 1 },
        ];
      case "t":
        return [{ prop: "bt", value: w, rank: 2 }];
      case "b":
        return [{ prop: "bb", value: w, rank: 2 }];
      default:
        return []; // a side rule on x, l, r, s or e moves no height
    }
  }
  // `border-border`, `border-transparent`, `border-dashed`: colour or style.
  if (/^border-/.test(base)) return [];

  if ((m = /^leading-(.+)$/.exec(base))) {
    if (/^(3|4|5|6|7|8|9|10)$/.test(m[1]))
      return [{ prop: "lh", value: Number(m[1]) * 4, rank: 0 }];
    const arb = /^\[(\d+(?:\.\d+)?)px\]$/.exec(m[1]);
    if (arb) return [{ prop: "lh", value: Number(arb[1]), rank: 0 }];
    throw new Error(`relative line height ${token} is not modelled`);
  }
  if ((m = /^h-(.+)$/.exec(base))) {
    if (m[1] === "auto") return [];
    return [{ prop: "h", value: spacing(m[1], token), rank: 0 }];
  }
  if ((m = /^min-h-(.+)$/.exec(base))) {
    if (m[1] === "min" || m[1] === "max" || m[1] === "fit")
      return [{ prop: "minH", value: "content", rank: 0 }];
    return [{ prop: "minH", value: spacing(m[1], token), rank: 0 }];
  }
  if (/^max-h-/.test(base)) throw new Error(`${token} is not modelled`);

  if ((m = /^flex-(1|auto|initial|none)$/.exec(base))) {
    const [g, s, b] = FLEX_KEYWORDS[m[1]];
    return [
      { prop: "grow", value: g, rank: 0 },
      { prop: "shrink", value: s, rank: 0 },
      { prop: "basis", value: b, rank: 0 },
    ];
  }
  if ((m = /^flex-\[([^\]]+)\]$/.exec(base))) {
    const parts = m[1].split("_");
    if (parts.length !== 3) throw new Error(`${token} is not grow_shrink_basis`);
    return [
      { prop: "grow", value: Number(parts[0]), rank: 0 },
      { prop: "shrink", value: Number(parts[1]), rank: 0 },
      { prop: "basis", value: basis(parts[2], token), rank: 0 },
    ];
  }
  if ((m = /^grow(?:-(0|\[\d+(?:\.\d+)?\]))?$/.exec(base)))
    return [
      {
        prop: "grow",
        value: m[1] === undefined ? 1 : Number(m[1].replace(/[[\]]/g, "")),
        rank: 1,
      },
    ];
  if ((m = /^shrink(?:-(0|\[\d+(?:\.\d+)?\]))?$/.exec(base)))
    return [
      {
        prop: "shrink",
        value: m[1] === undefined ? 1 : Number(m[1].replace(/[[\]]/g, "")),
        rank: 1,
      },
    ];
  if ((m = /^basis-\[([^\]]+)\]$/.exec(base)))
    return [{ prop: "basis", value: basis(m[1], token), rank: 2 }];
  if (/^basis-/.test(base)) throw new Error(`${token} is not modelled`);

  if ((m = /^overflow-(hidden|auto|scroll|visible|clip)$/.exec(base)))
    return [{ prop: "overflowY", value: m[1], rank: 0 }];
  if ((m = /^overflow-y-(hidden|auto|scroll|visible|clip)$/.exec(base)))
    return [{ prop: "overflowY", value: m[1], rank: 1 }];
  if ((m = /^(relative|absolute|fixed|sticky|static)$/.exec(base)))
    return [{ prop: "position", value: m[1], rank: 0 }];

  if (/^(hidden|block|inline|inline-block|contents|grid|table|sr-only)$/.test(base))
    throw new Error(`${token} changes the box itself; not modelled`);
  if (
    /^-?(m|my|mt|mb)-/.test(base) ||
    /^(gap|gap-y|space-y|divide-y|aspect|line-clamp)(-|$)/.test(base)
  )
    throw new Error(`${token} moves a height; not modelled`);
  return null;
}

/** `lg:py-[3px]` → ["lg", "py-[3px]"], without splitting inside brackets. */
function splitVariants(token: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let cur = "";
  for (const ch of token) {
    if (ch === "[") depth += 1;
    if (ch === "]") depth -= 1;
    if (ch === ":" && depth === 0) {
      out.push(cur);
      cur = "";
    } else cur += ch;
  }
  out.push(cur);
  return out;
}

function parse(token: string): Placed[] {
  const parts = splitVariants(token);
  const base = parts[parts.length - 1];
  let screen: Screen | null = null;
  const states: string[] = [];
  for (const v of parts.slice(0, -1)) {
    if ((SCREENS as readonly string[]).includes(v)) screen = v as Screen;
    else states.push(v);
  }
  const decls = sizing(base, token);
  if (decls === null) {
    if (INERT.some((re) => re.test(base))) return [];
    throw new Error(`unknown class ${token}: cannot tell whether it moves a height`);
  }
  if (states.length > 0) {
    if (decls.length > 0)
      throw new Error(`${token} sizes under a state variant; not modelled`);
    return [];
  }
  return decls.map((d) => ({ ...d, screen: screenIndex(screen), token }));
}

/** The declarations that win at `width`, the way the stylesheet orders them. */
function resolve(el: Element, width: number): Box {
  const tokens = el.getAttribute("class")?.split(/\s+/).filter(Boolean) ?? [];
  const winners = new Map<Prop, Placed>();
  for (const d of tokens.flatMap(parse)) {
    if (screenStart(d.screen) > width) continue;
    const cur = winners.get(d.prop);
    if (!cur || d.screen > cur.screen || (d.screen === cur.screen && d.rank > cur.rank)) {
      winners.set(d.prop, d);
    } else if (d.screen === cur.screen && d.rank === cur.rank && d.value !== cur.value) {
      throw new Error(
        `${cur.token} and ${d.token} both set ${d.prop} at one screen; only the stylesheet's order could say which wins`,
      );
    }
  }
  const out: Box = {};
  winners.forEach((d, prop) => {
    out[prop] = d.value;
  });
  return out;
}

const n = (v: Value | undefined): number => (typeof v === "number" ? v : 0);
const outOfFlow = (b: Box) => b.position === "absolute" || b.position === "fixed";
const name = (el: Element) =>
  el.getAttribute("aria-label") ?? el.getAttribute("role") ?? el.tagName;

/** Border box of an element whose content is one line of text. */
function lineBox(el: Element, width: number): { box: number; contentTop: number } {
  const b = resolve(el, width);
  if (typeof b.lh !== "number")
    throw new Error(`${name(el)} sets no leading-*; its line would come from the preset`);
  for (const child of Array.from(el.children)) {
    const c = resolve(child, width);
    if (outOfFlow(c)) continue;
    for (const p of ["pt", "pb", "bt", "bb", "h", "minH"] as const) {
      if (c[p] !== undefined && c[p] !== 0)
        throw new Error(`a child of ${name(el)} sizes itself (${p}); not modelled`);
    }
    if (c.lh !== undefined && c.lh !== b.lh)
      throw new Error(`a child of ${name(el)} sets its own line; not modelled`);
  }
  const contentTop = n(b.bt) + n(b.pt);
  let box = contentTop + b.lh + n(b.pb) + n(b.bb);
  if (typeof b.h === "number") box = b.h;
  if (typeof b.minH === "number") box = Math.max(box, b.minH);
  return { box, contentTop };
}

/** What a rowgroup's rows stand to, stacked, row by row. */
function rowsHeight(group: Element, width: number): number {
  resolve(group, width); // refuses a gap or a space-y on the group itself
  let sum = 0;
  for (const row of Array.from(group.children)) {
    if (outOfFlow(resolve(row, width))) continue;
    sum += lineBox(row, width).box;
  }
  return sum;
}

interface Item {
  el: Element;
  grow: number;
  base: number;
  min: number;
  content: number;
}

/**
 * The column flex distribution over EVERY child of `container`. A definite
 * `size` is flexed into; "indefinite" is a parent nobody stands to a height,
 * where a percentage basis falls back to the content.
 */
function distribute(
  container: Element,
  width: number,
  size: number | "indefinite",
): Map<Element, number> {
  resolve(container, width);
  const items: Item[] = Array.from(container.children).map((el) => {
    const b = resolve(el, width);
    if (outOfFlow(b)) throw new Error(`${name(el)} is out of flow; not modelled`);
    if (b.h !== undefined) throw new Error(`${name(el)} sets a height; not modelled`);
    const content =
      el.getAttribute("role") === "rowgroup" ? rowsHeight(el, width) : lineBox(el, width).box;
    const basisValue = String(b.basis ?? "auto");
    let base: number;
    if (basisValue === "auto") base = content;
    else if (basisValue.endsWith("%"))
      base = size === "indefinite" ? content : (parseFloat(basisValue) / 100) * size;
    else base = parseFloat(basisValue);
    // min-height: auto is the content, except on a scroll container, where it is 0.
    const scrolls = b.overflowY !== undefined && b.overflowY !== "visible";
    const min =
      typeof b.minH === "number"
        ? b.minH
        : b.minH === "content"
          ? content
          : scrolls
            ? 0
            : content;
    return { el, grow: n(b.grow ?? 0), base, min, content };
  });

  const out = new Map<Element, number>();
  if (size === "indefinite") {
    for (const it of items) out.set(it.el, Math.max(it.base, it.min));
    return out;
  }

  const hypothetical = items.reduce((s, it) => s + Math.max(it.base, it.min), 0);
  if (hypothetical > size) throw new Error("shrinking is not modelled");

  const frozen = new Map<Item, number>();
  for (const it of items) if (it.grow === 0) frozen.set(it, Math.max(it.base, it.min));
  for (;;) {
    const open = items.filter((it) => !frozen.has(it));
    if (open.length === 0) break;
    const used = [...frozen.values()].reduce((s, v) => s + v, 0);
    const free = size - used - open.reduce((s, it) => s + it.base, 0);
    const growSum = open.reduce((s, it) => s + it.grow, 0);
    const target = open.map((it) => it.base + (free * it.grow) / growSum);
    const clamped = open.map((it, i) => Math.max(target[i], it.min));
    const violation = clamped.reduce((s, c, i) => s + (c - target[i]), 0);
    if (violation <= 1e-9) {
      open.forEach((it, i) => frozen.set(it, clamped[i]));
      break;
    }
    open.forEach((it, i) => {
      if (clamped[i] > target[i]) frozen.set(it, clamped[i]);
    });
  }
  frozen.forEach((v, it) => out.set(it.el, v));
  return out;
}

// ─── fixtures ──────────────────────────────────────────────────────────────

function book(asks: number, bids: number): OrderBookData {
  const side = (count: number, from: number, step: number, id: string) =>
    Array.from({ length: count }, (_, i) => ({
      id: `${id}${i}`,
      price: from + i * step,
      size: 0.1,
      total: 0.1 * (i + 1),
    }));
  return {
    asks: side(asks, 121725, 5, "a"),
    bids: side(bids, 121700, -5, "b"),
    spread: 25,
    spreadPercent: 0.0205,
    lastUpdate: 0,
  };
}

function mount(data: OrderBookData, levels?: number) {
  const { container } = render(<OrderBook data={data} levels={levels} />);
  const groups = Array.from(container.querySelectorAll('[role="rowgroup"]'));
  const labels = groups.map((g) => g.getAttribute("aria-label")).sort();
  // The population, not a count: a third group, or a renamed one, fails here.
  expect(labels).toEqual(["Ask orders", "Bid orders"]);
  const asks = groups.find((g) => g.getAttribute("aria-label") === "Ask orders")!;
  const bids = groups.find((g) => g.getAttribute("aria-label") === "Bid orders")!;
  const levelsBox = asks.parentElement!;
  expect(bids.parentElement).toBe(levelsBox);
  const spread = Array.from(levelsBox.children).find(
    (el) => el.getAttribute("role") !== "rowgroup",
  )!;
  const band = container.querySelector('[role="table"] > [role="row"]')!;
  return { container, groups, asks, bids, spread, levelsBox, band };
}

const expectedHalf = (label: string | null) =>
  label === "Ask orders" ? BOARD.asks : BOARD.bids;

/** The board's budget for the spread and the two halves: 20 + 270 + 288. */
const BOARD_LEVELS = BOARD.spread + BOARD.asks + BOARD.bids;

// ─── the oracle ────────────────────────────────────────────────────────────

describe("OrderBook heading band — 4144-64244 / 7710-91527 / 8558-134024", () => {
  it("closes on the board's 24 at 1440, with the labels at y=4", () => {
    const { band } = mount(book(1, 1));
    const { box, contentTop } = lineBox(band, 1440);
    expect(box).toBe(BOARD.band);
    // Decided on the edge child, not the box: the labels hang from the top.
    expect(contentTop).toBe(BOARD.bandLabelTop);
  });

  it("starts at lg, the band the /spot desktop column is drawn in", () => {
    const { band } = mount(book(1, 1));
    expect(lineBox(band, 1024).box).toBe(BOARD.band);
    expect(lineBox(band, 1023).box).toBe(BAND_BEFORE.box);
  });

  it("draws what it drew before at 375 and 768", () => {
    const { band } = mount(book(1, 1));
    for (const width of [375, 768]) {
      expect(lineBox(band, width)).toEqual({
        box: BAND_BEFORE.box,
        contentTop: BAND_BEFORE.labelTop,
      });
    }
  });

  it("keeps its rule on both edges at every width", () => {
    const { band } = mount(book(1, 1));
    for (const width of [375, 768, 1440]) {
      const b = resolve(band, width);
      expect([b.bt, b.bb]).toEqual([1, 1]);
    }
  });
});

describe("OrderBook ladder halves — the 270 / 288 split", () => {
  it("gives the board's budget 270 to the asks and 288 to the bids at 1440, counting every child", () => {
    const { groups, spread, levelsBox } = mount(book(20, 20), 15);
    const sizes = distribute(levelsBox, 1440, BOARD_LEVELS);
    for (const g of groups) {
      expect(sizes.get(g)).toBeCloseTo(expectedHalf(g.getAttribute("aria-label")), 9);
    }
    expect(sizes.get(spread)).toBe(BOARD.spread);
    const total = [...sizes.values()].reduce((s, v) => s + v, 0);
    expect(total).toBeCloseTo(BOARD_LEVELS, 9);
    expect(sizes.size).toBe(levelsBox.children.length);
  });

  it("keeps fifteen asks whole, and nothing scrolling, on every budget the page can hand it", () => {
    const { groups, levelsBox } = mount(book(20, 20), 15);
    // From the smallest budget fifteen a side fit in (270 + 20 + 270) up past
    // the board's, one pixel at a time. /spot hands over less than the board:
    // its panel and the widget root each keep a 1px border inside the 622,
    // which on the row's 672 floor leaves 572 here.
    for (let budget = 560; budget <= 700; budget += 1) {
      const sizes = distribute(levelsBox, 1440, budget);
      for (const g of groups) {
        expect(rowsHeight(g, 1440)).toBeLessThanOrEqual(sizes.get(g)! + 1e-9);
      }
      const total = [...sizes.values()].reduce((s, v) => s + v, 0);
      expect(total).toBeCloseTo(budget, 9);
    }
    const tight = distribute(levelsBox, 1440, BOARD_LEVELS - 6);
    const asks = groups.find((g) => g.getAttribute("aria-label") === "Ask orders")!;
    expect(tight.get(asks)).toBe(BOARD.asks);
  });

  it("holds the spread under fifteen ask slots when the book is thin", () => {
    const { groups, levelsBox } = mount(book(5, 3));
    const sizes = distribute(levelsBox, 1440, BOARD_LEVELS);
    for (const g of groups) {
      expect(sizes.get(g)).toBeCloseTo(expectedHalf(g.getAttribute("aria-label")), 9);
    }
  });

  it("still splits evenly below lg", () => {
    const { groups, levelsBox } = mount(book(20, 20), 15);
    for (const width of [375, 768, 1023]) {
      const sizes = distribute(levelsBox, width, BOARD_LEVELS);
      for (const g of groups) {
        expect(sizes.get(g)).toBeCloseTo((BOARD_LEVELS - BOARD.spread) / 2, 9);
      }
    }
  });

  it("leaves a book nobody stands to a height hugging its rows, at every width", () => {
    const { groups, levelsBox } = mount(book(5, 3));
    for (const width of [375, 768, 1024, 1440]) {
      const sizes = distribute(levelsBox, width, "indefinite");
      for (const g of groups) {
        expect(sizes.get(g)).toBe(rowsHeight(g, width));
      }
    }
    expect(rowsHeight(groups[0], 1440) + rowsHeight(groups[1], 1440)).toBe(
      (5 + 3) * BOARD.row,
    );
  });

  it("puts no fixed length on either half at any width", () => {
    const { groups } = mount(book(5, 3));
    for (const width of [375, 768, 1024, 1440, 1536]) {
      for (const g of groups) {
        const b = resolve(g, width);
        expect(String(b.basis ?? "auto")).toMatch(/^(auto|\d+(\.\d+)?%)$/);
        expect(b.h).toBeUndefined();
        expect(b.minH === undefined || b.minH === 0 || b.minH === "content").toBe(true);
      }
    }
  });
});

describe("OrderBook rows either side of the halves", () => {
  it("keeps the Spread row at 20 and unruled at every width — the band is the row the 1440 boards pad", () => {
    const { spread } = mount(book(3, 3));
    for (const width of [375, 768, 1440]) {
      expect(lineBox(spread, width).box).toBe(BOARD.spread);
      const b = resolve(spread, width);
      expect(n(b.bt) + n(b.bb)).toBe(0);
    }
  });

  it("stands every rendered level in the board's 18px slot at every width", () => {
    const { groups } = mount(book(15, 15), 15);
    for (const width of [375, 768, 1440]) {
      for (const g of groups) {
        const rows = Array.from(g.children);
        expect(rows.length).toBeGreaterThan(0);
        for (const row of rows) expect(lineBox(row, width).box).toBe(BOARD.row);
      }
    }
  });
});
