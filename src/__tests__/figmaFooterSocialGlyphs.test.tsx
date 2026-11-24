/**
 * The Rewards 1440 footer's three socials (HQ-604): the icon16/discord,
 * icon16/instagram and icon16/twitter frames in nav 5531:77951 on 5531:77640.
 *
 * Three oracles, none of them the constant under test:
 *  - OPENINGS and OFFSETS: each path's opening move and each VECTOR's place in
 *    its 16 frame, as the read lane's hand-offs print them (wave80
 *    lanes/L241/LOG-L241.md, "## Hand-offs", item 2), typed here by hand;
 *  - EXPORTS: each VECTOR's SVG export, pasted whole as the read returned it
 *    (lanes/L241/figma/c3-result.txt, the lines named beside each). Figma's
 *    export ends in a newline, and the length it printed counts it.
 */

import { render } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

import {
  FigmaDiscordIcon,
  FigmaIcon16DiscordIcon,
  FigmaIcon16InstagramIcon,
  FigmaIcon16TwitterIcon,
  FigmaInstagramIcon,
  FigmaXLogoIcon,
} from "../figma-icons";
import * as icons from "../icons";

type Layer = "discord" | "instagram" | "twitterBacking" | "twitterX";

/** LOG-L241.md, the four svg blocks of hand-off item 2. */
const OPENINGS: Record<Layer, string> = {
  discord: "M11.8454 0.886667",
  instagram: "M3.86667 0",
  twitterBacking: "M0 0",
  twitterX: "M11.025 0",
};

/** LOG-L241.md, hand-off item 2: each VECTOR's offset in its icon16 frame. */
const OFFSETS: Record<Layer, [number, number]> = {
  discord: [1, 2.5],
  instagram: [1.5, 1.5],
  twitterBacking: [0, 0],
  twitterX: [1, 1.5],
};

/** The length the result prints before each export ("SVG whole, N chars"). */
const PRINTED: Record<Layer, number> = {
  discord: 1913,
  instagram: 1839,
  twitterBacking: 144,
  twitterX: 302,
};

