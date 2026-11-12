/**
 * SheetContent's `slideIn={false}`: the panel opens in place.
 *
 * The game info drawer's boards (3sSz 4792-10647, 11097-109504, 11100-73032)
 * draw a panel with no motion, and the Sheet always slid in from its side over
 * 500 ms. Leaving the prop out must give every existing sheet the classes it
 * had: the lists below are the old cva output, word for word, per side.
 */
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Sheet, SheetContent, SheetTitle } from "../components/overlays/sheet";

type Side = "top" | "bottom" | "left" | "right";

const BASE = ["fixed", "z-50", "gap-4", "bg-background", "p-6", "shadow-lg"];
const MOTION = ["transition", "ease-in-out", "data-[state=open]:animate-in", "data-[state=open]:duration-500"];
const SIDE: Record<Side, string[]> = {
  top: ["inset-x-0", "top-0", "border-b"],
  bottom: ["inset-x-0", "bottom-0", "border-t"],
  left: ["inset-y-0", "left-0", "h-full", "w-3/4", "border-r", "md:max-w-sm"],
  right: ["inset-y-0", "right-0", "h-full", "w-3/4", "border-l", "md:max-w-sm"],
};
const SLIDE = (side: Side) => [`data-[state=closed]:slide-out-to-${side}`, `data-[state=open]:slide-in-from-${side}`];

function panel(side: Side, slideIn?: boolean): Set<string> {
  const { getByRole } = render(
    <Sheet defaultOpen>
      <SheetContent side={side} {...(slideIn === undefined ? {} : { slideIn })}>
        <SheetTitle>Panel</SheetTitle>
      </SheetContent>
    </Sheet>,
  );
  return new Set((getByRole("dialog").getAttribute("class") ?? "").split(/\s+/).filter(Boolean));
}

const sides: Side[] = ["top", "bottom", "left", "right"];

describe("SheetContent slideIn", () => {
  it.each(sides)("side=%s keeps the classes it always had when slideIn is left out", (side) => {
    expect(panel(side)).toEqual(new Set([...BASE, ...MOTION, ...SIDE[side], ...SLIDE(side)]));
  });

  it.each(sides)("side=%s with slideIn left true is the same as leaving it out", (side) => {
    expect(panel(side, true)).toEqual(panel(side));
  });

  it.each(sides)("side=%s with slideIn={false} drops the slide and the transition, nothing else", (side) => {
    expect(panel(side, false)).toEqual(new Set([...BASE, ...SIDE[side]]));
  });

  it("does not hand slideIn to the dialog element", () => {
    const { getByRole } = render(
      <Sheet defaultOpen>
        <SheetContent slideIn={false}>
          <SheetTitle>Panel</SheetTitle>
        </SheetContent>
      </Sheet>,
    );
    expect(getByRole("dialog").getAttribute("slidein")).toBeNull();
    expect(getByRole("dialog").getAttribute("slideIn")).toBeNull();
  });
});
