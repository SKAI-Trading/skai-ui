/**
 * Four more glyphs the wave 90 boards draw (HQ-604): icons/action Add, Left
 * Chevron and Information, from the Learn create header row and the Explorer
 * Holdings 375 board, and icons/graphical Reward, from the Rewards header.
 *
 * Two oracles, neither of them the constant under test:
 *  - OPENINGS: each path's opening move as the read lane's log prints it
 *    (wave80 lanes/L229/LOG-L229.md, 2026-11-23), typed here by hand;
 *  - EXPORTS: each instance's SVG export, pasted whole as the read returned it
 *    (lanes/L229/figma/<tag>-result.txt, the lines named beside each). Figma's
 *    export ends in a newline, and the length it printed counts it.
 */

import { render } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

import {
  FigmaActionAddIcon,
  FigmaActionInformationIcon,
  FigmaActionLeftChevronIcon,
  FigmaGraphicalRewardIcon,
  FigmaPlusIcon,
} from "../figma-icons";
import * as icons from "../icons";

const GLYPHS = {
  FigmaActionAddIcon,
  FigmaActionInformationIcon,
  FigmaActionLeftChevronIcon,
  FigmaGraphicalRewardIcon,
} as const;

type GlyphName = keyof typeof GLYPHS;

/** The component's box: icons/graphical Reward is the 24 one. */
const SIZE: Record<GlyphName, number> = {
  FigmaActionAddIcon: 16,
  FigmaActionInformationIcon: 16,
  FigmaActionLeftChevronIcon: 16,
  FigmaGraphicalRewardIcon: 24,
};

/** LOG-L229.md: the s1 W, s4 H and s4 G lines, and the Left Chevron block. */
const OPENINGS: Record<GlyphName, string> = {
  FigmaActionAddIcon: "M8.50098 7.5",
  FigmaActionInformationIcon: "M7.96537 11.9997",
  FigmaActionLeftChevronIcon: "M11.0605 2.35352",
  FigmaGraphicalRewardIcon: "M14.8066 19.667",
};

/** The length each result file prints before the export ("SVG whole, N chars"). */
const PRINTED: Record<GlyphName | "Information5531", number> = {
  FigmaActionAddIcon: 202,
  FigmaActionInformationIcon: 2095,
  FigmaActionLeftChevronIcon: 226,
  FigmaGraphicalRewardIcon: 1717,
  Information5531: 2104,
};