const EXPORTS: Record<Layer, string> = {
  // c3-result.txt lines 91-93 (5531:77953)
  discord: `<svg width="14" height="11" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.8454 0.886667C10.9588 0.473333 9.99878 0.173333 8.99878 0C8.98119 0.00025047 8.96442 0.00743919 8.95211 0.0200001C8.83211 0.24 8.69211 0.526667 8.59877 0.746667C7.5381 0.586767 6.45945 0.586767 5.39878 0.746667C5.30544 0.52 5.16544 0.24 5.03878 0.0200001C5.03211 0.00666681 5.01211 0 4.99211 0C3.99211 0.173333 3.03878 0.473333 2.14544 0.886667C2.13878 0.886667 2.13211 0.893333 2.12544 0.9C0.312109 3.61333 -0.187891 6.25333 0.0587761 8.86667C0.0587761 8.88 0.0654427 8.89333 0.078776 8.9C1.27878 9.78 2.43211 10.3133 3.57211 10.6667C3.59211 10.6733 3.61211 10.6667 3.61878 10.6533C3.88544 10.2867 4.12544 9.9 4.33211 9.49333C4.34544 9.46667 4.33211 9.44 4.30544 9.43333C3.92544 9.28667 3.56544 9.11333 3.21211 8.91333C3.18544 8.9 3.18544 8.86 3.20544 8.84C3.27878 8.78667 3.35211 8.72667 3.42544 8.67333C3.43878 8.66 3.45878 8.66 3.47211 8.66667C5.76544 9.71333 8.23878 9.71333 10.5054 8.66667C10.5188 8.66 10.5388 8.66 10.5521 8.67333C10.6254 8.73333 10.6988 8.78667 10.7721 8.84667C10.7988 8.86667 10.7988 8.90667 10.7654 8.92C10.4188 9.12667 10.0521 9.29333 9.67211 9.44C9.64544 9.44667 9.63878 9.48 9.64544 9.5C9.85878 9.90667 10.0988 10.2933 10.3588 10.66C10.3788 10.6667 10.3988 10.6733 10.4188 10.6667C11.5654 10.3133 12.7188 9.78 13.9188 8.9C13.9321 8.89333 13.9388 8.88 13.9388 8.86667C14.2321 5.84667 13.4521 3.22667 11.8721 0.9C11.8654 0.893333 11.8588 0.886667 11.8454 0.886667ZM4.67878 7.27333C3.99211 7.27333 3.41878 6.64 3.41878 5.86C3.41878 5.08 3.97878 4.44667 4.67878 4.44667C5.38544 4.44667 5.94544 5.08667 5.93878 5.86C5.93878 6.64 5.37878 7.27333 4.67878 7.27333ZM9.32544 7.27333C8.63878 7.27333 8.06544 6.64 8.06544 5.86C8.06544 5.08 8.62544 4.44667 9.32544 4.44667C10.0321 4.44667 10.5921 5.08667 10.5854 5.86C10.5854 6.64 10.0321 7.27333 9.32544 7.27333Z" fill="white"/>
</svg>
`,
  // c3-result.txt lines 97-99 (5531:77955)
  instagram: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3.86667 0H9.46667C11.6 0 13.3333 1.73333 13.3333 3.86667V9.46667C13.3333 10.4922 12.926 11.4757 12.2008 12.2008C11.4757 12.926 10.4922 13.3333 9.46667 13.3333H3.86667C1.73333 13.3333 0 11.6 0 9.46667V3.86667C0 2.84116 0.40738 1.85766 1.13252 1.13252C1.85766 0.40738 2.84116 0 3.86667 0ZM3.73333 1.33333C3.09681 1.33333 2.48636 1.58619 2.03628 2.03628C1.58619 2.48636 1.33333 3.09681 1.33333 3.73333V9.6C1.33333 10.9267 2.40667 12 3.73333 12H9.6C10.2365 12 10.847 11.7471 11.2971 11.2971C11.7471 10.847 12 10.2365 12 9.6V3.73333C12 2.40667 10.9267 1.33333 9.6 1.33333H3.73333ZM10.1667 2.33333C10.3877 2.33333 10.5996 2.42113 10.7559 2.57741C10.9122 2.73369 11 2.94565 11 3.16667C11 3.38768 10.9122 3.59964 10.7559 3.75592C10.5996 3.9122 10.3877 4 10.1667 4C9.94565 4 9.73369 3.9122 9.57741 3.75592C9.42113 3.59964 9.33333 3.38768 9.33333 3.16667C9.33333 2.94565 9.42113 2.73369 9.57741 2.57741C9.73369 2.42113 9.94565 2.33333 10.1667 2.33333ZM6.66667 3.33333C7.55072 3.33333 8.39857 3.68452 9.02369 4.30964C9.64881 4.93476 10 5.78261 10 6.66667C10 7.55072 9.64881 8.39857 9.02369 9.02369C8.39857 9.64881 7.55072 10 6.66667 10C5.78261 10 4.93476 9.64881 4.30964 9.02369C3.68452 8.39857 3.33333 7.55072 3.33333 6.66667C3.33333 5.78261 3.68452 4.93476 4.30964 4.30964C4.93476 3.68452 5.78261 3.33333 6.66667 3.33333ZM6.66667 4.66667C6.13623 4.66667 5.62753 4.87738 5.25245 5.25245C4.87738 5.62753 4.66667 6.13623 4.66667 6.66667C4.66667 7.1971 4.87738 7.70581 5.25245 8.08088C5.62753 8.45595 6.13623 8.66667 6.66667 8.66667C7.1971 8.66667 7.70581 8.45595 8.08088 8.08088C8.45595 7.70581 8.66667 7.1971 8.66667 6.66667C8.66667 6.13623 8.45595 5.62753 8.08088 5.25245C7.70581 4.87738 7.1971 4.66667 6.66667 4.66667Z" fill="white"/>
</svg>
`,
  // c3-result.txt lines 103-105 (5531:77960, the black square)
  twitterBacking: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 0H16V16H0V0Z" fill="black"/>
</svg>
`,
  // c3-result.txt lines 108-110 (5531:77962, the X)
  twitterX: `<svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.025 0H13.172L8.482 5.374L14 12.688H9.68L6.294 8.253L2.424 12.688H0.275L5.291 6.938L0 0.000999987H4.43L7.486 4.054L11.025 0ZM10.27 11.4H11.46L3.78 1.221H2.504L10.27 11.4Z" fill="white"/>
</svg>
`,
};

