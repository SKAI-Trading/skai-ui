/**
 * Reports fe67a6ff (1440, node 13006:167970) and 1968bf0c (375, node
 * 13006:314445) — "field icons differ from design". The Slippage / Priority /
 * Bribe rows were drawing a faders glyph, a lightning bolt and a
 * dollar-in-a-circle; the frames draw a figure losing its footing, a fuel pump
 * and a coin stack, and none of the three existed in this package.
 *
 * Two things are pinned here, because getting either wrong reproduces a defect
 * this repo has already shipped once:
 *
 *   1. The glyphs exist and carry the frames' own 12x12 vectors, verbatim from
 *      the SVG exports of those three nodes.
 *   2. They colour from `currentColor`. Figma fills them App/Ash 300 #95A09F,
 *      which is the muted text colour the call site already tints the icon slot
 *      with — not a brand fill. Baking the hex in would make a presentation
 *      attribute outrank the inherited colour, which is exactly why
 *      FigmaSidebarAIBoltIcon printed a blue glyph between two grey ones and
 *      needed `text-current` at every call site to undo it.
 */

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  FigmaCoinStackIcon,
  FigmaGasPumpIcon,
  FigmaSlippageIcon,
} from "../figma-icons";

/** A fragment of each frame's exported path, long enough to be unmistakable. */
const GLYPHS = [
  ["Slippage", FigmaSlippageIcon, "M6.55325 11L5.6483 10.819L6.20801 8.37533"],
  ["Priority", FigmaGasPumpIcon, "M2.18746 2.56252V10.3751H7.18752V2.56252"],
  ["Bribe", FigmaCoinStackIcon, "M6 2.5C7.43386 2.5 8.75583 2.75772"],
] as const;

describe("Trench snipe / trade-config field glyphs", () => {
  it.each(GLYPHS)("draws the %s node's own vector", (_label, Icon, head) => {
    const { container } = render(<Icon />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("viewBox")).toBe("0 0 12 12");
    const drawn = Array.from(svg?.querySelectorAll("path") ?? []).map((p) =>
      p.getAttribute("d"),
    );
    expect(drawn.some((d) => d?.startsWith(head))).toBe(true);
  });

  it.each(GLYPHS)("lets the call site tint %s", (_label, Icon) => {
    const { container } = render(<Icon />);
    for (const el of Array.from(container.querySelectorAll("*"))) {
      for (const attr of ["fill", "stroke"] as const) {
        const value = el.getAttribute(attr);
        if (value && value !== "none") expect(value).toBe("currentColor");
      }
    }
  });
});
