/**
 * Report 3cb4cd3b — "Trade dropdown icons differ".
 *
 * The Trade dropdown (Figma mhF3BkzlTaGiLzJ7kvpmVc 13006:146207) draws each
 * row's glyph as a 24px `icons/graphical` instance wrapping a 21x21 `icon`
 * boolean-operation at (1.5, 1.5) — a RING with the symbol knocked out of it.
 * The rows shipped `candlesticks` / `crosshair` / `swap` / `measure` / `fast`,
 * which are bare unenclosed line glyphs.
 *
 * ORACLE: the expected `d` strings below are the bytes Figma exported for the
 * five icon instances, pasted verbatim. They are NOT re-derived from
 * skai-icon.tsx — that is the point. If someone edits the registry the
 * assertions go red, which is exactly what a parity test has to do.
 *
 * The "ring" assertions carry the discriminating property on their own: the
 * final case proves the bare glyphs this report was filed against do NOT draw
 * the ring, so `startsWith(RING_PREFIX)` is a real signal rather than something
 * every icon in the set happens to satisfy.
 */
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SkaiIcon, type SkaiIconName } from "./skai-icon";

/**
 * The 21-unit outer circle every `icons/graphical` glyph opens with. Present in
 * all five exports and in none of the bare glyphs the dropdown used before.
 */
const RING_PREFIX = "M10.5 0C16.299";