/** "M x y" from the start of a path's d. */
function opening(d: string | null): string {
  const m = /^M\s*(-?[\d.]+)[\s,]+(-?[\d.]+)/.exec(d ?? "");
  return m ? `M${m[1]} ${m[2]}` : "";
}

function exportPath(svg: string) {
  const paths = Array.from(svg.matchAll(/<path ([^>]*?)\/>/g)).map(([, attrs]) =>
    Object.fromEntries(
      Array.from(attrs.matchAll(/([\w-]+)="([^"]*)"/g)).map((m) => [m[1], m[2]])
    )
  );
  expect(paths).toHaveLength(1);
  return paths[0] as { d: string; fill?: string; stroke?: string };
}

function renderOne(node: React.ReactElement) {
  const { container } = render(node);
  const svgs = container.querySelectorAll("svg");
  expect(svgs).toHaveLength(1);
  return svgs[0];
}

/** Every number of an absolute path, as x, y pairs (H and V carry one axis). */
function points(d: string) {
  const xs: number[] = [];
  const ys: number[] = [];
  for (const [, c, args] of d.matchAll(/([A-Za-z])([^A-Za-z]*)/g)) {
    expect(c).toBe(c.toUpperCase());
    const n = (args.match(/-?(?:\d+\.?\d*|\.\d+)/g) ?? []).map(Number);
    if (c === "H") xs.push(...n);
    else if (c === "V") ys.push(...n);
    else n.forEach((v, k) => (k % 2 === 0 ? xs : ys).push(v));
  }
  return { xs, ys };
}

const translate = ([x, y]: [number, number]) => `translate(${x} ${y})`;

/** The layer's own checks: the export's path byte for byte, its place, its box. */
function expectLayer(path: SVGPathElement, layer: Layer) {
  expect(EXPORTS[layer].length).toBe(PRINTED[layer]);
  const exported = exportPath(EXPORTS[layer]);
  expect(exported.stroke).toBeUndefined();
  expect(path.getAttribute("d")).toBe(exported.d);
  expect(opening(path.getAttribute("d"))).toBe(OPENINGS[layer]);
  expect(path.hasAttribute("stroke")).toBe(false);

  const [x, y] = OFFSETS[layer];
  if (x === 0 && y === 0) expect(path.hasAttribute("transform")).toBe(false);
  else expect(path.getAttribute("transform")).toBe(translate(OFFSETS[layer]));

  // Every point and handle of the export, moved by the offset, lands in the 16 frame.
  const { xs, ys } = points(exported.d);
  expect(Math.min(...xs) + x).toBeGreaterThanOrEqual(0);
  expect(Math.min(...ys) + y).toBeGreaterThanOrEqual(0);
  expect(Math.max(...xs) + x).toBeLessThanOrEqual(16);
  expect(Math.max(...ys) + y).toBeLessThanOrEqual(16);
}

function expectFrame(svg: SVGSVGElement) {
  expect(svg.getAttribute("viewBox")).toBe("0 0 16 16");
  expect(svg.getAttribute("aria-hidden")).toBe("true");
  expect(svg.getAttribute("fill")).toBe("none");
}

