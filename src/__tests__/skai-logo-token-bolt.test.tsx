/**
 * SkaiLogo `boltGradient="token"`: the SKAI token chip's bolt on the
 * onboarding quests card (5786:48045 at 1440, 6405:20853 at 768, 6413:21179 at
 * 375), read 2026-10-30.
 *
 * The oracle is the chip's own SVG export (6405:20853, pasted below as Figma
 * returned it). The chip draws the bolt at 25.7 x 28.5 inside a 48 disc; the
 * logo draws the same two paths on its 57.1 x 64 box. The test solves the map
 * between the two spaces from the paths themselves (the first point of each
 * path, in the export and in the render), then carries the export's gradient
 * lines through it and compares them with the ones the logo renders. No
 * constant of the component is read.
 *
 * The default is pinned beside it: the brand gradient, its ids and its lines
 * must stay exactly as they were for every caller that does not ask.
 */

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SkaiLogo } from "../components/branding/skai-logo";

const CHIP_EXPORT = `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="24" cy="24" r="23.8857" fill="#02322F" stroke="black" stroke-width="0.228571"/>
<path d="M21.7131 28.0693L24.4328 25.3496C24.6467 25.1357 24.4957 24.7692 24.1922 24.7692H21.0761C20.5177 24.7692 20.2141 24.118 20.5727 23.6902L31.7314 10.3875C31.917 10.1657 31.7597 9.8291 31.4703 9.8291H26.0357C25.2932 9.8291 24.5823 10.1248 24.06 10.6518L11.5218 23.2639C11.0924 23.6965 11.094 24.3948 11.5234 24.8258L14.2997 27.6021C14.7527 28.0552 15.3678 28.31 16.008 28.31H21.1311C21.3482 28.31 21.5574 28.2235 21.7116 28.0693H21.7131Z" fill="url(#paint0_linear_6405_20853)"/>
<path d="M36.5927 23.2908L33.8165 20.5145C33.3634 20.0615 32.7484 19.8066 32.1082 19.8066H26.985C26.7679 19.8066 26.5587 19.8932 26.4046 20.0473L23.6849 22.767C23.471 22.9809 23.622 23.3474 23.9256 23.3474H27.0416C27.6001 23.3474 27.9036 23.9986 27.545 24.4265L16.3863 37.7275C16.2007 37.9493 16.358 38.2859 16.6474 38.2859H22.0821C22.8245 38.2859 23.5355 37.9902 24.0577 37.4633L36.5943 24.8496C37.0237 24.417 37.0222 23.7186 36.5927 23.2876V23.2908Z" fill="url(#paint1_linear_6405_20853)"/>
<defs>
<linearGradient id="paint0_linear_6405_20853" x1="19.0359" y1="10.4819" x2="28.0522" y2="34.9149" gradientUnits="userSpaceOnUse">
<stop stop-color="#56C7F3"/>
<stop offset="1" stop-color="#00FFCC"/>
</linearGradient>
<linearGradient id="paint1_linear_6405_20853" x1="19.0588" y1="10.4726" x2="28.0751" y2="34.9056" gradientUnits="userSpaceOnUse">
<stop stop-color="#56C7F3"/>
<stop offset="1" stop-color="#17F9B4"/>
</linearGradient>
</defs>
</svg>`;

type Line = { x1: number; y1: number; x2: number; y2: number; from: string; to: string };

function firstPoint(d: string): [number, number] {
  const m = /^M\s*(-?[\d.]+)[\s,]+(-?[\d.]+)/.exec(d.trim());
  if (!m) throw new Error(`no M in ${d.slice(0, 20)}`);
  return [Number(m[1]), Number(m[2])];
}