/** Figma export bytes, per row of 13006:146207. */
const FIGMA_D: Record<string, { node: string; d: string }> = {
  "trade-perps": {
    node: "13006:146209",
    d: "M10.5 0C16.299 0 21 4.70101 21 10.5C21 16.299 16.299 21 10.5 21C4.70101 21 0 16.299 0 10.5C0 4.70101 4.70101 0 10.5 0ZM10.5 1C9.26368 1 8.08335 1.23829 7 1.66797V19.3311C8.08344 19.7608 9.26355 20 10.5 20C15.7467 20 20 15.7467 20 10.5C20 5.25329 15.7467 1 10.5 1ZM6 2.13184C3.02327 3.73595 1 6.88152 1 10.5C1 14.1183 3.02349 17.263 6 18.8672V2.13184Z",
  },
  "trade-spot": {
    node: "13006:146214",
    d: "M10.5 0C16.299 0 21 4.70101 21 10.5C21 16.299 16.299 21 10.5 21C4.70101 21 0 16.299 0 10.5C0 4.70101 4.70101 0 10.5 0ZM10.5 1C5.25329 1 1 5.25329 1 10.5C1 15.7467 5.25329 20 10.5 20C15.7467 20 20 15.7467 20 10.5C20 5.25329 15.7467 1 10.5 1ZM15.5 15.6006L15.8496 15.958C14.4716 17.3088 12.5827 18.1426 10.5 18.1426C8.41731 18.1426 6.52843 17.3088 5.15039 15.958L5.5 15.6006L5.84961 15.2441C7.04833 16.4193 8.68936 17.1426 10.5 17.1426C12.3106 17.1426 13.9517 16.4193 15.1504 15.2441L15.5 15.6006ZM10.5 8C11.8807 8 13 9.11929 13 10.5C13 11.8807 11.8807 13 10.5 13C9.11929 13 8 11.8807 8 10.5C8 9.11929 9.11929 8 10.5 8ZM10.5 9C9.67157 9 9 9.67157 9 10.5C9 11.3284 9.67157 12 10.5 12C11.3284 12 12 11.3284 12 10.5C12 9.67157 11.3284 9 10.5 9ZM10.5 2.85645C12.5828 2.85645 14.4716 3.69114 15.8496 5.04199L15.5 5.39844L15.1504 5.75586C13.9517 4.58081 12.3106 3.85645 10.5 3.85645C8.68941 3.85645 7.04832 4.58081 5.84961 5.75586L5.5 5.39844L5.15039 5.04199C6.52845 3.69114 8.41723 2.85645 10.5 2.85645Z",
  },
  "trade-swaps": {
    node: "13006:146219",
    d: "M10.5 0C16.299 2.308e-07 21 4.70101 21 10.5C21 16.299 16.299 21 10.5 21C4.70101 21 2.53482e-07 16.299 0 10.5C-2.4167e-07 4.70101 4.70101 2.53482e-07 10.5 0ZM10.5 1C9.71454 1 8.95167 1.09666 8.22168 1.27637V15.0703L10.1465 13.1465L10.8535 13.8535L8.0752 16.6309C7.98143 16.7246 7.85429 16.7773 7.72168 16.7773C7.58923 16.7772 7.46183 16.7245 7.36816 16.6309L4.59082 13.8535L5.29785 13.1465L7.22168 15.0703V1.58008C3.59022 2.91516 1 6.40539 1 10.5C1 15.7467 5.25329 20 10.5 20C11.2852 20 12.0476 19.9023 12.7773 19.7227V6.42969L10.8535 8.35352L10.1465 7.64648L12.9238 4.86914L13 4.80664C13.0815 4.75217 13.1778 4.72272 13.2773 4.72266C13.41 4.72266 13.5371 4.77537 13.6309 4.86914L16.4092 7.64648L15.7021 8.35352L13.7773 6.42871V19.4189C17.4091 18.084 20 14.5948 20 10.5C20 5.2533 15.7467 1 10.5 1Z",
  },
  "trade-trench": {
    node: "13006:146224",
    d: "M10.5 0C16.299 2.308e-07 21 4.70101 21 10.5C21 16.299 16.299 21 10.5 21C4.70101 21 2.53482e-07 16.299 0 10.5C-2.4167e-07 4.70101 4.70101 2.53482e-07 10.5 0ZM1.01367 11C1.2737 16.0143 5.42103 20 10.5 20C15.579 20 19.7263 16.0143 19.9863 11H14.79L12.9346 14.248L12.79 14.5H8.20996L8.06543 14.248L6.20898 11H1.01367ZM10.5 1C5.42103 1 1.2737 4.98574 1.01367 10H6.79004L6.93457 10.252L8.79004 13.5H12.209L14.0654 10.252L14.21 10H19.9863C19.7263 4.98574 15.579 1 10.5 1Z",
  },
  "trade-launch": {
    node: "13006:146229",
    d: "M10.5 0C16.299 2.308e-07 21 4.70101 21 10.5C21 16.299 16.299 21 10.5 21C4.70101 21 2.53482e-07 16.299 0 10.5C-2.4167e-07 4.70101 4.70101 2.53482e-07 10.5 0ZM10.5 1C5.25329 1 1 5.25329 1 10.5C1 15.579 4.98574 19.7263 10 19.9863V17.667H8.89941L8.75098 17.4443L7.56641 15.667H4.66699V14.5C4.66699 13.3311 5.24935 12.3852 5.78711 11.7578C6.05918 11.4404 6.33076 11.192 6.53418 11.0225C6.58172 10.9829 6.62729 10.9482 6.66699 10.917V7.83301C6.66707 6.38267 7.20784 4.95488 7.91797 3.88965C8.27418 3.35538 8.68417 2.89495 9.11035 2.56348C9.52707 2.23949 10.0091 2.00011 10.5 2C10.991 2.00016 11.4738 2.23933 11.8906 2.56348C12.3168 2.89498 12.7269 3.35541 13.083 3.88965C13.793 4.95484 14.3339 6.38284 14.334 7.83301V10.918C14.3735 10.949 14.4186 10.9831 14.4658 11.0225C14.6692 11.192 14.9408 11.4404 15.2129 11.7578C15.7506 12.3852 16.334 13.3312 16.334 14.5V15.667H13.4346L12.25 17.4443L12.1016 17.667H11V19.9863C16.0143 19.7263 20 15.579 20 10.5C20 5.2533 15.7467 1 10.5 1ZM9.43457 16.667H11.5664L12.2324 15.667H8.76855L9.43457 16.667ZM10.5 3C10.3246 3.00012 10.0563 3.09385 9.72363 3.35254C9.39992 3.60431 9.06038 3.9788 8.75 4.44434C8.12696 5.37893 7.66707 6.61696 7.66699 7.83301V11.4346L7.44434 11.583L7.44336 11.582V11.583C7.44121 11.5845 7.43704 11.588 7.43164 11.5918C7.42031 11.5997 7.40154 11.6125 7.37793 11.6299C7.33037 11.665 7.25996 11.7191 7.1748 11.79C7.00336 11.9329 6.77454 12.1436 6.54688 12.4092C6.0847 12.9484 5.66699 13.669 5.66699 14.5V14.667H15.334V14.5C15.334 13.6692 14.9161 12.9484 14.4541 12.4092C14.2265 12.1436 13.9976 11.9329 13.8262 11.79C13.7411 11.7191 13.6707 11.6651 13.623 11.6299C13.5995 11.6125 13.5808 11.5998 13.5693 11.5918C13.5639 11.588 13.5599 11.5846 13.5576 11.583L13.5566 11.582V11.583L13.334 11.4346V7.83301C13.3339 6.61713 12.8739 5.37888 12.251 4.44434C11.9406 3.97884 11.6 3.60435 11.2764 3.35254C10.9438 3.09399 10.6754 3.00017 10.5 3ZM10.5 5.33301C10.9861 5.33314 11.4532 5.5264 11.7969 5.87012C12.1406 6.21393 12.334 6.68086 12.334 7.16699C12.3339 7.65293 12.1404 8.11917 11.7969 8.46289C11.4532 8.80661 10.9861 8.99987 10.5 9C10.014 8.99991 9.54783 8.80649 9.2041 8.46289C8.86035 8.11914 8.66708 7.65313 8.66699 7.16699C8.66699 6.68074 8.86027 6.21395 9.2041 5.87012C9.54782 5.52662 10.0141 5.33309 10.5 5.33301ZM10.5 6.33301C10.2793 6.33309 10.0673 6.42118 9.91113 6.57715C9.75484 6.73344 9.66699 6.94596 9.66699 7.16699C9.66708 7.38791 9.75491 7.59964 9.91113 7.75586C10.0673 7.91193 10.2792 7.99991 10.5 8C10.7209 7.99987 10.9337 7.91204 11.0898 7.75586C11.2458 7.59968 11.3339 7.38772 11.334 7.16699C11.334 6.94607 11.246 6.73342 11.0898 6.57715C10.9337 6.42097 10.7209 6.33314 10.5 6.33301Z",
  },
};

