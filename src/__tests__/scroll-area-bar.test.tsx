/**
 * ScrollArea takes classes for its scrollbar's track and thumb.
 *
 * The notification boards on Home 2 (16057:162715, 16058:164188, 16058:164251
 * and the show-all page's three) draw the list's scrollbar as Frame 1100: an 8
 * wide #001615 track, rounded full, its 4 wide #123F3C thumb inset 2 at the
 * sides and 12 at each end. The bar used to take no class from a caller, so
 * every list drew the default 10-wide transparent track with a full-width
 * thumb. Leaving both props out must keep that default exactly.
 *
 * jsdom lays nothing out, so the viewport is given a height and a taller
 * content, and ResizeObserver reports once on observe: that is all Radix needs
 * to decide the list overflows and draw the thumb.
 */
import { render, waitFor } from "@testing-library/react";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { ScrollArea } from "../components/layout/scroll-area";

const sizes: Array<[string, number]> = [
  ["offsetHeight", 100],
  ["clientHeight", 100],
  ["scrollHeight", 400],
  ["offsetWidth", 200],
  ["clientWidth", 200],
  ["scrollWidth", 200],
];
const saved = new Map<string, PropertyDescriptor | undefined>();
const savedObserver = (globalThis as { ResizeObserver?: unknown }).ResizeObserver;

beforeAll(() => {
  for (const [key, value] of sizes) {
    saved.set(key, Object.getOwnPropertyDescriptor(HTMLElement.prototype, key));
    Object.defineProperty(HTMLElement.prototype, key, { configurable: true, get: () => value });
  }
  (globalThis as { ResizeObserver?: unknown }).ResizeObserver = class {
    constructor(private readonly cb: () => void) {}
    observe() {
      this.cb();
    }
    unobserve() {}
    disconnect() {}
  };
});

afterAll(() => {
  for (const [key] of sizes) {
    const d = saved.get(key);
    if (d) Object.defineProperty(HTMLElement.prototype, key, d);
    else delete (HTMLElement.prototype as unknown as Record<string, unknown>)[key];
  }
  (globalThis as { ResizeObserver?: unknown }).ResizeObserver = savedObserver;
});

const tokens = (el: Element | null | undefined) => new Set((el?.getAttribute("class") ?? "").split(/\s+/).filter(Boolean));

/** Radix measures in an animation frame, so the thumb lands a frame after render. */
async function bar(props: { scrollbarClassName?: string; thumbClassName?: string } = {}) {
  const { container } = render(
    <ScrollArea type="always" className="h-[100px]" {...props}>
      <div style={{ height: 400 }}>rows</div>
    </ScrollArea>,
  );
  const track = container.querySelector('[data-orientation="vertical"]');
  await waitFor(() => expect(track?.firstElementChild).not.toBeNull());
  return { track, thumb: track?.firstElementChild };
}

describe("ScrollArea's scrollbar", () => {
  it("keeps its default track and thumb when no class is passed", async () => {
    const { track, thumb } = await bar();
    expect(track).not.toBeNull();
    expect(thumb).not.toBeNull();
    expect(tokens(track)).toEqual(
      new Set(["flex", "touch-none", "select-none", "transition-colors", "h-full", "w-2.5", "border-l", "border-l-transparent", "p-[1px]"]),
    );
    expect(tokens(thumb)).toEqual(new Set(["relative", "flex-1", "rounded-full", "bg-border"]));
  });

  it("draws the boards' bar from the classes a caller passes", async () => {
    const { track, thumb } = await bar({
      scrollbarClassName: "w-2 border-l-0 rounded-full bg-green-coal-300 px-0.5 py-3",
      thumbClassName: "rounded-md bg-green-coal-100",
    });
    const t = tokens(track);
    for (const c of ["w-2", "border-l-0", "rounded-full", "bg-green-coal-300", "px-0.5", "py-3"]) expect(t).toContain(c);
    // The caller's width and border win over the defaults, not beside them.
    for (const c of ["w-2.5", "border-l"]) expect(t).not.toContain(c);
    const th = tokens(thumb);
    for (const c of ["rounded-md", "bg-green-coal-100", "flex-1"]) expect(th).toContain(c);
    for (const c of ["rounded-full", "bg-border"]) expect(th).not.toContain(c);
  });

  it("sends neither prop on to the root as an attribute", () => {
    const { container } = render(
      <ScrollArea scrollbarClassName="w-2" thumbClassName="bg-green-coal-100">
        <div />
      </ScrollArea>,
    );
    const root = container.firstElementChild;
    expect(root?.getAttribute("scrollbarClassName")).toBeNull();
    expect(root?.getAttribute("thumbClassName")).toBeNull();
    expect(root?.getAttribute("scrollbarclassname")).toBeNull();
  });
});
