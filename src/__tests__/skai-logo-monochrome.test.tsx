/**
 * `SkaiLogo monochrome` — bug report 0622e026 ("the skai logo is not updated to
 * the grey variant on figma").
 *
 * ── The oracle ────────────────────────────────────────────────────────────
 *
 * Figma `logos/skai` (3562:40435, and the identical node on every Predict card)
 * renders as ONE flat colour. Measured off the Figma export rather than read
 * off the frame tree: every ink pixel in that node is rgb(75,89,88), which is
 * #FFFFFF at the node's 24% opacity over the card's #162524 — i.e. the bolt and
 * the wordmark are the same white. The app drew rgb(45,75,85) for the bolt,
 * which back-solves to #56C7F3 at the same opacity.
 *
 * So the assertion below is on the FILL ATTRIBUTE of the bolt paths, not on a
 * prop name or a class. Report ad78f7e0 already "fixed" this once by swapping a
 * text stand-in for the library logo; its test asserted an <svg> was present and
 * the opacity was 24%, both of which stayed true while the bolt stayed blue.
 * Asserting the colour is the only thing that would have caught it.
 *
 * Every positive is paired with its negative twin: `monochrome` must change the
 * bolt AND the default must keep the brand blue, or a component that hardcoded
 * white everywhere would pass half of this file.
 */

import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SkaiLogo } from "../components/branding/skai-logo";

const SKY_BLUE = "#56C7F3";
const WHITE = "#FFFFFF";
const BLACK = "#001615";

/** Fills of every `<path>` in the logo, in document order. */
function pathFills(container: HTMLElement): string[] {
  return Array.from(container.querySelectorAll("path")).map(
    (p) => p.getAttribute("fill") ?? "",
  );
}

describe("SkaiLogo — brand bolt by default", () => {
  it("short wordmark keeps the Sky Blue bolt beside a white wordmark", () => {
    const { container } = render(
      <SkaiLogo size="small" variant="white" wordmark="short" />,
    );
    const fills = pathFills(container);

    // Two bolt paths in Sky Blue…
    expect(fills.filter((f) => f === SKY_BLUE)).toHaveLength(2);
    // …and the "Skai" letterforms in white. Two-tone: that IS the header lockup.
    expect(fills).toContain(WHITE);
  });

  it("iconOnly short form keeps the Sky Blue bolt", () => {
    const { container } = render(<SkaiLogo iconOnly size="small" wordmark="short" />);
    expect(pathFills(container).filter((f) => f === SKY_BLUE)).toHaveLength(2);
  });

  it("full wordmark keeps the gradient bolt on the white variant", () => {
    const { container } = render(<SkaiLogo size="medium" variant="white" />);
    const fills = pathFills(container);

    expect(fills.some((f) => f.startsWith("url(#skai-icon-grad"))).toBe(true);
    expect(container.querySelector("linearGradient")).not.toBeNull();
  });
});

describe("SkaiLogo monochrome — the Figma watermark", () => {
  it("short wordmark paints the bolt the wordmark's own colour", () => {
    const { container } = render(
      <SkaiLogo size="small" variant="white" wordmark="short" monochrome />,
    );
    const fills = pathFills(container);

    // The defect: no path may still carry the brand blue.
    expect(fills).not.toContain(SKY_BLUE);
    // Flat: every path is the one wordmark colour, bolt included.
    expect(new Set(fills)).toEqual(new Set([WHITE]));
  });

  it("follows `variant` rather than assuming a dark background", () => {
    const { container } = render(
      <SkaiLogo size="small" variant="black" wordmark="short" monochrome />,
    );
    const fills = pathFills(container);

    expect(fills).not.toContain(SKY_BLUE);
    expect(fills).not.toContain(WHITE);
    expect(new Set(fills)).toEqual(new Set([BLACK]));
  });

  it("iconOnly short form goes monochrome too", () => {
    const { container } = render(
      <SkaiLogo iconOnly size="small" wordmark="short" variant="white" monochrome />,
    );
    const fills = pathFills(container);

    expect(fills).not.toContain(SKY_BLUE);
    expect(new Set(fills)).toEqual(new Set([WHITE]));
  });

  it("full wordmark drops the gradient — a gradient is not one colour", () => {
    const { container } = render(<SkaiLogo size="medium" variant="white" monochrome />);
    const fills = pathFills(container);

    expect(fills.some((f) => f.startsWith("url("))).toBe(false);
    // The <defs> block is gone with it, so nothing dangles unreferenced.
    expect(container.querySelector("linearGradient")).toBeNull();
    expect(new Set(fills)).toEqual(new Set([WHITE]));
  });
});