/** The bare glyphs the dropdown rows carried before this report. */
const SUPERSEDED_BARE_GLYPHS: SkaiIconName[] = [
  "candlesticks",
  "crosshair",
  "swap",
  "measure",
  "fast",
];

function renderPaths(name: SkaiIconName) {
  const { container } = render(<SkaiIcon name={name} size="md" />);
  return Array.from(container.querySelectorAll("path"));
}

describe("SkaiIcon trade-nav glyphs (report 3cb4cd3b)", () => {
  it.each(Object.keys(FIGMA_D))(
    "%s renders the vector Figma exported for its dropdown row",
    (name) => {
      const paths = renderPaths(name as SkaiIconName);
      expect(paths).toHaveLength(1);
      expect(paths[0].getAttribute("d")).toBe(FIGMA_D[name].d);
    },
  );

  it.each(Object.keys(FIGMA_D))("%s is ring-enclosed, not a bare glyph", (name) => {
    const d = renderPaths(name as SkaiIconName)[0].getAttribute("d") ?? "";
    expect(d.startsWith(RING_PREFIX)).toBe(true);
  });

  it.each(Object.keys(FIGMA_D))(
    "%s centres its 21px art inside the 24px viewBox",
    (name) => {
      const { container } = render(<SkaiIcon name={name as SkaiIconName} size="md" />);
      // Figma: `icons/graphical` is 24x24 and holds the 21x21 `icon` at (1.5, 1.5).
      expect(container.querySelector("g")?.getAttribute("transform")).toBe(
        "translate(1.5, 1.5)",
      );
      expect(container.querySelector("svg")?.getAttribute("viewBox")).toBe("0 0 24 24");
    },
  );

  it.each(Object.keys(FIGMA_D))("%s takes its colour from the caller", (name) => {
    // Figma paints the dropdown's glyphs #56C7F3, but that is the row's state,
    // not the glyph — a hardcoded fill here would break the hover/active colour.
    const d = renderPaths(name as SkaiIconName);
    expect(d[0].getAttribute("fill")).toBe("currentColor");
  });

  it("the five glyphs are distinct from one another", () => {
    const drawn = Object.keys(FIGMA_D).map(
      (n) => renderPaths(n as SkaiIconName)[0].getAttribute("d"),
    );
    expect(new Set(drawn).size).toBe(5);
  });

  it("the superseded bare glyphs do NOT draw the ring", () => {
    // Without this the ring assertion above would be vacuous — it proves the
    // property actually discriminates, and pins the defect the report named.
    for (const name of SUPERSEDED_BARE_GLYPHS) {
      const ds = renderPaths(name).map((p) => p.getAttribute("d") ?? "");
      expect(
        ds.some((d) => d.startsWith(RING_PREFIX)),
        `${name} unexpectedly draws the icons/graphical ring`,
      ).toBe(false);
    }
  });
});