const EXPORTS: Record<GlyphName | "Information5531", string> = {
  // s4-result.txt lines 68-70 (11343:142838)
  FigmaActionAddIcon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.50098 7.5H15.001V8.5H8.5V15H7.5V8.5H1.00098V7.5H7.50098V1H8.50098V7.5Z" fill="white"/>
</svg>
`,
  // s4-result.txt lines 22-24 (12137:444246, the Explorer Holdings 375 body)
  FigmaActionInformationIcon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.96537 11.9997C8.1987 11.9997 8.39603 11.919 8.55737 11.7577C8.7187 11.5963 8.79914 11.3992 8.7987 11.1663C8.79825 10.9335 8.71781 10.7361 8.55737 10.5743C8.39692 10.4126 8.19959 10.3321 7.96537 10.333C7.73114 10.3339 7.53403 10.4146 7.37403 10.575C7.21403 10.7355 7.13337 10.9326 7.13203 11.1663C7.1307 11.4001 7.21137 11.5975 7.37403 11.7583C7.5367 11.9192 7.73381 11.9997 7.96537 11.9997ZM7.36537 9.43301H8.5987C8.5987 9.06634 8.64048 8.77746 8.72403 8.56634C8.80759 8.35523 9.04359 8.06634 9.43203 7.69968C9.72092 7.41079 9.9487 7.13568 10.1154 6.87434C10.282 6.61301 10.3654 6.29923 10.3654 5.93301C10.3654 5.31079 10.1376 4.83301 9.68203 4.49968C9.22648 4.16634 8.68759 3.99968 8.06537 3.99968C7.43203 3.99968 6.91825 4.16634 6.52403 4.49968C6.12981 4.83301 5.8547 5.23301 5.6987 5.69968L6.7987 6.13301C6.85425 5.93301 6.97936 5.71634 7.17403 5.48301C7.3687 5.24968 7.66581 5.13301 8.06537 5.13301C8.42092 5.13301 8.68759 5.23034 8.86537 5.42501C9.04314 5.61968 9.13203 5.83346 9.13203 6.06635C9.13203 6.28857 9.06537 6.49701 8.93203 6.69168C8.7987 6.88634 8.63203 7.06679 8.43203 7.23301C7.94314 7.66634 7.64314 7.99412 7.53203 8.21634C7.42092 8.43857 7.36537 8.84412 7.36537 9.43301ZM7.9987 14.6663C7.07648 14.6663 6.20981 14.4915 5.3987 14.1417C4.58759 13.7919 3.88203 13.3168 3.28203 12.7163C2.68203 12.1159 2.20714 11.4103 1.85737 10.5997C1.50759 9.78901 1.33248 8.92234 1.33203 7.99968C1.33159 7.07701 1.5067 6.21034 1.85737 5.39968C2.20803 4.58901 2.68292 3.88346 3.28203 3.28301C3.88114 2.68257 4.5867 2.20768 5.3987 1.85834C6.2107 1.50901 7.07737 1.3339 7.9987 1.33301C8.92003 1.33212 9.7867 1.50723 10.5987 1.85834C11.4107 2.20946 12.1163 2.68434 12.7154 3.28301C13.3145 3.88168 13.7896 4.58723 14.1407 5.39968C14.4918 6.21212 14.6667 7.07879 14.6654 7.99968C14.664 8.92057 14.4889 9.78723 14.14 10.5997C13.7911 11.4121 13.3163 12.1177 12.7154 12.7163C12.1145 13.315 11.4089 13.7901 10.5987 14.1417C9.78848 14.4932 8.92181 14.6681 7.9987 14.6663Z" fill="#878787"/>
</svg>
`,
  // s5-result.txt lines 36-38 (11998:341647; 341648 and 341649 printed identical)
  FigmaActionLeftChevronIcon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.0605 2.35352L5.41406 8L11.0605 13.6465L10.3535 14.3535L4 8L10.3535 1.64648L11.0605 2.35352Z" fill="#95A09F"/>
</svg>
`,
  // s1-result.txt lines 54-56 (5532:90860)
  FigmaGraphicalRewardIcon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.8066 19.667V18.123H14.0352V17.123H15.8066V20.667H7.63184V17.123H9.40332V18.123H8.63184V19.667H14.8066ZM19.4385 8.85938V6.5918H16.3506V5H7.08789V6.5918H4V8.85938C4 10.8085 5.45824 12.4092 7.33789 12.667C7.60728 13.4564 8.08445 14.1588 8.71973 14.6992C9.35502 15.2397 10.1249 15.5979 10.9473 15.7373V16.5791L10.9395 16.7314C10.9044 17.0849 10.7485 17.4175 10.4951 17.6709L10.3818 17.7734C10.1463 17.9664 9.85868 18.0852 9.55566 18.1152L9.40332 18.123V17.123C9.54748 17.123 9.68611 17.0658 9.78809 16.9639C9.89004 16.8619 9.94723 16.7233 9.94727 16.5791V16.5127C9.26321 16.2855 8.62535 15.9314 8.07227 15.4609C7.45094 14.9324 6.95648 14.2749 6.61523 13.5391C4.54364 12.9896 3 11.1145 3 8.85938V5.5918H6.08789V4H17.3506V5.5918H20.4385V8.85938C20.4385 11.1146 18.8949 12.9896 16.8232 13.5391C16.482 14.2749 15.9875 14.9324 15.3662 15.4609C14.8131 15.9314 14.1753 16.2855 13.4912 16.5127V16.5791C13.4913 16.7233 13.5484 16.8619 13.6504 16.9639C13.7524 17.0658 13.891 17.123 14.0352 17.123V18.123L13.8828 18.1152C13.5798 18.0852 13.2922 17.9664 13.0566 17.7734L12.9434 17.6709C12.69 17.4175 12.5341 17.0849 12.499 16.7314L12.4912 16.5791V15.7373C13.2107 15.6154 13.8895 15.3252 14.4736 14.8926L14.7188 14.6992C15.354 14.1588 15.8312 13.4563 16.1006 12.667C17.9802 12.4092 19.4385 10.8085 19.4385 8.85938ZM7.08789 8.13574V11.043C6.63644 10.8834 6.24523 10.5872 5.96875 10.1963C5.69236 9.80538 5.54401 9.33813 5.54395 8.85938V8.13574H7.08789ZM17.8945 8.85938C17.8935 9.33808 17.7451 9.8054 17.4688 10.1963L17.3594 10.3379C17.0934 10.6586 16.7451 10.9024 16.3506 11.043V8.13574H17.8945V8.85938Z" fill="white"/>
</svg>
`,
  // s4-result.txt lines 62-64 (5531:77729, the Rewards leaderboard head)
  Information5531: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.96927 12.0007C8.2026 12.0007 8.39994 11.92 8.56127 11.7587C8.72261 11.5973 8.80305 11.4002 8.8026 11.1673C8.80216 10.9344 8.72172 10.7371 8.56127 10.5753C8.40083 10.4135 8.20349 10.3331 7.96927 10.334C7.73505 10.3349 7.53794 10.4155 7.37794 10.576C7.21794 10.7364 7.13727 10.9335 7.13594 11.1673C7.1346 11.4011 7.21527 11.5984 7.37794 11.7593C7.5406 11.9202 7.73772 12.0007 7.96927 12.0007ZM7.36927 9.43399H8.6026C8.6026 9.06732 8.64438 8.77843 8.72794 8.56732C8.81149 8.35621 9.04749 8.06732 9.43594 7.70065C9.72483 7.41177 9.95261 7.13665 10.1193 6.87532C10.2859 6.61399 10.3693 6.30021 10.3693 5.93399C10.3693 5.31177 10.1415 4.83399 9.68594 4.50065C9.23038 4.16732 8.69149 4.00065 8.06927 4.00065C7.43594 4.00065 6.92216 4.16732 6.52794 4.50065C6.13372 4.83399 5.85861 5.23399 5.70261 5.70065L6.8026 6.13399C6.85816 5.93399 6.98327 5.71732 7.17794 5.48399C7.3726 5.25065 7.66972 5.13399 8.06927 5.13399C8.42483 5.13399 8.69149 5.23132 8.86927 5.42599C9.04705 5.62065 9.13594 5.83443 9.13594 6.06732C9.13594 6.28954 9.06927 6.49799 8.93594 6.69265C8.8026 6.88732 8.63594 7.06777 8.43594 7.23399C7.94705 7.66732 7.64705 7.9951 7.53594 8.21732C7.42483 8.43954 7.36927 8.8451 7.36927 9.43399ZM8.0026 14.6673C7.08038 14.6673 6.21372 14.4924 5.40261 14.1427C4.59149 13.7929 3.88594 13.3178 3.28594 12.7173C2.68594 12.1169 2.21105 11.4113 1.86127 10.6007C1.51149 9.78999 1.33638 8.92332 1.33594 8.00065C1.33549 7.07799 1.51061 6.21132 1.86127 5.40065C2.21194 4.58999 2.68683 3.88443 3.28594 3.28399C3.88505 2.68354 4.59061 2.20865 5.40261 1.85932C6.21461 1.50999 7.08127 1.33488 8.0026 1.33399C8.92394 1.3331 9.7906 1.50821 10.6026 1.85932C11.4146 2.21043 12.1202 2.68532 12.7193 3.28399C13.3184 3.88265 13.7935 4.58821 14.1446 5.40065C14.4957 6.2131 14.6706 7.07977 14.6693 8.00065C14.6679 8.92154 14.4928 9.78821 14.1439 10.6007C13.7951 11.4131 13.3202 12.1187 12.7193 12.7173C12.1184 13.316 11.4128 13.7911 10.6026 14.1427C9.79238 14.4942 8.92572 14.6691 8.0026 14.6673Z" fill="#95A09F"/>
</svg>
`,
};

/** "M x y" from the start of a path's d. */
function opening(d: string | null): string {
  const m = /^M\s*(-?[\d.]+)[\s,]+(-?[\d.]+)/.exec(d ?? "");
  return m ? `M${m[1]} ${m[2]}` : "";
}

function exportPaths(svg: string) {
  return Array.from(svg.matchAll(/<path ([^>]*?)\/>/g)).map(([, attrs]) => {
    const a = Object.fromEntries(Array.from(attrs.matchAll(/([\w-]+)="([^"]*)"/g)).map((m) => [m[1], m[2]]));
    return { d: a.d, paint: "fill" in a ? "fill" : "stroke" };
  });
}

function renderOne(node: React.ReactElement) {
  const { container } = render(node);
  const svgs = container.querySelectorAll("svg");
  expect(svgs).toHaveLength(1);
  return svgs[0];
}

/** A path as its command letters, each with its numbers. Absolute only. */
function commands(d: string) {
  return Array.from(d.matchAll(/([A-Za-z])([^A-Za-z]*)/g)).map(([, c, args]) => {
    expect(c).toBe(c.toUpperCase());
    return { c, n: (args.match(/-?(?:\d+\.?\d*|\.\d+)/g) ?? []).map(Number) };
  });
}

/** The largest gap between two paths' coordinates once `b` is moved by (dx, dy). */
function largestGap(a: string, b: string, dx: number, dy: number) {
  const ca = commands(a);
  const cb = commands(b);
  expect(cb.map((x) => x.c)).toEqual(ca.map((x) => x.c));
  let gap = 0;
  ca.forEach(({ c, n }, i) => {
    expect(cb[i].n).toHaveLength(n.length);
    n.forEach((v, k) => {
      const onX = c === "H" || (c !== "V" && k % 2 === 0);
      gap = Math.max(gap, Math.abs(v - (cb[i].n[k] + (onX ? dx : dy))));
    });
  });
  return gap;
}

describe.each(Object.keys(GLYPHS) as GlyphName[])("%s", (name) => {
  const Icon = GLYPHS[name];
  const size = SIZE[name];

  it("renders one svg on the component's box, aria-hidden, painted in currentColor", () => {
    const svg = renderOne(<Icon />);
    expect(svg.getAttribute("viewBox")).toBe(`0 0 ${size} ${size}`);
    expect(svg.getAttribute("aria-hidden")).toBe("true");
    expect(svg.getAttribute("fill")).toBe("none");
    const paths = Array.from(svg.querySelectorAll("path"));
    expect(paths).toHaveLength(1);
    const paints = ["fill", "stroke"].map((k) => paths[0].getAttribute(k)).filter((v) => v !== null);
    expect(paints).toEqual(["currentColor"]);
  });

  it("opens its path where the read's log says it opens", () => {
    const svg = renderOne(<Icon />);
    expect(opening(svg.querySelector("path")?.getAttribute("d") ?? null)).toBe(OPENINGS[name]);
  });

  it("draws the export's path byte for byte, with the export's kind of paint, on the export's box", () => {
    expect(EXPORTS[name].length).toBe(PRINTED[name]);
    expect(EXPORTS[name]).toContain(`viewBox="0 0 ${size} ${size}"`);
    const svg = renderOne(<Icon />);
    const drawn = Array.from(svg.querySelectorAll("path")).map((p) => ({
      d: p.getAttribute("d"),
      paint: p.hasAttribute("fill") ? "fill" : "stroke",
    }));
    expect(drawn).toEqual(exportPaths(EXPORTS[name]));
  });

  it("lets the caller's props win, and is reachable through the icons barrel", () => {
    const svg = renderOne(<Icon className="size-4 text-ash" viewBox="0 0 32 32" />);
    expect(svg.getAttribute("class")).toBe("size-4 text-ash");
    expect(svg.getAttribute("viewBox")).toBe("0 0 32 32");
    expect((icons as unknown as Record<string, unknown>)[name]).toBe(Icon);
  });
});

describe("the glyphs beside existing drawings", () => {
  const d = (node: React.ReactElement) => renderOne(node).querySelector("path")?.getAttribute("d") ?? "";

  it("Information: the Rewards head's instance (5531:77729) exports the same component, within 0.005", () => {
    expect(EXPORTS.Information5531.length).toBe(PRINTED.Information5531);
    const [rewardsHead] = exportPaths(EXPORTS.Information5531);
    expect(rewardsHead.d).not.toBe(d(<FigmaActionInformationIcon />));
    expect(largestGap(d(<FigmaActionInformationIcon />), rewardsHead.d, 0, 0)).toBeLessThan(0.005);
  });

  it("Add: FigmaPlusIcon is the same cross on its own 14 box, moved by (1.00098, 1) to within 0.0001", () => {
    const plus = renderOne(<FigmaPlusIcon />);
    expect(plus.getAttribute("viewBox")).toBe("0 0 14 14");
    const plusD = plus.querySelector("path")?.getAttribute("d") ?? "";
    expect(largestGap(d(<FigmaActionAddIcon />), plusD, 1.00098, 1)).toBeLessThan(0.0001);
  });
});
