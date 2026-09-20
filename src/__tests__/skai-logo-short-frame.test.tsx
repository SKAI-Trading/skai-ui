/**
 * `SkaiLogo wordmark="short"` — the Figma frame is the width.
 *
 * ── The oracle ────────────────────────────────────────────────────────────
 *
 * Figma `logos/skai-short` (3879:38329; read on the streaming stage as the
 * instance 10102:261849) is a 116x48 component whose "Skai logo - white" group
 * measures 115.164 wide:
 *
 *   icon       43.369 x 48      at (0, 0)
 *   logo-text  61.542 x 25.425  at (53.62, 9.36)
 *
 * The short form is drawn in a 32-unit space, so every number above is divided
 * by 1.5 and the frame becomes 77.3333 x 32 with the wordmark at (35.7467,
 * 6.24). This file pins the ratio and that offset.
 *
 * ── What it is guarding against ───────────────────────────────────────────
 *
 * The component shipped a 90x32 wrapper around an 81.028x32 inner box — a
 * width chosen to stop the wordmark reading as "crammed" against whatever came
 * next in a header, rather than measured off any board. At medium it rendered
 * 135x48, 19 wider than the frame, all of it empty space to the right of the
 * "i", and the wordmark sat 4.25 further from the bolt than Figma draws it.
 * Casey retired that width on 2026-09-19.
 *
 * So the assertions are on the geometry, not on a prop: a regression that
 * reintroduces breathing room would keep every existing test green.
 */

import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SkaiLogo, type SkaiLogoSize } from "../components/branding/skai-logo";

/** Figma logos/skai-short: 116 wide at 48 tall. */
const FRAME_RATIO = 116 / 48;

function shortLogo(size: SkaiLogoSize) {
  const { container } = render(<SkaiLogo size={size} variant="white" wordmark="short" />);
  const wrapper = container.firstElementChild as HTMLElement;
  const svg = container.querySelector("svg") as SVGSVGElement;
  return { wrapper, svg };
}

describe("SkaiLogo short form — the 116x48 frame", () => {
  it.each<[SkaiLogoSize, number, number]>([
    ["small", 24, 58],
    ["compact", 32, 77.3333],
    ["medium", 48, 116],
    ["large", 64, 154.6667],
  ])("%s renders the frame ratio: %dpx tall, %fpx wide", (size, height, width) => {
    const { wrapper } = shortLogo(size);

    expect(parseFloat(wrapper.style.height)).toBeCloseTo(height, 4);
    expect(parseFloat(wrapper.style.width)).toBeCloseTo(width, 3);
    // …which is the same thing said twice, on purpose: a wrapper that keeps the
    // height and loses the ratio is exactly the defect.
    expect(parseFloat(wrapper.style.width) / parseFloat(wrapper.style.height)).toBeCloseTo(
      FRAME_RATIO,
      5,
    );
  });

  it("is not the retired 135x48 anti-cram width", () => {
    const { wrapper } = shortLogo("medium");
    expect(parseFloat(wrapper.style.width)).not.toBeCloseTo(135, 1);
  });

  it("draws the SVG at the wrapper's own box — no inner box inset from it", () => {
    const { wrapper, svg } = shortLogo("medium");

    expect(parseFloat(svg.getAttribute("width") ?? "")).toBeCloseTo(
      parseFloat(wrapper.style.width),
      5,
    );
    expect(parseFloat(svg.getAttribute("height") ?? "")).toBeCloseTo(
      parseFloat(wrapper.style.height),
      5,
    );
  });

  it("keeps the 32-unit viewBox at the frame's ratio", () => {
    const { svg } = shortLogo("compact");
    const [minX, minY, w, h] = (svg.getAttribute("viewBox") ?? "")
      .split(/\s+/)
      .map((n) => parseFloat(n));

    expect([minX, minY]).toEqual([0, 0]);
    expect(h).toBe(32);
    // 116 * 32 / 48.
    expect(w).toBeCloseTo(77.3333, 3);
  });

  it("places the wordmark where Figma places it, not centred on the bolt", () => {
    const { svg } = shortLogo("medium");
    const group = svg.querySelector("g") as SVGGElement;
    const [, x, y] = /translate\(([\d.]+)\s+([\d.]+)\)/.exec(
      group.getAttribute("transform") ?? "",
    ) as RegExpExecArray;

    // 53.62 / 1.5 and 9.36 / 1.5.
    expect(parseFloat(x)).toBeCloseTo(35.7467, 3);
    expect(parseFloat(y)).toBeCloseTo(6.24, 3);

    // The negative twin: centring the 16.95-tall wordmark in 32 would put it at
    // 7.525, and that is what the component used to do (7.7).
    expect(parseFloat(y)).not.toBeCloseTo((32 - 16.95) / 2, 1);
  });

  it("leaves the group's right edge on the frame's own 115.164", () => {
    const { svg } = shortLogo("medium");
    const group = svg.querySelector("g") as SVGGElement;
    const [, x] = /translate\(([\d.]+)\s/.exec(group.getAttribute("transform") ?? "") as RegExpExecArray;

    // Wordmark box 41.028 wide in the 32-unit space, so the content ends at
    // 76.775 of 77.3333 — 115.164 of 116 once scaled back up by 1.5.
    expect((parseFloat(x) + 41.028) * 1.5).toBeCloseTo(115.164, 2);
  });
});