/** Each path's gradient line and stops, in path order. */
function lines(svg: Element): Line[] {
  return Array.from(svg.getElementsByTagName("path")).map((p) => {
    const ref = /^url\(#(.+)\)$/.exec(p.getAttribute("fill") ?? "");
    if (!ref) throw new Error(`path fill is not a gradient: ${p.getAttribute("fill")}`);
    const g = Array.from(svg.getElementsByTagName("linearGradient")).find((el) => el.getAttribute("id") === ref[1]);
    if (!g) throw new Error(`no gradient ${ref[1]}`);
    const stops = Array.from(g.getElementsByTagName("stop")).map((s) =>
      (s.getAttribute("stop-color") ?? s.getAttribute("stopColor") ?? "").toUpperCase(),
    );
    const n = (a: string) => Number(g.getAttribute(a));
    return { x1: n("x1"), y1: n("y1"), x2: n("x2"), y2: n("y2"), from: stops[0], to: stops[stops.length - 1] };
  });
}

const chip = new DOMParser().parseFromString(CHIP_EXPORT, "image/svg+xml").documentElement;

function renderedBolt(props: Parameters<typeof SkaiLogo>[0]) {
  const { container } = render(<SkaiLogo {...props} />);
  return container.querySelector("svg")!;
}

describe("SkaiLogo boltGradient=token (the SKAI token chip, 6405:20853)", () => {
  it("paints the upper vector Sky Blue into #00FFCC and the lower Sky Blue into #17F9B4", () => {
    const want = lines(chip).map(({ from, to }) => ({ from, to }));
    expect(want).toEqual([
      { from: "#56C7F3", to: "#00FFCC" },
      { from: "#56C7F3", to: "#17F9B4" },
    ]);
    const got = lines(renderedBolt({ iconOnly: true, size: "compact", variant: "white", boltGradient: "token" }));
    expect(got.map(({ from, to }) => ({ from, to }))).toEqual(want);
  });

  it("lays both gradients on the chip's own lines, carried into the logo's box", () => {
    const svg = renderedBolt({ iconOnly: true, size: "compact", variant: "white", boltGradient: "token" });
    // The map chip -> logo, solved from the paths' first points (one per axis pair).
    const chipPaths = Array.from(chip.getElementsByTagName("path")).map((p) => firstPoint(p.getAttribute("d")!));
    const logoPaths = Array.from(svg.querySelectorAll("path")).map((p) => firstPoint(p.getAttribute("d")!));
    const sx = (logoPaths[1][0] - logoPaths[0][0]) / (chipPaths[1][0] - chipPaths[0][0]);
    const sy = (logoPaths[1][1] - logoPaths[0][1]) / (chipPaths[1][1] - chipPaths[0][1]);
    const to = ([x, y]: [number, number]): [number, number] => [
      logoPaths[0][0] + (x - chipPaths[0][0]) * sx,
      logoPaths[0][1] + (y - chipPaths[0][1]) * sy,
    ];
    const want = lines(chip);
    const got = lines(svg);
    want.forEach((w, i) => {
      const [x1, y1] = to([w.x1, w.y1]);
      const [x2, y2] = to([w.x2, w.y2]);
      // Within 0.1 of a 64 box: the two axes' scales differ by 0.0005.
      expect(Math.abs(got[i].x1 - x1), `x1 of ${i}`).toBeLessThan(0.1);
      expect(Math.abs(got[i].y1 - y1), `y1 of ${i}`).toBeLessThan(0.1);
      expect(Math.abs(got[i].x2 - x2), `x2 of ${i}`).toBeLessThan(0.1);
      expect(Math.abs(got[i].y2 - y2), `y2 of ${i}`).toBeLessThan(0.1);
    });
  });

  it("gives each mount gradient ids of its own", () => {
    const { container } = render(
      <>
        <SkaiLogo iconOnly variant="white" boltGradient="token" />
        <SkaiLogo iconOnly variant="white" boltGradient="token" />
      </>,
    );
    const ids = Array.from(container.querySelectorAll("linearGradient")).map((g) => g.getAttribute("id"));
    expect(ids).toHaveLength(4);
    expect(new Set(ids).size).toBe(4);
    for (const id of ids) expect(id).not.toMatch(/^skai-icon-grad-/);
  });

  it("draws the same token bolt beside the full wordmark", () => {
    // The lockup's first svg is the bolt; the wordmark follows it.
    const got = lines(renderedBolt({ size: "medium", variant: "white", boltGradient: "token" }));
    expect(got.map((l) => l.to)).toEqual(["#00FFCC", "#17F9B4"]);
  });

  it("changes nothing where the bolt is not a gradient", () => {
    for (const props of [
      { iconOnly: true, variant: "black" as const, boltGradient: "token" as const },
      { iconOnly: true, variant: "white" as const, monochrome: true, boltGradient: "token" as const },
      { iconOnly: true, wordmark: "short" as const, boltGradient: "token" as const },
    ]) {
      const { container, unmount } = render(<SkaiLogo {...props} />);
      expect(container.querySelectorAll("linearGradient"), JSON.stringify(props)).toHaveLength(0);
      unmount();
    }
  });
});

describe("SkaiLogo default bolt is untouched", () => {
  it("keeps the brand gradient, its fixed ids and its lines when no gradient is named", () => {
    const svg = renderedBolt({ iconOnly: true, size: "compact", variant: "white" });
    const fills = Array.from(svg.querySelectorAll("path")).map((p) => p.getAttribute("fill"));
    expect(fills).toEqual(["url(#skai-icon-grad-0)", "url(#skai-icon-grad-1)"]);
    expect(lines(svg)).toEqual([
      { x1: 0, y1: 0, x2: 46, y2: 64, from: "#56C7F3", to: "#17F9B4" },
      { x1: 11, y1: 22, x2: 57, y2: 64, from: "#56C7F3", to: "#17F9B4" },
    ]);
    const named = renderedBolt({ iconOnly: true, size: "compact", variant: "white", boltGradient: "brand" });
    expect(named.outerHTML).toBe(svg.outerHTML);
  });

  it("passes no boltGradient attribute through to the wrapper", () => {
    const { container } = render(<SkaiLogo iconOnly variant="white" boltGradient="token" />);
    expect(container.firstElementChild?.getAttribute("boltGradient")).toBeNull();
    expect(container.firstElementChild?.getAttribute("boltgradient")).toBeNull();
  });
});