describe.each([
  ["FigmaIcon16DiscordIcon", FigmaIcon16DiscordIcon, "discord"],
  ["FigmaIcon16InstagramIcon", FigmaIcon16InstagramIcon, "instagram"],
] as const)("%s", (name, Icon, layer) => {
  it("draws one path on the 16 frame, painted in currentColor", () => {
    const svg = renderOne(<Icon />);
    expectFrame(svg);
    const paths = svg.querySelectorAll("path");
    expect(paths).toHaveLength(1);
    expect(paths[0].getAttribute("fill")).toBe("currentColor");
    expect(exportPath(EXPORTS[layer]).fill).toBe("white");
  });

  it("draws the export's path byte for byte, at the VECTOR's offset in its frame", () => {
    expectLayer(renderOne(<Icon />).querySelector("path") as SVGPathElement, layer);
  });

  it("lets the caller's props win, and is reachable through the icons barrel", () => {
    const svg = renderOne(<Icon className="size-4 text-white" viewBox="0 0 32 32" />);
    expect(svg.getAttribute("class")).toBe("size-4 text-white");
    expect(svg.getAttribute("viewBox")).toBe("0 0 32 32");
    expect((icons as unknown as Record<string, unknown>)[name]).toBe(Icon);
  });
});

describe("FigmaIcon16TwitterIcon", () => {
  it("draws the board's two layers in its order: the black square, then the X", () => {
    const svg = renderOne(<FigmaIcon16TwitterIcon />);
    expectFrame(svg);
    const [backing, x, ...rest] = Array.from(svg.querySelectorAll("path"));
    expect(rest).toHaveLength(0);
    expectLayer(backing, "twitterBacking");
    expectLayer(x, "twitterX");
  });

  it("keeps the export's black on the square and paints the X in currentColor", () => {
    const [backing, x] = Array.from(
      renderOne(<FigmaIcon16TwitterIcon />).querySelectorAll("path")
    );
    expect(backing.getAttribute("fill")).toBe(exportPath(EXPORTS.twitterBacking).fill);
    expect(backing.getAttribute("fill")).toBe("black");
    expect(backing.hasAttribute("class")).toBe(false);
    expect(x.getAttribute("fill")).toBe("currentColor");
    expect(exportPath(EXPORTS.twitterX).fill).toBe("white");
  });

  it("gives backingClassName to the square alone, and the rest of the props to the svg", () => {
    const svg = renderOne(
      <FigmaIcon16TwitterIcon
        className="size-4 text-white"
        backingClassName="fill-[#001615]"
      />
    );
    expect(svg.getAttribute("class")).toBe("size-4 text-white");
    expect(svg.hasAttribute("backingClassName")).toBe(false);
    expect(svg.hasAttribute("backingclassname")).toBe(false);
    const [backing, x] = Array.from(svg.querySelectorAll("path"));
    expect(backing.getAttribute("class")).toBe("fill-[#001615]");
    expect(x.hasAttribute("class")).toBe(false);
    expect((icons as unknown as Record<string, unknown>).FigmaIcon16TwitterIcon).toBe(
      FigmaIcon16TwitterIcon
    );
  });
});

describe("the older drawings of the same marks stay as they are for their callers", () => {
  const ds = (node: React.ReactElement) =>
    Array.from(renderOne(node).querySelectorAll("path")).map((p) =>
      p.getAttribute("d")
    );

  it("FigmaDiscordIcon, FigmaInstagramIcon and FigmaXLogoIcon draw what they drew, none of them a board export", () => {
    const boardPaths = (Object.keys(EXPORTS) as Layer[]).map(
      (layer) => exportPath(EXPORTS[layer]).d
    );

    const discord = ds(<FigmaDiscordIcon />);
    expect(discord.map(opening)).toEqual(["M13.1 3.4"]);

    const instagram = renderOne(<FigmaInstagramIcon />);
    expect(instagram.querySelectorAll("rect")).toHaveLength(1);
    expect(instagram.querySelectorAll("circle")).toHaveLength(2);
    expect(instagram.querySelectorAll("path")).toHaveLength(0);

    const x = ds(<FigmaXLogoIcon />);
    expect(x.map(opening)).toEqual(["M9.4 6.9"]);

    for (const d of [...discord, ...x]) expect(boardPaths).not.toContain(d);
  });
});
